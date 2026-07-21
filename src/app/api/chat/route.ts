import { NextRequest, after } from "next/server";

import { buildSystemPrompt } from "@/lib/ai/persona";
import { fallbackAnswer } from "@/lib/ai/fallback";
import {
  hasApiKey,
  hasGroqKey,
  streamChat,
  streamChatGroq,
  type ChatMessage,
  type ChatRole,
} from "@/lib/ai/provider";
import { postToSlack, deviceInfo, referrerLabel } from "@/lib/notify";
import { site } from "@/config/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGES = 20;
const MAX_CHARS = 2000;

/** Turn a plain string into a one-shot text/plain stream. */
function textStream(text: string): Response {
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(text));
      controller.close();
    },
  });
  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

type ChatMeta = {
  priorTurns: number;
  country?: string;
  city?: string;
  region?: string;
  referrer?: string;
  device: string;
  browser: string;
  timezone?: string;
  session?: string;
};

/** "≈ Chennai, TN, IN" — IP geo maps the ISP's routing hub, not the visitor's
 *  real town, so it's marked approximate. "unknown location" off-Vercel. */
function locationLabel({ city, region, country }: ChatMeta): string {
  const parts = [city, region, country].filter(Boolean);
  return parts.length ? `≈ ${parts.join(", ")} (approx)` : "unknown location";
}

/**
 * Build + send the Slack notification for a chat turn. Includes the visitor's
 * question, the AI's answer, and best-effort context (rough geo, referrer,
 * device/browser, timezone, session tag). Context only — never personal identity.
 */
async function notifyChat(question: string, answer: string, meta: ChatMeta) {
  const session = meta.session ? ` · 🧵 \`${meta.session}\`` : "";
  const followUp =
    meta.priorTurns > 0 ? ` _(follow-up · ${meta.priorTurns} earlier)_` : "";
  const tz = meta.timezone ? ` · 🕐 ${meta.timezone}` : "";
  const reply = answer.trim() || "_(no answer captured)_";

  await postToSlack(
    `💬 *New chat on your portfolio*${session}${followUp}\n` +
      `*Q:* ${question.slice(0, 800)}\n` +
      `*A:* ${reply.slice(0, 1500)}\n` +
      `📍 ${locationLabel(meta)}  ·  🔗 from ${referrerLabel(meta.referrer)}  ·  ` +
      `💻 ${meta.device} / ${meta.browser}${tz}`
  );
}

function buildMeta(req: NextRequest, priorTurns: number): ChatMeta {
  const geoCity = req.headers.get("x-vercel-ip-city");
  const { device, browser } = deviceInfo(req.headers.get("user-agent"));
  return {
    priorTurns,
    country: req.headers.get("x-vercel-ip-country") ?? undefined,
    city: geoCity ? decodeURIComponent(geoCity) : undefined,
    region: req.headers.get("x-vercel-ip-country-region") ?? undefined,
    // These three are sent by the client — the API's own headers can't reveal them.
    referrer: req.headers.get("x-visitor-referrer") ?? undefined,
    timezone: req.headers.get("x-visitor-tz") ?? undefined,
    session: req.headers.get("x-visitor-session") ?? undefined,
    device,
    browser,
  };
}

function isValidMessage(m: unknown): m is ChatMessage {
  if (!m || typeof m !== "object") return false;
  const { role, content } = m as { role?: unknown; content?: unknown };
  return (
    (role === "user" || role === "assistant") &&
    typeof content === "string" &&
    content.length > 0
  );
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  const rawMessages = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(rawMessages) || !rawMessages.every(isValidMessage)) {
    return new Response("`messages` must be a non-empty array of chat turns", {
      status: 400,
    });
  }

  // Sanitise + bound the conversation.
  const messages: ChatMessage[] = rawMessages
    .slice(-MAX_MESSAGES)
    .map((m) => ({
      role: m.role as ChatRole,
      content: m.content.slice(0, MAX_CHARS),
    }));

  const lastUserMessage =
    [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

  const meta = buildMeta(
    req,
    messages.filter((m) => m.role === "user").length - 1
  );

  // No key configured → answer from the offline knowledge base.
  if (!hasApiKey()) {
    const answer = fallbackAnswer(lastUserMessage);
    if (lastUserMessage) {
      after(() => notifyChat(lastUserMessage, answer, meta));
    }
    return textStream(answer);
  }

  const system = buildSystemPrompt();

  // The full answer is accumulated as we stream, then sent to Slack afterwards.
  let fullAnswer = "";

  // Resilience chain: Gemini → Groq (if configured) → hardcoded answers.
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      let closed = false;
      let sentAnything = false;

      // Enqueue + accumulate, tolerating a client that disconnected mid-stream.
      const send = (text: string) => {
        if (closed) return;
        sentAnything = true;
        fullAnswer += text;
        try {
          controller.enqueue(encoder.encode(text));
        } catch {
          closed = true; // client hung up — stop pushing, but keep the answer.
        }
      };

      const pipe = async (gen: AsyncGenerator<string>) => {
        for await (const chunk of gen) send(chunk);
      };

      try {
        await pipe(streamChat(system, messages));
      } catch (err) {
        console.error("[api/chat] gemini failed:", err);
        if (sentAnything) {
          // Mid-stream drop — don't switch voices, just close politely.
          send(`\n\n(connection dropped — email ${site.email} for more)`);
        } else {
          // Tier 2: Groq, if a key is configured.
          if (hasGroqKey()) {
            try {
              await pipe(streamChatGroq(system, messages));
            } catch (err2) {
              console.error("[api/chat] groq failed:", err2);
            }
          }
          // Tier 3: offline keyword answers.
          if (!sentAnything) send(fallbackAnswer(lastUserMessage));
        }
      } finally {
        closed = true;
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      }
    },
  });

  // Fires after the response finishes streaming, so `fullAnswer` is complete.
  if (lastUserMessage) {
    after(() => notifyChat(lastUserMessage, fullAnswer, meta));
  }

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

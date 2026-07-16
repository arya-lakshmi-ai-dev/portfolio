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
};

/** "Chennai, TN, IN" — or "unknown location" if Vercel geo isn't present (e.g. localhost). */
function locationLabel({ city, region, country }: ChatMeta): string {
  const parts = [city, region, country].filter(Boolean);
  return parts.length ? parts.join(", ") : "unknown location";
}

/** "linkedin.com" / "google.com" — or "direct / unknown" if there's no referrer. */
function referrerLabel(referrer?: string): string {
  if (!referrer) return "direct / unknown";
  try {
    return new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return "unknown";
  }
}

/**
 * Fire a Slack notification for a new visitor question. Runs via `after()` so
 * it never blocks or slows the chat reply. No-ops if SLACK_WEBHOOK_URL is unset.
 * The Slack channel doubles as the owner's chat-history log. Includes rough geo
 * (Vercel IP headers) + arrival referrer — context only, never personal identity.
 */
async function notifySlack(question: string, meta: ChatMeta) {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) return;
  const followUp =
    meta.priorTurns > 0 ? ` _(follow-up · ${meta.priorTurns} earlier msgs)_` : "";
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text:
          `💬 *New chat on your portfolio*${followUp}\n` +
          `> ${question.slice(0, 800)}\n` +
          `📍 ${locationLabel(meta)}  ·  🔗 from ${referrerLabel(meta.referrer)}`,
      }),
    });
  } catch (err) {
    console.error("[api/chat] slack notify failed:", err);
  }
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

  // Notify Slack of the new question (non-blocking; the channel is the history log).
  if (lastUserMessage) {
    const geoCity = req.headers.get("x-vercel-ip-city");
    const meta: ChatMeta = {
      priorTurns: messages.filter((m) => m.role === "user").length - 1,
      country: req.headers.get("x-vercel-ip-country") ?? undefined,
      city: geoCity ? decodeURIComponent(geoCity) : undefined,
      region: req.headers.get("x-vercel-ip-country-region") ?? undefined,
      // Sent by the client (document.referrer) — the API's own referer is just this page.
      referrer: req.headers.get("x-visitor-referrer") ?? undefined,
    };
    after(() => notifySlack(lastUserMessage, meta));
  }

  // No key configured → answer from the offline knowledge base.
  if (!hasApiKey()) {
    return textStream(fallbackAnswer(lastUserMessage));
  }

  const system = buildSystemPrompt();

  // Resilience chain: Gemini → Groq (if configured) → hardcoded answers.
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      let sentAnything = false;

      const pipe = async (gen: AsyncGenerator<string>) => {
        for await (const chunk of gen) {
          sentAnything = true;
          controller.enqueue(encoder.encode(chunk));
        }
      };

      try {
        await pipe(streamChat(system, messages));
      } catch (err) {
        console.error("[api/chat] gemini failed:", err);
        if (sentAnything) {
          // Mid-stream drop — don't switch voices, just close politely.
          controller.enqueue(
            encoder.encode(`\n\n(connection dropped — email ${site.email} for more)`)
          );
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
          if (!sentAnything) {
            controller.enqueue(encoder.encode(fallbackAnswer(lastUserMessage)));
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

import { NextRequest } from "next/server";

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

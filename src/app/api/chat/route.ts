import { NextRequest } from "next/server";

import { buildSystemPrompt } from "@/lib/ai/persona";
import { fallbackAnswer } from "@/lib/ai/fallback";
import {
  hasApiKey,
  streamChat,
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

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      let sentAnything = false;
      try {
        for await (const chunk of streamChat(system, messages)) {
          sentAnything = true;
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (err) {
        // Quota exhausted / provider outage → fall back to offline answers so
        // the assistant keeps working until the key is refreshed.
        console.error("[api/chat] stream error, using fallback:", err);
        if (!sentAnything) {
          controller.enqueue(encoder.encode(fallbackAnswer(lastUserMessage)));
        } else {
          controller.enqueue(
            encoder.encode(`\n\n(connection dropped — email ${site.email} for more)`)
          );
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

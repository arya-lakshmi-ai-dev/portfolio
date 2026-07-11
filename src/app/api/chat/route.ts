import { NextRequest } from "next/server";

import { buildSystemPrompt } from "@/lib/ai/persona";
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

  // Graceful local/dev experience: render the widget without a key.
  if (!hasApiKey()) {
    return textStream(
      `👋 Hi! I'm ${site.shortName}'s AI assistant. I'm not connected to a model yet — ` +
        `add a free GEMINI_API_KEY (aistudio.google.com/apikey) to .env.local and restart. ` +
        `Once connected, ask me anything about ${site.shortName}'s skills, projects, or experience!`
    );
  }

  const system = buildSystemPrompt();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of streamChat(system, messages)) {
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (err) {
        console.error("[api/chat] stream error:", err);
        controller.enqueue(
          encoder.encode(
            "\n\n⚠️ Sorry — I hit an error reaching the model. Please try again in a moment, " +
              `or email ${site.email}.`
          )
        );
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

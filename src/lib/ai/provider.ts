/**
 * Provider abstraction for the chat agent.
 *
 * Future-proofing note: specific model IDs get deprecated (e.g. gemini-2.0-flash
 * retired in 2026), so the provider is isolated HERE behind one function. To
 * switch model or vendor, change `MODEL` / `streamChat` only — nothing else in
 * the app touches the LLM. Default: Google Gemini (free tier, no credit card).
 *   Get a key: https://aistudio.google.com/apikey  → set GEMINI_API_KEY
 */

export type ChatRole = "user" | "assistant";
export type ChatMessage = { role: ChatRole; content: string };

/** Override via env to bump models without a code change. */
const MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

export class MissingApiKeyError extends Error {
  constructor() {
    super("GEMINI_API_KEY is not configured");
    this.name = "MissingApiKeyError";
  }
}

export function hasApiKey(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

/**
 * Streams the model's reply as plain-text chunks (an async iterable of strings).
 * Uses Gemini's SSE endpoint directly via fetch — zero SDK dependencies.
 */
export async function* streamChat(
  system: string,
  messages: ChatMessage[]
): AsyncGenerator<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new MissingApiKeyError();

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const res = await fetch(
    `${API_BASE}/${MODEL}:streamGenerateContent?alt=sse&key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents,
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 800,
        },
      }),
    }
  );

  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => "");
    throw new Error(`LLM request failed (${res.status}): ${detail.slice(0, 300)}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // SSE frames are separated by blank lines; each data line is JSON.
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const json = trimmed.slice(5).trim();
      if (!json || json === "[DONE]") continue;
      try {
        const parsed = JSON.parse(json);
        const text: string | undefined =
          parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) yield text;
      } catch {
        // Partial JSON across chunks — safe to skip; next read completes it.
      }
    }
  }
}

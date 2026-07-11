"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp, Bot, Loader2, X } from "lucide-react";

import { site } from "@/config/site";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What's Arya's experience with RAG?",
  "Tell me about the Quick AI project.",
  "What's her current role?",
  "Which AI agent frameworks has she used?",
];

const GREETING: Msg = {
  role: "assistant",
  content: `Hi! I'm ${site.shortName}'s AI assistant — ask me anything about her skills, projects, or experience.`,
};

export function AskAI() {
  const reduce = useReducedMotion();
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Msg[]>([GREETING]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const sendRef = React.useRef<(t: string) => void>(() => {});

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, loading]);

  // Open triggers:
  //  • any element with [data-open-ai] opens the panel
  //  • the "askai:ask" window event opens the panel and (optionally) asks a question
  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("[data-open-ai]")) {
        e.preventDefault();
        setOpen(true);
      }
    };
    const onAsk = (e: Event) => {
      const question = (e as CustomEvent).detail?.question as string | undefined;
      setOpen(true);
      if (question) setTimeout(() => sendRef.current(question), 120);
    };
    document.addEventListener("click", onClick);
    window.addEventListener("askai:ask", onAsk as EventListener);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("askai:ask", onAsk as EventListener);
    };
  }, []);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);

    // Placeholder assistant message we stream into.
    setMessages((m) => [...m, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send the real turns only (skip the local greeting).
        body: JSON.stringify({
          messages: next.filter((_, i) => i !== 0),
        }),
      });

      if (!res.body) throw new Error("No response stream");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: "assistant",
          content: `Sorry — something went wrong. You can email ${site.email} directly.`,
        };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  }
  sendRef.current = send;

  return (
    <>
      {/* Launcher — chatbot logo */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
        initial={false}
        whileHover={{ scale: reduce ? 1 : 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-5 right-5 z-50 grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="size-6" />
            </motion.span>
          ) : (
            <motion.span
              key="bot"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Bot className="size-7" />
            </motion.span>
          )}
        </AnimatePresence>
        {/* online dot */}
        {!open ? (
          <span className="absolute right-1 top-1 size-3 rounded-full border-2 border-primary bg-emerald-400" />
        ) : null}
      </motion.button>

      {/* Panel — friendly chatbot */}
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-[5.5rem] right-5 z-50 flex h-[min(34rem,72vh)] w-[min(24rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          >
            {/* header */}
            <div className="flex items-center gap-3 border-b border-border bg-secondary/40 px-4 py-3.5">
              <span className="relative grid size-10 place-items-center rounded-full bg-primary text-primary-foreground">
                <Bot className="size-5" />
                <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-card bg-emerald-400" />
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-semibold leading-tight">
                  {site.shortName}&apos;s AI
                </span>
                <span className="text-xs text-muted-foreground">
                  Online · knows her real profile
                </span>
              </div>
            </div>

            {/* messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex",
                    m.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                      m.role === "user"
                        ? "rounded-br-md bg-primary text-primary-foreground"
                        : "rounded-bl-md bg-secondary text-secondary-foreground"
                    )}
                  >
                    {m.content ||
                      (loading && i === messages.length - 1 ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        ""
                      ))}
                  </div>
                </div>
              ))}

              {/* suggestion chips before the first user turn */}
              {messages.length === 1 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-foreground"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            {/* composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="border-t border-border p-3"
            >
              <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 transition-colors focus-within:border-primary/60">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Ask about ${site.shortName}…`}
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  aria-label="Send"
                  className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
                >
                  {loading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <ArrowUp className="size-4" />
                  )}
                </button>
              </div>
              <p className="mt-2 text-center text-[11px] text-muted-foreground">
                AI can make mistakes — verify important details.
              </p>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

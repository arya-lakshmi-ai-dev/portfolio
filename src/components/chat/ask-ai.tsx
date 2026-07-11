"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Loader2, X } from "lucide-react";

import { site } from "@/config/site";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What's Arya's experience with RAG?",
  "Tell me about the Quick AI project.",
  "What's her current role?",
  "Which AI agent frameworks has she used?",
];

const GREETING: Msg = {
  role: "assistant",
  content: `session started — ask me anything about ${site.shortName}'s skills, projects, or experience.`,
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
          content: `error — something went wrong. email ${site.email} instead.`,
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
      {/* Launcher — mini terminal chip */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
        initial={false}
        whileHover={{ scale: reduce ? 1 : 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-5 right-5 z-50 inline-flex h-12 items-center gap-2 rounded-lg border border-white/15 bg-[#161016] px-4 font-mono text-sm text-[#E08FBC] shadow-lg shadow-black/30"
      >
        {open ? (
          <X className="size-4" />
        ) : (
          <>
            <span>❯</span>
            <span className="inline-block h-[14px] w-[7px] animate-pulse bg-[#E08FBC]" />
          </>
        )}
      </motion.button>

      {/* Panel — full terminal session */}
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-20 right-5 z-50 flex h-[min(34rem,72vh)] w-[min(26rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-xl border border-black/30 bg-[#161016] font-mono text-[13px] shadow-2xl shadow-black/40 dark:border-white/15"
          >
            {/* title bar */}
            <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-3">
              <span className="size-2.5 rounded-full bg-[#FF5F57]" />
              <span className="size-2.5 rounded-full bg-[#FEBC2E]" />
              <span className="size-2.5 rounded-full bg-[#28C840]" />
              <span className="ml-2 flex-1 text-center text-[11px] tracking-[0.18em] text-white/35">
                arya@portfolio — ai · full session
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-emerald-400/90">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/60" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
                </span>
                live
              </span>
            </div>

            {/* session log */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto px-5 py-4 leading-relaxed"
            >
              {messages.map((m, i) =>
                m.role === "user" ? (
                  <p key={i}>
                    <span className="text-[#E08FBC]">❯</span>{" "}
                    <span className="text-white/45">ask</span>{" "}
                    <span className="text-[#F3D9E6]">&quot;{m.content}&quot;</span>
                  </p>
                ) : (
                  <p key={i} className="whitespace-pre-wrap text-white/80">
                    {i === 0 ? (
                      <span className="text-white/40"># {m.content}</span>
                    ) : (
                      <>
                        {m.content}
                        {loading && i === messages.length - 1 ? (
                          <span className="ml-1 inline-block h-[15px] w-[8px] translate-y-[2px] animate-pulse bg-[#E08FBC]" />
                        ) : null}
                      </>
                    )}
                  </p>
                )
              )}

              {/* suggestions before the first user turn */}
              {messages.length === 1 ? (
                <div className="flex flex-col gap-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="w-fit text-left text-white/50 transition-colors hover:text-[#E08FBC]"
                    >
                      <span className="text-[#E08FBC]/70">$</span> {s}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            {/* prompt input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="border-t border-white/10 px-4 py-3"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-[#E08FBC]">❯</span>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`ask "anything about ${site.shortName}…"`}
                  className="flex-1 bg-transparent text-white/90 outline-none placeholder:text-white/30"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  aria-label="Send"
                  className="text-white/40 transition-colors hover:text-[#E08FBC] disabled:opacity-40"
                >
                  {loading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <span className="text-[11px] tracking-[0.14em]">⏎ run</span>
                  )}
                </button>
              </div>
              <p className="mt-2 text-center text-[10px] tracking-[0.08em] text-white/25">
                # ai can make mistakes — verify important details
              </p>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

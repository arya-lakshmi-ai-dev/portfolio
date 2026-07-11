"use client";

import * as React from "react";
import { ArrowRight, Download, Loader2 } from "lucide-react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

import { site } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/effects/magnetic";
import { SocialLinks } from "@/components/social-links";

const SUGGESTIONS = [
  "What's Arya's experience with RAG?",
  "What has she built with AI agents?",
  "What's her current role?",
];

// Auto-play demo so the AI feels alive on landing (accurate to the profile).
const DEMO: { q: string; a: string }[] = [
  {
    q: "What can Arya do?",
    a: "She builds end-to-end GenAI — LLM pipelines, multi-agent workflows, and production RAG — full-stack, from FastAPI to React.",
  },
  {
    q: "Tell me about her RAG work.",
    a: "She built AI Knowledge Copilot: a production RAG system with semantic search, reranking, and citation-based answers.",
  },
  {
    q: "What's her current role?",
    a: "AI Engineer Intern at Just Move In — shipping agent workflows for a production AI assistant.",
  },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function Hero() {
  const reduce = useReducedMotion();
  const [value, setValue] = React.useState("");
  const [userMode, setUserMode] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // Displayed message (demo OR the user's real turn).
  const [q, setQ] = React.useState(DEMO[0].q);
  const [a, setA] = React.useState("");
  const [typing, setTyping] = React.useState(true);

  // 3D tilt toward the cursor.
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, { stiffness: 150, damping: 18 });
  const rotateY = useSpring(tiltY, { stiffness: 150, damping: 18 });
  function onTilt(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    tiltY.set(px * 6);
    tiltX.set(-py * 6);
  }
  function resetTilt() {
    tiltX.set(0);
    tiltY.set(0);
  }

  // Auto-play the demo until the visitor takes over.
  React.useEffect(() => {
    if (userMode || reduce) return;
    let cancelled = false;
    (async () => {
      while (!cancelled) {
        for (const ex of DEMO) {
          if (cancelled) return;
          setTyping(true);
          setQ(ex.q);
          setA("");
          await sleep(650);
          const words = ex.a.split(" ");
          for (let i = 0; i < words.length; i++) {
            if (cancelled) return;
            setA(words.slice(0, i + 1).join(" "));
            await sleep(48);
          }
          setTyping(false);
          await sleep(2600);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userMode, reduce]);

  async function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed || loading) return;
    setUserMode(true);
    setLoading(true);
    setTyping(false);
    setQ(trimmed);
    setA("");
    setValue("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: trimmed }] }),
      });
      if (!res.body) throw new Error("no stream");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value: chunk } = await reader.read();
        if (done) break;
        acc += decoder.decode(chunk, { stream: true });
        setA(acc);
      }
    } catch {
      setA(`Something went wrong — you can email ${site.email} directly.`);
    } finally {
      setLoading(false);
    }
  }

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
  });

  return (
    <section id="top" className="relative overflow-hidden" aria-label="Introduction">
      {/* Living background */}
      <div className="pointer-events-none absolute inset-0 hero-glow" />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-[8%] h-[380px] w-[380px] rounded-full blur-[120px]"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary)/0.22), transparent 65%)",
          animation: "soft-pulse 6s ease-in-out infinite",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-8%] bottom-[10%] h-[320px] w-[320px] rounded-full blur-[120px]"
        style={{
          background: "radial-gradient(circle, hsl(280 60% 55% / 0.14), transparent 65%)",
          animation: "soft-pulse 7.5s ease-in-out infinite 1s",
        }}
      />

      <div className="container relative flex min-h-[100svh] flex-col justify-center py-28">
        <motion.div
          {...rise(0)}
          className="mb-10 flex items-center border-b border-foreground/15 pb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground"
        >
          <span className="inline-flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-primary" />
            {site.name}
          </span>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
          {/* Left — statement */}
          <div className="flex flex-col">
            <motion.div {...rise(0.06)} className="mb-6 inline-flex items-center gap-2.5">
              <span className="h-px w-8 bg-primary" />
              <span className="font-mono text-xs font-medium uppercase tracking-[0.28em] text-primary">
                AI Engineer &amp; Full-Stack Developer
              </span>
            </motion.div>

            <motion.h1
              {...rise(0.12)}
              className="font-display font-light leading-[0.96] tracking-tight"
              style={{ fontSize: "clamp(2.75rem, 6.5vw, 5.25rem)" }}
            >
              I build{" "}
              <span className="italic text-primary">intelligent</span> products,
              end to end.
            </motion.h1>

            <motion.p
              {...rise(0.2)}
              className="mt-7 max-w-lg text-lg leading-relaxed text-muted-foreground"
            >
              I&apos;m {site.shortName} — I design and ship Generative AI systems:
              LLM pipelines, agent workflows, and RAG products.
            </motion.p>

            <motion.div
              {...rise(0.28)}
              className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4"
            >
              <Magnetic>
                <Button asChild size="lg">
                  <a href="#projects">
                    View work <ArrowRight className="size-4" />
                  </a>
                </Button>
              </Magnetic>
              {site.hero.resumeUrl ? (
                <a
                  href={site.hero.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary"
                >
                  <Download className="size-4" /> Résumé
                </a>
              ) : null}
              <SocialLinks className="-ml-2" />
            </motion.div>
          </div>

          {/* Right — live, self-demoing AI panel */}
          <motion.div
            {...rise(0.36)}
            className="relative"
            style={{ perspective: 1200 }}
          >
            {/* Purpose copy — why the AI is here */}
            <div className="mb-5 flex flex-col gap-1.5">
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
                In a hurry? Skip the scroll ↴
              </span>
              <p className="text-sm text-muted-foreground">
                Recruiter, client, or just curious —{" "}
                <span className="text-foreground">ask my AI anything</span>. It
                knows my skills, projects &amp; experience and answers instantly.
              </p>
            </div>

            {/* aurora backdrop */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-4 -z-10 rounded-[32px] opacity-70 blur-3xl"
              style={{
                background:
                  "radial-gradient(55% 55% at 25% 20%, hsl(var(--primary)/0.35), transparent 60%), radial-gradient(50% 50% at 85% 85%, hsl(280 60% 55%/0.22), transparent 60%)",
                animation: "soft-pulse 6s ease-in-out infinite",
              }}
            />

            {/* Terminal window — the AI as a live shell session */}
            <motion.div
              onMouseMove={onTilt}
              onMouseLeave={resetTilt}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="relative overflow-hidden rounded-xl border border-black/30 bg-[#161016] font-mono text-[13px] shadow-[0_40px_90px_-48px_rgba(30,12,22,0.85)] dark:border-white/15 dark:shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)] sm:text-sm"
            >
              {/* title bar */}
              <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-3">
                <span className="size-2.5 rounded-full bg-[#FF5F57]" />
                <span className="size-2.5 rounded-full bg-[#FEBC2E]" />
                <span className="size-2.5 rounded-full bg-[#28C840]" />
                <span className="ml-2 flex-1 text-center text-[11px] tracking-[0.18em] text-white/35">
                  arya@portfolio — ai
                </span>
                <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-emerald-400/90">
                  <span className="relative flex size-1.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/60" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
                  </span>
                  {userMode ? "live" : "auto"}
                </span>
              </div>

              {/* session */}
              <div className="flex min-h-[196px] flex-col gap-3 px-5 py-5 leading-relaxed">
                <motion.p
                  key={q}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  <span className="text-[#E08FBC]">❯</span>{" "}
                  <span className="text-white/45">ask</span>{" "}
                  <span className="text-[#F3D9E6]">&quot;{q}&quot;</span>
                </motion.p>

                <div className="whitespace-pre-wrap text-white/80">
                  {a}
                  {loading && !a ? (
                    <span className="text-white/40">thinking…</span>
                  ) : null}
                  {(typing || loading) && (
                    <span className="ml-1 inline-block h-[15px] w-[8px] translate-y-[2px] animate-pulse bg-[#E08FBC]" />
                  )}
                </div>

                {userMode && a && !loading ? (
                  <button
                    type="button"
                    data-open-ai
                    className="w-fit text-[11px] tracking-[0.14em] text-[#E08FBC] hover:text-[#F3D9E6]"
                  >
                    → continue in full chat
                  </button>
                ) : null}
              </div>

              {/* prompt input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  ask(value);
                }}
                className="flex items-center gap-2.5 border-t border-white/10 px-5 py-4"
              >
                <span className="text-[#E08FBC]">❯</span>
                {/* NOTE: focusing must NOT stop the demo — only a real ask()
                    takes over, otherwise the loop dies mid-word. */}
                <input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder='ask "your own question…"'
                  aria-label="Ask my AI a question"
                  className="flex-1 bg-transparent text-white/90 outline-none placeholder:text-white/30"
                />
                <button
                  type="submit"
                  aria-label="Ask"
                  disabled={loading}
                  className="text-white/40 transition-colors hover:text-[#E08FBC] disabled:opacity-40"
                >
                  {loading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <span className="text-[11px] tracking-[0.14em]">⏎ run</span>
                  )}
                </button>
              </form>
            </motion.div>

            {/* suggested prompts */}
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => ask(s)}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  <span className="text-primary/70">$</span> {s}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

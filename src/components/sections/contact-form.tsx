"use client";

import * as React from "react";
import { ArrowUpRight, Check, Loader2 } from "lucide-react";

import { site } from "@/config/site";
import { Button } from "@/components/ui/button";

type Status = "idle" | "sending" | "sent" | "unconfigured" | "error";

const inputCls =
  "w-full border-b border-foreground/25 bg-transparent pb-2 text-base outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary";

export function ContactForm() {
  const [status, setStatus] = React.useState<Status>("idle");
  const [form, setForm] = React.useState({ name: "", email: "", message: "" });

  function set<K extends keyof typeof form>(key: K, v: string) {
    setForm((f) => ({ ...f, [key]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as { ok: boolean; reason?: string };
      if (data.ok) setStatus("sent");
      else if (data.reason === "unconfigured") setStatus("unconfigured");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  const mailtoHref = `mailto:${site.email}?subject=${encodeURIComponent(
    `Hello from ${form.name || "your portfolio"}`
  )}&body=${encodeURIComponent(form.message)}`;

  if (status === "sent") {
    return (
      <div className="flex h-full flex-col items-start justify-center gap-3 py-8">
        <span className="grid size-11 place-items-center rounded-full bg-primary/12 text-primary">
          <Check className="size-5" />
        </span>
        <p className="font-display text-2xl font-light">Message sent.</p>
        <p className="text-sm text-muted-foreground">
          Thanks, {form.name.split(" ")[0] || "friend"} — I&apos;ll get back to
          you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      {/* Honeypot — hidden from real users, catches bots. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
        onChange={() => {}}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Your name
          </span>
          <input
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="What should I call you?"
            className={inputCls}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Email
          </span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="you@example.com"
            className={inputCls}
          />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Message
        </span>
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder="Tell me about a role, a collaboration, or just say hi…"
          className={`${inputCls} resize-none`}
        />
      </label>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" disabled={status === "sending"}>
          {status === "sending" ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Sending…
            </>
          ) : (
            "Send message"
          )}
        </Button>

        {status === "unconfigured" ? (
          <a
            href={mailtoHref}
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:opacity-80"
          >
            Form is warming up — email me directly instead{" "}
            <ArrowUpRight className="size-4" />
          </a>
        ) : null}
        {status === "error" ? (
          <span className="text-sm text-muted-foreground">
            Something went wrong —{" "}
            <a href={mailtoHref} className="text-primary hover:opacity-80">
              email me instead
            </a>
            .
          </span>
        ) : null}
      </div>
    </form>
  );
}

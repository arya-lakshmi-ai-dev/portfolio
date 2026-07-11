import { ArrowUpRight } from "lucide-react";

import { Section } from "@/components/section";
import { Reveal } from "@/components/motion/reveal";
import { TextReveal } from "@/components/effects/text-reveal";
import { Magnetic } from "@/components/effects/magnetic";
import { Marquee } from "@/components/effects/marquee";
import { site } from "@/config/site";

const MARQUEE = ["Let's build something", "Open to work", "AI Engineering", "Say hello"];

export function Contact() {
  const links = site.socials
    .filter((s) => s.icon !== "mail")
    .map((s) => ({
      label: s.label,
      value: s.href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""),
      href: s.href,
    }));

  return (
    <Section id="contact">
      {/* label */}
      <Reveal className="flex items-center gap-4 border-t border-foreground/15 pt-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary">
          Contact
        </span>
        <span className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground">
          — 05
        </span>
      </Reveal>

      {/* huge closing statement */}
      <TextReveal
        as="h2"
        text="Let's build something great."
        className="mt-8 font-display text-[clamp(2.75rem,8vw,6.5rem)] font-light leading-[0.95] tracking-tight"
      />

      <Reveal delay={0.1} className="mt-8 max-w-lg">
        <p className="text-lg leading-relaxed text-muted-foreground">
          Open to AI Engineering roles &amp; collaborations. The fastest way to
          reach me:
        </p>
      </Reveal>

      {/* big magnetic email */}
      <Reveal delay={0.15} className="mt-8">
        <Magnetic strength={0.25}>
          <a
            href={`mailto:${site.email}`}
            className="group inline-flex flex-wrap items-baseline gap-x-4 gap-y-2"
          >
            <span className="text-accent-gradient animate-gradient-x font-display text-[clamp(1.5rem,4.5vw,3.25rem)] font-light leading-tight tracking-tight">
              {site.email}
            </span>
            <span className="grid size-10 place-items-center rounded-full border border-border text-muted-foreground transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
              <ArrowUpRight className="size-5" />
            </span>
          </a>
        </Magnetic>
      </Reveal>

      {/* links row */}
      <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
        {links.map((d, i) => (
          <Reveal
            key={d.label}
            delay={i * 0.05}
            className="flex flex-col gap-1.5 bg-card p-6"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {d.label}
            </span>
            <a
              href={d.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm transition-colors hover:text-primary"
            >
              <span className="truncate">{d.value}</span>
              <ArrowUpRight className="size-3.5 shrink-0" />
            </a>
          </Reveal>
        ))}
      </div>

      {/* closing marquee */}
      <div className="mt-20 border-y border-border py-6">
        <Marquee pauseOnHover className="[--duration:34s]">
          {MARQUEE.map((item) => (
            <span key={item} className="mx-6 flex items-center gap-6">
              <span className="font-display text-3xl font-light italic tracking-tight text-foreground/70 sm:text-4xl">
                {item}
              </span>
              <span className="text-primary">✦</span>
            </span>
          ))}
        </Marquee>
      </div>
    </Section>
  );
}

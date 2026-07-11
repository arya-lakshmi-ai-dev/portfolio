import { Bot } from "lucide-react";

import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { site } from "@/config/site";

export function About() {
  const current = site.experience[0];

  return (
    <Section id="about">
      <SectionHeading
        index="01"
        label="About"
        title="A short story."
        kicker="Profile · Background · Mindset"
      />

      <div className="mt-14 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        {/* Pull quote + short paragraphs */}
        <div className="flex flex-col gap-8">
          <Reveal>
            <p className="font-display text-xl font-light leading-snug text-foreground sm:text-2xl">
              <span className="text-primary">“</span>
              I build at the intersection of Artificial Intelligence and Software
              Engineering — turning ideas into products that work in the real
              world.
              <span className="text-primary">”</span>
            </p>
          </Reveal>

          <div className="flex flex-col gap-4 text-base leading-relaxed text-muted-foreground">
            {site.about.paragraphs.map((p, i) => (
              <Reveal as="div" key={i} delay={i * 0.05}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* AI callout + Now */}
        <div className="flex flex-col gap-6">
          <Reveal>
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-start gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/12 text-primary">
                  <Bot className="size-5" />
                </span>
                <div className="flex flex-col gap-1.5">
                  <p className="font-medium">Ask my AI</p>
                  <p className="text-sm text-muted-foreground">
                    A live agent, grounded in my real profile — ask it anything
                    about my work.
                  </p>
                  <button
                    type="button"
                    data-open-ai
                    className="mt-1 w-fit font-mono text-xs uppercase tracking-[0.15em] text-primary transition-opacity hover:opacity-70"
                  >
                    Try it →
                  </button>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4">
              <div className="flex flex-col">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Now
                </span>
                <span className="text-sm">
                  {current.role} · {current.company}
                </span>
              </div>
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/70" />
                <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

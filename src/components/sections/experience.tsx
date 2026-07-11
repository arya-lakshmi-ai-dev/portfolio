"use client";

import * as React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { site } from "@/config/site";

export function Experience() {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 70%"],
  });
  // Smoothed fill that draws the timeline as you scroll through the section.
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  return (
    <Section id="experience">
      <SectionHeading
        index="04"
        label="Experience"
        title="Path so far."
        kicker="Internships · Milestones"
      />

      <div ref={ref} className="relative mt-16">
        {/* timeline rail */}
        <div className="absolute left-2 top-1 h-[calc(100%-0.5rem)] w-px bg-border" />
        <motion.div
          style={{ scaleY }}
          className="absolute left-2 top-1 h-[calc(100%-0.5rem)] w-px origin-top bg-primary"
        />

        <div className="flex flex-col gap-14 pl-10">
          {site.experience.map((job, i) => (
            <Reveal
              as="div"
              key={`${job.company}-${i}`}
              delay={i * 0.05}
              className="group relative"
            >
              {/* node */}
              <span className="absolute -left-10 top-1 grid size-4 place-items-center">
                <span className="size-2.5 rounded-full bg-primary ring-4 ring-background transition-transform duration-300 group-hover:scale-125" />
              </span>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-[200px_1fr] md:gap-10">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
                    {job.period}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {job.company}
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  {job.roles ? (
                    // One company, multiple nested roles.
                    <div className="flex flex-col divide-y divide-border">
                      {job.roles.map((r, k) => (
                        <div key={k} className="flex flex-col gap-1.5 py-4 first:pt-0 last:pb-0">
                          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                            <h3 className="font-display text-xl font-light leading-tight sm:text-2xl">
                              {r.title}
                            </h3>
                            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                              {r.period}
                            </span>
                          </div>
                          {r.summary ? (
                            <p className="text-sm leading-relaxed text-muted-foreground">
                              {r.summary}
                            </p>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <h3 className="font-display text-2xl font-light leading-tight sm:text-3xl">
                        {job.role}
                      </h3>
                      <ul className="flex flex-col gap-2.5 text-sm leading-relaxed text-muted-foreground">
                        {job.points.map((point, j) => (
                          <li key={j} className="flex gap-3">
                            <span className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  {job.stack ? (
                    <ul className="flex flex-wrap gap-x-4 gap-y-1.5 pt-1">
                      {job.stack.map((t) => (
                        <li
                          key={t}
                          className="font-mono text-xs text-muted-foreground"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

"use client";

import * as React from "react";
import { ArrowUpRight, Github } from "lucide-react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { site, type Project } from "@/config/site";

function ProjectCard({
  project,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  const num = String(index + 1).padStart(2, "0");
  const href = project.liveUrl ?? project.repoUrl;
  const reduce = useReducedMotion();

  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 120px", "end 120px"],
  });
  // Cards scale + fade slightly as they get covered by the next one — depth.
  const isLast = index === total - 1;
  const scale = useTransform(scrollYProgress, [0, 1], [1, isLast ? 1 : 0.92]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, isLast ? 1 : 0.5]);

  return (
    // Sticky wrapper — NO transform here (would break `sticky`).
    <div
      ref={ref}
      className="sticky"
      style={{ top: `calc(6rem + ${index * 1.75}rem)`, zIndex: index + 1 }}
    >
      <motion.article
        style={reduce ? undefined : { scale, opacity, transformOrigin: "top center" }}
        className="group relative min-h-[19rem] overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-[0_-10px_50px_-28px_rgba(0,0,0,0.3)] sm:p-12"
      >
        <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-primary/60 via-primary/20 to-transparent" />

        <div className="flex items-start justify-between gap-6">
          <span className="font-display text-5xl font-light leading-none text-primary/25 sm:text-6xl">
            {num}
          </span>
          {project.badge ? (
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
              ● {project.badge}
            </span>
          ) : null}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-[1.1fr_1fr] md:gap-12">
          <div className="flex flex-col gap-3">
            <h3 className="font-display text-4xl font-light leading-[1.02] tracking-tight sm:text-5xl">
              {project.title}
            </h3>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {project.tagline}
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <p className="text-base leading-relaxed text-muted-foreground">
              {project.description}
            </p>
            <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
              {project.tech.map((t) => (
                <li key={t} className="font-mono text-xs text-muted-foreground">
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-1 flex items-center gap-6">
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary"
                >
                  Live demo <ArrowUpRight className="size-4" />
                </a>
              ) : null}
              {project.repoUrl ? (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Github className="size-4" /> Code
                </a>
              ) : null}
            </div>
          </div>
        </div>

        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${project.title}`}
            className="absolute bottom-8 right-8 hidden size-12 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground sm:inline-flex"
          >
            <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        ) : null}
      </motion.article>
    </div>
  );
}

export function Projects() {
  const total = site.projects.length;
  return (
    <Section id="projects">
      <SectionHeading index="03" label="Work" title="Selected projects." />

      <div className="mt-14 flex flex-col gap-6 pb-[30vh]">
        {site.projects.map((project, i) => (
          <ProjectCard
            key={project.title}
            project={project}
            index={i}
            total={total}
          />
        ))}
      </div>
    </Section>
  );
}

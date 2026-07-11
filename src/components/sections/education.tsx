import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { site } from "@/config/site";

export function Education() {
  return (
    <Section id="education">
      <SectionHeading index="05" label="Education" title="Academic background." />

      <div className="mt-14 flex flex-col">
        {site.education.map((edu, i) => (
          <Reveal
            key={edu.institution}
            delay={i * 0.05}
            className="grid grid-cols-1 gap-4 border-t border-border py-9 md:grid-cols-[220px_1fr] md:gap-12"
          >
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
              {edu.period}
            </span>
            <div className="flex flex-col gap-2">
              <h3 className="font-display text-2xl font-light leading-tight sm:text-3xl">
                {edu.institution}
              </h3>
              <p className="text-sm text-muted-foreground">{edu.degree}</p>
              <p className="font-mono text-xs uppercase tracking-[0.15em] text-primary">
                {edu.detail}
              </p>
            </div>
          </Reveal>
        ))}
        <div className="border-t border-border" />
      </div>
    </Section>
  );
}

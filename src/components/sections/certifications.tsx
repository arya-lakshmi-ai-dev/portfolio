import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { site } from "@/config/site";

export function Certifications() {
  return (
    <Section id="certifications">
      <SectionHeading
        index="06"
        label="Certifications"
        title="Credentials."
        kicker="Verified · 2024"
      />

      <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
        {site.certifications.map((cert, i) => (
          <Reveal
            key={cert.name}
            delay={(i % 2) * 0.05}
            className="flex items-baseline justify-between gap-4 bg-card p-6"
          >
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                {cert.issuer}
              </span>
              <h3 className="text-base leading-snug">{cert.name}</h3>
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              {cert.year}
            </span>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

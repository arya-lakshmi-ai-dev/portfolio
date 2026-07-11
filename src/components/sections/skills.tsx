import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { site } from "@/config/site";

const TAGS = ["Primary", "Core", "Lang", "UI", "API", "Stack"];

export function Skills() {
  return (
    <Section id="skills">
      <SectionHeading
        index="02"
        label="Skills"
        title="The toolkit."
        kicker="6 domains · 30+ technologies"
      />

      <div className="mt-14 flex flex-col">
        {site.skills.map((group, i) => (
          <Reveal
            key={group.category}
            delay={(i % 3) * 0.05}
            className="group grid grid-cols-1 gap-4 border-t border-border py-8 md:grid-cols-[auto_1fr] md:gap-12"
          >
            <div className="flex items-baseline gap-4 md:w-64">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                {TAGS[i] ?? "—"}
              </span>
              <h3 className="font-display text-xl font-light leading-tight sm:text-2xl">
                {group.category}
              </h3>
            </div>
            <ul className="flex flex-wrap items-start gap-x-6 gap-y-2 md:justify-end md:text-right">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="text-sm text-muted-foreground transition-colors group-hover:text-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
        <div className="border-t border-border" />
      </div>
    </Section>
  );
}

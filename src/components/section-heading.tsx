import { Reveal } from "@/components/motion/reveal";
import { TextReveal } from "@/components/effects/text-reveal";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  /** Two-digit index (kept for callers; rendered subtly as a folio). */
  index?: string;
  /** Uppercase overline label, e.g. "About". */
  label: string;
  /** Large serif headline. */
  title: string;
  /** Small subtitle under the title. */
  kicker?: string;
  className?: string;
};

export function SectionHeading({
  index,
  label,
  title,
  kicker,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      {/* Masthead rule + label */}
      <Reveal className="flex items-center justify-between border-t border-foreground/15 pt-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary">
          {label}
        </span>
        {index ? (
          <span className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground">
            — {index}
          </span>
        ) : null}
      </Reveal>

      <TextReveal
        as="h2"
        text={title}
        className="mt-6 font-display text-[clamp(2.25rem,5.5vw,4.5rem)] font-light leading-[1.02] tracking-tight"
      />

      {kicker ? (
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-xl text-base text-muted-foreground">
            {kicker}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}

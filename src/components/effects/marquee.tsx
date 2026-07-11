import { cn } from "@/lib/utils";

type MarqueeProps = {
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  /** Number of times the children are repeated to fill the track. */
  repeat?: number;
};

/**
 * Horizontal infinite marquee (CSS-driven). Adapted from the Magic UI pattern:
 * duplicate the track and translate by 100% + gap. Set `--duration`/`--gap`
 * via style/utilities to tune speed and spacing.
 */
export function Marquee({
  children,
  className,
  reverse = false,
  pauseOnHover = false,
  repeat = 4,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "group flex overflow-hidden [--duration:32s] [--gap:1.5rem] [gap:var(--gap)]",
        className
      )}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "flex shrink-0 items-center justify-around [gap:var(--gap)] animate-marquee flex-row",
            reverse && "[animation-direction:reverse]",
            pauseOnHover && "group-hover:[animation-play-state:paused]"
          )}
          aria-hidden={i > 0}
        >
          {children}
        </div>
      ))}
    </div>
  );
}

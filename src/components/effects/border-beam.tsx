import { cn } from "@/lib/utils";

type BorderBeamProps = {
  size?: number;
  duration?: number;
  delay?: number;
  className?: string;
};

/**
 * A light "beam" that travels around a rounded border — adapted from the
 * Magic UI pattern (offset-path + border-box mask). CSS-driven (compositor,
 * no JS animation loop) so it's cheap and doesn't stall the main thread.
 * The parent must be `relative` with `rounded-*`; the beam inherits that radius.
 */
export function BorderBeam({
  size = 70,
  duration = 6,
  delay = 0,
  className,
}: BorderBeamProps) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(#000,#000)] motion-reduce:hidden"
    >
      <span
        className={cn(
          "absolute aspect-square bg-gradient-to-l from-primary via-primary/40 to-transparent",
          className
        )}
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          animation: `border-beam-move ${duration}s linear ${delay}s infinite`,
        }}
      />
    </div>
  );
}

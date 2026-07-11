import { cn } from "@/lib/utils";

type SectionProps = {
  id: string;
  children: React.ReactNode;
  className?: string;
  /** Adds a subtle alternating background. */
  muted?: boolean;
};

/** Consistent vertical rhythm + anchor target for every page section. */
export function Section({ id, children, className, muted = false }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-20 py-20 sm:py-28",
        muted && "bg-secondary/30",
        className
      )}
    >
      <div className="container">{children}</div>
    </section>
  );
}

"use client";

import * as React from "react";

/**
 * A soft glow that follows the cursor across the whole page — the "signature"
 * interaction. Pure transform updates via rAF (no re-renders). Auto-disables on
 * touch devices and when the user prefers reduced motion.
 */
export function CursorSpotlight() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (el) {
          el.style.transform = `translate3d(${e.clientX - 300}px, ${e.clientY - 300}px, 0)`;
          el.style.opacity = "1";
        }
      });
    };
    const onLeave = () => {
      if (ref.current) ref.current.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-30 h-[600px] w-[600px] rounded-full opacity-0 blur-[80px] transition-opacity duration-500 will-change-transform"
      style={{
        background:
          "radial-gradient(circle, hsl(var(--primary) / 0.10), transparent 60%)",
      }}
    />
  );
}

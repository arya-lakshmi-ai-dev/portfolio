"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Crosshair cursor: a thin plum "+" that follows smoothly, and rotates into an
 * "×" (and grows) over interactive elements. Desktop (fine pointer) only;
 * respects reduced-motion. Native cursor is hidden while active.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = React.useState(false);
  const [active, setActive] = React.useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 34, mass: 0.2 });
  const sy = useSpring(y, { stiffness: 500, damping: 34, mass: 0.2 });

  React.useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const t = (e.target as HTMLElement)?.closest(
        "a, button, input, textarea, [data-cursor]"
      );
      setActive(Boolean(t));
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    document.documentElement.style.cursor = "none";
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.documentElement.style.cursor = "";
    };
  }, [x, y]);

  if (!enabled) return null;

  const bar =
    "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary";

  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[100]"
    >
      <motion.div
        className="relative size-5 -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: active ? 45 : 0, scale: active ? 1.6 : 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <span className={`${bar} h-[1.5px] w-5`} />
        <span className={`${bar} h-5 w-[1.5px]`} />
      </motion.div>
    </motion.div>
  );
}

"use client";

import * as React from "react";
import {
  useInView,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";

/**
 * Counts up to `value` when scrolled into view. Preserves any non-numeric
 * prefix/suffix (e.g. "3+", "2026") by animating only the numeric part.
 */
export function NumberTicker({ value }: { value: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();

  const match = value.match(/^(\D*)(\d+)(.*)$/);
  const prefix = match?.[1] ?? "";
  const target = match ? Number(match[2]) : 0;
  const suffix = match?.[3] ?? "";

  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 90, damping: 20 });

  React.useEffect(() => {
    if (!match) return;
    if (reduce) {
      if (ref.current) ref.current.textContent = value;
      return;
    }
    if (inView) mv.set(target);
  }, [inView, mv, target, match, reduce, value]);

  React.useEffect(() => {
    if (!match) return;
    return spring.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${Math.round(latest)}${suffix}`;
      }
    });
  }, [spring, prefix, suffix, match]);

  // Non-numeric values render as-is.
  if (!match) return <span ref={ref}>{value}</span>;

  return (
    <span ref={ref}>
      {prefix}0{suffix}
    </span>
  );
}

"use client";

import * as React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

/** Subtle vertical parallax as the element scrolls through the viewport. */
export function Parallax({
  children,
  offset = 50,
  className,
}: {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return (
    <motion.div ref={ref} style={{ y: reduce ? 0 : y }} className={className}>
      {children}
    </motion.div>
  );
}

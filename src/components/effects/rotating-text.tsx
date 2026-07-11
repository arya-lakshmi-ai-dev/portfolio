"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/** Cycles through words with a vertical swap — used for the hero role line. */
export function RotatingText({
  words,
  className,
  interval = 2400,
}: {
  words: string[];
  className?: string;
  interval?: number;
}) {
  const [i, setI] = React.useState(0);
  const reduce = useReducedMotion();

  React.useEffect(() => {
    if (reduce || words.length <= 1) return;
    const id = setInterval(() => setI((v) => (v + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words.length, interval, reduce]);

  return (
    <span className={`relative inline-block align-bottom ${className ?? ""}`}>
      {/* Reserve width for the longest word to avoid layout shift. */}
      <span className="invisible" aria-hidden>
        {words.reduce((a, b) => (a.length >= b.length ? a : b), "")}
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={{ y: "0.7em", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-0.7em", opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 inline-block"
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * Reveals a headline word-by-word, each word rising from behind a clipping
 * mask when scrolled into view. The professional "editorial" reveal.
 */
export function TextReveal({
  text,
  className,
  delay = 0,
  as: Tag = "h2",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  return (
    <Tag className={cn(className)} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden pb-[0.12em] align-bottom"
          aria-hidden
        >
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
              delay: reduce ? 0 : delay + i * 0.06,
            }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

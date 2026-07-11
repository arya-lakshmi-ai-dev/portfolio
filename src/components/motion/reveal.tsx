"use client";

import * as React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Stagger offset in seconds for sequential reveals. */
  delay?: number;
  as?: "div" | "section" | "li" | "article";
};

/**
 * Fades + lifts children into view once, when scrolled into the viewport.
 * Respects prefers-reduced-motion (renders instantly, no transform).
 */
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
    },
  };

  return (
    <MotionTag
      className={cn(className)}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </MotionTag>
  );
}

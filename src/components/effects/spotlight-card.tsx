"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * A card that tracks the pointer and exposes --mx/--my CSS vars so the
 * `.card-spotlight` glow (see globals.css) follows the cursor. Purely CSS on
 * touch (no glow, no JS cost beyond the listener).
 */
export function SpotlightCard({
  children,
  className,
  as,
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "article" | "a";
}) {
  const Tag = (as ?? "div") as React.ElementType;
  const ref = React.useRef<HTMLElement | null>(null);

  function handleMove(e: React.MouseEvent<HTMLElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  return (
    <Tag
      ref={ref}
      onMouseMove={handleMove}
      className={cn("card-spotlight", className)}
    >
      {children}
    </Tag>
  );
}

"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Download, ExternalLink, X } from "lucide-react";

import { site } from "@/config/site";

/**
 * In-page résumé preview. Mounted once (see page.tsx). Any element with
 * [data-open-resume] opens the modal — same event-delegation pattern as AskAI,
 * so triggers can live anywhere (hero, header, mobile menu) without prop drilling.
 * The PDF is embedded in an <iframe>; Download + Open-in-new-tab live in the header.
 */
export function ResumeViewer() {
  const reduce = useReducedMotion();
  const [open, setOpen] = React.useState(false);
  const url = site.hero.resumeUrl;
  // Force a descriptive download filename instead of the raw "resume.pdf".
  const downloadName = `${site.name.replace(/\s+/g, "_")}_AI_Engineer_Resume.pdf`;

  // Open on any [data-open-resume] click.
  React.useEffect(() => {
    if (!url) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("[data-open-resume]")) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [url]);

  // Esc to close + lock background scroll while open.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!url) return null;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* backdrop */}
          <button
            type="button"
            aria-label="Close résumé preview"
            onClick={() => setOpen(false)}
            className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${site.name} résumé`}
            initial={{ opacity: 0, y: reduce ? 0 : 16, scale: reduce ? 1 : 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduce ? 0 : 16, scale: reduce ? 1 : 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex h-[min(88vh,52rem)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          >
            {/* header */}
            <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-semibold">
                  {site.name} — Résumé
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {site.role}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <a
                  href={url}
                  download={downloadName}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-secondary"
                >
                  <Download className="size-4" />
                  <span className="hidden sm:inline">Download</span>
                </a>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open résumé in a new tab"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-secondary"
                >
                  <ExternalLink className="size-4" />
                  <span className="hidden sm:inline">Open</span>
                </a>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* embedded PDF */}
            <div className="flex-1 bg-secondary/30">
              <iframe
                src={`${url}#toolbar=0&navpanes=0`}
                title={`${site.name} résumé`}
                className="h-full w-full"
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

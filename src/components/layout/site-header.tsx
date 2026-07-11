"use client";

import * as React from "react";
import { Menu, X } from "lucide-react";

import { navItems, site } from "@/config/site";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="container flex h-20 items-center justify-between">
        {/* Wordmark */}
        <a
          href="#top"
          className="inline-flex items-center gap-2.5 font-mono text-sm font-medium tracking-tight"
        >
          <span className="grid size-8 place-items-center rounded-full border border-border bg-card text-primary">
            {site.shortName.charAt(0)}
          </span>
          <span className="hidden sm:inline">{site.name}</span>
        </a>

        {/* Floating pill nav (desktop) */}
        <nav
          className={cn(
            "absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border px-2 py-1.5 transition-all duration-300 md:flex",
            scrolled
              ? "border-border bg-card/80 backdrop-blur-md"
              : "border-transparent bg-transparent"
          )}
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-1.5 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            asChild
            size="sm"
            variant="outline"
            className="hidden rounded-full md:inline-flex"
          >
            <a href="#contact">Let&apos;s talk</a>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {open ? (
        <nav className="mx-4 rounded-2xl border border-border bg-card p-3 shadow-xl md:hidden">
          <div className="flex flex-col">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 font-mono text-sm uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
            <Button asChild className="mt-2 rounded-full">
              <a href="#contact" onClick={() => setOpen(false)}>
                Let&apos;s talk
              </a>
            </Button>
          </div>
        </nav>
      ) : null}
    </header>
  );
}

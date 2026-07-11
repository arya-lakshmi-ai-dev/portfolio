import { navItems, site } from "@/config/site";
import { SocialLinks } from "@/components/social-links";

export function SiteFooter() {
  const year = 2026;

  return (
    <footer className="border-t border-border">
      <div className="container flex flex-col gap-10 py-14">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-2">
            <span className="font-display text-2xl font-light tracking-tight">
              {site.name}
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {site.role}
            </span>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <SocialLinks />
        </div>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-border pt-6 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © {year} {site.name} · All rights reserved
          </p>
          <a
            href="#top"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}

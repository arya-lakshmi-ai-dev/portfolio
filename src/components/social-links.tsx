import { site } from "@/config/site";
import { socialIcons } from "@/components/icons";
import { cn } from "@/lib/utils";

export function SocialLinks({ className }: { className?: string }) {
  return (
    <ul className={cn("flex items-center gap-1.5", className)}>
      {site.socials.map((social) => {
        const Icon = socialIcons[social.icon];
        const isMail = social.icon === "mail";
        return (
          <li key={social.label}>
            <a
              href={social.href}
              aria-label={social.label}
              title={social.label}
              {...(!isMail && { target: "_blank", rel: "noopener noreferrer" })}
              className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Icon className="size-[1.1rem]" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

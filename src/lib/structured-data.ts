import { site } from "@/config/site";

/**
 * JSON-LD `Person` schema (schema.org). Rendered as a <script> in the root
 * layout so search engines and AI/ATS crawlers can parse Arya as a structured
 * entity — name, role, skills, education, employer, and verified social links.
 * Built from `site.ts` so it never drifts from the visible content.
 */
export function personJsonLd() {
  const [currentRole] = site.experience;

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    alternateName: site.shortName,
    jobTitle: site.role,
    description: site.description,
    url: site.url,
    email: `mailto:${site.email}`,
    // Verified profiles help Google's Knowledge Graph link the entity.
    sameAs: site.socials
      .filter((s) => s.icon !== "mail")
      .map((s) => s.href),
    knowsAbout: site.skills.flatMap((g) => g.items),
    alumniOf: site.education.map((e) => ({
      "@type": "CollegeOrUniversity",
      name: e.institution,
    })),
    worksFor: currentRole
      ? { "@type": "Organization", name: currentRole.company }
      : undefined,
    address: {
      "@type": "PostalAddress",
      addressCountry: site.location,
    },
  };
}

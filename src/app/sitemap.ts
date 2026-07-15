import type { MetadataRoute } from "next";

import { site } from "@/config/site";

/**
 * Single-page portfolio → one canonical URL. (Anchor links like #projects
 * aren't listed; crawlers discover them from the page itself.)
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}

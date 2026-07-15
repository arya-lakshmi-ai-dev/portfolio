import type { MetadataRoute } from "next";

import { site } from "@/config/site";

/**
 * Allow everything (public portfolio) and point crawlers at the sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}

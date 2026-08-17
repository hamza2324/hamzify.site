import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site-config";

/**
 * robots.txt
 *
 * Open to search crawlers and to the main generative-engine crawlers. The only
 * disallowed path is `/search/`, which is also `noindex`.
 */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const sitemap = absoluteUrl("/sitemap.xml");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/search/"],
      },
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Bingbot", allow: "/" },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
    ],
    sitemap,
    host: "hamzify.site",
  };
}

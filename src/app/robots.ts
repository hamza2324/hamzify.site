import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site-config";

/**
 * robots.txt
 *
 * Open by default. Nothing that affects rendering is blocked — no CSS, no JS, no
 * font or image paths — because blocking those is one of the most common ways a
 * site accidentally hides itself from a crawler that needs to render the page.
 *
 * The only disallowed path is the internal search route, which produces
 * effectively unlimited near-duplicate URLs via `?q=`. The page itself also
 * carries `noindex`.
 */
/** Emitted as a file at build time, as `output: "export"` requires. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/search/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}

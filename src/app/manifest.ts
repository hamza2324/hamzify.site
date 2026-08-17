import type { MetadataRoute } from "next";

import { canonicalPath, siteConfig } from "@/lib/site-config";

/**
 * Web app manifest.
 *
 * `display: "browser"` on purpose: this is a publication, and a standalone
 * window would strip the browser chrome readers use — back button, address bar,
 * share sheet — for no benefit.
 *
 * Colours are the light-theme surface and brand accent as literals, because a
 * manifest cannot resolve CSS custom properties. They are kept in sync with the
 * `--paper` and `--accent` light values in `globals.css`.
 */
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: canonicalPath("/"),
    scope: canonicalPath("/"),
    display: "browser",
    background_color: "#f7f5f0",
    theme_color: "#635bff",
    lang: siteConfig.lang,
    categories: ["technology", "education", "developer tools"],
    // One scalable icon rather than a set of raster sizes: the mark is vector,
    // every current browser accepts SVG here, and listing PNG files that are not
    // in the repository would just be a broken reference.
    icons: [
      {
        src: canonicalPath("/icons/hamzify-logo-512.png"),
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: canonicalPath("/icons/hamzify-mark.svg"),
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}

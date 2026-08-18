/**
 * Single source of truth for everything identity- and URL-related.
 *
 * Nothing else in the codebase should hardcode the production origin: import
 * `siteConfig.url` or the `absoluteUrl()` helper instead. This keeps canonical
 * tags, the sitemap, RSS, JSON-LD and Open Graph metadata consistent.
 */

const FALLBACK_ORIGIN = "https://hamzify.site";

/** Strips trailing slashes so we never emit `https://host//path`. */
function normalizeOrigin(value: string | undefined): string {
  const candidate = (value ?? "").trim();
  if (!candidate) return FALLBACK_ORIGIN;
  try {
    const url = new URL(candidate);
    return `${url.protocol}//${url.host}`;
  } catch {
    return FALLBACK_ORIGIN;
  }
}

export const siteConfig = {
  name: "Hamzify",
  /** Used in the title template, e.g. `Cursor review | Hamzify`. */
  titleTemplate: "%s | Hamzify",
  defaultTitle: "Hamzify — The Practical AI Coding Publication",
  /** Primary positioning. Use this everywhere identity is needed. */
  tagline: "The Practical AI Coding Publication",
  /** Homepage hero only. Do not repeat on every page. */
  supportingLine: "Real tools. Real projects. Real results.",
  description:
    "The practical AI coding publication: hands-on reviews of AI coding tools like Cursor, GitHub Copilot and Claude Code, plus real AI agent build logs, vibe coding experiments and development workflows.",
  newsletterPromise: "One useful AI development workflow at a time.",
  footerIdentity: "More practical AI coding experiments from Hamzify.",
  url: normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL),
  locale: "en_US",
  lang: "en",
  /** Shown in the footer and used for the contact page fallback. */
  email: "hamzajadoon71@gmail.com",
  /** Used for `twitter:site` and `twitter:creator`. */
  twitterHandle: "@hamzify",
  social: {
    x: "https://x.com/hamzify",
    github: "https://github.com/hamza2324/hamzify.site",
    rss: "/rss.xml",
  },
  /** Public GitHub Discussions thread used for reader questions. */
  discussions: "https://github.com/hamza2324/hamzify.site/discussions",
  /**
   * Raster brand files served from `/public`. The header uses the compact mark;
   * JSON-LD, the apple touch icon and the about page use the full lockup.
   */
  brand: {
    logo: "/brand/hamzify-logo.jpg",
    mark: "/brand/hamzify-mark.png",
    appleTouchIcon: "/apple-touch-icon.png",
    icon512: "/icons/hamzify-logo-512.png",
  },
} as const;

export type SiteConfig = typeof siteConfig;

/** Bare hostname, for display in social cards and the footer. */
export const siteHost = new URL(siteConfig.url).host;

/**
 * Builds a canonical absolute URL.
 *
 * The site is exported with `trailingSlash: true`, so every page URL except the
 * homepage ends in a single `/`. File-like paths (`/rss.xml`) are left alone.
 */
export function absoluteUrl(path = "/"): string {
  return `${siteConfig.url}${canonicalPath(path)}`;
}

/** Normalizes an internal path to its single canonical form. */
export function canonicalPath(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;

  let next = path.trim();
  if (!next.startsWith("/")) next = `/${next}`;
  next = next.replace(/\/{2,}/g, "/");

  if (next === "/") return "/";

  // Leave asset-like routes (rss.xml, sitemap.xml, robots.txt) untouched.
  const lastSegment = next.split("/").filter(Boolean).at(-1) ?? "";
  if (lastSegment.includes(".")) return next;

  return next.endsWith("/") ? next : `${next}/`;
}

/** Verification meta tags, only emitted when configured. */
export const siteVerification = {
  google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  bing: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || undefined,
} as const;

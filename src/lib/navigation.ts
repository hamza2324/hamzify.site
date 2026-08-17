import { CATEGORIES, HUB_PAGES } from "@/lib/taxonomy";
import { canonicalPath, siteConfig } from "@/lib/site-config";

export type NavItem = {
  href: string;
  label: string;
  /** Used as the accessible description in the mobile menu. */
  hint?: string;
};

/**
 * Primary navigation. Five editorial destinations — the homepage header should
 * read as a publication masthead, not a sitemap. Resources and the lab live in
 * the footer; reviews and comparisons sit under AI Coding.
 */
export const mainNav: NavItem[] = [
  {
    href: canonicalPath("/latest"),
    label: "Latest",
    hint: "Everything, newest first",
  },
  {
    href: canonicalPath("/ai-coding-tools"),
    label: "AI Coding",
    hint: "Reviews and comparisons of coding tools",
  },
  {
    href: canonicalPath("/vibe-coding"),
    label: CATEGORIES["vibe-coding"].navLabel,
    hint: "AI-assisted building experiments",
  },
  {
    href: canonicalPath("/build-logs"),
    label: CATEGORIES["build-logs"].navLabel,
    hint: "Records of real projects",
  },
  {
    href: canonicalPath("/workflows"),
    label: CATEGORIES.workflows.navLabel,
    hint: "Repeatable development workflows",
  },
];

export const footerNav: Array<{ title: string; items: NavItem[] }> = [
  {
    title: "Editorial",
    items: [
      { href: canonicalPath("/latest"), label: "Latest" },
      { href: canonicalPath("/vibe-coding"), label: "Vibe Coding" },
      { href: canonicalPath("/build-logs"), label: "Build Logs" },
      { href: canonicalPath("/workflows"), label: "Workflows" },
      { href: canonicalPath("/resources"), label: "Resources" },
    ],
  },
  {
    title: "Tools",
    items: [
      { href: canonicalPath("/ai-coding-tools"), label: "AI Coding Tools" },
      { href: canonicalPath("/reviews"), label: "Reviews" },
      { href: canonicalPath("/compare"), label: "Comparisons" },
      { href: canonicalPath("/resources"), label: "Resources" },
      { href: canonicalPath("/tools"), label: "The Lab" },
    ],
  },
  {
    title: "Hamzify",
    items: [
      { href: canonicalPath("/about"), label: "About" },
      { href: canonicalPath("/contact"), label: "Contact" },
      { href: siteConfig.discussions, label: "Ask a question" },
      { href: "/rss.xml", label: "RSS feed" },
    ],
  },
  {
    title: "Policies",
    items: [
      { href: canonicalPath("/editorial-policy"), label: "Editorial policy" },
      {
        href: canonicalPath("/affiliate-disclosure"),
        label: "Affiliate disclosure",
      },
      {
        href: canonicalPath("/corrections-policy"),
        label: "Corrections policy",
      },
      { href: canonicalPath("/privacy"), label: "Privacy" },
      { href: canonicalPath("/terms"), label: "Terms" },
    ],
  },
];

export const hubPaths = HUB_PAGES.map((hub) => canonicalPath(`/${hub.slug}`));

/** Marks a nav item active for the current pathname, including nested routes. */
export function isActivePath(pathname: string, href: string): boolean {
  const current = canonicalPath(pathname);
  if (href === "/") return current === "/";
  return current === href || current.startsWith(href);
}

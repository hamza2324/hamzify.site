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

/**
 * Secondary destinations. Desktop keeps these out of the header so the
 * masthead stays five items. Mobile groups them under "More" instead of
 * dumping them into one crowded list.
 */
export const moreNav: NavItem[] = [
  {
    href: canonicalPath("/reviews"),
    label: "Reviews",
    hint: "One tool at a time, tested on real work",
  },
  {
    href: canonicalPath("/compare"),
    label: "Comparisons",
    hint: "The same task, more than one tool",
  },
  {
    href: canonicalPath("/resources"),
    label: "Resources",
    hint: "Checklists and reference you can reuse",
  },
  {
    href: canonicalPath("/about"),
    label: "About",
    hint: "What Hamzify is, and how it is written",
  },
  {
    href: canonicalPath("/tools"),
    label: "The Lab",
    hint: "Small utilities, published only when useful",
  },
  {
    href: "/#newsletter",
    label: "Subscribe",
    hint: "New pieces when they are worth sending",
  },
];

/** Paths that should keep "AI Coding" marked current (the hub, not a dropdown). */
export const aiCodingAliases = [
  canonicalPath("/reviews"),
  canonicalPath("/compare"),
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
      { href: "/sitemap.xml", label: "Sitemap" },
      { href: "/llms.txt", label: "llms.txt" },
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
export function isActivePath(
  pathname: string,
  href: string,
  aliases: string[] = [],
): boolean {
  const current = canonicalPath(pathname);
  if (href === "/" || href.startsWith("/#")) return current === "/";

  const matches = (target: string) =>
    current === target || current.startsWith(target);

  if (matches(href)) return true;
  return aliases.some((alias) => matches(alias));
}

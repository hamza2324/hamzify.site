/**
 * Registry for the standalone policy pages.
 *
 * The bodies live as MDX in `src/content/pages` so they can be edited as prose,
 * and the metadata lives here so titles, descriptions and review dates are typed
 * and can feed the sitemap. Adding a policy page means one entry here, one MDX
 * file, and one three-line route file.
 */

export const POLICY_SLUGS = [
  "privacy",
  "terms",
  "affiliate-disclosure",
  "editorial-policy",
  "corrections-policy",
] as const;

export type PolicySlug = (typeof POLICY_SLUGS)[number];

export type PolicyPageMeta = {
  slug: PolicySlug;
  kicker: string;
  title: string;
  description: string;
  intro: string;
  /** Shown on the page so a reader knows how current the wording is. */
  lastReviewed: string;
};

export const POLICY_PAGES: Record<PolicySlug, PolicyPageMeta> = {
  privacy: {
    slug: "privacy",
    kicker: "Policy",
    title: "Privacy policy",
    description:
      "What Hamzify collects, what it stores in your browser, and what it sends to third parties — written to match how the site is actually built.",
    intro:
      "Hamzify is a static site with no accounts and no database. This page describes what that means for your data in specific terms rather than generic ones.",
    lastReviewed: "2026-08-16",
  },
  terms: {
    slug: "terms",
    kicker: "Policy",
    title: "Terms and conditions",
    description:
      "The terms covering use of Hamzify: what the content is, what it is not, and the limits of what you should rely on it for.",
    intro:
      "Plain terms for a publication. The short version: everything here is documentation of one person's experience, offered in good faith and without warranty.",
    lastReviewed: "2026-08-16",
  },
  "affiliate-disclosure": {
    slug: "affiliate-disclosure",
    kicker: "Trust",
    title: "Affiliate disclosure",
    description:
      "How affiliate links work on Hamzify, how they are marked, and what they do not change about a review or a verdict.",
    intro:
      "Some tool coverage may carry affiliate links. This page explains exactly how they are handled and where the line is.",
    lastReviewed: "2026-08-16",
  },
  "editorial-policy": {
    slug: "editorial-policy",
    kicker: "Trust",
    title: "Editorial policy",
    description:
      "How Hamzify decides what to publish, how tools are tested, how AI is used in the writing process, and what independence means here.",
    intro:
      "The standards this site holds itself to, including an honest account of where AI is and is not used in producing the content.",
    lastReviewed: "2026-08-16",
  },
  "corrections-policy": {
    slug: "corrections-policy",
    kicker: "Trust",
    title: "Corrections policy",
    description:
      "How to report an error on Hamzify, what counts as a correction, and how corrections are recorded on the page.",
    intro:
      "Tool coverage goes stale and mistakes happen. This is how both get fixed, visibly.",
    lastReviewed: "2026-08-16",
  },
};

export const POLICY_PAGE_LIST: PolicyPageMeta[] = POLICY_SLUGS.map(
  (slug) => POLICY_PAGES[slug],
);

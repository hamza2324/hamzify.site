/**
 * Content taxonomy: the categories that own article URLs, plus the article
 * types that decide which editorial template an article renders with.
 *
 * Category slugs are part of the public URL contract (`/[category]/[slug]`).
 * Adding a category here automatically creates its index page, sitemap entries
 * and navigation entry, so treat this file as the information architecture.
 */

export const CATEGORY_SLUGS = [
  "vibe-coding",
  "build-logs",
  "workflows",
  "reviews",
  "compare",
  "resources",
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export const ARTICLE_TYPES = [
  "experiment",
  "build-log",
  "review",
  "comparison",
  "workflow",
  "guide",
  "resource",
] as const;

export type ArticleType = (typeof ARTICLE_TYPES)[number];

/** Accent tokens defined in `globals.css`. Kept small on purpose. */
export type AccentKey = "ember" | "teal" | "amber" | "indigo" | "olive";

export type CategoryDefinition = {
  slug: CategorySlug;
  /** Short label for navigation and breadcrumbs. */
  label: string;
  /** Nav label, sometimes shorter than the page title. */
  navLabel: string;
  /** `<h1>` on the category index page. */
  headline: string;
  /** One-line summary used in metadata descriptions and card decks. */
  description: string;
  /** Longer editorial framing shown under the category headline. */
  intro: string;
  accent: AccentKey;
  /** Default article type for content filed under this category. */
  defaultArticleType: ArticleType;
  /** Included in the main navigation when true. */
  inMainNav: boolean;
};

export const CATEGORIES: Record<CategorySlug, CategoryDefinition> = {
  "vibe-coding": {
    slug: "vibe-coding",
    label: "Vibe Coding",
    navLabel: "Vibe Coding",
    headline: "Vibe coding experiments with AI coding tools",
    description:
      "Vibe coding documented properly: AI-assisted building experiments, prompt-to-product attempts, and what breaks when you hand real work to a coding model.",
    intro:
      "Prompt-to-product attempts, honest failure modes and the parts nobody screenshots. Every piece here is an experiment with a stated setup and a stated limitation, filed internally as AI-assisted building so the archive still makes sense when the vocabulary changes.",
    accent: "ember",
    defaultArticleType: "experiment",
    inMainNav: true,
  },
  "build-logs": {
    slug: "build-logs",
    label: "Build Logs",
    navLabel: "Build Logs",
    headline: "Build logs: shipping software with AI agents",
    description:
      "Long-form AI build logs from real projects: stack, coding agents, decisions, mistakes, and what actually shipped.",
    intro:
      "A build log is not a tutorial. It is a record: the goal, the stack, the tools, the decisions that turned out badly, and what the thing looked like when it finally worked. Written while building, not reconstructed afterwards.",
    accent: "teal",
    defaultArticleType: "build-log",
    inMainNav: true,
  },
  workflows: {
    slug: "workflows",
    label: "Workflows",
    navLabel: "Workflows",
    headline: "AI development workflows worth stealing",
    description:
      "Repeatable AI coding workflows for briefing agents, pair programming, reviewing generated code, testing and shipping.",
    intro:
      "Tools change every few months; workflows survive longer. These are the sequences worth keeping: how to brief a coding agent, how to review what it produces, and where a human has to stay in the loop.",
    accent: "amber",
    defaultArticleType: "workflow",
    inMainNav: true,
  },
  reviews: {
    slug: "reviews",
    label: "Reviews",
    navLabel: "Reviews",
    headline: "AI coding tool reviews, tested on real work",
    description:
      "Hands-on reviews of AI coding tools such as Cursor, Claude Code and GitHub Copilot, with a stated method, a verdict, and who should skip them.",
    intro:
      "Every review states what was built during testing, how long the tool was used, and which version. If a tool is wrong for you, that gets said as plainly as the praise.",
    accent: "indigo",
    defaultArticleType: "review",
    inMainNav: false,
  },
  compare: {
    slug: "compare",
    label: "Comparisons",
    navLabel: "Comparisons",
    headline: "AI coding tool comparisons by use case",
    description:
      "Side-by-side comparisons of AI coding assistants — Cursor vs GitHub Copilot and others — decided by use case rather than a single overall winner.",
    intro:
      "There is rarely one winner. These comparisons run the same task through each tool and then pick a recommendation per use case: refactoring, greenfield work, unfamiliar codebases, budget.",
    accent: "indigo",
    defaultArticleType: "comparison",
    inMainNav: false,
  },
  resources: {
    slug: "resources",
    label: "Resources",
    navLabel: "Resources",
    headline: "AI coding resources, checklists and guides",
    description:
      "Evergreen AI development resources: context engineering checklists, AI coding tool guides, and collections that stay useful after the next model drop.",
    intro:
      "Reference material rather than news: checklists, prompt patterns, review guides and collections that get updated in place instead of being republished.",
    accent: "indigo",
    defaultArticleType: "resource",
    inMainNav: true,
  },
};

export const CATEGORY_LIST: CategoryDefinition[] = CATEGORY_SLUGS.map(
  (slug) => CATEGORIES[slug],
);

export function isCategorySlug(value: string): value is CategorySlug {
  return (CATEGORY_SLUGS as readonly string[]).includes(value);
}

export function getCategory(slug: CategorySlug): CategoryDefinition {
  return CATEGORIES[slug];
}

export type ArticleTypeDefinition = {
  type: ArticleType;
  /** Badge text shown on cards and article headers. */
  label: string;
  /** Explains the format to a first-time reader. */
  description: string;
  accent: AccentKey;
};

export const ARTICLE_TYPE_META: Record<ArticleType, ArticleTypeDefinition> = {
  experiment: {
    type: "experiment",
    label: "Experiment",
    description:
      "A question, a setup, a result and its limitations. Written so you can repeat it.",
    accent: "ember",
  },
  "build-log": {
    type: "build-log",
    label: "Build log",
    description:
      "A record of building something real, including the parts that went wrong.",
    accent: "teal",
  },
  review: {
    type: "review",
    label: "Review",
    description: "One tool, tested on real work, with a stated method.",
    accent: "indigo",
  },
  comparison: {
    type: "comparison",
    label: "Comparison",
    description: "Two or more tools on the same task, decided per use case.",
    accent: "indigo",
  },
  workflow: {
    type: "workflow",
    label: "Workflow",
    description: "A repeatable sequence you can adopt step by step.",
    accent: "amber",
  },
  guide: {
    type: "guide",
    label: "Guide",
    description: "Reference material maintained and updated in place.",
    accent: "indigo",
  },
  resource: {
    type: "resource",
    label: "Resource",
    description: "A collection or checklist to come back to.",
    accent: "indigo",
  },
};

export function getArticleTypeMeta(type: ArticleType): ArticleTypeDefinition {
  return ARTICLE_TYPE_META[type];
}

/**
 * Hub pages are curated landing pages that do not own article URLs.
 * They exist in navigation and the sitemap, but articles never live under them.
 */
export const HUB_PAGES = [
  {
    slug: "latest",
    label: "Latest",
    headline: "Latest AI coding articles",
    description:
      "The full Hamzify archive in publication order: AI coding tool reviews, vibe coding experiments, AI agent build logs, comparisons and workflows.",
  },
  {
    slug: "ai-coding-tools",
    label: "AI Coding",
    headline: "AI coding tools: reviews, comparisons and notes",
    description:
      "Reviews and comparisons of AI coding tools developers actually keep open — Cursor, GitHub Copilot, Claude Code, agents and assistants — tested on real work.",
  },
  {
    slug: "tools",
    label: "Tools",
    headline: "The lab: AI coding utilities",
    description:
      "Small AI developer tools and coding-agent utilities built for people who ship with AI. Published only when they are genuinely useful.",
  },
] as const;

export type HubSlug = (typeof HUB_PAGES)[number]["slug"];

/**
 * Neighbouring shelves, used on category indexes and article footers.
 * Kept short so a reader gets one useful next click, not a sitemap.
 */
export const RELATED_CATEGORIES: Record<CategorySlug, CategorySlug[]> = {
  "vibe-coding": ["build-logs", "workflows", "resources"],
  "build-logs": ["vibe-coding", "workflows", "reviews"],
  workflows: ["resources", "reviews", "build-logs"],
  reviews: ["compare", "workflows", "resources"],
  compare: ["reviews", "workflows", "resources"],
  resources: ["workflows", "reviews", "compare"],
};

export function relatedCategoriesFor(slug: CategorySlug): CategoryDefinition[] {
  return RELATED_CATEGORIES[slug].map((entry) => CATEGORIES[entry]);
}

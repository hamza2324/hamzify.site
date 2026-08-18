import { z } from "zod";

import { ARTICLE_TYPES, CATEGORY_SLUGS } from "@/lib/taxonomy";

/**
 * Frontmatter contract for every file in `src/content/articles`.
 *
 * Validation runs at build time, so a malformed article fails the build instead
 * of silently rendering a broken page. Keeping the shape declarative here is
 * what makes a later move to a hosted CMS a mapping exercise rather than a
 * rewrite: the rest of the app only ever touches the parsed `Article` type.
 */

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}(T[\d:.]+Z?)?$/, "Use YYYY-MM-DD or an ISO string")
  .refine((value) => !Number.isNaN(Date.parse(value)), "Not a real date");

/** Visual treatment for the generated, CSS-only article cover. */
export const COVER_PATTERNS = [
  "grid",
  "terminal",
  "diff",
  "timeline",
  "stack",
  "flow",
] as const;

export type CoverPattern = (typeof COVER_PATTERNS)[number];

/** Shown on build-log cards, the homepage spotlight and the article header. */
export const projectMetaSchema = z.object({
  name: z.string().min(1),
  objective: z.string().min(1),
  status: z.string().min(1),
  stack: z.array(z.string().min(1)).min(1),
  aiTools: z.array(z.string().min(1)).min(1),
  timeInvested: z.string().min(1),
  repo: z.string().url().optional(),
  demo: z.string().url().optional(),
});

export type ProjectMeta = z.infer<typeof projectMetaSchema>;

export const frontmatterSchema = z.object({
  title: z.string().min(8).max(120),
  /** Doubles as the meta description, so keep it standalone and specific. */
  description: z.string().min(40).max(300),
  category: z.enum(CATEGORY_SLUGS),
  subcategory: z.string().optional(),
  articleType: z.enum(ARTICLE_TYPES),
  /** Optional deck/subtitle rendered under the headline. */
  dek: z.string().max(300).optional(),
  tags: z.array(z.string().min(1)).default([]),
  keywords: z.array(z.string().min(1)).default([]),
  publishedAt: isoDate,
  updatedAt: isoDate.optional(),
  /** Author slug, must exist in `src/content/authors`. */
  author: z.string().min(1),
  coverImage: z.string().optional(),
  coverImageAlt: z.string().optional(),
  coverPattern: z.enum(COVER_PATTERNS).default("grid"),
  featured: z.boolean().default(false),
  /** Manual editorial collection: shown as a pick, never as "most popular". */
  editorialPick: z.boolean().default(false),
  /** Manual starting-point flag for archive and start-here collections. */
  startHere: z.boolean().default(false),
  /** Editorially maintained reference. Never inferred automatically. */
  evergreen: z.boolean().default(false),
  /** Renders the affiliate disclosure block above the article body. */
  affiliateDisclosure: z.boolean().default(false),
  draft: z.boolean().default(false),
  /**
   * Marks placeholder content shipped with the starter. Sample articles render a
   * visible notice so nothing reads as a real first-hand result. Set it to false
   * (or delete the file) once real content replaces it.
   */
  sample: z.boolean().default(false),
  /** Explicit relationships, by slug. Beats guessing at "related posts". */
  related: z.array(z.string().min(1)).default([]),
  /**
   * Tools this article actually discusses. Used for related reading and search.
   * Comparisons also inherit `compared`; build logs also inherit `project.aiTools`.
   */
  tools: z.array(z.string().min(1)).default([]),
  /**
   * Editorial cluster slug (e.g. `cursor`, `agent-workflows`). Optional.
   * Tool hubs are derived from `tools` even when this is omitted.
   */
  cluster: z.string().min(2).max(60).optional(),
  /**
   * When the article was last checked against the current product. Displayed
   * as "Last reviewed" only when it differs from `publishedAt`. Does not
   * change automatically.
   */
  lastReviewedAt: isoDate.optional(),
  /** Editorial reminder interval in days. Never shown to readers. */
  reviewIntervalDays: z.number().int().min(30).max(730).optional(),
  /**
   * Direct answer for reviews, comparisons and decision guides. Omit on
   * narrative build logs and experiments unless the piece is question-led.
   */
  quickAnswer: z.string().min(24).max(400).optional(),
  /**
   * How the piece was produced. Shown as a trust line, not a credential.
   * Do not set `firsthand` on sample placeholders.
   */
  basis: z.enum(["firsthand", "research", "analysis", "mixed"]).optional(),
  audience: z.string().min(4).max(160).optional(),
  evidence: z
    .object({
      project: z.string().min(1).optional(),
      environment: z.string().min(1).optional(),
      toolVersion: z.string().min(1).optional(),
      model: z.string().min(1).optional(),
      task: z.string().min(1).optional(),
      period: z.string().min(1).optional(),
      humanIntervention: z.string().min(1).optional(),
      limitations: z.string().min(1).optional(),
    })
    .optional(),
  sources: z
    .array(
      z.object({
        title: z.string().min(3).max(180),
        href: z.string().url(),
        publisher: z.string().min(1).max(80).optional(),
        checked: isoDate.optional(),
      }),
    )
    .max(12)
    .optional(),
  project: projectMetaSchema.optional(),
  /** Comparison pages: the tools being weighed, in display order. */
  compared: z.array(z.string().min(1)).min(2).max(4).optional(),
  /** Experiment pages: the question the run was designed to answer. */
  question: z.string().max(180).optional(),
  /** Experiment pages: the outcome, in a few words. */
  result: z.string().max(120).optional(),
  /** One search concept this article is actually about. */
  primaryTopic: z.string().min(2).max(80).optional(),
  searchIntent: z
    .enum([
      "informational",
      "commercial",
      "comparison",
      "tutorial",
      "problem-solving",
    ])
    .optional(),
  /**
   * Visible FAQ, rendered after the body. FAQ structured data is emitted only
   * when this array is present and non-empty.
   */
  faq: z
    .array(
      z.object({
        question: z.string().min(8).max(180),
        answer: z.string().min(12).max(600),
      }),
    )
    .max(6)
    .optional(),
})
  .refine(
    (value) => !value.coverImage || Boolean(value.coverImageAlt),
    {
      message: "coverImageAlt is required when coverImage is set",
      path: ["coverImageAlt"],
    },
  );

export type Frontmatter = z.infer<typeof frontmatterSchema>;

export type Heading = {
  id: string;
  text: string;
  level: 2 | 3;
};

export type ReadingTime = {
  minutes: number;
  words: number;
  text: string;
};

export type Article = Frontmatter & {
  slug: string;
  /** Canonical path, e.g. `/reviews/cursor-review/`. */
  path: string;
  readingTime: ReadingTime;
  headings: Heading[];
};

export const authorSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  role: z.string().min(1),
  /** Short version used on cards and article bylines. */
  shortBio: z.string().min(1),
  /** Long version used on the author page and About page. */
  bio: z.array(z.string().min(1)).min(1),
  expertise: z.array(z.string().min(1)).min(1),
  /** Initials render in the CSS avatar when no photo is supplied. */
  initials: z.string().min(1).max(3),
  avatar: z.string().optional(),
  links: z
    .array(
      z.object({
        label: z.string().min(1),
        href: z.string().url(),
      }),
    )
    .default([]),
});

export type Author = z.infer<typeof authorSchema>;

export type SearchDocument = {
  title: string;
  description: string;
  path: string;
  category: string;
  categoryLabel: string;
  articleType: string;
  articleTypeLabel: string;
  tags: string[];
  keywords: string[];
  tools: string[];
  dek?: string;
  primaryTopic?: string;
  publishedAt: string;
  readingTime: string;
  sample: boolean;
};

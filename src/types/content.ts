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
  project: projectMetaSchema.optional(),
  /** Comparison pages: the tools being weighed, in display order. */
  compared: z.array(z.string().min(1)).min(2).max(4).optional(),
  /** Experiment pages: the question the run was designed to answer. */
  question: z.string().max(180).optional(),
  /** Experiment pages: the outcome, in a few words. */
  result: z.string().max(120).optional(),
});

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
  publishedAt: string;
  readingTime: string;
  sample: boolean;
};

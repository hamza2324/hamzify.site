import fs from "node:fs";
import path from "node:path";

import GithubSlugger from "github-slugger";
import matter from "gray-matter";
import readingTimeOf from "reading-time";

import { canonicalPath } from "@/lib/site-config";
import {
  CATEGORIES,
  type CategorySlug,
  type ArticleType,
} from "@/lib/taxonomy";
import { byNewest } from "@/lib/utils";
import {
  type Article,
  type Author,
  type Heading,
  authorSchema,
  frontmatterSchema,
} from "@/types/content";

/**
 * The content abstraction layer.
 *
 * Pages never touch the filesystem or frontmatter directly — they call the
 * query functions below. Swapping MDX-on-disk for a hosted CMS later means
 * reimplementing this one module against the same `Article` / `Author` types.
 *
 * Everything is read once at module load (i.e. during `next build`) and cached,
 * because a static export has no request lifecycle to worry about.
 */

const ARTICLES_DIR = path.join(process.cwd(), "src", "content", "articles");
const AUTHORS_DIR = path.join(process.cwd(), "src", "content", "authors");

function readDirSafe(dir: string, extension: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(extension))
    .filter((file) => !file.startsWith("_") && !file.startsWith("."))
    .sort();
}

/**
 * Pulls `##` / `###` headings for the table of contents.
 *
 * Ids are generated with the same slugger `rehype-slug` uses, so TOC links and
 * rendered heading anchors always agree. Fenced code blocks are skipped so a
 * comment like `# setup` in a shell snippet never becomes a heading.
 */
function extractHeadings(markdown: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  let inFence = false;

  for (const rawLine of markdown.split("\n")) {
    const line = rawLine.trimEnd();

    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{2,3})\s+(.*)$/.exec(line);
    if (!match) continue;

    const text = match[2]
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, "$1")
      .replace(/\{#[\w-]+\}\s*$/, "")
      .trim();

    if (!text) continue;

    headings.push({
      id: slugger.slug(text),
      text,
      level: match[1].length === 2 ? 2 : 3,
    });
  }

  return headings;
}

function parseArticle(fileName: string): Article {
  const slug = fileName.replace(/\.mdx?$/, "");
  const source = fs.readFileSync(path.join(ARTICLES_DIR, fileName), "utf8");
  const { data, content } = matter(source);

  const parsed = frontmatterSchema.safeParse(data);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n");
    throw new Error(
      `Invalid frontmatter in src/content/articles/${fileName}:\n${issues}`,
    );
  }

  const frontmatter = parsed.data;
  const stats = readingTimeOf(content);

  if (frontmatter.articleType === "build-log" && !frontmatter.project) {
    throw new Error(
      `src/content/articles/${fileName}: build-log articles need a "project" block in frontmatter.`,
    );
  }

  if (frontmatter.articleType === "comparison" && (frontmatter.compared?.length ?? 0) < 2) {
    throw new Error(
      `src/content/articles/${fileName}: comparison articles need a "compared" list of at least two tools.`,
    );
  }

  if (frontmatter.coverImage) {
    const imagePath = path.join(
      process.cwd(),
      "public",
      frontmatter.coverImage.replace(/^\//, ""),
    );
    if (!fs.existsSync(imagePath)) {
      throw new Error(
        `src/content/articles/${fileName}: coverImage "${frontmatter.coverImage}" does not exist in public/.`,
      );
    }
  }

  return {
    ...frontmatter,
    slug,
    path: canonicalPath(`/${frontmatter.category}/${slug}`),
    readingTime: {
      minutes: Math.max(1, Math.round(stats.minutes)),
      words: stats.words,
      text: `${Math.max(1, Math.round(stats.minutes))} min read`,
    },
    headings: extractHeadings(content),
  };
}

function loadArticles(): Article[] {
  const articles = readDirSafe(ARTICLES_DIR, ".mdx").map(parseArticle);

  const seenSlugs = new Set<string>();
  const seenTitles = new Set<string>();
  const seenDescriptions = new Set<string>();

  for (const article of articles) {
    if (seenSlugs.has(article.slug)) {
      throw new Error(`Duplicate article slug: ${article.slug}`);
    }
    seenSlugs.add(article.slug);

    const titleKey = article.title.trim().toLowerCase();
    if (seenTitles.has(titleKey)) {
      throw new Error(`Duplicate article title: "${article.title}"`);
    }
    seenTitles.add(titleKey);

    const descriptionKey = article.description.trim().toLowerCase();
    if (seenDescriptions.has(descriptionKey)) {
      throw new Error(`Duplicate article description on "${article.slug}"`);
    }
    seenDescriptions.add(descriptionKey);
  }

  for (const article of articles) {
    for (const related of article.related) {
      if (!articles.some((entry) => entry.slug === related)) {
        throw new Error(
          `Article "${article.slug}" related slug "${related}" does not exist.`,
        );
      }
    }
  }

  // Drafts never reach a build. Delete the flag to publish.
  return articles.filter((article) => !article.draft).sort(byNewest);
}

function loadAuthors(): Author[] {
  return readDirSafe(AUTHORS_DIR, ".json").map((fileName) => {
    const raw = fs.readFileSync(path.join(AUTHORS_DIR, fileName), "utf8");
    const parsed = authorSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      throw new Error(
        `Invalid author file src/content/authors/${fileName}: ${parsed.error.message}`,
      );
    }
    return parsed.data;
  });
}

const articles = loadArticles();
const authors = loadAuthors();
const authorsBySlug = new Map(authors.map((author) => [author.slug, author]));

// Fail loudly at build time rather than rendering an article with no byline.
for (const article of articles) {
  if (!authorsBySlug.has(article.author)) {
    throw new Error(
      `Article "${article.slug}" references unknown author "${article.author}".`,
    );
  }
}

/* -------------------------------------------------------------------------- */
/* Queries                                                                    */
/* -------------------------------------------------------------------------- */

export function getAllArticles(): Article[] {
  return articles;
}

export function getArticleSlugs(): string[] {
  return articles.map((article) => article.slug);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

export function getArticle(
  category: CategorySlug,
  slug: string,
): Article | undefined {
  const article = getArticleBySlug(slug);
  return article?.category === category ? article : undefined;
}

export function getArticlesByCategory(category: CategorySlug): Article[] {
  return articles.filter((article) => article.category === category);
}

export function getArticlesByType(...types: ArticleType[]): Article[] {
  return articles.filter((article) => types.includes(article.articleType));
}

export function getArticlesByAuthor(authorSlug: string): Article[] {
  return articles.filter((article) => article.author === authorSlug);
}

export function getLatestArticles(limit?: number): Article[] {
  return typeof limit === "number" ? articles.slice(0, limit) : articles;
}

/** The single hero story. Falls back to the newest article. */
export function getFeaturedArticle(): Article | undefined {
  return articles.find((article) => article.featured) ?? articles[0];
}

export function getAllAuthors(): Author[] {
  return authors;
}

export function getAuthor(slug: string): Author | undefined {
  return authorsBySlug.get(slug);
}

/** Throws if missing — only call for authors already validated at load time. */
export function requireAuthor(slug: string): Author {
  const author = authorsBySlug.get(slug);
  if (!author) throw new Error(`Unknown author: ${slug}`);
  return author;
}

const TOOL_STOPWORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "ai",
  "code",
  "tool",
  "tools",
  "coding",
]);

/**
 * Tools this article is actually about: explicit `tools`, comparison names,
 * and build-log `project.aiTools`.
 */
export function mentionedTools(article: Article): string[] {
  const names = [
    ...(article.tools ?? []),
    ...(article.compared ?? []),
    ...(article.project?.aiTools ?? []),
  ];
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const name of names) {
    const key = name.trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    unique.push(name.trim());
  }
  return unique;
}

function toolTokens(article: Article): Set<string> {
  const tokens = new Set<string>();
  for (const name of mentionedTools(article)) {
    const lower = name.toLowerCase();
    tokens.add(lower);
    for (const part of lower.split(/[\s/_-]+/)) {
      if (part.length > 2 && !TOOL_STOPWORDS.has(part)) tokens.add(part);
    }
  }
  return tokens;
}

const COMPLEMENTARY_TYPES: Record<ArticleType, ArticleType[]> = {
  review: ["comparison", "workflow", "guide", "resource", "build-log"],
  comparison: ["review", "workflow", "guide"],
  "build-log": ["experiment", "workflow", "review", "resource"],
  experiment: ["build-log", "workflow", "resource"],
  workflow: ["resource", "review", "experiment", "build-log", "guide"],
  guide: ["review", "comparison", "resource", "workflow"],
  resource: ["workflow", "guide", "review", "experiment"],
};

/**
 * Related content, chosen deliberately instead of at random.
 *
 * Explicit `related` slugs come first and always win. Remaining slots are
 * scored on shared topic, category, tags, tools, then complementary formats,
 * so a review links to comparisons of the same tool rather than to whatever
 * happens to be recent. The current article is never included.
 */
export function getRelatedArticles(article: Article, limit = 3): Article[] {
  const picked: Article[] = [];
  const taken = new Set<string>([article.slug]);

  for (const slug of article.related) {
    if (slug === article.slug) continue;
    const candidate = getArticleBySlug(slug);
    if (candidate && !taken.has(candidate.slug)) {
      picked.push(candidate);
      taken.add(candidate.slug);
    }
  }

  if (picked.length >= limit) return picked.slice(0, limit);

  const tags = new Set(article.tags.map((tag) => tag.toLowerCase()));
  const keywords = new Set(
    article.keywords.map((keyword) => keyword.toLowerCase()),
  );
  const tools = toolTokens(article);
  const topic = article.primaryTopic?.trim().toLowerCase();
  const complementary = new Set(COMPLEMENTARY_TYPES[article.articleType] ?? []);

  const scored = articles
    .filter((candidate) => !taken.has(candidate.slug))
    .map((candidate) => {
      let score = 0;

      if (topic) {
        const haystack = [
          candidate.primaryTopic ?? "",
          candidate.title,
          candidate.subcategory ?? "",
          ...candidate.tags,
        ]
          .join(" ")
          .toLowerCase();
        if (haystack.includes(topic)) score += 6;
      }

      if (article.cluster && candidate.cluster === article.cluster) score += 5;
      if (candidate.category === article.category) score += 4;
      if (
        candidate.subcategory &&
        candidate.subcategory === article.subcategory
      ) {
        score += 4;
      }

      score +=
        candidate.tags.filter((tag) => tags.has(tag.toLowerCase())).length * 3;

      const candidateTools = toolTokens(candidate);
      let sharedTools = 0;
      for (const token of candidateTools) {
        if (tools.has(token)) sharedTools += 1;
      }
      score += sharedTools * 5;

      score +=
        candidate.keywords.filter((keyword) =>
          keywords.has(keyword.toLowerCase()),
        ).length * 2;

      if (complementary.has(candidate.articleType)) score += 2;
      if (candidate.articleType === article.articleType) score += 1;

      return { candidate, score };
    })
    .filter((entry) => entry.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        Date.parse(b.candidate.publishedAt) -
          Date.parse(a.candidate.publishedAt),
    );

  for (const entry of scored) {
    if (picked.length >= limit) break;
    picked.push(entry.candidate);
  }

  return picked;
}

/** Previous / next in publication order, scoped to the same category. */
export function getArticleNeighbours(article: Article): {
  previous?: Article;
  next?: Article;
} {
  const siblings = getArticlesByCategory(article.category);
  const index = siblings.findIndex((entry) => entry.slug === article.slug);
  if (index === -1) return {};

  return {
    // `siblings` is newest-first, so the next one down the list is older.
    next: siblings[index - 1],
    previous: siblings[index + 1],
  };
}

/** Category slugs that currently have at least one published article. */
export function getPopulatedCategories(): CategorySlug[] {
  return (Object.keys(CATEGORIES) as CategorySlug[]).filter(
    (slug) => getArticlesByCategory(slug).length > 0,
  );
}

/** Every distinct tag with its usage count, most used first. */
export function getTagCounts(): Array<{ tag: string; count: number }> {
  const counts = new Map<string, number>();
  for (const article of articles) {
    for (const tag of article.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** Most recent `lastReviewedAt` / `updatedAt` / `publishedAt` across the archive. */
export function getLastContentUpdate(): Date {
  const timestamps = articles.map((article) =>
    Date.parse(
      article.lastReviewedAt ?? article.updatedAt ?? article.publishedAt,
    ),
  );
  return new Date(timestamps.length ? Math.max(...timestamps) : Date.now());
}

export function getEditorialPicks(limit = 4): Article[] {
  return articles.filter((article) => article.editorialPick).slice(0, limit);
}

export function getStartHereArticles(limit = 4): Article[] {
  return articles.filter((article) => article.startHere).slice(0, limit);
}

export function getEvergreenArticles(limit = 6): Article[] {
  return articles.filter((article) => article.evergreen).slice(0, limit);
}

/** Date shown as "Last reviewed". Never invented; omitted when it equals published. */
export function lastReviewedDate(article: Article): string | undefined {
  const candidate = article.lastReviewedAt ?? article.updatedAt;
  if (!candidate || candidate === article.publishedAt) return undefined;
  return candidate;
}

export function getArticlesByCluster(cluster: string): Article[] {
  return articles.filter((article) => article.cluster === cluster);
}

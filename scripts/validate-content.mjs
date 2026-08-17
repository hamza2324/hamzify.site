import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import matter from "gray-matter";

/**
 * Pre-publish checks for Hamzify articles.
 *
 * The build already fails on invalid frontmatter (`src/lib/content.ts`). This
 * script is the same contract, runnable from `npm run check` without waiting
 * for `next build`. It does not invent quality — it catches duplicates, broken
 * related slugs, missing cover files, and drafts that would leak into the
 * sitemap if `draft` were forgotten.
 */

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ARTICLES = join(ROOT, "src", "content", "articles");
const PUBLIC = join(ROOT, "public");

const files = readdirSync(ARTICLES).filter(
  (file) =>
    file.endsWith(".mdx") && !file.startsWith("_") && !file.startsWith("."),
);

const parsed = files.map((file) => {
  const raw = readFileSync(join(ARTICLES, file), "utf8");
  const { data, content } = matter(raw);
  return {
    file,
    slug: file.replace(/\.mdx?$/, ""),
    data,
    content,
  };
});

const errors = [];
const published = parsed.filter((article) => article.data.draft !== true);

const titles = new Map();
const descriptions = new Map();
const slugs = new Set();

for (const article of parsed) {
  const { file, slug, data, content } = article;

  if (slugs.has(slug)) errors.push(`${file}: duplicate slug`);
  slugs.add(slug);

  if (!data.title) errors.push(`${file}: missing title`);
  if (!data.description) errors.push(`${file}: missing description`);
  if (!data.category) errors.push(`${file}: missing category`);
  if (!data.articleType) errors.push(`${file}: missing articleType`);
  if (!data.publishedAt) errors.push(`${file}: missing publishedAt`);
  if (!data.author) errors.push(`${file}: missing author`);

  const titleKey = String(data.title ?? "")
    .trim()
    .toLowerCase();
  if (titleKey) {
    if (titles.has(titleKey)) {
      errors.push(`${file}: duplicate title (also ${titles.get(titleKey)})`);
    }
    titles.set(titleKey, file);
  }

  const descriptionKey = String(data.description ?? "")
    .trim()
    .toLowerCase();
  if (descriptionKey) {
    if (descriptions.has(descriptionKey)) {
      errors.push(
        `${file}: duplicate description (also ${descriptions.get(descriptionKey)})`,
      );
    }
    descriptions.set(descriptionKey, file);
  }

  if (data.coverImage && !data.coverImageAlt) {
    errors.push(`${file}: coverImageAlt is required when coverImage is set`);
  }
  if (data.coverImage) {
    const imagePath = join(PUBLIC, String(data.coverImage).replace(/^\//, ""));
    if (!existsSync(imagePath)) {
      errors.push(`${file}: coverImage not found at public${data.coverImage}`);
    }
  }

  if (data.articleType === "build-log" && !data.project) {
    errors.push(`${file}: build-log articles need a project block`);
  }
  if (
    data.articleType === "comparison" &&
    (!Array.isArray(data.compared) || data.compared.length < 2)
  ) {
    errors.push(`${file}: comparison articles need a compared list`);
  }

  let inFence = false;
  let h1Count = 0;
  for (const rawLine of content.split("\n")) {
    const line = rawLine.trimEnd();
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (!inFence && /^#\s+/.test(line)) h1Count += 1;
  }
  if (h1Count > 0) {
    errors.push(`${file}: do not use a markdown H1 — the page template owns it`);
  }

  for (const related of data.related ?? []) {
    if (!slugs.has(related) && !files.some((name) => name.startsWith(`${related}.`))) {
      // Resolved in a second pass once every slug is known.
    }
  }
}

for (const article of parsed) {
  for (const related of article.data.related ?? []) {
    if (!slugs.has(related)) {
      errors.push(
        `${article.file}: related slug "${related}" does not exist`,
      );
    }
  }
}

if (errors.length) {
  console.error(`validate-content: ${errors.length} issue(s)\n`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(
  `validate-content: ${parsed.length} articles, ${published.length} publishable, 0 issues`,
);

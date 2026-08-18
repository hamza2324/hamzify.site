import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import matter from "gray-matter";

/**
 * Lists published articles that may be due for an editorial review.
 *
 * Does not change dates. Does not fail the build. Reviews and comparisons
 * default to 90 days; other types default to 180 unless `reviewIntervalDays`
 * is set.
 */

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ARTICLES = join(ROOT, "src", "content", "articles");
const MS_DAY = 24 * 60 * 60 * 1000;

const files = readdirSync(ARTICLES).filter(
  (file) =>
    file.endsWith(".mdx") && !file.startsWith("_") && !file.startsWith("."),
);

const today = Date.now();
const due = [];

for (const file of files) {
  const { data } = matter(readFileSync(join(ARTICLES, file), "utf8"));
  if (data.draft === true) continue;

  const interval =
    data.reviewIntervalDays ??
    (data.articleType === "review" || data.articleType === "comparison"
      ? 90
      : 180);
  const checked = Date.parse(
    data.lastReviewedAt ?? data.updatedAt ?? data.publishedAt ?? "",
  );
  if (Number.isNaN(checked)) continue;

  const age = Math.floor((today - checked) / MS_DAY);
  if (age >= interval) {
    due.push({
      file,
      age,
      interval,
      last: data.lastReviewedAt ?? data.updatedAt ?? data.publishedAt,
    });
  }
}

if (due.length === 0) {
  console.log("review-due: nothing waiting");
  process.exit(0);
}

console.log(`review-due: ${due.length} article(s) past interval\n`);
for (const item of due) {
  console.log(
    `  - ${item.file} (${item.age} days since ${item.last}, interval ${item.interval})`,
  );
}

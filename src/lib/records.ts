import { getAllArticles } from "@/lib/content";
import { ARTICLE_TYPE_META } from "@/lib/taxonomy";
import type { Article } from "@/types/content";

/**
 * Archive numbering for experiments and build logs.
 *
 * Numbers are chronological within a format, so "Experiment #02" always means
 * the second experiment published, not a position in the current listing.
 */

function peersOf(article: Article): Article[] {
  return getAllArticles()
    .filter((item) => item.articleType === article.articleType)
    .slice()
    .sort(
      (a, b) => Date.parse(a.publishedAt) - Date.parse(b.publishedAt),
    );
}

export function recordNumber(article: Article): number {
  return peersOf(article).findIndex((item) => item.slug === article.slug) + 1;
}

export function formatRecordLabel(article: Article): string {
  const n = String(recordNumber(article)).padStart(2, "0");

  if (article.articleType === "build-log") return `Build log #${n}`;
  if (article.articleType === "experiment") return `Experiment #${n}`;

  return `${ARTICLE_TYPE_META[article.articleType].label} #${n}`;
}

/** Pulls the two sides of a comparison from frontmatter, or from a "X vs Y" title. */
export function comparisonSides(article: Article): [string, string] | null {
  if (article.compared && article.compared.length >= 2) {
    return [article.compared[0], article.compared[1]];
  }

  const parts = article.title.split(/\s+vs\.?\s+/i);
  if (parts.length < 2) return null;

  const left = parts[0].replace(/:.*$/, "").trim();
  const right = parts[1].replace(/:.*$/, "").trim();
  return left && right ? [left, right] : null;
}

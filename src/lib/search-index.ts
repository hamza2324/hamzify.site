import { getAllArticles } from "@/lib/content";
import { ARTICLE_TYPE_META, CATEGORIES } from "@/lib/taxonomy";
import type { SearchDocument } from "@/types/content";

/**
 * Builds the search index at build time.
 *
 * Kept separate from `lib/search.ts` because this module reads content from disk
 * and must never end up in a client bundle. The search UI receives the result as
 * a serialisable prop, so search needs no backend and no network request.
 */
export function buildSearchIndex(): SearchDocument[] {
  return getAllArticles().map((article) => ({
    title: article.title,
    description: article.description,
    path: article.path,
    category: article.category,
    categoryLabel: CATEGORIES[article.category].label,
    articleType: article.articleType,
    articleTypeLabel: ARTICLE_TYPE_META[article.articleType].label,
    tags: article.tags,
    publishedAt: article.publishedAt,
    readingTime: article.readingTime.text,
    sample: article.sample,
  }));
}

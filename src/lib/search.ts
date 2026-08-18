import type { SearchDocument } from "@/types/content";

/**
 * The query engine.
 *
 * Deliberately free of any import that touches the filesystem: this module runs
 * in the browser, and the index is handed to it as data by the server. The
 * index itself is built in `lib/search-index.ts`.
 *
 * The migration path is the same shape: `searchDocuments` is a pure function
 * over `SearchDocument[]`, so moving to Algolia or Typesense later means
 * replacing this one function with an async call and leaving the UI untouched.
 */

/** Field weights. Title matches should clearly beat a tag match. */
const WEIGHTS = {
  title: 12,
  tool: 8,
  tag: 5,
  keyword: 5,
  description: 4,
  topic: 6,
  category: 3,
  type: 3,
} as const;

function normalize(value: string): string {
  return value.toLowerCase().normalize("NFKD");
}

function scoreDocument(document: SearchDocument, terms: string[]): number {
  const title = normalize(document.title);
  const description = normalize(document.description);
  const dek = normalize(document.dek ?? "");
  const topic = normalize(document.primaryTopic ?? "");
  const tags = document.tags.map(normalize);
  const keywords = document.keywords.map(normalize);
  const tools = document.tools.map(normalize);
  const category = normalize(document.categoryLabel);
  const type = normalize(document.articleTypeLabel);

  let score = 0;

  for (const term of terms) {
    let matched = false;

    if (title.includes(term)) {
      // A prefix match on the title is the strongest possible signal.
      score += title.startsWith(term) ? WEIGHTS.title * 1.5 : WEIGHTS.title;
      matched = true;
    }
    if (tools.some((tool) => tool.includes(term))) {
      score += WEIGHTS.tool;
      matched = true;
    }
    if (topic.includes(term)) {
      score += WEIGHTS.topic;
      matched = true;
    }
    if (description.includes(term) || dek.includes(term)) {
      score += WEIGHTS.description;
      matched = true;
    }
    if (tags.some((tag) => tag.includes(term))) {
      score += WEIGHTS.tag;
      matched = true;
    }
    if (keywords.some((keyword) => keyword.includes(term))) {
      score += WEIGHTS.keyword;
      matched = true;
    }
    if (category.includes(term)) {
      score += WEIGHTS.category;
      matched = true;
    }
    if (type.includes(term)) {
      score += WEIGHTS.type;
      matched = true;
    }

    // Every term has to hit something, so multi-word queries narrow rather
    // than widen the result set.
    if (!matched) return 0;
  }

  return score;
}

export type SearchResult = SearchDocument & { score: number };

export function searchDocuments(
  query: string,
  documents: SearchDocument[],
  limit = 40,
): SearchResult[] {
  const terms = normalize(query)
    .split(/\s+/)
    .map((term) => term.trim())
    .filter((term) => term.length > 1);

  if (terms.length === 0) return [];

  return documents
    .map((document) => ({ ...document, score: scoreDocument(document, terms) }))
    .filter((result) => result.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
    )
    .slice(0, limit);
}

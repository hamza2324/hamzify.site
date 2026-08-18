import { getAllArticles, mentionedTools } from "@/lib/content";
import {
  TOOL_ENTITIES,
  getToolEntity,
  resolveToolEntity,
  toolHubPath,
  type ToolEntity,
} from "@/lib/entities";
import { ARTICLE_TYPE_META, type ArticleType } from "@/lib/taxonomy";
import type { Article } from "@/types/content";

/**
 * Tool coverage hubs.
 *
 * `/tools` remains The Lab (Hamzify-built utilities). Vendor coverage lives
 * under `/ai-coding-tools/<tool>/` so lab slugs and product names never collide.
 *
 * A hub is generated only when at least two published articles mention the
 * tool. One passing mention does not earn a page.
 */

export const MIN_ARTICLES_FOR_TOOL_HUB = 2;

const TYPE_ORDER: ArticleType[] = [
  "review",
  "comparison",
  "build-log",
  "experiment",
  "workflow",
  "guide",
  "resource",
];

export type ToolHubGroup = {
  type: ArticleType;
  label: string;
  articles: Article[];
};

export type ToolHub = {
  entity: ToolEntity;
  path: string;
  articles: Article[];
  groups: ToolHubGroup[];
};

export function entitiesMentionedIn(article: Article): ToolEntity[] {
  const found = new Map<string, ToolEntity>();
  for (const name of mentionedTools(article)) {
    const entity = resolveToolEntity(name);
    if (entity) found.set(entity.slug, entity);
  }
  if (article.cluster) {
    const fromCluster = getToolEntity(article.cluster);
    if (fromCluster) found.set(fromCluster.slug, fromCluster);
  }
  return [...found.values()];
}

export function articlesForTool(slug: string): Article[] {
  return getAllArticles().filter((article) =>
    entitiesMentionedIn(article).some((entity) => entity.slug === slug),
  );
}

function groupsFor(articles: Article[]): ToolHubGroup[] {
  return TYPE_ORDER.map((type) => ({
    type,
    label: ARTICLE_TYPE_META[type].label,
    articles: articles.filter((article) => article.articleType === type),
  })).filter((group) => group.articles.length > 0);
}

export function getPublishedToolHubs(): ToolHub[] {
  return TOOL_ENTITIES.map((entity) => {
    const articles = articlesForTool(entity.slug);
    return {
      entity,
      path: toolHubPath(entity.slug),
      articles,
      groups: groupsFor(articles),
    };
  }).filter((hub) => hub.articles.length >= MIN_ARTICLES_FOR_TOOL_HUB);
}

export function getToolHub(slug: string): ToolHub | undefined {
  return getPublishedToolHubs().find((hub) => hub.entity.slug === slug);
}

export function hubsForArticle(article: Article): ToolHub[] {
  const slugs = new Set(entitiesMentionedIn(article).map((entity) => entity.slug));
  return getPublishedToolHubs().filter((hub) => slugs.has(hub.entity.slug));
}

export function sameProjectArticles(article: Article, limit = 3): Article[] {
  const project = article.project?.name.trim().toLowerCase();
  if (!project) return [];

  return getAllArticles()
    .filter(
      (candidate) =>
        candidate.slug !== article.slug &&
        candidate.project?.name.trim().toLowerCase() === project,
    )
    .slice(0, limit);
}

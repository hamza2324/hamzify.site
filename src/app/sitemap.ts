import type { MetadataRoute } from "next";

import {
  getAllArticles,
  getAllAuthors,
  getArticlesByAuthor,
  getArticlesByCategory,
  getLastContentUpdate,
} from "@/lib/content";
import { ogImagePath, ogNames } from "@/lib/og-paths";
import { POLICY_PAGES, POLICY_SLUGS } from "@/lib/pages";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import { CATEGORY_SLUGS, HUB_PAGES } from "@/lib/taxonomy";

/**
 * Canonical sitemap for every indexable URL.
 *
 * Drafts are already filtered by the content layer. `/search` is omitted because
 * it is `noindex`. Article entries include their Open Graph image so crawlers
 * can associate a real bitmap with the page.
 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();
  const newestOverall = getLastContentUpdate();

  const modifiedOf = (list: typeof articles): Date =>
    list.length
      ? new Date(
          Math.max(
            ...list.map((article) =>
              Date.parse(article.updatedAt ?? article.publishedAt),
            ),
          ),
        )
      : newestOverall;

  const home: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: newestOverall,
      changeFrequency: "weekly",
      priority: 1,
      images: [absoluteUrl(siteConfig.brand.logo)],
    },
  ];

  const hubs: MetadataRoute.Sitemap = HUB_PAGES.map((hub) => ({
    url: absoluteUrl(`/${hub.slug}`),
      lastModified: newestOverall,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categories: MetadataRoute.Sitemap = CATEGORY_SLUGS.map((slug) => ({
    url: absoluteUrl(`/${slug}`),
    lastModified: modifiedOf(getArticlesByCategory(slug)),
    changeFrequency: "weekly",
    priority: 0.8,
    images: [absoluteUrl(ogImagePath(ogNames.category(slug)))],
  }));

  const posts: MetadataRoute.Sitemap = articles.map((article) => ({
    url: absoluteUrl(article.path),
    lastModified: new Date(article.updatedAt ?? article.publishedAt),
    changeFrequency: "monthly",
    priority: article.featured ? 0.9 : 0.7,
    images: [absoluteUrl(ogImagePath(ogNames.article(article.slug)))],
  }));

  const authors: MetadataRoute.Sitemap = getAllAuthors()
    .map((author) => ({ author, list: getArticlesByAuthor(author.slug) }))
    .filter((entry) => entry.list.length > 0)
    .map((entry) => ({
      url: absoluteUrl(`/author/${entry.author.slug}`),
      lastModified: modifiedOf(entry.list),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));

  const staticPages: MetadataRoute.Sitemap = [
    { path: "/about", priority: 0.7 },
    { path: "/contact", priority: 0.5 },
    { path: "/rss.xml", priority: 0.4 },
    { path: "/llms.txt", priority: 0.4 },
  ].map((page) => ({
    url: absoluteUrl(page.path),
    lastModified: newestOverall,
    changeFrequency: "yearly" as const,
    priority: page.priority,
  }));

  const policies: MetadataRoute.Sitemap = POLICY_SLUGS.map((slug) => ({
    url: absoluteUrl(`/${slug}`),
    lastModified: new Date(POLICY_PAGES[slug].lastReviewed),
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  const seen = new Set<string>();
  return [
    ...home,
    ...hubs,
    ...categories,
    ...posts,
    ...authors,
    ...staticPages,
    ...policies,
  ].filter((entry) => {
    if (seen.has(entry.url)) return false;
    seen.add(entry.url);
    return true;
  });
}

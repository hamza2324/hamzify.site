import { ogImagePath, ogNames } from "@/lib/og-paths";
import { SITE_KEYWORDS } from "@/lib/seo";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import { CATEGORIES } from "@/lib/taxonomy";
import { toIsoDate } from "@/lib/utils";
import type { Article, Author } from "@/types/content";

/**
 * JSON-LD builders.
 *
 * Ground rules, applied deliberately:
 * - every graph node describes something the page actually shows;
 * - no ratings, aggregate ratings, review scores or FAQ blocks are emitted,
 *   because Hamzify does not publish numeric scores and inventing them to win a
 *   rich result is exactly the kind of markup that gets sites penalised;
 * - all URLs go through `absoluteUrl()` so they match the canonical tag;
 * - `@id` values are stable so nodes can reference each other.
 */

type JsonLdNode = Record<string, unknown>;

const ORGANIZATION_ID = `${siteConfig.url}/#organization`;
const WEBSITE_ID = `${siteConfig.url}/#website`;

export function organizationNode(): JsonLdNode {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: siteConfig.name,
    url: absoluteUrl("/"),
    description: siteConfig.description,
    knowsAbout: [...SITE_KEYWORDS],
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl(siteConfig.brand.logo),
      width: 1024,
      height: 1024,
      caption: `${siteConfig.name} logo`,
    },
    sameAs: [siteConfig.social.x, siteConfig.social.github],
  };
}

export function webSiteNode(): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: siteConfig.name,
    alternateName: siteConfig.tagline,
    url: absoluteUrl("/"),
    description: siteConfig.description,
    inLanguage: siteConfig.lang,
    keywords: SITE_KEYWORDS.join(", "),
    about: SITE_KEYWORDS.map((name) => ({ "@type": "Thing", name })),
    publisher: { "@id": ORGANIZATION_ID },
    // The site search really does accept `?q=` and filter the archive.
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${absoluteUrl("/search")}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function personNode(author: Author): JsonLdNode {
  return {
    "@type": "Person",
    "@id": `${absoluteUrl(`/author/${author.slug}`)}#person`,
    name: author.name,
    url: absoluteUrl(`/author/${author.slug}`),
    jobTitle: author.role,
    description: author.shortBio,
    knowsAbout: author.expertise,
    ...(author.links.length
      ? { sameAs: author.links.map((link) => link.href) }
      : {}),
  };
}

export function breadcrumbNode(
  items: Array<{ name: string; path: string }>,
): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function webPageNode({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): JsonLdNode {
  return {
    "@type": "WebPage",
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name: title,
    description,
    inLanguage: siteConfig.lang,
    isPartOf: { "@id": WEBSITE_ID },
  };
}

export function collectionPageNode({
  title,
  description,
  path,
  articles,
}: {
  title: string;
  description: string;
  path: string;
  articles: Article[];
}): JsonLdNode {
  return {
    "@type": "CollectionPage",
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name: title,
    description,
    inLanguage: siteConfig.lang,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: articles.length,
      itemListElement: articles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(article.path),
        name: article.title,
      })),
    },
  };
}

/**
 * `BlogPosting` for editorial pieces. `articleSection` mirrors the visible
 * category and `wordCount` comes from the same reading-time calculation shown
 * to readers, so the markup and the page agree.
 */
export function blogPostingNode(article: Article, author: Author): JsonLdNode {
  const url = absoluteUrl(article.path);

  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntityOfPage: { "@id": `${url}#webpage` },
    url,
    headline: article.title,
    description: article.description,
    inLanguage: siteConfig.lang,
    datePublished: toIsoDate(article.publishedAt),
    dateModified: toIsoDate(
      article.lastReviewedAt ?? article.updatedAt ?? article.publishedAt,
    ),
    author: { "@id": `${absoluteUrl(`/author/${author.slug}`)}#person` },
    publisher: { "@id": ORGANIZATION_ID },
    articleSection: CATEGORIES[article.category].label,
    wordCount: article.readingTime.words,
    ...(article.keywords.length || article.tags.length
      ? { keywords: [...new Set([...article.keywords, ...article.tags])] }
      : {}),
    ...(article.primaryTopic ? { about: article.primaryTopic } : {}),
    image: [absoluteUrl(ogImagePath(ogNames.article(article.slug)))],
  };
}

/** FAQPage — only call when the same questions are visible on the page. */
export function faqPageNode(
  article: Article,
): JsonLdNode | null {
  if (!article.faq?.length) return null;

  return {
    "@type": "FAQPage",
    "@id": `${absoluteUrl(article.path)}#faq`,
    mainEntity: article.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function profilePageNode(
  author: Author,
  articles: Article[],
): JsonLdNode {
  const url = absoluteUrl(`/author/${author.slug}`);

  return {
    "@type": "ProfilePage",
    "@id": `${url}#webpage`,
    url,
    name: `${author.name} — ${siteConfig.name}`,
    inLanguage: siteConfig.lang,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: { "@id": `${url}#person` },
    hasPart: articles.map((article) => ({
      "@type": "BlogPosting",
      "@id": `${absoluteUrl(article.path)}#article`,
      headline: article.title,
      url: absoluteUrl(article.path),
      datePublished: toIsoDate(article.publishedAt),
    })),
  };
}

/** Wraps nodes into a single `@graph` document. */
export function buildGraph(nodes: JsonLdNode[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}

/**
 * Serialises JSON-LD for inline embedding.
 *
 * `<` is escaped so a stray `</script>` inside content can never break out of
 * the script element.
 */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

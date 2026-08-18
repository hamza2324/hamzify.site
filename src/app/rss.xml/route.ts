import { getAllArticles, requireAuthor } from "@/lib/content";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import { ARTICLE_TYPE_META, CATEGORIES } from "@/lib/taxonomy";

/**
 * RSS 2.0 feed.
 *
 * `force-static` so the route is emitted as a file by `next build` with
 * `output: "export"` — the feed is generated once at build time, exactly like
 * every other page.
 *
 * Full descriptions rather than full content: the feed is a table of contents
 * that sends readers to the article, where the code blocks and editorial blocks
 * actually render.
 */
export const dynamic = "force-static";

/** Escapes the five XML entities. Every interpolated value goes through this. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const articles = getAllArticles();
  const updated = articles[0]
    ? new Date(articles[0].updatedAt ?? articles[0].publishedAt)
    : new Date();

  const items = articles
    .map((article) => {
      const author = requireAuthor(article.author);
      const url = absoluteUrl(article.path);
      const categories = [
        CATEGORIES[article.category].label,
        ARTICLE_TYPE_META[article.articleType].label,
      ];

      return [
        "    <item>",
        `      <title>${escapeXml(article.title)}</title>`,
        `      <link>${escapeXml(url)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
        `      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>`,
        `      <dc:creator>${escapeXml(author.name)}</dc:creator>`,
        ...categories.map(
          (category) => `      <category>${escapeXml(category)}</category>`,
        ),
        `      <description>${escapeXml(article.dek ?? article.description)}</description>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">',
    "  <channel>",
    `    <title>${escapeXml(`${siteConfig.name} — ${siteConfig.tagline}`)}</title>`,
    `    <link>${escapeXml(absoluteUrl("/"))}</link>`,
    `    <description>${escapeXml(siteConfig.description)}</description>`,
    `    <language>en-us</language>`,
    `    <lastBuildDate>${updated.toUTCString()}</lastBuildDate>`,
    `    <atom:link href="${escapeXml(absoluteUrl("/rss.xml"))}" rel="self" type="application/rss+xml" />`,
    items,
    "  </channel>",
    "</rss>",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}

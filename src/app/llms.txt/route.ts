import { getAllArticles } from "@/lib/content";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import { CATEGORIES, HUB_PAGES } from "@/lib/taxonomy";

/**
 * llms.txt — a crawlable map for generative engines.
 *
 * Written as a static file at build time (`force-static` + `output: "export"`).
 * `scripts/write-seo-files.mjs` overwrites the emitted path if Next lands it as
 * a directory, the same way it does for sitemap.xml on GitHub Pages.
 */
export const dynamic = "force-static";

export async function GET() {
  const articles = getAllArticles();
  const lines = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    "Hamzify is an independent editorial publication about AI-assisted software development. Articles are written from first-hand tests: stated tool versions, stated tasks, and failures included.",
    "",
    `Site: ${absoluteUrl("/")}`,
    `Sitemap: ${absoluteUrl("/sitemap.xml")}`,
    `RSS: ${absoluteUrl("/rss.xml")}`,
    "",
    "## Topics",
    "",
    "- AI coding tools (Cursor, GitHub Copilot, Claude Code)",
    "- Vibe coding and prompt-to-product experiments",
    "- Build logs from shipping software with coding agents",
    "- AI pair programming and code-review workflows",
    "- Context engineering for coding agents",
    "",
    "## Articles",
    "",
    ...articles.map((article) => {
      const url = absoluteUrl(article.path);
      return `- [${article.title}](${url}): ${article.description}`;
    }),
    "",
    "## Sections",
    "",
    ...HUB_PAGES.map(
      (hub) =>
        `- [${hub.label}](${absoluteUrl(`/${hub.slug}`)}): ${hub.description}`,
    ),
    ...Object.values(CATEGORIES).map(
      (category) =>
        `- [${category.label}](${absoluteUrl(`/${category.slug}`)}): ${category.description}`,
    ),
    `- [About](${absoluteUrl("/about/")})`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}

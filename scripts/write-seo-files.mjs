import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import matter from "gray-matter";

/**
 * Writes crawler files GitHub Pages can actually serve.
 *
 * Next's metadata sitemap sometimes lands as `out/sitemap.xml/index.html` on
 * Linux (a directory), which GitHub Pages then 500s at `/sitemap.xml`. This
 * script always replaces that path with a real XML file, and writes robots.txt
 * plus llms.txt beside it.
 */

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "out");
const ARTICLES = join(ROOT, "src", "content", "articles");
const ORIGIN = "https://hamzify.site";

function isoDay(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10);
  return date.toISOString().slice(0, 10);
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function writeFile(path, contents) {
  if (existsSync(path)) {
    const info = statSync(path);
    if (info.isDirectory()) rmSync(path, { recursive: true, force: true });
  }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, contents, "utf8");
}

function loadArticles() {
  if (!existsSync(ARTICLES)) return [];
  return readdirSync(ARTICLES)
    .filter((file) => file.endsWith(".mdx"))
    .filter((file) => !file.startsWith("_") && !file.startsWith("."))
    .map((file) => {
      const raw = readFileSync(join(ARTICLES, file), "utf8");
      const { data } = matter(raw);
      return {
        slug: file.replace(/\.mdx?$/, ""),
        ...data,
      };
    })
    .filter((article) => article.draft !== true)
    .sort(
      (a, b) =>
        Date.parse(b.updatedAt ?? b.publishedAt ?? 0) -
        Date.parse(a.updatedAt ?? a.publishedAt ?? 0),
    );
}

function urlEntry({ loc, lastmod, changefreq, priority, image }) {
  const lines = [
    "  <url>",
    `    <loc>${escapeXml(loc)}</loc>`,
    lastmod ? `    <lastmod>${isoDay(lastmod)}</lastmod>` : "",
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : "",
    priority != null ? `    <priority>${priority.toFixed(1)}</priority>` : "",
  ].filter(Boolean);

  if (image) {
    lines.push(
      "    <image:image>",
      `      <image:loc>${escapeXml(image.loc)}</image:loc>`,
      image.title
        ? `      <image:title>${escapeXml(image.title)}</image:title>`
        : "",
      "    </image:image>",
    );
  }

  lines.push("  </url>");
  return lines.filter(Boolean).join("\n");
}

function lastmodForCategory(slug, categoryLastmod, newest) {
  const stamp = categoryLastmod.get(slug);
  return stamp ? new Date(stamp) : newest;
}

function buildSitemap(articles) {
  const newest = articles[0]?.updatedAt ?? articles[0]?.publishedAt ?? new Date();

  const categoryLastmod = new Map();
  for (const article of articles) {
    const key = article.category;
    const stamp = Date.parse(article.updatedAt ?? article.publishedAt ?? 0);
    const prev = categoryLastmod.get(key) ?? 0;
    if (stamp > prev) categoryLastmod.set(key, stamp);
  }

  const categories = [
    ["vibe-coding", "Vibe coding experiments"],
    ["build-logs", "AI agent build logs"],
    ["workflows", "AI development workflows"],
    ["reviews", "AI coding tool reviews"],
    ["compare", "AI coding tool comparisons"],
    ["resources", "AI coding resources"],
  ];

  const staticPages = [
    {
      path: "/",
      priority: 1,
      changefreq: "weekly",
      lastmod: newest,
      image: { loc: `${ORIGIN}/brand/hamzify-logo.jpg`, title: "Hamzify" },
    },
    { path: "/latest/", priority: 0.9, changefreq: "weekly", lastmod: newest },
    {
      path: "/ai-coding-tools/",
      priority: 0.9,
      changefreq: "weekly",
      lastmod: newest,
    },
    { path: "/tools/", priority: 0.6, changefreq: "weekly", lastmod: newest },
    ...categories.map(([slug, title]) => ({
      path: `/${slug}/`,
      priority: 0.8,
      changefreq: "weekly",
      lastmod: lastmodForCategory(slug, categoryLastmod, newest),
      image: {
        loc: `${ORIGIN}/og/category-${slug}.png`,
        title,
      },
    })),
    { path: "/about/", priority: 0.7, changefreq: "yearly", lastmod: newest },
    { path: "/contact/", priority: 0.5, changefreq: "yearly", lastmod: newest },
    {
      path: "/author/hamza/",
      priority: 0.5,
      changefreq: "monthly",
      lastmod: newest,
    },
    {
      path: "/editorial-policy/",
      priority: 0.3,
      changefreq: "yearly",
      lastmod: "2026-08-16",
    },
    {
      path: "/affiliate-disclosure/",
      priority: 0.3,
      changefreq: "yearly",
      lastmod: "2026-08-16",
    },
    {
      path: "/corrections-policy/",
      priority: 0.3,
      changefreq: "yearly",
      lastmod: "2026-08-16",
    },
    { path: "/privacy/", priority: 0.3, changefreq: "yearly", lastmod: "2026-08-16" },
    { path: "/terms/", priority: 0.3, changefreq: "yearly", lastmod: "2026-08-16" },
    { path: "/rss.xml", priority: 0.4, changefreq: "weekly", lastmod: newest },
    { path: "/llms.txt", priority: 0.4, changefreq: "weekly", lastmod: newest },
  ];

  const urls = [
    ...staticPages.map((page) =>
      urlEntry({
        loc: `${ORIGIN}${page.path}`,
        lastmod: page.lastmod ?? newest,
        changefreq: page.changefreq,
        priority: page.priority,
        image: page.image,
      }),
    ),
    ...articles.map((article) =>
      urlEntry({
        loc: `${ORIGIN}/${article.category}/${article.slug}/`,
        lastmod: article.updatedAt ?? article.publishedAt,
        changefreq: "monthly",
        priority: article.featured ? 0.9 : 0.7,
        image: {
          loc: `${ORIGIN}/og/article-${article.slug}.png`,
          title: article.title,
        },
      }),
    ),
  ];

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");
}

function buildRobots() {
  return [
    "User-agent: *",
    "Allow: /",
    "Disallow: /search/",
    "",
    "User-agent: Googlebot",
    "Allow: /",
    "",
    "User-agent: Bingbot",
    "Allow: /",
    "",
    "User-agent: GPTBot",
    "Allow: /",
    "",
    "User-agent: ChatGPT-User",
    "Allow: /",
    "",
    "User-agent: ClaudeBot",
    "Allow: /",
    "",
    "User-agent: PerplexityBot",
    "Allow: /",
    "",
    "User-agent: Google-Extended",
    "Allow: /",
    "",
    `Sitemap: ${ORIGIN}/sitemap.xml`,
    `Host: hamzify.site`,
    "",
    `# Generative engines: ${ORIGIN}/llms.txt`,
    "",
  ].join("\n");
}

function buildLlms(articles) {
  const lines = [
    "# Hamzify",
    "",
    "> Practical AI for people who build. Hands-on reviews of AI coding tools, real AI agent build logs, vibe coding experiments, and development workflows.",
    "",
    "Hamzify is an independent editorial publication about AI-assisted software development. Articles are written from first-hand tests: stated tool versions, stated tasks, and failures included.",
    "",
    `Site: ${ORIGIN}/`,
    `Sitemap: ${ORIGIN}/sitemap.xml`,
    `RSS: ${ORIGIN}/rss.xml`,
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
  ];

  for (const article of articles) {
    const url = `${ORIGIN}/${article.category}/${article.slug}/`;
    lines.push(`- [${article.title}](${url}): ${article.description}`);
  }

  lines.push(
    "",
    "## Sections",
    "",
    `- [Latest](${ORIGIN}/latest/): full archive, newest first`,
    `- [AI coding tools](${ORIGIN}/ai-coding-tools/): reviews and comparisons`,
    `- [Vibe coding](${ORIGIN}/vibe-coding/): AI-assisted building experiments`,
    `- [Build logs](${ORIGIN}/build-logs/): records of real projects`,
    `- [Workflows](${ORIGIN}/workflows/): repeatable AI development sequences`,
    `- [Reviews](${ORIGIN}/reviews/): hands-on tool tests`,
    `- [Comparisons](${ORIGIN}/compare/): same-task tool comparisons`,
    `- [Resources](${ORIGIN}/resources/): checklists and guides`,
    `- [About](${ORIGIN}/about/)`,
    "",
  );

  return lines.join("\n");
}

if (!existsSync(OUT)) {
  console.error("write-seo-files: no out/ directory — run next build first.");
  process.exit(1);
}

const articles = loadArticles();
writeFile(join(OUT, "sitemap.xml"), buildSitemap(articles));
writeFile(join(OUT, "robots.txt"), buildRobots());
writeFile(join(OUT, "llms.txt"), buildLlms(articles));

console.log(
  `write-seo-files: sitemap.xml (${articles.length} articles), robots.txt, llms.txt`,
);

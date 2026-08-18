import type { Metadata } from "next";

import { BuildSpotlight } from "@/components/home/build-spotlight";
import { EditorialSignal } from "@/components/home/editorial-signal";
import { FeaturedWorkflow } from "@/components/home/featured-workflow";
import { Hero } from "@/components/home/hero";
import { HomePicks } from "@/components/home/home-picks";
import { LabPreview } from "@/components/home/lab-preview";
import { LatestExperiments } from "@/components/home/latest-experiments";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { ResourcesPreview } from "@/components/home/resources-preview";
import { StartHere } from "@/components/home/start-here";
import { ToolCoverage } from "@/components/home/tool-coverage";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getArticlesByCategory,
  getArticlesByType,
  getEditorialPicks,
  getFeaturedArticle,
  getLatestArticles,
} from "@/lib/content";
import { createMetadata } from "@/lib/metadata";
import { collectionPageNode, organizationNode, webSiteNode } from "@/lib/schema";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = createMetadata({
  title: siteConfig.defaultTitle,
  description: siteConfig.description,
  path: "/",
  titleIsAbsolute: true,
  keywords: [
    "AI coding tools",
    "vibe coding",
    "AI agent build logs",
    "Cursor review",
    "GitHub Copilot",
    "Claude Code",
  ],
});

/**
 * Homepage.
 *
 * Composed entirely of server components except the newsletter form, and every
 * section takes its content as a prop from the queries below — so an empty
 * category degrades to a hidden section rather than an empty grid.
 */
export default function HomePage() {
  const featured = getFeaturedArticle();

  const experiments = getLatestArticles()
    .filter((article) => article.slug !== featured?.slug)
    .filter((article) =>
      ["experiment", "build-log"].includes(article.articleType),
    )
    .slice(0, 5);

  const review = getArticlesByType("review")[0];
  const comparison = getArticlesByType("comparison")[0];
  const guide = getArticlesByType("guide", "resource")[0];
  const toolCoverage = [review, comparison, guide].filter(Boolean);

  const buildLogs = getArticlesByCategory("build-logs").slice(0, 2);
  const workflow = getArticlesByCategory("workflows")[0];
  const picks = getEditorialPicks(3).filter(
    (article) => article.slug !== featured?.slug,
  );
  const resources = getArticlesByCategory("resources")
    .filter(
      (article) =>
        !toolCoverage.some((shown) => shown?.slug === article.slug),
    )
    .slice(0, 3);

  return (
    <>
      <JsonLd
        nodes={[
          organizationNode(),
          webSiteNode(),
          // The homepage is a list of the pieces it links to, and the ItemList
          // below names exactly the articles rendered on it.
          collectionPageNode({
            title: siteConfig.defaultTitle,
            description: siteConfig.description,
            path: "/",
            articles: [featured, ...experiments, ...toolCoverage].filter(
              (article): article is NonNullable<typeof article> =>
                article !== undefined,
            ),
          }),
        ]}
      />

      {featured ? <Hero article={featured} /> : null}
      <EditorialSignal />
      <StartHere />
      <HomePicks articles={picks} />
      <LatestExperiments articles={experiments} />
      <ToolCoverage articles={toolCoverage} />
      <BuildSpotlight articles={buildLogs} />
      {workflow ? <FeaturedWorkflow article={workflow} /> : null}
      <ResourcesPreview articles={resources} />
      <LabPreview />
      <NewsletterSection />
    </>
  );
}

import type { Metadata } from "next";

import { ArticleList, EmptyState } from "@/components/cards/article-list";
import { PageHeader } from "@/components/layout/page-header";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { getAllArticles, getLastContentUpdate } from "@/lib/content";
import { createMetadata } from "@/lib/metadata";
import { breadcrumbNode, collectionPageNode } from "@/lib/schema";
import { HUB_PAGES } from "@/lib/taxonomy";
import { formatDate } from "@/lib/utils";

const hub = HUB_PAGES.find((page) => page.slug === "latest")!;

export const metadata: Metadata = createMetadata({
  title: hub.headline,
  description: hub.description,
  path: "/latest",
  keywords: hub.slug,
});

const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "Latest", path: "/latest/" },
];

export default function LatestPage() {
  const articles = getAllArticles();
  const lastUpdate = getLastContentUpdate();

  return (
    <>
      <JsonLd
        nodes={[
          collectionPageNode({
            title: hub.headline,
            description: hub.description,
            path: "/latest",
            articles,
          }),
          breadcrumbNode(CRUMBS),
        ]}
      />

      <PageHeader
        kicker="Archive"
        title={hub.headline}
        intro={hub.description}
        crumbs={CRUMBS}
        meta={
          <>
            <span className="font-mono uppercase tracking-[0.06em]">
              {articles.length} articles
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Last update{" "}
              <time dateTime={lastUpdate.toISOString()}>
                {formatDate(lastUpdate.toISOString())}
              </time>
            </span>
          </>
        }
      />

      <Container className="py-10 sm:py-14">
        {articles.length > 0 ? (
          <ArticleList articles={articles} numbered />
        ) : (
          <EmptyState
            title="No articles yet"
            body="Once the first article is published it will appear here, newest first."
          />
        )}
      </Container>
    </>
  );
}

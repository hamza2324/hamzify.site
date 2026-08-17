import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleList, EmptyState } from "@/components/cards/article-list";
import { PageHeader } from "@/components/layout/page-header";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { getArticlesByCategory } from "@/lib/content";
import { createMetadata } from "@/lib/metadata";
import { categoryCardAlt } from "@/lib/og-cards";
import { ogNames } from "@/lib/og-paths";
import { breadcrumbNode, collectionPageNode } from "@/lib/schema";
import {
  CATEGORIES,
  CATEGORY_SLUGS,
  type CategorySlug,
  isCategorySlug,
} from "@/lib/taxonomy";

/**
 * Category index for the six content pillars.
 *
 * A single dynamic route rather than six near-identical files: adding a category
 * to `taxonomy.ts` creates its index page, its metadata and its sitemap entry
 * with no new code.
 */

type Params = { category: string };

export function generateStaticParams(): Params[] {
  return CATEGORY_SLUGS.map((category) => ({ category }));
}

function resolve(category: string): CategorySlug | null {
  return isCategorySlug(category) ? category : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category } = await params;
  const slug = resolve(category);
  if (!slug) return {};

  const definition = CATEGORIES[slug];

  return createMetadata({
    title: definition.headline,
    description: definition.description,
    path: `/${slug}`,
    keywords: slug,
    image: { name: ogNames.category(slug), alt: categoryCardAlt(slug) },
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category } = await params;
  const slug = resolve(category);
  if (!slug) notFound();

  const definition = CATEGORIES[slug];
  const articles = getArticlesByCategory(slug);

  const crumbs = [
    { name: "Home", path: "/" },
    { name: definition.label, path: `/${slug}/` },
  ];

  return (
    <>
      <JsonLd
        nodes={[
          collectionPageNode({
            title: definition.headline,
            description: definition.description,
            path: `/${slug}`,
            articles,
          }),
          breadcrumbNode(crumbs),
        ]}
      />

      <PageHeader
        kicker={definition.label}
        title={definition.headline}
        intro={definition.intro}
        accent={definition.accent}
        crumbs={crumbs}
        meta={
          <span className="font-mono uppercase tracking-[0.06em]">
            {articles.length} {articles.length === 1 ? "article" : "articles"}
          </span>
        }
      />

      <Container className="py-10 sm:py-14">
        {articles.length > 0 ? (
          <ArticleList articles={articles} />
        ) : (
          <EmptyState
            title={`The ${definition.label} shelf is empty`}
            body={`Nothing has been filed under ${definition.label} yet. The rest of the notebook is on the archive page — or search for a tool, a stack, or a format.`}
          />
        )}
      </Container>
    </>
  );
}

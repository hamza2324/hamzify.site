import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/cards/article-card";
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
  relatedCategoriesFor,
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
  const featured =
    articles.find((article) => article.featured) ?? articles[0];
  const latest = featured
    ? articles.filter((article) => article.slug !== featured.slug)
    : articles;
  const subtopics = [
    ...new Set(
      articles
        .map((article) => article.subcategory?.trim())
        .filter((value): value is string => Boolean(value)),
    ),
  ];
  const related = relatedCategoriesFor(slug);

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
      >
        {subtopics.length >= 2 ? (
          <ul className="flex flex-wrap gap-2">
            {subtopics.map((topic) => (
              <li
                key={topic}
                className="rounded-xs border border-line bg-paper px-2.5 py-1 font-mono text-[0.75rem] text-ink-3"
              >
                {topic}
              </li>
            ))}
          </ul>
        ) : null}
      </PageHeader>

      <Container className="py-10 sm:py-14">
        {articles.length > 0 ? (
          <div className="flex flex-col gap-12">
            {featured ? (
              <section aria-labelledby="category-featured">
                <h2 id="category-featured" className="label text-ink-3">
                  Start with this
                </h2>
                <div className="mt-4">
                  <ArticleCard
                    article={featured}
                    variant="feature"
                    showAuthor
                    priority
                  />
                </div>
              </section>
            ) : null}

            {latest.length > 0 ? (
              <section aria-labelledby="category-latest">
                <h2 id="category-latest" className="label text-ink-3">
                  Latest
                </h2>
                <ArticleList articles={latest} className="mt-4" />
              </section>
            ) : null}

            {related.length > 0 ? (
              <nav aria-labelledby="related-shelves">
                <h2 id="related-shelves" className="label text-ink-3">
                  Related shelves
                </h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                  {related.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/${item.slug}/`}
                        className="flex min-h-11 flex-col rounded-sm border border-line bg-surface px-4 py-3 transition-colors hover:border-line-2"
                      >
                        <span className="font-medium text-ink">{item.label}</span>
                        <span className="mt-1 text-[0.8125rem] leading-snug text-ink-3">
                          {item.description}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
          </div>
        ) : (
          <EmptyState
            title={`The ${definition.label} shelf is empty`}
            body={`Nothing has been filed under ${definition.label} yet. Browse the archive, or search for a tool, a stack, or a format.`}
          />
        )}
      </Container>
    </>
  );
}

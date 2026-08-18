import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleList } from "@/components/cards/article-list";
import { PageHeader } from "@/components/layout/page-header";
import { JsonLd } from "@/components/seo/json-ld";
import { AccentRule } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { getToolHub, getPublishedToolHubs } from "@/lib/coverage";
import { createMetadata } from "@/lib/metadata";
import { breadcrumbNode, collectionPageNode } from "@/lib/schema";
import { ARTICLE_TYPE_META } from "@/lib/taxonomy";

/**
 * Coverage hub for one AI coding tool.
 *
 * Only generated when enough published Hamzify articles mention the tool.
 * Descriptions come from the editorial entity registry, not generated blurbs.
 */

type Params = { tool: string };

export function generateStaticParams(): Params[] {
  return getPublishedToolHubs().map((hub) => ({ tool: hub.entity.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { tool } = await params;
  const hub = getToolHub(tool);
  if (!hub) return {};

  return createMetadata({
    title: `${hub.entity.name}: Hamzify coverage`,
    description: hub.entity.summary,
    path: hub.path,
    keywords: [hub.entity.name, "AI coding tools"],
  });
}

export default async function ToolHubPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { tool } = await params;
  const hub = getToolHub(tool);
  if (!hub) notFound();

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "AI Coding", path: "/ai-coding-tools/" },
    { name: hub.entity.name, path: hub.path },
  ];

  return (
    <>
      <JsonLd
        nodes={[
          collectionPageNode({
            title: `${hub.entity.name}: Hamzify coverage`,
            description: hub.entity.summary,
            path: hub.path,
            articles: hub.articles,
          }),
          breadcrumbNode(crumbs),
        ]}
      />

      <PageHeader
        kicker="Tool coverage"
        title={hub.entity.name}
        intro={hub.entity.summary}
        accent="indigo"
        crumbs={crumbs}
        meta={
          <span className="font-mono uppercase tracking-[0.06em]">
            {hub.articles.length}{" "}
            {hub.articles.length === 1 ? "article" : "articles"}
          </span>
        }
      >
        {hub.entity.usefulFor ? (
          <p className="max-w-2xl text-[0.9375rem] leading-relaxed text-ink-2">
            <span className="font-medium text-ink">Who this may help. </span>
            {hub.entity.usefulFor}
          </p>
        ) : null}
      </PageHeader>

      <Container className="py-10 sm:py-14">
        <div className="flex flex-col gap-14">
          {hub.groups.map((group) => {
            const accent = ARTICLE_TYPE_META[group.type].accent;
            return (
              <section key={group.type} data-accent={accent}>
                <div className="flex items-center gap-3">
                  <AccentRule accent={accent} />
                  <h2 className="label text-ink-3">{group.label}</h2>
                </div>
                <ArticleList articles={group.articles} className="mt-5" />
              </section>
            );
          })}

          <p className="text-[0.875rem] text-ink-3">
            This page only lists published Hamzify articles that mention{" "}
            {hub.entity.name}. It is not a complete catalogue of the product.
            {hub.entity.officialUrl ? (
              <>
                {" "}
                Official documentation:{" "}
                <a
                  href={hub.entity.officialUrl}
                  target="_blank"
                  rel="noopener"
                  className="underline decoration-line-2 underline-offset-2 hover:decoration-accent"
                >
                  {hub.entity.name} docs
                </a>
                .
              </>
            ) : null}{" "}
            <Link
              href="/ai-coding-tools/"
              className="underline decoration-line-2 underline-offset-2 hover:decoration-accent"
            >
              All tool coverage
            </Link>
            .
          </p>
        </div>
      </Container>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ArticleList, EmptyState } from "@/components/cards/article-list";
import { PageHeader } from "@/components/layout/page-header";
import { JsonLd } from "@/components/seo/json-ld";
import { AccentRule } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { getArticlesByType } from "@/lib/content";
import { getPublishedToolHubs } from "@/lib/coverage";
import { createMetadata } from "@/lib/metadata";
import { breadcrumbNode, collectionPageNode } from "@/lib/schema";
import { ARTICLE_TYPE_META, HUB_PAGES } from "@/lib/taxonomy";

/**
 * The AI coding tools hub.
 *
 * A curated view rather than a category: it pulls reviews, comparisons and tool
 * guides together because "which tool should I use" is one reader question, not
 * three. Articles still live at their canonical category URLs, so this page adds
 * no duplicate content — it is an index over existing pieces.
 */

const hub = HUB_PAGES.find((page) => page.slug === "ai-coding-tools")!;

export const metadata: Metadata = createMetadata({
  title: hub.headline,
  description: hub.description,
  path: "/ai-coding-tools",
  keywords: hub.slug,
});

const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "AI Coding Tools", path: "/ai-coding-tools/" },
];

const GROUPS = [
  {
    type: "review" as const,
    title: "Reviews",
    body: "One tool at a time, tested on real work, with the version and the time spent stated up front.",
    href: "/reviews/",
  },
  {
    type: "comparison" as const,
    title: "Comparisons",
    body: "The same task run through each tool, then a recommendation per use case instead of a single winner.",
    href: "/compare/",
  },
];

export default function AiCodingToolsPage() {
  const reviews = getArticlesByType("review");
  const comparisons = getArticlesByType("comparison");
  const guides = getArticlesByType("guide");
  const all = [...reviews, ...comparisons, ...guides];
  const toolHubs = getPublishedToolHubs();

  const grouped = { review: reviews, comparison: comparisons };

  return (
    <>
      <JsonLd
        nodes={[
          collectionPageNode({
            title: hub.headline,
            description: hub.description,
            path: "/ai-coding-tools",
            articles: all,
          }),
          breadcrumbNode(CRUMBS),
        ]}
      />

      <PageHeader
        kicker="AI coding tools"
        title={hub.headline}
        intro={hub.description}
        accent="indigo"
        crumbs={CRUMBS}
        meta={
          <span className="font-mono uppercase tracking-[0.06em]">
            {reviews.length} reviews · {comparisons.length} comparisons ·{" "}
            {guides.length} guides
          </span>
        }
      />

      <Container className="py-10 sm:py-14">
        {all.length === 0 ? (
          <EmptyState
            title="No tool coverage yet"
            body="Reviews and comparisons will be listed here as they are published."
          />
        ) : (
          <div className="flex flex-col gap-14 sm:gap-16">
            {GROUPS.map((group) => {
              const articles = grouped[group.type];
              if (articles.length === 0) return null;
              const accent = ARTICLE_TYPE_META[group.type].accent;

              return (
                <section key={group.type} data-accent={accent}>
                  <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-xl">
                      <div className="flex items-center gap-3">
                        <AccentRule accent={accent} />
                        <span className="label text-ink-3">{group.title}</span>
                      </div>
                      <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-2">
                        {group.body}
                      </p>
                    </div>

                    <Link
                      href={group.href}
                      className="group inline-flex shrink-0 items-center gap-1.5 self-start text-sm font-medium text-ink transition-colors hover:text-accent md:self-end"
                    >
                      All {group.title.toLowerCase()}
                      <ArrowRight
                        className="size-4 transition-transform duration-200 ease-brand group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>

                  <h2 className="sr-only">{group.title}</h2>
                  <ArticleList articles={articles} className="mt-6" />
                </section>
              );
            })}

            {toolHubs.length > 0 ? (
              <section>
                <div className="flex items-center gap-3">
                  <AccentRule accent="indigo" />
                  <h2 className="label text-ink-3">Coverage by tool</h2>
                </div>
                <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-ink-2">
                  A hub appears here only when Hamzify has enough published
                  pieces about that tool. These are indexes, not extra reviews.
                </p>
                <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                  {toolHubs.map((item) => (
                    <li key={item.entity.slug}>
                      <Link
                        href={item.path}
                        className="flex min-h-11 flex-col rounded-sm border border-line bg-surface px-4 py-3 transition-colors hover:border-line-2"
                      >
                        <span className="font-medium text-ink">
                          {item.entity.name}
                        </span>
                        <span className="mt-1 text-[0.8125rem] text-ink-3">
                          {item.articles.length} articles
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {guides.length > 0 ? (
              <section data-accent="indigo">
                <div className="flex items-center gap-3">
                  <AccentRule accent="indigo" />
                  <span className="label text-ink-3">Guides</span>
                </div>
                <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-ink-2">
                  Reference pieces on how the tool categories fit together,
                  updated in place rather than republished.
                </p>
                <h2 className="sr-only">Guides</h2>
                <ArticleList articles={guides} className="mt-6" />
              </section>
            ) : null}
          </div>
        )}
      </Container>
    </>
  );
}

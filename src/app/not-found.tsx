import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ArticleCard } from "@/components/cards/article-card";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Container } from "@/components/ui/container";
import {
  getEditorialPicks,
  getFeaturedArticle,
  getLatestArticles,
} from "@/lib/content";
import { CATEGORY_LIST } from "@/lib/taxonomy";

/**
 * 404.
 *
 * Repeats site chrome because `not-found.tsx` sits above the `(site)` group so
 * a static export produces a real `404.html`.
 */
export const metadata: Metadata = {
  title: "Page not found",
  description: "That URL is not a published Hamzify page.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  const featured = getFeaturedArticle();
  const picks = getEditorialPicks(3).filter(
    (article) => article.slug !== featured?.slug,
  );
  const fallback = getLatestArticles(3);
  const suggested = (picks.length >= 2 ? picks : fallback).slice(0, 3);

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <main id="main" className="flex-1">
        <Container className="py-16 sm:py-24">
          <p className="label text-accent">Error 404</p>
          <h1 className="mt-4 max-w-2xl font-display text-display-l font-semibold text-ink">
            Page not found
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-2">
            That address is not a published Hamzify page. It may be mistyped, or
            it may never have existed. Article URLs here are meant to stay put,
            so this is usually a bad link rather than a page that moved.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/"
              className="group inline-flex min-h-11 items-center gap-1.5 rounded-sm bg-brand px-4 py-2.5 text-[0.9375rem] font-medium text-on-accent transition-colors hover:bg-accent-strong"
            >
              Home
              <ArrowRight
                className="size-4 transition-transform duration-200 ease-brand group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <Link
              href="/search/"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-sm border border-line-2 px-4 py-2.5 text-[0.9375rem] font-medium text-ink transition-colors hover:border-line-strong"
            >
              Search
            </Link>
            <Link
              href="/latest/"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-sm border border-line-2 px-4 py-2.5 text-[0.9375rem] font-medium text-ink transition-colors hover:border-line-strong"
            >
              Latest
            </Link>
          </div>

          <nav aria-label="Categories" className="mt-12 border-t border-line pt-6">
            <h2 className="label text-ink-3">Major sections</h2>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              {CATEGORY_LIST.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/${category.slug}/`}
                    className="inline-flex min-h-11 items-center text-[0.9375rem] text-ink-2 underline decoration-line-2 underline-offset-2 transition-colors hover:text-ink hover:decoration-accent"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {suggested.length > 0 ? (
            <section aria-labelledby="try-these" className="mt-12">
              <h2 id="try-these" className="label text-ink-3">
                Open one of these instead
              </h2>
              <ul className="mt-4 flex flex-col gap-5">
                {suggested.map((article) => (
                  <li key={article.slug}>
                    <ArticleCard article={article} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </Container>
      </main>

      <SiteFooter />
    </div>
  );
}

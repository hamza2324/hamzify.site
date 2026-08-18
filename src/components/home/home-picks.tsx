import Link from "next/link";

import { Container } from "@/components/ui/container";
import type { Article } from "@/types/content";

/**
 * Compact editorial picks. Intentionally not a card wall: the homepage already
 * has enough sections.
 */
export function HomePicks({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  return (
    <section
      aria-labelledby="home-picks"
      className="border-b border-line bg-surface-2 py-8 sm:py-10"
    >
      <Container>
        <div className="flex flex-col gap-4 md:flex-row md:items-baseline md:justify-between md:gap-10">
          <div className="shrink-0">
            <p className="label text-ink-3">Editor&apos;s picks</p>
            <h2
              id="home-picks"
              className="mt-1 font-display text-[1.125rem] font-semibold text-ink"
            >
              A few places to start reading
            </h2>
          </div>
          <ul className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6">
            {articles.map((article) => (
              <li key={article.slug} className="min-w-0">
                <Link
                  href={article.path}
                  className="inline-flex min-h-11 items-center text-[0.9375rem] font-medium text-ink underline decoration-line-2 underline-offset-4 hover:decoration-accent"
                >
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

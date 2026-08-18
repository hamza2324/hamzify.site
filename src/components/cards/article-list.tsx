import type { ReactNode } from "react";
import Link from "next/link";

import { ArticleCard } from "@/components/cards/article-card";
import { cn } from "@/lib/utils";
import type { Article } from "@/types/content";

/**
 * The archive list used by every index page.
 *
 * A divided vertical list rather than a card grid: on an index page the reader
 * is scanning headlines and descriptions, and a grid of equal-weight boxes makes
 * that harder, not easier.
 */
export function ArticleList({
  articles,
  numbered = false,
  className,
}: {
  articles: Article[];
  /** Ordinals for chronological archives such as `/latest`. */
  numbered?: boolean;
  className?: string;
}) {
  return (
    <ul className={cn("divide-y divide-line border-t border-line", className)}>
      {articles.map((article, index) => (
        <li key={article.slug}>
          <ArticleCard
            article={article}
            variant="list"
            showAuthor
            index={numbered ? index : undefined}
          />
        </li>
      ))}
    </ul>
  );
}

/** Shown when a category or a search has no matches. */
export function EmptyState({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-md border border-dashed border-line px-6 py-12 text-center">
      <p className="font-display text-[1.125rem] font-semibold text-ink">
        {title}
      </p>
      <p className="mx-auto mt-2 max-w-md text-[0.9375rem] leading-relaxed text-ink-2">
        {body}
      </p>
      {children ? <div className="mt-5">{children}</div> : (
        <p className="mt-5 text-[0.875rem] text-ink-3">
          <Link
            href="/latest/"
            className="underline decoration-line-2 underline-offset-2 hover:decoration-accent"
          >
            Browse the archive
          </Link>
          {" · "}
          <Link
            href="/search/"
            className="underline decoration-line-2 underline-offset-2 hover:decoration-accent"
          >
            Search
          </Link>
        </p>
      )}
    </div>
  );
}

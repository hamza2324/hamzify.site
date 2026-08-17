import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { CATEGORIES } from "@/lib/taxonomy";
import type { Article } from "@/types/content";

/**
 * Previous / next within the same category, so the sequence means something.
 * Jumping from a review to an unrelated workflow because it happens to be
 * adjacent by date is not useful navigation.
 */
export function ArticleNav({
  previous,
  next,
}: {
  previous?: Article;
  next?: Article;
}) {
  if (!previous && !next) return null;

  return (
    <nav
      aria-label="More in this category"
      className="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2"
    >
      {previous ? (
        <NavCard article={previous} direction="previous" />
      ) : (
        <div className="bg-surface" />
      )}
      {next ? (
        <NavCard article={next} direction="next" />
      ) : (
        <div className="bg-surface" />
      )}
    </nav>
  );
}

function NavCard({
  article,
  direction,
}: {
  article: Article;
  direction: "previous" | "next";
}) {
  const isNext = direction === "next";

  return (
    <Link
      href={article.path}
      rel={isNext ? "next" : "prev"}
      className="group flex flex-col gap-2 bg-surface p-5 transition-colors hover:bg-surface-2"
    >
      <span
        className={`label flex items-center gap-1.5 text-ink-3 ${isNext ? "sm:justify-end" : ""}`}
      >
        {isNext ? null : (
          <ArrowLeft
            className="size-3 transition-transform group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
        )}
        {isNext ? "Newer" : "Older"}
        {isNext ? (
          <ArrowRight
            className="size-3 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        ) : null}
      </span>

      <span
        className={`font-display text-[1.0625rem] font-semibold leading-snug text-ink ${isNext ? "sm:text-right" : ""}`}
      >
        {article.title}
      </span>

      <span
        className={`text-[0.75rem] text-ink-3 ${isNext ? "sm:text-right" : ""}`}
      >
        {CATEGORIES[article.category].label}
      </span>
    </Link>
  );
}

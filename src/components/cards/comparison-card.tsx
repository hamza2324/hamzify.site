import Link from "next/link";

import { comparisonSides } from "@/lib/records";
import { cn, formatDate } from "@/lib/utils";
import type { Article } from "@/types/content";

/**
 * Comparison card.
 *
 * Two names, a quiet "vs", no trophy graphic. The point is the pairing, not a
 * wrestling poster.
 */
export function ComparisonCard({
  article,
  className,
}: {
  article: Article;
  className?: string;
}) {
  const sides = comparisonSides(article);

  return (
    <article
      data-accent="olive"
      className={cn(
        "group relative flex flex-col gap-4 rounded-md border border-line bg-surface p-5 transition-colors hover:border-line-2 sm:p-6",
        className,
      )}
    >
      <p className="label text-ink-3">Comparison</p>

      {sides ? (
        <p className="font-display text-display-s font-semibold leading-tight text-ink">
          <span className="inline-block">{sides[0]}</span>
          <span className="mx-2 font-sans text-[0.6875rem] font-medium tracking-[0.14em] text-ink-3 uppercase sm:mx-2.5 sm:text-[0.75rem]">
            vs
          </span>
          <span className="inline-block">{sides[1]}</span>
        </p>
      ) : null}

      <h3 className="font-display text-[1.125rem] font-semibold leading-snug text-ink">
        <Link
          href={article.path}
          className="link-underline decoration-transparent after:absolute after:inset-0 after:content-[''] group-hover:decoration-current"
        >
          {article.title}
        </Link>
      </h3>

      <p className="text-[0.9375rem] leading-relaxed text-ink-2">
        {article.dek ?? article.description}
      </p>

      <p className="mt-auto text-[0.75rem] text-ink-3">
        <time dateTime={article.publishedAt}>
          {formatDate(article.publishedAt)}
        </time>
        {" · "}
        {article.readingTime.text}
      </p>
    </article>
  );
}

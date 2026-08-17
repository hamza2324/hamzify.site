import Link from "next/link";

import { ArticleCover } from "@/components/article/article-cover";
import { formatRecordLabel } from "@/lib/records";
import { cn, formatDate } from "@/lib/utils";
import type { Article } from "@/types/content";

/**
 * Experiment card — a lab record, not a blog teaser.
 *
 * The question is the headline. The result is the fact a reader came for.
 */
export function ExperimentCard({
  article,
  className,
}: {
  article: Article;
  className?: string;
}) {
  return (
    <article
      data-accent="ember"
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-md border border-line bg-surface transition-colors hover:border-line-2 card-spine",
        className,
      )}
    >
      <ArticleCover article={article} size="band" />

      <div className="flex flex-1 flex-col gap-5 p-5 sm:p-6">
      <p className="label text-[var(--local-accent)]">
        {formatRecordLabel(article)}
      </p>

      <h3 className="font-display text-display-s font-semibold leading-tight text-ink">
        <Link
          href={article.path}
          className="link-underline decoration-transparent after:absolute after:inset-0 after:content-[''] group-hover:decoration-current"
        >
          {article.question ?? article.title}
        </Link>
      </h3>

      {article.result ? (
        <dl className="mt-auto border-t border-line pt-4">
          <dt className="label text-ink-3">Result</dt>
          <dd className="mt-1.5 text-[0.9375rem] leading-snug text-ink">
            {article.result}
          </dd>
        </dl>
      ) : (
        <p className="mt-auto text-[0.9375rem] leading-relaxed text-ink-2">
          {article.dek ?? article.description}
        </p>
      )}

      <p className="text-[0.75rem] text-ink-3">
        <time dateTime={article.publishedAt}>
          {formatDate(article.publishedAt)}
        </time>
        {" · "}
        {article.readingTime.text}
      </p>
      </div>
    </article>
  );
}

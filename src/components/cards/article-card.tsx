import Link from "next/link";

import { ArticleCover } from "@/components/article/article-cover";
import { AuthorAvatar } from "@/components/article/byline";
import { Badge } from "@/components/ui/badge";
import { getAuthor } from "@/lib/content";
import { ARTICLE_TYPE_META, CATEGORIES } from "@/lib/taxonomy";
import { cn, formatDate } from "@/lib/utils";
import type { Article } from "@/types/content";

export type ArticleCardVariant =
  | "hero"
  | "feature"
  | "standard"
  | "list"
  | "compact";

type ArticleCardProps = {
  article: Article;
  variant?: ArticleCardVariant;
  /** Shows the author avatar and name. Off for dense grids. */
  showAuthor?: boolean;
  /** Only the first card above the fold should set this. */
  priority?: boolean;
  className?: string;
  /** Ordinal shown in numbered lists such as `/latest`. */
  index?: number;
};

/**
 * One card component, five densities.
 *
 * Every card has exactly one interactive element — the headline link, expanded
 * to cover the card with an `::after` overlay. That keeps the whole surface
 * clickable without nesting links inside links or adding click handlers to a
 * `div`, and it means tab order stays one stop per card.
 */
export function ArticleCard({
  article,
  variant = "standard",
  showAuthor = false,
  priority = false,
  className,
  index,
}: ArticleCardProps) {
  const category = CATEGORIES[article.category];
  const typeMeta = ARTICLE_TYPE_META[article.articleType];
  const author = showAuthor ? getAuthor(article.author) : undefined;

  const meta = (
    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.75rem] text-ink-3">
      <span className="font-mono uppercase tracking-[0.06em]">
        {category.label}
      </span>
      <span aria-hidden="true">·</span>
      <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
      <span aria-hidden="true">·</span>
      <span>{article.readingTime.text}</span>
    </div>
  );

  const headlineLink = (
    <Link
      href={article.path}
      className="after:absolute after:inset-0 after:content-['']"
    >
      {article.title}
    </Link>
  );

  if (variant === "hero") {
    return (
      <article
        data-accent={category.accent}
        className={cn(
          "group relative grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center lg:gap-10",
          className,
        )}
      >
        <div className="order-2 lg:order-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge accent={category.accent} variant="soft">
              {typeMeta.label}
            </Badge>
            <span className="label text-ink-3">{category.label}</span>
          </div>

          <h2 className="mt-4 font-display text-display-l font-semibold text-ink">
            <span className="link-underline decoration-transparent group-hover:decoration-current">
              {headlineLink}
            </span>
          </h2>

          {article.dek ? (
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-2 sm:text-[1.0625rem]">
              {article.dek}
            </p>
          ) : (
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-2">
              {article.description}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {author ? (
              <span className="flex items-center gap-2 text-[0.8125rem] text-ink-2">
                <AuthorAvatar author={author} size={28} />
                {author.name}
              </span>
            ) : null}
            {meta}
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <ArticleCover article={article} size="hero" priority={priority} />
        </div>
      </article>
    );
  }

  if (variant === "feature") {
    return (
      <article
        data-accent={category.accent}
        className={cn("group relative flex flex-col gap-4", className)}
      >
        <ArticleCover article={article} size="feature" priority={priority} />

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge accent={category.accent} variant="soft">
              {typeMeta.label}
            </Badge>
            <span className="label text-ink-3">{category.label}</span>
          </div>

          <h3 className="mt-3 font-display text-display-s font-semibold text-ink">
            <span className="link-underline decoration-transparent group-hover:decoration-current">
              {headlineLink}
            </span>
          </h3>

          <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-2">
            {article.description}
          </p>

          <div className="mt-3.5">{meta}</div>
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article
        data-accent={category.accent}
        className={cn("group relative", className)}
      >
        <h3 className="font-display text-[1.0625rem] font-semibold leading-snug text-ink">
          <span className="link-underline decoration-transparent group-hover:decoration-current">
            {headlineLink}
          </span>
        </h3>
        <div className="mt-1.5">{meta}</div>
      </article>
    );
  }

  if (variant === "list") {
    return (
      <article
        data-accent={category.accent}
        className={cn(
          "group relative grid gap-4 py-7 sm:grid-cols-[minmax(0,1fr)_11rem] sm:gap-8",
          className,
        )}
      >
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {typeof index === "number" ? (
              <span className="label tabular-nums text-ink-3">
                {String(index + 1).padStart(2, "0")}
              </span>
            ) : null}
            <Badge accent={category.accent} variant="soft">
              {typeMeta.label}
            </Badge>
            <span className="label text-ink-3">{category.label}</span>
          </div>

          <h3 className="mt-2.5 font-display text-display-s font-semibold text-ink">
            <span className="link-underline decoration-transparent group-hover:decoration-current">
              {headlineLink}
            </span>
          </h3>

          <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-2">
            {article.description}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            {author ? (
              <span className="flex items-center gap-2 text-[0.8125rem] text-ink-2">
                <AuthorAvatar author={author} size={24} />
                {author.name}
              </span>
            ) : null}
            {meta}
          </div>
        </div>

        <ArticleCover
          article={article}
          size="card"
          className="hidden sm:block"
        />
      </article>
    );
  }

  return (
    <article
      data-accent={category.accent}
      className={cn("group relative flex gap-4", className)}
    >
      <ArticleCover
        article={article}
        size="thumb"
        className="w-20 shrink-0 sm:w-24"
      />
      <div className="min-w-0">
        <span className="label text-[var(--local-accent)]">
          {typeMeta.label}
        </span>
        <h3 className="mt-1 font-display text-[1.0625rem] font-semibold leading-snug text-ink">
          <span className="link-underline decoration-transparent group-hover:decoration-current">
            {headlineLink}
          </span>
        </h3>
        <div className="mt-1.5">{meta}</div>
      </div>
    </article>
  );
}

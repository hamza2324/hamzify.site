import Image from "next/image";

import { ARTICLE_TYPE_META, CATEGORIES } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";
import type { Article } from "@/types/content";

type ArticleCoverProps = {
  article: Article;
  /** Controls aspect ratio and how much annotation is drawn. */
  size?: "hero" | "feature" | "card" | "thumb";
  className?: string;
  priority?: boolean;
};

const RATIO = {
  hero: "aspect-[16/10] sm:aspect-[2/1]",
  feature: "aspect-[16/10]",
  card: "aspect-[16/9]",
  thumb: "aspect-square",
} as const;

/**
 * Article visuals, generated rather than sourced.
 *
 * There is no stock imagery on this site by design: a "glowing AI brain" photo
 * adds page weight and says nothing. Instead each article renders a CSS
 * composition keyed to its category hue and `coverPattern`, annotated with the
 * facts that actually identify the piece — type, stack, tools. It costs no
 * network requests and cannot cause layout shift.
 *
 * A real `coverImage` (a screenshot from the build) always takes precedence.
 */
export function ArticleCover({
  article,
  size = "card",
  className,
  priority = false,
}: ArticleCoverProps) {
  const category = CATEGORIES[article.category];
  const typeMeta = ARTICLE_TYPE_META[article.articleType];
  const annotated = size === "hero" || size === "feature";

  if (article.coverImage) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-md border border-line bg-surface-2",
          RATIO[size],
          className,
        )}
      >
        <Image
          src={article.coverImage}
          alt={article.coverImageAlt ?? ""}
          fill
          priority={priority}
          sizes={
            size === "hero"
              ? "(min-width: 1024px) 60rem, 100vw"
              : "(min-width: 768px) 32rem, 100vw"
          }
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      data-accent={category.accent}
      data-pattern={article.coverPattern}
      aria-hidden="true"
      className={cn(
        "cover rounded-md border border-line transition-colors group-hover:border-line-2",
        RATIO[size],
        className,
      )}
    >
      {annotated ? (
        <div className="flex h-full flex-col justify-between p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <span className="rounded-xs bg-paper/80 px-1.5 py-0.5 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-[var(--local-accent)] backdrop-blur-sm">
              {typeMeta.label}
            </span>
          </div>

          {article.project ? (
            <dl className="-mx-4 -mb-4 flex flex-wrap gap-x-8 gap-y-3 border-t border-line/80 bg-paper/55 px-4 py-3 font-mono text-[0.6875rem] uppercase tracking-[0.06em] backdrop-blur-[2px] sm:-mx-5 sm:-mb-5 sm:px-5 sm:py-4">
              <div>
                <dt className="text-ink-3">Project</dt>
                <dd className="mt-1 max-w-[16ch] truncate text-ink">
                  {article.project.name}
                </dd>
              </div>
              <div>
                <dt className="text-ink-3">Stack</dt>
                <dd className="mt-1 text-ink">
                  {article.project.stack.slice(0, 3).join(" · ")}
                </dd>
              </div>
              <div>
                <dt className="text-ink-3">AI</dt>
                <dd className="mt-1 text-ink">
                  {article.project.aiTools.slice(0, 2).join(" · ")}
                </dd>
              </div>
            </dl>
          ) : article.tags.length > 0 ? (
            <ul className="-mx-4 -mb-4 flex flex-wrap gap-x-3 gap-y-1 border-t border-line/80 bg-paper/55 px-4 py-3 font-mono text-[0.6875rem] tracking-[0.04em] text-ink-2 backdrop-blur-[2px] sm:-mx-5 sm:-mb-5 sm:px-5 sm:py-4">
              {article.tags.slice(0, 4).map((tag) => (
                <li key={tag}>#{tag}</li>
              ))}
            </ul>
          ) : (
            <p className="max-w-[40ch] font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-ink-3">
              {category.label} — {typeMeta.label}
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}

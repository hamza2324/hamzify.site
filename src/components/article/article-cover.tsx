import Image from "next/image";

import { CoverIllustration } from "@/components/visuals/cover-illustration";
import { ARTICLE_TYPE_META, CATEGORIES } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";
import type { Article } from "@/types/content";

type ArticleCoverProps = {
  article: Article;
  /** Controls aspect ratio and how much annotation is drawn. */
  size?: "hero" | "feature" | "band" | "card" | "thumb";
  className?: string;
  priority?: boolean;
};

const RATIO = {
  hero: "aspect-[16/10] sm:aspect-[5/3] lg:aspect-[4/3]",
  feature: "aspect-[16/10]",
  band: "aspect-[16/9] sm:aspect-[2.2/1]",
  card: "aspect-[16/9]",
  thumb: "aspect-square",
} as const;

/**
 * Article visuals, generated rather than sourced.
 *
 * There is no stock imagery on this site by design. Each article renders a CSS
 * composition keyed to its category hue and `coverPattern`, with an SVG overlay
 * from the same visual family (architecture, terminal, flow, comparison, tool
 * window, checklist). A real `coverImage` — a screenshot from the build —
 * always takes precedence.
 */
export function ArticleCover({
  article,
  size = "card",
  className,
  priority = false,
}: ArticleCoverProps) {
  const category = CATEGORIES[article.category];
  const typeMeta = ARTICLE_TYPE_META[article.articleType];
  const annotated = size === "hero" || size === "feature" || size === "band";

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
          alt={article.coverImageAlt ?? `${article.title} — editorial image`}
          fill
          priority={priority}
          sizes={
            size === "hero"
              ? "(min-width: 1024px) 36rem, 100vw"
              : size === "band"
                ? "(min-width: 768px) 48rem, 100vw"
                : "(min-width: 768px) 32rem, 100vw"
          }
          className="cover-media object-cover"
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
        "cover relative rounded-md border border-line transition-colors group-hover:border-line-2",
        RATIO[size],
        className,
      )}
    >
      <CoverIllustration article={article} size={size} />

      {annotated ? (
        <div className="relative z-[1] flex h-full flex-col justify-between p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <span className="rounded-xs bg-paper/85 px-1.5 py-0.5 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-[var(--local-accent)] backdrop-blur-sm">
              {typeMeta.label}
            </span>
          </div>

          {article.project && size !== "band" ? (
            <dl className="-mx-4 -mb-4 flex flex-wrap gap-x-8 gap-y-3 border-t border-line/80 bg-paper/70 px-4 py-3 font-mono text-[0.6875rem] uppercase tracking-[0.06em] backdrop-blur-[2px] sm:-mx-5 sm:-mb-5 sm:px-5 sm:py-4">
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
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

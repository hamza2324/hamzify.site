import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { AuthorAvatar } from "@/components/article/byline";
import { ComparisonCard } from "@/components/cards/comparison-card";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { getAuthor } from "@/lib/content";
import { ARTICLE_TYPE_META } from "@/lib/taxonomy";
import { formatDate } from "@/lib/utils";
import type { Article } from "@/types/content";

/**
 * Tool coverage: review, comparison, guide — each visually distinct because
 * they answer different questions.
 */
export function ToolCoverage({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  const comparison = articles.find((article) => article.articleType === "comparison");
  const rest = articles.filter((article) => article.slug !== comparison?.slug);

  return (
    <section
      aria-labelledby="tool-coverage"
      className="border-b border-line bg-surface-2 py-14 sm:py-16 lg:py-20"
    >
      <Container>
        <SectionHeading
          kicker="AI coding tools"
          title="Tested, compared, and explained"
          description="Reviews with a stated method, comparisons decided per use case, and guides to how the categories fit together."
          accent="amber"
          action={{ href: "/ai-coding-tools/", label: "All tool coverage" }}
        />

        <div className="mt-10 flex flex-col gap-5">
          {comparison ? <ComparisonCard article={comparison} /> : null}

          {rest.length > 0 ? (
            <ul className="grid gap-px overflow-hidden rounded-md border border-line bg-line md:grid-cols-2">
              {rest.map((article) => {
                const typeMeta = ARTICLE_TYPE_META[article.articleType];
                const author = getAuthor(article.author);

                return (
                  <li
                    key={article.slug}
                    data-accent={typeMeta.accent}
                    className="group relative flex flex-col gap-3 bg-surface p-5 transition-colors hover:bg-paper"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <Badge accent={typeMeta.accent} variant="soft">
                        {typeMeta.label}
                      </Badge>
                      <ArrowUpRight
                        className="size-4 shrink-0 text-ink-3 transition-transform duration-200 ease-brand group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--local-accent)]"
                        aria-hidden="true"
                      />
                    </div>

                    <h3 className="font-display text-[1.1875rem] font-semibold leading-snug text-ink">
                      <Link
                        href={article.path}
                        className="link-underline decoration-transparent after:absolute after:inset-0 after:content-[''] group-hover:decoration-current"
                      >
                        {article.title}
                      </Link>
                    </h3>

                    <p className="text-[0.9375rem] leading-relaxed text-ink-2">
                      {article.description}
                    </p>

                    <div className="mt-auto flex items-center gap-2 border-t border-line pt-3.5 text-[0.75rem] text-ink-3">
                      {author ? <AuthorAvatar author={author} size={22} /> : null}
                      <time dateTime={article.publishedAt}>
                        {formatDate(article.publishedAt)}
                      </time>
                      <span aria-hidden="true">·</span>
                      <span>{article.readingTime.text}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

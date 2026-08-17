import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { AccentRule, Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { formatDate } from "@/lib/utils";
import type { Article } from "@/types/content";

/**
 * A single featured workflow, shown with its steps as a compact process strip.
 *
 * The steps are read out of the article's own `## Step N — Title` headings
 * rather than duplicated here, so the homepage can never drift out of sync with
 * the article. If an article does not use that heading convention, the strip is
 * simply omitted.
 */
function extractSteps(article: Article): string[] {
  return article.headings
    .filter((heading) => heading.level === 2)
    .map((heading) => /^step\s*\d+\s*[—–-]\s*(.+)$/i.exec(heading.text)?.[1])
    .filter((label): label is string => Boolean(label));
}

export function FeaturedWorkflow({ article }: { article: Article }) {
  const steps = extractSteps(article);

  return (
    <section
      aria-labelledby="featured-workflow"
      data-accent="indigo"
      className="border-b border-line bg-surface-2 py-14 sm:py-16 lg:py-20"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center lg:gap-14">
          <div>
            <div className="flex items-center gap-3">
              <AccentRule accent="indigo" />
              <span className="label text-ink-3">Workflow</span>
            </div>

            <h2
              id="featured-workflow"
              className="mt-3 font-display text-display-m font-semibold text-ink"
            >
              <Link href={article.path} className="link-underline">
                {article.title}
              </Link>
            </h2>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-2">
              {article.dek ?? article.description}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.75rem] text-ink-3">
              <Badge accent="indigo" variant="soft">
                Workflow
              </Badge>
              <time dateTime={article.publishedAt}>
                {formatDate(article.publishedAt)}
              </time>
              <span aria-hidden="true">·</span>
              <span>{article.readingTime.text}</span>
            </div>

            <Link
              href={article.path}
              className="group mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink transition-colors hover:text-accent"
            >
              Read the workflow
              <ArrowRight
                className="size-4 transition-transform duration-200 ease-brand group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>

          {steps.length > 0 ? (
            <ol className="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-1">
              {steps.map((step, index) => (
                <li
                  key={step}
                  className="flex items-baseline gap-3 bg-surface px-4 py-3.5"
                >
                  <span className="label shrink-0 tabular-nums text-indigo">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[0.9375rem] font-medium text-ink">
                    {step}
                  </span>
                  {index < steps.length - 1 ? (
                    <ArrowRight
                      className="ml-auto size-3.5 shrink-0 self-center text-ink-3"
                      aria-hidden="true"
                    />
                  ) : null}
                </li>
              ))}
            </ol>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

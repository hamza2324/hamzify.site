import Link from "next/link";

import { relatedCategoriesFor } from "@/lib/taxonomy";
import type { Article } from "@/types/content";

/**
 * One useful next click after an article: a related shelf, not a sitemap.
 */

type NextStep = {
  href: string;
  title: string;
  body: string;
  link: string;
};

function nextStepFor(article: Article): NextStep {
  switch (article.articleType) {
    case "review":
      return {
        href: "/compare/",
        title: "See how tools compare on the same tasks",
        body: "A review covers one product. Comparisons run identical work through more than one.",
        link: "Open the comparisons",
      };
    case "comparison":
      return {
        href: "/reviews/",
        title: "Read the individual tool notes",
        body: "If one of these is already on your shortlist, the reviews go deeper on where it struggled.",
        link: "Open the reviews",
      };
    case "build-log":
      return {
        href: "/workflows/",
        title: "Steal the process, not just the stack",
        body: "Build logs show what happened on a project. Workflows are the parts you can reuse tomorrow.",
        link: "Open the workflows",
      };
    case "experiment":
      return {
        href: "/build-logs/",
        title: "Longer records of real projects",
        body: "Experiments answer one question. Build logs follow a project all the way through.",
        link: "Open the build logs",
      };
    case "workflow":
      return {
        href: "/resources/",
        title: "Checklists that sit next to this loop",
        body: "If you want something to keep open while you work, the resource shelf is built for that.",
        link: "Open the resources",
      };
    default:
      return {
        href: "/workflows/",
        title: "Turn this into a daily loop",
        body: "Guides map the landscape. Workflows are what you actually run.",
        link: "Open the workflows",
      };
  }
}

export function ContinueExploring({ article }: { article: Article }) {
  const next = nextStepFor(article);
  const related = relatedCategoriesFor(article.category).filter(
    (category) => category.slug !== article.category,
  );

  return (
    <section
      aria-labelledby="continue-exploring"
      className={related.length > 0 ? "mt-14 border-t border-line pt-10" : "border-t border-line pt-10"}
    >
      <p className="label text-ink-3">Continue exploring</p>
      <h2
        id="continue-exploring"
        className="mt-2 font-display text-[1.25rem] font-semibold text-ink"
      >
        {next.title}
      </h2>
      <p className="mt-2 max-w-xl text-[0.9375rem] leading-relaxed text-ink-2">
        {next.body}{" "}
        <Link
          href={next.href}
          className="font-medium text-ink underline decoration-line-2 underline-offset-4 hover:decoration-accent"
        >
          {next.link}
        </Link>
        .
      </p>

      {related.length > 0 ? (
        <ul className="mt-6 flex flex-wrap gap-2">
          {related.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/${category.slug}/`}
                className="inline-flex min-h-11 items-center rounded-sm border border-line px-3 py-2 text-sm text-ink-2 transition-colors hover:border-line-2 hover:text-ink"
              >
                {category.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

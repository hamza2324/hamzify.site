import Link from "next/link";

import { ArticleCover } from "@/components/article/article-cover";
import { Breadcrumbs, type Crumb } from "@/components/article/breadcrumbs";
import { Byline } from "@/components/article/byline";
import { Badge } from "@/components/ui/badge";
import { hubsForArticle } from "@/lib/coverage";
import { lastReviewedDate } from "@/lib/content";
import { ARTICLE_TYPE_META, CATEGORIES } from "@/lib/taxonomy";
import type { Article, Author } from "@/types/content";

export const BASIS_LABEL = {
  firsthand: "Based on firsthand testing",
  research: "Based on research of primary sources",
  analysis: "Analysis and editorial judgement",
  mixed: "Mix of firsthand testing and research",
} as const;

export const EXPERIMENT_STATUS_LABEL = {
  completed: "Completed",
  "in-progress": "In progress",
  repeated: "Repeated",
  "needs-further-testing": "Needs further testing",
} as const;

/**
 * The article masthead.
 *
 * The header stays structurally identical across article types so the site
 * reads as one publication, while the "format" line and the project rail adapt
 * to the type. That is the compromise the brief asks for: distinct templates
 * where the content genuinely differs, one design language throughout.
 */
export function ArticleHeader({
  article,
  author,
  crumbs,
}: {
  article: Article;
  author: Author;
  crumbs: Crumb[];
}) {
  const category = CATEGORIES[article.category];
  const typeMeta = ARTICLE_TYPE_META[article.articleType];
  const hubs = hubsForArticle(article);
  const reviewed = lastReviewedDate(article);

  return (
    <header>
      <Breadcrumbs items={crumbs} />

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Badge accent={category.accent} variant="soft">
          {typeMeta.label}
        </Badge>
        <span className="label text-ink-3">{category.label}</span>
        {article.subcategory ? (
          <>
            <span aria-hidden="true" className="text-line-2">
              /
            </span>
            <span className="label text-ink-3">{article.subcategory}</span>
          </>
        ) : null}
        {hubs.map((hub) => (
          <Link
            key={hub.entity.slug}
            href={hub.path}
            className="label text-ink-3 underline decoration-line-2 underline-offset-2 hover:decoration-accent"
          >
            {hub.entity.name}
          </Link>
        ))}
        {article.experimentStatus ? (
          <Badge variant="outline">
            {EXPERIMENT_STATUS_LABEL[article.experimentStatus]}
          </Badge>
        ) : null}
      </div>

      <h1 className="mt-4 max-w-4xl font-display text-display-l font-semibold text-ink">
        {article.title}
      </h1>

      {article.dek ? (
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">
          {article.dek}
        </p>
      ) : null}

      <div className="mt-7 flex flex-col gap-4 border-t border-line pt-5">
        <Byline
          author={author}
          publishedAt={article.publishedAt}
          updatedAt={article.updatedAt}
          lastReviewedAt={reviewed}
          readingTime={article.readingTime.text}
        />

        <p className="text-[0.8125rem] leading-relaxed text-ink-3">
          <span className="font-medium text-ink-2">{typeMeta.label}:</span>{" "}
          {typeMeta.description}
          {article.basis ? (
            <>
              {" "}
              {BASIS_LABEL[article.basis]}.
            </>
          ) : null}
        </p>
      </div>

      <div className="mt-8">
        <ArticleCover
          article={article}
          size={article.coverImage ? "hero" : "band"}
          priority
        />
      </div>

      {article.project ? (
        <dl className="mt-6 grid gap-x-8 gap-y-4 rounded-md border border-line bg-surface p-5 sm:grid-cols-2 lg:grid-cols-4">
          <ProjectFact term="Project" value={article.project.name} />
          <ProjectFact term="Status" value={article.project.status} />
          <ProjectFact
            term="AI tools"
            value={article.project.aiTools.join(" · ")}
          />
          <ProjectFact term="Time invested" value={article.project.timeInvested} />
          {article.project.humanIntervention ? (
            <ProjectFact
              term="Human intervention"
              value={article.project.humanIntervention}
            />
          ) : null}
          {article.project.outcome ? (
            <ProjectFact term="Outcome" value={article.project.outcome} />
          ) : null}
        </dl>
      ) : null}
      {article.project?.repo ? (
        <p className="mt-3 text-[0.875rem]">
          <a
            href={article.project.repo}
            target="_blank"
            rel="noopener"
            className="font-medium text-ink underline decoration-line-2 underline-offset-2 hover:decoration-accent"
          >
            Project repository
          </a>
        </p>
      ) : null}
    </header>
  );
}

function ProjectFact({ term, value }: { term: string; value: string }) {
  return (
    <div>
      <dt className="label text-ink-3">{term}</dt>
      <dd className="mt-1 text-[0.9375rem] leading-snug text-ink">{value}</dd>
    </div>
  );
}

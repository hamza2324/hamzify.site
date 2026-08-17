import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { formatRecordLabel } from "@/lib/records";
import { cn, formatDate } from "@/lib/utils";
import type { Article } from "@/types/content";

/**
 * Build logs get their own card because the interesting metadata is different:
 * what the project was, what it was built with, and whether it survived. Laid
 * out as a project record — closer to a lab notebook entry than a blog teaser.
 */
export function BuildLogCard({
  article,
  className,
}: {
  article: Article;
  className?: string;
}) {
  const project = article.project;
  if (!project) return null;

  return (
    <article
      data-accent="teal"
      className={cn(
        "group relative flex flex-col gap-4 rounded-md border border-line bg-surface p-5 transition-colors hover:border-line-2",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="label text-[var(--local-accent)]">
            {formatRecordLabel(article)}
          </span>
          <p className="mt-3 label text-ink-3">Project</p>
          <h3 className="mt-1 font-display text-display-s font-semibold leading-tight text-ink">
            <Link
              href={article.path}
              className="after:absolute after:inset-0 after:content-['']"
            >
              {project.name}
            </Link>
          </h3>
        </div>
        <ArrowUpRight
          className="mt-1 size-4 shrink-0 text-ink-3 transition-transform duration-200 ease-brand group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-teal"
          aria-hidden="true"
        />
      </div>

      <p className="text-[0.9375rem] leading-relaxed text-ink-2">
        {project.objective}
      </p>

      <dl className="mt-auto grid gap-x-6 gap-y-3 border-t border-line pt-4 font-mono text-[0.6875rem] uppercase tracking-[0.06em] sm:grid-cols-2">
        <div>
          <dt className="text-ink-3">Stack</dt>
          <dd className="mt-1 normal-case tracking-normal text-ink-2">
            {project.stack.join(" · ")}
          </dd>
        </div>
        <div>
          <dt className="text-ink-3">AI tools</dt>
          <dd className="mt-1 normal-case tracking-normal text-ink-2">
            {project.aiTools.join(" · ")}
          </dd>
        </div>
        <div>
          <dt className="text-ink-3">Status</dt>
          <dd className="mt-1 flex items-center gap-1.5 normal-case tracking-normal text-ink-2">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-teal"
            />
            {project.status}
          </dd>
        </div>
        <div>
          <dt className="text-ink-3">Time invested</dt>
          <dd className="mt-1 normal-case tracking-normal text-ink-2">
            {project.timeInvested}
          </dd>
        </div>
      </dl>

      <p className="text-[0.75rem] text-ink-3">
        <span className="line-clamp-1">{article.title}</span>
        <span className="mt-1 block">
          <time dateTime={article.publishedAt}>
            {formatDate(article.publishedAt)}
          </time>
          {" · "}
          {article.readingTime.text}
        </span>
      </p>
    </article>
  );
}

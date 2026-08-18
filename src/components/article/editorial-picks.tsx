import Link from "next/link";

import type { Article } from "@/types/content";

export function EditorialPicks({
  articles,
  kicker = "Editor's picks",
  title,
}: {
  articles: Article[];
  kicker?: string;
  title?: string;
}) {
  if (articles.length === 0) return null;

  return (
    <section aria-labelledby="editorial-picks">
      <p className="label text-ink-3">{kicker}</p>
      {title ? (
        <h2
          id="editorial-picks"
          className="mt-2 font-display text-[1.25rem] font-semibold text-ink"
        >
          {title}
        </h2>
      ) : (
        <h2 id="editorial-picks" className="sr-only">
          {kicker}
        </h2>
      )}
      <ul className="mt-4 flex flex-col gap-3">
        {articles.map((article) => (
          <li key={article.slug}>
            <Link
              href={article.path}
              className="group flex min-h-11 flex-col rounded-sm border border-line bg-surface px-4 py-3 transition-colors hover:border-line-2"
            >
              <span className="font-medium text-ink group-hover:underline group-hover:decoration-accent">
                {article.title}
              </span>
              <span className="mt-1 text-[0.8125rem] leading-snug text-ink-3">
                {article.dek ?? article.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

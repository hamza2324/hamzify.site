"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useDeferredValue, useEffect, useId, useMemo, useState } from "react";

import { searchDocuments } from "@/lib/search";
import { cn, formatDate } from "@/lib/utils";
import type { SearchDocument } from "@/types/content";

/**
 * Site search.
 *
 * The index arrives as a prop from the server component, so this file knows
 * nothing about the filesystem and swapping in a hosted search provider later
 * only changes where `results` comes from.
 *
 * The query lives in `?q=` so a search is linkable and the back button behaves,
 * updated with `replace` so typing does not fill the history stack.
 */
export function SearchExperience({
  documents,
  categories,
}: {
  documents: SearchDocument[];
  categories: Array<{ slug: string; label: string }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputId = useId();

  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<string>("all");
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      const search = params.toString();
      router.replace(search ? `/search/?${search}` : "/search/", {
        scroll: false,
      });
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [query, router]);

  const results = useMemo(() => {
    const matches = searchDocuments(deferredQuery, documents);
    return category === "all"
      ? matches
      : matches.filter((result) => result.category === category);
  }, [deferredQuery, documents, category]);

  const hasQuery = deferredQuery.trim().length > 1;

  return (
    <div>
      <div className="rounded-md border border-line bg-surface p-4 sm:p-5">
        <label htmlFor={inputId} className="label block text-ink-3">
          Search the archive
        </label>

        <div className="relative mt-2">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-3"
            aria-hidden="true"
          />
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cursor, build log, agents, code review…"
            autoComplete="off"
            // The search box is the reason for visiting this page.
            autoFocus
            className="w-full rounded-sm border border-line-2 bg-paper py-2.5 pl-9 pr-9 text-[0.9375rem] text-ink placeholder:text-ink-3"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1 text-ink-3 transition-colors hover:text-ink"
            >
              <X className="size-4" aria-hidden="true" />
              <span className="sr-only">Clear search</span>
            </button>
          ) : null}
        </div>

        <fieldset className="mt-4">
          <legend className="label text-ink-3">Filter by category</legend>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[{ slug: "all", label: "Everything" }, ...categories].map(
              (option) => {
                const active = category === option.slug;
                return (
                  <button
                    key={option.slug}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setCategory(option.slug)}
                    className={cn(
                      "rounded-xs border px-2.5 py-1 font-mono text-[0.75rem] uppercase tracking-[0.06em] transition-colors",
                      active
                        ? "border-line-strong bg-ink text-ink-inverse"
                        : "border-line text-ink-2 hover:border-line-2 hover:text-ink",
                    )}
                  >
                    {option.label}
                  </button>
                );
              },
            )}
          </div>
        </fieldset>
      </div>

      <div className="mt-8" aria-live="polite">
        {!hasQuery ? (
          <div>
            <p className="text-[0.9375rem] leading-relaxed text-ink-2">
              Type at least two characters. Search covers titles, descriptions,
              tools, tags, categories and formats. It runs in your browser, so
              nothing you type is sent anywhere.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {categories.map((option) => (
                <li key={option.slug}>
                  <Link
                    href={`/${option.slug}/`}
                    className="inline-flex min-h-11 items-center rounded-sm border border-line px-3 py-2 text-sm text-ink-2 hover:border-line-2 hover:text-ink"
                  >
                    {option.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-md border border-dashed border-line px-6 py-12 text-center">
            <p className="font-display text-[1.125rem] font-semibold text-ink">
              Nothing in the notebook matched “{deferredQuery.trim()}”
            </p>
            <p className="mx-auto mt-2 max-w-md text-[0.9375rem] leading-relaxed text-ink-2">
              Try a tool name (Cursor, Copilot, Claude), a format like “review”
              or “build log”, or browse{" "}
              <Link
                href="/latest/"
                className="underline decoration-line-2 underline-offset-2 hover:decoration-accent"
              >
                the full archive
              </Link>
              .
            </p>
            <ul className="mt-5 flex flex-wrap justify-center gap-2">
              {categories.map((option) => (
                <li key={option.slug}>
                  <Link
                    href={`/${option.slug}/`}
                    className="inline-flex min-h-11 items-center rounded-sm border border-line px-3 py-2 text-sm text-ink-2 hover:border-line-2 hover:text-ink"
                  >
                    {option.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <>
            <p className="label text-ink-3">
              {results.length} {results.length === 1 ? "result" : "results"}
            </p>

            <ul className="mt-4 divide-y divide-line border-t border-line">
              {results.map((result) => (
                <li key={result.path} className="group relative py-5">
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.75rem] text-ink-3">
                    <span className="font-mono uppercase tracking-[0.06em]">
                      {result.articleTypeLabel}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{result.categoryLabel}</span>
                    <span aria-hidden="true">·</span>
                    <time dateTime={result.publishedAt}>
                      {formatDate(result.publishedAt)}
                    </time>
                    <span aria-hidden="true">·</span>
                    <span>{result.readingTime}</span>
                  </div>

                  <h2 className="mt-1.5 font-display text-[1.1875rem] font-semibold leading-snug text-ink">
                    <Link
                      href={result.path}
                      className="link-underline decoration-transparent after:absolute after:inset-0 after:content-[''] group-hover:decoration-current"
                    >
                      {result.title}
                    </Link>
                  </h2>

                  <p className="mt-1.5 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-2">
                    {result.description}
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

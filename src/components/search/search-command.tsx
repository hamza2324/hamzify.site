"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { searchDocuments } from "@/lib/search";
import { formatDate } from "@/lib/utils";
import type { SearchDocument } from "@/types/content";

export const SEARCH_EVENT = "hamzify:search";

export function openSearch() {
  window.dispatchEvent(new Event(SEARCH_EVENT));
}

/**
 * Command search overlay.
 *
 * Opens from the header or from ⌘K / Ctrl+K. The dedicated `/search` page stays
 * as the shareable, filterable version of the same index.
 */
export function SearchCommand({ documents }: { documents: SearchDocument[] }) {
  const router = useRouter();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(SEARCH_EVENT, onOpen);
    return () => window.removeEventListener(SEARCH_EVENT, onOpen);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const results = useMemo(
    () => searchDocuments(query, documents, 8),
    [query, documents],
  );

  if (!open) return null;

  const go = (path: string) => {
    close();
    router.push(path);
  };

  return (
    <div
      className="fixed inset-0 z-[var(--z-modal)] flex items-start justify-center bg-ink/40 px-3 pt-[8vh] sm:px-4 sm:pt-[12vh] backdrop-blur-[2px]"
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={inputId}
        className="w-full max-w-xl overflow-hidden rounded-md border border-line-2 bg-paper shadow-md"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            close();
          }
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setActive((value) => Math.min(value + 1, results.length - 1));
          }
          if (event.key === "ArrowUp") {
            event.preventDefault();
            setActive((value) => Math.max(value - 1, 0));
          }
          if (event.key === "Enter" && results[active]) {
            event.preventDefault();
            go(results[active].path);
          }
        }}
      >
        <div className="relative border-b border-line">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-3"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            id={inputId}
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            placeholder="Search experiments, tools, build logs…"
            autoComplete="off"
            className="w-full bg-transparent py-3.5 pr-4 pl-11 text-[0.9375rem] text-ink placeholder:text-ink-3"
          />
        </div>

        <div className="max-h-[min(24rem,50vh)] overflow-y-auto">
          {query.trim().length > 1 && results.length === 0 ? (
            <p className="px-4 py-8 text-center text-[0.9375rem] text-ink-2">
              Nothing in the notebook matched “{query.trim()}”. Try a tool name,
              or a format like “review”.
            </p>
          ) : results.length > 0 ? (
            <ul className="py-2">
              {results.map((result, index) => (
                <li key={result.path}>
                  <Link
                    href={result.path}
                    onClick={close}
                    onMouseEnter={() => setActive(index)}
                    className={`block px-4 py-2.5 ${
                      index === active ? "bg-surface-2" : ""
                    }`}
                  >
                    <span className="label text-ink-3">
                      {result.articleTypeLabel}
                      <span className="mx-1.5 text-line-2">·</span>
                      {result.categoryLabel}
                    </span>
                    <span className="mt-0.5 block font-display text-[1.0125rem] font-semibold leading-snug text-ink">
                      {result.title}
                    </span>
                    <span className="mt-0.5 block truncate text-[0.8125rem] text-ink-3">
                      {result.description}
                      <span className="ml-2">
                        {formatDate(result.publishedAt)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-6 text-[0.875rem] text-ink-3">
              Type at least two characters. ⌘K / Ctrl+K toggles this overlay.
            </p>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-line px-4 py-2.5 text-[0.75rem] text-ink-3">
          <span>Enter to open · Esc to close</span>
          <Link
            href={query.trim() ? `/search/?q=${encodeURIComponent(query.trim())}` : "/search/"}
            onClick={close}
            className="underline decoration-line-2 underline-offset-2 hover:decoration-accent"
          >
            Full search
          </Link>
        </div>
      </div>
    </div>
  );
}

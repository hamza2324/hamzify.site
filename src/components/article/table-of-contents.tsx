"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import type { Heading } from "@/types/content";

/**
 * Sticky table of contents with an active-section indicator.
 *
 * The list is rendered server-side from the parsed headings, so it is in the
 * HTML and crawlable; this client component only adds the highlight. Uses a
 * single IntersectionObserver over the real heading elements rather than a
 * scroll handler doing layout reads on every frame.
 */
export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? "");
  const visible = useRef(new Set<string>());

  useEffect(() => {
    if (headings.length === 0) return;

    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    const order = new Map(headings.map((heading, index) => [heading.id, index]));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.current.add(entry.target.id);
          else visible.current.delete(entry.target.id);
        }

        if (visible.current.size > 0) {
          // Highlight the topmost heading currently on screen.
          const topmost = [...visible.current].sort(
            (a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0),
          )[0];
          setActiveId(topmost);
        }
      },
      {
        // Ignore the sticky header band and the bottom half of the viewport, so
        // the highlight tracks what you are reading rather than what is barely
        // peeking into view.
        rootMargin: "-96px 0px -55% 0px",
        threshold: 0,
      },
    );

    for (const element of elements) observer.observe(element);
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav aria-labelledby="toc-heading" className="text-[0.8125rem]">
      <h2 id="toc-heading" className="label text-ink-3">
        On this page
      </h2>
      <ol className="mt-3 flex flex-col gap-0.5 border-l border-line">
        {headings.map((heading) => {
          const active = heading.id === activeId;
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                aria-current={active ? "location" : undefined}
                className={cn(
                  "-ml-px block border-l py-1 leading-snug transition-colors",
                  heading.level === 3 ? "pl-6" : "pl-3",
                  active
                    ? "border-accent font-medium text-violet"
                    : "border-transparent text-ink-3 hover:border-violet-line hover:text-ink-2",
                )}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

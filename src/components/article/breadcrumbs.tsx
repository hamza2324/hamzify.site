import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export type Crumb = { name: string; path: string };

/**
 * Visible breadcrumbs that mirror the `BreadcrumbList` structured data exactly.
 * The current page is the last item and is not a link, marked with
 * `aria-current`.
 */
export function Breadcrumbs({
  items,
  className,
}: {
  items: Crumb[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn(className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-[0.75rem] text-ink-3">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1.5">
              {isLast ? (
                <span
                  aria-current="page"
                  className="max-w-[22ch] truncate font-mono uppercase tracking-[0.06em] text-ink-2 sm:max-w-none"
                >
                  {item.name}
                </span>
              ) : (
                <>
                  <Link
                    href={item.path}
                    className="font-mono uppercase tracking-[0.06em] transition-colors hover:text-ink"
                  >
                    {item.name}
                  </Link>
                  <ChevronRight
                    className="size-3 text-line-2"
                    aria-hidden="true"
                  />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

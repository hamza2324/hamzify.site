import type { ReactNode } from "react";

import { Breadcrumbs, type Crumb } from "@/components/article/breadcrumbs";
import { AccentRule } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import type { AccentKey } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";

/**
 * Masthead for every non-article page: category indexes, hubs, about, contact,
 * search and the policy pages. One component means the `h1` treatment, kicker
 * and intro measure are identical everywhere.
 */
export function PageHeader({
  kicker,
  title,
  intro,
  accent,
  crumbs,
  meta,
  children,
  className,
}: {
  kicker: string;
  title: string;
  intro?: string;
  accent?: AccentKey;
  crumbs?: Crumb[];
  /** Small monospaced facts under the intro, e.g. an article count. */
  meta?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn("border-b border-line bg-surface-2", className)}
      data-accent={accent}
    >
      <Container className="py-10 sm:py-14 lg:py-16">
        {crumbs?.length ? <Breadcrumbs items={crumbs} className="mb-6" /> : null}

        <div className="flex items-center gap-3">
          <AccentRule accent={accent} />
          <span className="label text-ink-3">{kicker}</span>
        </div>

        <h1 className="mt-4 max-w-3xl font-display text-display-l font-semibold text-ink">
          {title}
        </h1>

        {intro ? (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-2 sm:text-[1.0625rem]">
            {intro}
          </p>
        ) : null}

        {meta ? (
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.75rem] text-ink-3">
            {meta}
          </div>
        ) : null}

        {children ? <div className="mt-7">{children}</div> : null}
      </Container>
    </header>
  );
}

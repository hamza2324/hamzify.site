import type { ComponentType, ReactNode } from "react";

import type { AccentKey } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";

type ContentBlockProps = {
  label: string;
  title?: string;
  icon?: ComponentType<{ className?: string }>;
  accent?: AccentKey;
  children: ReactNode;
  className?: string;
  /** `plain` removes the border for blocks that already sit inside one. */
  variant?: "framed" | "plain";
};

/**
 * The shared shell for every structured editorial block (takeaways, verdicts,
 * methodology, and so on). Having one shell is what makes an article with six
 * different block types still read as a single designed page, and it keeps the
 * markup consistent: a labelled `<aside>`-like region with a heading.
 */
export function ContentBlock({
  label,
  title,
  icon: Icon,
  accent,
  children,
  className,
  variant = "framed",
}: ContentBlockProps) {
  return (
    <section
      data-accent={accent}
      className={cn(
        "not-prose my-8 rounded-md",
        variant === "framed" && "border border-line bg-surface",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 border-b border-line px-4 py-2.5",
          "bg-[color-mix(in_oklab,var(--local-accent)_6%,transparent)]",
        )}
      >
        {Icon ? (
          <Icon className="size-3.5 text-[var(--local-accent)]" />
        ) : null}
        <h2 className="label text-[var(--local-accent)]">{label}</h2>
      </div>

      <div className="px-4 py-4">
        {title ? (
          <h3 className="mb-3 font-display text-lg font-semibold text-ink">
            {title}
          </h3>
        ) : null}
        {children}
      </div>
    </section>
  );
}

/** Definition-list row used inside blocks for `label: value` pairs. */
export function SpecRow({
  term,
  children,
}: {
  term: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1 border-b border-line/70 py-2.5 last:border-0 sm:grid-cols-[10rem_1fr] sm:gap-4">
      <dt className="label pt-0.5 text-ink-3">{term}</dt>
      <dd className="text-[0.9375rem] leading-relaxed text-ink-2">
        {children}
      </dd>
    </div>
  );
}

export function SpecList({ children }: { children: ReactNode }) {
  return <dl className="not-prose">{children}</dl>;
}

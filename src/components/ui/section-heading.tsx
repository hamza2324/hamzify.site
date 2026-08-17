import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

import { AccentRule } from "@/components/ui/badge";
import type { AccentKey } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  /** Small monospaced eyebrow, e.g. "Build logs". */
  kicker: string;
  title: string;
  description?: ReactNode;
  accent?: AccentKey;
  action?: { href: string; label: string };
  /** Headings inside `<section>` should almost always be h2. */
  as?: "h2" | "h3";
  className?: string;
};

export function SectionHeading({
  kicker,
  title,
  description,
  accent,
  action,
  as: Tag = "h2",
  className,
}: SectionHeadingProps) {
  return (
    <div
      data-accent={accent}
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="max-w-2xl">
        <div className="flex items-center gap-3">
          <AccentRule accent={accent} />
          <span className="label text-[var(--local-accent)]">{kicker}</span>
        </div>
        <Tag className="mt-3 font-display text-display-s font-semibold text-ink">
          {title}
        </Tag>
        {description ? (
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-2">
            {description}
          </p>
        ) : null}
      </div>

      {action ? (
        <Link
          href={action.href}
          className="group inline-flex shrink-0 items-center gap-1.5 self-start text-sm font-medium text-ink transition-colors hover:text-accent md:self-end"
        >
          {action.label}
          <ArrowRight
            className="size-4 transition-transform duration-200 ease-brand group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      ) : null}
    </div>
  );
}

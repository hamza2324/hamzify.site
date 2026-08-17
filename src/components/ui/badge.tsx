import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { AccentKey } from "@/lib/taxonomy";

type BadgeProps = {
  children: ReactNode;
  accent?: AccentKey;
  /**
   * `solid` for the primary content-type badge, `soft` for tinted context
   * chips, `outline` for neutral metadata.
   */
  variant?: "solid" | "soft" | "outline";
  className?: string;
};

/**
 * The badge is how a reader tells a review from a comparison from a build log
 * at a glance, so the hue is meaningful rather than decorative.
 */
export function Badge({
  children,
  accent,
  variant = "soft",
  className,
}: BadgeProps) {
  return (
    <span
      data-accent={accent}
      className={cn(
        "label inline-flex items-center gap-1.5 rounded-xs px-1.5 py-0.5",
        variant === "soft" && "bg-[var(--local-accent-soft)]",
        variant === "outline" && "border border-line text-ink-3",
        variant === "solid" && "text-ink-inverse",
        className,
      )}
      style={
        variant === "soft"
          ? { color: "var(--local-accent)" }
          : variant === "solid"
            ? { backgroundColor: "var(--local-accent)" }
            : undefined
      }
    >
      {children}
    </span>
  );
}

/**
 * A short accent-coloured rule. Used above section headings to tie a block to
 * its category colour without adding another box.
 */
export function AccentRule({
  accent,
  className,
}: {
  accent?: AccentKey;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      data-accent={accent}
      className={cn("block h-px w-8 bg-[var(--local-accent)]", className)}
    />
  );
}

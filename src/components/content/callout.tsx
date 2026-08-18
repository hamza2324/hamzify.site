import {
  AlertTriangle,
  FlaskConical,
  Info,
  Lightbulb,
  MessageSquareQuote,
  OctagonAlert,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import type { AccentKey } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";

type CalloutVariant =
  | "note"
  | "important"
  | "experiment"
  | "warning"
  | "caution"
  | "tip"
  | "builder-tip"
  | "my-take";

const VARIANTS: Record<
  CalloutVariant,
  { icon: LucideIcon; accent: AccentKey; defaultTitle: string }
> = {
  note: { icon: Info, accent: "indigo", defaultTitle: "Note" },
  important: { icon: OctagonAlert, accent: "ember", defaultTitle: "Important" },
  experiment: { icon: FlaskConical, accent: "teal", defaultTitle: "Experiment" },
  warning: { icon: AlertTriangle, accent: "amber", defaultTitle: "Warning" },
  caution: { icon: OctagonAlert, accent: "ember", defaultTitle: "Careful" },
  tip: { icon: Lightbulb, accent: "teal", defaultTitle: "Tip" },
  "builder-tip": {
    icon: Lightbulb,
    accent: "teal",
    defaultTitle: "Builder tip",
  },
  "my-take": {
    icon: MessageSquareQuote,
    accent: "olive",
    defaultTitle: "My take",
  },
};

/**
 * Inline aside for notes, experiments, warnings and the writer's own view.
 *
 * Distinction comes from the label, icon and a quiet tint — not a rainbow of
 * boxes. Colour is never the only signal: the title is real text.
 */
export function Callout({
  variant = "note",
  title,
  children,
  className,
}: {
  variant?: CalloutVariant;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  const { icon: Icon, accent, defaultTitle } = VARIANTS[variant];

  return (
    <aside
      data-accent={accent}
      className={cn(
        "not-prose my-7 flex gap-3 rounded-md border border-line bg-surface px-4 py-3.5",
        className,
      )}
      style={{
        borderLeftWidth: 2,
        borderLeftColor: "var(--local-accent)",
        backgroundColor: "var(--local-accent-soft)",
      }}
    >
      <Icon
        className="mt-0.5 size-4 shrink-0 text-[var(--local-accent)]"
        aria-hidden="true"
      />
      <div className="min-w-0">
        <p className="label text-[var(--local-accent)]">
          {title ?? defaultTitle}
        </p>
        <div className="mt-1 space-y-2 text-[0.9375rem] leading-relaxed text-ink-2 [&_a]:underline [&_a]:decoration-current [&_code]:rounded-xs [&_code]:bg-surface [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.85em]">
          {children}
        </div>
      </div>
    </aside>
  );
}

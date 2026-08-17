import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { TOOL_STATUS_LABEL, type Tool } from "@/lib/tools";
import { cn } from "@/lib/utils";

const STATUS_STYLE = {
  live: { dot: "bg-teal", text: "text-teal" },
  building: { dot: "bg-amber", text: "text-amber" },
  planned: { dot: "bg-ink-3", text: "text-ink-3" },
} as const;

/**
 * Tool cards for `/tools` and the homepage lab preview.
 *
 * A planned tool renders as a static card with no link and a visible status, so
 * there is no dead link to click and no ambiguity about what exists.
 */
export function ToolList({
  tools,
  className,
}: {
  tools: Tool[];
  className?: string;
}) {
  return (
    <ul className={cn("grid gap-5 md:grid-cols-3", className)}>
      {tools.map((tool) => {
        const status = STATUS_STYLE[tool.status];
        const isLive = tool.status === "live" && tool.href;

        return (
          <li
            key={tool.slug}
            data-accent="olive"
            className={cn(
              "group relative flex flex-col gap-3 rounded-md border p-5",
              isLive
                ? "border-line bg-surface transition-colors hover:border-line-2"
                : "border-dashed border-line bg-transparent",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <span
                className={cn("label flex items-center gap-1.5", status.text)}
              >
                <span
                  aria-hidden="true"
                  className={cn("size-1.5 rounded-full", status.dot)}
                />
                {TOOL_STATUS_LABEL[tool.status]}
              </span>

              {isLive ? (
                <ArrowUpRight
                  className="size-4 shrink-0 text-ink-3 transition-transform duration-200 ease-brand group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-olive"
                  aria-hidden="true"
                />
              ) : null}
            </div>

            <h3 className="font-display text-[1.1875rem] font-semibold leading-snug text-ink">
              {isLive ? (
                <Link
                  href={tool.href as string}
                  className="link-underline decoration-transparent after:absolute after:inset-0 after:content-[''] group-hover:decoration-current"
                >
                  {tool.name}
                </Link>
              ) : (
                tool.name
              )}
            </h3>

            <p className="text-[0.9375rem] leading-relaxed text-ink-2">
              {tool.summary}
            </p>

            <p className="text-[0.8125rem] leading-relaxed text-ink-3">
              {tool.detail}
            </p>

            <ul className="mt-auto flex flex-wrap gap-1.5 pt-2">
              {tool.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-xs border border-line px-1.5 py-0.5 font-mono text-[0.6875rem] text-ink-3"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </li>
        );
      })}
    </ul>
  );
}

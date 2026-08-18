import Link from "next/link";

import { Container } from "@/components/ui/container";

/**
 * A quiet orientation path for first-time readers.
 *
 * Sits under the editorial signal so it never competes with the featured
 * story. Four destinations, written as situations rather than a sitemap.
 */

const PATHS = [
  {
    href: "/ai-coding-tools/",
    ifYou: "If you are evaluating AI coding tools",
    go: "Reviews and comparisons",
  },
  {
    href: "/build-logs/",
    ifYou: "If you want to see what happens in real projects",
    go: "Build logs",
  },
  {
    href: "/vibe-coding/",
    ifYou: "If you are experimenting with AI-assisted development",
    go: "Vibe coding",
  },
  {
    href: "/workflows/",
    ifYou: "If you want a process you can run again tomorrow",
    go: "Workflows",
  },
] as const;

export function StartHere() {
  return (
    <section
      id="start-here"
      aria-labelledby="start-here-heading"
      className="border-b border-line bg-paper py-10 sm:py-12"
    >
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="max-w-sm shrink-0">
            <p className="label text-ink-3">Start here</p>
            <h2
              id="start-here-heading"
              className="mt-2 font-display text-[1.25rem] font-semibold text-ink sm:text-[1.375rem]"
            >
              New to Hamzify? Pick the question you actually have.
            </h2>
          </div>

          <ol className="grid min-w-0 flex-1 gap-x-10 gap-y-5 sm:grid-cols-2">
            {PATHS.map((path, index) => (
              <li key={path.href} className="min-w-0">
                <p className="text-[0.8125rem] leading-snug text-ink-3">
                  <span className="font-mono tabular-nums text-ink-3">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="mx-2 text-line-2" aria-hidden="true">
                    /
                  </span>
                  {path.ifYou}
                </p>
                <Link
                  href={path.href}
                  className="mt-1 inline-flex min-h-11 items-center text-[0.9875rem] font-medium text-ink underline decoration-line-2 underline-offset-4 hover:decoration-accent"
                >
                  {path.go}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}

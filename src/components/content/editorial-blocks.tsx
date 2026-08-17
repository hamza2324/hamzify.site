import {
  BookOpenCheck,
  CircleCheck,
  CircleX,
  FlaskConical,
  Gavel,
  GitBranch,
  Layers,
  ListChecks,
  Link2,
  TestTubeDiagonal,
} from "lucide-react";
import type { ReactNode } from "react";

import { ContentBlock, SpecList, SpecRow } from "@/components/content/block";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Key takeaways                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Sits near the top of long articles. Written as claims a reader can act on,
 * which also happens to be the format generative search engines quote well.
 */
export function KeyTakeaways({ items }: { items: string[] }) {
  return (
    <ContentBlock label="Key takeaways" icon={ListChecks} accent="ember">
      <ol className="not-prose flex flex-col gap-2.5">
        {items.map((item, index) => (
          <li key={item} className="flex gap-3">
            <span className="label mt-0.5 shrink-0 text-ink-3 tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-[0.9375rem] leading-relaxed text-ink-2">
              {item}
            </span>
          </li>
        ))}
      </ol>
    </ContentBlock>
  );
}

/* -------------------------------------------------------------------------- */
/* Pros and cons                                                              */
/* -------------------------------------------------------------------------- */

export function ProsCons({
  pros,
  cons,
  prosLabel = "What works",
  consLabel = "What does not",
}: {
  pros: string[];
  cons: string[];
  prosLabel?: string;
  consLabel?: string;
}) {
  return (
    <div className="not-prose my-8 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2">
      <section className="bg-surface p-4">
        <h2 className="label flex items-center gap-2 text-teal">
          <CircleCheck className="size-3.5" aria-hidden="true" />
          {prosLabel}
        </h2>
        <ul className="mt-3 flex flex-col gap-2">
          {pros.map((item) => (
            <li
              key={item}
              className="text-[0.9375rem] leading-relaxed text-ink-2 before:mr-2 before:text-teal before:content-['+']"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-surface p-4">
        <h2 className="label flex items-center gap-2 text-ember">
          <CircleX className="size-3.5" aria-hidden="true" />
          {consLabel}
        </h2>
        <ul className="mt-3 flex flex-col gap-2">
          {cons.map((item) => (
            <li
              key={item}
              className="text-[0.9375rem] leading-relaxed text-ink-2 before:mr-2 before:text-ember before:content-['−']"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Verdict                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Deliberately has no score. A number implies a precision that a hands-on test
 * of a fast-moving tool cannot honestly claim, so the verdict is prose plus an
 * explicit "who should skip this".
 */
export function Verdict({
  summary,
  bestFor,
  skipIf,
  children,
}: {
  summary: string;
  bestFor?: string;
  skipIf?: string;
  children?: ReactNode;
}) {
  return (
    <ContentBlock label="Verdict" icon={Gavel} accent="amber">
      <p className="not-prose font-display text-lg leading-snug text-ink">
        {summary}
      </p>
      {children ? (
        <div className="mt-3 space-y-2 text-[0.9375rem] leading-relaxed text-ink-2">
          {children}
        </div>
      ) : null}
      {bestFor || skipIf ? (
        <SpecList>
          {bestFor ? <SpecRow term="Best for">{bestFor}</SpecRow> : null}
          {skipIf ? <SpecRow term="Skip it if">{skipIf}</SpecRow> : null}
        </SpecList>
      ) : null}
    </ContentBlock>
  );
}

/* -------------------------------------------------------------------------- */
/* Test methodology                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Every review carries one of these. Stating the version, duration and task is
 * the difference between a review and an opinion, and it lets a reader judge
 * how much the result should transfer to their own work.
 */
export function TestMethodology({
  version,
  duration,
  task,
  environment,
  cost,
  children,
}: {
  version: string;
  duration: string;
  task: string;
  environment?: string;
  cost?: string;
  children?: ReactNode;
}) {
  return (
    <ContentBlock
      label="How this was tested"
      icon={TestTubeDiagonal}
      accent="teal"
    >
      <SpecList>
        <SpecRow term="Version tested">{version}</SpecRow>
        <SpecRow term="Time spent">{duration}</SpecRow>
        <SpecRow term="Task">{task}</SpecRow>
        {environment ? (
          <SpecRow term="Environment">{environment}</SpecRow>
        ) : null}
        {cost ? <SpecRow term="Cost">{cost}</SpecRow> : null}
      </SpecList>
      {children ? (
        <div className="mt-3 space-y-2 text-[0.9375rem] leading-relaxed text-ink-2">
          {children}
        </div>
      ) : null}
    </ContentBlock>
  );
}

/* -------------------------------------------------------------------------- */
/* Experiment setup                                                           */
/* -------------------------------------------------------------------------- */

export function ExperimentSetup({
  hypothesis,
  setup,
  method,
  measured,
  limitations,
}: {
  hypothesis: string;
  setup: string;
  method: string;
  measured: string;
  limitations: string[];
}) {
  return (
    <ContentBlock label="Experiment" icon={FlaskConical} accent="ember">
      <SpecList>
        <SpecRow term="Hypothesis">{hypothesis}</SpecRow>
        <SpecRow term="Setup">{setup}</SpecRow>
        <SpecRow term="Method">{method}</SpecRow>
        <SpecRow term="Measured">{measured}</SpecRow>
      </SpecList>

      <div className="mt-4 rounded-sm border border-line bg-surface-2 p-3">
        <h3 className="label text-ink-3">Limitations</h3>
        <ul className="mt-2 flex flex-col gap-1.5">
          {limitations.map((item) => (
            <li
              key={item}
              className="text-[0.875rem] leading-relaxed text-ink-2 before:mr-2 before:text-ink-3 before:content-['—']"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </ContentBlock>
  );
}

/* -------------------------------------------------------------------------- */
/* Tool comparison table                                                      */
/* -------------------------------------------------------------------------- */

export type ComparisonRow = {
  criterion: string;
  /** One value per tool, in the same order as `tools`. */
  values: string[];
  /** Index of the tool that wins this row, when there is a clear winner. */
  winner?: number;
};

/**
 * A comparison table that survives mobile. The header row is sticky
 * horizontally scrolled rather than reflowed, because comparing values across
 * columns is the entire point of the component.
 */
export function ToolComparison({
  tools,
  rows,
  caption,
}: {
  tools: string[];
  rows: ComparisonRow[];
  caption?: string;
}) {
  return (
    <figure className="not-prose my-8">
      <div className="overflow-x-auto rounded-md border border-line bg-surface">
        <table className="w-full min-w-[36rem] border-collapse text-left">
          <thead className="bg-surface-2">
            <tr>
              <th scope="col" className="label px-3 py-2.5 text-ink-3">
                Criterion
              </th>
              {tools.map((tool) => (
                <th
                  key={tool}
                  scope="col"
                  className="px-3 py-2.5 text-[0.875rem] font-semibold text-ink"
                >
                  {tool}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.criterion} className="border-t border-line">
                <th
                  scope="row"
                  className="px-3 py-2.5 text-[0.875rem] font-medium text-ink-2"
                >
                  {row.criterion}
                </th>
                {row.values.map((value, index) => (
                  <td
                    key={`${row.criterion}-${index}`}
                    className={cn(
                      "px-3 py-2.5 align-top text-[0.875rem] leading-relaxed",
                      row.winner === index
                        ? "font-medium text-ink"
                        : "text-ink-2",
                    )}
                  >
                    {row.winner === index ? (
                      <span
                        aria-label="Better in this row"
                        className="mr-1.5 text-teal"
                      >
                        ●
                      </span>
                    ) : null}
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption ? (
        <figcaption className="mt-2 text-[0.8125rem] text-ink-3">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/* -------------------------------------------------------------------------- */
/* Build timeline                                                             */
/* -------------------------------------------------------------------------- */

export type TimelineEntry = {
  label: string;
  title: string;
  detail: string;
  outcome?: "shipped" | "reworked" | "abandoned";
};

const OUTCOME_STYLE = {
  shipped: "text-teal",
  reworked: "text-amber",
  abandoned: "text-ember",
} as const;

export function BuildTimeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ContentBlock label="Build timeline" icon={GitBranch} accent="teal">
      <ol className="not-prose divide-y divide-line border-y border-line">
        {entries.map((entry) => (
          <li
            key={entry.title}
            className="grid gap-2 py-4 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-6"
          >
            <span className="label pt-0.5 text-ink-3">{entry.label}</span>
            <div>
              <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                <h3 className="text-[0.9375rem] font-semibold text-ink">
                  {entry.title}
                </h3>
                {entry.outcome ? (
                  <span className={cn("label", OUTCOME_STYLE[entry.outcome])}>
                    {entry.outcome}
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-[0.9375rem] leading-relaxed text-ink-2">
                {entry.detail}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </ContentBlock>
  );
}

/* -------------------------------------------------------------------------- */
/* Quick verdict — comparison pages                                           */
/* -------------------------------------------------------------------------- */

export function QuickVerdict({
  items,
}: {
  items: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="not-prose my-8 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="bg-surface px-4 py-4">
          <p className="label text-ink-3">{item.label}</p>
          <p className="mt-2 font-display text-[1.125rem] font-semibold leading-snug text-ink">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Project stack                                                              */
/* -------------------------------------------------------------------------- */

export function ProjectStack({
  stack,
  aiTools,
  hosting,
  repo,
  demo,
}: {
  stack: string[];
  aiTools: string[];
  hosting?: string;
  repo?: string;
  demo?: string;
}) {
  return (
    <ContentBlock label="Stack" icon={Layers} accent="indigo">
      <div className="not-prose flex flex-col gap-4">
        <StackGroup title="Application" items={stack} />
        <StackGroup title="AI tooling" items={aiTools} />
        {hosting ? <StackGroup title="Hosting" items={[hosting]} /> : null}
      </div>

      {repo || demo ? (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
          {repo ? (
            <a
              href={repo}
              target="_blank"
              rel="noopener"
              className="no-prose-link inline-flex items-center gap-1.5 rounded-sm border border-line px-2.5 py-1.5 text-[0.8125rem] font-medium text-ink transition-colors hover:border-line-2"
            >
              <Link2 className="size-3.5" aria-hidden="true" />
              Repository
            </a>
          ) : null}
          {demo ? (
            <a
              href={demo}
              target="_blank"
              rel="noopener"
              className="no-prose-link inline-flex items-center gap-1.5 rounded-sm border border-line px-2.5 py-1.5 text-[0.8125rem] font-medium text-ink transition-colors hover:border-line-2"
            >
              <Link2 className="size-3.5" aria-hidden="true" />
              Live demo
            </a>
          ) : null}
        </div>
      ) : null}
    </ContentBlock>
  );
}

function StackGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="label text-ink-3">{title}</h3>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-xs border border-line bg-surface-2 px-2 py-1 font-mono text-[0.75rem] text-ink-2"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Sources                                                                    */
/* -------------------------------------------------------------------------- */

export type Source = {
  title: string;
  href: string;
  publisher?: string;
  /** When the source was checked, so readers can judge staleness. */
  checked?: string;
};

export function Sources({ items }: { items: Source[] }) {
  return (
    <ContentBlock label="Sources" icon={BookOpenCheck} accent="indigo">
      <ol className="not-prose flex flex-col gap-2.5">
        {items.map((source) => (
          <li key={source.href} className="text-[0.9375rem] leading-relaxed">
            <a
              href={source.href}
              target="_blank"
              rel="noopener"
              className="no-prose-link font-medium text-ink underline decoration-line-2 underline-offset-2 transition-colors hover:decoration-accent"
            >
              {source.title}
            </a>
            {source.publisher ? (
              <span className="text-ink-3"> — {source.publisher}</span>
            ) : null}
            {source.checked ? (
              <span className="ml-1.5 font-mono text-[0.75rem] text-ink-3">
                checked {source.checked}
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </ContentBlock>
  );
}

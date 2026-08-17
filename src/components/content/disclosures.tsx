import Link from "next/link";
import { BadgeInfo, FlaskConical } from "lucide-react";
import type { ReactNode } from "react";

import { buildAffiliateUrl } from "@/lib/integrations";
import { cn } from "@/lib/utils";

/**
 * Shown above the article body whenever `affiliateDisclosure: true` is set in
 * frontmatter. Placed before the content rather than buried at the end, which
 * is both the FTC expectation and the honest option.
 */
export function AffiliateDisclosure({ compact = false }: { compact?: boolean }) {
  return (
    <aside
      className={cn(
        "not-prose flex gap-2.5 rounded-md border border-line bg-surface-2 px-3.5 py-3 text-[0.8125rem] leading-relaxed text-ink-2",
        compact ? "my-4" : "my-6",
      )}
    >
      <BadgeInfo
        className="mt-0.5 size-4 shrink-0 text-ink-3"
        aria-hidden="true"
      />
      <p>
        Tool coverage on Hamzify may include affiliate links. If you buy through
        one, Hamzify may earn a commission at no extra cost to you. It does not
        influence which tools get recommended or what the verdict says —{" "}
        <Link
          href="/affiliate-disclosure/"
          className="underline decoration-line-2 underline-offset-2 hover:decoration-accent"
        >
          how this works
        </Link>
        .
      </p>
    </aside>
  );
}

/**
 * An outbound partner link.
 *
 * `rel="sponsored nofollow noopener"` is set here rather than left to the author
 * so a forgotten attribute cannot turn into a search-guidelines problem, and
 * tracking parameters are appended centrally in `buildAffiliateUrl`.
 */
export function AffiliateLink({
  href,
  tag,
  campaign,
  children,
}: {
  href: string;
  tag?: string;
  campaign?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={buildAffiliateUrl(href, { tag, campaign })}
      target="_blank"
      rel="sponsored nofollow noopener"
      data-affiliate="true"
    >
      {children}
      <span className="sr-only"> (affiliate link, opens in a new tab)</span>
    </a>
  );
}

/**
 * Marks the placeholder articles that ship with the starter.
 *
 * The brief for this site is explicit that fictional experiments must not be
 * presented as things that happened, so sample content says so on the page —
 * not just in a frontmatter flag. Delete the article or set `sample: false`
 * once it describes real work.
 */
export function SampleNotice() {
  return (
    <aside className="not-prose my-6 flex gap-2.5 rounded-md border border-dashed border-amber/60 bg-amber-soft px-3.5 py-3">
      <FlaskConical
        className="mt-0.5 size-4 shrink-0 text-amber"
        aria-hidden="true"
      />
      <div className="text-[0.8125rem] leading-relaxed text-ink-2">
        <p className="font-semibold text-amber">Sample article</p>
        <p className="mt-0.5">
          This is placeholder content shipped with the Hamzify template to show
          the format. The numbers, timings and outcomes are illustrative, not
          results from a real test. Replace it with your own write-up.
        </p>
      </div>
    </aside>
  );
}

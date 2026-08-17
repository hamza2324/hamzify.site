import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { JsonLd } from "@/components/seo/json-ld";
import { ToolList } from "@/components/tools/tool-list";
import { Container } from "@/components/ui/container";
import { createMetadata } from "@/lib/metadata";
import { breadcrumbNode, webPageNode } from "@/lib/schema";
import { siteConfig } from "@/lib/site-config";
import { HUB_PAGES } from "@/lib/taxonomy";
import { getLiveTools, getPlannedTools } from "@/lib/tools";

/**
 * The lab.
 *
 * Publishing an empty page and saying it is empty is the honest option; the
 * alternative — filling it with tools that do not exist — is the exact thing the
 * brief rules out. When a real utility ships it gets a `status: "live"` entry in
 * `lib/tools.ts` and appears in the top section automatically.
 */

const hub = HUB_PAGES.find((page) => page.slug === "tools")!;

export const metadata: Metadata = createMetadata({
  title: hub.headline,
  description: hub.description,
  path: "/tools",
  keywords: hub.slug,
});

const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "Tools", path: "/tools/" },
];

export default function ToolsPage() {
  const live = getLiveTools();
  const planned = getPlannedTools();

  return (
    <>
      <JsonLd
        nodes={[
          webPageNode({
            title: hub.headline,
            description: hub.description,
            path: "/tools",
          }),
          breadcrumbNode(CRUMBS),
        ]}
      />

      <PageHeader
        kicker="The lab"
        title={hub.headline}
        intro={hub.description}
        accent="olive"
        crumbs={CRUMBS}
        meta={
          <span className="font-mono uppercase tracking-[0.06em]">
            {live.length} live · {planned.length} planned
          </span>
        }
      />

      <Container className="py-10 sm:py-14">
        <div className="flex flex-col gap-14">
          {live.length > 0 ? (
            <section>
              <h2 className="font-display text-display-s font-semibold text-ink">
                Available now
              </h2>
              <ToolList tools={live} className="mt-6" />
            </section>
          ) : (
            <section className="rounded-md border border-line bg-surface-2 px-6 py-10 sm:px-8">
              <h2 className="font-display text-display-s font-semibold text-ink">
                The bench is empty
              </h2>
              <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-2">
                Nothing in the lab is live yet. These are the utilities on the
                list, described as plans because that is what they are — not
                products with a fake “coming soon” button.
              </p>
              <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-2">
                If one of these would be useful to you, saying so is the fastest
                way to move it up the queue:{" "}
                <Link
                  href="/contact/"
                  className="underline decoration-line-2 underline-offset-2 hover:decoration-accent"
                >
                  get in touch
                </Link>{" "}
                or open a thread in{" "}
                <a
                  href={siteConfig.discussions}
                  target="_blank"
                  rel="noopener"
                  className="underline decoration-line-2 underline-offset-2 hover:decoration-accent"
                >
                  GitHub Discussions
                </a>
                .
              </p>
            </section>
          )}

          {planned.length > 0 ? (
            <section>
              <h2 className="font-display text-display-s font-semibold text-ink">
                On the list
              </h2>
              <ToolList tools={planned} className="mt-6" />
            </section>
          ) : null}
        </div>
      </Container>
    </>
  );
}

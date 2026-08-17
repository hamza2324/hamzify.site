import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { loadPageBody } from "@/lib/mdx";
import { createMetadata } from "@/lib/metadata";
import { POLICY_PAGES, type PolicySlug } from "@/lib/pages";
import { breadcrumbNode, webPageNode } from "@/lib/schema";
import { formatDateLong } from "@/lib/utils";

/**
 * Shared renderer for the policy pages, so all five share one layout, one
 * metadata shape and one structured-data graph. The route files are thin
 * wrappers that name a slug.
 */

export function policyMetadata(slug: PolicySlug): Metadata {
  const page = POLICY_PAGES[slug];
  return createMetadata({
    title: page.title,
    description: page.description,
    path: `/${slug}`,
  });
}

export async function PolicyPage({ slug }: { slug: PolicySlug }) {
  const page = POLICY_PAGES[slug];
  const Body = await loadPageBody(slug);

  const crumbs = [
    { name: "Home", path: "/" },
    { name: page.title, path: `/${slug}/` },
  ];

  return (
    <>
      <JsonLd
        nodes={[
          webPageNode({
            title: page.title,
            description: page.description,
            path: `/${slug}`,
          }),
          breadcrumbNode(crumbs),
        ]}
      />

      <PageHeader
        kicker={page.kicker}
        title={page.title}
        intro={page.intro}
        crumbs={crumbs}
        meta={
          <span>
            Last reviewed{" "}
            <time dateTime={page.lastReviewed}>
              {formatDateLong(page.lastReviewed)}
            </time>
          </span>
        }
      />

      <Container width="prose" className="py-10 sm:py-14">
        <div className="prose">
          <Body />
        </div>
      </Container>
    </>
  );
}

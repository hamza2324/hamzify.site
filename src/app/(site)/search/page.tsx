import type { Metadata } from "next";
import { Suspense } from "react";

import { PageHeader } from "@/components/layout/page-header";
import { SearchExperience } from "@/components/search/search-experience";
import { Container } from "@/components/ui/container";
import { createMetadata } from "@/lib/metadata";
import { buildSearchIndex } from "@/lib/search-index";
import { CATEGORY_LIST } from "@/lib/taxonomy";

/**
 * Search.
 *
 * `noindex, follow` because internal search result pages are the textbook case
 * for it: they are useful to readers and near-duplicate filler in an index. The
 * page is also left out of the sitemap for the same reason.
 */
export const metadata: Metadata = createMetadata({
  title: "Search",
  description:
    "Search the Hamzify archive by title, description, tag, category or format. Runs entirely in your browser.",
  path: "/search",
  noindex: true,
});

const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "Search", path: "/search/" },
];

export default function SearchPage() {
  const documents = buildSearchIndex();
  const categories = CATEGORY_LIST.map((category) => ({
    slug: category.slug,
    label: category.label,
  }));

  return (
    <>
      <PageHeader
        kicker="Search"
        title="Search the archive"
        intro="Every published Hamzify article is indexed at build time and searched in your browser. Nothing you type is sent to a server."
        crumbs={CRUMBS}
      />

      <Container className="py-10 sm:py-14">
        <Suspense
          fallback={
            <p className="text-[0.9375rem] text-ink-3">Loading search…</p>
          }
        >
          <SearchExperience documents={documents} categories={categories} />
        </Suspense>
      </Container>
    </>
  );
}

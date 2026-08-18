import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";

import { Callout } from "@/components/content/callout";
import { CodeBlock } from "@/components/content/code-block";
import { ContentBlock, SpecList, SpecRow } from "@/components/content/block";
import {
  AffiliateDisclosure,
  AffiliateLink,
} from "@/components/content/disclosures";
import {
  BuildTimeline,
  HowThisWasTested,
  BuildDetails,
  ExperimentSetup,
  FaqList,
  Finding,
  KeyTakeaways,
  ProjectStack,
  ProsCons,
  PullQuote,
  QuickAnswer,
  QuickVerdict,
  Sources,
  TestMethodology,
  ToolComparison,
  Verdict,
} from "@/components/content/editorial-blocks";
import { ImageWithCaption } from "@/components/content/image-with-caption";

/**
 * Global MDX component map.
 *
 * Two jobs:
 * 1. Style the HTML that markdown produces (headings get anchors, tables get a
 *    scroll container, code blocks get a copy button).
 * 2. Expose the editorial block components without imports, so writing an
 *    article stays close to writing markdown.
 */

/** Heading with a hover-revealed anchor. `id` comes from rehype-slug. */
function AnchoredHeading({
  as: Tag,
  id,
  children,
  ...rest
}: ComponentPropsWithoutRef<"h2"> & { as: "h2" | "h3" }) {
  return (
    <Tag id={id} className="group scroll-mt-28" {...rest}>
      {children}
      {id ? (
        <a
          href={`#${id}`}
          aria-label="Link to this section"
          className="no-prose-link ml-2 inline-block align-middle text-[0.7em] text-ink-3 opacity-0 no-underline transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
        >
          #
        </a>
      ) : null}
    </Tag>
  );
}

/** Internal links get client-side navigation; external links get safe rels. */
function SmartLink({ href = "", ...rest }: ComponentPropsWithoutRef<"a">) {
  const isInternal = href.startsWith("/") || href.startsWith("#");

  if (isInternal) {
    return <Link href={href} {...rest} />;
  }

  return <a href={href} target="_blank" rel="noopener" {...rest} />;
}

const components: MDXComponents = {
  h2: (props) => <AnchoredHeading as="h2" {...props} />,
  h3: (props) => <AnchoredHeading as="h3" {...props} />,
  a: SmartLink,
  pre: CodeBlock,
  table: (props) => (
    <div className="table-scroll">
      <table {...props} />
    </div>
  ),

  // Editorial blocks, available in every article without an import.
  AffiliateDisclosure,
  AffiliateLink,
  BuildDetails,
  BuildTimeline,
  Callout,
  ContentBlock,
  ExperimentSetup,
  FaqList,
  Figure: ImageWithCaption,
  Finding,
  HowThisWasTested,
  ImageWithCaption,
  KeyTakeaways,
  ProjectStack,
  ProsCons,
  PullQuote,
  QuickAnswer,
  QuickVerdict,
  SpecList,
  SpecRow,
  Sources,
  TestMethodology,
  ToolComparison,
  Verdict,
};

export function useMDXComponents(): MDXComponents {
  return components;
}

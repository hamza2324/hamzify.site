import { buildGraph, serializeJsonLd } from "@/lib/schema";

/**
 * Emits a single `@graph` JSON-LD block. One script per page keeps node
 * references (`@id`) resolvable and avoids duplicate entity definitions.
 */
export function JsonLd({ nodes }: { nodes: Array<Record<string, unknown>> }) {
  if (nodes.length === 0) return null;

  return (
    <script
      type="application/ld+json"
      // Serialised through `serializeJsonLd`, which escapes `<`.
      dangerouslySetInnerHTML={{
        __html: serializeJsonLd(buildGraph(nodes)),
      }}
    />
  );
}

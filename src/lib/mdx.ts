import type { MDXComponents } from "mdx/types";
import type { ComponentType } from "react";

/**
 * Loads a compiled article body.
 *
 * MDX is compiled by `@next/mdx` at build time, so this dynamic import resolves
 * to a normal React component with no runtime markdown parsing. Keeping the
 * import in one place means the article route never has to know where content
 * files live on disk.
 */
export async function loadArticleBody(
  slug: string,
): Promise<ComponentType<{ components?: MDXComponents }>> {
  const mod = await import(`@/content/articles/${slug}.mdx`);
  return mod.default as ComponentType<{ components?: MDXComponents }>;
}

/** Loads a standalone page body from `src/content/pages`. */
export async function loadPageBody(
  slug: string,
): Promise<ComponentType<{ components?: MDXComponents }>> {
  const mod = await import(`@/content/pages/${slug}.mdx`);
  return mod.default as ComponentType<{ components?: MDXComponents }>;
}

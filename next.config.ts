import createMDX from "@next/mdx";
import type { NextConfig } from "next";

/**
 * Hamzify ships as a fully static site (GitHub Pages friendly).
 *
 * `trailingSlash` is enabled because static hosts resolve `/about/` to
 * `/about/index.html` unambiguously. Canonical URLs in `src/lib/site-config.ts`
 * are generated with the same convention so there is exactly one URL per page.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  // Pin the workspace root: without this, Turbopack walks up looking for a
  // lockfile and can pick one outside the project.
  turbopack: { root: import.meta.dirname },
  reactStrictMode: true,
  poweredByHeader: false,
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  images: {
    // Required for `output: "export"`: there is no server to optimize images.
    unoptimized: true,
  },
  typedRoutes: false,
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    // Turbopack requires plugins to be referenced by name with serializable
    // options, so every plugin below is configured without callbacks.
    remarkPlugins: ["remark-frontmatter", "remark-gfm"],
    rehypePlugins: [
      "rehype-slug",
      [
        "rehype-pretty-code",
        {
          theme: { light: "min-light", dark: "vesper" },
          keepBackground: false,
          defaultLang: "text",
        },
      ],
    ],
  },
});

export default withMDX(nextConfig);

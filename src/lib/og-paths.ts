/**
 * Names and URLs for the generated images.
 *
 * Deliberately free of any Node import so metadata, schema and (if ever needed)
 * client code can reference an image URL without dragging the Satori renderer —
 * and `node:fs` — into their bundle.
 *
 * Social cards are served from `/og/*.png` rather than through Next's
 * `opengraph-image` file convention. That convention emits extensionless,
 * hash-named files which a static host serves as `application/octet-stream`, and
 * several social crawlers reject an image whose content type is not an image
 * type. A real `.png` path also lets each page supply its own `og:image:alt`,
 * which the convention cannot do per-slug.
 */

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";
export const APPLE_TOUCH_ICON_SIZE = { width: 180, height: 180 } as const;

export const ogNames = {
  site: "site",
  article: (slug: string) => `article-${slug}`,
  category: (slug: string) => `category-${slug}`,
  appleTouchIcon: "apple-touch-icon",
} as const;

export function ogImagePath(name: string): string {
  return `/og/${name}.png`;
}

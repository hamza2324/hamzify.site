import { ImageResponse } from "next/og";

import {
  getAllArticles,
  getArticleBySlug,
  getArticlesByCategory,
  requireAuthor,
} from "@/lib/content";
import { ogFonts } from "@/lib/og";
import {
  appleTouchIcon,
  articleCard,
  categoryCard,
  siteCard,
} from "@/lib/og-cards";
import { APPLE_TOUCH_ICON_SIZE, OG_SIZE, ogNames } from "@/lib/og-paths";
import { CATEGORY_SLUGS, isCategorySlug } from "@/lib/taxonomy";

/**
 * Every generated image on the site, served from one route as real `.png` files.
 *
 * Because the last path segment carries the extension, `next build` writes
 * `out/og/article-cursor-review.png` — a normal file that any static host serves
 * with `Content-Type: image/png`. See the note in `lib/og.tsx` for why the
 * `opengraph-image` file convention is not used.
 */

export const dynamic = "force-static";

type Params = { file: string };

export function generateStaticParams(): Params[] {
  return [
    { file: `${ogNames.site}.png` },
    { file: `${ogNames.appleTouchIcon}.png` },
    ...CATEGORY_SLUGS.map((slug) => ({
      file: `${ogNames.category(slug)}.png`,
    })),
    ...getAllArticles().map((article) => ({
      file: `${ogNames.article(article.slug)}.png`,
    })),
  ];
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<Params> },
) {
  const { file } = await params;
  const name = file.replace(/\.png$/, "");

  if (name === ogNames.appleTouchIcon) {
    return new ImageResponse(appleTouchIcon(), APPLE_TOUCH_ICON_SIZE);
  }

  if (name.startsWith("category-")) {
    const slug = name.slice("category-".length);
    if (isCategorySlug(slug)) {
      const articles = getArticlesByCategory(slug);
      const { element } = categoryCard(
        slug,
        articles.slice(0, 3),
        articles.length,
      );
      return new ImageResponse(element, { ...OG_SIZE, fonts: ogFonts() });
    }
  }

  if (name.startsWith("article-")) {
    const article = getArticleBySlug(name.slice("article-".length));
    if (article) {
      const { element } = articleCard(article, requireAuthor(article.author));
      return new ImageResponse(element, { ...OG_SIZE, fonts: ogFonts() });
    }
  }

  // Anything unrecognised falls back to the site card rather than 404ing, so a
  // stale shared URL still resolves to a valid brand image.
  return new ImageResponse(siteCard().element, {
    ...OG_SIZE,
    fonts: ogFonts(),
  });
}

import type { ReactElement } from "react";

import {
  OG,
  OG_ACCENT,
  OgBrand,
  OgChip,
  OgPattern,
  fitHeadline,
  headlineSize,
} from "@/lib/og";
import { siteConfig, siteHost } from "@/lib/site-config";
import {
  ARTICLE_TYPE_META,
  CATEGORIES,
  CATEGORY_LIST,
  type CategorySlug,
} from "@/lib/taxonomy";
import { formatDate } from "@/lib/utils";
import type { Article, Author } from "@/types/content";

/**
 * The three social card layouts.
 *
 * Each returns a Satori-compatible element tree plus the alt text that describes
 * it, so the route handler stays a thin dispatcher and the alt text can never
 * drift from what the image actually shows.
 *
 * Composition differs per card on purpose — a review, a comparison, a build log
 * and a category index are visually distinguishable in a timeline rather than one
 * template with the text swapped.
 */

export type OgCard = { element: ReactElement };

/**
 * Alt text builders.
 *
 * Separate from the renderers so `generateMetadata` can describe a card without
 * building its element tree, while both still derive from the same data.
 */
export function articleCardAlt(article: Article): string {
  return `${ARTICLE_TYPE_META[article.articleType].label} on Hamzify: ${article.title}`;
}

export function categoryCardAlt(slug: CategorySlug): string {
  return `${CATEGORIES[slug].label} on Hamzify — ${CATEGORIES[slug].headline}`;
}

export function siteCardAlt(): string {
  return `${siteConfig.name} — ${siteConfig.tagline}`;
}

/* -------------------------------------------------------------------------- */
/* Article                                                                    */
/* -------------------------------------------------------------------------- */

export function articleCard(article: Article, author: Author): OgCard {
  const category = CATEGORIES[article.category];
  const typeMeta = ARTICLE_TYPE_META[article.articleType];
  const accent = OG_ACCENT[typeMeta.accent];
  const headline = fitHeadline(article.title);
  const isComparison = article.articleType === "comparison";
  const project = article.project;

  const element = (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        background: OG.paper,
        padding: 60,
      }}
    >
      <OgPattern pattern={article.coverPattern} accent={accent} />

      {/* Accent rule down the left edge, keyed to the article format. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 10,
          background: accent,
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          position: "relative",
        }}
      >
        <OgChip accent={accent} filled>
          {typeMeta.label}
        </OgChip>
        <OgChip accent={accent}>{category.label}</OgChip>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          flex: 1,
          position: "relative",
          paddingTop: 24,
          paddingBottom: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Fraunces",
            fontSize: headlineSize(headline),
            lineHeight: 1.08,
            letterSpacing: -1.5,
            color: OG.ink,
            maxWidth: 980,
          }}
        >
          {headline}
        </div>

        {isComparison ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginTop: 28,
            }}
          >
            <div
              style={{ display: "flex", height: 2, width: 90, background: accent }}
            />
            <span
              style={{
                fontFamily: "JetBrains Mono",
                fontSize: 20,
                color: OG.ink2,
              }}
            >
              One recommendation per use case
            </span>
          </div>
        ) : project ? (
          <div
            style={{
              display: "flex",
              gap: 44,
              marginTop: 32,
              paddingTop: 24,
              borderTop: `1px solid ${OG.line}`,
            }}
          >
            {[
              { label: "Project", value: project.name },
              { label: "Stack", value: project.stack.slice(0, 3).join(" · ") },
              { label: "Status", value: project.status },
            ].map((fact) => (
              <div
                key={fact.label}
                style={{ display: "flex", flexDirection: "column", gap: 6 }}
              >
                <span
                  style={{
                    fontFamily: "JetBrains Mono",
                    fontSize: 15,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: OG.ink3,
                  }}
                >
                  {fact.label}
                </span>
                <span
                  style={{
                    fontFamily: "JetBrains Mono",
                    fontSize: 19,
                    color: OG.ink2,
                  }}
                >
                  {fact.value}
                </span>
              </div>
            ))}
          </div>
        ) : article.dek ? (
          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontFamily: "JetBrains Mono",
              fontSize: 21,
              lineHeight: 1.45,
              color: OG.ink2,
              maxWidth: 900,
            }}
          >
            {fitHeadline(article.dek, 120)}
          </div>
        ) : null}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          position: "relative",
          paddingTop: 24,
          borderTop: `1px solid ${OG.line}`,
        }}
      >
        <OgBrand accent={accent} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 6,
            fontFamily: "JetBrains Mono",
            fontSize: 17,
            color: OG.ink3,
          }}
        >
          <span style={{ color: OG.ink2 }}>{author.name}</span>
          <span>
            {formatDate(article.updatedAt ?? article.publishedAt)} ·{" "}
            {article.readingTime.text}
          </span>
        </div>
      </div>
    </div>
  );

  return { element };
}

/* -------------------------------------------------------------------------- */
/* Category                                                                   */
/* -------------------------------------------------------------------------- */

export function categoryCard(
  slug: CategorySlug,
  recent: Article[],
  total: number,
): OgCard {
  const definition = CATEGORIES[slug];
  const accent = OG_ACCENT[definition.accent];

  const element = (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        background: OG.paper,
        padding: 60,
      }}
    >
      <OgPattern pattern="grid" accent={accent} />

      {/* Top rule instead of a side rule, so a section card reads differently. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 10,
          background: accent,
        }}
      />

      <div style={{ display: "flex", position: "relative" }}>
        <OgChip accent={accent} filled>
          {definition.label}
        </OgChip>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Fraunces",
            fontSize: 68,
            lineHeight: 1.06,
            letterSpacing: -1.6,
            color: OG.ink,
            maxWidth: 900,
          }}
        >
          {definition.headline}
        </div>

        {recent.length > 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              marginTop: 34,
            }}
          >
            {recent.map((article) => (
              <div
                key={article.slug}
                style={{ display: "flex", alignItems: "center", gap: 14 }}
              >
                <div
                  style={{
                    display: "flex",
                    width: 20,
                    height: 1,
                    background: accent,
                  }}
                />
                <span
                  style={{
                    fontFamily: "JetBrains Mono",
                    fontSize: 19,
                    color: OG.ink2,
                  }}
                >
                  {fitHeadline(article.title, 68)}
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          position: "relative",
          paddingTop: 24,
          borderTop: `1px solid ${OG.line}`,
        }}
      >
        <OgBrand accent={accent} />
        <span
          style={{ fontFamily: "JetBrains Mono", fontSize: 17, color: OG.ink3 }}
        >
          {total > 0
            ? `${total} ${total === 1 ? "article" : "articles"}`
            : siteConfig.tagline}
        </span>
      </div>
    </div>
  );

  return { element };
}

/* -------------------------------------------------------------------------- */
/* Site default                                                               */
/* -------------------------------------------------------------------------- */

export function siteCard(): OgCard {
  const accent = OG_ACCENT.ember;

  const element = (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        background: OG.paper,
        padding: 64,
      }}
    >
      <OgPattern pattern="flow" accent={accent} />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          position: "relative",
        }}
      >
        <svg width="58" height="58" viewBox="0 0 32 32">
          <path d="M5 5.5h5v21H5zM10 13.5h7v5h-7z" fill={OG.ink} />
          <path
            d="M17 5.5 27.5 16 17 26.5V20l4.5-4-4.5-4z"
            fill={OG_ACCENT.indigo}
          />
          <circle cx="15.6" cy="16" r="2.4" fill={OG_ACCENT.teal} />
        </svg>
        <OgChip accent={accent}>{siteHost}</OgChip>
      </div>

      <div
        style={{ display: "flex", flexDirection: "column", position: "relative" }}
      >
        <span
          style={{
            fontFamily: "Fraunces",
            fontSize: 108,
            lineHeight: 1,
            letterSpacing: -3,
            color: OG.ink,
          }}
        >
          Hamzify
        </span>
        <span
          style={{
            fontFamily: "Fraunces",
            fontSize: 44,
            lineHeight: 1.15,
            letterSpacing: -1,
            color: accent,
            marginTop: 18,
          }}
        >
          {siteConfig.tagline}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          position: "relative",
          paddingTop: 26,
          borderTop: `1px solid ${OG.line}`,
          flexWrap: "wrap",
        }}
      >
        {CATEGORY_LIST.map((category) => (
          <div
            key={category.slug}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <div
              style={{
                display: "flex",
                width: 6,
                height: 6,
                borderRadius: 6,
                background: OG_ACCENT[category.accent],
              }}
            />
            <span
              style={{
                fontFamily: "JetBrains Mono",
                fontSize: 18,
                color: OG.ink2,
                letterSpacing: 1,
                marginRight: 18,
              }}
            >
              {category.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return { element };
}

/* -------------------------------------------------------------------------- */
/* Apple touch icon                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Generated rather than committed as a binary, so it tracks the brand colours.
 * iOS ignores SVG touch icons, which is why this one raster icon exists at all.
 */
export function appleTouchIcon(): ReactElement {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: OG.paper,
      }}
    >
      <svg width="180" height="180" viewBox="0 0 32 32">
        <path d="M5 5.5h5v21H5zM10 13.5h7v5h-7z" fill={OG.ink} />
        <path
          d="M17 5.5 27.5 16 17 26.5V20l4.5-4-4.5-4z"
          fill={OG_ACCENT.indigo}
        />
        <circle cx="15.6" cy="16" r="2.4" fill={OG_ACCENT.teal} />
      </svg>
    </div>
  );
}

import fs from "node:fs";
import path from "node:path";

import type { ReactElement } from "react";

import { MARK_CHEVRON, MARK_H, MARK_NODE } from "@/lib/brand-mark";
import { OG_SIZE } from "@/lib/og-paths";
import { siteHost } from "@/lib/site-config";
import type { AccentKey } from "@/lib/taxonomy";

/**
 * Shared building blocks for the Open Graph image system.
 *
 * Two decisions worth explaining:
 *
 * 1. Fonts are vendored as `.woff` under `src/assets/fonts` and read from disk at
 *    build time. Satori (which powers `ImageResponse`) cannot read `.woff2` and
 *    cannot resolve `next/font`, so the social cards would otherwise fall back to
 *    a generic sans and stop looking like the site.
 * 2. Every card uses the dark palette regardless of the reader's theme, because a
 *    social card has no theme context and the dark treatment reads better against
 *    both light and dark timelines.
 */

/** Dark-palette literals, matched to the dark half of `globals.css`. */
export const OG = {
  paper: "#121110",
  surface: "#1a1817",
  line: "#2e2a27",
  ink: "#f4f1eb",
  ink2: "#b9b3a8",
  ink3: "#8b8579",
} as const;

export const OG_ACCENT: Record<AccentKey, string> = {
  ember: "#ff8c55",
  teal: "#45cfc0",
  amber: "#e3b25c",
  indigo: "#a2abf5",
  olive: "#a8c95f",
};

const FONT_DIR = path.join(process.cwd(), "src", "assets", "fonts");

function readFont(fileName: string): ArrayBuffer {
  const buffer = fs.readFileSync(path.join(FONT_DIR, fileName));
  return Uint8Array.from(buffer).buffer;
}

/** Loaded once per build. `ImageResponse` needs the raw font bytes. */
export function ogFonts() {
  return [
    {
      name: "Fraunces",
      data: readFont("fraunces-600.woff"),
      weight: 600 as const,
      style: "normal" as const,
    },
    {
      name: "JetBrains Mono",
      data: readFont("jetbrains-mono-500.woff"),
      weight: 500 as const,
      style: "normal" as const,
    },
  ];
}

/**
 * Background texture, keyed to the article's cover pattern so a card echoes the
 * article page rather than repeating one house layout.
 *
 * Built from absolutely positioned elements instead of `repeating-linear-gradient`,
 * which Satori does not support.
 */
export function OgPattern({
  pattern,
  accent,
}: {
  pattern: string;
  accent: string;
}) {
  const lines: ReactElement[] = [];

  if (pattern === "grid") {
    for (let i = 1; i * 88 < OG_SIZE.width; i += 1) {
      lines.push(
        <div
          key={`v${i}`}
          style={{
            position: "absolute",
            top: 0,
            left: i * 88,
            width: 1,
            height: OG_SIZE.height,
            background: accent,
            opacity: 0.11,
          }}
        />,
      );
    }
    for (let i = 1; i * 88 < OG_SIZE.height; i += 1) {
      lines.push(
        <div
          key={`h${i}`}
          style={{
            position: "absolute",
            left: 0,
            top: i * 88,
            width: OG_SIZE.width,
            height: 1,
            background: accent,
            opacity: 0.09,
          }}
        />,
      );
    }
  } else if (pattern === "terminal" || pattern === "stack") {
    const gap = pattern === "terminal" ? 22 : 40;
    for (let i = 1; i * gap < OG_SIZE.height; i += 1) {
      lines.push(
        <div
          key={`t${i}`}
          style={{
            position: "absolute",
            left: 0,
            top: i * gap,
            width: OG_SIZE.width,
            height: pattern === "terminal" ? 1 : 12,
            background: accent,
            opacity: pattern === "terminal" ? 0.08 : 0.05,
          }}
        />,
      );
    }
  } else if (pattern === "diff") {
    for (let i = 0; i < 34; i += 1) {
      lines.push(
        <div
          key={`d${i}`}
          style={{
            position: "absolute",
            top: -200,
            left: i * 56 - 200,
            width: 3,
            height: 1100,
            background: accent,
            opacity: 0.09,
            transform: "rotate(24deg)",
          }}
        />,
      );
    }
  } else if (pattern === "timeline") {
    // A spine with nodes on it, kept inside the left gutter. Nodes without a
    // spine read as stray dots, and ticks that reach into the text column read
    // as accidental underlines.
    lines.push(
      <div
        key="spine"
        style={{
          position: "absolute",
          top: 0,
          left: 34,
          width: 1,
          height: OG_SIZE.height,
          background: accent,
          opacity: 0.3,
        }}
      />,
    );
    for (let i = 1; i < 8; i += 1) {
      lines.push(
        <div
          key={`l${i}`}
          style={{
            position: "absolute",
            left: 34,
            width: 14,
            top: i * 82,
            height: 1,
            background: accent,
            opacity: 0.25,
          }}
        />,
      );
      lines.push(
        <div
          key={`n${i}`}
          style={{
            position: "absolute",
            left: 31,
            top: i * 82 - 3,
            width: 7,
            height: 7,
            borderRadius: 7,
            background: accent,
            opacity: 0.32,
          }}
        />,
      );
    }
  } else {
    // `flow`: a sparse dot field with vertical column rules.
    for (let column = 0; column < 9; column += 1) {
      lines.push(
        <div
          key={`c${column}`}
          style={{
            position: "absolute",
            top: 0,
            left: 60 + column * 132,
            width: 1,
            height: OG_SIZE.height,
            background: accent,
            opacity: 0.08,
          }}
        />,
      );
      for (let row = 0; row < 7; row += 1) {
        lines.push(
          <div
            key={`p${column}-${row}`}
            style={{
              position: "absolute",
              left: 57 + column * 132,
              top: 50 + row * 90,
              width: 7,
              height: 7,
              borderRadius: 7,
              background: accent,
              opacity: 0.22,
            }}
          />,
        );
      }
    }
  }

  // Satori does not resolve the `inset` shorthand, and it needs an explicit size
  // rather than opposing offsets, so the frame is given both dimensions.
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        display: "flex",
        width: OG_SIZE.width,
        height: OG_SIZE.height,
      }}
    >
      {lines}
    </div>
  );
}

/** Wordmark plus domain, bottom-left on every card. */
export function OgBrand({ accent }: { accent: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {/* The chevron takes the card's accent so the mark is keyed to the format,
          the way the rule down the edge of the card is. */}
      <svg width="34" height="34" viewBox="0 0 32 32">
        <path d={MARK_H} fill={OG.ink} />
        <path d={MARK_CHEVRON} fill={accent} />
        <circle {...MARK_NODE} fill={OG.ink2} />
      </svg>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span
          style={{
            fontFamily: "Fraunces",
            fontSize: 26,
            color: OG.ink,
            lineHeight: 1,
          }}
        >
          Hamzify
        </span>
        <span
          style={{
            fontFamily: "JetBrains Mono",
            fontSize: 14,
            color: OG.ink3,
            letterSpacing: 1,
            marginTop: 4,
          }}
        >
          {siteHost}
        </span>
      </div>
    </div>
  );
}

/** Uppercase monospace chip used for the format and category labels. */
export function OgChip({
  children,
  accent,
  filled = false,
}: {
  children: string;
  accent: string;
  filled?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "7px 14px",
        borderRadius: 4,
        border: `1px solid ${filled ? accent : OG.line}`,
        background: filled ? accent : "transparent",
        color: filled ? OG.paper : OG.ink2,
        fontFamily: "JetBrains Mono",
        fontSize: 18,
        letterSpacing: 2,
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
}

/**
 * Trims a headline to something that will not overflow the card.
 *
 * Satori has no text overflow handling, so a long title has to be shortened
 * before layout rather than clipped after it.
 */
export function fitHeadline(title: string, max = 84): string {
  if (title.length <= max) return title;
  const cut = title.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 40 ? lastSpace : max).trimEnd()}…`;
}

/** Font size that keeps the headline inside the card at three sizes of title. */
export function headlineSize(title: string): number {
  if (title.length <= 34) return 76;
  if (title.length <= 54) return 64;
  if (title.length <= 74) return 54;
  return 46;
}

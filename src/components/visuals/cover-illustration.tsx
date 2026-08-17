import { comparisonSides } from "@/lib/records";
import { hashString } from "@/lib/utils";
import type { Article } from "@/types/content";

/**
 * Editorial illustration drawn on top of the CSS cover pattern.
 *
 * One visual family, six compositions keyed to `articleType` (and the
 * `coverPattern` when the type is generic). Labels come from the article's
 * own frontmatter — stack, tools, compared sides — so the picture is about
 * this piece of work, not a generic "AI" motif.
 *
 * SVG, no bitmap, no network. Safe to render on every card.
 */

type CoverSize = "hero" | "feature" | "band" | "card" | "thumb";

const TERMINAL_LINES = [
  "$ brief the agent",
  "→ context loaded",
  "$ generate",
  "→ 14 files touched",
  "$ review",
  "× unstated assumption",
];

export function CoverIllustration({
  article,
  size,
}: {
  article: Article;
  size: CoverSize;
}) {
  const compact = size === "thumb" || size === "card";
  const seed = hashString(article.slug);
  const kind = illustrationKind(article);

  return (
    <svg
      viewBox="0 0 640 360"
      className="cover-media pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
      focusable="false"
    >
      <BrandNodes seed={seed} />
      {kind === "architecture" ? (
        <Architecture article={article} compact={compact} />
      ) : null}
      {kind === "terminal" ? (
        <Terminal article={article} compact={compact} />
      ) : null}
      {kind === "flow" ? <Flow article={article} compact={compact} /> : null}
      {kind === "diff" ? <Diff article={article} compact={compact} /> : null}
      {kind === "window" ? (
        <ProductWindow article={article} compact={compact} />
      ) : null}
      {kind === "checklist" ? <Checklist article={article} compact={compact} /> : null}
    </svg>
  );
}

function illustrationKind(
  article: Article,
): "architecture" | "terminal" | "flow" | "diff" | "window" | "checklist" {
  switch (article.articleType) {
    case "build-log":
      return "architecture";
    case "experiment":
      return article.coverPattern === "terminal" ? "terminal" : "flow";
    case "workflow":
      return "flow";
    case "comparison":
      return "diff";
    case "review":
      return "window";
    case "guide":
    case "resource":
      return "checklist";
    default:
      return article.coverPattern === "diff" ? "diff" : "terminal";
  }
}

function BrandNodes({ seed }: { seed: number }) {
  const x = 520 + (seed % 40);
  const y = 48 + ((seed >> 5) % 30);
  return (
    <g>
      <circle cx={x} cy={y} r="5" fill="var(--cyan)" />
      <circle
        cx={x + 22}
        cy={y + 18}
        r="3.5"
        fill="var(--violet)"
      />
      <line
        x1={x + 5}
        y1={y + 3}
        x2={x + 20}
        y2={y + 16}
        stroke="var(--cyan)"
        strokeOpacity="0.85"
        strokeWidth="1.5"
      />
    </g>
  );
}

function Architecture({
  article,
  compact,
}: {
  article: Article;
  compact: boolean;
}) {
  const layers = (
    article.project?.stack.slice(0, 4) ??
    article.tags.slice(0, 4)
  ).map((label, i) => ({
    label,
    y: 70 + i * 52,
    width: 280 - i * 18,
  }));

  return (
    <g>
      {layers.map((layer, i) => (
        <g key={layer.label}>
          <rect
            x={(640 - layer.width) / 2}
            y={layer.y}
            width={layer.width}
            height="40"
            rx="4"
            fill={i === 0 ? "var(--violet-soft)" : "var(--paper)"}
            fillOpacity="0.92"
            stroke={i === 0 ? "var(--violet)" : "var(--cyan)"}
            strokeWidth={i === 0 ? "1.5" : "1"}
          />
          <rect
            x={(640 - layer.width) / 2}
            y={layer.y}
            width="3"
            height="40"
            rx="1"
            fill="var(--local-accent)"
          />
          {compact ? null : (
            <text
              x="320"
              y={layer.y + 26}
              textAnchor="middle"
              fill="var(--ink)"
              fontSize="13"
              fontFamily="var(--font-mono)"
              letterSpacing="0.06em"
            >
              {layer.label}
            </text>
          )}
          {i < layers.length - 1 ? (
            <line
              x1="320"
              y1={layer.y + 40}
              x2="320"
              y2={layer.y + 52}
              stroke="var(--cyan)"
              strokeWidth="1.75"
            />
          ) : null}
        </g>
      ))}
    </g>
  );
}

function Terminal({
  article,
  compact,
}: {
  article: Article;
  compact: boolean;
}) {
  const tools = article.project?.aiTools ?? article.tags;
  const lines = [
    `$ ${tools[0] ? tools[0].toLowerCase().replace(/\s+/g, "-") : "agent"}`,
    ...TERMINAL_LINES.slice(0, compact ? 3 : 6),
  ];

  return (
    <g>
      <rect
        x="72"
        y="54"
        width="496"
        height={compact ? 220 : 252}
        rx="6"
        fill="var(--paper)"
        fillOpacity="0.78"
        stroke="var(--line)"
      />
      <circle cx="96" cy="76" r="4" fill="var(--ember)" fillOpacity="0.7" />
      <circle cx="112" cy="76" r="4" fill="var(--amber)" fillOpacity="0.7" />
      <circle cx="128" cy="76" r="4" fill="var(--accent)" fillOpacity="0.8" />
      {compact
        ? null
        : lines.map((line, i) => (
            <text
              key={line + i}
              x="96"
              y={112 + i * 28}
              fill={line.startsWith("×") ? "var(--ember)" : "var(--ink-2)"}
              fontSize="13"
              fontFamily="var(--font-mono)"
            >
              {line}
            </text>
          ))}
    </g>
  );
}

function Flow({
  article,
  compact,
}: {
  article: Article;
  compact: boolean;
}) {
  const labels =
    article.articleType === "experiment"
      ? ["Question", "Setup", "Run", "Result"]
      : ["Brief", "Constrain", "Generate", "Verify"];
  const gap = 140;
  const start = 80;

  return (
    <g>
      {labels.map((label, i) => {
        const x = start + i * gap;
        return (
          <g key={label}>
            <circle
              cx={x}
              cy="168"
              r={compact ? 18 : 22}
              fill="var(--paper)"
              stroke="var(--local-accent)"
              strokeWidth="1.5"
            />
            <text
              x={x}
              y="173"
              textAnchor="middle"
              fill="var(--local-accent)"
              fontSize="11"
              fontFamily="var(--font-mono)"
            >
              {String(i + 1).padStart(2, "0")}
            </text>
            {compact ? null : (
              <text
                x={x}
                y="214"
                textAnchor="middle"
                fill="var(--ink-2)"
                fontSize="12"
                fontFamily="var(--font-mono)"
                letterSpacing="0.08em"
              >
                {label.toUpperCase()}
              </text>
            )}
            {i < labels.length - 1 ? (
              <line
                x1={x + 24}
                y1="168"
                x2={x + gap - 24}
                y2="168"
                stroke="var(--cyan)"
                strokeWidth="1.75"
                strokeDasharray="3 4"
              />
            ) : null}
          </g>
        );
      })}
    </g>
  );
}

function Diff({
  article,
  compact,
}: {
  article: Article;
  compact: boolean;
}) {
  const sides = comparisonSides(article) ?? ["Tool A", "Tool B"];

  return (
    <g>
      {[0, 1].map((i) => (
        <g key={sides[i]}>
          <rect
            x={i === 0 ? 70 : 340}
            y="70"
            width="230"
            height="220"
            rx="6"
            fill="var(--paper)"
            fillOpacity="0.8"
            stroke="var(--line)"
          />
          <rect
            x={i === 0 ? 70 : 340}
            y="70"
            width="230"
            height="6"
            rx="3"
            fill={i === 0 ? "var(--local-accent)" : "var(--violet)"}
          />
          {compact ? null : (
            <text
              x={i === 0 ? 185 : 455}
              y="180"
              textAnchor="middle"
              fill="var(--ink)"
              fontSize="16"
              fontFamily="var(--font-display)"
            >
              {sides[i]}
            </text>
          )}
        </g>
      ))}
      <text
        x="320"
        y="188"
        textAnchor="middle"
        fill="var(--ink-3)"
        fontSize="11"
        fontFamily="var(--font-mono)"
        letterSpacing="0.16em"
      >
        VS
      </text>
    </g>
  );
}

function ProductWindow({
  article,
  compact,
}: {
  article: Article;
  compact: boolean;
}) {
  const name = article.subcategory ?? article.tags[0] ?? "Tool";

  return (
    <g>
      <rect
        x="90"
        y="48"
        width="460"
        height="264"
        rx="8"
        fill="var(--paper)"
        fillOpacity="0.8"
        stroke="var(--line)"
      />
      <rect x="90" y="48" width="460" height="36" rx="8" fill="var(--surface-2)" />
      <circle cx="114" cy="66" r="4" fill="var(--line-2)" />
      <circle cx="130" cy="66" r="4" fill="var(--line-2)" />
      <circle cx="146" cy="66" r="4" fill="var(--accent)" />
      <rect
        x="118"
        y="112"
        width="180"
        height="12"
        rx="2"
        fill="var(--local-accent)"
        fillOpacity="0.35"
      />
      <rect
        x="118"
        y="138"
        width="260"
        height="8"
        rx="2"
        fill="var(--line-2)"
        fillOpacity="0.55"
      />
      <rect
        x="118"
        y="158"
        width="220"
        height="8"
        rx="2"
        fill="var(--line-2)"
        fillOpacity="0.4"
      />
      <rect
        x="400"
        y="112"
        width="118"
        height="148"
        rx="4"
        fill="var(--violet-soft)"
        stroke="var(--violet-line)"
      />
      {compact ? null : (
        <text
          x="320"
          y="292"
          textAnchor="middle"
          fill="var(--ink-2)"
          fontSize="13"
          fontFamily="var(--font-mono)"
          letterSpacing="0.08em"
        >
          {name}
        </text>
      )}
    </g>
  );
}

function Checklist({
  article,
  compact,
}: {
  article: Article;
  compact: boolean;
}) {
  const items = article.tags.slice(0, 4);
  const rows = items.length ? items : ["Context", "Constraints", "Verify", "Ship"];

  return (
    <g>
      <rect
        x="110"
        y="56"
        width="420"
        height="248"
        rx="6"
        fill="var(--paper)"
        fillOpacity="0.8"
        stroke="var(--line)"
      />
      {rows.map((item, i) => (
        <g key={item}>
          <rect
            x="138"
            y={88 + i * 48}
            width="16"
            height="16"
            rx="3"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.5"
          />
          {i < 2 ? (
            <path
              d={`M141 ${96 + i * 48} l4 4 l8 -8`}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.5"
            />
          ) : null}
          {compact ? null : (
            <text
              x="168"
              y={101 + i * 48}
              fill="var(--ink)"
              fontSize="14"
              fontFamily="var(--font-sans)"
            >
              {item}
            </text>
          )}
        </g>
      ))}
    </g>
  );
}

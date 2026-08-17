/** Small, dependency-free helpers shared across the app. */

/** Joins class names, dropping falsy values. */
export function cn(
  ...values: Array<string | false | null | undefined>
): string {
  return values.filter(Boolean).join(" ");
}

const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

const DATE_FORMAT_LONG = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

/** `2026-03-04` -> `Mar 4, 2026`. */
export function formatDate(value: string): string {
  return DATE_FORMAT.format(new Date(value));
}

/** `2026-03-04` -> `March 4, 2026`. */
export function formatDateLong(value: string): string {
  return DATE_FORMAT_LONG.format(new Date(value));
}

/** Machine-readable date for `<time datetime>` and structured data. */
export function toIsoDate(value: string): string {
  return new Date(value).toISOString();
}

/** Deterministic 32-bit hash — used to vary generated covers per slug. */
export function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
export function byNewest<T extends { publishedAt: string }>(a: T, b: T) {
  return Date.parse(b.publishedAt) - Date.parse(a.publishedAt);
}

/** Stable, URL-safe slug. Mirrors the ids that `rehype-slug` generates. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}

/** Trims to a word boundary without cutting mid-word. */
export function truncate(value: string, max: number): string {
  if (value.length <= max) return value;
  const cut = value.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : max).trimEnd()}…`;
}

/** `["a","b","c"]` -> `"a, b and c"`. */
export function listToSentence(values: string[]): string {
  if (values.length === 0) return "";
  if (values.length === 1) return values[0];
  return `${values.slice(0, -1).join(", ")} and ${values.at(-1)}`;
}

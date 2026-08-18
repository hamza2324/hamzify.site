/**
 * Canonical names for tools Hamzify actually covers.
 *
 * This is an editorial registry, not a directory. A slug here does not create
 * a page. A tool hub is generated only when `lib/coverage.ts` finds enough
 * published articles that mention the tool.
 *
 * In prose, natural variations are fine. In metadata, `tools`, `compared` and
 * `project.aiTools`, prefer the `name` field below.
 */

export type ToolEntity = {
  slug: string;
  name: string;
  aliases: string[];
  /** Short, cautious description. No unverified claims. */
  summary: string;
  usefulFor?: string;
  officialUrl?: string;
};

export const TOOL_ENTITIES: ToolEntity[] = [
  {
    slug: "cursor",
    name: "Cursor",
    aliases: ["cursor ai", "cursor editor"],
    summary:
      "An AI-native code editor Hamzify has written about as a daily driver on existing codebases and as the editor used in several build logs. The pages below are coverage of that work, not a product brochure.",
    usefulFor:
      "Developers who already live in an editor and will supervise multi-file agent edits rather than treat them as finished work.",
    officialUrl: "https://cursor.com",
  },
  {
    slug: "claude-code",
    name: "Claude Code",
    aliases: ["claude", "claude code cli", "anthropic claude code"],
    summary:
      "A terminal coding agent. Hamzify coverage is about how it behaves on unfamiliar code and in project work, including the supervision it still needed.",
    usefulFor:
      "People comfortable working from a terminal who will still review diffs before they land.",
    officialUrl: "https://docs.anthropic.com/en/docs/claude-code",
  },
  {
    slug: "github-copilot",
    name: "GitHub Copilot",
    aliases: ["copilot", "github copilot"],
    summary:
      "GitHub's in-editor assistant. Hamzify has compared it with Cursor on the same tasks rather than reviewing it in isolation.",
    usefulFor:
      "Developers who want inline completions and chat inside a familiar editor, especially when budget and simplicity matter more than agent-style refactors.",
    officialUrl: "https://github.com/features/copilot",
  },
];

const ALIAS_INDEX = new Map<string, ToolEntity>();

for (const entity of TOOL_ENTITIES) {
  ALIAS_INDEX.set(normalizeEntityKey(entity.slug), entity);
  ALIAS_INDEX.set(normalizeEntityKey(entity.name), entity);
  for (const alias of entity.aliases) {
    ALIAS_INDEX.set(normalizeEntityKey(alias), entity);
  }
}

export function normalizeEntityKey(value: string): string {
  return value.trim().toLowerCase().replace(/[\s/_-]+/g, " ");
}

export function resolveToolEntity(value: string): ToolEntity | undefined {
  const exact = ALIAS_INDEX.get(normalizeEntityKey(value));
  if (exact) return exact;

  const key = normalizeEntityKey(value);
  for (const entity of TOOL_ENTITIES) {
    if (key.includes(normalizeEntityKey(entity.name))) return entity;
    if (entity.aliases.some((alias) => key.includes(normalizeEntityKey(alias)))) {
      return entity;
    }
  }
  return undefined;
}

export function canonicalToolName(value: string): string {
  return resolveToolEntity(value)?.name ?? value.trim();
}

export function getToolEntity(slug: string): ToolEntity | undefined {
  return TOOL_ENTITIES.find((entity) => entity.slug === slug);
}

export const TOOL_HUB_PREFIX = "/ai-coding-tools";

export function toolHubPath(slug: string): string {
  return `${TOOL_HUB_PREFIX}/${slug}/`;
}

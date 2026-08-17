/**
 * Search and generative-engine targeting for Hamzify.
 *
 * Used in metadata, JSON-LD and the llms.txt / sitemap writers. Keep this list
 * specific to what the site actually covers — AI coding tools, agents, vibe
 * coding, build logs and workflows — rather than a dump of every AI buzzword.
 */

export const SITE_KEYWORDS = [
  "AI coding tools",
  "AI coding assistants",
  "AI-assisted software development",
  "Cursor review",
  "GitHub Copilot",
  "Claude Code",
  "vibe coding",
  "AI agents",
  "AI pair programming",
  "build logs",
  "AI development workflows",
  "context engineering",
] as const;

export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "vibe-coding": [
    "vibe coding",
    "AI-assisted building",
    "prompt to product",
    "AI coding experiments",
  ],
  "build-logs": [
    "AI build log",
    "building with AI agents",
    "AI SaaS build",
    "coding agent project",
  ],
  workflows: [
    "AI pair programming workflow",
    "AI coding workflow",
    "reviewing AI generated code",
    "briefing coding agents",
  ],
  reviews: [
    "AI coding tool review",
    "Cursor review",
    "Claude Code review",
    "AI editor review",
  ],
  compare: [
    "Cursor vs GitHub Copilot",
    "AI coding tool comparison",
    "best AI coding assistant",
    "Copilot alternative",
  ],
  resources: [
    "AI coding tools guide",
    "context engineering checklist",
    "AI development resources",
    "coding agent briefing",
  ],
  latest: [
    "AI coding articles",
    "latest AI development writing",
    "AI coding experiments",
  ],
  "ai-coding-tools": [
    "AI coding tools",
    "AI coding assistants",
    "Cursor",
    "GitHub Copilot",
    "Claude Code",
  ],
  tools: ["AI developer tools", "coding agent utilities", "AI workflow tools"],
  about: ["Hamzify", "AI coding publication", "AI-assisted software development"],
  contact: ["contact Hamzify", "AI coding questions"],
};

export function keywordsFor(
  ...groups: Array<string | readonly string[] | undefined>
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];

  for (const group of groups) {
    const values =
      typeof group === "string" ? CATEGORY_KEYWORDS[group] : group;
    if (!values) continue;
    for (const value of values) {
      const key = value.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(value);
    }
  }

  return out;
}

# Naming: tools and topics

Use these display names in titles, H1s, metadata `tools` fields, and hub pages.
In body copy, natural language is fine: "the editor", "Copilot", "the agent".

Do not mechanically repeat the exact-match phrase.

## AI coding tools

| Prefer | Also acceptable in prose | Avoid in metadata |
| --- | --- | --- |
| Cursor | Cursor's agent mode, the editor | CURSOR, Cursor AI IDE as a stuffed title |
| Claude Code | the terminal agent, Anthropic's CLI agent | ClaudeAI, claude-code as visible text |
| GitHub Copilot | Copilot | Github copilot, CoPilot |

Add a row here when Hamzify starts covering a new tool. Then add the same
entity to `src/lib/entities.ts` so hubs and related reading can resolve aliases.

## Formats

| Prefer | Notes |
| --- | --- |
| Review | One tool, tested |
| Comparison | Same tasks, more than one tool |
| Build log | A project record |
| Experiment | A question with a setup |
| Workflow | A repeatable loop |
| Guide / resource | Updated in place |

## Dates

- `publishedAt`: when it first went live
- `updatedAt`: only after a material revision
- `lastReviewedAt`: optional check against the current product, even if the
  wording did not change
- Never auto-advance these dates

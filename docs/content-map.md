# Hamzify content map

Editorial planning only. This file exists so two articles do not accidentally
answer the same question. It is not a keyword-density sheet.

One article, one primary purpose. Supporting topics are allowed. Duplicate
search intent is not.

Status values: `published` `draft` `planned`.

Update this table when you add or retire a piece. The live sitemap still comes
from published MDX files, not from this document.

## Published

| Title | Slug | Primary topic | Intent | Audience | Cluster | Related | Status | Published | Last reviewed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Cursor Review: Two Weeks Inside a Real Codebase | cursor-review | Cursor review | commercial | Developers choosing an AI editor | cursor | cursor-vs-github-copilot, reviewing-ai-generated-code | published (sample) | 2026-08-04 | 2026-08-12 |
| Claude Code Review: A Terminal Agent on Unfamiliar Code | claude-code-review | Claude Code review | commercial | Developers considering a CLI agent | claude-code | cursor-review, cursor-vs-github-copilot | published (sample) | 2026-08-14 | |
| Cursor vs GitHub Copilot | cursor-vs-github-copilot | Cursor vs Copilot | comparison | Developers picking an assistant | cursor | cursor-review, ai-coding-toolbox | published (sample) | 2026-07-28 | |
| I Gave AI Agents a Real SaaS Build | building-a-saas-with-ai-agents | Agentic SaaS build | informational | Developers shipping with agents | cursor | reviewing-ai-generated-code, cursor-review | published (sample) | 2026-08-11 | 2026-08-14 |
| Rebuilding My Portfolio With AI | building-a-portfolio-with-ai | Portfolio build log | informational | Solo developers | cursor | prompt-to-product-in-one-evening | published (sample) | 2026-07-17 | |
| The AI Pair Programming Loop I Actually Use | ai-pair-programming-workflow | AI pair programming | tutorial | Daily AI-assisted coding | workflows | reviewing-ai-generated-code, context-engineering-checklist | published (sample) | 2026-08-07 | 2026-08-14 |
| How to Review AI-Generated Code | reviewing-ai-generated-code | AI code review | problem-solving | Anyone merging model output | workflows | ai-pair-programming-workflow | published (sample) | 2026-07-31 | |
| A Context Checklist for Briefing Coding Agents | context-engineering-checklist | Context briefing | tutorial | People briefing agents | resources | ai-pair-programming-workflow | published (sample) | 2026-08-01 | 2026-08-15 |
| The AI Coding Toolbox | ai-coding-toolbox | AI tool categories | informational | People mapping the landscape | resources | cursor-vs-github-copilot | published (sample) | 2026-07-24 | 2026-08-16 |
| Prompt to Deployed Product in One Evening | prompt-to-product-in-one-evening | Ship in one evening | informational | Experimenters | vibe-coding | can-ai-build-a-chrome-extension | published (sample) | 2026-07-14 | |
| Can an AI Agent Build a Chrome Extension From One Prompt? | can-ai-build-a-chrome-extension | Single-prompt extension | informational | Experimenters | vibe-coding | prompt-to-product-in-one-evening | published (sample) | 2026-07-21 | |

## Planned (do not write until the unique value is clear)

Leave rows blank until there is a real test, build, or method to add.

| Title | Slug | Primary topic | Intent | Cluster | Notes |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

## Clusters

- `cursor`: review, comparison, builds that used Cursor
- `claude-code`: Claude Code review and mentions in builds/resources
- `github-copilot`: currently reached through the Cursor comparison
- `workflows`: pair programming and review loops
- `resources`: checklists and landscape guides
- `vibe-coding`: time-boxed experiments

Tool hubs at `/ai-coding-tools/<tool>/` are generated only when two or more
published articles mention that tool. Do not add a hub by hand.

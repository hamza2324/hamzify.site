# Hamzify brand guide

Use this file for future pages and articles. Visual tokens live in
`src/app/globals.css`. Identity strings live in `src/lib/site-config.ts`.
Voice rules also live in [`EDITORIAL.md`](./EDITORIAL.md).

## Brand name

Hamzify

In the header, footer and prose: `Hamzify`. All-caps `HAMZIFY` is for internal
docs and occasional masthead emphasis, not for every heading.

## Primary positioning

The Practical AI Coding Publication

This is the one line to use when identity is needed: homepage, About, Open
Graph default card, RSS channel, footer, JSON-LD slogan.

## Supporting messages (contextual only)

Do not display all of these on one page.

| Where | Line |
| --- | --- |
| Homepage hero | Real tools. Real projects. Real results. |
| Article footer | More practical AI coding experiments from Hamzify. |
| Newsletter | One useful AI development workflow at a time. |

Other usable lines, still contextual:

- Real AI coding tools. Real builds. Real experiments. Practical developer workflows.
- Testing AI tools on real development work.

## Personality

Direct, technical, curious, honest, independent, experiment-driven, calm,
modern, intelligent, slightly experimental.

Tone:

- We tested this.
- We built this.
- Here is what happened.
- Here is where it worked.
- Here is where it failed.

## What Hamzify is not

Not a generic AI news farm, a SaaS company, a crypto site, an affiliate mill,
an AI-generated content site, or a flashy startup landing page.

## Content type terminology

One name per format. Do not invent synonyms.

| Use | Do not use |
| --- | --- |
| Review | Hands-on deep dive, ultimate guide |
| Comparison | Versus battle, showdown |
| Experiment | Vibe test (in metadata) |
| Build log | Case study, success story |
| Workflow | Playbook, system |
| Guide / resource | Ultimate checklist |

Category labels: AI Coding, Vibe Coding, Build Logs, Workflows, Reviews,
Comparisons, Resources. The Lab (`/tools`) is Hamzify utilities, not vendor
coverage.

## Color tokens

Neutral editorial surfaces (`paper`, `surface`, `ink`). Violet is the brand
accent. Cyan/teal is the technical and experimental accent. Amber is the
workflow / process accent. Ember is reserved for warnings and a few editorial
highlights. Olive is The Lab.

| Area | Accent |
| --- | --- |
| AI Coding, reviews, comparisons | Violet / indigo |
| Vibe coding, experiments | Cyan / teal |
| Build logs | Teal, violet only in details |
| Workflows | Amber, sparingly |
| The Lab | Olive |

Do not use every accent on one page.

## Typography roles

| Role | Treatment |
| --- | --- |
| Display | Fraunces, `text-display-*`, homepage and page titles |
| Article heading | Fraunces in prose `h2` / `h3` |
| Section heading | Fraunces, `text-display-s` or smaller |
| Body | Source Sans 3 |
| Metadata | JetBrains Mono, `.label` |
| Code | JetBrains Mono |

Readability first. Do not add font families. Keep article measure at `--w-prose`.

## Logo

| File | Use |
| --- | --- |
| `/brand/hamzify-mark.png` | Header and footer lockup |
| `/brand/hamzify-logo.jpg` | About page, JSON-LD logo |
| `/favicon.svg`, `/favicon.png` | Browser tab |
| `/apple-touch-icon.png` | iOS home screen |
| `/icons/hamzify-logo-512.png` | Manifest, large icon |
| `/icons/hamzify-mark.svg` | Vector fallback |

Do not stretch the mark. Keep it in a square. The wordmark sits beside it in
Fraunces; do not redraw the letters.

## Signature components

Optional. Only with real data. Never on sample placeholders as if they were
tests.

- `HamzifyMethod` — Question, Method, Test, Result, Takeaway
- `Verdict` — Practical verdict: Best for, Not ideal for, What surprised me, Bottom line
- `BuildEvidence` — Stack, Tools, Time, Human intervention, Outcome
- `HowThisWasTested` / `BuildDetails` / `TestMethodology` / `ExperimentSetup`
- `experimentStatus` — Completed, In progress, Repeated, Needs further testing
- `basis` — Tested / researched / analysis / mixed. Do not set `firsthand` on samples

Article type badges (Review, Comparison, Experiment, Build log, Workflow) are
the default labels. Do not stack extra badges unless they add a fact.

## Trust

Visible when it helps, not as a wallpaper of disclaimers.

- Firsthand vs research vs analysis
- Method, version, task, limits
- Published / updated / last reviewed dates (never auto-advanced)
- Affiliate disclosure only when links can earn commission
- Corrections policy, linked from the author box

## Preferred verbs

Tested, built, observed, compared, measured, tried, failed, fixed, verified,
documented.

## Words to avoid

Revolutionary, game-changing, the ultimate, the future is here, transform your
workflow, unlock your potential, best ever, groundbreaking, delve, leverage,
in today's rapidly evolving world.

Em dashes as a writing habit. Formulaic introductions. Keyword stuffing.
First-person claims that did not happen.

## Writing examples

Good: "I tested this on an existing Next.js project."

Not: "I extensively tested this across dozens of enterprise environments."

Good: "The agent stalled on a bug whose cause was not in the file it edited."

Not: "The agent struggled somewhat with more complex scenarios."

## Metadata

Article titles stay specific. The publication name is added by the title
template: `Article title | Hamzify`.

Homepage and default social card: `Hamzify — The Practical AI Coding Publication`.

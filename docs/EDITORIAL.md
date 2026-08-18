# Hamzify editorial standard

Hamzify is an independent publication for people who ship software with AI
coding tools. It should sound like a developer who used the thing being
discussed, not like a summary of a product page.

This file is the voice and quality contract. Operational publishing steps live
in [`PUBLISHING.md`](./PUBLISHING.md). Article skeletons live in
`src/content/articles/_template-*.mdx`.

## Before you write

Write this down first. If you cannot fill it, do not start the draft.

1. **Primary search intent.** Informational, commercial, comparison, tutorial,
   or problem-solving.
2. **Primary topic.** One subject. Not a cluster of unrelated phrases.
3. **Secondary topics.** Only if they help the reader finish the job.
4. **The actual question** the article answers.
5. **Unique evidence.** Firsthand testing, a build, a method, a limitation, or
   analysis you can stand behind. If there is no unique value, do not publish.
6. **Existing Hamzify articles** that should be linked, with a reason for each.

Put the primary topic in `primaryTopic`, and list discussed products in
`tools`. Comparisons also need `compared`. Build logs also need `project`.

## Voice

Direct, specific, evidence-based. Prefer short sentences, then vary the
rhythm. Name the tool, the task, the failure, and the condition.

Bad: "Claude Code is a revolutionary tool that can transform your development
workflow."

Better: "Claude Code handled multi-file changes well in this project, but
required more supervision around unfamiliar business logic."

Prefer:

- what you tested
- what broke
- who should skip this
- what the result does not prove

Avoid:

- em dashes as a habit (use a full stop, a comma, a colon, or parentheses)
- "In today's rapidly evolving..."
- "It's important to note..."
- "Whether you are a beginner or experienced..."
- "In conclusion"
- "Unlock", "Delve into", "Leverage"
- "Game-changing", "Revolutionary"
- filler introductions and motivational padding
- fake certainty and exaggerated claims
- keyword stuffing and repeated sentence shapes
- "Click here", "Read this article", "Learn more about this topic"

The primary topic should appear naturally in the title when it helps, the
slug, the H1, the opening, a relevant H2 or H3, the meta title, the meta
description, and image alt text only when the image actually depicts that
topic. Do not repeat it to hit a density target.

## Trust

- Distinguish firsthand testing from general research.
- Identify limitations in the same piece as the praise.
- Do not pretend a tool was personally tested if it was not.
- Distinguish opinion from evidence.
- Disclose affiliates when a link can earn commission
  (`affiliateDisclosure: true`).
- Use real `publishedAt` / `updatedAt` dates.
- Do not fabricate experiments, benchmarks, screenshots, quotes, statistics,
  or personal experiences.
- Sample placeholder articles must keep `sample: true` until they are replaced
  with real work.

## Internal links

Every published article should help a reader find the next useful Hamzify
piece. Link in the prose when it is genuinely useful. Put those slugs in
`related` as well.

The site also recommends three related articles automatically, scored by:

1. explicit `related` slugs
2. same topic
3. same category or subcategory
4. shared tags or keywords
5. shared tools
6. complementary formats (review to comparison, build log to workflow)

The current article is never recommended. Do not insert random links. Use
descriptive anchors: "the Cursor and Copilot comparison", not "click here".

Tool hubs live at `/ai-coding-tools/<tool>/` and appear only when two or more
published articles mention that tool. `/tools` remains The Lab. Canonical
display names are in [`NAMING.md`](./NAMING.md). Planning lives in
[`content-map.md`](./content-map.md).

Optional flags, all manual:

- `editorialPick` / `startHere` / `evergreen`
- `cluster`
- `quickAnswer` (reviews, comparisons, decision guides)
- `lastReviewedAt` / `reviewIntervalDays` (never auto-changed)
- `basis` (`firsthand` `research` `analysis` `mixed`). Do not set `firsthand`
  on sample placeholders.

## FAQ

Only add `faq` when the questions are real, likely to help, and not already
answered clearly in the body. Answers should be short. Do not restate
headings. Do not add FAQ structured data for questions that are not visible.

## Headings

Do not force every article into identical H2s. The templates are starting
shapes. A short review does not need a table of contents. A simple workflow
does not need an FAQ. A table of contents only appears when there are at
least three headings.

## What not to do

Do not change existing article URLs. Do not invent review ratings. Do not add
schema that makes unsupported claims. Do not edit `sitemap.xml` by hand: a
new published MDX file is included on the next production build.

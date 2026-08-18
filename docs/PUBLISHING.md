# Publishing a Hamzify article

Hamzify is a developer publication. A new article earns its place by being
useful to a real reader, not by repeating a keyword. This file is the
operational checklist. Voice, evidence, and internal-linking rules live in
[`EDITORIAL.md`](./EDITORIAL.md). The visual system, routes, sitemap and
metadata already exist; you do not need to edit them to publish.

## 1. Write the brief first

Before opening the template, write down:

1. **Primary topic.** One subject.
2. **Primary search concept.** One, not a cluster of unrelated phrases.
3. **Search intent.** Informational, commercial, comparison, tutorial, or
   problem-solving.
4. **The question** the article answers.
5. **Reader.** Who this is for.
6. **Unique value.** A test, a build, a method, a limitation, or a decision
   framework.
7. **Existing Hamzify articles** that should be linked.

If you cannot name the unique value, do not publish yet.

## 2. Create the file

Copy the matching template:

```text
src/content/articles/_template-review.mdx
src/content/articles/_template-comparison.mdx
src/content/articles/_template-build-log.mdx
src/content/articles/_template-experiment.mdx
src/content/articles/_template-workflow.mdx
```

or the generic starter:

```text
src/content/articles/_template.mdx
```

to:

```text
src/content/articles/<slug>.mdx
```

The filename **is** the URL slug. Combined with `category`, it becomes:

```text
https://hamzify.site/<category>/<slug>/
```

Rules for the slug:

- lowercase, hyphen-separated
- no dates unless the date is the subject
- stable — do not rename a published URL casually

Files that start with `_` are ignored by the content layer. The template is
safe to leave in place.

## 3. Fill the frontmatter

Required:

| Field | Notes |
| --- | --- |
| `title` | Visible H1. Specific. Not "Everything you need to know about X". |
| `description` | Unique. Also the meta description. 40–300 characters. |
| `category` | `vibe-coding` `build-logs` `workflows` `reviews` `compare` `resources` |
| `articleType` | `experiment` `build-log` `review` `comparison` `workflow` `guide` `resource` |
| `publishedAt` | `YYYY-MM-DD`. Real date. |
| `author` | Must match `src/content/authors/<slug>.json` |

Strongly recommended:

| Field | Notes |
| --- | --- |
| `dek` | Subtitle under the H1. |
| `primaryTopic` | The one search concept. |
| `searchIntent` | Helps you keep the structure honest. |
| `tags` / `keywords` | Related language, not stuffed repeats of the title. |
| `coverPattern` | `grid` `terminal` `diff` `timeline` `stack` `flow` |
| `related` | Slugs of other articles a reader should open next. |
| `tools` | Product names this piece actually discusses. Improves related reading and search. |
| `updatedAt` | Only when the article is materially revised. |

Type-specific:

- **Build logs** must include a `project` block (name, objective, status,
  stack, aiTools, timeInvested).
- **Comparisons** must include `compared` with at least two names.
- **Experiments** should include `question` and `result`.
- Optional `coverImage` + `coverImageAlt` if you have a real screenshot. The
  generated editorial visual is used when there is no photo.
- Optional `faq` (3–6 real questions). Visible on the page; FAQ structured
  data is emitted only then. Do not add FAQs that restate the article.

Set `draft: true` until the piece is ready. Drafts are excluded from the
site, the sitemap, and RSS.

Set `sample: false` on anything that is a real test or build. Sample articles
render a public notice.

Do not use a markdown `#` heading. The template owns the H1.

## 4. Write the body

Voice: clear, specific, practical, technically literate. Prefer limitations
and trade-offs over hype. Full rules: [`EDITORIAL.md`](./EDITORIAL.md).

Do not use:

- em dashes as a writing habit
- "In today's rapidly evolving world"
- "Let's dive in" / "Delve into" / "Leverage" / "Unlock"
- "Game changer" / "Revolutionary"
- fabricated tests, fake statistics, invented first-hand results

Editorial blocks available in every MDX file (no import):

`KeyTakeaways` `Finding` `PullQuote` `Callout` `ProsCons` `Verdict`
`QuickVerdict` `TestMethodology` `ExperimentSetup` `ToolComparison`
`BuildTimeline` `ProjectStack` `Sources` `FaqList` `ImageWithCaption`
`AffiliateLink`

Use a block when it carries meaning. Do not decorate an empty article.

Internal links belong in the prose where they help. `related` fills the
related-reading row; it is not a substitute for a useful in-text link.

## 5. Pre-publish check

```bash
npm run check
```

That runs TypeScript, ESLint, and `scripts/validate-content.mjs`, which fails
on duplicate titles or descriptions, missing related slugs, missing cover
files, comparison/build-log shape errors, and markdown H1s.

Then:

```bash
npm run build
```

The build also validates frontmatter via Zod (`src/types/content.ts`) and
refuses to ship a malformed article.

Human checklist before you merge:

- [ ] The article helps a real reader and matches the search intent
- [ ] Unique title and unique description
- [ ] Honest about what was tested, and what was not
- [ ] Limitations included where a reader would be misled without them
- [ ] `draft: true` removed
- [ ] `sample: false` if this is real work
- [ ] Internal links that a reader would actually follow
- [ ] `tools` lists the products discussed
- [ ] No FAQ unless the questions are real and unanswered in the body
- [ ] External links to primary sources for facts that need them

## 6. How the sitemap updates

You do not edit `sitemap.xml` or `robots.txt`.

On every production build:

1. `src/app/sitemap.ts` collects published, non-draft articles.
2. `scripts/write-seo-files.mjs` writes a real `out/sitemap.xml` file (GitHub
   Pages cannot serve Next's directory-shaped sitemap).
3. `out/robots.txt` points at `https://hamzify.site/sitemap.xml`.

Deploy is GitHub Actions on push to `main`. After it finishes, confirm:

https://hamzify.site/sitemap.xml

contains the new canonical URL (`https://hamzify.site/<category>/<slug>/`)
and a `lastmod` that matches `updatedAt` or `publishedAt`.

Google is not notified automatically. After deploy, inspect the URL and, if
you want, use Search Console → URL Inspection → Request indexing. Indexing
is Google's decision.

## 7. What not to change when publishing

Do not edit routes, `src/app/sitemap.ts` logic, `robots.ts`, canonical
helpers, or JSON-LD builders unless the article system itself is broken.
A new MDX file is enough.

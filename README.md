# Hamzify

**Practical AI for people who build.**

An editorial publication about AI-assisted software development: hands-on tool
tests, real build logs, coding workflows and experiments. Built as a fully static
Next.js site, so it deploys to GitHub Pages with no server, no database and no
runtime cost.

Production domain: <https://hamzify.site>

---

## 1. Overview

Hamzify is a content-first publication, not a marketing site. Everything in the
architecture follows from that:

- **Content lives in MDX** under `src/content/articles`, validated by Zod at
  build time. A malformed article fails the build rather than shipping broken.
- **One content abstraction layer** (`src/lib/content.ts`). Pages never read the
  filesystem directly, which is what makes a later move to a hosted CMS a mapping
  exercise instead of a rewrite.
- **Six content pillars**, each with its own index page and its own accent
  colour: Vibe Coding, Build Logs, Workflows, Reviews, Comparisons, Resources.
- **Article formats are first-class.** A review, a comparison, a build log and an
  experiment are different things, so they get different components and different
  social cards rather than one template with the text swapped.
- **Server Components by default.** Client components are limited to the five
  places that genuinely need interaction: theme toggle, mobile nav, table of
  contents, search, and the two forms.

### Content pillars and routes

| Pillar | Index | Articles |
| --- | --- | --- |
| Vibe Coding | `/vibe-coding` | `/vibe-coding/[slug]` |
| Build Logs | `/build-logs` | `/build-logs/[slug]` |
| Workflows | `/workflows` | `/workflows/[slug]` |
| Reviews | `/reviews` | `/reviews/[slug]` |
| Comparisons | `/compare` | `/compare/[slug]` |
| Resources | `/resources` | `/resources/[slug]` |

Plus `/` (homepage), `/latest`, `/ai-coding-tools` (curated tool coverage hub),
`/tools` (the lab — future interactive utilities), `/about`, `/contact`,
`/search`, `/author/[slug]`, and the policy pages `/privacy`, `/terms`,
`/affiliate-disclosure`, `/editorial-policy`, `/corrections-policy`.

---

## 2. Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, `output: "export"`) |
| Language | TypeScript (strict) |
| UI | React 19, Server Components by default |
| Styling | Tailwind CSS v4 + a CSS-variable design token layer in `globals.css` |
| Content | MDX via `@next/mdx`, frontmatter via `gray-matter` |
| Validation | Zod |
| Syntax highlighting | `rehype-pretty-code` + Shiki, at build time (zero client JS) |
| Icons | `lucide-react` |
| Social images | `next/og` (Satori), generated at build time as real `.png` files |

Deliberately **not** used: an animation library (CSS handles the restrained
motion here), a component library as the visual identity (`shadcn/ui` patterns
were adapted into the local design system rather than installed wholesale), and
any client-side syntax highlighter.

### Theming

Light and dark are both designed, not inverted. The token layer uses CSS
`light-dark()` so a single variable definition serves both modes, and
`ThemeScript` applies the stored preference in `<head>` to avoid a flash. The
default is the system preference.

---

## 3. Local installation

Requires Node.js 20.9 or newer (22 LTS recommended).

```bash
npm install
npm run dev
```

The dev server runs at <http://localhost:3000>.

| Script | Does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build + static export to `out/` |
| `npm run check` | `tsc --noEmit` then ESLint |
| `npm run typecheck` | Types only |
| `npm run lint` | ESLint only |
| `npm run serve:out` | Serve the exported `out/` directory locally |

Run `npm run build && npm run serve:out` to preview exactly what gets deployed.
This matters here: trailing-slash routing and the generated `.png` social cards
behave differently under a static host than under `next dev`.

---

## 4. Environment variables

Copy `.env.example` to `.env.local`. **Every variable is optional** — the site
builds and runs correctly with no env file at all, which is the point of the
provider abstractions.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata, sitemap, RSS and JSON-LD. No trailing slash. Defaults to `https://hamzify.site`. |
| `NEXT_PUBLIC_ANALYTICS_PROVIDER` | `plausible`, `umami` or `ga`. Blank ships zero analytics JavaScript. |
| `NEXT_PUBLIC_ANALYTICS_DOMAIN` | Site domain / website id at the provider. |
| `NEXT_PUBLIC_ANALYTICS_SCRIPT_URL` | Self-hosted script URL, if not using the provider default. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `G-XXXXXXXXXX`, when the provider is `ga`. |
| `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` | Where the signup form posts. Blank makes the form say signups are not connected yet instead of faking success. |
| `NEXT_PUBLIC_CONTACT_ENDPOINT` | A public form endpoint such as Formspree. Blank shows the email fallback. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console meta-tag verification. |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | Bing Webmaster Tools meta-tag verification. |

Two rules that the architecture enforces rather than merely documents:

1. **Only `NEXT_PUBLIC_*` variables exist in this project.** A static export has
   no server, so there is nowhere for a private key to live. Anything secret
   belongs in the third-party service or in a serverless function you add later.
2. **No analytics or form provider is hardcoded.** `src/lib/integrations.ts` is
   the single place that reads this configuration.

---

## 5. Content creation workflow

### A new article

Create `src/content/articles/<slug>.mdx`. The filename is the URL slug; the
`category` field decides the path. So `cursor-review.mdx` with
`category: reviews` becomes `/reviews/cursor-review/`.

```mdx
---
title: Cursor Review: Two Weeks Inside a Real Codebase
description: A standalone, specific summary. This is also the meta description, so write it for someone who has not seen the page.
category: reviews          # vibe-coding | build-logs | workflows | reviews | compare | resources
articleType: review        # experiment | review | comparison | build-log | workflow | guide
dek: One line under the headline.
tags: [cursor, ai-coding-tools]
keywords: [cursor review]
publishedAt: 2026-08-12
updatedAt: 2026-08-14      # optional
author: hamza              # must match a file in src/content/authors
coverPattern: terminal     # grid | terminal | diff | timeline | stack | flow
featured: false
affiliateDisclosure: false # true renders the disclosure above the body
draft: false
sample: false              # true renders a visible "sample content" notice
related: [cursor-vs-github-copilot]
---

Body starts here. Use `##` and `###` — the table of contents and anchor links
are generated from them.
```

Validation lives in `src/types/content.ts`. Fields are checked on every build:
dates must be real, the author must exist, the category and article type must be
in the taxonomy.

### Build logs

Add a `project` block to the frontmatter and the header, cards, homepage
spotlight and social card all pick it up:

```yaml
project:
  name: Ledgerly
  objective: What you were trying to build
  status: Shipped, still running
  stack: [Next.js, TypeScript, Postgres]
  aiTools: [Cursor, Claude]
  timeInvested: 14 hours
  repo: https://github.com/...   # optional
  demo: https://...              # optional
```

### Editorial components

Available in any MDX file without an import (registered in
`src/mdx-components.tsx`):

`<KeyTakeaways>` `<Callout>` `<ProsCons>` `<Verdict>` `<TestMethodology>`
`<ExperimentSetup>` `<ToolComparison>` `<BuildTimeline>` `<ProjectStack>`
`<Sources>` `<SpecList>` / `<SpecRow>` `<ImageWithCaption>` `<AffiliateLink>`

Code fences get Shiki highlighting and a copy button automatically. Tables are
made scrollable automatically. Headings get anchors automatically.

These exist to make original material easy to publish consistently — the
`<TestMethodology>` and `<ExperimentSetup>` blocks in particular are there so a
claim always ships with how it was tested.

### Authors

`src/content/authors/<slug>.json`. Name, role, bio, expertise and links feed the
byline, the `/author/<slug>` page, the About page and the `Person` JSON-LD.
Initials render in a CSS avatar when no photo is supplied.

### Sample content

The 11 articles shipped here are **placeholders**, marked `sample: true`. Each one
renders a visible notice saying so, because fabricated first-hand results are
worse than no results. Replace or delete them before launch. The About page
counts them and says so too.

### Adding a tool to the lab

Edit `src/lib/tools.ts`. Entries are `live`, `building` or `planned`; planned
entries present honestly as upcoming rather than as fake products.

---

## 6. Production build

```bash
npm run check   # types + lint
npm run build   # writes out/
```

The build is fully static. Every page, the RSS feed, the sitemap, `robots.txt`,
the web manifest and all 19 social images are generated at build time into `out/`.

`npm run build` runs `next build` and then
`scripts/flatten-segment-cache.mjs`. Next 16 prefetches individual route
segments and asks for them at URLs like
`/latest/__next.!KHNpdGUp.latest.__PAGE__.txt`, but the static export writes those
payloads into nested directories instead, so every prefetch 404s on a static host
— console errors on link hover, and a full 404 page downloaded each time on
GitHub Pages. The script renames them to the paths the router actually requests.
It is a no-op if a future Next release exports them flat.

---

## 7. Deployment (GitHub Pages)

`.github/workflows/deploy.yml` builds and publishes on every push to `main`.

One-time setup:

1. Push the repository to GitHub.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
3. Push to `main`. The workflow runs `npm ci`, `npm run check`, `npm run build`,
   then publishes `out/`.

The workflow runs `touch out/.nojekyll` before uploading. Without it, Pages hands
the output to Jekyll, which ignores every directory beginning with an underscore
— including `_next`, i.e. all the CSS and JavaScript.

Two configuration choices make static export work correctly:

- `trailingSlash: true`, so `/reviews/cursor-review/` resolves to a real
  `index.html` file. All internal links and canonical URLs match this shape.
- `images.unoptimized: true`, because the Next image optimizer needs a server.
  Cover art is CSS-generated rather than bitmap, so this costs nothing here.

### Custom domain

`public/CNAME` contains `hamzify.site` and is copied into `out/` on every build,
so the custom domain survives redeploys.

At your DNS provider:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `<username>.github.io` |

Then in **Settings → Pages**, set the custom domain to `hamzify.site` and enable
**Enforce HTTPS** once the certificate is issued (usually minutes, occasionally
up to 24 hours).

If you ever deploy to a project subpath instead of a custom domain, you will need
`basePath` and `assetPrefix` in `next.config.ts` and a matching
`NEXT_PUBLIC_SITE_URL`. The custom-domain setup above avoids that entirely.

### Key URLs

- Sitemap: <https://hamzify.site/sitemap.xml>
- Robots: <https://hamzify.site/robots.txt>
- RSS: <https://hamzify.site/rss.xml>
- Manifest: `https://hamzify.site/manifest.webmanifest`

---

## 8. Before you launch — what to personalise

These are placeholders with real-looking values. Each one is in exactly one file.

| File | What to change |
| --- | --- |
| `src/lib/site-config.ts` | `email`, `twitterHandle`, `social.x`, `social.github` and `discussions` currently point at `hamzify` handles and a repo that may not exist yet. |
| `src/content/authors/hamza.json` | Your real name, role, bio, expertise and links. Add `avatar` with a photo path — a real face and real credentials are what E-E-A-T is actually assessed on. |
| `src/content/articles/*.mdx` | All 11 are samples. Replace or delete, then set `sample: false` on anything real. |
| `src/content/pages/*.mdx` | Policy pages are written to match how this site actually behaves, but read them and confirm they describe your setup before relying on them. |
| `src/lib/pages.ts` | `lastReviewed` dates for the policy pages. |
| `src/lib/tools.ts` | The three lab entries are honest "planned" placeholders; edit or empty the list. |
| `.env.local` | Newsletter and contact endpoints, analytics, verification tags. |

---

## 9. Post-deployment: Search Console and Bing

Indexing is never guaranteed and cannot be bought with configuration. What
follows is the technical groundwork done and the steps only you can take.

**Google Search Console**

1. Add a property at <https://search.google.com/search-console>. Prefer the
   **Domain** property with DNS TXT verification — it covers every subdomain and
   protocol. Alternatively set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` and
   redeploy to verify by meta tag.
2. Submit `https://hamzify.site/sitemap.xml` under **Sitemaps**.
3. Use **URL Inspection** on the homepage and two or three articles; confirm the
   rendered HTML contains the article text (it does — pages are prerendered).
4. Request indexing for pages you care about. Expect days, not minutes.
5. Watch **Pages** for coverage and **Core Web Vitals** after real traffic
   arrives.

**Bing Webmaster Tools**

1. Add the site at <https://www.bing.com/webmasters>. You can import the property
   from Search Console, or verify with `NEXT_PUBLIC_BING_SITE_VERIFICATION`.
2. Submit the same sitemap.

**Also worth doing**

- Validate structured data with the
  [Rich Results Test](https://search.google.com/test/rich-results). The site
  emits `WebSite`, `Organization`, `Person`, `BreadcrumbList`, `WebPage`,
  `CollectionPage`, `ProfilePage` and `BlogPosting` — and deliberately emits no
  review ratings, aggregate ratings or FAQ markup, since none of those have
  corresponding visible content.
- Check a shared link in a social debugger to confirm the card renders.
- Run Lighthouse against the deployed URL rather than localhost.

---

## 10. What SEO is implemented

- Centralised canonical origin (`src/lib/site-config.ts`) — every canonical URL,
  sitemap entry, feed link and JSON-LD id derives from it, so there is one place
  to change the hostname and no way to leak a localhost URL into production.
- Unique title and description per route, via `createMetadata` in
  `src/lib/metadata.ts`. No two pages share metadata.
- Open Graph and Twitter cards, with a distinct generated image per article and
  per category, plus per-image alt text derived from the same data the image is
  drawn from.
- Dynamic `sitemap.xml` covering indexable pages only, with real `lastmod` dates
  from content frontmatter. Search, drafts and 404 are excluded.
- `robots.txt` that blocks nothing needed for rendering; only `/search/` is
  disallowed, since it can generate unlimited near-duplicate `?q=` URLs.
- RSS 2.0 feed with `atom:self` and `dc:creator`.
- Explicit internal linking: related posts come from declared relationships and
  shared tags, not from recency.
- Author identity, editorial policy and corrections policy pages, since E-E-A-T
  is assessed from what is actually on the page.

Not implemented, on purpose: keyword-stuffed copy, doorway pages, fake ratings
markup, and `llms.txt` as an SEO tactic.

---

## 11. Accessibility and performance notes

- Skip-to-content link, semantic landmarks, one `<h1>` per page, visible focus
  rings, real `<button>` and `<a>` elements throughout.
- `prefers-reduced-motion` disables transitions and the reading-progress
  animation.
- Syntax highlighting is build-time, so code blocks cost zero client JavaScript.
- Fonts are self-hosted through `next/font` with `display: swap` and preloading.
- Article covers are CSS compositions rather than images, which removes the
  largest source of layout shift and payload on a publication like this.

Measured on the built output: the homepage ships about **250 KB of gzipped
JavaScript** and 23 KB of gzipped HTML; an article page is slightly lower. Almost
all of that is the React 19 and App Router runtime rather than site code — only
seven components are client components (theme toggle, mobile nav, table of
contents, reading progress, share controls, search, and the two forms). Worth
knowing rather than glossing over: that runtime is the floor for this framework
choice, and it is the one thing here a static-site generator would beat.

---

## Project structure

```text
src/
  app/
    (site)/            Public pages, sharing the header/footer shell
      [category]/      Category index + [slug] article pages
    og/[file]/         Generated .png social cards and touch icon
    rss.xml/           Feed route handler
    robots.ts  sitemap.ts  manifest.ts  layout.tsx  globals.css
  components/
    article/  cards/  content/  forms/  home/  layout/  search/  seo/  tools/  ui/
  content/
    articles/          MDX articles
    authors/           Author JSON
    pages/             Policy page bodies
  lib/                 content, metadata, schema, search, og, taxonomy, utils
  types/               Zod schemas and inferred types
scripts/
  flatten-segment-cache.mjs   Post-export fix; see "Production build"
public/
  CNAME  icons/
```

---

## Known limitations

- The 11 sample articles are fictional placeholders and are labelled as such on
  the page. Replace them with real work before launch.
- Newsletter and contact submissions need an endpoint. Until one is configured,
  both forms explain the situation instead of pretending to submit.
- No comments system. The contact page and the author's links are the current
  route for questions; GitHub Discussions or a hosted comment widget can be added
  later without touching the content layer.
- Search is client-side over a build-time index. That is the right trade at this
  scale; the interface in `src/lib/search.ts` is where an Algolia or Typesense
  adapter would slot in if the archive grows past a few hundred articles.
- `hamzify-scaffold/` is a leftover `create-next-app` scratch directory, ignored
  by Git, TypeScript and ESLint. It is safe to delete.

## License

Content is © Hamzify. The site code is available for reference; add an explicit
license file before inviting contributions.

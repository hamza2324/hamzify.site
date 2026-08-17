import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageSquare } from "lucide-react";

import { AuthorAvatar } from "@/components/article/byline";
import { PageHeader } from "@/components/layout/page-header";
import { JsonLd } from "@/components/seo/json-ld";
import { AccentRule } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { getAllArticles, requireAuthor } from "@/lib/content";
import { createMetadata } from "@/lib/metadata";
import {
  breadcrumbNode,
  organizationNode,
  personNode,
  webPageNode,
} from "@/lib/schema";
import { siteConfig } from "@/lib/site-config";
import { CATEGORY_LIST } from "@/lib/taxonomy";

export const metadata: Metadata = createMetadata({
  title: "About Hamzify",
  description:
    "Who writes Hamzify, what this AI coding publication covers, and the standards behind it: first-hand AI coding tool tests, vibe coding experiments, build logs from real projects, and workflows that survived more than one week of use.",
  path: "/about",
  keywords: "about",
});

const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about/" },
];

const STANDARDS = [
  {
    title: "Tests state their method",
    body: "Every review says which version was used, what was built with it and how long it ran. Without that, a verdict is just a mood.",
    href: "/editorial-policy/",
    linkLabel: "Editorial policy",
  },
  {
    title: "Mistakes get published",
    body: "Corrections appear on the page with a note saying what changed and when, rather than being edited in silently.",
    href: "/corrections-policy/",
    linkLabel: "Corrections policy",
  },
  {
    title: "Money is disclosed",
    body: "Affiliate links are marked, disclosed above the article, and have no influence on a recommendation.",
    href: "/affiliate-disclosure/",
    linkLabel: "Affiliate disclosure",
  },
];

export default function AboutPage() {
  const author = requireAuthor("hamza");
  const articles = getAllArticles();
  const sampleCount = articles.filter((article) => article.sample).length;

  return (
    <>
      <JsonLd
        nodes={[
          webPageNode({
            title: "About Hamzify",
            description:
              "Who writes Hamzify, what it covers, and the editorial standards behind it.",
            path: "/about",
          }),
          organizationNode(),
          personNode(author),
          breadcrumbNode(CRUMBS),
        ]}
      />

      <PageHeader
        kicker="About"
        title="Practical AI for people who build"
        intro="Hamzify documents AI-assisted software development from the inside: tools tested on work that mattered, projects built in public, and the workflows that were still in use a month later."
        crumbs={CRUMBS}
      />

      <Container className="py-12 sm:py-16">
        <div className="mb-12 flex items-center gap-5 border-b border-line pb-8">
          <Image
            src={siteConfig.brand.logo}
            alt="Hamzify logo"
            width={80}
            height={80}
            className="size-20 rounded-sm border border-line"
          />
          <p className="max-w-md font-display text-[1.25rem] leading-snug text-ink">
            A working notebook for AI-assisted software development.
          </p>
        </div>

        <div className="flex flex-col gap-16 sm:gap-20">
          {/* Who ------------------------------------------------------------ */}
          <section aria-labelledby="who">
            <div className="flex items-center gap-3">
              <AccentRule />
              <span className="label text-ink-3">Who writes this</span>
            </div>

            <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-14">
              <div>
                <div className="flex items-center gap-4">
                  <AuthorAvatar author={author} size={64} />
                  <div>
                    <h2
                      id="who"
                      className="font-display text-display-s font-semibold text-ink"
                    >
                      {author.name}
                    </h2>
                    <p className="text-[0.875rem] text-ink-3">{author.role}</p>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-4">
                  {author.bio.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 40)}
                      className="max-w-2xl text-[1rem] leading-relaxed text-ink-2"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                <Link
                  href={`/author/${author.slug}/`}
                  className="group mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink transition-colors hover:text-accent"
                >
                  Everything {author.name} has published here
                  <ArrowRight
                    className="size-4 transition-transform duration-200 ease-brand group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </div>

              <dl className="flex flex-col gap-5 rounded-md border border-line bg-surface p-5">
                <div>
                  <dt className="label text-ink-3">Works on</dt>
                  <dd className="mt-2">
                    <ul className="flex flex-wrap gap-1.5">
                      {author.expertise.map((item) => (
                        <li
                          key={item}
                          className="rounded-xs border border-line bg-surface-2 px-2 py-1 font-mono text-[0.75rem] text-ink-2"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <div>
                  <dt className="label text-ink-3">Elsewhere</dt>
                  <dd className="mt-2">
                    <ul className="flex flex-col gap-1.5 text-[0.9375rem]">
                      {author.links.map((link) => (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            target="_blank"
                            rel="me noopener"
                            className="text-ink-2 underline decoration-line-2 underline-offset-2 transition-colors hover:text-ink hover:decoration-accent"
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
            </div>
          </section>

          {/* What ----------------------------------------------------------- */}
          <section aria-labelledby="what">
            <div className="flex items-center gap-3">
              <AccentRule accent="teal" />
              <span className="label text-ink-3">What is here</span>
            </div>

            <h2
              id="what"
              className="mt-4 font-display text-display-s font-semibold text-ink"
            >
              Six kinds of writing, one question
            </h2>
            <p className="mt-3 max-w-2xl text-[1rem] leading-relaxed text-ink-2">
              Everything on this site is a way of answering the same question:
              what is actually worth doing with AI when you have real work in
              front of you?
            </p>

            <ul className="mt-8 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
              {CATEGORY_LIST.map((category) => (
                <li
                  key={category.slug}
                  data-accent={category.accent}
                  className="group relative flex flex-col gap-2 bg-surface p-5 transition-colors hover:bg-surface-2"
                >
                  <span className="label text-[var(--local-accent)]">
                    {category.label}
                  </span>
                  <h3 className="font-display text-[1.0625rem] font-semibold text-ink">
                    <Link
                      href={`/${category.slug}/`}
                      className="link-underline decoration-transparent after:absolute after:inset-0 after:content-[''] group-hover:decoration-current"
                    >
                      {category.headline}
                    </Link>
                  </h3>
                  <p className="text-[0.875rem] leading-relaxed text-ink-2">
                    {category.description}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* Standards ------------------------------------------------------ */}
          <section aria-labelledby="standards">
            <div className="flex items-center gap-3">
              <AccentRule accent="indigo" />
              <span className="label text-ink-3">Standards</span>
            </div>

            <h2
              id="standards"
              className="mt-4 font-display text-display-s font-semibold text-ink"
            >
              What you can hold this site to
            </h2>

            <ul className="mt-8 grid gap-8 md:grid-cols-3">
              {STANDARDS.map((standard) => (
                <li key={standard.title}>
                  <h3 className="font-display text-[1.0625rem] font-semibold text-ink">
                    {standard.title}
                  </h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-2">
                    {standard.body}
                  </p>
                  <Link
                    href={standard.href}
                    className="mt-3 inline-block text-[0.8125rem] text-ink-2 underline decoration-line-2 underline-offset-2 transition-colors hover:text-ink hover:decoration-accent"
                  >
                    {standard.linkLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Sample content notice ------------------------------------------ */}
          {sampleCount > 0 ? (
            <section
              aria-labelledby="sample-content"
              className="rounded-md border border-dashed border-amber/60 bg-amber-soft p-5 sm:p-6"
            >
              <h2
                id="sample-content"
                className="font-display text-[1.125rem] font-semibold text-amber"
              >
                About the current articles
              </h2>
              <p className="mt-2 max-w-3xl text-[0.9375rem] leading-relaxed text-ink-2">
                {sampleCount} of the {articles.length} articles on this site are
                sample content shipped with the template. They exist to
                demonstrate the formats — reviews, comparisons, build logs,
                experiments, workflows — and each one carries a visible notice
                saying so. The timings, costs and outcomes in them are
                illustrative, not results from a real test, and they are meant to
                be replaced by genuine write-ups.
              </p>
            </section>
          ) : null}

          {/* Questions ------------------------------------------------------ */}
          <section
            aria-labelledby="questions"
            className="rounded-md border border-line bg-surface-2 p-5 sm:p-8"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-10">
              <div>
                <h2
                  id="questions"
                  className="font-display text-display-s font-semibold text-ink"
                >
                  Questions are welcome
                </h2>
                <p className="mt-2 max-w-xl text-[0.9375rem] leading-relaxed text-ink-2">
                  There is no comment box here, because a comment box on a static
                  site means handing your data to a third party. Discussions
                  happen on GitHub instead, in public, where the answers stay
                  findable.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href={siteConfig.discussions}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-1.5 rounded-sm bg-brand px-4 py-2.5 text-[0.9375rem] font-medium text-on-accent transition-colors hover:bg-accent-strong"
                >
                  <MessageSquare className="size-4" aria-hidden="true" />
                  Start a discussion
                </a>
                <Link
                  href="/contact/"
                  className="inline-flex items-center gap-1.5 rounded-sm border border-line-2 px-4 py-2.5 text-[0.9375rem] font-medium text-ink transition-colors hover:border-line-strong"
                >
                  Contact
                </Link>
              </div>
            </div>
          </section>
        </div>
      </Container>
    </>
  );
}

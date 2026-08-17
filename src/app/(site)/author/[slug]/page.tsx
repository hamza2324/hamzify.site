import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AuthorAvatar } from "@/components/article/byline";
import { ArticleList, EmptyState } from "@/components/cards/article-list";
import { PageHeader } from "@/components/layout/page-header";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { getAllAuthors, getArticlesByAuthor, getAuthor } from "@/lib/content";
import { createMetadata } from "@/lib/metadata";
import { breadcrumbNode, personNode, profilePageNode } from "@/lib/schema";
import { CATEGORIES } from "@/lib/taxonomy";

/**
 * Author profile.
 *
 * Part of the E-E-A-T surface rather than a vanity page: who wrote this, what
 * they actually work on, and everything they have published here, with links
 * that can be verified.
 */

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllAuthors().map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) return {};

  return createMetadata({
    title: `${author.name} — ${author.role}`,
    description: author.shortBio,
    path: `/author/${author.slug}`,
    keywords: [
      author.name,
      "AI coding tools",
      "AI-assisted software development",
      "build logs",
    ],
  });
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) notFound();

  const articles = getArticlesByAuthor(author.slug);

  const categoriesCovered = [
    ...new Set(articles.map((article) => CATEGORIES[article.category].label)),
  ];

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Authors", path: "/about/" },
    { name: author.name, path: `/author/${author.slug}/` },
  ];

  return (
    <>
      <JsonLd
        nodes={[
          profilePageNode(author, articles),
          personNode(author),
          breadcrumbNode(crumbs),
        ]}
      />

      <PageHeader
        kicker="Author"
        title={author.name}
        crumbs={crumbs}
        meta={
          <>
            <span className="font-mono uppercase tracking-[0.06em]">
              {author.role}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {articles.length}{" "}
              {articles.length === 1 ? "article" : "articles"}
            </span>
            {categoriesCovered.length > 0 ? (
              <>
                <span aria-hidden="true">·</span>
                <span>{categoriesCovered.join(", ")}</span>
              </>
            ) : null}
          </>
        }
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-14">
          <div className="flex flex-col gap-4">
            <AuthorAvatar author={author} size={72} />
            {author.bio.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="max-w-2xl text-[0.9375rem] leading-relaxed text-ink-2"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <dl className="flex flex-col gap-5 border-t border-line pt-6 lg:border-t-0 lg:border-l lg:border-line lg:pt-0 lg:pl-8">
            <div>
              <dt className="label text-ink-3">Works on</dt>
              <dd className="mt-2">
                <ul className="flex flex-wrap gap-1.5">
                  {author.expertise.map((item) => (
                    <li
                      key={item}
                      className="rounded-xs border border-line bg-surface px-2 py-1 font-mono text-[0.75rem] text-ink-2"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>

            {author.links.length > 0 ? (
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
            ) : null}
          </dl>
        </div>
      </PageHeader>

      <Container className="py-10 sm:py-14">
        <h2 className="font-display text-display-s font-semibold text-ink">
          Published on Hamzify
        </h2>

        {articles.length > 0 ? (
          <ArticleList articles={articles} className="mt-6" />
        ) : (
          <div className="mt-6">
            <EmptyState
              title="No articles yet"
              body={`${author.name} has not published anything here so far.`}
            />
          </div>
        )}
      </Container>
    </>
  );
}

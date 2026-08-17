import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleHeader } from "@/components/article/article-header";
import { ArticleNav } from "@/components/article/article-nav";
import { AuthorBox } from "@/components/article/author-box";
import { ReadingProgress } from "@/components/article/reading-progress";
import { RelatedPosts } from "@/components/article/related-posts";
import { ShareControls } from "@/components/article/share-controls";
import { TableOfContents } from "@/components/article/table-of-contents";
import {
  AffiliateDisclosure,
  SampleNotice,
} from "@/components/content/disclosures";
import { FaqList } from "@/components/content/editorial-blocks";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import {
  getAllArticles,
  getArticle,
  getArticleNeighbours,
  getRelatedArticles,
  requireAuthor,
} from "@/lib/content";
import { loadArticleBody } from "@/lib/mdx";
import { createMetadata } from "@/lib/metadata";
import { keywordsFor } from "@/lib/seo";
import { articleCardAlt } from "@/lib/og-cards";
import { ogNames } from "@/lib/og-paths";
import {
  blogPostingNode,
  breadcrumbNode,
  faqPageNode,
  organizationNode,
  personNode,
  webPageNode,
  webSiteNode,
} from "@/lib/schema";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import { CATEGORIES, isCategorySlug } from "@/lib/taxonomy";
import { formatDateLong, toIsoDate } from "@/lib/utils";

type ArticleRouteParams = { category: string; slug: string };

/** Every article is prerendered; unknown paths 404 instead of being generated. */
export function generateStaticParams(): ArticleRouteParams[] {
  return getAllArticles().map((article) => ({
    category: article.category,
    slug: article.slug,
  }));
}

export const dynamicParams = false;

function resolve({ category, slug }: ArticleRouteParams) {
  if (!isCategorySlug(category)) return undefined;
  return getArticle(category, slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<ArticleRouteParams>;
}): Promise<Metadata> {
  const article = resolve(await params);
  if (!article) return {};

  const author = requireAuthor(article.author);

  return createMetadata({
    title: article.title,
    description: article.description,
    path: article.path,
    type: "article",
    publishedTime: toIsoDate(article.publishedAt),
    modifiedTime: toIsoDate(article.updatedAt ?? article.publishedAt),
    authors: [author.name],
    section: CATEGORIES[article.category].label,
    tags: article.tags,
    keywords: keywordsFor(
      article.category,
      article.keywords,
      article.primaryTopic ? [article.primaryTopic] : undefined,
    ),
    image: {
      name: ogNames.article(article.slug),
      alt: articleCardAlt(article),
    },
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<ArticleRouteParams>;
}) {
  const article = resolve(await params);
  if (!article) notFound();

  const author = requireAuthor(article.author);
  const category = CATEGORIES[article.category];
  const Body = await loadArticleBody(article.slug);
  const related = getRelatedArticles(article, 3);
  const { previous, next } = getArticleNeighbours(article);
  const faqJson = faqPageNode(article);

  const crumbs = [
    { name: "Home", path: "/" },
    { name: category.label, path: `/${category.slug}` },
    { name: article.title, path: article.path },
  ];

  return (
    <>
      <ReadingProgress />

      <JsonLd
        nodes={[
          organizationNode(),
          webSiteNode(),
          webPageNode({
            title: article.title,
            description: article.description,
            path: article.path,
          }),
          blogPostingNode(article, author),
          personNode(author),
          breadcrumbNode(crumbs),
          ...(faqJson ? [faqJson] : []),
        ]}
      />

      <article className="pb-20 pt-8 sm:pt-12">
        <Container>
          <ArticleHeader article={article} author={author} crumbs={crumbs} />
        </Container>

        <Container className="mt-12">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-16">
            <div className="min-w-0">
              {article.sample ? <SampleNotice /> : null}
              {article.affiliateDisclosure ? <AffiliateDisclosure /> : null}

              {/* Mobile table of contents: collapsed by default so it never
                  pushes the first paragraph off the screen. */}
              {article.headings.length > 1 ? (
                <details className="mb-8 rounded-md border border-line bg-surface px-4 py-3 lg:hidden">
                  <summary className="label cursor-pointer text-ink-2">
                    Contents ({article.headings.length} sections)
                  </summary>
                  <ol className="mt-3 flex flex-col gap-2 border-l border-line pl-3">
                    {article.headings.map((heading) => (
                      <li key={heading.id}>
                        <a
                          href={`#${heading.id}`}
                          className={`text-[0.875rem] text-ink-2 ${heading.level === 3 ? "pl-3" : ""}`}
                        >
                          {heading.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </details>
              ) : null}

              <div className="prose">
                <Body />
              </div>

              {article.faq?.length ? <FaqList items={article.faq} /> : null}

              <footer className="mt-14 flex flex-col gap-10">
                <div className="flex flex-col gap-5 border-t border-line pt-6">
                  <ShareControls title={article.title} path={article.path} />

                  <p className="text-[0.8125rem] leading-relaxed text-ink-3">
                    Published{" "}
                    <time dateTime={article.publishedAt}>
                      {formatDateLong(article.publishedAt)}
                    </time>
                    {article.updatedAt &&
                    article.updatedAt !== article.publishedAt ? (
                      <>
                        {" and last reviewed "}
                        <time dateTime={article.updatedAt}>
                          {formatDateLong(article.updatedAt)}
                        </time>
                      </>
                    ) : null}
                    . Questions are welcome in{" "}
                    <a
                      href={siteConfig.discussions}
                      target="_blank"
                      rel="noopener"
                      className="underline decoration-line-2 underline-offset-2 hover:decoration-accent"
                    >
                      GitHub Discussions
                    </a>
                    , and if something here is wrong,{" "}
                    <a
                      href={`mailto:${siteConfig.email}?subject=${encodeURIComponent(`Correction: ${article.title}`)}&body=${encodeURIComponent(`Page: ${absoluteUrl(article.path)}\n\nWhat looks wrong:`)}`}
                      className="underline decoration-line-2 underline-offset-2 hover:decoration-accent"
                    >
                      send a correction
                    </a>
                    .
                  </p>
                </div>

                {article.tags.length > 0 ? (
                  <ul className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-xs border border-line bg-surface-2 px-2 py-1 font-mono text-[0.75rem] text-ink-3"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                ) : null}

                <AuthorBox author={author} />
                <ArticleNav previous={previous} next={next} />
              </footer>
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-[calc(var(--header-h)+2rem)]">
                <TableOfContents headings={article.headings} />
              </div>
            </aside>
          </div>
        </Container>

        {related.length > 0 ? (
          <Container className="mt-20">
            <RelatedPosts
              articles={related}
              description={`Chosen by shared tags and explicit links from this article, not by recency.`}
            />
          </Container>
        ) : null}
      </article>
    </>
  );
}

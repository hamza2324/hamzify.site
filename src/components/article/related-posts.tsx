import { ArticleCard } from "@/components/cards/article-card";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Article } from "@/types/content";

/**
 * Related reading, chosen by explicit relationships and shared tags in
 * `getRelatedArticles` rather than by recency. The heading says why these are
 * here, which is more useful than a bare "You might also like".
 */
export function RelatedPosts({
  articles,
  title = "Related reading",
  description,
}: {
  articles: Article[];
  title?: string;
  description?: string;
}) {
  if (articles.length === 0) return null;

  return (
    <section aria-labelledby="related-heading">
      <SectionHeading
        kicker="More from Hamzify"
        title={title}
        description={description}
        className="[&_h2]:text-[1.375rem]"
      />
      <span id="related-heading" className="sr-only">
        {title}
      </span>

      <div className="mt-7 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} variant="feature" />
        ))}
      </div>
    </section>
  );
}

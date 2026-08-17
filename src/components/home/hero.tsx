import { ArticleCard } from "@/components/cards/article-card";
import { Container } from "@/components/ui/container";
import { formatRecordLabel } from "@/lib/records";
import { ARTICLE_TYPE_META } from "@/lib/taxonomy";
import type { Article } from "@/types/content";

/**
 * The homepage masthead.
 *
 * Identity comes from a real piece of work, not a slogan. The page heading is
 * visually quiet so the featured story can carry the weight.
 */
export function Hero({ article }: { article: Article }) {
  const typeMeta = ARTICLE_TYPE_META[article.articleType];
  const kicker =
    article.articleType === "experiment" || article.articleType === "build-log"
      ? formatRecordLabel(article)
      : `Featured ${typeMeta.label.toLowerCase()}`;

  return (
    <section className="border-b border-line bg-paper pt-8 pb-12 sm:pt-10 lg:pt-14 lg:pb-16">
      <Container>
        <h1 className="sr-only">
          Hamzify — AI coding tools, build logs and workflows
        </h1>

        <p className="label text-accent">{kicker}</p>

        <div className="mt-6">
          <ArticleCard
            article={article}
            variant="hero"
            showAuthor
            priority
            className="rise"
          />
        </div>
      </Container>
    </section>
  );
}

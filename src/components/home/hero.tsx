import { ArticleCard } from "@/components/cards/article-card";
import { Container } from "@/components/ui/container";
import { formatRecordLabel } from "@/lib/records";
import { siteConfig } from "@/lib/site-config";
import { ARTICLE_TYPE_META } from "@/lib/taxonomy";
import type { Article } from "@/types/content";

/**
 * The homepage masthead.
 *
 * Identity is established in a compact lockup so a first visit knows what
 * Hamzify is, then a real piece of work carries the visual weight. The
 * heading stays modest so the featured story is not pushed below the fold.
 */
export function Hero({ article }: { article: Article }) {
  const typeMeta = ARTICLE_TYPE_META[article.articleType];
  const kicker =
    article.articleType === "experiment" || article.articleType === "build-log"
      ? formatRecordLabel(article)
      : `Featured ${typeMeta.label.toLowerCase()}`;

  return (
    <section className="texture-grid border-b border-line bg-paper pt-8 pb-12 sm:pt-10 lg:pt-12 lg:pb-16">
      <Container>
        <p className="label text-violet">{siteConfig.tagline}</p>
        <h1 className="mt-2 font-display text-display-s font-semibold tracking-[-0.02em] text-ink sm:text-display-m">
          {siteConfig.name}
        </h1>
        <p className="mt-2 max-w-xl text-[0.9875rem] leading-relaxed text-ink-2">
          {siteConfig.supportingLine}
        </p>

        <p className="mt-8 label text-accent sm:mt-10">{kicker}</p>

        <div className="mt-4">
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

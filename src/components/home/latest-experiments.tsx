import { ArticleCard } from "@/components/cards/article-card";
import { ExperimentCard } from "@/components/cards/experiment-card";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Article } from "@/types/content";

/**
 * Recent experiments and build logs.
 *
 * Experiments get the lab-record card. Everything else keeps a cover-led
 * featured card. Compact headlines fill the third column so the row has rhythm
 * instead of three identical boxes.
 */
export function LatestExperiments({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  const [lead, second, ...rest] = articles;

  return (
    <section
      aria-labelledby="latest-experiments"
      className="border-b border-line py-14 sm:py-16 lg:py-20"
    >
      <Container>
        <SectionHeading
          kicker="Vibe coding"
          title="Recent experiments and AI build logs"
          description="What happened when real work was handed to an AI coding model — vibe coding experiments and agent build logs, written up with the setup and the limitations attached."
          accent="ember"
          action={{ href: "/latest/", label: "All articles" }}
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,16rem)] lg:gap-8">
          {lead ? <LeadCard article={lead} /> : null}
          {second ? <LeadCard article={second} /> : null}

          {rest.length > 0 ? (
            <ul className="flex flex-col divide-y divide-line border-t border-line lg:border-t-0 lg:border-l lg:border-line lg:pl-8">
              {rest.map((article) => (
                <li key={article.slug} className="py-5 first:pt-0 lg:first:pt-0">
                  <ArticleCard article={article} variant="compact" />
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

function LeadCard({ article }: { article: Article }) {
  if (article.articleType === "experiment") {
    return <ExperimentCard article={article} className="h-full" />;
  }

  return <ArticleCard article={article} variant="feature" />;
}

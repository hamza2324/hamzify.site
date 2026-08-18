import { ArticleCard } from "@/components/cards/article-card";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Article } from "@/types/content";

/**
 * Compact resources strip. Visually quieter than tool coverage or build logs
 * so the homepage does not read as five identical card walls.
 */
export function ResourcesPreview({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  return (
    <section
      id="resources"
      aria-labelledby="resources-preview"
      className="border-b border-line bg-surface-2 py-14 sm:py-16 lg:py-20"
    >
      <Container>
        <SectionHeading
          kicker="Reference"
          title="Resources worth keeping open"
          description="Checklists and guides updated in place. Use them while you work, not after."
          accent="indigo"
          action={{ href: "/resources/", label: "All resources" }}
        />

        <ul className="mt-10 divide-y divide-line border-t border-line">
          {articles.map((article) => (
            <li key={article.slug}>
              <ArticleCard article={article} variant="list" showAuthor />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

import { BuildLogCard } from "@/components/cards/build-log-card";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Article } from "@/types/content";

/**
 * Build log spotlight — the project archive.
 *
 * Presented as records rather than teasers: project, objective, stack, tools,
 * status and time invested, all pulled from the `project` block that build-log
 * frontmatter is required to carry.
 */
export function BuildSpotlight({ articles }: { articles: Article[] }) {
  const withProject = articles.filter((article) => article.project);
  if (withProject.length === 0) return null;

  return (
    <section
      aria-labelledby="build-spotlight"
      className="border-b border-line py-14 sm:py-16 lg:py-20"
    >
      <Container>
        <SectionHeading
          kicker="AI agent build logs"
          title="The project archive"
          description="Each AI build log is a record of something actually built with coding agents: what it was for, the stack, and where it ended up."
          accent="teal"
          action={{ href: "/build-logs/", label: "All build logs" }}
        />

        <ul className="mt-10 grid gap-5 md:grid-cols-2">
          {withProject.map((article) => (
            <li key={article.slug} className="flex">
              <BuildLogCard article={article} className="w-full" />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

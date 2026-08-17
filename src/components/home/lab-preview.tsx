import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ToolList } from "@/components/tools/tool-list";
import { getLiveTools, getPlannedTools } from "@/lib/tools";

/**
 * Toolbox preview.
 *
 * Nothing is live yet, so this shows the roadmap and says so. Placeholder cards
 * dressed up as working tools would be the one thing in this section guaranteed
 * to cost the site credibility.
 */
export function LabPreview() {
  const live = getLiveTools();
  const planned = getPlannedTools().slice(0, 3);
  const showing = live.length > 0 ? live : planned;

  if (showing.length === 0) return null;

  return (
    <section
      aria-labelledby="lab-preview"
      className="border-b border-line py-14 sm:py-16 lg:py-20"
    >
      <Container>
        <SectionHeading
          kicker="The lab"
          title={live.length > 0 ? "Tools you can use" : "Coming to the lab"}
          description={
            live.length > 0
              ? "Small utilities built for developers working with AI."
              : "Nothing here is built yet. These are the three utilities on the list, described honestly as plans rather than products."
          }
          accent="olive"
          action={{ href: "/tools/", label: "The lab" }}
        />

        <div className="mt-10">
          <ToolList tools={showing} />
        </div>
      </Container>
    </section>
  );
}

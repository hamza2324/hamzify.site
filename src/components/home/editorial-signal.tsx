import { Container } from "@/components/ui/container";

/**
 * Why Hamzify exists, then the three standards a reader can hold it to.
 * The homepage supporting line lives in the hero; this block does not repeat it.
 */

const PRINCIPLES = [
  {
    title: "Stated method",
    body: "Every test says what was built, which version was used and how long it ran. You can judge how far the result transfers.",
  },
  {
    title: "Failures included",
    body: "Build logs record the decisions that went badly. A write-up where nothing went wrong is a write-up that left something out.",
  },
  {
    title: "Corrections in the open",
    body: "When something here turns out to be wrong, it gets fixed on the page with a note saying what changed.",
  },
] as const;

export function EditorialSignal() {
  return (
    <section
      aria-labelledby="editorial-principles"
      className="texture border-b border-line bg-surface-2"
    >
      <Container className="py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-start lg:gap-16">
          <div>
            <p className="label text-ink-3">Why this exists</p>
            <h2
              id="editorial-principles"
              className="mt-3 max-w-xl font-display text-display-s font-semibold leading-snug text-ink sm:text-[1.75rem]"
            >
              Marketing does not explain how these tools behave on real work.
            </h2>
            <p className="mt-4 max-w-xl text-[0.9875rem] leading-relaxed text-ink-2">
              Hamzify tests AI coding tools, documents builds, and records both
              what worked and what failed. The point is a practical answer, not
              a claim that every product is worth using.
            </p>
          </div>

          <ul className="grid gap-6 sm:grid-cols-3 lg:grid-cols-1">
            {PRINCIPLES.map((item) => (
              <li key={item.title}>
                <h3 className="label text-ink">{item.title}</h3>
                <p className="mt-1.5 text-[0.875rem] leading-relaxed text-ink-2">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

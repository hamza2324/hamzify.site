import { Container } from "@/components/ui/container";

/**
 * The trust bar, written as a statement rather than three icon cards.
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
      className="border-b border-line bg-surface-2"
    >
      <Container className="py-12 sm:py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <h2
            id="editorial-principles"
            className="font-display text-display-l font-semibold leading-[1.05] text-ink"
          >
            Real tools.
            <br />
            Real builds.
            <br />
            Real results.
          </h2>

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

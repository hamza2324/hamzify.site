import Link from "next/link";
import { Rss } from "lucide-react";

import { NewsletterForm } from "@/components/forms/newsletter-form";
import { AccentRule } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { newsletterEndpoint } from "@/lib/integrations";

/**
 * Newsletter block. Server component: it reads the endpoint from the
 * environment and hands it to the client form as a prop, which keeps the only
 * client JavaScript on the page to the form itself.
 */
export function NewsletterSection() {
  return (
    <section
      aria-labelledby="newsletter"
      className="border-b border-line bg-surface-2 py-14 sm:py-16 lg:py-20"
    >
      <Container>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-16">
          <div>
            <div className="flex items-center gap-3">
              <AccentRule />
              <span className="label text-ink-3">Newsletter</span>
            </div>

            <h2
              id="newsletter"
              className="mt-3 font-display text-display-s font-semibold text-ink"
            >
              One useful AI building workflow at a time
            </h2>

            <p className="mt-3 max-w-lg text-[0.9375rem] leading-relaxed text-ink-2">
              New experiments, build logs and workflows when they are worth
              sending — not on a schedule. If email is not your thing, the feed
              carries everything the newsletter does.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-4 text-[0.8125rem]">
              <a
                href="/rss.xml"
                className="inline-flex items-center gap-1.5 text-ink-2 transition-colors hover:text-accent"
              >
                <Rss className="size-3.5" aria-hidden="true" />
                RSS feed
              </a>
              <Link
                href="/privacy/"
                className="text-ink-3 underline decoration-line-2 underline-offset-2 transition-colors hover:text-ink-2 hover:decoration-accent"
              >
                How your email is handled
              </Link>
            </div>
          </div>

          <div className="rounded-md border border-line bg-surface p-5 sm:p-6">
            <NewsletterForm endpoint={newsletterEndpoint} />
          </div>
        </div>
      </Container>
    </section>
  );
}

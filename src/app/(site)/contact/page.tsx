import type { Metadata } from "next";
import Link from "next/link";
import { Github, Mail, MessageSquare } from "lucide-react";

import { ContactForm } from "@/components/forms/contact-form";
import { PageHeader } from "@/components/layout/page-header";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { contactEndpoint } from "@/lib/integrations";
import { createMetadata } from "@/lib/metadata";
import { breadcrumbNode, webPageNode } from "@/lib/schema";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = createMetadata({
  title: "Contact",
  description:
    "Get in touch about a correction, a question, or a tool worth testing. Email, GitHub Discussions, or the form on this page.",
  path: "/contact",
});

const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact/" },
];

const CHANNELS = [
  {
    icon: Mail,
    label: "Email",
    detail: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
    body: "Best for corrections and anything you would rather not discuss in public.",
  },
  {
    icon: MessageSquare,
    label: "GitHub Discussions",
    detail: "Public thread",
    href: siteConfig.discussions,
    body: "Best for questions about an article — the answer stays visible for whoever asks next.",
  },
  {
    icon: Github,
    label: "GitHub",
    detail: "Source and issues",
    href: siteConfig.social.github,
    body: "Best for problems with the site itself: a broken link, a rendering bug, a typo in a code sample.",
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd
        nodes={[
          webPageNode({
            title: "Contact",
            description:
              "Ways to reach Hamzify: email, GitHub Discussions, or the contact form.",
            path: "/contact",
          }),
          breadcrumbNode(CRUMBS),
        ]}
      />

      <PageHeader
        kicker="Contact"
        title="Get in touch"
        intro="Corrections get read first and published rather than quietly patched. Questions about an article are usually better in public, where the next person with the same question can find the answer."
        crumbs={CRUMBS}
      />

      <Container className="py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
          <div>
            <h2 className="font-display text-display-s font-semibold text-ink">
              Pick a channel
            </h2>

            <ul className="mt-6 flex flex-col divide-y divide-line border-y border-line">
              {CHANNELS.map(({ icon: Icon, label, detail, href, body }) => (
                <li key={label} className="group relative py-5">
                  <div className="flex items-start gap-3">
                    <Icon
                      className="mt-0.5 size-4 shrink-0 text-ink-3 transition-colors group-hover:text-accent"
                      aria-hidden="true"
                    />
                    <div>
                      <h3 className="text-[0.9375rem] font-semibold text-ink">
                        <a
                          href={href}
                          {...(href.startsWith("http")
                            ? { target: "_blank", rel: "noopener" }
                            : {})}
                          className="link-underline decoration-transparent after:absolute after:inset-0 after:content-[''] group-hover:decoration-current"
                        >
                          {label}
                        </a>
                      </h3>
                      <p className="mt-0.5 font-mono text-[0.75rem] text-ink-3">
                        {detail}
                      </p>
                      <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-2">
                        {body}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-[0.8125rem] leading-relaxed text-ink-3">
              Not a channel for: guest post pitches, link exchanges, or
              &ldquo;quick collaboration&rdquo; offers. Genuine sponsorship
              enquiries are welcome and will be disclosed on any resulting
              content — see the{" "}
              <Link
                href="/editorial-policy/"
                className="underline decoration-line-2 underline-offset-2 hover:decoration-accent"
              >
                editorial policy
              </Link>
              .
            </p>
          </div>

          <div>
            <h2 className="font-display text-display-s font-semibold text-ink">
              Or use the form
            </h2>
            <div className="mt-6">
              <ContactForm
                endpoint={contactEndpoint}
                email={siteConfig.email}
              />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

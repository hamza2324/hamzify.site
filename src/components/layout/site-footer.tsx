import Link from "next/link";
import { Github, Rss } from "lucide-react";

import { LogoMark } from "@/components/layout/logo";
import { Container } from "@/components/ui/container";
import { footerNav } from "@/lib/navigation";
import { siteConfig } from "@/lib/site-config";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117Z"
      />
    </svg>
  );
}

const socials = [
  { href: siteConfig.social.x, label: "Hamzify on X", Icon: XIcon },
  { href: siteConfig.social.github, label: "Hamzify on GitHub", Icon: Github },
  { href: "/rss.xml", label: "RSS feed", Icon: Rss },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <Container width="wide">
        <div className="grid gap-10 py-14 md:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)] lg:gap-16">
          <div>
            <div className="flex items-center gap-2 text-ink">
              <LogoMark />
              <span className="font-display text-[1.3rem] font-semibold tracking-[-0.02em]">
                Hamzify
              </span>
            </div>
            <p className="mt-4 max-w-sm text-[0.9375rem] leading-relaxed text-ink-2">
              {siteConfig.tagline} Hands-on reviews of AI coding tools, vibe
              coding experiments, AI agent build logs and development workflows.
            </p>

            <ul className="mt-6 flex items-center gap-2">
              {socials.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="inline-flex size-9 items-center justify-center rounded-sm border border-line text-ink-2 transition-colors hover:border-line-2 hover:text-ink"
                    {...(href.startsWith("http")
                      ? { rel: "me noopener", target: "_blank" }
                      : {})}
                  >
                    <Icon className="size-4" />
                    <span className="sr-only">{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footerNav.map((group) => (
              <div key={group.title}>
                <h2 className="label text-ink-3">{group.title}</h2>
                <ul className="mt-3 flex flex-col gap-2">
                  {group.items.map((item) => {
                    const external = item.href.startsWith("http");
                    return (
                      <li key={`${group.title}-${item.href}`}>
                        {external ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener"
                            className="text-[0.875rem] text-ink-2 transition-colors hover:text-ink"
                          >
                            {item.label}
                          </a>
                        ) : (
                          <Link
                            href={item.href}
                            className="text-[0.875rem] text-ink-2 transition-colors hover:text-ink"
                          >
                            {item.label}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3 border-t border-line py-6 text-[0.8125rem] text-ink-3 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. Written by a developer, edited by a
            human.
          </p>
          <p>
            Some links may be affiliate links.{" "}
            <Link
              href="/affiliate-disclosure/"
              className="link-underline text-ink-2"
            >
              Full disclosure
            </Link>
            .
          </p>
        </div>
      </Container>
    </footer>
  );
}

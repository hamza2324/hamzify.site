import Link from "next/link";

import { AuthorAvatar } from "@/components/article/byline";
import { cn } from "@/lib/utils";
import type { Author } from "@/types/content";

/**
 * Author box at the end of every article.
 *
 * This is the E-E-A-T surface: a real name, a stated role, what the person
 * actually works on, and links that can be checked. It is deliberately specific
 * rather than a generic "tech writer passionate about AI" line.
 */
export function AuthorBox({
  author,
  className,
}: {
  author: Author;
  className?: string;
}) {
  return (
    <section
      aria-labelledby={`author-${author.slug}`}
      className={cn(
        "rounded-md border border-line bg-surface p-5 sm:p-6",
        className,
      )}
    >
      <div className="flex flex-wrap items-start gap-4">
        <AuthorAvatar author={author} size={56} />

        <div className="min-w-0 flex-1">
          <span className="label text-ink-3">Written by</span>
          <h2
            id={`author-${author.slug}`}
            className="mt-1 font-display text-xl font-semibold text-ink"
          >
            <Link
              href={`/author/${author.slug}/`}
              rel="author"
              className="link-underline"
            >
              {author.name}
            </Link>
          </h2>
          <p className="text-[0.8125rem] text-ink-3">{author.role}</p>

          <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-2">
            {author.shortBio}
          </p>

          <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink-3">
            Corrections are published, not quietly patched. See the{" "}
            <Link
              href="/editorial-policy/"
              className="underline decoration-line-2 underline-offset-2 hover:decoration-accent"
            >
              editorial policy
            </Link>{" "}
            and{" "}
            <Link
              href="/corrections-policy/"
              className="underline decoration-line-2 underline-offset-2 hover:decoration-accent"
            >
              corrections policy
            </Link>
            .
          </p>

          <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.8125rem]">
            {author.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="me noopener"
                  className="text-ink-2 underline decoration-line-2 underline-offset-2 transition-colors hover:decoration-accent hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

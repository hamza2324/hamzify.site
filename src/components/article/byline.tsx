import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import type { Author } from "@/types/content";

/**
 * Author avatar. Falls back to initials rather than a generic silhouette, so a
 * missing photo still looks intentional.
 */
export function AuthorAvatar({
  author,
  size = 32,
  className,
}: {
  author: Author;
  size?: number;
  className?: string;
}) {
  if (author.avatar) {
    return (
      <Image
        src={author.avatar}
        alt={`${author.name}, ${author.role}`}
        width={size}
        height={size}
        className={cn(
          "shrink-0 rounded-full border border-line object-cover",
          className,
        )}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border border-accent-line bg-accent-soft font-mono font-medium uppercase text-accent",
        className,
      )}
    >
      {author.initials}
    </span>
  );
}

type BylineProps = {
  author: Author;
  publishedAt: string;
  updatedAt?: string;
  lastReviewedAt?: string;
  readingTime: string;
  size?: "sm" | "md";
  className?: string;
};

export function Byline({
  author,
  publishedAt,
  updatedAt,
  lastReviewedAt,
  readingTime,
  size = "md",
  className,
}: BylineProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-2",
        size === "sm" ? "text-[0.8125rem]" : "text-[0.875rem]",
        className,
      )}
    >
      <AuthorAvatar author={author} size={size === "sm" ? 26 : 34} />

      <span className="text-ink-2">
        By{" "}
        <Link
          href={`/author/${author.slug}/`}
          rel="author"
          className="font-medium text-ink underline decoration-line-2 underline-offset-2 transition-colors hover:decoration-accent"
        >
          {author.name}
        </Link>
      </span>

      <span aria-hidden="true" className="text-line-2">
        /
      </span>

      <PublicationDates
        publishedAt={publishedAt}
        updatedAt={updatedAt}
        lastReviewedAt={lastReviewedAt}
      />

      <span aria-hidden="true" className="text-line-2">
        /
      </span>

      <span className="text-ink-3">{readingTime}</span>
    </div>
  );
}

/**
 * Shows the publication date, and the update date when it differs.
 *
 * Surfacing "Updated" is part of being trustworthy about evergreen tool
 * content: a review of a tool that ships weekly is only useful if the reader
 * knows when it was last checked.
 */
export function PublicationDates({
  publishedAt,
  updatedAt,
  lastReviewedAt,
}: {
  publishedAt: string;
  updatedAt?: string;
  lastReviewedAt?: string;
}) {
  const showUpdated = Boolean(updatedAt) && updatedAt !== publishedAt;
  const reviewed =
    lastReviewedAt && lastReviewedAt !== publishedAt && lastReviewedAt !== updatedAt
      ? lastReviewedAt
      : undefined;

  return (
    <span className="text-ink-3">
      <time dateTime={publishedAt}>{formatShort(publishedAt)}</time>
      {showUpdated ? (
        <>
          {" · Updated "}
          <time dateTime={updatedAt}>{formatShort(updatedAt!)}</time>
        </>
      ) : null}
      {reviewed ? (
        <>
          {" · Last reviewed "}
          <time dateTime={reviewed}>{formatShort(reviewed)}</time>
        </>
      ) : null}
    </span>
  );
}

function formatShort(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

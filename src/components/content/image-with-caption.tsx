import Image from "next/image";

import { cn } from "@/lib/utils";

type ImageWithCaptionProps = {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  /** `wide` breaks out of the prose measure on large screens. */
  size?: "prose" | "wide";
  /** Set for the first image in a viewport-filling position. */
  priority?: boolean;
};

/**
 * Article imagery with a real caption element.
 *
 * `alt` is required by the type: a screenshot with no alt text is a bug, not a
 * style choice. Captions carry the context that alt text should not (source,
 * what to look at), so both exist rather than one standing in for the other.
 */
export function ImageWithCaption({
  src,
  alt,
  caption,
  width = 1600,
  height = 900,
  size = "prose",
  priority = false,
}: ImageWithCaptionProps) {
  return (
    <figure
      className={cn(
        "not-prose my-8",
        size === "wide" && "lg:-mx-16 xl:-mx-24",
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        sizes={
          size === "wide"
            ? "(min-width: 1024px) 60rem, 100vw"
            : "(min-width: 768px) 46rem, 100vw"
        }
        className="w-full rounded-md border border-line bg-surface-2"
      />
      {caption ? (
        <figcaption className="mt-2.5 text-[0.8125rem] leading-relaxed text-ink-3">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

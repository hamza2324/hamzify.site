import Link from "next/link";
import Image from "next/image";

import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

/**
 * The Hamzify lockup: the supplied square mark plus a typographic wordmark.
 *
 * The raster mark is the actual brand file (glitch frame, H→chevron, cyan node).
 * It sits in a fixed square so light and dark headers both get a defined stamp
 * rather than a floating photograph.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex size-9 shrink-0 overflow-hidden rounded-sm border border-line bg-[#0b0b0d]",
        className,
      )}
    >
      {/* The mark is decorative next to the visible wordmark; the link label
          below is what assistive tech announces. */}
      <Image
        src={siteConfig.brand.mark}
        alt=""
        width={36}
        height={36}
        className="size-full object-cover"
      />
    </span>
  );
}

export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-2.5 text-ink transition-opacity hover:opacity-80",
        className,
      )}
    >
      <LogoMark />
      {showWordmark ? (
        <span className="hidden font-display text-[1.3rem] font-semibold tracking-[-0.02em] min-[360px]:inline">
          Hamzify
        </span>
      ) : null}
      <span className="sr-only">Hamzify home</span>
    </Link>
  );
}

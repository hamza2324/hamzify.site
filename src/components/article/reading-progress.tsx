"use client";

import { useEffect, useState } from "react";

/**
 * A one-pixel reading progress rule under the header.
 *
 * Purely decorative, so it is hidden from assistive technology. Scroll reads are
 * batched into a rAF callback and the value is written to a CSS custom property,
 * which keeps the work off the React render path.
 */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? window.scrollY / scrollable : 0);
    };

    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="sticky top-[var(--header-h)] z-[var(--z-sticky)] h-px w-full bg-transparent"
    >
      <div
        className="h-px origin-left bg-accent"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}

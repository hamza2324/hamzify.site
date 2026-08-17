"use client";

import { Check, Link2, Share2 } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";

import { absoluteUrl } from "@/lib/site-config";

/**
 * Web Share API support is a browser fact, not React state. Reading it through a
 * store with a no-op subscription keeps the server render (`false`) and the
 * client render in agreement without an effect that immediately re-renders.
 */
const noSubscribe = () => () => {};
const hasShare = () => "share" in navigator;
const noShareOnServer = () => false;

/**
 * Share controls with no third-party scripts.
 *
 * Social share buttons usually mean loading a tracker per network. This uses the
 * native Web Share API where it exists, an X intent link (a plain anchor), and a
 * copy-link fallback that always works.
 */
export function ShareControls({
  title,
  path,
}: {
  title: string;
  path: string;
}) {
  const url = absoluteUrl(path);
  const [copied, setCopied] = useState(false);
  const canShare = useSyncExternalStore(
    noSubscribe,
    hasShare,
    noShareOnServer,
  );

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Nothing to report: the visible URL can still be copied manually.
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="label text-ink-3">Share</span>

      <a
        href={`https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener"
        className="inline-flex items-center gap-1.5 rounded-sm border border-line px-2.5 py-1.5 text-[0.8125rem] text-ink-2 transition-colors hover:border-line-2 hover:text-ink"
      >
        Post on X
      </a>

      <button
        type="button"
        onClick={copyLink}
        className="inline-flex items-center gap-1.5 rounded-sm border border-line px-2.5 py-1.5 text-[0.8125rem] text-ink-2 transition-colors hover:border-line-2 hover:text-ink"
      >
        {copied ? (
          <Check className="size-3.5 text-teal" aria-hidden="true" />
        ) : (
          <Link2 className="size-3.5" aria-hidden="true" />
        )}
        {copied ? "Link copied" : "Copy link"}
      </button>

      {canShare ? (
        <button
          type="button"
          onClick={() => {
            void navigator.share({ title, url }).catch(() => {
              // The user dismissed the share sheet.
            });
          }}
          className="inline-flex items-center gap-1.5 rounded-sm border border-line px-2.5 py-1.5 text-[0.8125rem] text-ink-2 transition-colors hover:border-line-2 hover:text-ink"
        >
          <Share2 className="size-3.5" aria-hidden="true" />
          Share
        </button>
      ) : null}
    </div>
  );
}

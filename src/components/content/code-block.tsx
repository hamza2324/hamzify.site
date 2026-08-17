"use client";

import { Check, Copy } from "lucide-react";
import {
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  useEffect,
} from "react";

/**
 * Wraps the `<pre>` produced by rehype-pretty-code and adds a copy button.
 *
 * Highlighting itself happens at build time, so this client component exists
 * only for the clipboard interaction. The text is read from the rendered DOM
 * rather than passed in as a second copy of the source, which keeps the payload
 * small and guarantees that what you copy is what you see.
 */
export function CodeBlock(props: ComponentPropsWithoutRef<"pre">) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copy() {
    const text = preRef.current?.textContent ?? "";
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      // Clipboard permission denied: leave the button state unchanged rather
      // than claiming success.
    }
  }

  return (
    <div className="group relative">
      <pre {...props} ref={preRef} tabIndex={0} />
      <button
        type="button"
        onClick={copy}
        className="absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-sm border border-line bg-surface text-ink-3 opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
      >
        {copied ? (
          <Check className="size-3.5 text-teal" aria-hidden="true" />
        ) : (
          <Copy className="size-3.5" aria-hidden="true" />
        )}
        <span className="sr-only">
          {copied ? "Code copied" : "Copy code to clipboard"}
        </span>
      </button>
    </div>
  );
}

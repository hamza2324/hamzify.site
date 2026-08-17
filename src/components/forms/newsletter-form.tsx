"use client";

import { useId, useState } from "react";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { z } from "zod";

import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

/**
 * Newsletter signup.
 *
 * The endpoint is supplied through `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` and passed
 * in as a prop by the server component that renders this, so the form never
 * reads `process.env` on the client and no provider is hardcoded.
 *
 * When no endpoint is configured the form is disabled and says so. A live-looking
 * input that silently discards addresses would be worse than an honest one.
 */

const emailSchema = z
  .string()
  .trim()
  .min(1, "Enter an email address.")
  .email("That does not look like an email address.");

type Status = "idle" | "submitting" | "done" | "error";

export function NewsletterForm({
  endpoint,
  className,
}: {
  endpoint: string | null;
  className?: string;
}) {
  const inputId = useId();
  const messageId = `${inputId}-message`;

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const configured = Boolean(endpoint);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!endpoint || status === "submitting") return;

    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setStatus("error");
      setMessage(parsed.error.issues[0].message);
      return;
    }

    setStatus("submitting");
    setMessage(null);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: parsed.data,
          _subject: "Hamzify newsletter signup",
        }),
      });

      if (!response.ok) throw new Error(`Request failed: ${response.status}`);

      setStatus("done");
      setMessage("You are on the list.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage(
        `That did not go through. Try again, or email ${siteConfig.email}.`,
      );
    }
  }

  if (status === "done") {
    return (
      <p
        className={cn(
          "flex items-center gap-2 text-[0.9375rem] text-ink",
          className,
        )}
      >
        <Check className="size-4 shrink-0 text-teal" aria-hidden="true" />
        {message}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("w-full", className)} noValidate>
      <label htmlFor={inputId} className="label block text-ink-3">
        Email address
      </label>

      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <input
          id={inputId}
          type="email"
          name="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status === "error") {
              setStatus("idle");
              setMessage(null);
            }
          }}
          autoComplete="email"
          placeholder="you@example.com"
          disabled={!configured || status === "submitting"}
          aria-invalid={status === "error" || undefined}
          aria-describedby={message ? messageId : undefined}
          className="min-w-0 flex-1 rounded-sm border border-line-2 bg-surface px-3 py-2.5 text-[0.9375rem] text-ink placeholder:text-ink-3 disabled:cursor-not-allowed disabled:opacity-60"
        />

        <button
          type="submit"
          disabled={!configured || status === "submitting"}
          className="group inline-flex shrink-0 items-center justify-center gap-1.5 rounded-sm bg-brand px-4 py-2.5 text-[0.9375rem] font-medium text-on-accent transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-brand"
        >
          {status === "submitting" ? (
            <>
              <LoaderCircle
                className="size-4 animate-spin"
                aria-hidden="true"
              />
              Subscribing
            </>
          ) : (
            <>
              Subscribe
              <ArrowRight
                className="size-4 transition-transform duration-200 ease-brand group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </>
          )}
        </button>
      </div>

      {message ? (
        <p
          id={messageId}
          role="alert"
          className="mt-2 text-[0.8125rem] text-ember"
        >
          {message}
        </p>
      ) : null}

      {!configured ? (
        <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-ink-3">
          Signups are not connected yet — no provider is configured for this
          deployment, so the form is disabled rather than quietly dropping your
          address. The{" "}
          <a
            href="/rss.xml"
            className="underline decoration-line-2 underline-offset-2 hover:decoration-accent"
          >
            RSS feed
          </a>{" "}
          works today.
        </p>
      ) : (
        <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-ink-3">
          One email when something worth reading goes up. No tracking pixels, no
          selling your address, unsubscribe in one click.
        </p>
      )}
    </form>
  );
}

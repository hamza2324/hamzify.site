"use client";

import { useId, useState } from "react";
import { Check, LoaderCircle, Send } from "lucide-react";
import { z } from "zod";

import { cn } from "@/lib/utils";

/**
 * Contact form.
 *
 * The endpoint comes in as a prop from a server component, so no provider or key
 * is referenced here. There is no pretend backend: with nothing configured the
 * fields are disabled and the page points at the email address instead, which is
 * the honest behaviour for a static export.
 *
 * Validation is Zod so the rules are declared once and the messages are specific.
 */

const contactSchema = z.object({
  name: z.string().trim().min(2, "Tell me what to call you."),
  email: z.string().trim().email("A working email address, so I can reply."),
  topic: z.enum(["correction", "question", "tool", "other"]),
  message: z
    .string()
    .trim()
    .min(20, "A little more detail — 20 characters minimum.")
    .max(4000, "That is over the 4,000 character limit."),
});

type Fields = z.infer<typeof contactSchema>;
type FieldName = keyof Fields;
type Status = "idle" | "submitting" | "done" | "error";

const TOPICS: Array<{ value: Fields["topic"]; label: string }> = [
  { value: "correction", label: "A correction" },
  { value: "question", label: "A question" },
  { value: "tool", label: "A tool suggestion" },
  { value: "other", label: "Something else" },
];

export function ContactForm({
  endpoint,
  email,
  className,
}: {
  endpoint: string | null;
  email: string;
  className?: string;
}) {
  const baseId = useId();
  const [values, setValues] = useState<Fields>({
    name: "",
    email: "",
    topic: "question",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const configured = Boolean(endpoint);
  const disabled = !configured || status === "submitting";

  function update<K extends FieldName>(field: K, value: Fields[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!endpoint || status === "submitting") return;

    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const next: Partial<Record<FieldName, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as FieldName;
        next[field] ??= issue.message;
      }
      setErrors(next);
      setFormError("Check the highlighted fields.");
      return;
    }

    setStatus("submitting");
    setFormError(null);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(parsed.data),
      });

      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      setStatus("done");
    } catch {
      setStatus("error");
      setFormError(
        `That did not send. Email ${email} instead and it will definitely reach me.`,
      );
    }
  }

  if (status === "done") {
    return (
      <div
        className={cn(
          "rounded-md border border-line bg-surface p-5 sm:p-6",
          className,
        )}
      >
        <p className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
          <Check className="size-4 shrink-0 text-teal" aria-hidden="true" />
          Message sent
        </p>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-2">
          Thanks — I read everything and reply to most things within a few days.
          Corrections get looked at first.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={cn(
        "rounded-md border border-line bg-surface p-5 sm:p-6",
        className,
      )}
    >
      {!configured ? (
        <p className="mb-5 rounded-sm border border-dashed border-amber/60 bg-amber-soft px-3.5 py-3 text-[0.8125rem] leading-relaxed text-ink-2">
          <span className="font-semibold text-amber">
            Form delivery is not connected.
          </span>{" "}
          This is a static site with no server, and no form provider is
          configured for this deployment — so the fields below are disabled
          rather than silently discarding your message. Email{" "}
          <a
            href={`mailto:${email}`}
            className="underline decoration-line-2 underline-offset-2 hover:decoration-accent"
          >
            {email}
          </a>{" "}
          and it will reach me.
        </p>
      ) : null}

      <div className="flex flex-col gap-5">
        <Field
          id={`${baseId}-name`}
          label="Name"
          error={errors.name}
          disabled={disabled}
        >
          {(props) => (
            <input
              {...props}
              type="text"
              value={values.name}
              onChange={(event) => update("name", event.target.value)}
              autoComplete="name"
            />
          )}
        </Field>

        <Field
          id={`${baseId}-email`}
          label="Email"
          hint="Only used to reply. Never added to a list."
          error={errors.email}
          disabled={disabled}
        >
          {(props) => (
            <input
              {...props}
              type="email"
              value={values.email}
              onChange={(event) => update("email", event.target.value)}
              autoComplete="email"
            />
          )}
        </Field>

        <Field
          id={`${baseId}-topic`}
          label="What is this about"
          error={errors.topic}
          disabled={disabled}
        >
          {(props) => (
            <select
              {...props}
              value={values.topic}
              onChange={(event) =>
                update("topic", event.target.value as Fields["topic"])
              }
            >
              {TOPICS.map((topic) => (
                <option key={topic.value} value={topic.value}>
                  {topic.label}
                </option>
              ))}
            </select>
          )}
        </Field>

        <Field
          id={`${baseId}-message`}
          label="Message"
          hint="For a correction, a link to the article and the specific claim helps a lot."
          error={errors.message}
          disabled={disabled}
        >
          {(props) => (
            <textarea
              {...props}
              rows={6}
              value={values.message}
              onChange={(event) => update("message", event.target.value)}
              className={cn(props.className, "resize-y")}
            />
          )}
        </Field>
      </div>

      {formError ? (
        <p role="alert" className="mt-4 text-[0.8125rem] text-ember">
          {formError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={disabled}
        className="group mt-6 inline-flex items-center justify-center gap-1.5 rounded-sm bg-brand px-4 py-2.5 text-[0.9375rem] font-medium text-on-accent transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-brand"
      >
        {status === "submitting" ? (
          <>
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            Sending
          </>
        ) : (
          <>
            Send message
            <Send className="size-4" aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}

/**
 * Label, control, hint and error in one place, wired together with `htmlFor`
 * and `aria-describedby` so no control can end up unlabelled.
 */
function Field({
  id,
  label,
  hint,
  error,
  disabled,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  disabled: boolean;
  children: (props: {
    id: string;
    disabled: boolean;
    className: string;
    "aria-invalid"?: true;
    "aria-describedby"?: string;
  }) => React.ReactNode;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      <label htmlFor={id} className="label block text-ink-3">
        {label}
      </label>

      <div className="mt-2">
        {children({
          id,
          disabled,
          "aria-invalid": error ? true : undefined,
          "aria-describedby": describedBy,
          className: cn(
            "w-full rounded-sm border bg-paper px-3 py-2.5 text-[0.9375rem] text-ink placeholder:text-ink-3 disabled:cursor-not-allowed disabled:opacity-60",
            error ? "border-ember" : "border-line-2",
          ),
        })}
      </div>

      {error ? (
        <p id={errorId} className="mt-1.5 text-[0.8125rem] text-ember">
          {error}
        </p>
      ) : null}
      {hint ? (
        <p id={hintId} className="mt-1.5 text-[0.8125rem] text-ink-3">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Third-party integration points.
 *
 * Analytics stay optional and emit no JavaScript unless configured. Newsletter
 * and contact post to Formspree (`FORMSPREE_ENDPOINT`) so signups work on the
 * static GitHub Pages deploy without extra env vars. Override with
 * `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` / `NEXT_PUBLIC_CONTACT_ENDPOINT` if needed.
 */

export type AnalyticsProvider = "plausible" | "umami" | "ga";

export type AnalyticsConfig =
  | { provider: "plausible"; domain: string; scriptUrl: string }
  | { provider: "umami"; websiteId: string; scriptUrl: string }
  | { provider: "ga"; measurementId: string };

function readEnv(value: string | undefined): string | null {
  const trimmed = (value ?? "").trim();
  return trimmed.length > 0 ? trimmed : null;
}

/** Returns `null` when analytics are not configured, which is the default. */
export function getAnalyticsConfig(): AnalyticsConfig | null {
  const provider = readEnv(process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER);
  const domain = readEnv(process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN);
  const scriptUrl = readEnv(process.env.NEXT_PUBLIC_ANALYTICS_SCRIPT_URL);
  const measurementId = readEnv(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);

  switch (provider) {
    case "plausible":
      if (!domain) return null;
      return {
        provider: "plausible",
        domain,
        scriptUrl: scriptUrl ?? "https://plausible.io/js/script.js",
      };
    case "umami":
      if (!domain || !scriptUrl) return null;
      return { provider: "umami", websiteId: domain, scriptUrl };
    case "ga":
      if (!measurementId) return null;
      return { provider: "ga", measurementId };
    default:
      return null;
  }
}

export const FORMSPREE_ENDPOINT = "https://formspree.io/f/xzepjobl";

export const newsletterEndpoint =
  readEnv(process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT) ?? FORMSPREE_ENDPOINT;

export const contactEndpoint =
  readEnv(process.env.NEXT_PUBLIC_CONTACT_ENDPOINT) ?? FORMSPREE_ENDPOINT;

/**
 * Builds an outbound affiliate/partner URL.
 *
 * Tracking parameters are appended rather than baked into content, so a partner
 * programme can change without editing articles. Callers must render the link
 * with `rel="sponsored nofollow noopener"` — see `<AffiliateLink />`.
 */
export function buildAffiliateUrl(
  href: string,
  options: { tag?: string; campaign?: string } = {},
): string {
  try {
    const url = new URL(href);
    if (options.tag) url.searchParams.set("ref", options.tag);
    if (options.campaign) url.searchParams.set("utm_campaign", options.campaign);
    url.searchParams.set("utm_source", "hamzify");
    return url.toString();
  } catch {
    return href;
  }
}

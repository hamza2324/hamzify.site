import Script from "next/script";

import { getAnalyticsConfig } from "@/lib/integrations";

/**
 * Renders nothing at all unless an analytics provider is configured through
 * environment variables, so the default build ships no tracking scripts and
 * no consent obligations.
 */
export function Analytics() {
  const config = getAnalyticsConfig();
  if (!config) return null;

  if (config.provider === "plausible") {
    return (
      <Script
        defer
        data-domain={config.domain}
        src={config.scriptUrl}
        strategy="afterInteractive"
      />
    );
  }

  if (config.provider === "umami") {
    return (
      <Script
        defer
        data-website-id={config.websiteId}
        src={config.scriptUrl}
        strategy="afterInteractive"
      />
    );
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${config.measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${config.measurementId}');`}
      </Script>
    </>
  );
}

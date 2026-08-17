import type { Metadata, Viewport } from "next";

import "@/app/globals.css";

import { Analytics } from "@/components/layout/analytics";
import { ThemeScript } from "@/components/layout/theme-script";
import { SearchCommand } from "@/components/search/search-command";
import { fontVariables } from "@/lib/fonts";
import { rootMetadata } from "@/lib/metadata";
import { buildSearchIndex } from "@/lib/search-index";

export const metadata: Metadata = rootMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Matches --paper in each theme so the browser chrome blends with the page.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f5f0" },
    { media: "(prefers-color-scheme: dark)", color: "#121118" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <ThemeScript />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-dvh bg-paper text-ink antialiased">
        {children}
        <SearchCommand documents={buildSearchIndex()} />
        <Analytics />
      </body>
    </html>
  );
}

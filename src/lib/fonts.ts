import { Fraunces, JetBrains_Mono, Source_Sans_3 } from "next/font/google";

/**
 * Three families, all variable, all self-hosted by `next/font` at build time.
 *
 * - Fraunces carries display and article headlines. It has enough personality
 *   to look like a publication rather than a dashboard.
 * - Source Sans 3 handles body copy and UI. Humanist, quiet, built to be read
 *   at length.
 * - JetBrains Mono covers code and metadata labels.
 *
 * `display: "swap"` keeps text visible during font load, and `preload` is left
 * on for the two families that appear above the fold on every page.
 */

export const fontDisplay = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  // Slightly softer terminals than the default; still restrained.
  axes: ["SOFT"],
});

export const fontSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
});

export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
  preload: false,
});

export const fontVariables = [
  fontDisplay.variable,
  fontSans.variable,
  fontMono.variable,
].join(" ");

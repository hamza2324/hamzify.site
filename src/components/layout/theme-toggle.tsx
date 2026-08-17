"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

import { THEME_STORAGE_KEY } from "@/components/layout/theme-script";
import { cn } from "@/lib/utils";

const THEMES = ["system", "light", "dark"] as const;
type Theme = (typeof THEMES)[number];

const ICONS = { system: Monitor, light: Sun, dark: Moon } as const;
const LABELS = {
  system: "Match system",
  light: "Light",
  dark: "Dark",
} as const;

/** Lets a change in one toggle reach any other mounted toggle immediately. */
const THEME_EVENT = "hamzify:themechange";

/**
 * The stored preference is external state, not React state, so it is read
 * through `useSyncExternalStore`. That keeps the server render honest — it
 * returns `null`, meaning "not known yet" — instead of guessing a value and
 * correcting it after hydration.
 */
function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(THEME_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(THEME_EVENT, onStoreChange);
  };
}

function getSnapshot(): Theme {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : "system";
  } catch {
    return "system";
  }
}

function getServerSnapshot(): null {
  return null;
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", theme);
  }
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Private browsing or blocked storage: the theme still applies for this
    // page view, it just will not persist.
  }
  window.dispatchEvent(new Event(THEME_EVENT));
}

/**
 * Cycles system → light → dark. A three-state cycle in one button keeps the
 * header compact, and the current state is always announced.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const stored = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const theme = stored ?? "system";
  const Icon = ICONS[theme];
  const next = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];

  return (
    <button
      type="button"
      onClick={() => applyTheme(next)}
      aria-label={`Colour theme: ${LABELS[theme].toLowerCase()}. Switch to ${LABELS[next].toLowerCase()}.`}
      title={`Theme: ${LABELS[theme]}`}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-sm border border-line text-ink-2 transition-colors hover:border-line-2 hover:text-ink",
        className,
      )}
    >
      {/* Before the preference is known the icon is hidden rather than rendered
          wrong and then swapped. */}
      <Icon
        className={cn("size-4 transition-opacity", stored === null && "opacity-0")}
        aria-hidden="true"
      />
    </button>
  );
}

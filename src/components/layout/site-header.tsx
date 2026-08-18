"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

import { Container } from "@/components/ui/container";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { openSearch } from "@/components/search/search-command";
import { aiCodingAliases, isActivePath, mainNav, moreNav } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuRoute, setMenuRoute] = useState(pathname);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const shortcut = useSyncExternalStore(
    () => () => undefined,
    () => (/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘K" : "Ctrl K"),
    () => "⌘K",
  );

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    toggleRef.current?.focus();
  }, []);

  if (pathname !== menuRoute) {
    setMenuRoute(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [menuOpen, closeMenu]);

  return (
    <header
      className={cn(
        "sticky top-0 z-[var(--z-header)] border-b bg-paper/90 backdrop-blur-md transition-colors duration-200",
        scrolled ? "border-line" : "border-transparent",
      )}
    >
      <Container width="wide">
        <div className="flex h-[var(--header-h)] items-center justify-between gap-2 sm:gap-4">
          <Logo />

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-0.5">
              {mainNav.map((item) => {
                const aliases =
                  item.label === "AI Coding" ? aiCodingAliases : [];
                const active = isActivePath(pathname, item.href, aliases);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative inline-flex min-h-9 items-center rounded-sm px-2.5 py-1.5 text-[0.875rem] transition-colors",
                        active
                          ? "font-medium text-violet"
                          : "text-ink-2 hover:text-ink",
                      )}
                    >
                      {item.label}
                      {active ? (
                        <span
                          aria-hidden="true"
                          className="absolute inset-x-2.5 -bottom-[0.3rem] h-[2px] bg-violet"
                        />
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => openSearch()}
              className="inline-flex size-11 items-center justify-center rounded-sm border border-line px-0 text-ink-2 transition-colors hover:border-line-2 hover:text-ink sm:h-11 sm:w-auto sm:gap-2 sm:px-3"
            >
              <Search className="size-4" aria-hidden="true" />
              <span className="sr-only">Search Hamzify</span>
              <kbd className="hidden font-mono text-[0.6875rem] tracking-wide text-ink-3 sm:inline">
                {shortcut}
              </kbd>
            </button>

            <ThemeToggle className="size-11" />

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              className="inline-flex size-11 items-center justify-center rounded-sm border border-line text-ink-2 transition-colors hover:text-ink lg:hidden"
            >
              {menuOpen ? (
                <X className="size-4" aria-hidden="true" />
              ) : (
                <Menu className="size-4" aria-hidden="true" />
              )}
              <span className="sr-only">
                {menuOpen ? "Close menu" : "Open menu"}
              </span>
            </button>
          </div>
        </div>
      </Container>

      <div
        id="mobile-nav"
        hidden={!menuOpen}
        className="border-t border-line bg-paper lg:hidden"
      >
        <Container width="wide">
          <nav aria-label="Site" className="max-h-[min(32rem,calc(100dvh-var(--header-h)))] overflow-y-auto overflow-x-hidden py-5">
            <p className="label text-ink-3">Browse</p>
            <ul className="mt-1 flex flex-col">
              {mainNav.map((item) => {
                const aliases =
                  item.label === "AI Coding" ? aiCodingAliases : [];
                const active = isActivePath(pathname, item.href, aliases);
                return (
                  <li key={item.href} className="border-b border-line/70">
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className="flex min-h-11 flex-col justify-center gap-0.5 py-3"
                    >
                      <span
                        className={cn(
                          "text-[1.0625rem]",
                          active ? "font-medium text-violet" : "text-ink",
                        )}
                      >
                        {item.label}
                      </span>
                      {item.hint ? (
                        <span className="text-[0.8125rem] leading-snug text-ink-3">
                          {item.hint}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <p className="label mt-6 text-ink-3">More</p>
            <ul className="mt-2 grid grid-cols-2 gap-2">
              {moreNav.map((item) => {
                const isSubscribe = item.href.startsWith("/#");
                const active = isActivePath(pathname, item.href);
                return (
                  <li key={item.href} className="min-w-0">
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex min-h-11 items-center rounded-sm border px-3 py-2.5 text-[0.9375rem]",
                        isSubscribe
                          ? "border-brand bg-brand font-medium text-on-accent"
                          : active
                            ? "border-violet-line bg-violet-soft font-medium text-violet"
                            : "border-line text-ink-2",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </Container>
      </div>
    </header>
  );
}

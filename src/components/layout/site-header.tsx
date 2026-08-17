"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

import { Container } from "@/components/ui/container";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { openSearch } from "@/components/search/search-command";
import { isActivePath, mainNav } from "@/lib/navigation";
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
                const active = isActivePath(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative inline-flex items-center rounded-sm px-2.5 py-1.5 text-[0.875rem] transition-colors",
                        active
                          ? "font-medium text-ink"
                          : "text-ink-2 hover:text-ink",
                      )}
                    >
                      {item.label}
                      {active ? (
                        <span
                          aria-hidden="true"
                          className="absolute inset-x-2.5 -bottom-[0.3rem] h-px bg-accent"
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
              className="inline-flex size-9 items-center justify-center rounded-sm border border-line px-0 text-ink-2 transition-colors hover:border-line-2 hover:text-ink sm:h-9 sm:w-auto sm:gap-2 sm:px-2.5"
            >
              <Search className="size-4" aria-hidden="true" />
              <span className="sr-only">Search Hamzify</span>
              <kbd className="hidden font-mono text-[0.6875rem] tracking-wide text-ink-3 sm:inline">
                {shortcut}
              </kbd>
            </button>

            <ThemeToggle />

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              className="inline-flex size-9 items-center justify-center rounded-sm border border-line text-ink-2 transition-colors hover:text-ink lg:hidden"
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
          <nav aria-label="Site" className="py-4">
            <ul className="flex flex-col">
              {mainNav.map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <li key={item.href} className="border-b border-line/70">
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className="flex flex-col gap-0.5 py-3"
                    >
                      <span
                        className={cn(
                          "text-base",
                          active ? "font-medium text-accent" : "text-ink",
                        )}
                      >
                        {item.label}
                      </span>
                      {item.hint ? (
                        <span className="text-[0.8125rem] text-ink-3">
                          {item.hint}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href="/about/"
                className="rounded-sm border border-line px-3 py-2 text-sm text-ink-2"
              >
                About
              </Link>
              <Link
                href="/tools/"
                className="rounded-sm border border-line px-3 py-2 text-sm text-ink-2"
              >
                The lab
              </Link>
              <Link
                href="/#newsletter"
                className="rounded-sm border border-line-strong bg-ink px-3 py-2 text-sm font-medium text-ink-inverse"
              >
                Subscribe
              </Link>
            </div>
          </nav>
        </Container>
      </div>
    </header>
  );
}

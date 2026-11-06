"use client";

import React, { useCallback, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "./container";
import { MobileNav, type NavItem } from "./mobile-nav";
import { cn } from "@/lib/utils";

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/#courses" },
  { label: "Safety Articles", href: "/articles" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

// Approximate vertical footprint of the sticky header band (pill + top gap).
const HEADER_BAND_HEIGHT = 76;

export function SiteHeader() {
  const pathname = usePathname();

  const subscribe = useCallback((onChange: () => void) => {
    window.addEventListener("scroll", onChange, { passive: true });
    window.addEventListener("resize", onChange);
    return () => {
      window.removeEventListener("scroll", onChange);
      window.removeEventListener("resize", onChange);
    };
  }, []);

  // True while the dark hero photography sits behind the transparent pill. The hero is pulled up
  // under the header band on the home page, so this holds at rest and until the hero scrolls past.
  const overHero = useSyncExternalStore(
    subscribe,
    () => {
      if (pathname !== "/") return false;
      const hero = document.getElementById("hero-band");
      if (!hero) return false;
      return window.scrollY < hero.offsetTop + hero.offsetHeight - HEADER_BAND_HEIGHT;
    },
    () => false,
  );

  return (
    <header className="sticky top-0 z-40 bg-transparent">
      <Container className="pt-3 pb-2">
        {/* Floating pill navigation surface: fully transparent fill so the hero photography shows through the glass */}
        <div className="flex min-h-[56px] items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-transparent px-3 py-2 shadow-lg backdrop-blur-md md:min-h-[60px] md:rounded-full md:px-5">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="group flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600 focus-visible:ring-offset-2"
            >
              {/* Red & White Stylized Aquatic Mark */}
              <span
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-red-600 shadow-xs transition-transform group-hover:scale-105"
                aria-hidden="true"
              >
                <svg
                  className="h-5 w-5 text-neutral-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {/* Buoyant ring / wave motif */}
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v10" />
                  <path d="M8 12h8" />
                </svg>
              </span>
              <div className="flex flex-col">
                <span
                  className={cn(
                    "text-lg font-extrabold tracking-tight transition-colors",
                    overHero
                      ? "text-neutral-white"
                      : "text-neutral-900 group-hover:text-brand-red-600",
                  )}
                >
                  SwimNigeria
                </span>
                <span
                  className={cn(
                    "text-[11px] font-medium tracking-wide -mt-1 hidden sm:inline transition-colors",
                    overHero ? "text-neutral-200" : "text-neutral-600",
                  )}
                >
                  Water Safety &amp; Education
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-h-[44px] items-center rounded-full px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                  overHero
                    ? "text-neutral-200 hover:text-neutral-white hover:bg-neutral-white/10 focus-visible:ring-neutral-white"
                    : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:ring-brand-red-600",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA & Mobile Menu Trigger */}
          <div className="flex items-center gap-3">
            <Link
              href="/#courses"
              className="hidden sm:inline-flex min-h-[44px] items-center justify-center rounded-full bg-brand-red-600 px-4 py-2 text-sm font-semibold text-neutral-white shadow-xs transition-colors hover:bg-brand-red-700 active:bg-brand-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600 focus-visible:ring-offset-2"
            >
              Explore Courses
            </Link>

            {/* Mobile Navigation Drawer Trigger */}
            <MobileNav items={navItems} dark={overHero} />
          </div>
        </div>
      </Container>
    </header>
  );
}

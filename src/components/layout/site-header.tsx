import React from "react";
import Link from "next/link";
import { Container } from "./container";
import { MobileNav, type NavItem } from "./mobile-nav";

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/#courses" },
  { label: "Safety Articles", href: "/articles" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-neutral-white/95 backdrop-blur-md">
      <Container className="flex min-h-[64px] items-center justify-between py-3">
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
              <span className="text-lg font-extrabold tracking-tight text-neutral-900 group-hover:text-brand-red-600 transition-colors">
                SwimNigeria
              </span>
              <span className="text-[11px] font-medium tracking-wide text-neutral-600 -mt-1 hidden sm:inline">
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
              className="flex min-h-[44px] items-center rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600 focus-visible:ring-offset-2"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA & Mobile Menu Trigger */}
        <div className="flex items-center gap-3">
          <Link
            href="/#courses"
            className="hidden sm:inline-flex min-h-[44px] items-center justify-center rounded-lg bg-brand-red-600 px-4 py-2 text-sm font-semibold text-neutral-white shadow-xs transition-colors hover:bg-brand-red-700 active:bg-brand-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600 focus-visible:ring-offset-2"
          >
            Explore Courses
          </Link>

          {/* Mobile Navigation Drawer Trigger */}
          <MobileNav items={navItems} />
        </div>
      </Container>
    </header>
  );
}

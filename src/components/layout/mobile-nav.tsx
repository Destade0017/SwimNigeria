"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href: string;
}

export interface MobileNavProps {
  items: NavItem[];
  /** Inverse trigger treatment for when the dark hero photography sits behind the transparent header pill. */
  dark?: boolean;
}

export function MobileNav({ items, dark = false }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handleClose = () => setIsOpen(false);

  // Anchor hrefs (e.g. "/#courses") address sections within a page, so they never mark a route as current.
  const isActiveItem = (href: string) => !href.includes("#") && pathname === href;

  return (
    <div className="md:hidden">
      {/* Mobile Menu Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation-drawer"
        aria-label="Open mobile navigation menu"
        className={cn(
          "flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          dark
            ? "text-neutral-white hover:bg-neutral-white/10 hover:text-neutral-white focus-visible:ring-neutral-white"
            : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:ring-brand-red-600",
        )}
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Accessible Navigation Drawer */}
      <Dialog
        id="mobile-navigation-drawer"
        isOpen={isOpen}
        onClose={handleClose}
        variant="drawer"
        titleId="mobile-nav-title"
      >
        <DialogHeader onClose={handleClose} showCloseButton={true}>
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-full bg-brand-red-600"
              aria-hidden="true"
            />
            <DialogTitle
              as="h2"
              id="mobile-nav-title"
              className="text-lg font-bold text-neutral-900"
            >
              Menu
            </DialogTitle>
          </div>
        </DialogHeader>

        <nav aria-label="Mobile Navigation" className="flex flex-1 flex-col justify-between py-4">
          <ul className="flex flex-col space-y-1">
            {items.map((item) => {
              const isActive = isActiveItem(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={handleClose}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex min-h-[44px] items-center rounded-lg px-3 py-2 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600 focus-visible:ring-offset-2",
                      isActive
                        ? "bg-water-blue-50 text-water-blue-800 font-semibold"
                        : "text-neutral-800 hover:bg-neutral-100 hover:text-brand-red-600",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 border-t border-neutral-200 pt-4">
            <Link
              href="/#courses"
              onClick={handleClose}
              className="flex min-h-[44px] w-full items-center justify-center rounded-lg bg-brand-red-600 px-4 py-2.5 text-sm font-semibold text-neutral-white shadow-xs transition-colors hover:bg-brand-red-700 active:bg-brand-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600 focus-visible:ring-offset-2"
            >
              Explore Courses
            </Link>
          </div>
        </nav>
      </Dialog>
    </div>
  );
}

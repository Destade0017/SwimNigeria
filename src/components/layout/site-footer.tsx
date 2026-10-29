import React from "react";
import Link from "next/link";
import { Container } from "./container";

const currentYear = 2026;

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 text-neutral-700">
      <Container className="py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-4 lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600 focus-visible:ring-offset-2"
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-red-600 shadow-xs"
                aria-hidden="true"
              >
                <svg
                  className="h-4 w-4 text-neutral-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v10" />
                  <path d="M8 12h8" />
                </svg>
              </span>
              <span className="text-lg font-extrabold tracking-tight text-neutral-900">
                SwimNigeria
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-neutral-600">
              Structured swimming instruction and vital water safety education for Nigerian learners
              and communities.
            </p>
          </div>

          {/* Educational Courses Column */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Education
            </h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/#courses"
                  className="transition-colors hover:text-brand-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600"
                >
                  Course Catalogue
                </Link>
              </li>
              <li>
                <Link
                  href="/#safety"
                  className="transition-colors hover:text-brand-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600"
                >
                  Water Safety Guidelines
                </Link>
              </li>
              <li>
                <Link
                  href="/articles"
                  className="transition-colors hover:text-brand-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600"
                >
                  Articles &amp; Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Community Column */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Platform
            </h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="transition-colors hover:text-brand-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600"
                >
                  About Our Mission
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="transition-colors hover:text-brand-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600"
                >
                  Contact &amp; Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Standards Column */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Standards
            </h2>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>WCAG 2.1 AA Compliant</li>
              <li>NDPR Privacy Committed</li>
              <li>Evidence-Based Aquatic Curriculum</li>
            </ul>
          </div>
        </div>

        {/* Mandatory Safety & Educational Disclaimer */}
        <div className="mt-10 rounded-xl border border-neutral-200 bg-neutral-white p-4 text-xs leading-relaxed text-neutral-600 shadow-xs sm:p-5">
          <p className="font-semibold text-neutral-900 mb-1">
            Mandatory Safety &amp; Educational Disclaimer:
          </p>
          <p>
            Certificate of Theoretical Course Completion: This credential validates completion of
            digital coursework and water safety knowledge. It does not certify physical swimming
            competence, water survival capability, or lifeguarding qualification without practical,
            in-person assessment by a certified aquatic instructor.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-neutral-200 pt-6 text-xs text-neutral-600 sm:flex-row">
          <p>&copy; {currentYear} SwimNigeria. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Dedicated to drowning prevention and accessible water safety education across Nigeria.
          </p>
        </div>
      </Container>
    </footer>
  );
}

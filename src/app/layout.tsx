import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "SwimNigeria — Water Safety & Swimming Education",
  description:
    "Accessible, structured swimming education and water safety instruction for Nigerian learners.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#DC2626",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-screen flex-col bg-neutral-white text-neutral-900">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:bg-brand-red-600 focus:px-4 focus:py-2 focus:text-neutral-white focus:outline-none focus:ring-2 focus:ring-brand-red-700"
        >
          Skip to main content
        </a>
        <header className="border-b border-neutral-200 bg-neutral-white px-4 py-3 sm:px-6">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-3 w-3 rounded-full bg-brand-red-600"
                aria-hidden="true"
              />
              <span className="text-base font-bold tracking-tight text-neutral-900">
                SwimNigeria
              </span>
            </div>
            <span className="rounded-full bg-brand-red-50 px-2.5 py-0.5 text-xs font-medium text-brand-red-700">
              Foundation Operational
            </span>
          </div>
        </header>
        <main id="main-content" className="flex flex-1 flex-col">
          {children}
        </main>
        <footer className="border-t border-neutral-200 bg-neutral-50 px-4 py-4 text-center text-xs text-neutral-600 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <p>SwimNigeria — Water Safety &amp; Swimming Education Platform</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

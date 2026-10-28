export default function HomePage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl rounded-xl border border-neutral-200 bg-neutral-white p-8 shadow-sm sm:p-10">
        <div className="flex items-center gap-3">
          <span className="flex h-3 w-3 rounded-full bg-feedback-success" aria-hidden="true" />
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
            System Operational
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
          SwimNigeria
        </h1>

        <p className="mt-3 text-base text-neutral-700">
          The technical foundation for the SwimNigeria educational platform is initialized and
          verified.
        </p>

        <div className="mt-6 rounded-lg bg-neutral-50 p-4 border border-neutral-200">
          <h2 className="text-sm font-semibold text-neutral-900">
            Phase 1 Baseline Infrastructure
          </h2>
          <ul className="mt-2 space-y-1.5 text-xs text-neutral-600">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-red-600" aria-hidden="true" />
              <span>Next.js App Router &amp; React Server Components</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-red-600" aria-hidden="true" />
              <span>TypeScript Strict Checking (Zero any Policy)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-red-600" aria-hidden="true" />
              <span>Tailwind CSS Design System Token Integration</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-red-600" aria-hidden="true" />
              <span>
                Automated Quality Gates: ESLint, Prettier, Vitest, Playwright &amp; axe-core
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

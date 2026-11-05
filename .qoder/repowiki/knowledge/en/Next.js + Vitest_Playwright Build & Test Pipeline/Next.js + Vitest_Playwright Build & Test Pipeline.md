---
kind: build_system
name: Next.js + Vitest/Playwright Build & Test Pipeline
category: build_system
scope:
    - '**'
source_files:
    - package.json
    - next.config.ts
    - tsconfig.json
    - postcss.config.mjs
    - vitest.config.ts
    - playwright.config.ts
---

## Build System Overview

This is a single-package Next.js (App Router) project. There is no Makefile, Dockerfile, CI pipeline, or release script in the repository — all build, lint, typecheck, test, and start commands are defined as npm scripts inside `package.json`.

### Toolchain

- **Framework**: Next.js 16.4.3 with React 19.3.0 (`next.config.ts`, `package.json`).
- **Language**: TypeScript 5.8.2, target ES2022, module resolution set to `bundler` (`tsconfig.json`).
- **Styling**: Tailwind CSS v4 via `@tailwindcss/postcss` with PostCSS (`postcss.config.mjs`).
- **Linting**: ESLint 9 with `eslint-config-next` and `eslint-config-prettier` (`package.json`).
- **Formatting**: Prettier 3 (`package.json`, `.prettierrc`).
- **Unit testing**: Vitest 5 with jsdom environment (`vitest.config.ts`, `package.json`).
- **E2E testing**: Playwright 1.64 against Chromium Desktop (`playwright.config.ts`).

### Scripts (`package.json`)

| Script | Command | Purpose |
|---|---|---|
| `dev` | `next dev` | Local development server |
| `build` | `next build` | Production build |
| `start` | `next start` | Run production build |
| `lint` | `eslint .` | Lint source |
| `typecheck` | `tsc --noEmit` | Type-check only (no emit) |
| `test` | `vitest run` | Unit/integration tests |
| `test:watch` | `vitest` | Watch mode |
| `test:e2e` | `playwright test` | End-to-end tests |
| `format:check` | `prettier --check .` | Check formatting |
| `format:write` | `prettier --write .` | Auto-format |

There is no combined `ci` or `test:all` script; consumers must invoke individual scripts.

### Build Configuration

- `next.config.ts`: Enables `reactStrictMode` and whitelists `allowedDevOrigins` (`192.168.9.159`, `localhost`, `127.0.0.1`). No custom webpack, output directory, or image optimization overrides.
- `tsconfig.json`: Strict mode on (`strict`, `noImplicitAny`, `strictNullChecks`), `noEmit: true` (TypeScript does not produce its own output — Next.js handles compilation), `isolatedModules: true`, JSX transform `react-jsx`, path alias `@/* → ./src`.
- `postcss.config.mjs`: Single plugin `@tailwindcss/postcss`; no other PostCSS plugins.
- `vitest.config.ts`: jsdom environment, globals enabled, setup file at `./src/__tests__/setup.ts`, includes `src/**/*.{test,spec}.{ts,tsx}`, excludes `e2e/**`, `node_modules/**`, `.next/**`. Alias `@` resolves to `./src`.
- `playwright.config.ts`: Tests under `./e2e`, runs fully parallel by default, uses Chromium Desktop device profile. The web server is launched via `npm run start -- -p ${PORT}` where `PORT` defaults to `3001`. In CI (`process.env.CI`): `forbidOnly: true`, `retries: 2`, `workers: 1`, trace on first retry. Non-CI reuses an existing server (`reuseExistingServer: !process.env.CI`) and sets `ENABLE_TEST_HARNESS=true` for the app process.

### Versioning & Artifacts

- Package version is hardcoded as `"0.1.0"` in `package.json` with `"private": true` — there is no automated publish/release workflow.
- The production artifact is whatever `next build` emits into `.next/` (default Next.js output). No custom `distDir` is configured.
- No Dockerfile, container image, or deployment manifest exists in the repo.

### CI / Release Flow

No `.github/workflows/`, GitHub Actions, CircleCI, Jenkins, or similar configuration files are present. The only CI-aware behavior is conditional logic inside `playwright.config.ts` that tightens test execution when `CI` is set. There is no documented release procedure in the root-level docs either.

### Constraints Observed

- TypeScript compilation is delegated entirely to Next.js (`noEmit: true` in `tsconfig.json`, `next` compiler plugin).
- Path aliases use `@/*` consistently across `tsconfig.json` and `vitest.config.ts`.
- E2E tests require the Next.js dev/production server to be running on port 3001 (or `$PORT`) before Playwright executes.
- The project is marked private and has no publish step — artifacts are built locally via `next build`.
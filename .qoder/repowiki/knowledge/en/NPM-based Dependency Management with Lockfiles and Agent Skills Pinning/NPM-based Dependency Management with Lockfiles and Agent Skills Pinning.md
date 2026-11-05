---
kind: dependency_management
name: NPM-based Dependency Management with Lockfiles and Agent Skills Pinning
category: dependency_management
scope:
    - '**'
source_files:
    - package.json
    - package-lock.json
    - skills-lock.json
---

## System / Approach

This repository uses **npm** as its package manager for Node.js/JavaScript dependencies, managed through a single root `package.json` manifest plus a committed `package-lock.json` lockfile. There is no monorepo tool (no `pnpm-workspace.yaml`, no Lerna/Nx config); the project is a flat Next.js application.

In addition to npm packages, the repo pins third-party **agent skills** via a dedicated `skills-lock.json` file, which records each skill's GitHub source, path within that source, and a SHA-256 `computedHash`. This is analogous to a lockfile for the `.agents/skills/` tree.

There is no vendoring of JS libraries — all runtime and dev dependencies are resolved from the public npm registry at install time. No private registry configuration (`npmrc`, `.npmrc`) or proxy settings were found in the repository.

## Key Files

- `package.json` — single dependency manifest declaring both `dependencies` (runtime) and `devDependencies` (tooling, testing, linting).
- `package-lock.json` — deterministic lockfile committed alongside the manifest.
- `skills-lock.json` — deterministic pinning of agent skills sourced from GitHub repositories.
- `.gitignore` — excludes `node_modules/` and `test-results/` from version control.

## Architecture and Conventions

### Runtime vs. Dev Dependencies

Runtime dependencies declared under `dependencies` are minimal:

| Package | Version Specifier | Purpose |
|---|---:|---|
| `next` | `16.4.3` (exact) | App framework |
| `react` | `19.3.0` (exact) | UI library |
| `react-dom` | `19.3.0` (exact) | DOM renderer |
| `@supabase/ssr` | `^0.12.7` | Supabase SSR helpers |
| `@supabase/supabase-js` | `^2.118.0` | Supabase client |
| `zod` | `^4.6.7` | Schema validation |

Dev dependencies cover the full toolchain: TypeScript, ESLint + `eslint-config-next`, Prettier, Tailwind CSS v4 with `@tailwindcss/postcss`, Vitest for unit tests, Playwright for E2E, `@testing-library/react` + `jest-dom` for component tests, `jsdom` for test environment, and `axe-core` / `@axe-core/playwright` for accessibility testing.

Version specifier convention: **framework/runtime packages use exact versions** (`next`, `react`, `react-dom` pinned to specific releases), while utility libraries use caret ranges (`^`). The `eslint-config-next` version is pinned exactly to match the installed `next` version, ensuring peer-dependency compatibility.

### Lockfile Strategy

`package-lock.json` is committed to the repository, making installs reproducible across machines and CI. There is no separate `yarn.lock` or `pnpm-lock.yaml`, confirming npm as the canonical package manager.

### Agent Skills Pinning

The `skills-lock.json` file pins seven external agent skills, each with:

- `source`: the GitHub owner/repo (e.g. `anthropics/skills`, `supabase/agent-skills`, `vercel-labs/agent-skills`).
- `sourceType`: always `github`.
- `skillPath`: the path inside the source repo where the `SKILL.md` lives.
- `computedHash`: a SHA-256 hash used to verify the skill content has not drifted.

This acts as a lockfile for the `.agents/skills/` directory, preventing uncontrolled drift of AI assistant capabilities.

### Scripts as Entry Points

Dependency usage is channeled through npm scripts in `package.json` rather than direct CLI invocation:

- `dev` / `build` / `start` → Next.js
- `lint` → ESLint
- `typecheck` → TypeScript compiler
- `test` / `test:watch` → Vitest
- `test:e2e` → Playwright
- `format:check` / `format:write` → Prettier

## Conventions and Constraints

- **Single-level dependency graph**: All dependencies live in the root `package.json`; there are no nested `package.json` files per subdirectory.
- **Lockfiles are committed**: Both `package-lock.json` and `skills-lock.json` are tracked in version control, enforcing reproducible builds.
- **No vendored third-party JS**: The only vendored code resides under `.agents/skills/` (agent skill definitions) and `scripts/` inside those skills; JavaScript libraries are not vendored.
- **Exact versions for core framework packages**: `next`, `react`, `react-dom`, and `eslint-config-next` are pinned to exact versions, reducing accidental major-version upgrades.
- **Caret ranges for utilities**: Libraries like `zod`, `@supabase/*`, `tailwindcss`, and others use `^` ranges, allowing patch/minor updates.
- **No private registry or `GOPRIVATE`**: No `.npmrc`, `npmrc`, or Go module proxy configuration was found — all packages resolve from the public npm registry.
- **Node modules excluded from VCS**: `node_modules/` is listed in `.gitignore`.
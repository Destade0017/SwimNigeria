---
kind: external_dependency
name: Playwright — E2E smoke tests
slug: playwright
category: external_dependency
category_hints:
    - framework_behavior
scope:
    - '**'
source_files:
    - package.json
    - playwright.config.ts
    - README.md
---

### Identity
Playwright is the end-to-end test runner for SwimNigeria.

### Role in this repo
- E2E specs live under `e2e/` (about-contact, articles, courses, dialog, layout, login, register, smoke).
- `npm run test:e2e` runs `playwright test` and includes automated WCAG 2.1 AA audits via `@axe-core/playwright`.
- Chromium binary must be installed separately (`npx playwright install chromium`) before first run.

### Framework behavior
Tests are written as TypeScript Playwright spec files using the standard Page Object / fixture model; they assert page-level user flows rather than component internals.
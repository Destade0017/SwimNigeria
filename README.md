# SwimNigeria — Digital Aquatic Education Platform

SwimNigeria is a dedicated digital educational platform designed to make structured swimming instruction and essential water safety knowledge accessible to all Nigerians. By delivering structured digital curricula, practical water safety guidelines, self-paced beginner courses, and verifiable digital certifications, SwimNigeria aims to reduce drowning incidents and foster aquatic literacy nationwide.

---

## Current Project Status: Phase 1 Completed

The project has concluded **Phase 1: Technology Scaffolding & Baseline Verification**.

In accordance with strict phase discipline:
* Next.js App Router project initialized with TypeScript strict mode (`"strict": true`, zero `any` policy).
* Tailwind CSS v4 configured with SwimNigeria Red-and-White brand design tokens.
* Complete code quality tooling integrated: ESLint (flat config), Prettier, and zero conflicting rules.
* Testing infrastructure established: Vitest (unit/component testing), React Testing Library, Playwright (E2E smoke testing), and axe-core (automated WCAG 2.1 AA accessibility audits).
* **Zero business features, course data, mock learner records, or database migrations have been introduced.**

---

## Getting Started

### Prerequisites
* **Node.js:** Node.js `>= 20.9.0` (Verified on Node.js `v26.12.1`, macOS arm64).
* **Package Manager:** `npm` `>= 10.0.0` (Verified on `npm` `11.20.0`).

### 1. Installation
Clone the repository and install dependencies using the locked versions:
```bash
npm install
```

### 2. Environment Setup
Copy the environment template into an untracked local environment file:
```bash
cp .env.example .env.local
```
> **Security Directives:** Never commit `.env.local` or real API keys. Phase 1 scaffolding requires no live external credentials.

### 3. Local Development Server
Start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to view the operational foundation page.

---

## Quality Gates & Verification Commands

All changes must pass the following automated quality gates before submitting or merging:

| Check | Command | Description |
| :--- | :--- | :--- |
| **Formatting Verification** | `npm run format:check` | Verifies Prettier code style without making modifications. |
| **Formatting Auto-Fix** | `npm run format:write` | Formats all supported files in-place using Prettier. |
| **TypeScript Type Check** | `npm run typecheck` | Executes `tsc --noEmit` across all application and test files in strict mode. |
| **Linting** | `npm run lint` | Runs ESLint 9 flat configuration with Core Web Vitals and TypeScript rules. |
| **Unit & Component Tests** | `npm run test` | Runs Vitest in single-run mode with jsdom environment and accessibility checks. |
| **Test Watcher** | `npm run test:watch` | Starts Vitest in interactive watch mode for local development. |
| **Browser E2E Smoke Tests** | `npm run test:e2e` | Runs Playwright smoke tests and automated `@axe-core/playwright` accessibility audits. |
| **Production Build** | `npm run build` | Compiles Next.js optimized production bundle and prerenders static routes. |
| **Production Server** | `npm run start` | Boots the compiled production server locally on port 3000. |

> **Browser Binary Setup for Playwright:** If running E2E tests for the first time in a fresh environment, install the required Playwright Chromium binary:
> ```bash
> npx playwright install chromium
> ```

---

## Documentation Directory (`docs/`)

All foundational engineering documentation is organized within the [`docs/`](./docs) directory:

1. **[PROJECT_BRIEF.md](./docs/PROJECT_BRIEF.md)** — Project purpose, target audience, business objectives, initial scope, and success criteria.
2. **[PRODUCT_REQUIREMENTS.md](./docs/PRODUCT_REQUIREMENTS.md)** — Detailed functional specifications, permissions, edge cases, and acceptance criteria.
3. **[SYSTEM_ARCHITECTURE.md](./docs/SYSTEM_ARCHITECTURE.md)** — High-level system architecture, component evaluations, and data flow diagrams.
4. **[DATABASE_DESIGN.md](./docs/DATABASE_DESIGN.md)** — Conceptual data model, entity relationships, integrity constraints, and Row-Level Security (RLS) policies.
5. **[DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md)** — Visual identity, Red-and-White brand palette, typography, layout conventions, and WCAG AA accessibility standards.
6. **[SECURITY.md](./docs/SECURITY.md)** — Threat modeling, session security, server-side RBAC, assessment anti-cheating, and certificate verification security.
7. **[TESTING_STRATEGY.md](./docs/TESTING_STRATEGY.md)** — Unit, integration, E2E, accessibility, and pre-deployment verification gates.
8. **[DEVELOPMENT_RULES.md](./docs/DEVELOPMENT_RULES.md)** — The 15 mandatory directives for all AI coding agents and contributors.
9. **[CODING_STANDARDS.md](./docs/CODING_STANDARDS.md)** — TypeScript conventions, directory organization, component design, and validation patterns.
10. **[IMPLEMENTATION_ROADMAP.md](./docs/IMPLEMENTATION_ROADMAP.md)** — Phased development milestones from scaffolding to production launch.
11. **[DEPLOYMENT_AND_OPERATIONS.md](./docs/DEPLOYMENT_AND_OPERATIONS.md)** — Environment management, secret rotation, free-tier limits, backups, and rollback runbooks.
12. **[DECISION_LOG.md](./docs/DECISION_LOG.md)** — Architecture Decision Records (ADRs 001–007) documenting settled decisions.
13. **[KNOWN_LIMITATIONS.md](./docs/KNOWN_LIMITATIONS.md)** — Tracking unresolved business requirements, unverified assumptions, and operational quotas.
14. **[AGENT_SKILLS_REGISTER.md](./docs/AGENT_SKILLS_REGISTER.md)** — Audit of installed, verified, and evaluated AI agent skills.
15. **[TECHNOLOGY_EVALUATION.md](./docs/TECHNOLOGY_EVALUATION.md)** — Comparative analysis of frameworks, databases, auth, and free-tier commercial terms.

---

## Current Technology Stack Decisions

* **Frontend Framework:** Next.js 16 (App Router) with TypeScript 5.8
* **Styling:** Tailwind CSS v4 with SwimNigeria design system tokens
* **Quality Assurance:** ESLint, Prettier, Vitest, React Testing Library, Playwright, axe-core
* **Database & Auth (Target):** PostgreSQL and Supabase Auth with SSR HttpOnly cookies (Phase 5)
* **Video Delivery:** Unlisted YouTube Embeds with privacy facades (₦0 bandwidth egress)
* **Email Delivery:** Resend API (3,000 free emails/month)
* **Hosting Platform:** Vercel Hobby / Cloudflare Pages

---

## Next Milestone: Phase 2

The immediate next milestone is **Phase 2: Design System & Core UI Primitives**:
1. Review and approve the Phase 1 scaffolding deliverables.
2. Build reusable, accessible UI component primitives (`Button`, `Input`, `Card`, `Badge`, `Skeleton`) based on `docs/DESIGN_SYSTEM.md`.
3. Construct layout containers and responsive navigation header/footer.

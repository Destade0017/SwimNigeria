# SwimNigeria — Digital Aquatic Education Platform

SwimNigeria is a dedicated digital educational platform designed to make structured swimming instruction and essential water safety knowledge accessible to all Nigerians. By delivering structured digital curricula, practical water safety guidelines, self-paced beginner courses, and verifiable digital certifications, SwimNigeria aims to reduce drowning incidents and foster aquatic literacy nationwide.

---

## Current Project Status: Phase 0 Completed

The project is currently at the conclusion of **Phase 0: Engineering Foundation & Project Preparation**. 

In accordance with strict phase boundaries:
* All architectural, security, database, design system, and testing specifications have been authored and verified.
* Development rules and AI agent instructions are established in `AGENTS.md` and `docs/DEVELOPMENT_RULES.md`.
* Verified AI agent skills (`impeccable`, `supabase`, `supabase-postgres-best-practices`, `vercel-react-best-practices`) have been installed into `.agents/skills/`.
* Git repository is initialized with comprehensive ignore rules and `.env.example`.
* **Zero application code, database migrations, or production services have been prematurely created.**

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

## Current Technology Stack Decisions (Provisional)

* **Frontend Framework:** Next.js (App Router) with TypeScript
* **Styling:** Tailwind CSS with accessible headless primitives
* **Database & Auth:** PostgreSQL and Supabase Auth with SSR HttpOnly cookies
* **Video Delivery:** Unlisted YouTube Embeds with privacy facades (₦0 bandwidth egress)
* **Email Delivery:** Resend API (3,000 free emails/month)
* **Hosting Platform:** Vercel Hobby / Cloudflare Pages

---

## How to Understand the Roadmap

The project is structured into 11 distinct phases documented in [`docs/IMPLEMENTATION_ROADMAP.md`](./docs/IMPLEMENTATION_ROADMAP.md). Each phase has explicit dependencies and measurable exit criteria. No phase may be started until the preceding phase has been reviewed and verified.

---

## Next Milestone: Phase 1

The immediate next step is **Phase 1: Technology Scaffolding & Baseline Verification**:
1. Review and approve the Phase 0 foundation deliverables.
2. Initialize the Next.js TypeScript application structure.
3. Configure Tailwind CSS design tokens according to `docs/DESIGN_SYSTEM.md`.
4. Configure testing infrastructure (Vitest) and static analysis (ESLint, Prettier).
5. Verify clean execution of `typecheck`, `lint`, `test`, and `build` commands.

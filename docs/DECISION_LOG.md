# SwimNigeria — Architecture Decision Records (ADR) Log

This document records the foundational architectural and technical decisions made for the SwimNigeria platform. It ensures consistency across AI development sessions, prevents repeated debates on established patterns, and documents the rationale and trade-offs of each choice.

---

## Index of Decisions

* **ADR-001:** Separation of Foundation Phase (Phase 0) from Application Implementation
* **ADR-002:** Selection of Next.js (App Router) + TypeScript + Tailwind CSS
* **ADR-003:** Selection of Managed PostgreSQL via Supabase Free Tier
* **ADR-004:** Video Delivery via Privacy-Enhanced YouTube Unlisted Embeds
* **ADR-005:** Tamper-Evident Certificate Verification via Unique Cryptographic NanoIDs
* **ADR-006:** AI Development Workflow and Skill Architecture Integration
* **ADR-007:** Dominant Red & White Brand Color Strategy with Slate Neutrals

---

## ADR-001: Separation of Foundation Phase (Phase 0) from Application Implementation

* **Status:** **Accepted**
* **Date:** 2026-10-28
* **Context:** A real-world educational client project requires high engineering rigor, robust security, strict phase boundaries, and thorough documentation before application code is authored. Jumping immediately into code scaffolding often results in conflicting architectures, missed security invariants, and poor design system discipline.
* **Options Considered:**
  1. *Immediate Full-Stack Scaffolding:* Scaffold Next.js, database, and auth in one pass.
  2. *Strict Foundation Phase (Phase 0):* Complete engineering documentation, agent working rules, skill installations, security modeling, and testing strategies before writing application code.
* **Reasoning:** Establishing a clear Phase 0 eliminates ambiguity, establishes the non-negotiable boundaries, enforces development rules, and sets up AI agent skills so future development is disciplined and verifiable.
* **Consequences:** Application scaffolding and code generation are deferred to Phase 1. Foundation artifacts are fully documented and verified first.

---

## ADR-002: Selection of Next.js (App Router) + TypeScript + Tailwind CSS

* **Status:** **Accepted**
* **Date:** 2026-10-28
* **Context:** The frontend must support fast SEO-indexed landing pages and public articles, interactive learning players and dashboards, and minimal JavaScript payloads for Nigerian mobile devices on metered 3G/4G connections.
* **Options Considered:**
  1. *Vite + React SPA:* Fast builds, but poor SEO for articles, slower initial paint, and client-heavy bundles.
  2. *Next.js (App Router) + TypeScript + Tailwind CSS:* Server Components deliver pre-rendered static HTML with zero client JS for content routes; Client Components handle interactive course players; Tailwind provides utility-first zero-runtime CSS.
  3. *Astro:* Excellent for static content, but more complex for authenticated interactive dashboards and Server Actions.
* **Reasoning:** Next.js App Router offers the optimal balance between high SEO for educational content, streaming HTML for slow connections, and co-located Server Actions for type-safe backend logic without running a separate server.
* **Consequences:** All components default to Server Components unless explicit user interaction is needed. Developers must adhere to React Server Component boundaries.

---

## ADR-003: Selection of Managed PostgreSQL via Supabase Free Tier

* **Status:** **Accepted**
* **Date:** 2026-10-28
* **Context:** The project has an initial budget of ₦0, requires relational data modeling (courses, lessons, enrollments, assessments, certificates), and requires strict row-level authorization.
* **Options Considered:**
  1. *Self-hosted PostgreSQL on VPS:* Incurs monthly infrastructure costs ($5–$15/month minimum) and operational maintenance overhead.
  2. *Firebase / Firestore:* NoSQL makes relational progress tracking, sequential lesson ordering, and certificate verification more complex and harder to query with integrity.
  3. *Supabase Managed PostgreSQL:* Generous free tier (500MB DB, 50,000 MAU), native Row-Level Security (RLS), turnkey Auth with PKCE and SSR cookies, and zero upfront infrastructure cost.
* **Reasoning:** Supabase provides standard open-source PostgreSQL with built-in RLS, enabling enterprise-grade security at zero cost during launch.
* **Consequences:** Database logic must leverage RLS. Project auto-pause after 7 days of inactivity must be mitigated by a scheduled health ping.

---

## ADR-004: Video Delivery via Privacy-Enhanced YouTube Unlisted Embeds

* **Status:** **Accepted**
* **Date:** 2026-10-28
* **Context:** Swimming technique instruction relies on video demonstrations. Streaming video directly from application storage or dedicated video CDNs (Mux, Cloudflare Stream) generates massive bandwidth egress costs that violate the ₦0 budget.
* **Options Considered:**
  1. *Self-Hosted Storage (S3 / Supabase Storage):* Egress bandwidth costs become prohibitive after modest traffic.
  2. *Cloudflare Stream / Mux:* High quality, but requires active billing and paid tiers.
  3. *Unlisted YouTube Embeds with Custom Privacy-Enhanced Facades:* Zero bandwidth cost, global Google CDN caching, automated multi-resolution adaptive streaming (critical for Nigerian mobile networks where users switch between 2G, 3G, and 4G).
* **Reasoning:** Using unlisted YouTube videos embedded via lightweight facades provides world-class adaptive video streaming with zero bandwidth charges.
* **Consequences:** Videos must be uploaded to YouTube as unlisted videos. The UI embeds them using lazy-loaded facades to avoid loading third-party tracking scripts until the user clicks play.

---

## ADR-005: Tamper-Evident Certificate Verification via Unique Cryptographic NanoIDs

* **Status:** **Accepted**
* **Date:** 2026-10-28
* **Context:** Educational certificates must be verifiable by third parties (schools, employers, parents) while preventing sequential enumeration or forgery.
* **Options Considered:**
  1. *Sequential Integer IDs (e.g., Cert #1, #2):* Easily guessable, enumeratable, and unprofessional.
  2. *UUIDv4:* Secure and non-guessable, but long and cumbersome to type into a physical verification portal (`550e8400-e29b-41d4-a716-446655440000`).
  3. *Structured Identifier with NanoID (e.g., `SN-2026-X8K9P2`):* Human-readable prefix combined with high-entropy, collision-resistant characters, plus a public verification URL and QR code.
* **Reasoning:** Structured NanoID identifiers offer high tamper resistance, professional brand appearance, and easy readability on physical printouts and mobile screens.
* **Consequences:** Database maintains a unique index on `verification_code`. The public `/verify/[code]` route queries this record directly without requiring user login.

---

## ADR-006: AI Development Workflow and Skill Architecture Integration

* **Status:** **Accepted**
* **Date:** 2026-10-28
* **Context:** Development will involve AI coding assistants working in Google Antigravity. To ensure high code quality, consistent design systems, and robust database practices, the workspace must equip agents with specialized domain knowledge without polluting the base context window.
* **Options Considered:**
  1. *Monolithic Prompting:* Pasting hundreds of lines of instructions into every prompt.
  2. *Antigravity Customization Architecture:* Installing curated agent skills into `.agents/skills/` (using progressive disclosure) and persistent directives in `AGENTS.md`.
* **Reasoning:** Workspace skills (`impeccable`, `supabase`, `supabase-postgres-best-practices`, `vercel-react-best-practices`) allow progressive on-demand disclosure, preserving token context while enforcing world-class quality standards.
* **Consequences:** Skills are tracked in `.agents/skills/` and `skills-lock.json`. Agents automatically load relevant skills when performing matching tasks.

---

## ADR-007: Dominant Red & White Brand Color Strategy with Slate Neutrals

* **Status:** **Accepted**
* **Date:** 2026-10-28
* **Context:** The founder confirmed initial brand colors of Red and White. The design must feel professional, energetic, and educational rather than like an emergency distress signal or a hospital interface.
* **Options Considered:**
  1. *Pure Red & Stark White only:* High contrast but causes eye strain on digital screens and lacks aquatic context.
  2. *Replacing Red with Blue:* Violates client's confirmed brand identity.
  3. *Vibrant Red & Clean White with Deep Slate Neutrals & Water Accents:* Red (`#DC2626`) serves as the dominant call-to-action and brand identifier; Crisp White (`#FFFFFF`) serves as the clean card and background canvas; deep slate (`#0F172A`) provides soft high-contrast typography; subtle aquatic blue (`#0284C7`) provides water context and progress indicator fill.
* **Reasoning:** Preserves the client's confirmed brand colors while adhering to modern WCAG AA contrast ratios and UX best practices.
* **Consequences:** All components adhere strictly to the token scale defined in `docs/DESIGN_SYSTEM.md`.

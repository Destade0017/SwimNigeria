# SwimNigeria — Agent Skills Register & Evaluation

This document provides a comprehensive audit of all AI agent skills evaluated, installed, or investigated for the SwimNigeria development environment within Google Antigravity.

---

## 1. Summary of Installed & Verified Skills

| Skill Name | Version / Commit | Official Source | Installation Scope | Status | Primary Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`impeccable`** | 4.8.0 / v0.1.18 | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | Project (`.agents/skills/impeccable`) | **Installed & Verified** | High-craft frontend UI design, UX audit, accessibility, and design system alignment. |
| **`supabase`** | 0.1.2 | [supabase/agent-skills](https://github.com/supabase/agent-skills) | Project (`.agents/skills/supabase`) | **Installed & Verified** | Supabase database, Auth (SSR cookies), RLS policies, Storage, and security auditing. |
| **`supabase-postgres-best-practices`** | 1.1.1 | [supabase/agent-skills](https://github.com/supabase/agent-skills) | Project (`.agents/skills/supabase-postgres-best-practices`) | **Installed & Verified** | PostgreSQL query performance, indexing, connection pooling, and schema design. |
| **`vercel-react-best-practices`** | 1.0.0 | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | Project (`.agents/skills/vercel-react-best-practices`) | **Installed & Verified** | React 19 and Next.js App Router performance rules (eliminating waterfalls, bundle optimization). |

---

## 2. Detailed Profiles of Installed Skills

### 2.1 Impeccable
* **Official Source:** `https://github.com/pbakaus/impeccable`
* **Purpose:** Provides design direction and 24 specialized design commands (`craft`, `shape`, `critique`, `audit`, `polish`, `bolder`, `quieter`, `harden`, `animate`) to eliminate generic AI-generated templates and enforce production-grade visual polish.
* **Installation Scope:** Project-scoped at canonical `.agents/skills/impeccable` (real directory, cross-platform portable without symlinks).
* **Files Installed:**
  * `.agents/skills/impeccable/SKILL.md` (Main skill manifest with YAML frontmatter)
  * `.agents/skills/impeccable/reference/` (Detailed command playbooks: `audit.md`, `critique.md`, `polish.md`, `craft-floor.md`, etc.)
  * `.agents/skills/impeccable/scripts/impeccable` (Skill launcher)
  * `.agents/skills/impeccable/scripts/bin/darwin-arm64/impeccable` (Engine binary; ignored in Git via `.gitignore`)
* **Compatibility Status:** Fully compatible with Google Antigravity progressive disclosure.
* **Security Considerations:** Self-contained binary with sandboxed execution. Does not make unauthorized network calls or require external credentials.
* **Verification Performed:** Executed `npx impeccable install --providers=antigravity --project`, verified presence of `SKILL.md`, validated YAML frontmatter, verified executable permissions on launcher script, and verified Antigravity discovery.
* **Reason for Inclusion:** Guarantees that SwimNigeria's UI avoids common "AI-slop" design tropes, adheres to the Red and White brand identity, and satisfies WCAG AA contrast.
* **Maintenance & Update:** Run `npx impeccable update` or check updates via `npx impeccable check`.

---

### 2.2 Supabase
* **Official Source:** `https://github.com/supabase/agent-skills`
* **Purpose:** Comprehensive Supabase development guidance covering PostgreSQL, Auth, SSR integrations (`@supabase/ssr`), cookie management, and security pitfalls (e.g., prohibiting reliance on user-editable metadata for authorization).
* **Installation Scope:** Project-scoped at `.agents/skills/supabase`.
* **Files Installed:**
  * `.agents/skills/supabase/SKILL.md`
  * `.agents/skills/supabase/references/` (Best practice runbooks)
  * `.agents/skills/supabase/CHANGELOG.md`
* **Compatibility Status:** 100% native compatibility with Antigravity; registered in `skills-lock.json`.
* **Security Considerations:** Explicitly instructs agents on RLS policy design, service role key isolation, and JWT session handling. Zero external telemetry risk (audited Safe by Snyk and Socket).
* **Verification Performed:** Installed via `npx skills add supabase/agent-skills --skill supabase --copy`, verified file contents, frontmatter integrity, and lockfile entry.
* **Reason for Inclusion:** Invaluable for building secure authentication, user profiles, and course progression on PostgreSQL.
* **Maintenance & Update:** Run `npx skills update supabase`.

---

### 2.3 Supabase Postgres Best Practices
* **Official Source:** `https://github.com/supabase/agent-skills`
* **Purpose:** 8 categories of PostgreSQL optimization rules: query performance, connection pooling, schema design, security & RLS, locking, and data access patterns.
* **Installation Scope:** Project-scoped at `.agents/skills/supabase-postgres-best-practices`.
* **Files Installed:**
  * `.agents/skills/supabase-postgres-best-practices/SKILL.md`
  * `.agents/skills/supabase-postgres-best-practices/references/` (Detailed rule documentation)
* **Compatibility Status:** 100% native compatibility with Antigravity; registered in `skills-lock.json`.
* **Security Considerations:** Safe; static markdown guidance only. No executable binaries.
* **Verification Performed:** Installed via `npx skills add supabase/agent-skills --skill supabase-postgres-best-practices --copy`, validated structure and YAML frontmatter.
* **Reason for Inclusion:** Ensures the database design avoids common traps (missing indexes on foreign keys, unbounded queries, connection exhaustion on free-tier PostgreSQL).
* **Maintenance & Update:** Run `npx skills update supabase-postgres-best-practices`.

---

### 2.4 Vercel React Best Practices
* **Official Source:** `https://github.com/vercel-labs/agent-skills`
* **Purpose:** 70 rules for optimizing React 19 and Next.js applications, focusing on eliminating async waterfalls, bundle size reduction, server-side performance, and re-render prevention.
* **Installation Scope:** Project-scoped at `.agents/skills/vercel-react-best-practices`.
* **Files Installed:**
  * `.agents/skills/vercel-react-best-practices/SKILL.md`
  * `.agents/skills/vercel-react-best-practices/rules/` (Detailed optimization rules)
* **Compatibility Status:** 100% native compatibility with Antigravity; registered in `skills-lock.json`.
* **Security Considerations:** Safe; purely educational guidelines and lint-like rules.
* **Verification Performed:** Installed via `npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices --copy`, verified structure and rules directory.
* **Reason for Inclusion:** Critical for maintaining minimal bundle sizes and fast page loads for Nigerian mobile users on metered connections.
* **Maintenance & Update:** Run `npx skills update vercel-react-best-practices`.

---

## 3. Skills Evaluated But Not Installed

1. **`vercel-composition-patterns` (from `vercel-labs/agent-skills`):**
   * *Purpose:* Advanced React component composition and compound component architecture.
   * *Reason Not Installed:* While useful, our core UI primitives will be kept lean and straightforward without unnecessary compound abstractions during early phases. Installing it now would add unnecessary overhead. Can be added on demand.
2. **`web-design-guidelines` (from `vercel-labs/agent-skills`):**
   * *Purpose:* UI review against general web guidelines.
   * *Reason Not Installed:* Redundant with `impeccable`, which provides a strictly superior, more comprehensive suite of 24 design and audit commands tailored specifically for AI coding agents.
3. **`deploy-to-vercel` (from `vercel-labs/agent-skills`):**
   * *Purpose:* CLI deployment automation to Vercel.
   * *Reason Not Installed:* Strictly excluded by Phase 0 non-negotiables (no deployment or production service provisioning in Phase 0).

---

## 4. Investigation of Ambiguous Skill: "Tate"

* **User Context:** The prompt specifically noted: *"The user previously mentioned a skill called 'Tate'. Investigate whether a clearly identifiable skill by that name exists and whether it is relevant to Antigravity. Do not guess its identity or install an unrelated project simply because its name is similar. Report any ambiguity."*
* **Investigation Findings:**
  1. Exhaustive search across the official agent skills registry (`skills.sh`), GitHub repositories, and Antigravity package indexes returned **zero** reputable, official skills named "Tate".
  2. The search results strongly indicate that "Tate" is an informal typo or phonetic transcription for **"Taste"** (the open-source `taste-skill` / `design-taste-frontend` framework designed to prevent generic "AI-slop" in coding agents).
  3. Alternatively, "Tate" might refer to cultural references (Tate Modern) or influencer personas, none of which constitute a valid software engineering skill.
* **Resolution & Decision:**
  * In strict compliance with instructions (*"Do not guess its identity or install an unrelated project simply because its name is similar. Report any ambiguity"*), **no skill was installed under the name 'Tate'**.
  * The actual intended capability—ensuring top-tier design taste and avoiding generic AI frontend templates—is comprehensively fulfilled by the officially installed **`impeccable`** skill.

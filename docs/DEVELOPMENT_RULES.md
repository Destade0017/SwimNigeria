# SwimNigeria — Mandatory Development Rules for AI Agents & Engineers

These rules are non-negotiable standards that govern all software engineering and AI agent development tasks on the SwimNigeria codebase. Every task must be performed in compliance with these fifteen directives.

---

## The 15 Mandatory Development Directives

### 1. Read Relevant Documentation First
Before writing code or proposing changes, read the corresponding project documentation in `docs/`:
* Architecture questions $\rightarrow$ `docs/SYSTEM_ARCHITECTURE.md`
* Feature details $\rightarrow$ `docs/PRODUCT_REQUIREMENTS.md`
* UI and styling $\rightarrow$ `docs/DESIGN_SYSTEM.md`
* Data model questions $\rightarrow$ `docs/DATABASE_DESIGN.md`
* Security questions $\rightarrow$ `docs/SECURITY.md`
* Established decisions $\rightarrow$ `docs/DECISION_LOG.md`

### 2. Inspect Existing Implementation Before Editing
Never begin editing without inspecting existing files, types, configurations, and exports. Understand how existing code works before attempting to modify or extend it.

### 3. Identify Task Objective and Scope Boundary
Clearly determine what is strictly within the scope of the assigned task and what falls outside it. If a task asks for a contact form component, do not implement email delivery logic or rewrite the navigation header.

### 4. Plan the Smallest Appropriate Change
Favor focused, surgical interventions over sweeping refactorings. Avoid unnecessary file rewrites, large code churn, or touching unrelated files.

### 5. Preserve Unrelated Working Functionality
Protect working code. Do not remove comments, docstrings, type definitions, or features that are unrelated to your immediate task.

### 6. Avoid Unnecessary Dependencies & Premature Abstractions
Do not install npm packages for trivial operations (e.g., date formatting or class merging if simple native utilities suffice). Do not construct speculative abstraction layers or generic design patterns for features that do not yet exist.

### 7. Respect Architecture & Design System Conventions
Adhere strictly to established conventions:
* Follow the color palette (Red and White dominant; slate neutrals; water accents) in `docs/DESIGN_SYSTEM.md`.
* Follow Next.js App Router conventions (Server Components by default; Client Components only when interactivity requires them).
* Follow TypeScript strictness guidelines in `docs/CODING_STANDARDS.md`.

### 8. Protect Secrets & Sensitive Information
* Never hardcode API keys, tokens, passwords, or service credentials into source code, test files, or documentation.
* Use environment variables accessed via `process.env` on the server.
* Ensure all sensitive files remain listed in `.gitignore`.

### 9. Run Appropriate Verification
Verify every logically complete unit of work:
* Run code formatting checks (`npm run format:check`).
* Run type checks (`npm run typecheck`) and linter (`npm run lint`).
* Run unit, component, and accessibility tests (`npm run test`).
* Run browser end-to-end smoke tests where appropriate (`npm run test:e2e`).
* Verify production build compatibility (`npm run build`).

### 10. Review the Actual Diff
Before finalizing a task, examine the Git diff (`git diff` or review tool changes). Confirm that every modified line is intentional, cleanly formatted, and free of accidental edits or debugging remnants (e.g., `console.log`).

### 11. Report Modified Files & Verification Results
Provide an explicit summary in your completion report:
* Complete list of files created, modified, or deleted.
* Specific verification commands executed and their exact exit status.

### 12. Disclose Failures, Limitations & Unresolved Risks
Be fully transparent. If a command failed, a test could not be run, or an edge case remains unhandled, document it clearly in your response. Never conceal bugs, warnings, or gaps.

### 13. Update Documentation When Relevant Decisions Change
If an implementation task modifies an architectural detail, database schema, or environment variable, update the corresponding file in `docs/` and log the update in `docs/DECISION_LOG.md`.

### 14. Never Claim That Untested Code Works
If a feature has not been executed and validated against actual tests or browser rendering, state honestly that it is written but untested. Fabricating test outcomes is strictly prohibited.

### 15. Never Claim That Local Testing Proves Production Readiness
Local development tests, mocks, and builds validate local correctness, but they do not prove that live third-party services (e.g., email delivery, production domain SSL, cloud database latency) are operational in production. Maintain strict distinction between local verification and live deployment verification.

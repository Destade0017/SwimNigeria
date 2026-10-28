# SwimNigeria — Agent Guidelines & Working Rules

All AI coding assistants and contributors working on SwimNigeria must strictly adhere to the following directives:

## 1. Documentation-First Approach
* **Mandatory Reading:** Before planning or implementing any task, read the relevant documents in `docs/`, starting with `docs/PROJECT_BRIEF.md`, `docs/PRODUCT_REQUIREMENTS.md`, `docs/DEVELOPMENT_RULES.md`, and `docs/CODING_STANDARDS.md`.
* **Decision Verification:** Verify proposed changes against `docs/DECISION_LOG.md` and `docs/KNOWN_LIMITATIONS.md`. Never re-open settled architectural decisions without explicit confirmation.

## 2. Strict Scope Control & Phase Discipline
* Work strictly within the current milestone defined in `docs/IMPLEMENTATION_ROADMAP.md`.
* Plan the smallest appropriate change to achieve the user's objective.
* **Prohibited:** Never invent unconfirmed business logic, passing scores, contact details, or fee structures. If an item is unconfirmed, record it in `docs/KNOWN_LIMITATIONS.md` and ask for clarification.

## 3. Pre-Change Inspection & Preservation
* Inspect existing files, configuration, and dependencies before making any modifications.
* Preserve all unrelated working code, types, comments, and docstrings.
* Avoid adding unnecessary third-party dependencies or over-abstracted layers.

## 4. Security-First Implementation
* Enforce security server-side. Never rely on frontend-only role checks or hidden UI elements for authorization.
* Never hardcode secrets, keys, or credentials. Use `.env.example` as a template and keep actual credentials in untracked `.env.local`.
* Always validate inputs using strict runtime schemas (e.g., Zod).
* Consult `docs/SECURITY.md` for specific rules regarding Supabase Auth, Row-Level Security (RLS), and certificate verification.

## 5. Verification & Diff Review
* Verify every logical unit of work using appropriate tooling (linting, type checking, unit tests, build checks).
* Review the Git diff before declaring a task complete.
* Never state or imply that code works if it has not been tested and verified.

## 6. Honest & Transparent Reporting
* Explicitly report all modified files, commands executed, and verification outcomes.
* Disclose failures, untested edge cases, performance limitations, and unresolved risks with complete candor.
* Never claim local testing proves production deployment readiness.

---
*For detailed procedures, refer to [DEVELOPMENT_RULES.md](file:///Users/aj/Downloads/Documents/Career%20&%20Important%20Documents/SwimNigeria/docs/DEVELOPMENT_RULES.md) and [CODING_STANDARDS.md](file:///Users/aj/Downloads/Documents/Career%20&%20Important%20Documents/SwimNigeria/docs/CODING_STANDARDS.md).*

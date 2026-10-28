# SwimNigeria — Engineering Coding Standards & Conventions

## 1. TypeScript Standards & Type Safety
* **Strict Mode:** TypeScript must operate under strict mode (`"strict": true` in `tsconfig.json`).
* **Zero `any` Policy:** Using `any` is strictly prohibited. If a type is genuinely dynamic or unknown, use `unknown` accompanied by user-defined type guards or Zod validation schemas.
* **Explicit Return Types:** All exported functions, Server Actions, Route Handlers, and public API helpers must declare explicit return types.
* **Interface vs. Type Alias:**
  * Use `interface` for object shapes and component props that may benefit from declaration merging.
  * Use `type` for unions, intersections, primitives, and mapped types.
* **Nullability Handling:** Avoid non-null assertions (`!`). Use optional chaining (`?.`), nullish coalescing (`??`), or early guard clauses.

---

## 2. Naming Conventions
* **Files & Directories:**
  * Components: PascalCase (e.g., `CourseCard.tsx`, `EnrollButton.tsx`).
  * Route files & directories (Next.js App Router): kebab-case (e.g., `app/courses/[courseSlug]/page.tsx`).
  * Utilities & helpers: kebab-case or camelCase (e.g., `format-date.ts`, `certificate-hash.ts`).
* **Components & Types:**
  * React Components: PascalCase (`NavigationHeader`, `QuizQuestionCard`).
  * TypeScript Types / Interfaces: PascalCase (`Course`, `LearnerProfile`, `CertificateVerificationResult`).
  * Props Interfaces: PascalCase suffixed with `Props` (`CourseCardProps`, `AssessmentFormProps`).
* **Functions, Variables & Constants:**
  * Functions & Methods: camelCase with clear verb prefixes (`calculateCourseProgress`, `verifyCertificateCode`, `submitInquiryForm`).
  * Boolean Variables: Prefixed with `is`, `has`, `should`, or `can` (`isPublished`, `hasCompletedCourse`, `canRetakeAssessment`).
  * Global Constants & Environment Keys: UPPER_SNAKE_CASE (`MAX_ATTEMPTS_PER_DAY`, `DEFAULT_PAGE_SIZE`).

---

## 3. Directory Layout & File Organisation
Organize code cleanly following standard Next.js App Router and feature-driven conventions:

```text
src/ (or root app/)
├── app/                      # Next.js App Router pages and route handlers
│   ├── (auth)/               # Route group for login, register, reset-password
│   ├── (dashboard)/          # Route group for learner & admin dashboards
│   ├── (public)/             # Public pages (home, courses, articles, verify)
│   ├── api/                  # Webhook and external route handlers
│   ├── layout.tsx            # Root application layout
│   └── page.tsx              # Public home page
├── components/               # Reusable React components
│   ├── ui/                   # Primitive design system components (Button, Input, Card)
│   ├── layout/               # Header, Footer, Sidebar, Navigation
│   ├── courses/              # Course-specific components (CourseCard, LessonPlayer)
│   └── assessments/          # Quiz and assessment components
├── lib/                      # Shared libraries, utilities, and integrations
│   ├── supabase/             # Supabase client configurations (browser, server, middleware)
│   ├── validations/          # Zod input validation schemas
│   ├── utils/                # Pure utility functions (formatting, calculation)
│   └── certificates/         # Certificate hash generation and verification helpers
├── types/                    # Global TypeScript definitions and database models
└── styles/                   # Global CSS, design tokens, and Tailwind configuration
```

---

## 4. Component Design & Server vs. Client Components
* **Server Components by Default:** In Next.js App Router, all components are React Server Components (RSC) unless interactivity is required.
* **When to Use Client Components (`"use client"`):**
  * State management (`useState`, `useReducer`).
  * Lifecycle and side effects (`useEffect`).
  * Browser-only APIs (window, localStorage, media queries).
  * Direct user event listeners (`onClick`, `onChange`) on interactive widgets (e.g., quiz submission buttons, mobile navigation toggle).
* **Push Client Boundaries to the Leaves:** Keep parent layouts and data-fetching containers as Server Components. Wrap only the smallest interactive widget in a Client Component.

---

## 5. Separation of Concerns
* **Presentation Layer (Components):** Focus strictly on rendering UI and dispatching user actions. Do not embed direct database queries or raw SQL inside presentational components.
* **Business Logic Layer (Services & Server Actions):** Handle orchestrating data transformations, grading logic, and business rules.
* **Data Access Layer:** Encapsulate database interactions within typed Supabase helper functions or repository queries.

---

## 6. Input Validation & Error Handling
* **Zod for All Inputs:** Every Server Action, API route, and form input must parse data against a Zod schema before processing:
  ```typescript
  import { z } from 'zod';

  export const ContactFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().email("Please provide a valid email address"),
    message: z.string().min(10, "Message must be at least 10 characters").max(2000),
  });
  ```
* **Structured Error Returns:** Server Actions should avoid throwing unhandled exceptions to the client. Return structured result objects:
  ```typescript
  type ActionResult<T> = 
    | { success: true; data: T }
    | { success: false; error: string; fieldErrors?: Record<string, string[]> };
  ```
* **User-Facing Error Messages:** Error messages displayed to users must be polite, plain-language, and actionable. Never expose raw database stack traces or internal foreign-key error strings to the user.

---

## 7. Logging & Observability
* **Development vs. Production:**
  * In development, use structured logging helpers.
  * In production, strip debugging `console.log` statements.
* **No PII or Secret Leaks:** Never log email addresses, passwords, phone numbers, or authentication tokens into application logs.

---

## 8. Asynchronous Operations & Performance
* **Eliminate Waterfalls:** When fetching independent data sources, run them concurrently using `Promise.all`:
  ```typescript
  // Recommended concurrent fetching
  const [courseData, userEnrollment] = await Promise.all([
    getCourseBySlug(slug),
    getUserEnrollment(user.id, courseId),
  ]);
  ```
* **Async Error Containment:** Always handle promise rejections with `try/catch` or return structured results. Never leave unhandled promise rejections.

---

## 9. Accessibility (a11y) Standards
* Use semantic HTML elements (`<main>`, `<nav>`, `<article>`, `<section>`, `<aside>`, `<header>`, `<footer>`).
* Provide clear `alt` text for all informative images; use empty `alt=""` for decorative icons.
* Form inputs must have programmatically associated `<label>` elements via `htmlFor`.
* Ensure every clickable element is either a native `<button>` or `<a>` tag with appropriate `href` and keyboard interaction support.

---

## 10. Dependency Hygiene & Maintainability
* Prioritize native platform and runtime APIs over external npm packages.
* Inspect package size (`bundlephobia`) before adding any third-party dependency.
* Verify license compatibility (prefer MIT, Apache 2.0, or BSD).
* Regularly audit dependencies for vulnerabilities (`npm audit`).

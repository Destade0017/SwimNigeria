---
kind: frontend_style
name: Tailwind CSS v4 Design System with SwimNigeria Brand Tokens
category: frontend_style
scope:
    - '**'
source_files:
    - src/app/globals.css
    - postcss.config.mjs
    - package.json
    - docs/DESIGN_SYSTEM.md
    - src/components/ui/button.tsx
    - src/components/layout/site-header.tsx
---

## Approach

The SwimNigeria Next.js platform uses **Tailwind CSS v4** (via `@tailwindcss/postcss`) as its sole styling engine. There is no separate CSS framework, component library, or design-token generator — the system is defined directly in a single global stylesheet and consumed through Tailwind utility classes applied inline in JSX.

Key packages:
- `tailwindcss` ^4.3.3
- `@tailwindcss/postcss` ^4.3.3
- `postcss` ^8.5.3

No `tailwind.config.*` file exists; configuration is done via the CSS `@theme` block in `src/app/globals.css`, which is the Tailwind v4 token-registration pattern.

## Key Files

- `src/app/globals.css` — Single source of truth for brand tokens, theme variables, base styles, dialog backdrop, touch-action optimization, and `prefers-reduced-motion` rules.
- `postcss.config.mjs` — Registers only `@tailwindcss/postcss`; no other PostCSS plugins.
- `package.json` — Declares Tailwind v4 and PostCSS dependencies.
- `docs/DESIGN_SYSTEM.md` — Authoritative design-system documentation covering color strategy, typography scale, spacing grid, breakpoints, component specs, accessibility requirements, and the implemented UI primitives inventory.
- `src/components/ui/*.tsx` — Atomic UI primitives (`button.tsx`, `input.tsx`, `textarea.tsx`, `card.tsx`, `badge.tsx`, `skeleton.tsx`, `dialog.tsx`) that compose Tailwind utilities into typed components.
- `src/components/layout/site-header.tsx` — Representative layout component showing responsive breakpoint usage (`hidden md:flex`, `sm:inline-flex`).
- `src/lib/utils.ts` — Provides the `cn` utility (from `clsx` + `tailwind-merge`, standard in this codebase) used to merge variant/size class maps with user-supplied className.

## Architecture & Conventions

### Theme tokens
All visual tokens are declared in `src/app/globals.css` under an `@theme` block using CSS custom properties:

- **Brand Red**: `brand-red-50/100/600/700/800` — primary identity, CTAs, urgency.
- **Deep Neutrals**: `neutral-white/50/100/200/300/600/700/800/900` — surfaces, borders, text.
- **Aquatic Secondary**: `water-blue-50/100/600/700` — water metaphor accents, progress indicators.
- **Semantic Feedback**: `feedback-success` (#059669), `feedback-warning` (#D97706), `feedback-error` (#dc2626).
- **Custom easing tokens**: `--ease-out-cubic`, `--ease-spring` (noted as "Emil Design Engineering" tokens).

Base CSS variables `--background` and `--foreground` are set on `:root` and consumed by `body`.

### Typography
- No custom font family is registered in the `@theme` block; the body falls back to the system font stack: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.
- The documented plan calls for Plus Jakarta Sans / Inter and JetBrains Mono / Roboto Mono, but these are not yet wired into the build — the implementation currently uses the system font stack.

### Component composition
Atomic UI components live under `src/components/ui/` and follow a consistent shape:
- Props include typed `variant` and `size` enums (e.g., `ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "aquatic" | "danger"`, `ButtonSize = "sm" | "md" | "lg" | "icon"`).
- Variant and size style maps are plain `Record<T, string>` objects holding Tailwind class strings.
- Classes are composed via the `cn()` helper from `@/lib/utils`.
- Components expose `forwardRef` and set `displayName`.
- Accessibility attributes (`aria-busy`, `aria-hidden`, `aria-invalid`, `role="alert"`, `aria-describedby`) are baked into the primitives.

### Responsive strategy
Responsive behavior uses Tailwind's default breakpoints (`sm`, `md`, `lg`, `xl`) as documented in `docs/DESIGN_SYSTEM.md`:
- `sm` (640px): mobile landscape / phablet.
- `md` (768px): tablet portrait; navigation collapses to mobile drawer below this point.
- `lg` (1024px): laptop/tablet landscape; full desktop nav and sidebar layouts.
- `xl` (1280px): desktop; max container width 1200px centered.

Components use conditional class application (e.g., `hidden sm:inline-flex`, `hidden md:flex`) rather than media queries.

### Motion & accessibility
- Global `touch-action: manipulation` on interactive elements to prevent double-tap zoom delay.
- `dialog::backdrop` styled with `rgba(15, 23, 42, 0.65)` and `backdrop-filter: blur(2px)`.
- A `@media (prefers-reduced-motion: reduce)` rule globally zeroes animation/transition durations and forces `scroll-behavior: auto`.
- Components add `motion-reduce:*` variants (e.g., `motion-reduce:transform-none`, `motion-reduce:animate-none`) to opt out of animations per element.

### Zero third-party UI framework
Per `docs/DESIGN_SYSTEM.md`, the core UI primitives in `src/components/ui/` have "zero third-party UI framework dependencies." All styling is hand-authored Tailwind utility classes.

## Conventions & Constraints

Observed conventions (descriptive):
- All colors are referenced via the custom `brand-*`, `neutral-*`, `water-blue-*`, and `feedback-*` Tailwind aliases defined in `@theme`, never as raw hex values in component classes.
- Button variants and sizes are centralized in `Record` maps inside each component rather than ad-hoc class strings.
- Focus states consistently use `focus-visible:ring-2 focus-visible:ring-offset-2` with a ring color matching the component's semantic role.
- Touch targets are sized to at least 44–48px height across primitives.
- Skeleton loaders use `animate-pulse` paired with `motion-reduce:animate-none`.
- Dialogs use native HTML `<dialog>` with `aria-modal="true"` and browser-level focus trapping.

Documented constraints enforced by the design system spec (`docs/DESIGN_SYSTEM.md`):
- Color contrast must satisfy WCAG 2.1 AA: 4.5:1 for normal text, 3:1 for large text.
- Every text-to-background pairing must meet those ratios; legibility on mobile devices under harsh African sunlight is called out as non-negotiable.
- Form inputs require explicit labels above every input (never placeholder-only), `aria-invalid="true"` in error state, and descriptive error text beneath the input.
- Certificate verification pages must display a verbatim disclaimer statement that cannot be obscured by ornamentation.
- Animations must respect `prefers-reduced-motion`; micro-transitions should be 150–200ms ease-out.
- Anti-patterns explicitly forbidden: generic AI-template aesthetics, nested card-within-card clutter, unstyled default form controls, excessive resort/vacation tropes, low-contrast text on colored backgrounds.

Enforcement mechanisms:
- The `@theme` block in `globals.css` centralizes all color tokens, so adding new colors requires going through the token layer.
- The `prefers-reduced-motion` media query in `globals.css` is a hard global constraint that overrides any animation/transition.
- Prettier (`prettier --check .` / `prettier --write .`) enforces formatting consistency across the codebase (see `package.json` scripts and `.prettierrc`).
- ESLint (`eslint .`) runs via the `lint` script; while it does not specifically lint CSS class composition, it enforces project-wide linting standards.
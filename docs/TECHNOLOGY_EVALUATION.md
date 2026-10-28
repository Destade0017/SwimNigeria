# SwimNigeria — Technology Stack Evaluation & Recommendation

**Evaluation Date:** October 2026  
**Budget Constraint:** ₦0 Starting Capital (Zero initial expenditure)  
**Target Operating Profile:** Production-grade educational web application for Nigerian learners on mobile/desktop.

---

## 1. Executive Summary & Recommended Stack
Following a rigorous evaluation of architectural trade-offs, developer velocity, operational sustainability, and licensing terms on zero-cost tiers, the recommended provisional technology stack for SwimNigeria is:

* **Core Framework:** **Next.js 15+ (App Router)** with **TypeScript**
* **Styling & Design System:** **Tailwind CSS v4** with accessible primitives (Radix UI / Headless UI patterns)
* **Database & Storage:** **PostgreSQL** hosted on **Supabase Free Tier**
* **Authentication:** **Supabase Auth** via SSR cookies (`@supabase/ssr`)
* **Deployment & Edge Hosting:** **Vercel Hobby Tier** (for non-commercial initial educational phase) transitioning to **Cloudflare Pages** or **Vercel Pro** when commercial monetization (paid courses) begins.
* **Transactional Email:** **Resend Free Tier** (3,000 emails/month free)
* **Testing Framework:** **Vitest** (Unit/Integration) + **Playwright** (E2E) + **axe-core** (Accessibility)

---

## 2. In-Depth Comparative Evaluations

### 2.1 Web Application Framework
| Framework | Strengths | Weaknesses | Free-Tier / Cost Profile | Verdict |
| :--- | :--- | :--- | :--- | :--- |
| **Next.js (App Router)** | Hybrid SSR/SSG, Server Components (zero client JS for content), built-in image optimization, Server Actions for backend logic. | Framework churn, subtle caching mental model. | Open Source (MIT). Free hosting on Vercel/Cloudflare. | **RECOMMENDED** |
| **Vite + React SPA** | Fast local development, simple build pipeline. | Poor SEO for articles/courses, heavy client JS download on slow 3G, requires separate backend API server. | Open Source (MIT). | Rejected for primary web app due to SEO and low-bandwidth mobile limitations. |
| **Remix / React Router v7** | Excellent standard web forms and loaders. | Smaller ecosystem than Next.js; slightly higher hosting configuration overhead on edge. | Open Source (MIT). | Strong alternative, but Next.js offers superior image optimization and broader agent skill support. |
| **Astro** | Exceptional content performance (zero JS by default). | Complex state management for deeply interactive authenticated dashboards and quiz engines. | Open Source (MIT). | Ideal for static blogs, but less cohesive for an LMS with dynamic auth and assessments. |

*Official Docs:* [nextjs.org/docs](https://nextjs.org/docs) (Checked Oct 2026)

---

### 2.2 Styling & Design System
| Solution | Strengths | Weaknesses | Accessibility & Maintainability | Verdict |
| :--- | :--- | :--- | :--- | :--- |
| **Tailwind CSS v4** | Zero runtime overhead, utility classes purged at build time, strict token enforcement via design config, rapid iteration. | Can clutter JSX markup if not componentized. | High. Pairs seamlessly with accessible headless primitives. | **RECOMMENDED** |
| **Vanilla CSS / CSS Modules** | Zero dependencies, complete standard web platform alignment. | Slower development velocity, prone to inconsistent ad-hoc spacing and color drift. | Moderate. Requires manual discipline. | Acceptable, but Tailwind provides strictly superior token consistency across AI sessions. |
| **Chakra UI / MUI** | Pre-built components. | Heavy runtime CSS-in-JS overhead, large client bundle, difficult to customize to a unique brand identity. | Good out-of-the-box, but performance penalties on mobile. | Rejected due to bundle bloat. |

*Official Docs:* [tailwindcss.com/docs](https://tailwindcss.com/docs) (Checked Oct 2026)

---

### 2.3 Database & Backend Services
| Solution | Capabilities | Free-Tier Limits & Quotas | Commercial Use Terms | Verdict |
| :--- | :--- | :--- | :--- | :--- |
| **Supabase (PostgreSQL)** | Full relational PostgreSQL, native Row-Level Security (RLS), ACID compliance, connection pooling, automated backups, Auth, Storage. | 500MB database, 50,000 monthly active users, 2GB bandwidth. Auto-pauses after 7 days inactivity (mitigated via cron ping). | Permitted on Free Tier. No prohibition on commercial applications. | **RECOMMENDED** |
| **Firebase (Firestore)** | Easy realtime sync. | 1GB storage, 50k reads/day. Complex querying, non-relational progress tracking, no native RLS for complex multi-table joins. | Permitted. | Rejected due to relational modeling constraints. |
| **Neon Serverless Postgres** | Instant branching, scale-to-zero compute. | 0.5GB storage, 1 compute branch. Requires separate auth provider (e.g. Clerk/Auth0) which adds cost and complexity. | Permitted. | Viable alternative, but Supabase integrates Auth + DB + Storage under one free umbrella. |
| **Self-Hosted PostgreSQL** | Total control. | ₦0 requires a local server or free VPS (e.g., Oracle Cloud Free), but requires heavy DevOps, backup management, and patching. | Free. | Rejected due to maintenance overhead. |

*Official Docs:* [supabase.com/pricing](https://supabase.com/pricing) (Checked Oct 2026)

---

### 2.4 Authentication & Authorisation
| Solution | Integration Model | Free-Tier Terms & Security | Verdict |
| :--- | :--- | :--- | :--- |
| **Supabase Auth (`@supabase/ssr`)** | Built into database; sets secure HTTP-only cookies; PKCE flow; integrates directly with PostgreSQL RLS via `auth.uid()`. | Included free with Supabase up to 50,000 MAU. | **RECOMMENDED** |
| **Clerk** | Turnkey UI components, high polish. | Free up to 10,000 MAU, then jumps to $25+/month. Requires webhook synchronization to sync users to PostgreSQL. | High quality, but introduces an external point of failure and future cost risk. |
| **Auth.js (NextAuth)** | Open source, flexible adapters. | Free, but requires building and maintaining password hashing, email verification, and session tables manually. | Acceptable, but Supabase Auth provides turnkey security with zero maintenance. |

*Official Docs:* [supabase.com/docs/guides/auth](https://supabase.com/docs/guides/auth) (Checked Oct 2026)

---

### 2.5 Hosting & Deployment Platforms: The Commercial-Use Critical Analysis

> **CRITICAL LEGAL & OPERATIONAL AUDIT: Free-Tier Commercial Restrictions**

Many developers assume any free hosting tier can host a commercial client application indefinitely. A careful audit of terms reveals critical distinctions:

1. **Vercel Hobby Tier:**
   * *Pricing:* $0/month.
   * *Terms of Service:* Under Vercel's Fair Use Policy, the Hobby plan is explicitly intended for **personal, non-commercial use**. While educational, non-profit, and open community projects typically operate without issue during development and launch, launching monetized paid courses or corporate client engagements on Vercel Hobby violates Vercel's commercial terms.
   * *Implication for SwimNigeria:* During Phase 0 through Phase 9 (free education, zero transaction revenue), Vercel Hobby is legally viable and technically ideal. However, once paid courses or commercial transactions are activated, SwimNigeria must either upgrade to Vercel Pro ($20/month) or deploy on Cloudflare Pages.
2. **Cloudflare Pages:**
   * *Pricing:* $0/month.
   * *Terms of Service:* Cloudflare Pages **explicitly permits commercial use on its free tier**. There is no prohibition against hosting commercial or business websites.
   * *Quotas:* Unlimited bandwidth, unlimited total requests, 500 builds/month, 100k edge function requests/day.
   * *Implication for SwimNigeria:* Cloudflare Pages provides a 100% legally compliant, zero-cost fallback for commercial operations.
   * *Runtime Consideration for Certificate Generation:* Cloudflare Pages executes Server Actions and Route Handlers on the Cloudflare Workers edge runtime (V8 isolates), not a standard Node.js serverless container. Libraries like `@react-pdf/renderer` rely on Node.js stream and canvas modules and fail on edge workers. If Cloudflare Pages is selected, an edge-compatible solution like `pdf-lib` (pure JavaScript) or client-side SVG rendering must be evaluated and verified.
3. **Netlify Starter Tier:**
   * *Pricing:* $0/month.
   * *Terms of Service:* Netlify permits commercial use on its free tier, but imposes strict bandwidth limits (100GB/month) and build minute caps (300 mins/month), after which overages are billed automatically.

**Recommendation & Linked Architecture Decision:**
* Deploy initially to **Vercel Hobby** (Node.js serverless runtime) for staging and free-tier educational launch, or **Cloudflare Pages** for zero-cost commercial compliance.
* **Coupled Architecture Decision:** Hosting choice and PDF certificate generation implementation are strictly linked:
  * If hosted on Vercel: Standard Node.js Serverless Functions support `@react-pdf/renderer`.
  * If hosted on Cloudflare Pages: Must use edge-compatible PDF tooling (e.g. `pdf-lib`) or client-side SVG rendering.
* This decision will be finalized prior to Phase 8 (Certificate Generation) without prematurely locking the project into a single provider or installing premature PDF dependencies now.

*Official References:*
* Vercel Fair Use Policy: [vercel.com/legal/fair-use-policy](https://vercel.com/legal/fair-use-policy) (Checked Oct 2026)
* Cloudflare Pages Pricing & Terms: [developers.cloudflare.com/pages/platform/pricing/](https://developers.cloudflare.com/pages/platform/pricing/) (Checked Oct 2026)

---

### 2.6 Video Content Delivery (Bandwidth Analysis)
* Direct hosting of video files (MP4/HLS) on Supabase Storage or AWS S3 will rapidly exceed free bandwidth quotas (e.g. 50 students watching a 100MB video = 5GB bandwidth, incurring immediate overages).
* **Recommended Strategy:** Host instructional video assets on **YouTube (Unlisted)** or **Vimeo Free**. Embed using lightweight, privacy-friendly facades (`lite-youtube-embed`).
  * Bandwidth cost: **₦0**.
  * Video CDN infrastructure: Google Global CDN.
  * Adaptive bitrate: Automatically scales between 144p and 1080p based on mobile network strength.

---

### 2.7 Transactional Email Delivery
* **Resend:**
  * Free quota: 3,000 emails/month, 100 emails/day.
  * Developer experience: High; official React Email support.
  * Commercial terms: Permitted on free tier.
  * Cost: **₦0**.
* *Official Docs:* [resend.com/pricing](https://resend.com/pricing) (Checked Oct 2026)

---

## 3. Final Recommendation Summary Table

| Category | Recommended Choice | Primary Rationale |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 15+ (App Router) | Server Components for low-bandwidth mobile performance; excellent SEO for articles. |
| **Language** | TypeScript (Strict Mode) | Full-stack end-to-end type safety, preventing runtime errors in grading and enrollment. |
| **Styling** | Tailwind CSS v4 | Zero runtime CSS overhead, rapid design system token implementation. |
| **Database** | PostgreSQL via Supabase | Native RLS for bulletproof authorization, ACID transactions, free tier sustainability. |
| **Authentication** | Supabase Auth (`@supabase/ssr`) | Secure HttpOnly cookie handling, PKCE flow, tight integration with database roles. |
| **Video Delivery** | Unlisted YouTube Embeds | ₦0 bandwidth cost, world-class adaptive streaming on Nigerian networks. |
| **Email Service** | Resend | 3,000 free emails/month, high deliverability. |
| **Hosting** | Vercel (Launch) / Cloudflare Pages (Commercial) | Edge CDN, instant preview deployments, zero server maintenance costs. |

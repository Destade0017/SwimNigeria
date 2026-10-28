# SwimNigeria — Product Requirements Document (PRD)

## 1. Introduction & Overview
This document specifies the functional, behavioral, and non-functional requirements for the SwimNigeria platform. SwimNigeria is an educational web application providing structured swimming instruction, water safety guides, and verifiable certification to Nigerian learners.

---

## 2. User Roles & Personas
* **Anonymous Guest:** Any unauthenticated web visitor seeking swimming information, safety articles, or course exploration.
* **Registered Learner:** An authenticated user who enrolls in courses, tracks lesson progress, takes assessments, and earns certificates.
* **Administrator (Founder):** An authenticated platform manager with elevated access to review platform analytics, manage course metadata, inspect learner records, and handle contact inquiries.
* **Future Role — Instructor (Post-MVP):** Certified swimming educators permitted to author courses and evaluate practical submissions.

---

## 3. Detailed Feature Requirements

### 3.1 Public Website & Brand Hub
* **Purpose:** Establish a professional, credible digital identity for SwimNigeria, articulate its aquatic education mission, and guide visitors toward courses and articles.
* **Expected Behaviour:**
  * Clean, fast-loading landing page presenting value propositions, key statistics on water safety, featured courses, recent articles, and founder bio.
  * Clear calls-to-action (CTAs) directing users to "Start Learning" or "Explore Courses".
  * Global header with navigation links (Home, Courses, Articles, About, Contact, Login/Register).
  * Global footer with links to social channels (WhatsApp, Instagram), legal policies, and disclaimer.
* **Permissions:** Public (Accessible to all users).
* **Edge Cases:** Slow 3G connections; aggressive data-saver browser modes (e.g., Opera Mini, Chrome Data Saver).
* **Acceptance Criteria:**
  * Lighthouse Performance and Accessibility scores $\ge 90$ on mobile.
  * Visual assets optimized under 150KB for key initial viewport.
  * Zero layout shifts (CLS $< 0.1$).
* **Dependencies:** None.

---

### 3.2 Course Catalogue
* **Purpose:** Showcase the launch inventory of 3 to 5 beginner swimming and water safety courses.
* **Expected Behaviour:**
  * Grid display of published courses featuring course title, brief summary, estimated duration, difficulty tag (e.g., "Beginner", "Foundational"), and enrollment count.
  * Individual course detail page displaying comprehensive syllabus, learning outcomes, lesson breakdown, prerequisites, and enrollment CTA.
  * Courses marked as "Draft" or "Archived" must be hidden from the public catalogue.
* **Permissions:** Public view; Admin can view draft courses.
* **Edge Cases:** Catalogue filter when 0 courses match query; course details accessed when course is unpublished.
* **Acceptance Criteria:**
  * Course detail page renders complete syllabus without requiring user to log in.
  * Enrolled users see a dynamic "Continue Course" CTA instead of "Enroll Now".
* **Dependencies:** Database courses table.

---

### 3.3 Public Educational Articles
* **Purpose:** Disseminate vital swimming techniques, drowning prevention guidelines, and aquatic safety advice to the public.
* **Expected Behaviour:**
  * Blog/article directory listing published posts with title, excerpt, publication date, reading time estimate, and topic tags.
  * Clean, readable article detail view formatted with high typographic clarity, structured headings, and callout safety boxes.
* **Permissions:** Public (No login required).
* **Edge Cases:** Deep-linking to non-existent slug returns 404 with helpful return link; long article text wraps properly on small 320px screens.
* **Acceptance Criteria:**
  * Articles render semantic HTML elements (`<article>`, `<header>`, `<footer>`).
  * Proper OpenGraph meta tags generated for social sharing (WhatsApp/Twitter/Facebook preview cards).
* **Dependencies:** None.

---

### 3.4 Registration & Authentication
* **Purpose:** Allow learners to securely create accounts, authenticate sessions, and maintain profile information.
* **Expected Behaviour:**
  * Email and password registration with field validation (valid email format, minimum 8 characters password).
  * Optional social login (e.g., Google OAuth) if configured.
  * Email confirmation flow to verify address validity.
  * Secure login with password reset mechanism ("Forgot Password" link).
  * Session persistence across browser reloads using secure HTTP-only cookies.
  * User profile management: full name (used for certificate issuance), avatar/initials, and password update.
* **Permissions:** Anonymous users for sign-up/login; Authenticated users for profile management.
* **Edge Cases:** Attempting registration with already registered email; expired or invalid password reset tokens; unconfirmed email attempting access.
* **Acceptance Criteria:**
  * Password strength validated on client and re-verified on server.
  * All authentication state changes update navigation header immediately.
  * Full name field explicitly warns that it will appear on earned certificates.
* **Dependencies:** Authentication provider (Supabase Auth).

---

### 3.5 Course Enrolment
* **Purpose:** Link a learner to a specific course to begin tracking instructional progress.
* **Expected Behaviour:**
  * Authenticated user clicks "Enroll in Course" on any free published course.
  * System creates an enrollment record and initializes lesson progress states.
  * User is immediately redirected to the first lesson of the enrolled course.
  * If an unauthenticated user clicks "Enroll", they are redirected to login/registration with an `onboarding` return URL.
* **Permissions:** Registered Learners.
* **Edge Cases:** User clicks enroll multiple times in rapid succession (idempotent handling); user attempts to enroll in an unpublished course.
* **Acceptance Criteria:**
  * Enrollment is idempotent (duplicate enrollments for the same user and course are prevented by database constraints).
  * User cannot enroll in draft courses unless user has Admin role.
* **Dependencies:** Registration & Authentication (3.4), Course Catalogue (3.2).

---

### 3.6 Course Lessons, Media & Resources
* **Purpose:** Deliver structured educational material through readable text, step-by-step instructions, diagrams, and video demonstrations.
* **Expected Behaviour:**
  * Sequential lesson navigation within a course (Previous Lesson, Mark as Completed, Next Lesson).
  * Embedded instructional videos using lightweight responsive video wrappers (e.g., YouTube unlisted embeds or Vimeo).
  * Downloadable reference materials (e.g., printable safety checklists, cheat sheets).
  * Persistent sidebar or mobile drawer displaying the course outline with visual progress markers.
* **Permissions:** Enrolled Learners and Admins.
* **Edge Cases:** Unenrolled user attempts direct URL access to a non-preview lesson (must prompt enrollment or return 403); video fails to load due to network restriction (fallback text instructions must remain accessible).
* **Acceptance Criteria:**
  * All lessons provide written textual instructions accompanying any video content.
  * Video embeds do not block page rendering or exceed mobile container widths.
* **Dependencies:** Course Enrolment (3.5).

---

### 3.7 Progress Tracking
* **Purpose:** Record and display the learner's journey through each course to foster motivation and determine eligibility for certification.
* **Expected Behaviour:**
  * Learner clicks "Mark as Complete & Continue" at the conclusion of a lesson.
  * System updates `lesson_progress` table and recalculates overall course completion percentage.
  * Progress is displayed in real-time on the course player and student dashboard.
* **Permissions:** Enrolled Learners (own progress only), Admins (view all progress).
* **Edge Cases:** Marking an already completed lesson complete (no duplicate state or error); completing lessons out of order (permitted if curriculum is non-linear, but final assessment requires all prerequisite lessons completed).
* **Acceptance Criteria:**
  * Course progress reaches 100% only when all required lessons are completed and mandatory assessments are passed.
  * Progress updates persist accurately across sessions and devices.
* **Dependencies:** Course Lessons (3.6).

---

### 3.8 Quizzes & Final Assessments
* **Purpose:** Verify knowledge comprehension and ensure learners understand core safety principles before certificate issuance.
* **Expected Behaviour:**
  * Multiple-choice questions (single select or multiple select) with randomized answer choices.
  * Immediate feedback on formative practice quizzes with explanatory guidance for wrong answers.
  * Summative Final Course Assessment required at the end of each course:
    * Server-side grading (correct answers are never sent to the client bundle).
    * Explicit passing threshold required to unlock certificate (see Unresolved Decisions for exact score).
    * Attempt logging with timestamps and calculated score.
* **Permissions:** Enrolled Learners.
* **Edge Cases:** Network failure during assessment submission; user attempts to submit answers multiple times; user attempts to bypass grading via modified API payload.
* **Acceptance Criteria:**
  * Grading occurs exclusively on the server.
  * Quiz state records pass/fail status and unlocks certificate issuance upon passing.
* **Dependencies:** Progress Tracking (3.7).

---

### 3.9 Certificates & Online Verification
* **Purpose:** Issue a permanent, verifiable credential of completion that learners can download, share, and present to third parties.
* **Mandatory Safety & Educational Disclaimer:**
  * To prevent life-safety risks and legal misrepresentation, every generated certificate and public verification view must explicitly state the nature and limits of the credential.
  * The following disclaimer must appear verbatim, clearly and legibly (not hidden in fine print or omitted on mobile viewports):
  > "Certificate of Theoretical Course Completion: This credential validates completion of digital coursework and water safety knowledge. It does not certify physical swimming competence, water survival capability, or lifeguarding qualification without practical, in-person assessment by a certified aquatic instructor."
  * The platform, certificate text, and verification portal must never state or imply that completing online lessons establishes practical in-water swimming competence. The distinction between theoretical aquatic safety learning and practical physical qualification must remain explicit throughout.
* **Expected Behaviour:**
  * Upon passing the final assessment and completing 100% of lessons, a certificate record is automatically minted.
  * System generates a unique, non-sequential verification identifier (e.g., `SN-2026-XXXXXX` backed by a cryptographic UUID).
  * Learner can download the certificate as a vector-quality PDF or share a public link. Both formats must prominently render the verbatim mandatory disclaimer.
  * Public Verification Portal (`/verify/[certificateId]`):
    * Anyone (employer, parent, school) can enter the certificate ID or scan a QR code.
    * Portal displays recipient name, course title, completion date, certificate status (Valid / Revoked), issuing authority signature, and the mandatory verbatim disclaimer.
* **Permissions:** Certificate generation: System-only trigger for qualified learner; Verification portal: Public.
* **Edge Cases:** Tampered or non-existent certificate ID displays clear "Invalid Certificate" warning; revoked certificate displays clear revocation notice and timestamp.
* **Acceptance Criteria:**
  * Verification URL loads independently of learner authentication.
  * Certificate PDF renders cleanly on standard A4 / Letter proportions without layout distortion, displaying the verbatim disclaimer with high visual clarity.
  * Public verification page displays the verbatim disclaimer on all screen sizes, including mobile devices.
* **Dependencies:** Assessments (3.8), Learner Profile (3.4).

---

### 3.10 Student Dashboard
* **Purpose:** Centralized personal command center for learners.
* **Expected Behaviour:**
  * Summary cards showing: In-progress Courses, Completed Courses, Certificates Earned.
  * Quick-resume links to jump directly to the last active lesson.
  * Certificate showcase with direct download and share options.
  * Profile settings access (name, email, security).
* **Permissions:** Authenticated Learners (own data only).
* **Edge Cases:** New learner with 0 enrollments sees an engaging empty state with a "Browse Courses" button.
* **Acceptance Criteria:**
  * Dashboard loads learner data in $< 500$ms under normal network conditions.
  * Row-level security strictly guarantees learners cannot view another user's dashboard data.
* **Dependencies:** Enrolment (3.5), Certificates (3.9).

---

### 3.11 Administrator Dashboard
* **Purpose:** Empower the founder to oversee platform activity, track course engagement, and inspect learner records.
* **Expected Behaviour:**
  * Platform overview metrics: Total registered learners, active enrollments, course completion rates, total certificates issued.
  * Learner management table: View user details, course enrollment dates, assessment scores, and certificate links.
  * Inquiries inbox: Review messages submitted through the contact form with status markers (Unread / Read / Resolved).
* **Permissions:** Administrator role only (strictly enforced via server-side role check and database RLS).
* **Edge Cases:** Non-admin attempts direct access to `/admin` route (must return 404 or redirect with 403 Forbidden).
* **Acceptance Criteria:**
  * Administrative access verified via database role check, never client-side claims.
  * Administrative actions logged in an audit trail table.
* **Dependencies:** Authentication (3.4), Database Design (all tables).

---

### 3.12 Contact & Support System
* **Purpose:** Facilitate direct communication between prospective learners, community members, and the founder.
* **Expected Behaviour:**
  * Web Contact Form: Name, Email, Optional Phone Number, Topic selector, and Message textarea with server-side validation.
  * Direct Channel Links:
    * WhatsApp click-to-chat button with pre-filled introductory message.
    * Instagram profile direct link.
    * Official contact email mailto link.
  * Successful web form submission sends email notification to founder and shows instant confirmation to the sender.
* **Permissions:** Public.
* **Edge Cases:** Spam submissions (mitigated by honeypot field and server-side IP rate limiting); email delivery failure (record stored in database regardless of delivery outcome).
* **Acceptance Criteria:**
  * Contact form enforces rate limits (max 3 submissions per IP per 10 minutes).
  * Web inquiries are permanently recorded in `contact_enquiries` database table.
* **Dependencies:** Email service (Resend / SMTP).

---

### 3.13 Basic Analytics & Privacy Compliance
* **Purpose:** Measure platform adoption without violating user privacy or running afoul of Nigerian Data Protection Regulations (NDPR).
* **Expected Behaviour:**
  * Lightweight, privacy-respecting page view and event counting (zero cross-site tracking, zero third-party tracking cookies).
  * Core events tracked: Page view, Course enrollment, Lesson completion, Quiz attempt, Certificate download.
* **Permissions:** Anonymous and Authenticated users.
* **Acceptance Criteria:**
  * Compliant with NDPR principles; privacy policy explicitly details collected data.
* **Dependencies:** None.

---

### 3.14 Non-Functional Requirements

#### Responsiveness
* Mobile-first design architecture supporting screen resolutions from 320px (compact smartphones) through 2560px (desktop monitors).
* Touch-friendly hit targets (minimum $48 \times 48\text{px}$ for interactive elements).

#### Accessibility (a11y)
* Full compliance with **WCAG 2.1 Level AA** standards.
* Proper color contrast ratios (minimum 4.5:1 for body text, 3:1 for large headers and interactive components).
* Full keyboard navigability (visible focus indicators, logical tab ordering, skip-to-content links).
* Screen-reader semantic landmarks (`<main>`, `<nav>`, `<aside>`, `<header>`, `<footer>`).

#### Performance & Bandwidth Efficiency
* JavaScript bundle size strictly managed ($< 120\text{KB}$ initial compressed JS bundle).
* Next.js image optimization for all banners, illustrations, and course thumbnails.
* Font optimization using modern web font subsets (WOFF2) with `font-display: swap`.

---

## 4. Future Paid-Course Support (Architectural Readiness)
While Phase 1 courses are 100% free, the data model and architecture must accommodate future monetization:
* Courses entity must feature `price_cents` / `price_kobo` and `is_free` boolean.
* Enrolment entity must support `payment_reference` and `payment_status` (e.g., `free`, `pending`, `paid`, `refunded`).
* Webhook routing patterns must be planned for Paystack/Flutterwave event consumption without requiring schema restructuring.

---

## 5. Explicitly Unresolved Business Decisions (Pending Founder Input)
The following decisions must be clarified by the founder before Phase 6 & Phase 7 implementation:
1. **Assessment Passing Threshold:** Exact passing score percentage (provisional assumption: 75%).
2. **Assessment Retake Policy:** Maximum allowed assessment attempts per 24-hour period (provisional assumption: unlimited with a 15-minute cooldown between attempts).
3. **Official Support Channels:** Specific WhatsApp telephone number and Instagram account handle.
4. **Certificate Signatory:** Official title and authorized digital signature name for the certificate issuer.

# SwimNigeria — Known Limitations, Assumptions & Risk Register

This document tracks unresolved business requirements, unverified technical assumptions, hosting limitations, and risks. It is maintained with total transparency to prevent unverified assumptions from being mistaken for settled facts.

---

## 1. Undecided Business Requirements (Awaiting Founder Input)

| Item | Current Status | Impact on Development | Target Resolution Phase |
| :--- | :--- | :--- | :--- |
| **Legal Entity Structure** | Unconfirmed whether registered under CAC as a Business Name, Company, or Incorporated Trustee (NGO). | Affects terms of service, privacy policy statements, and future payment gateway KYC. | Phase 11 |
| **Official Domain Name** | Unregistered (Candidates: `swimnigeria.org`, `swimnigeria.ng`, `swimnigeria.com`). | Required for production DNS, SSL, and absolute verification URLs. | Phase 1 |
| **Assessment Passing Score** | Provisionally assumed at 75%. | Dictates final exam pass/fail logic and certificate eligibility. | Phase 7 |
| **Assessment Retake Limit** | Provisionally assumed unlimited retakes with a 15-minute cooldown. | Affects quiz anti-cheat rules and attempt logging. | Phase 7 |
| **Official Support Numbers** | Placeholder numbers in `.env.example` (`+2348000000000`). | Required for live WhatsApp click-to-chat integration. | Phase 10 |
| **Certificate Signatory Name** | Founder's legal name and professional designation not yet finalized for certificate template. | Required for SVG/PDF certificate visual template. | Phase 8 |

---

## 2. Unverified Technical Assumptions

1. **Nigerian Mobile Carrier Bandwidth & Latency:**
   * *Assumption:* Mobile users will have sufficient bandwidth to stream 720p/480p video embeds via YouTube.
   * *Risk:* Fluctuating 2G/3G connectivity in rural or riverine areas may cause buffering.
   * *Mitigation:* Ensure every video lesson is accompanied by a full, readable text transcript and illustrative diagrams so learners can study without video.
2. **Third-Party Video Availability:**
   * *Assumption:* YouTube will remain accessible without government or ISP throttling.
   * *Risk:* If YouTube is blocked or restricted, video embeds will fail.
   * *Mitigation:* Abstract the video player interface so alternative platforms (e.g., Vimeo, Cloudflare Stream) can be swapped via a simple URL configuration.
3. **Email Deliverability on Free Resend Tier:**
   * *Assumption:* Free-tier Resend transactional emails will reach Nigerian learner inboxes (Gmail, Yahoo, iCloud) without spam-filtering.
   * *Risk:* Custom domain DNS records (SPF, DKIM, DMARC) must be configured correctly; otherwise, confirmation emails may land in spam folders.
   * *Mitigation:* Provide resend verification links and test delivery across all major providers during Phase 10.

---

## 3. Hosting & Free-Tier Quota Limitations

1. **Supabase Auto-Pause on Inactivity:**
   * Free-tier Supabase projects are automatically paused after 7 days of inactivity. If paused, the public website would throw database connection errors.
   * *Mitigation:* Implement a lightweight automated ping via GitHub Actions or Vercel Cron every 48 hours to prevent idle shutdown.
2. **Supabase 500MB Database Storage Limit:**
   * Sufficient for text data, but will not accommodate user-uploaded videos or high-resolution images in database rows.
   * *Mitigation:* Store media assets externally (YouTube for video, optimized cloud buckets or edge CDN for images).
3. **Vercel Hobby Tier Commercial Policy:**
   * Vercel's Hobby Tier Terms of Service designate the tier for personal or non-commercial projects.
   * *Mitigation:* If SwimNigeria transitions to accepting commercial revenue or paid courses, migration to Vercel Pro ($20/month) or Cloudflare Pages (which permits commercial use on its free tier) must be executed.
4. **Resend Free Tier Rate Limit (100 emails/day):**
   * High registration spikes exceeding 100 learners in a single day could delay transactional emails.
   * *Mitigation:* Monitor email volume and queue non-critical notifications if threshold approaches.

---

## 4. Missing Credentials & Integrations (Phase 0 State)
* No live Supabase project has been provisioned yet (only placeholder keys exist in `.env.example`).
* No live Resend API key has been created.
* No payment gateway credentials (Paystack / Flutterwave) exist.
* No Google OAuth credentials have been generated.

---

## 5. Security Risks Requiring Further Assessment
* **Certificate Forgery via Image Manipulation:** While the digital code on `/verify/[code]` is cryptographically tamper-evident, a bad actor could theoretically Photoshop their name onto an exported PDF certificate.
  * *Countermeasure:* The public verification URL must be clearly highlighted on the certificate with instructions stating: *"This document is only valid if verified online at swimnigeria.org/verify/[code]"*.
* **Rate Limiting on Free Serverless:** Free hosting tiers have soft concurrency limits. A malicious automated DDoS attack could exhaust free-tier serverless invocations.
  * *Countermeasure:* Configure Cloudflare free-tier WAF and DDoS protection in front of the application domain.

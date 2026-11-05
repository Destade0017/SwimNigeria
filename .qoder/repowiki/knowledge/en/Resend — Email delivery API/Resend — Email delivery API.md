---
kind: external_dependency
name: Resend — Email delivery API
slug: resend
category: external_dependency
category_hints:
    - vendor_identity
scope:
    - '**'
source_files:
    - .env.example
    - README.md
---

### Identity
Resend is the selected email-delivery provider for SwimNigeria.

### Role in this repo
- Provisioned via `RESEND_API_KEY` in `.env.example` and documented as "Email Delivery (Provisional: Resend)".
- README states the free tier is 3,000 emails/month.
- No application code wiring is present yet (Phase 1 is scaffolding only); integration point will be under `src/lib/` when email functionality is implemented.
---
kind: external_dependency
name: YouTube — Unlisted video hosting
slug: youtube
category: external_dependency
category_hints:
    - vendor_identity
scope:
    - '**'
source_files:
    - README.md
---

### Identity
YouTube is the chosen video-hosting platform for SwimNigeria's course lessons.

### Role in this repo
- README specifies "Unlisted YouTube Embeds with privacy facades" so bandwidth egress costs are ₦0 (zero) — the app embeds rather than hosts video.
- This is a content-delivery dependency; the actual embed logic is expected to live in course lesson UI components once Phase 2+ builds them.
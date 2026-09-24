# Remote sync — gated backlog (not implemented)

Recommendation remains: **do not build auth or remote sync** until `docs/REVIEW-PACKET.md` is signed by the named humans.

This file is a holding area so the idea is not lost and so a later agent does not “helpfully” add a server.

## Why it is blocked

- Mission 09 and the waitlist promise a privacy-respecting log that does not sell data and is not a released product.
- The current APK has **no** `INTERNET` permission. Adding sync would be a new capability claim.
- Site Phase 5 required product, privacy, security, legal, and health review before any capability claim.
- The 2026-08-13 MyPersonas app specs (community, FHIR, risk tiers) are **unapproved**.

## If reviews later say “yes, sync”

Minimum shape (do not implement now):

- Opt-in only; default remains on-device
- End-to-end encryption or a documented threat model
- Same schema: observations, not measurements; reject clinical/sensor keys
- Export/import remains the recovery path when keys change
- No community feed, no Amber/Red browsing, no FHIR until those specs are separately approved
- Adults 21+
- A real deletion path on the server, not only local wipe

Until then, the implementation in `mobile/` must stay local.

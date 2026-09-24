# Noo YouNiverse — mobile observation-log roadmap

Updated: 2026-09-24 · Owner: Christian · Persona: Cillian / Noo YouNiverse  
Companion to MyPersonas `nooyouniverse.com/SITE-ROADMAP.md` (site Phase 3 live; Package A still unapproved).

This file tracks the **private debug tracker**, not a store product. Public Mission 09 remains an unbuilt-product concept.

## Cursor-completable product work — finished

| Item | State |
|---|---|
| Approved-mission catalog from `public/log.html` (01–11) | ✅ |
| Context + uncertainty + observations, including Mission 06 `stayedComparable` | ✅ |
| History, search, mission/outcome filters | ✅ |
| Edit with append-only correction history | ✅ |
| Delete one entry + wipe all on-device notes | ✅ |
| Validated export/import | ✅ |
| Persistence across relaunch (web) | ✅ |
| Persistence after Android force-stop (emulator) | ✅ 2026-09-24 `emulator-persistence.sh` |
| 21+ / not-medical first-run acknowledgment | ✅ |
| Unreadable-store recovery | ✅ |
| Observations kept distinct from measurements | ✅ |
| Fixtures isolated from shipped UI | ✅ |
| Android `allowBackup=false` | ✅ |
| PWA / iOS home-screen path | ✅ `docs/IOS-HOME-SCREEN.md` |
| Owner sideload playbook | ✅ `docs/DEVICE-INSTALL.md` |
| Human review packet (unsigned) | ✅ `docs/REVIEW-PACKET.md` |
| Store listing drafts — not submitted | ✅ `docs/STORE-LISTING-DRAFT.md` |
| Remote sync explicitly gated, not built | ✅ `docs/SYNC-BACKLOG.md` |
| Public waitlist / Mission 09 unchanged | ✅ |
| Unit tests | ✅ `cd mobile && npm test` |
| Headless Chrome smoke | ✅ `npm run smoke` |
| Installable Android debug APK | ✅ `mobile/dist/noo-observation-log-debug.apk` |

## Recommendations — what was done vs still human

| Recommendation | Cursor action this pass | Still needs a human |
|---|---|---|
| Owner phone install + process death | Playbook + **emulator** force-stop probe passed | Your phone (and export first if signing differs) |
| Privacy / legal / health review | Unsigned packet with data inventory and sign-off table | Named reviewers; Cursor did **not** sign |
| Auth / remote sync | Documented why it stays out; no server added | Packet sign-off first |
| No community / FHIR / sensors / dosing | Still not implemented | Do not approve those specs here |
| iOS IPA / TestFlight / store submit | Listing drafts only; no Xcode; **not submitted** | Mac + you press Submit later |
| Merge / deploy | Not done | You, after review |
| Local phone prototypes | Not accessed | Export/import if you compare installs |

## Still blocked

- Physical owner device (this checkout is not your phone)
- Named health-claim approver
- Signed release keystores / IPA
- Store upload (accounts verified; submissions later)
- Merge to `main` / Cloudflare deploy
- Mission 12 still a draft PR, not catalog canon

## Evidence log

| Check | Result | Notes |
|---|---|---|
| `cd mobile && npm test` | ✅ | Catalog 01–11; corrections; wipe; filters; recovery |
| `cd mobile && npm run smoke` | ✅ | Gate → save → reload → `heartRate` rejected |
| Emulator force-stop persistence | ✅ 2026-09-24 | Seed count 1 → force-stop → dump still `noo-private-observation-log` observation |
| Android debug APK | ✅ | `mobile/dist/noo-observation-log-debug.apk` |
| Play / App Store submit | ❌ not done | Drafts only |
| Owner phone | ❌ not in this checkout | Use `docs/DEVICE-INSTALL.md` |

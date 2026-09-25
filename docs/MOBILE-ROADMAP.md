# Noo YouNiverse — mobile observation-log roadmap

Updated: 2026-09-25 (installable PWAs + three-icon APK) · Owner: Christian · Persona: Cillian / Noo YouNiverse  
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
| Check hub of every site/app to verify | ✅ `mobile/web/hub.html` |
| Offline snapshot of `public/` in the APK | ✅ `npm run bundle-site` |
| Live-site PWA files for Chrome Add to Home screen | ✅ installable manifest + maskable icons + SW on all pages (live after human deploy; production manifest is still 404) |
| Phone checklist | ✅ `docs/PHONE-CHECKLIST.md` |
| Three Android launcher apps from one APK (site + log + hub) | ✅ |

## Recommendations — what was done vs still human

| Recommendation | Cursor action this pass | Still needs a human |
|---|---|---|
| Owner phone install + process death | Hub APK + offline site + playbook + emulator probe | Your phone: sideload + Chrome Add to Home screen |
| Live website as a browser app | PWA files + `docs/ANDROID-HOME-SCREEN.md` | You tap Add to Home screen; merge/deploy for full PWA |
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
| `cd mobile && npm test` | ✅ 2026-09-25 | 21/21 including PWA install fields |
| `cd mobile && npm run smoke` | ✅ | Gate → save → reload → `heartRate` rejected |
| Emulator force-stop persistence | ✅ 2026-09-24 | Seed count 1 → force-stop → dump still `noo-private-observation-log` observation |
| Android debug APK | ✅ | `mobile/dist/noo-observation-log-debug.apk` |
| Play / App Store submit | ❌ not done | Drafts only |
| Owner phone | ⚠️ APK + steps in Drive | https://drive.google.com/drive/folders/1sAyTL0yxwY8SpEpfpHBnXpR8w0nOAway — you tap Install |

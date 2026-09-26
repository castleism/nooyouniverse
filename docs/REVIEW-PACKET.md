# Review packet — private observation log (debug)

**Status:** prepared for named humans. **Not signed.** Cursor is not a privacy officer, lawyer, or clinician. The site roadmap still has **no named human health-claim approver**. This packet exists so those reviews can happen; it does not replace them.

**Do not** change the public waitlist or Mission 09 to claim a released product until this packet is actually reviewed.

## What to review

| Track | Question for the named reviewer | App fact (verify in source) |
|---|---|---|
| Product | Is an on-device debug log allowed to exist without being called a released product? | `mobile/` is unpublished to stores; `public/index.html` waitlist still says the tracker is not built as a product |
| Privacy | What personal data is stored, where, and who can read it? | Observations + 21+ ack in WebView `localStorage`. Android `allowBackup=false`. No `INTERNET` permission. No analytics. Export is user-initiated JSON |
| Security | Are there sensors, accounts, or unexpected IPC? | No sensors. Debug-only `noo_debug_cmd` seed/dump intents when `BuildConfig.DEBUG`. File export/import via Storage Access Framework |
| Legal / FTC / labeling | Does UI copy look like a health claim, treatment, or “clinically proven” tool? | Banner, gate, and export envelope say observations ≠ measurements; educational only; Cillian is fictional |
| Health / safety | Could a reasonable person use this as a medical record or dosing log? | Schema **rejects** vitals, doses, diagnoses, sensors. Null results are first-class. Uncertainty is user-stated, not computed |
| Age | 21+ statement vs operational control | First-run acknowledgment stored separately from notes. Not identity verification |
| FDA function | Does this look like a regulated device? | No diagnosis, no treatment, no measurement hardware. Mission 14 FDA measurement language from MyPersonas drafts is **not** implemented and must not be implied |

## Data inventory

| Item | Stored | Leaves the device |
|---|---|---|
| Observation notes (variable, context, expectation, outcome, uncertainty, corrections) | Yes, local | Only if the user exports or copies |
| 21+ / not-medical ack | Yes, local, separate key | No |
| Approved mission catalog | Bundled from `public/log.html` 01–11 | N/A (already public) |
| Fixtures | Tests only | Not shipped as user history |
| Account / email / GPS / sensors | No | No |
| Cloud backup (Android Auto Backup) | Disabled | No |

## Hard limits the reviewer should fail the app for if broken

- Invented missions, evidence tiers, or sensor readings
- Prescriptions, stacks, doses, washouts, or “the app recommends”
- Turning a subjective note into a scientific verdict
- Shipping test fixtures as if they were the user’s log
- Public-site copy that claims store availability or FDA status

## Sign-off block (humans only)

| Role | Name | Date | Decision | Notes |
|---|---|---|---|---|
| Owner | | | Approve / hold | |
| Privacy | | | Approve / hold | |
| Legal | | | Approve / hold | |
| Health / safety | | | Approve / hold | Named clinician still required for any ingredient/dose/condition content |
| Security | | | Approve / hold | Especially before any future sync |

Remote sync, accounts, community reports, FHIR/MyChart, and store submission stay **blocked** until the relevant rows above are actually signed.

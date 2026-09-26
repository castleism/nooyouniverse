# Claude Design brief — Mission Log images 12–15 (Package A)

Prepared 2026-09-26. Paste the block under **Brief** into Claude Design as one
message. Output goes to `public/assets/log/` only after the copy is approved
(see gate below). Nothing in this file approves publication.

## Why this exists

Package A (drafted 2026-08-13, `MyPersonas/outputs/cillian-noo-youniverse/mission-log/`)
holds four finished copy drafts with OpenAI-generated *candidate* visuals at
1672×941. The live log ships 1200×675 JPEGs, ~80–120 KB, one consistent
palette. Live Mission 11 is "Sleep before stack", so Package A renumbers:

| Package A draft | Ships as | Route | Source-basis badge |
|---|---|---|---|
| The P-Value Is Not the Payload | **Mission 12** | Evidence vocabulary | Methodology reference |
| The Claim Is the Whole Constellation | **Mission 13** | Claim anatomy | Regulatory guidance |
| Read the Flight Plan Before the Landing | **Mission 14** | Study-reading | Methodology reference |
| Tracker Build Diary: A Field Is Not Yet a Measurement | **Mission 15** | Build diary | Methodology reference |

## Gate (unchanged, binding)

Copy needs owner approval + named human editorial/source review before any
image is referenced from `public/log.html`. Mission 15 additionally needs
product, privacy, legal, health-safety and technical review. Generate the art
now so it is not on the critical path; keep it under `docs/` or Drive until
the entry is approved.

---

## Brief

You are producing four editorial hero images for the Noo YouNiverse Mission
Log, an evidence-literacy blog written by Cillian O'Sullivan, a fictional
AI-assisted Castleborn character. Match the eleven existing images at
https://nooyouniverse.com/log exactly in world and finish:

**Spec (all four)**
- 1200 × 675 px, 16:9, export JPEG quality ~80, target 80–120 KB. Also keep a
  2400 × 1350 master.
- Palette: deep indigo `#0b0e24` / navy `#121736` / `#1a2047`, brass and warm
  amber `#f2b25c` accents, violet `#8f7dff` highlights, off-white `#e9ebf7`.
- World: a cosmic observatory-cockpit. Brass instruments, star-filled
  windows, soft volumetric light, matte surfaces. Cinematic, calm, precise.
- No readable text, no logos, no brands, no real products, no molecules,
  pills, powders, patients, clinicians, medical dashboards, vitals, scores or
  efficacy verdicts of any kind. Any graph is a neutral rise-and-fall line
  with no clear direction.
- Cillian may appear in 12 and 14 (as in Missions 01, 09, 11: red-haired
  Irish man, thirties, flight jacket, seen from behind or three-quarter,
  never a close portrait). 13 and 15 are object-only.
- Deliver each with a one-sentence literal alt text that describes only what
  is visible.

**Mission 12 — The P-Value Is Not the Payload** (`12-p-value-not-payload.jpg`)
Wide shot of a brass instrument panel in the dark cockpit. One small green
detection lamp lit on the left; beside it, dominating the frame, a much
larger unread magnitude gauge with a wide translucent uncertainty arc across
its face. Cillian's hand rests near the small lamp, his attention on the big
gauge. Mood: "detected" is the small light; "how much" is the dial nobody has
read yet.

**Mission 13 — The Claim Is the Whole Constellation** (`13-claim-constellation.jpg`)
Through the observatory's brass viewing lens, five separate elements float in
orbit and resolve into one constellation: a blank product-shaped silhouette
with no label, a neutral rise-and-fall graph with no axis labels, an empty
speech bubble, a small qualifier card with an asterisk-shaped glyph, and an
abstract non-biological data tile. Star lines faintly connect them into one
"net impression". No element may look like a cell, organ, capsule or molecule.

**Mission 14 — Read the Flight Plan Before the Landing** (`14-flight-plan.jpg`)
Indigo-and-brass navigator's desk. Three translucent navigation sheets laid in
sequence — registry, plan, report — with the same route line traced through
all three, and one clearly documented course correction drawn in blue on the
final sheet. Cillian, from behind, comparing the sheets under a desk lamp.
Nothing on the sheets is legible.

**Mission 15 — Tracker Build Diary: A Field Is Not Yet a Measurement** (`15-field-not-measurement.jpg`)
Top-down on an indigo workshop table: a blueprint for an observation form
split into six modules — concept, context, timing, response, missingness,
summary — drawn as empty brass-lined frames. One module is deliberately blank
with a dotted outline and a question-shaped path. Loose drafting tools, no
numbers, no scale, no device screen, nothing that reads as a clinical or
diagnostic instrument.

**Return**: the four JPEGs at 1200×675, the four masters, and the four alt
texts in a table. Do not add titles, captions or watermarks to the images.

---

## After delivery

1. Owner + reviewer approve copy per entry (decision queue in the Package A
   draft file).
2. Drop approved JPEGs into `public/assets/log/`, add the `<article>` per the
   Mission 11 pattern in `public/log.html`, extend the table of contents,
   `sources.html` ledger, `sitemap.xml` `<lastmod>`, and `corrections.html`
   if anything supersedes an earlier entry.
3. `cd mobile && npm test` (catalog test must pick up the new IDs), commit,
   deploy, verify live, then rebuild the APK so the offline copy matches.

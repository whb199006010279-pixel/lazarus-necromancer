# Tasks — Lazarus: The Startup Necromancer

Status: implementation in progress, following this spec. Each task is a
small, verifiable step. Check a task off only when its verification passes.

## 1. Project skeleton

- [x] Create repo layout: `index.html`, `css/styles.css`, `js/data.js`,
  `js/engine.js`, `js/app.js`, `tests/engine.test.js`, `README.md`,
  `LICENSE` (MIT), `.kiro/` spec + steering + hooks.
- [x] Write this spec (`requirements.md`, `design.md`, `tasks.md`) first,
  then implement to it.

## 2. Data

- [x] Curate 24 corpses (real dead startups/products) with: name, born,
  died, category, approximate funding, what, epitaph, 2–3 cause tags, soul,
  pivot.
- [x] Verify every corpse's cause tags exist in the `CAUSES` taxonomy.
- [x] Verify no corpse uses a living company as a "corpse" (only dead
  products / discontinued lines / bankrupt companies).

## 3. Necromancy Engine (`js/engine.js`)

- [x] Implement `viabilityScore()` (base 55 + fixed weights, clamp 5–98).
- [x] Implement `grade()` with the four bands from Requirement 3.
- [x] Implement `resurrectionPlan()` returning soul / bury / pivot / score /
  grade / steps.
- [x] Implement `planForCustom()` for user-submitted burials.
- [x] Write `BURY_LINES` (one line per cause) and `GENERIC_PIVOTS`
  (one per cause).

## 4. Tests (`tests/engine.test.js`)

- [x] Score determinism: same corpse, same score, every run.
- [x] Clamping: extreme tag combinations stay inside 5–98.
- [x] Grade boundaries: 80, 65, 50 behave as specified.
- [x] Plan shape: four parts present for dataset and custom corpses.
- [x] Coverage: every cause tag has a bury line and a generic pivot.
- [x] Run: `node tests/engine.test.js` exits 0. (145 checks, all pass.)

## 5. UI (`index.html`, `css/styles.css`, `js/app.js`)

- [x] Graveyard grid with tombstone cards (name, years, epitaph).
- [x] Search box + cause filter chips.
- [x] Ghost detail view with full facts and "Perform the Resurrection".
- [x] Ritual view: soul, bury list, pivot, score meter, grade, steps.
- [x] Bury-your-own form with validation (at least one cause required).
- [x] Header stats: corpse count, average viability, strongest resurrection.
- [x] Footer data-honesty note.
- [x] Zero external requests (no CDN, no web fonts, no analytics) — verified by grep + served 200s.

## 6. Verification

- [x] Serve the directory statically and open `index.html`; click a
  tombstone, run a ritual, submit a burial, use search and filters.
  (Verified: all files serve 200; engine smoke-tested in Node. Visual
  click-through still needs a browser check.)
- [ ] Confirm the app also opens directly from a local file.
- [x] Confirm the repo contains `/.kiro` at the root and it is NOT in
  `.gitignore`. (No `.gitignore` exists yet; none must ever hide `.kiro`.)

## 7. Submission preparation (needs the entrant)

- [ ] Create the public GitHub repo (MIT license) and push this project.
- [ ] Enable GitHub Pages from the repo root for the working app URL.
- [ ] Record the demo video (< 3 minutes, public YouTube) — needs the
  entrant on camera.
- [ ] Write the Devpost submission: category Resurrection, text
  description, Kiro usage write-up, bonus prize selections.
- [ ] Optional bonus prizes: publish a blog post (Bonus Blog) and a social
  post starting with #KiroweenHackathon26 (Social Blitz).

## 8. Kiro-agent pass (needs a Kiro account)

- [ ] Open the repo in Kiro IDE and let Kiro's agent execute this spec's
  tasks against the code (review pass + property-based tests for the
  engine, per the Kiro usage write-up).
- [ ] Request the one-time 4,000 Kiro credits via the Credit Request Form
  before Dec 1, 2026, 12:00 PM PT (needs the Kiro user ID).

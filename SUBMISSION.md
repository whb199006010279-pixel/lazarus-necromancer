# SUBMISSION.md — Kiroween 2026 draft materials (Lazarus)

> Draft only. Do NOT submit until the Devpost account suspension is lifted
> and the items in "Still needed" are done.

## Category

**Resurrection** — bring a dead technology back to life. (Also eligible for
Best Demo; consider the Bonus Blog and Social Blitz prizes.)

## Project

**Lazarus — The Startup Necromancer.** A graveyard of 24 real dead
startups and products. Click a tombstone, summon the ghost, and perform the
resurrection: a deterministic, rule-based Necromancy Engine turns the
corpse's cause-of-death tags into a four-part plan — the soul to keep, the
body to bury, the 2026 pivot, and a viability score. Visitors can also bury
their own dead idea and get the same plan.

## Text description (draft)

Every year, good ideas die for fixable reasons — bad timing, wrong pricing,
a platform that pulled the rug. Lazarus treats failure as data: 24 famous
corpses (Quibi, Vine, Juicero, Stadia, Kodak, …), each with its real story,
and a transparent engine that shows exactly how the same idea could work in
2026. No black box, no API keys, no hype: every score is 55 plus fixed
weights per cause of death, and every line of a plan traces back to a tag.
Founders can also bury their own dead idea and get a resurrection plan for
it. Built spec-first with Kiro: requirements, design and tasks in
`.kiro/specs/lazarus/`, steering docs, and agent hooks that keep the engine
tested on every save.

## How Kiro was used (draft write-up — update after the Kiro-agent pass)

- **Spec-driven development**: the project started as a Kiro spec
  (`.kiro/specs/lazarus/requirements.md`, `design.md`, `tasks.md`) before
  any code was written. Requirements are EARS-style; the design pins the
  engine's scoring weights; tasks.md is the checklist the build followed.
- **Steering docs** (`.kiro/steering/product.md`, `tech.md`,
  `structure.md`) constrained the build: zero dependencies, deterministic
  engine, system fonts only, CSS art, honesty about data.
- **Agent hooks** (`.kiro/hooks/hooks.json`): the engine test suite runs
  automatically whenever `js/engine.js` or `js/data.js` is saved, and every
  agent session is reminded to work spec-first.
- **Kiro-agent review pass** (to do in Kiro IDE before submitting): run
  Kiro's agent over this spec to review the implementation and add
  property-based tests for the engine's scoring and clamping.

## Demo video (draft script, < 3 minutes — needs the entrant on camera)

1. (0:00–0:20) "Every year, good ideas die for fixable reasons." Open the
   graveyard, scroll the tombstones.
2. (0:20–1:00) Click Kodak's tombstone, read the ghost, hit "Perform the
   Resurrection" — show the soul, the body to bury, the pivot, the score
   (81, Strong resurrection).
3. (1:00–1:40) Bury your own: type a dead idea, pick two causes, show the
   plan it generates.
4. (1:40–2:30) Show the `.kiro` directory and the spec files; explain the
   engine is deterministic (same corpse, same score) and the app has zero
   dependencies.
5. (2:30–2:50) Close: "Failure is data. Lazarus reads it." Show the
   GitHub repo and the live app URL.

## Still needed (entrant)

- [ ] Devpost account unsuspended (appeal sent 2026-11-16 05:24 CST to
  support@devpost.com) — then click "Join Hackathon" on
  kiroween.devpost.com and enter the submission.
- [ ] Kiro account (free tier, no card: sign in with GitHub/Google/AWS
  Builder ID at kiro.dev) + request the one-time 4,000 Kiro credits via
  the Credit Request Form before Dec 1, 2026, 12:00 PM PT.
- [ ] Kiro-agent review pass in Kiro IDE (tasks.md §8) — then update the
  "How Kiro was used" write-up with what actually ran.
- [ ] Public GitHub repo (MIT license) + push this project; enable GitHub
  Pages from the repo root for the working app URL.
- [ ] Demo video (< 3 min, public YouTube) — entrant on camera.
- [ ] Optional: Bonus Blog post (public blog, mention Kiroween 2026) and
  Social Blitz post starting with #KiroweenHackathon26.

## Key dates (all verified against the official rules)

- Submission deadline: **Dec 4, 2026, 2:00 PM PT (22:00 UTC = Dec 5, 06:00 CST)**
- Kiro credits request deadline: **Dec 1, 2026, 12:00 PM PT**
- Judging: Dec 16, 2026 – Jan 29, 2027 · Winners: ~Feb 3, 2027
- Prizes: 1st $30,000 · 2nd $20,000 · 3rd $10,000 · Best Resurrection
  $5,000 · Best Demo $1,000 · (plus other bonus prizes)
- Prize delivery: bank transfer or mailed payment after winner affidavit +
  required forms (non-US winners may need W-8BEN); within 60 days of
  completed forms.

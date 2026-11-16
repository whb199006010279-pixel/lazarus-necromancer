# Design — Lazarus: The Startup Necromancer

## Overview

Lazarus is a zero-dependency static single-page app. Three layers:

- **Data** (`js/data.js`): a curated dataset of 24 dead startups/products.
  Plain facts only; every funding figure is approximate and labelled so in
  the UI.
- **Engine** (`js/engine.js`): the Necromancy Engine. Pure, deterministic,
  rule-based functions with no I/O. It turns cause-of-death tags into a
  resurrection plan and a viability score.
- **UI** (`js/app.js`, `index.html`, `css/styles.css`): the graveyard.
  Tombstone grid, ghost detail view, resurrection ritual, and the
  bury-your-own form. Vanilla JS, no framework, no build step.

## Architecture

```
index.html          app shell, loads css + js in order
css/styles.css      graveyard theme (dark, fog, candle-gold, tombstone gray)
js/data.js          CORPSES array, CAUSES taxonomy, BURY_LINES, GENERIC_PIVOTS
js/engine.js        viabilityScore(), resurrectionPlan(), planForCustom()
js/app.js           rendering, search/filter, detail view, ritual, burial form
tests/engine.test.js node test for the engine (no test framework needed)
```

Scripts are classic (non-module) `<script>` tags in dependency order so the
app also works opened directly from a local file, where ES modules are
blocked by CORS. `engine.js` uses a UMD-style guard so Node can require it
for tests.

## Data model

```js
// js/data.js
CAUSES = {
  "no-market":       { label: "No market",          weight: -6  },
  "bad-timing":      { label: "Bad timing",         weight: +18 },
  "unit-economics":  { label: "Unit economics",     weight: -12 },
  "cash":            { label: "Ran out of cash",    weight: -8  },
  "competition":     { label: "Outcompeted",        weight: -4  },
  "platform-risk":   { label: "Platform risk",      weight: +10 },
  "hardware-cost":   { label: "Hardware cost",      weight: +6  },
  "monetization":    { label: "No monetization",    weight: +8  },
  "tech-debt":       { label: "Tech debt",          weight: +10 },
  "regulation":      { label: "Regulation",         weight: -14 },
  "trust":           { label: "Lost trust",         weight: -16 },
  "cannibalized":    { label: "Cannibalized",       weight: +12 },
}

CORPSES = [{
  id, name, born, died, category, funding, // funding: "≈$1.75B" or "n/a"
  what,        // one sentence: what it was
  epitaph,     // one witty line for the tombstone
  causes: [],  // 2–3 tags from CAUSES
  soul,        // the insight worth keeping
  pivot,       // the concrete 2026 resurrection idea
}]
```

Weights encode one judgement: some causes of death are more fixable in 2026
than others. Timing is the most fixable (the world caught up); lost trust is
the hardest to rebuild. The weights are fixed constants, documented here, so
the score is explainable.

## Engine

```js
viabilityScore(corpse) // 55 + sum(weights of causes), clamped to 5–98
grade(score)           // 80+ Strong resurrection | 65–79 Viable |
                       // 50–64 Fragile | <50 Stay buried (for now)
resurrectionPlan(corpse) // { soul, bury: [one line per cause],
                       //   pivot, score, grade, steps: [4 ritual steps] }
planForCustom(name, what, causes) // same engine, generic soul/pivot text
```

`bury` lines come from a fixed `BURY_LINES` map keyed by cause tag, so every
line in a plan is traceable to a tag. `steps` is a fixed 4-step ritual
template ("Exhume the soul", "Bury the body", "Speak the pivot",
"First 30 days"), with the corpse's pivot slotted into step 3.

## UI

- **Header**: title, subtitle, live stats (souls in the graveyard, average
  viability, strongest resurrection).
- **Controls**: search input + cause filter chips (All + one per cause).
- **Graveyard grid**: tombstone cards. CSS-drawn tombstone shape (rounded
  top), name, years, epitaph, cause chips. Hover raises the stone and lights
  a candle glow.
- **Ghost view**: a modal/panel with full facts and a "Perform the
  Resurrection" button. The ritual shows a short candle-lighting animation,
  then the plan: soul, bury list, pivot, score meter, grade, steps.
- **Bury your own**: a form (name, what it was, cause checkboxes). Same
  engine, same plan layout.
- **Footer**: data honesty note (approximate funding, opinion not
  prediction, names used for historical commentary) and a Kiro note.

## Visual design

Dark graveyard, not a dark-mode toggle: background near-black `#0d0f14`
with a fog gradient, tombstone gray `#9aa3ad`, candle-gold `#e8b64c` as the
primary accent, ectoplasm green `#7fe0a8` for "alive again" states, and a
muted bone white `#e8e4d8` for text. Display type is Georgia / Palatino
serif (system fonts only — no web fonts, per Requirement 5). No images are
required; tombstones, candles and fog are pure CSS so the app has zero
external requests.

## Testing

- `tests/engine.test.js` runs under plain Node (`node tests/engine.test.js`,
  exit code non-zero on failure). It asserts: score determinism, clamping,
  grade boundaries, plan shape (four parts), every cause tag has a bury line
  and a generic pivot, and every corpse's causes exist in the taxonomy.
- Manual check: serve the directory with any static server and open
  `index.html`; click a tombstone, run a ritual, submit a burial.

## Deployment

Static hosting only. GitHub Pages from the repo root is the intended
"working app URL" for the Devpost submission (no build, no server).

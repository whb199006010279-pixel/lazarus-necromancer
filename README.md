# Lazarus — The Startup Necromancer

> Every dead startup has a soul worth saving.

**Built for Kiroween 2026 (Resurrection category)** — a graveyard of 24 real,
dead startups and products, each with a resurrection plan produced by a
transparent, rule-based Necromancy Engine. Click a tombstone, summon the
ghost, perform the resurrection — and bury your own dead idea to get a plan
for it too.

## How it works

- **The Graveyard** — 24 corpses (Quibi, Vine, Juicero, Stadia, Kodak, …),
  browsable by search and by cause of death.
- **The Necromancy Engine** (`js/engine.js`) — deterministic and
  rule-based. Every corpse carries 2–3 cause-of-death tags; each tag has a
  fixed weight (timing is the most fixable, lost trust the hardest). Score =
  55 + weights, clamped to 5–98, graded Strong / Viable / Fragile /
  Stay buried. No network, no AI API, no randomness — the same corpse always
  gets the same score, and every line of a plan is traceable to a tag.
- **Bury Your Own** — submit a dead idea with its cause tags and get the
  same four-part plan: the soul to keep, the body to bury, the 2026 pivot,
  and the viability score.

## Run it

No build step, no server code, no keys, no external requests.

```sh
# any static server, e.g.:
python3 -m http.server 8123
# open http://127.0.0.1:8123/
```

It also opens directly from a local file. Tests: `node tests/engine.test.js`.

## How Kiro was used (spec-driven development)

This project was built spec-first with Kiro's workflow:

- **Specs** (`.kiro/specs/lazarus/`): `requirements.md` (EARS-style
  requirements), `design.md` (architecture, data model, engine weights),
  `tasks.md` (the implementation checklist this build followed).
- **Steering** (`.kiro/steering/`): product, tech, and structure guidance
  that shaped every decision — zero dependencies, deterministic engine,
  system fonts only, CSS art, honesty about data.
- **Hooks** (`.kiro/hooks/hooks.json`): agent hooks that run the engine
  test suite whenever `js/engine.js` or `js/data.js` is saved, and remind
  every session to work spec-first.

The remaining Kiro step before submission is a Kiro-agent review pass in
Kiro IDE (see `tasks.md` §8), including property-based tests for the
engine.

## Data honesty

Facts are public and widely reported; funding figures are approximate and
labelled as such in the app. Resurrection plans are opinionated analysis,
not predictions and not investment advice. Company names are used for
historical commentary.

## License

MIT — see `LICENSE`.

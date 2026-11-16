# Requirements — Lazarus: The Startup Necromancer

## Introduction

Lazarus is a web app that turns startup failure into a tool. It presents a
graveyard of real, dead startups and products, and gives each one a
"resurrection": a structured, explainable plan for how the same idea could
work in 2026. The app is built for the Kiroween 2026 hackathon, Resurrection
category: bring a dead technology back to life.

## Glossary

- **Corpse**: a dead startup or product in the dataset (name, lifespan, what
  it was, funding, cause-of-death tags, epitaph, soul, pivot).
- **Soul**: the real insight behind a corpse that is still true (the part
  worth keeping).
- **Body**: the causes of death (the part to bury).
- **Necromancy Engine**: the deterministic, rule-based engine that turns a
  corpse's cause tags into a resurrection plan and a viability score.
- **Ritual**: the interaction of selecting a corpse and receiving its
  resurrection plan.
- **Burial**: a user-submitted dead idea, run through the same engine.

## Requirements

### Requirement 1: Graveyard browsing

**User Story:** As a visitor, I want to browse dead startups as tombstones,
so that I can discover failure stories at a glance.

#### Acceptance Criteria

1. WHEN the app loads THEN the system SHALL display a grid of tombstones,
   one per corpse, each showing the name, years alive, and epitaph.
2. WHEN a visitor types in the search box THEN the system SHALL filter the
   grid to corpses whose name or description matches the query.
3. WHEN a visitor selects a cause filter THEN the system SHALL show only
   corpses that died of that cause.
4. WHEN a visitor clears search and filters THEN the system SHALL show all
   corpses again.

### Requirement 2: Summoning a ghost

**User Story:** As a visitor, I want to click a tombstone and see the full
story of that startup, so that I can understand what it was and why it died.

#### Acceptance Criteria

1. WHEN a visitor clicks a tombstone THEN the system SHALL display the
   corpse's full facts: what it was, years alive, approximate funding,
   cause-of-death tags, and epitaph.
2. WHEN the detail view is open THEN the system SHALL offer a "Perform the
   Resurrection" action.
3. WHEN the visitor closes the detail view THEN the system SHALL return to
   the graveyard grid.

### Requirement 3: Necromancy Engine

**User Story:** As a visitor, I want a resurrection plan for a dead startup,
so that I can see concretely how the idea could work today.

#### Acceptance Criteria

1. WHEN the resurrection is performed THEN the system SHALL produce a plan
   with exactly four parts: the soul to keep, the body to bury (one line per
   cause tag), the 2026 pivot, and a viability score with a grade.
2. WHEN the engine scores a corpse THEN the system SHALL compute the score
   deterministically from the corpse's cause tags only (base 55 plus a fixed
   weight per cause, clamped to 5–98), so that the same corpse always gets
   the same score.
3. WHEN the engine grades a score THEN the system SHALL map 80+ to "Strong
   resurrection", 65–79 to "Viable", 50–64 to "Fragile", and below 50 to
   "Stay buried (for now)".
4. WHEN the engine runs THEN the system SHALL NOT call any network service
   or API; all reasoning is local and rule-based.

### Requirement 4: Bury your own

**User Story:** As a visitor, I want to bury my own dead idea and get a
resurrection plan for it, so that the tool works on my failures too.

#### Acceptance Criteria

1. WHEN a visitor submits a name, a description, and at least one cause tag
   THEN the system SHALL generate a resurrection plan using the same engine.
2. WHEN a visitor submits with no cause tag selected THEN the system SHALL
   refuse with a clear message and generate nothing.
3. WHEN a plan is generated for a custom corpse THEN the system SHALL show
   the same four parts as for a dataset corpse.

### Requirement 5: Zero-dependency static app

**User Story:** As a judge, I want to open the app from any static host (or
a local file) with no build step and no keys, so that it just works.

#### Acceptance Criteria

1. WHEN the app is served from any static host THEN the system SHALL work
   with no server-side code, no build step, and no API keys.
2. WHEN the app is opened THEN the system SHALL load with no external
   network requests (no CDNs, no web fonts, no analytics).
3. WHEN the app runs THEN the system SHALL work in a modern desktop
   browser with JavaScript enabled.

### Requirement 6: Data honesty

**User Story:** As a visitor, I want to know what is fact and what is
opinion, so that I can trust the graveyard.

#### Acceptance Criteria

1. WHEN the app displays funding figures THEN the system SHALL label them
   as approximate, publicly reported figures.
2. WHEN the app displays a resurrection plan THEN the system SHALL present
   it as an opinionated analysis, not a prediction.
3. WHEN the app names a company THEN the system SHALL use the name for
   historical commentary and carry a note to that effect.

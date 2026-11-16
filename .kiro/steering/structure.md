# Steering — Structure

```
lazarus/
├── index.html                  app shell
├── css/styles.css              graveyard theme
├── js/
│   ├── data.js                 CORPSES, CAUSES, BURY_LINES, GENERIC_PIVOTS
│   ├── engine.js               Necromancy Engine (pure functions)
│   └── app.js                  rendering + interactions
├── tests/engine.test.js        node test for the engine
├── .kiro/
│   ├── specs/lazarus/          requirements.md, design.md, tasks.md
│   ├── steering/               product.md, tech.md, structure.md
│   └── hooks/hooks.json        agent hooks (see below)
├── README.md
├── SUBMISSION.md               draft Devpost materials + demo script
└── LICENSE                     MIT
```

Rules:

- The dataset lives only in `js/data.js`. The engine never hard-codes a
  corpse.
- The engine never touches the DOM. The UI never computes a score.
- New corpses are added by appending one object to `CORPSES` — no code
  changes needed.
- `/.kiro` is never added to `.gitignore`. The Kiroween rules disqualify
  submissions that hide it.

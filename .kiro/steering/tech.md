# Steering — Tech

- **Zero dependencies.** No framework, no build step, no CDN, no web
  fonts, no analytics, no API keys. The app is three script tags and one
  stylesheet. A judge must be able to open it from GitHub Pages or a local
  file and have it just work.
- **Deterministic engine.** `js/engine.js` is pure functions, no I/O, no
  randomness, no dates. Same input, same output, every time. This is what
  makes the viability score defensible.
- **Classic scripts, not modules.** `<script>` tags in dependency order
  (`data.js` → `engine.js` → `app.js`) so the app works from `file://`,
  where ES modules are blocked by CORS. `engine.js` exposes a UMD-style
  guard so Node can require it for tests.
- **System fonts only.** Georgia / Palatino for display, system-ui for body.
  No external font requests.
- **CSS art, no images.** Tombstones, candles and fog are pure CSS. No
  image assets to 404.
- **Accessibility floor.** Real buttons, real inputs, visible focus states,
  readable contrast on the dark theme. The graveyard is dark; the text is
  not.
- **Node for tests only.** `tests/engine.test.js` runs under plain Node with
  no test framework. `node tests/engine.test.js` must exit 0.

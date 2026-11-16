/* Lazarus engine tests. Plain Node, no framework.
   Run: node tests/engine.test.js   (exit 0 = pass, non-zero = fail) */
"use strict";

var DATA = require("../js/data.js");
var ENGINE = require("../js/engine.js");

var failures = 0;
function check(name, cond) {
  if (cond) {
    console.log("  ok  " + name);
  } else {
    failures++;
    console.log(" FAIL  " + name);
  }
}

/* 1. Determinism: same corpse, same score, every run. */
var quibi = DATA.CORPSES.find(function (c) { return c.id === "quibi"; });
check("score is deterministic", ENGINE.viabilityScore(quibi) === ENGINE.viabilityScore(quibi));

/* 2. Known score: Quibi = 55 + 18 (bad-timing) - 6 (no-market) - 12 (unit-economics) = 55. */
check("Quibi scores 55", ENGINE.viabilityScore(quibi) === 55);

/* 3. Clamping: extreme tag combinations stay inside [5, 98]. */
var allBad = { causes: ["unit-economics", "regulation", "trust", "cash", "competition", "no-market"] };
var allGood = { causes: ["bad-timing", "cannibalized", "platform-risk", "tech-debt", "monetization", "hardware-cost"] };
var worst = ENGINE.viabilityScore(allBad);   /* 55 - 12 - 14 - 16 - 8 - 4 - 6 = -5 -> 5 */
var best = ENGINE.viabilityScore(allGood);   /* 55 + 18 + 12 + 10 + 10 + 8 + 6 = 119 -> 98 */
check("worst-case score clamps to 5", worst === 5);
check("best-case score clamps to 98", best === 98);
check("no-cause corpse scores base 55", ENGINE.viabilityScore({ causes: [] }) === 55);

/* 4. Grade boundaries. */
check("grade 80 = Strong resurrection", ENGINE.grade(80) === "Strong resurrection");
check("grade 79 = Viable", ENGINE.grade(79) === "Viable");
check("grade 65 = Viable", ENGINE.grade(65) === "Viable");
check("grade 64 = Fragile", ENGINE.grade(64) === "Fragile");
check("grade 50 = Fragile", ENGINE.grade(50) === "Fragile");
check("grade 49 = Stay buried (for now)", ENGINE.grade(49) === "Stay buried (for now)");

/* 5. Plan shape: four parts present, for dataset and custom corpses. */
var plan = ENGINE.resurrectionPlan(quibi);
check("plan has a soul", typeof plan.soul === "string" && plan.soul.length > 0);
check("plan has one bury line per cause", plan.bury.length === quibi.causes.length);
check("plan has a pivot", typeof plan.pivot === "string" && plan.pivot.length > 0);
check("plan has a score and grade", typeof plan.score === "number" && typeof plan.grade === "string");
check("plan has four ritual steps", Array.isArray(plan.steps) && plan.steps.length === 4);

var custom = ENGINE.planForCustom("TestApp", "an app that failed", ["unit-economics", "cash"]);
check("custom plan has four parts", custom.soul && custom.bury.length === 2 && custom.pivot && typeof custom.score === "number");
check("custom plan score matches engine", custom.score === ENGINE.viabilityScore({ causes: ["unit-economics", "cash"] }));

/* 6. Coverage: every cause tag has a bury line and a generic pivot. */
Object.keys(DATA.CAUSES).forEach(function (tag) {
  check("bury line exists for " + tag, typeof DATA.BURY_LINES[tag] === "string" && DATA.BURY_LINES[tag].length > 0);
  check("generic pivot exists for " + tag, typeof DATA.GENERIC_PIVOTS[tag] === "string" && DATA.GENERIC_PIVOTS[tag].length > 0);
});

/* 7. Dataset integrity: every corpse's causes exist in the taxonomy,
   and every corpse has the fields the UI needs. */
var seenIds = {};
DATA.CORPSES.forEach(function (c) {
  check("corpse " + c.id + " has a unique id", !seenIds[c.id]);
  seenIds[c.id] = true;
  check("corpse " + c.id + " has name/born/died/what/epitaph/soul/pivot",
    c.name && c.born && c.died && c.what && c.epitaph && c.soul && c.pivot);
  c.causes.forEach(function (tag) {
    check("corpse " + c.id + " cause tag " + tag + " is known", !!DATA.CAUSES[tag]);
  });
  check("corpse " + c.id + " has 2-3 causes", c.causes.length >= 2 && c.causes.length <= 3);
  check("corpse " + c.id + " died after it was born", c.died >= c.born);
});
check("dataset has 24 corpses", DATA.CORPSES.length === 24);

/* 8. Stats. */
var stats = ENGINE.datasetStats(DATA.CORPSES);
check("stats count matches dataset", stats.count === DATA.CORPSES.length);
check("stats average is in range", stats.average >= 5 && stats.average <= 98);
check("stats strongest is a real corpse", !!stats.strongest && typeof stats.strongest.name === "string");

console.log(failures === 0 ? "\nAll engine tests passed." : "\n" + failures + " test(s) failed.");
process.exit(failures === 0 ? 0 : 1);

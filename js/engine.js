/* Lazarus — the Necromancy Engine.
   Pure, deterministic, rule-based functions. No I/O, no randomness, no
   network. Same input, same output, every time.
   UMD-style guard: works as a classic browser script and under Node. */
(function (root, factory) {
  "use strict";
  var data = null;
  if (typeof module !== "undefined" && module.exports) {
    data = require("./data.js");
    module.exports = factory(data);
  } else {
    data = root.LAZARUS_DATA;
    root.LAZARUS_ENGINE = factory(data);
  }
})(typeof window !== "undefined" ? window : globalThis, function (LAZARUS) {
  "use strict";

  var BASE_SCORE = 55;
  var MIN_SCORE = 5;
  var MAX_SCORE = 98;

  function clamp(n, lo, hi) {
    return n < lo ? lo : (n > hi ? hi : n);
  }

  /* Viability score: base 55 plus one fixed weight per cause tag,
     clamped to [5, 98]. Deterministic by construction. */
  function viabilityScore(corpse) {
    var total = BASE_SCORE;
    var causes = corpse.causes || [];
    for (var i = 0; i < causes.length; i++) {
      var c = LAZARUS.CAUSES[causes[i]];
      if (c) total += c.weight;
    }
    return clamp(total, MIN_SCORE, MAX_SCORE);
  }

  function grade(score) {
    if (score >= 80) return "Strong resurrection";
    if (score >= 65) return "Viable";
    if (score >= 50) return "Fragile";
    return "Stay buried (for now)";
  }

  function ritualSteps(corpse, pivot) {
    return [
      "Exhume the soul — keep this: " + (corpse.soul || "the core desire behind the idea is real."),
      "Bury the body — everything that killed it (see below).",
      "Speak the pivot — " + pivot,
      "First 30 days — ship a landing page and a waitlist, talk to 20 target users, then build the smallest version that charges money."
    ];
  }

  /* Full resurrection plan for a dataset corpse. Four parts, always. */
  function resurrectionPlan(corpse) {
    var causes = corpse.causes || [];
    var bury = [];
    for (var i = 0; i < causes.length; i++) {
      var line = LAZARUS.BURY_LINES[causes[i]];
      if (line) bury.push(line);
    }
    var score = viabilityScore(corpse);
    return {
      name: corpse.name,
      soul: corpse.soul,
      bury: bury,
      pivot: corpse.pivot,
      score: score,
      grade: grade(score),
      steps: ritualSteps(corpse, corpse.pivot)
    };
  }

  /* Same engine for a user-buried idea: generic soul and pivot text,
     keyed to the first cause tag, plus the same scoring and grading. */
  function planForCustom(name, what, causes) {
    var first = (causes && causes.length) ? causes[0] : "no-market";
    var genericPivot = LAZARUS.GENERIC_PIVOTS[first] || LAZARUS.GENERIC_PIVOTS["no-market"];
    var soul = "The core desire behind " + name + " is real — " +
      "people felt the problem. The execution is what died, not the need.";
    var fake = { name: name, what: what, causes: causes, soul: soul, pivot: genericPivot };
    var plan = resurrectionPlan(fake);
    plan.pivot = genericPivot + " (Starting from: " + what + ")";
    plan.steps = ritualSteps(fake, plan.pivot);
    return plan;
  }

  /* Dataset-level stats for the header. */
  function datasetStats(corpses) {
    var total = 0;
    var best = null;
    var bestScore = -1;
    for (var i = 0; i < corpses.length; i++) {
      var s = viabilityScore(corpses[i]);
      total += s;
      if (s > bestScore) { bestScore = s; best = corpses[i]; }
    }
    return {
      count: corpses.length,
      average: corpses.length ? Math.round(total / corpses.length) : 0,
      strongest: best ? { name: best.name, score: bestScore, grade: grade(bestScore) } : null
    };
  }

  return {
    BASE_SCORE: BASE_SCORE,
    MIN_SCORE: MIN_SCORE,
    MAX_SCORE: MAX_SCORE,
    viabilityScore: viabilityScore,
    grade: grade,
    resurrectionPlan: resurrectionPlan,
    planForCustom: planForCustom,
    datasetStats: datasetStats
  };
});

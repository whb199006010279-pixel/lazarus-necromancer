/* Lazarus UI — graveyard rendering, ghost view, ritual, burial form.
   Classic script; depends on LAZARUS_DATA (js/data.js) and
   LAZARUS_ENGINE (js/engine.js), loaded before this file. */
(function () {
  "use strict";

  var DATA = window.LAZARUS_DATA;
  var ENGINE = window.LAZARUS_ENGINE;
  var CORPSES = DATA.CORPSES;
  var CAUSES = DATA.CAUSES;

  var state = { query: "", cause: "all" };

  function $(id) { return document.getElementById(id); }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch];
    });
  }

  /* ---------- header stats ---------- */
  function renderStats() {
    var stats = ENGINE.datasetStats(CORPSES);
    $("stat-souls").textContent = stats.count;
    $("stat-average").textContent = stats.average;
    $("stat-strongest").textContent = stats.strongest
      ? stats.strongest.name + " · " + stats.strongest.score
      : "—";
  }

  /* ---------- filters ---------- */
  function renderFilters() {
    var wrap = $("filters");
    wrap.innerHTML = "";
    var all = el("button", "chip active", "All causes");
    all.type = "button";
    all.addEventListener("click", function () { setCause("all"); });
    wrap.appendChild(all);
    Object.keys(CAUSES).forEach(function (tag) {
      var b = el("button", "chip", CAUSES[tag].label);
      b.type = "button";
      b.dataset.cause = tag;
      b.addEventListener("click", function () { setCause(tag); });
      wrap.appendChild(b);
    });
  }

  function setCause(tag) {
    state.cause = tag;
    var chips = document.querySelectorAll("#filters .chip");
    for (var i = 0; i < chips.length; i++) {
      var c = chips[i];
      var active = (tag === "all" && !c.dataset.cause) || c.dataset.cause === tag;
      c.classList.toggle("active", active);
    }
    renderGrid();
  }

  function filtered() {
    var q = state.query.trim().toLowerCase();
    return CORPSES.filter(function (c) {
      if (state.cause !== "all" && c.causes.indexOf(state.cause) === -1) return false;
      if (q && (c.name + " " + c.what + " " + c.epitaph).toLowerCase().indexOf(q) === -1) return false;
      return true;
    });
  }

  /* ---------- graveyard grid ---------- */
  function renderGrid() {
    var grid = $("graveyard");
    grid.innerHTML = "";
    var list = filtered();
    if (list.length === 0) {
      grid.appendChild(el("p", "empty", "No souls match. The graveyard is quiet — try another search."));
      return;
    }
    list.forEach(function (c) {
      var card = el("article", "tombstone");
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", "Summon " + c.name);
      var stone = el("div", "stone");
      stone.appendChild(el("h3", "stone-name", c.name));
      stone.appendChild(el("p", "stone-years", c.born + " – " + c.died));
      stone.appendChild(el("p", "stone-epitaph", "“" + c.epitaph + "”"));
      card.appendChild(stone);
      var tags = el("div", "tags");
      c.causes.forEach(function (tag) {
        tags.appendChild(el("span", "tag", CAUSES[tag].label));
      });
      card.appendChild(tags);
      card.appendChild(el("span", "candle", "🕯"));
      card.addEventListener("click", function () { openGhost(c.id); });
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openGhost(c.id); }
      });
      grid.appendChild(card);
    });
  }

  /* ---------- ghost detail + ritual ---------- */
  function findCorpse(id) {
    for (var i = 0; i < CORPSES.length; i++) {
      if (CORPSES[i].id === id) return CORPSES[i];
    }
    return null;
  }

  function planHtml(plan, title) {
    var html = "";
    html += "<h3 class='plan-title'>" + esc(title) + "</h3>";
    html += "<div class='score'><div class='score-number'>" + plan.score + "</div>" +
      "<div class='score-label'>viability · " + esc(plan.grade) + "</div>" +
      "<div class='meter'><div class='meter-fill' style='width:" + plan.score + "%'></div></div></div>";
    html += "<h4>🕯 The soul — keep this</h4><p>" + esc(plan.soul) + "</p>";
    html += "<h4>⚰️ The body — bury this</h4><ul>";
    plan.bury.forEach(function (line) { html += "<li>" + esc(line) + "</li>"; });
    html += "</ul>";
    html += "<h4>🌑 The pivot — 2026</h4><p>" + esc(plan.pivot) + "</p>";
    html += "<h4>🔮 The ritual — four steps</h4><ol>";
    plan.steps.forEach(function (s) { html += "<li>" + esc(s) + "</li>"; });
    html += "</ol>";
    html += "<p class='disclaimer'>An opinionated analysis, not a prediction. Scores come from the public cause-of-death tags, not from a crystal ball.</p>";
    return html;
  }

  function openGhost(id) {
    var c = findCorpse(id);
    if (!c) return;
    var modal = $("modal");
    var body = $("modal-body");
    var html = "";
    html += "<h2 class='ghost-name'>" + esc(c.name) + "</h2>";
    html += "<p class='ghost-meta'>" + esc(c.category) + " · " + c.born + " – " + c.died +
      " · Funding " + esc(c.funding) + " (approximate, publicly reported)</p>";
    html += "<p>" + esc(c.what) + "</p>";
    html += "<p class='ghost-epitaph'>“" + esc(c.epitaph) + "”</p>";
    html += "<p><strong>Cause of death:</strong> " +
      c.causes.map(function (t) { return esc(CAUSES[t].label); }).join(" · ") + "</p>";
    html += "<div id='ritual-result'></div>";
    html += "<button id='resurrect-btn' class='btn primary' type='button'>🕯 Perform the Resurrection</button>";
    body.innerHTML = html;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    $("resurrect-btn").addEventListener("click", function () {
      var btn = $("resurrect-btn");
      btn.disabled = true;
      btn.textContent = "Lighting the candles…";
      setTimeout(function () {
        var plan = ENGINE.resurrectionPlan(c);
        $("ritual-result").innerHTML = planHtml(plan, "The resurrection of " + c.name);
        btn.style.display = "none";
        $("ritual-result").scrollIntoView({ behavior: "smooth", block: "start" });
      }, 900);
    });
  }

  function closeModal() {
    var modal = $("modal");
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    $("modal-body").innerHTML = "";
  }

  /* ---------- bury your own ---------- */
  function renderBurialForm() {
    var wrap = $("burial-causes");
    Object.keys(CAUSES).forEach(function (tag) {
      var label = el("label", "cause-check");
      var input = document.createElement("input");
      input.type = "checkbox";
      input.value = tag;
      label.appendChild(input);
      label.appendChild(document.createTextNode(" " + CAUSES[tag].label));
      wrap.appendChild(label);
    });
  }

  function submitBurial(e) {
    e.preventDefault();
    var name = $("bury-name").value.trim();
    var what = $("bury-what").value.trim();
    var causes = [];
    var boxes = document.querySelectorAll("#burial-causes input:checked");
    for (var i = 0; i < boxes.length; i++) causes.push(boxes[i].value);
    var out = $("burial-result");
    if (!name || !what) {
      out.innerHTML = "<p class='error'>Give your corpse a name and tell us what it was.</p>";
      return;
    }
    if (causes.length === 0) {
      out.innerHTML = "<p class='error'>Pick at least one cause of death — the engine needs to know what killed it.</p>";
      return;
    }
    var plan = ENGINE.planForCustom(name, what, causes);
    out.innerHTML = planHtml(plan, "The resurrection of " + name);
    out.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---------- init ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    renderStats();
    renderFilters();
    renderGrid();
    renderBurialForm();
    $("search").addEventListener("input", function (e) {
      state.query = e.target.value;
      renderGrid();
    });
    $("bury-form").addEventListener("submit", submitBurial);
    $("modal-close").addEventListener("click", closeModal);
    $("modal").addEventListener("click", function (e) {
      if (e.target === $("modal")) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });
  });
})();

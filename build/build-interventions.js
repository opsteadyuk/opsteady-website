"use strict";
const { w, page, HC_URL, getModuleData, getCatalogueListing, packageGrid, photoHero, customerCategory, CATEGORY_ORDER, categoryAnchor } = require("./build.js");

/* ---- Module-category photography (Level 2), 2026-09-02 ----
   Every one of the 9 real customer categories (CATEGORY_ORDER in build.js)
   now has an assigned photograph from the approved signature-manufacturing
   set -- "Wider capability" (the 11 Enablers) previously had none and used
   a gradient fallback; that exception ended with the arrival of
   opsteady-tool-family-wider-capability.jpg. There is now no category-
   specific gradient fallback anywhere in the module-page system. Determined
   programmatically from customerCategory(), never hand-mapped per module:
   every module in a category shares that category's one image (explicitly
   sanctioned -- "if multiple modules can share a category image, that is
   acceptable"). */
const CATEGORY_IMAGES = {
  "Output & Flow": {
    src: "/assets/photography/category-output-flow.jpg",
    alt: "A packaging line with bottles moving along a conveyor toward a rotary filling station, pallets of materials staged alongside.",
    width: 1168, height: 784, objectPosition: "38% 58%",
  },
  "Delivery & Planning": {
    src: "/assets/photography/category-delivery-planning.jpg",
    alt: "A production planner at a shopfloor desk, writing at a workstation next to a printed schedule board.",
    width: 1168, height: 784, objectPosition: "70% 42%",
  },
  "Running the Day": {
    src: "/assets/photography/category-running-the-day.jpg",
    alt: "A team of four gathered around a performance board on the shop floor, one operator pointing to a chart during a briefing.",
    width: 1168, height: 784, objectPosition: "56% 38%",
  },
  Quality: {
    src: "/assets/photography/category-quality.jpg",
    alt: "An operator using callipers to check the dimensions of a machined part at a workbench.",
    width: 1168, height: 784, objectPosition: "36% 48%",
  },
  "Equipment & Reliability": {
    src: "/assets/photography/category-equipment-reliability.jpg",
    alt: "A maintenance technician working inside an open machine cabinet, tools laid out on a cart alongside.",
    width: 1400, height: 942, objectPosition: "46% 42%",
  },
  "People & Skills": {
    src: "/assets/photography/category-people-skills.jpg",
    alt: "Two colleagues working together at a bench, one guiding the other through an assembly task.",
    width: 1168, height: 784, objectPosition: "50% 36%",
  },
  "Standards & Improvement": {
    src: "/assets/photography/category-standards-improvement.jpg",
    alt: "A worker in food-safety PPE following a documented reference standard while preparing product at a stainless steel bench.",
    width: 1168, height: 784, objectPosition: "48% 38%",
  },
  "Performance & Decision Making": {
    src: "/assets/photography/category-performance-decision-making.jpg",
    alt: "A small team reviewing a wall-mounted performance chart together on the production floor.",
    width: 1168, height: 784, objectPosition: "32% 38%",
  },
  "Wider capability": {
    src: "/assets/photography/category-wider-capability.jpg",
    alt: "Four colleagues gathered around a workbench, examining a piece of tooling together as part of a cross-functional discussion.",
    width: 1168, height: 784, objectPosition: "42% 40%",
  },
};

const listing = getCatalogueListing();

/* Customer categories, group order and anchor ids now come from
   build.js (customerCategory / CATEGORY_ORDER / categoryAnchor) so
   the Modules index groupings and the homepage "What Opsteady can
   help you improve" grid (§2) stay identical and cross-link
   correctly -- one taxonomy, not two that can drift apart. */

/* ---- Modules index — grouped by customer category ---- */
const byGroup = {};
for (const m of listing) {
  const cat = customerCategory(m);
  (byGroup[cat] = byGroup[cat] || []).push({ ...m, id: m.id });
}
const groupOrder = CATEGORY_ORDER.filter((c) => byGroup[c]);
/* No per-group cap: search must be able to find every module, and a
   truncated list defeats that (a capped-then-"see more" pattern was
   tried and found to break search on regeneration -- items beyond the
   cap were invisible to the search box while a static "N more" link
   stayed shown regardless of query). Groups stay the browsing aid;
   search is what keeps the full list manageable. */
const idxHtml = groupOrder.map((g) => {
  const items = byGroup[g];
  return `<div class="idx-group" id="${categoryAnchor(g)}">
        <h2>${g}</h2>
        <div class="idx-rows">
          ${items.map((m) => `<a class="idx-row" data-search="${m.name.toLowerCase()} ${m.outcome.toLowerCase()}" href="/modules/${m.slug}.html">
            <span><span class="idx-name">${m.name}</span><br><span class="idx-outcome">${m.outcome}</span></span>
            <span class="idx-price mono">${m.showcase ? `From £${m.pricePro}` : (m.priceEssentials ? `£${m.priceEssentials}–£${m.pricePro}` : `£${m.pricePro}`)}</span>
          </a>`).join("\n          ")}
        </div>
      </div>`;
}).join("\n      ");

/* ---- Modules index hero — 2026-09-02: the gradient placeholder is
   retired now that a dedicated asset (opsteady-tools-index-hero.jpg)
   exists for this exact surface. Approved copy unchanged. ---- */
w("modules/index.html", page({
  current: "modules",
  title: "Modules | Opsteady",
  description: "Find the Opsteady module you need, grouped by what it helps you fix.",
  path: "/modules",
  main: `
  ${photoHero({
    eyebrow: "Modules",
    h1: "Find the one you need, or see what's available.",
    sub: "Each module is a complete, practical way to fix one specific thing: the working file itself, clear instructions, examples and guidance for putting it to work, not just a blank template.",
    image: {
      src: "/assets/photography/hero-tools-index.jpg",
      alt: "A wide view down a manufacturing workshop aisle, machinery and staged materials on both sides, operators working at stations along the line.",
      width: 1168, height: 784,
      objectPosition: "58% 40%",
      priority: true,
    },
  })}
  <section class="page-section">
    <div class="shell">
      <div class="idx-search-wrap">
        <input type="search" id="idx-search" class="idx-search" placeholder="Search: &quot;skills matrix,&quot; &quot;changeover,&quot; &quot;delivery&quot;..." aria-label="Search modules">
      </div>
      <p style="margin-top:14px;">Not sure which one? <a class="btn-text" href="${HC_URL}">Run the Health Check instead <span class="arrow">→</span></a></p>
      ${idxHtml}
    </div>
  </section>
  <script>
    (function(){
      var input = document.getElementById('idx-search');
      if (!input) return;
      var rows = Array.prototype.slice.call(document.querySelectorAll('.idx-row[data-search]'));
      input.addEventListener('input', function(){
        var q = input.value.trim().toLowerCase();
        rows.forEach(function(r){
          r.style.display = (!q || r.getAttribute('data-search').indexOf(q) !== -1) ? '' : 'none';
        });
        document.querySelectorAll('.idx-group').forEach(function(g){
          var anyVisible = Array.prototype.some.call(g.querySelectorAll('.idx-row'), function(r){ return r.style.display !== 'none'; });
          g.style.display = anyVisible ? '' : 'none';
        });
      });
    })();
  </script>
  `,
}));

/* =========================================================
   CANONICAL TOOL-PAGE SYSTEM, 2026-09-02
   One template, one component sequence, for all 70 modules:
     hero (title / proposition / price+tier / CTA -- nothing else)
     -> Overview + At a Glance (fixed two-column grid)
     -> optional contextual callout (BEFORE YOU START / WORKED
        EXAMPLE / IMPORTANT TO KNOW -- most modules have none)
     -> What You Get (unchanged four-card component)
     -> Health Check + Related modules closing
   Content length changes page HEIGHT; it must never change which
   of these sections exists, their order, or their geometry.
========================================================= */

/* Web_Copy.md content can be multiple paragraphs (blank-line separated
   in source) where the register/guide-scrape fallback is always one --
   confirmed across all 70 files before this was wired in: Overview is
   3-4 paragraphs for every module, Who's-involved and Before-you-start
   are 2 paragraphs for roughly half. A single string dropped into one
   <p> would run them together with no break. This renders one <p> per
   paragraph (falling back text with no blank line just yields one <p>,
   identical to the previous single-paragraph behaviour). */
function renderParas(text, cls) {
  if (!text) return "";
  const classAttr = cls ? ` class="${cls}"` : "";
  return text.split(/\n\s*\n/).filter(Boolean).map((p) => `<p${classAttr}>${p.trim()}</p>`).join("\n      ");
}

function wordCount(s) { return (s || "").trim().split(/\s+/).filter(Boolean).length; }
/* 2026-09-02: found via visual QA that a naive split on every "." breaks
   mid-module-ID whenever source prose references another module inline
   ("...(P5.5)." -> a false sentence boundary right after "P5", producing
   a garbage hero fragment like "5)."). Module IDs (P5.1, F2.3, E9.1) are
   protected before splitting and restored after, so a real prerequisite
   citation in the prose no longer corrupts the hero proposition. */
function splitSentences(text) {
  if (!text) return [];
  const protectedText = text.replace(/\b([A-Z]{1,2}\d+)\.(\d+)\b/g, "$1 $2");
  const sentences = protectedText.match(/[^.!?]+[.!?]+(\s+|$)/g) || [protectedText.trim()];
  return sentences.map((s) => s.trim().replace(/ /g, "."));
}

/* Hero proposition (<=~45 words, per spec §11) and Overview body are
   built from the same two source fields (outcome, situation) so they
   never repeat each other verbatim: the hero consumes outcome plus as
   many leading situation sentences as fit inside the word budget: the
   Overview gets whatever's left. If situation is fully consumed by the
   hero (only true for the shortest-content modules -- genuinely minimal
   source, not a bug), Overview falls back to outcome alone; the same
   sentence appearing in both is an honest reflection of minimal source
   depth in that case, reported rather than padded with invented text. */
function buildToolContent(d) {
  /* Approved Web_Copy.md, when present, replaces this whole algorithmic
     split -- it already ships a purpose-written Hero proposition and a
     separate Overview, so there's nothing to derive. Falls through to
     the existing outcome/situation split for any module without one. */
  if (d.webCopy) return { hero: d.webCopy.heroProposition, overview: d.webCopy.overview };

  const outcome = (d.outcome || "").trim();
  const outcomeWords = wordCount(outcome);
  const sameAsOutcome = !d.situation || d.situation.trim() === outcome;
  const sentences = sameAsOutcome ? [] : splitSentences(d.situation);
  let hero = outcome;
  let words = outcomeWords;
  let consumed = 0;
  if (outcomeWords < 45) {
    for (const s of sentences) {
      const sw = wordCount(s);
      if (words + sw > 45) break;
      hero += (hero ? " " : "") + s;
      words += sw;
      consumed++;
    }
  }
  const remainder = sentences.slice(consumed).join(" ").trim();
  return { hero, overview: remainder || outcome, overviewIsDegenerate: !remainder };
}

/* At a Glance — Time / Who's involved / What you'll need (Materials
   mapped to this label per spec §12), only the rows that genuinely
   exist. Per spec: never fabricate a row, never show an empty labelled
   row, but the panel itself stays in the same right-column position
   even when a module has none of the three fields -- only F3.1 Culture
   Guide, per the 2026-09-02 audit, whose panel renders the heading with
   no rows beneath it rather than being silently dropped. Flagged
   explicitly in this session's report. */
function atAGlancePanel(d) {
  // Web_Copy.md fields win when present; otherwise the register/guide-scrape
  // one-liners (e.g. F3.1 Culture Guide had none of the three there -- that
  // gap is exactly what approved Web_Copy content fills).
  const time = (d.webCopy && d.webCopy.time) || d.time;
  const people = (d.webCopy && d.webCopy.people) || d.people;
  const materials = (d.webCopy && d.webCopy.materials) || d.materials;
  const rows = [];
  if (time) rows.push(["Time", time]);
  if (people) rows.push(["Who's involved", people]);
  if (materials) rows.push(["What you'll need", materials]);
  // A module with none of the three fields keeps the grid column occupied
  // but drops the "At a glance" label rather than showing a heading over
  // empty space.
  return { html: `<div class="at-a-glance">
        ${rows.length ? `<div class="info-panel-label mono">At a glance</div>
        <dl class="info-panel-list">
          ${rows.map(([label, value]) => `<div><dt>${label}</dt><dd>${renderParas(value)}</dd></div>`).join("\n          ")}
        </dl>` : ""}
      </div>`, rowCount: rows.length };
}

/* The real, register-derived "Requires first" link block -- shared by
   both the Web_Copy-present and Web_Copy-absent paths below so the two
   never drift apart. */
function prereqLinksHtml(prereqs) {
  if (!prereqs.length) return "";
  return `<p>${prereqs.length > 1 ? "This works best once these are already in place:" : "This works best once this is already in place:"}</p>
      <ul class="callout-list">${prereqs.map((p) => `<li><a href="/modules/${p.slug}.html">${p.name}</a></li>`).join("")}</ul>`;
}

/* Optional contextual callout -- the ONE controlled slot (spec §13),
   strictly one of BEFORE YOU START / WORKED EXAMPLE / IMPORTANT TO
   KNOW, same geometry, only label/icon/content differ. Determined
   programmatically: any module with a real "Requires first" edge gets
   BEFORE YOU START (22 of 70, per the 2026-09-02 audit) listing those
   real prerequisite modules; P4.1 keeps its existing governed WORKED
   EXAMPLE with the exact approved numbers, unchanged. No module uses
   IMPORTANT TO KNOW in this pass -- no reliable programmatic signal
   for it exists in the current register, and inventing one risks
   exactly the bespoke-page-per-module outcome this system exists to end. */
function contextualCallout(d) {
  if (d.id === "P4.1") {
    return calloutShell("Worked example", `<p>One week of measurement gets you one step clearly identified as the binding constraint, a sized cost in units per week, and a first attempt at getting more from that step before anyone signs off on new capital.</p>
      <p class="mono callout-figures">Press 3: 180 units/week &nbsp;·&nbsp; Packing: 310 units/week &nbsp;·&nbsp; Gap: approximately 130 units/week &nbsp;·&nbsp; Press 3 is the identified constraint.</p>`);
  }
  const prereqs = d.edges.filter((e) => e.label === "Requires first");
  /* Approved Web_Copy.md always wins this slot with "Before you start"
     text -- decision made explicitly: Web_Copy's own "Worked example"
     section is never rendered here, even where the source has a genuine
     one; it stays in the source file for reference only. But the real,
     register-derived prerequisite link is additive, not replaced by it
     -- appended beneath Web_Copy's prose where a real "Requires first"
     edge exists, so that navigational link is never lost. */
  if (d.webCopy && d.webCopy.beforeYouStart) {
    return calloutShell("Before you start", renderParas(d.webCopy.beforeYouStart) + prereqLinksHtml(prereqs));
  }
  if (prereqs.length) {
    return calloutShell("Before you start", prereqLinksHtml(prereqs));
  }
  return "";
}
function calloutShell(label, bodyHtml) {
  return `<section class="iv-section iv-callout"><div class="shell">
    <span class="info-panel-label mono">${label}</span>
    ${bodyHtml}
  </div></section>`;
}

/* Related modules — ranked by real relationship type (a hard prerequisite
   is more decision-relevant to a buyer than a loose overlap note), one
   deterministic display cap across all 70 pages. Labels are kept, not
   flattened to a generic "Related" -- the 2026-09-02 audit found 6
   genuinely distinct relationship types in the register data and no
   basis for judging the distinction unimportant. */
const EDGE_PRIORITY = ["Requires first", "Works well with", "Helps if you already have", "Related", "Shares evidence with", "Overlaps with"];
const RELATED_MAX = 4;
function rankedRelated(edges) {
  return [...edges]
    .sort((a, b) => EDGE_PRIORITY.indexOf(a.label) - EDGE_PRIORITY.indexOf(b.label))
    .slice(0, RELATED_MAX);
}

let generated = 0;

for (const listed of listing) {
  const d = getModuleData(listed.id);
  const cat = customerCategory(listed);
  const catImage = CATEGORY_IMAGES[cat];

  const { hero: proposition, overview } = buildToolContent(d);

  /* Showcase pricing shown as an explicit showcase price against the
     standard price -- never as a struck-through "was" discount device
     (Experience Authority §15 / Phase 4 ruling §11: "do not invent
     scarcity," no was/now framing). One purchase-row component,
     unchanged geometry regardless of tier/showcase state (spec §11). */
  const priceBlock = d.hasEssentials
    ? `<span class="iv-price">Essentials £${d.priceEssentials.price} · Pro £${d.pricePro.price}${d.pricePro.was ? ` <span class="showcase-note">(Showcase Pro price. Standard Pro price £${d.pricePro.was}.)</span>` : ""}</span>`
    : d.pricePro.was
      ? `<span class="iv-price">Pro £${d.pricePro.price} <span class="showcase-note">(Showcase price. Standard Pro price £${d.pricePro.was}.)</span></span>`
      : `<span class="iv-price">£${d.pricePro.price}</span>`;

  const glance = atAGlancePanel(d).html;
  const callout = contextualCallout(d);
  const related = rankedRelated(d.edges);
  const relatedHtml = related.length
    ? `<div class="iv-related">${related.map((e) => `<a class="tag" href="/modules/${e.slug}.html">${e.label}: ${e.name}</a>`).join("")}</div>`
    : "";

  const main = `
  <div class="shell"><nav class="breadcrumb"><a href="/modules/index.html">Modules</a> → <a href="/modules/index.html#${categoryAnchor(cat)}">${cat}</a> → ${d.name}</nav></div>
  <section class="iv-hero iv-hero-photo">
    <div class="iv-hero-media"><img src="${catImage.src}" alt="${catImage.alt}" width="${catImage.width}" height="${catImage.height}" style="object-position:${catImage.objectPosition};" loading="eager" decoding="async"></div>
    <div class="shell">
      <h1>${d.name}</h1>
      <p class="iv-situation">${proposition}</p>
      <div class="iv-buy" id="buy">${priceBlock}<a class="btn btn-primary on-light" href="/404.html">Buy now</a></div>
    </div>
  </section>

  <section class="iv-section" style="border-top:none;"><div class="shell">
    <div class="iv-overview-grid">
      <div class="iv-overview">
        <span class="eyebrow">Overview</span>
        ${renderParas(overview, "iv-core")}
      </div>
      ${glance}
    </div>
  </div></section>
  ${callout}
  <section class="iv-section"><div class="shell">
    <span class="eyebrow">What you get</span>
    <h2>Everything you need to put it to work</h2>
    ${packageGrid({ compact: true })}
  </div></section>

  <section class="iv-section iv-hc-band">
    <div class="shell">
      <h2 style="color:#fff;">Not sure this is the right starting point?</h2>
      <a class="btn-text on-navy" href="${HC_URL}">Run the Health Check <span class="arrow">→</span></a>
      ${relatedHtml ? `<div class="eyebrow on-navy iv-related-label">Related modules</div>${relatedHtml}` : ""}
    </div>
  </section>
  `;

  w(`modules/${d.slug}.html`, page({
    current: "modules",
    title: `${d.name} | Opsteady`,
    description: `${d.outcome} ${d.hasEssentials ? `Essentials £${d.priceEssentials.price}, ` : ""}Pro £${d.pricePro.price}.`,
    path: `/modules/${d.slug}`,
    main,
  }));
  generated++;
}

console.log(`Modules index + ${generated} module pages written.`);

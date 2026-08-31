"use strict";
const { w, page, HC_URL, getModuleData, getCatalogueListing, packageGrid, customerCategory, CATEGORY_ORDER, categoryAnchor } = require("./build.js");

const listing = getCatalogueListing();

/* Customer categories, group order and anchor ids now come from
   build.js (customerCategory / CATEGORY_ORDER / categoryAnchor) so
   the Tools index groupings and the homepage "What Opsteady can
   help you improve" grid (§2) stay identical and cross-link
   correctly -- one taxonomy, not two that can drift apart. */

/* ---- Tools index — grouped by customer category ---- */
const byGroup = {};
for (const m of listing) {
  const cat = customerCategory(m);
  (byGroup[cat] = byGroup[cat] || []).push({ ...m, id: m.id });
}
const groupOrder = CATEGORY_ORDER.filter((c) => byGroup[c]);
/* No per-group cap: search must be able to find every Tool, and a
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
          ${items.map((m) => `<a class="idx-row" data-search="${m.name.toLowerCase()} ${m.outcome.toLowerCase()}" href="/site/interventions/${m.slug}.html">
            <span><span class="idx-name">${m.name}</span><br><span class="idx-outcome">${m.outcome}</span></span>
            <span class="idx-price mono">${m.showcase ? `From £${m.pricePro}` : (m.priceEssentials ? `£${m.priceEssentials}–£${m.pricePro}` : `£${m.pricePro}`)}</span>
          </a>`).join("\n          ")}
        </div>
      </div>`;
}).join("\n      ");

w("site/interventions/index.html", page({
  current: "interventions",
  title: "Tools — Opsteady",
  description: "Find the Opsteady Tool you need, grouped by what it helps you fix.",
  path: "/interventions",
  main: `
  <!-- GOVERNED IMAGE SLOT (not yet sourced -- 02_brand/110_photography.md §10.2a):
       subject: a genuine, non-generic manufacturing working environment (equipment
       detail, inspection, or material movement), consistent with the homepage hero
       and the approved 5-image signature family in
       00_SYSTEM/OPSTEADY-2.0-VISUAL-ASSET-MATRIX.md. Not sourced in this pass --
       per the brief's own §12 fallback, no placeholder image is used here; ship
       the typographic hero below until a real asset is produced. -->
  <section class="page-hero tools-hero">
    <div class="shell">
      <div class="eyebrow on-navy">Tools</div>
      <h1>Find the one you need, or see what's available.</h1>
      <p>Each Tool is a complete, practical way to fix one specific thing — the working file itself, clear instructions, examples and guidance for putting it to work, not just a blank template.</p>
      <div class="idx-search-wrap">
        <input type="search" id="idx-search" class="idx-search" placeholder="Search: &quot;skills matrix,&quot; &quot;changeover,&quot; &quot;delivery&quot;..." aria-label="Search Tools">
      </div>
      <p>Not sure which one? <a class="btn-text on-navy" href="${HC_URL}" style="margin-left:6px;">Run the health check instead →</a></p>
    </div>
  </section>
  <section class="page-section">
    <div class="shell">
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

/* ---- One Tool page per commercially-available module ----
   Dramatically simplified vs. the prior 10-section archetype
   (situation/fit/outcome/contents/effort/tier-table/sample/5-item-FAQ):
   2-3 short paragraphs, the shared compact package component, a short
   Essentials/Pro line where both exist, and compact commercial facts --
   no reproduced methodology, no FAQ wall. Per the brief's own
   instruction: this is a sales page, not the Tool itself. */
let generated = 0;
const p41StageTag = "Observe & Learn"; /* real, from P4.1's own Framing.md — only module with a verified stage tag; not extended to others without equivalent evidence */

/* Customer-safe "when is this useful" clause — deliberately does not
   reuse product-data.js's stageContext()/stageProse, which names
   "Pillar"/"Foundation" (internal taxonomy). Fixed at the point of use
   rather than in the shared data layer, which other, dormant prototype
   generators also consume. */
function whenRightFor(d, cat) {
  if (d.category === "Foundation") return "it's usually worth putting in place early — it's a sitewide standard most other Tools in this area build on.";
  if (d.category === "Enabler") return "it's usually useful alongside other Tools, not tied to one stage.";
  if (d.lead) return `it's usually the starting point for ${cat}.`;
  const req = d.edges.find((e) => e.label === "Requires first") || d.edges[0];
  return req ? `it's usually useful once ${req.name} is already in place.` : `it's usually useful once the basics for ${cat} are in place.`;
}

for (const listed of listing) {
  const d = getModuleData(listed.id);
  const cat = customerCategory(listed);

  const isP41 = d.id === "P4.1";
  const situation = isP41
    ? "For a site where lead times keep creeping up, every station looks busy, and nobody can say for certain which one is actually setting the pace."
    : (d.situation || d.outcome);

  /* Showcase pricing shown as an explicit showcase price against the
     standard price -- never as a struck-through "was" discount device
     (Experience Authority §15 / Phase 4 ruling §11: "do not invent
     scarcity," no was/now framing). */
  const priceBlock = d.hasEssentials
    ? `<span class="iv-price">Essentials £${d.priceEssentials.price} · Pro £${d.pricePro.price}${d.pricePro.was ? ` <span class="showcase-note">(Showcase Pro price. Standard Pro price £${d.pricePro.was}.)</span>` : ""}</span>`
    : d.pricePro.was
      ? `<span class="iv-price">Pro — £${d.pricePro.price} <span class="showcase-note">(Showcase price. Standard Pro price £${d.pricePro.was}.)</span></span>`
      : `<span class="iv-price">£${d.pricePro.price}</span>`;

  /* Paragraph 1 — what it helps you achieve (the hero above already
     states the situation/problem, so this doesn't repeat it). */
  const p1 = isP41
    ? "Every site has an opinion on what's slowing the line — usually the loudest voice or the most recent annoyance, rarely checked against data. The Bottleneck Analysis Tool finds the real constraint: the one step that sets the pace for everything after it, measured, not guessed."
    : d.outcome;

  /* Paragraph 2 — what your team actually does with it. */
  const p2 = isP41
    ? "One week of measurement gets you one step clearly identified as the binding constraint, a sized cost in units per week, and a first attempt at getting more from that step before anyone signs off on new capital. Worked example in the Tool: Press 3 measured at 180 units/week against Packing at 310 — roughly 130 units a week sitting on the table, and Press 3, not the station everyone blamed, was the actual constraint."
    : `Your team works through it using the guide and working materials below — ${whenRightFor(d, cat)}`;

  const factTags = [];
  if (d.time) factTags.push(`<div class="iv-fact"><span class="iv-fact-label mono">Time</span>${d.time}</div>`);
  if (d.people) factTags.push(`<div class="iv-fact"><span class="iv-fact-label mono">Who's involved</span>${d.people}</div>`);
  if (d.materials) factTags.push(`<div class="iv-fact"><span class="iv-fact-label mono">Materials</span>${d.materials}</div>`);

  const tierNote = d.hasEssentials
    ? `<p class="iv-tier-note">Essentials gets your team running with the tool, instructions and the reasoning behind the main decisions. Pro adds the full playbook — failure modes, edge cases and the judgement calls the standard case doesn't cover.</p>`
    : "";

  const relatedHtml = d.edges.length
    ? `<div class="iv-related">${d.edges.map((e) => `<a class="tag" href="/site/interventions/${e.slug}.html">${e.label}: ${e.name}</a>`).join("")}</div>`
    : "";

  const main = `
  <div class="shell"><nav class="breadcrumb"><a href="/site/interventions/index.html">Tools</a> → <a href="/site/interventions/index.html#${categoryAnchor(cat)}">${cat}</a> → ${d.name}</nav></div>
  <section class="iv-hero">
    <div class="shell">
      ${isP41 ? `<span class="tag on-navy">${p41StageTag}</span>` : ""}
      <h1>${d.name}</h1>
      <p class="iv-situation">${situation}</p>
      <div class="iv-buy" id="buy">${priceBlock}<a class="btn btn-primary on-light" href="#buy">Buy now</a></div>
    </div>
  </section>

  <section class="iv-section" style="border-top:none;"><div class="shell">
    <p class="iv-core">${p1}</p>
    <p class="iv-core">${p2}</p>
  </div></section>

  <section class="iv-section"><div class="shell">
    <span class="eyebrow">What you get</span>
    <h2>Everything you need to put it to work</h2>
    ${packageGrid({ compact: true })}
    ${tierNote}
    ${factTags.length ? `<div class="iv-facts">${factTags.join("")}</div>` : ""}
  </div></section>

  <section class="iv-section iv-hc-band">
    <div class="shell">
      <h2 style="color:#fff;">Not sure this is the right starting point?</h2>
      <a class="btn-text on-navy" href="${HC_URL}">Run the health check <span class="arrow">→</span></a>
      ${relatedHtml}
    </div>
  </section>
  `;

  w(`site/interventions/${d.slug}.html`, page({
    current: "interventions",
    title: `${d.name} — Opsteady`,
    description: `${d.outcome} ${d.hasEssentials ? `Essentials £${d.priceEssentials.price}, ` : ""}Pro £${d.pricePro.price}.`,
    path: `/interventions/${d.slug}`,
    main,
  }));
  generated++;
}

console.log(`Interventions index + ${generated} intervention pages written.`);

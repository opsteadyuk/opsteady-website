"use strict";
const { w, page, HC_URL, getModuleData, getCatalogueListing } = require("./build.js");

const listing = getCatalogueListing();

/* ---- Customer-recognisable groupings for the Tools index (Phase 4 ruling:
   "Use the approved customer groupings ... do not recreate the internal
   Foundations/Pillars/Enablers taxonomy as customer navigation. No F/P/E
   codes.") Mapped from register group -> customer language, not the
   reverse. P4's flow-vs-delivery split reuses the exact division already
   evidenced in OPSTEADY-2.0-SITE-STRUCTURE-AND-CUSTOMER-JOURNEY.md §F's
   problem-family table (flow-and-bottlenecks vs on-time-delivery), not
   invented here. Enablers don't fit any of the five problem-family
   categories (the register itself calls them cross-cutting, not tied to
   one stage) -- given an honest sixth bucket rather than forced into a
   bad fit. */
const FLOW_IDS = new Set(["P4.1", "P4.6", "P4.7", "P4.8", "P4.9"]);
function customerCategory(m) {
  if (m.group === "P4 Delivery & Planning") return FLOW_IDS.has(m.id) ? "Output & flow" : "Delivery & planning";
  if (m.group === "P5 Asset Care & Maintenance") return "Output & flow";
  if (m.group === "P8 Cost & Resource") return "Delivery & planning";
  if (m.group === "P2 Daily Management & Performance") return "Running the day";
  if (m.group === "P3 Quality" || m.group === "P7 Continuous Improvement") return "Quality";
  if (["P1 People & Capability", "P6 Visual Management", "F1 Performance Framework", "F2 Standards", "F3 Culture", "F4 Visual Management", "F5 Strategy Deployment"].includes(m.group)) return "People & standards";
  return "Wider capability"; // Enablers
}
const CATEGORY_ORDER = ["Output & flow", "Delivery & planning", "Running the day", "Quality", "People & standards", "Wider capability"];

/* ---- Tools index — grouped by customer category, capped per group ---- */
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
  return `<div class="idx-group" id="${g.replace(/\s+/g,'-').replace(/&/g,'and')}">
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
  <section class="page-hero">
    <div class="shell">
      <div class="eyebrow on-navy">Tools</div>
      <h1>Find the one you need, or see what's available.</h1>
      <p>Each Tool is a complete, practical way to fix one specific thing — most include the working file itself, clear instructions, examples, and guidance for putting it to work, not just a blank template.</p>
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

/* ---- One Tool page per commercially-available module ---- */
let generated = 0;
const p41StageTag = "Observe & Learn"; /* real, from P4.1's own Framing.md — only module with a verified stage tag; not extended to others without equivalent evidence */
const groupLabel = (g) => g.replace(/^[EFP]\d+(\.\d+)?\s+/, "");

/* Customer-safe "when is this useful" text — deliberately does not reuse
   product-data.js's stageContext()/stageProse, which names "Pillar" and
   "Foundation" (internal taxonomy) and doesn't read grammatically inside
   the "Usually useful ..." template. Fixed at the point of use rather
   than in the shared data layer, since that layer is also consumed by
   other (dormant, non-production) generators not in scope here. */
function whenRightFor(d) {
  if (d.category === "Foundation") return "Usually useful early — a sitewide standard most other Tools in this area build on.";
  if (d.category === "Enabler") return "Usually useful alongside other Tools, not tied to one stage.";
  if (d.lead) return `Usually the starting point for ${groupLabel(d.group)}.`;
  const req = d.edges.find((e) => e.label === "Requires first") || d.edges[0];
  return req ? `Usually useful once ${req.name} is already in place.` : `Usually useful once the basics for ${groupLabel(d.group)} are in place.`;
}

for (const listed of listing) {
  const d = getModuleData(listed.id);

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

  const whoFor = isP41
    ? "Anyone about to sign off on new equipment, overtime, or headcount to fix a capacity problem, before knowing for certain which step it would actually fix."
    : `Teams working on ${groupLabel(d.group)}, where the goal is: ${d.outcome.toLowerCase().replace(/\.$/, "")}.`;

  const whenRight = isP41
    ? "Run it before you spend money on capacity, not after. It works on any process with a fixed sequence of dependent steps."
    : whenRightFor(d);

  const whatItDoes = isP41
    ? `Every site has an opinion on what's slowing the line — usually the loudest voice or the most recent annoyance, rarely checked against data. This finds the real constraint: the one step that sets the pace for everything after it.
    <br><br>One week of measurement gets you: one step clearly identified as the binding constraint, a sized cost in units per week, and a first attempt at getting more from that step before anyone requests new capital.
    <br><br><em>Worked example in the Tool: Press 3 measured at 180 units/week against Packing at 310 — roughly 130 units a week sitting on the table, and Press 3, not the station everyone blamed, was the actual constraint.</em>`
    : d.outcome;

  const insideHtml = d.inside.length
    ? d.inside.map((i) => `<div class="iv-inside-item"><span class="iv-inside-kind mono">${i.kind}</span><span>${i.label}</span></div>`).join("\n          ")
    : `<p>Contents confirmed on request — full listing pending final content pass for this module.</p>`;

  const factRows = [];
  if (d.time) factRows.push(`<div class="iv-fact-row"><dt>Time</dt><dd>${d.time}</dd></div>`);
  if (d.people) factRows.push(`<div class="iv-fact-row"><dt>Who's involved</dt><dd>${d.people}</dd></div>`);
  if (d.materials) factRows.push(`<div class="iv-fact-row"><dt>Materials</dt><dd>${d.materials}</dd></div>`);
  if (!factRows.length) factRows.push(`<div class="iv-fact-row"><dt>Time</dt><dd>See the guide for a full effort estimate.</dd></div>`);

  const tierSection = d.hasEssentials ? `
  <section class="iv-section"><div class="shell">
    <span class="eyebrow">Essentials vs Pro</span>
    <h2>How the tiers differ</h2>
    <table class="iv-tier-table">
      <thead><tr><th></th><th>Essentials</th><th>Pro</th></tr></thead>
      <tbody>
        <tr><td>The tool and instructions</td><td>✓</td><td>✓</td></tr>
        <tr><td>Reasoning for the main decisions</td><td>✓</td><td>✓</td></tr>
        <tr><td>Full playbook, failure modes, edge cases</td><td>–</td><td>✓</td></tr>
      </tbody>
    </table>
  </div></section>` : "";

  const sampleSection = d.sample ? `
  <section class="iv-section"><div class="shell">
    <span class="eyebrow">Is this real?</span>
    <h2>Sample</h2>
    <div class="iv-sample-frame"><p class="mono" style="font-size:13px;">${d.sample}</p></div>
  </div></section>` : `
  <section class="iv-section"><div class="shell">
    <span class="eyebrow">Is this real?</span>
    <h2>Sample</h2>
    <p>A real, anonymised sample is included with every purchase. A public preview for this specific module is pending a dedicated content pass.</p>
  </div></section>`;

  const faqSection = d.faq.length ? `
  <section class="iv-section"><div class="shell">
    <span class="eyebrow">Common questions</span>
    <h2>FAQ</h2>
    <div class="iv-faq">
      ${d.faq.slice(0, 5).map((f) => `<details><summary>${f.q}</summary><p>${f.a}</p></details>`).join("\n      ")}
    </div>
  </div></section>` : "";

  const relatedHtml = d.edges.length
    ? `<div class="iv-related">${d.edges.map((e) => `<a class="tag" href="/site/interventions/${e.slug}.html">${e.label}: ${e.name}</a>`).join("")}</div>`
    : "";

  const main = `
  <div class="shell"><nav class="breadcrumb"><a href="/site/interventions/index.html">Tools</a> → ${groupLabel(d.group)} → ${d.name}</nav></div>
  <section class="iv-hero">
    <div class="shell">
      ${isP41 ? `<span class="tag on-navy">${p41StageTag}</span>` : ""}
      <h1>${d.name}</h1>
      <p class="iv-situation">${situation}</p>
      <div class="iv-buy">${priceBlock}<a class="btn btn-primary on-light" href="#buy">Buy now</a></div>
    </div>
  </section>

  <section class="iv-section" style="border-top:none;"><div class="shell">
    <span class="eyebrow">Situation</span>
    <h2>Who this is for</h2>
    <p class="iv-who">${whoFor}</p>
  </div></section>

  <section class="iv-section"><div class="shell">
    <span class="eyebrow">Fit</span>
    <h2>When it's the right Tool</h2>
    <p class="iv-stage-note">${whenRight}</p>
  </div></section>

  <section class="iv-section"><div class="shell">
    <span class="eyebrow">Outcome</span>
    <h2>What it does</h2>
    <p class="iv-what">${whatItDoes}</p>
  </div></section>

  <section class="iv-section"><div class="shell">
    <span class="eyebrow">Contents</span>
    <h2>What is in it</h2>
    <div class="iv-inside">
      ${insideHtml}
    </div>
  </div></section>

  <section class="iv-section"><div class="shell">
    <span class="eyebrow">Effort</span>
    <h2>What it takes</h2>
    <dl class="iv-fact-table">${factRows.join("")}</dl>
  </div></section>
  ${tierSection}
  ${sampleSection}
  ${faqSection}

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

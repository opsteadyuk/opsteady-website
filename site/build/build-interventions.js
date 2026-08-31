"use strict";
const { w, page, HC_URL, getModuleData, getCatalogueListing, packageGrid, photoHero, customerCategory, CATEGORY_ORDER, categoryAnchor } = require("./build.js");

/* ---- Tool-category photography (Level 2), 2026-09-01 ----
   8 of the 9 real customer categories (CATEGORY_ORDER in build.js) have an
   assigned photograph from the approved signature-manufacturing set; "Wider
   capability" (the 11 Enablers) has none -- the register itself calls
   Enablers cross-cutting, not tied to one area, so no single photo honestly
   represents them, and none is invented here. Determined programmatically
   from customerCategory(), never hand-mapped per module: every Tool in a
   category shares that category's one image (explicitly sanctioned --
   "if multiple Tools can share a category image, that is acceptable"). */
const CATEGORY_IMAGES = {
  "Output & Flow": {
    src: "/site/assets/photography/category-output-flow.jpg",
    alt: "A packaging line with bottles moving along a conveyor toward a rotary filling station, pallets of materials staged alongside.",
    width: 1168, height: 784, objectPosition: "38% 58%",
  },
  "Delivery & Planning": {
    src: "/site/assets/photography/category-delivery-planning.jpg",
    alt: "A production planner at a shopfloor desk, writing at a workstation next to a printed schedule board.",
    width: 1168, height: 784, objectPosition: "70% 42%",
  },
  "Running the Day": {
    src: "/site/assets/photography/category-running-the-day.jpg",
    alt: "A team of four gathered around a performance board on the shop floor, one operator pointing to a chart during a briefing.",
    width: 1168, height: 784, objectPosition: "56% 38%",
  },
  Quality: {
    src: "/site/assets/photography/category-quality.jpg",
    alt: "An operator using callipers to check the dimensions of a machined part at a workbench.",
    width: 1168, height: 784, objectPosition: "36% 48%",
  },
  "Equipment & Reliability": {
    src: "/site/assets/photography/category-equipment-reliability.jpg",
    alt: "A maintenance technician working inside an open machine cabinet, tools laid out on a cart alongside.",
    width: 1400, height: 942, objectPosition: "46% 42%",
  },
  "People & Skills": {
    src: "/site/assets/photography/category-people-skills.jpg",
    alt: "Two colleagues working together at a bench, one guiding the other through an assembly task.",
    width: 1168, height: 784, objectPosition: "50% 36%",
  },
  "Standards & Improvement": {
    src: "/site/assets/photography/category-standards-improvement.jpg",
    alt: "A worker in food-safety PPE following a documented reference standard while preparing product at a stainless steel bench.",
    width: 1168, height: 784, objectPosition: "48% 38%",
  },
  "Performance & Decision Making": {
    src: "/site/assets/photography/category-performance-decision-making.jpg",
    alt: "A small team reviewing a wall-mounted performance chart together on the production floor.",
    width: 1168, height: 784, objectPosition: "32% 38%",
  },
};

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
  title: "Tools | Opsteady",
  description: "Find the Opsteady Tool you need, grouped by what it helps you fix.",
  path: "/interventions",
  main: `
  ${photoHero({
    eyebrow: "Tools",
    h1: "Find the one you need, or see what's available.",
    sub: "Each Tool is a complete, practical way to fix one specific thing: the working file itself, clear instructions, examples and guidance for putting it to work, not just a blank template.",
    spec: "Tools index hero. No image was assigned to this surface in the 2026-08-31 approved photography set (Level 1 major-page heroes: Home, Health Check, Problems hub, How It Works, Who We Are -- Tools index isn't in that list). Deliberately not filled with a repurposed asset from elsewhere in this pass, per standing instruction not to invent a mapping. If Matt wants a dedicated Tools-index hero, it needs its own commissioned/approved asset -- until then this gradient slot is the correct, honest treatment. Subject if commissioned: a genuine, non-generic manufacturing working environment, landscape, subject weighted right-of-frame, left third clear for the headline/search field.",
  })}
  <section class="page-section">
    <div class="shell">
      <div class="idx-search-wrap">
        <input type="search" id="idx-search" class="idx-search" placeholder="Search: &quot;skills matrix,&quot; &quot;changeover,&quot; &quot;delivery&quot;..." aria-label="Search Tools">
      </div>
      <p style="margin-top:14px;">Not sure which one? <a class="btn-text" href="${HC_URL}">Run the health check instead <span class="arrow">→</span></a></p>
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
  if (d.category === "Foundation") return "it's usually worth putting in place early: it's a sitewide standard most other Tools in this area build on.";
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
      ? `<span class="iv-price">Pro £${d.pricePro.price} <span class="showcase-note">(Showcase price. Standard Pro price £${d.pricePro.was}.)</span></span>`
      : `<span class="iv-price">£${d.pricePro.price}</span>`;

  /* Paragraph 1 — what it helps you achieve (the hero above already
     states the situation/problem, so this doesn't repeat it). */
  const p1 = isP41
    ? "Every site has an opinion on what's slowing the line, usually the loudest voice or the most recent annoyance, rarely checked against data. The Bottleneck Analysis Tool finds the real constraint: the one step that sets the pace for everything after it, measured, not guessed."
    : d.outcome;

  /* Paragraph 2 — what your team actually does with it. */
  const p2 = isP41
    ? "One week of measurement gets you one step clearly identified as the binding constraint, a sized cost in units per week, and a first attempt at getting more from that step before anyone signs off on new capital. Worked example in the Tool: Press 3 measured at 180 units/week against Packing at 310, roughly 130 units a week sitting on the table, and Press 3, not the station everyone blamed, was the actual constraint."
    : `Your team works through it using the guide and working materials below: ${whenRightFor(d, cat)}`;

  const factTags = [];
  if (d.time) factTags.push(`<div class="iv-fact"><span class="iv-fact-label mono">Time</span>${d.time}</div>`);
  if (d.people) factTags.push(`<div class="iv-fact"><span class="iv-fact-label mono">Who's involved</span>${d.people}</div>`);
  if (d.materials) factTags.push(`<div class="iv-fact"><span class="iv-fact-label mono">Materials</span>${d.materials}</div>`);

  const tierNote = d.hasEssentials
    ? `<p class="iv-tier-note">Essentials gets your team running with the tool, instructions and the reasoning behind the main decisions. Pro adds the full playbook: failure modes, edge cases and the judgement calls the standard case doesn't cover.</p>`
    : "";

  const relatedHtml = d.edges.length
    ? `<div class="iv-related">${d.edges.map((e) => `<a class="tag" href="/site/interventions/${e.slug}.html">${e.label}: ${e.name}</a>`).join("")}</div>`
    : "";

  const catImage = CATEGORY_IMAGES[cat];
  const heroMedia = catImage
    ? `<div class="iv-hero-media"><img src="${catImage.src}" alt="${catImage.alt}" width="${catImage.width}" height="${catImage.height}" style="object-position:${catImage.objectPosition};" loading="eager" decoding="async"></div>`
    : `<!-- No photograph assigned to "Wider capability" (Enablers) -- the register calls Enablers
       cross-cutting, not tied to one area, so no single category photo honestly represents them.
       Not filled with a mismatched image; the gradient slot below is the correct treatment. -->
  <div class="iv-hero-slot"></div>`;

  const main = `
  <div class="shell"><nav class="breadcrumb"><a href="/site/interventions/index.html">Tools</a> → <a href="/site/interventions/index.html#${categoryAnchor(cat)}">${cat}</a> → ${d.name}</nav></div>
  <section class="iv-hero${catImage ? " iv-hero-photo" : ""}">
    ${heroMedia}
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
    <span class="eyebrow" style="display:block;margin-top:36px;">What you get</span>
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
    title: `${d.name} | Opsteady`,
    description: `${d.outcome} ${d.hasEssentials ? `Essentials £${d.priceEssentials.price}, ` : ""}Pro £${d.pricePro.price}.`,
    path: `/interventions/${d.slug}`,
    main,
  }));
  generated++;
}

console.log(`Interventions index + ${generated} intervention pages written.`);

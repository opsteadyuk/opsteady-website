"use strict";
const { w, page, HC_URL, getModuleData, getCatalogueListing } = require("./build.js");

const listing = getCatalogueListing();

/* ---- Interventions index — grouped by group, capped per group ---- */
const byGroup = {};
for (const m of listing) {
  (byGroup[m.group] = byGroup[m.group] || []).push(m);
}
const groupOrder = Object.keys(byGroup).sort();
const CAP = 6;

const idxHtml = groupOrder.map((g) => {
  const items = byGroup[g];
  const shown = items.slice(0, CAP);
  const rest = items.length - shown.length;
  return `<div class="idx-group">
        <h2>${g}</h2>
        <div class="idx-rows">
          ${shown.map((m) => `<a class="idx-row" href="/site/interventions/${m.slug}.html">
            <span><span class="idx-name">${m.name}</span><br><span class="idx-outcome">${m.outcome}</span></span>
            <span class="idx-price mono">${m.showcase ? `£${m.pricePro}` : (m.priceEssentials ? `£${m.priceEssentials}–£${m.pricePro}` : `£${m.pricePro}`)}</span>
          </a>`).join("\n          ")}
          ${rest > 0 ? `<a class="idx-row" href="/site/interventions/index.html#${g.replace(/\s+/g,'-')}"><span class="idx-outcome">See ${rest} more in ${g} →</span></a>` : ""}
        </div>
      </div>`;
}).join("\n      ");

w("site/interventions/index.html", page({
  current: "interventions",
  title: "Interventions — Opsteady",
  description: "Interventions, grouped by the problem they solve.",
  path: "/interventions",
  main: `
  <section class="page-hero">
    <div class="shell">
      <div class="eyebrow on-navy">Interventions</div>
      <h1>Interventions, grouped by the problem they solve.</h1>
      <p>Not sure where to start? <a class="btn-text on-navy" href="${HC_URL}" style="margin-left:6px;">Run the health check instead →</a></p>
    </div>
  </section>
  <section class="page-section">
    <div class="shell">
      ${idxHtml}
    </div>
  </section>
  `,
}));

/* ---- One intervention page per commercially-available module ---- */
let generated = 0;
const p41StageTag = "Observe & Learn"; /* real, from P4.1's own Framing.md — only module with a verified stage tag; not extended to others without equivalent evidence */

for (const listed of listing) {
  const d = getModuleData(listed.id);

  const isP41 = d.id === "P4.1";
  const situation = isP41
    ? "For a site where lead times keep creeping up, every station looks busy, and nobody can say for certain which one is actually setting the pace."
    : (d.situation || d.outcome);

  const priceBlock = d.hasEssentials
    ? `<span class="iv-price">Essentials £${d.priceEssentials.price} · Pro £${d.pricePro.price}${d.pricePro.was ? `<span class="was">was £${d.pricePro.was}</span>` : ""}</span>`
    : `<span class="iv-price">£${d.pricePro.price}${d.pricePro.was ? `<span class="was">was £${d.pricePro.was}</span>` : ""}</span>`;

  const whoFor = isP41
    ? "Anyone about to sign off on new equipment, overtime, or headcount to fix a capacity problem, before knowing for certain which step it would actually fix."
    : `Teams working on ${d.group}, where the goal is: ${d.outcome.toLowerCase().replace(/\.$/, "")}.`;

  const whenRight = isP41
    ? "Usually useful when output feels capped but nobody's measured which step is actually limiting it."
    : `Usually useful ${d.stageProse.charAt(0).toLowerCase() + d.stageProse.slice(1)}`;

  const whatItDoes = isP41
    ? "Finds the one step actually limiting your output, measured, not the one everyone blames. Gives you a sized cost, and a first attempt at fixing it for free before any capital request."
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
  <div class="shell"><nav class="breadcrumb"><a href="/site/interventions/index.html">Interventions</a> → ${d.group} → ${d.name}</nav></div>
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
    <h2>When this is the right intervention</h2>
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

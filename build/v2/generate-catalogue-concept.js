#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");
const { page } = require("./shell.js");
const { getCatalogueListing } = require("../lib/product-data.js");

function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildCatalogueConcept() {
  const outDir = path.join(__dirname, "..", "..", "v2");
  const rows = getCatalogueListing();

  const groups = [
    { key: "Foundation", label: "Foundations", note: "Come first. Every Pillar module builds on these." },
    { key: "Pillar", label: "Pillars", note: "The eight operational Pillars — most of the catalogue lives here." },
    { key: "Enabler", label: "Enablers", note: "Run alongside the Foundations and Pillars." },
  ];

  const hasDetailPage = { "P4.1": true };

  const rowHtml = (m) => {
    const linkable = hasDetailPage[m.id];
    const href = linkable ? `/v2/catalogue/${m.slug}.html` : `/catalogue/${m.slug}.html`;
    const showcaseTag = m.showcase ? ' <span class="sys-showcase-flag" style="font-size:.6rem;margin-left:.5rem">Showcase</span>' : "";
    const leadTag = m.lead ? " &middot; Pillar lead" : "";
    return `<a class="sys-cat-row" href="${href}" data-category="${esc(m.category)}">
      <span class="sys-cat-code">${esc(m.id)}</span>
      <span>
        <span class="sys-cat-name">${esc(m.name)}${showcaseTag}</span>
        <span class="sys-cat-outcome">${esc(m.group)}${leadTag}</span>
      </span>
      <span class="sys-cat-badge">${m.band === "band_2" ? "Band 2" : "Band 1"}</span>
      <span class="sys-cat-price">${m.priceProWas ? `<span class="was">&pound;${m.priceProWas}</span>` : ""}&pound;${m.pricePro}</span>
    </a>`;
  };

  const sections = groups
    .map((g) => {
      const items = rows.filter((r) => r.category === g.key);
      return `<section class="sys-section shell" data-group-section="${g.key}">
        <div class="sys-head"><span class="sys-num">${g.key === "Foundation" ? "01" : g.key === "Pillar" ? "02" : "03"}</span><div><h2>${g.label}</h2><p style="color:var(--ops-n60);font-size:.9rem;margin-top:.2rem">${g.note} &middot; ${items.length} modules</p></div></div>
        <div>
          <div class="sys-cat-row head">
            <span>ID</span><span>Module</span><span>Band</span><span style="text-align:right">Pro price</span>
          </div>
          ${items.map(rowHtml).join("\n")}
        </div>
      </section>`;
    })
    .join("\n");

  const total = rows.length;
  const band2 = rows.filter((r) => r.band === "band_2").length;

  const body = `
  <section class="sys-hero shell" style="padding-bottom:1rem">
    <div>
      <span class="sys-label">Catalogue &middot; concept view</span>
      <h1 style="font-size:2.2rem;margin-top:1rem">All ${total} modules, one table</h1>
      <p class="sys-lede">Every qualified module in the library, grouped the way the system is actually built: Foundations first, then the eight Pillars, then the Enablers that run alongside them. Full evaluation pages are being rebuilt in this design one at a time — Bottleneck Analysis (P4.1) is live below as the first.</p>
    </div>
    <div class="sys-readout">
      <div class="sys-readout-head">Catalogue spec</div>
      <div class="sys-readout-body">
        <div class="sys-readout-row"><span class="k">Total modules</span><span class="v">${total}</span></div>
        <div class="sys-readout-row"><span class="k">Band 1 / Band 2</span><span class="v">${total - band2} / ${band2}</span></div>
        <div class="sys-readout-row"><span class="k">Showcase modules</span><span class="v">3</span></div>
      </div>
    </div>
  </section>

  <div class="shell">
    <div class="sys-cat-filters" role="group" aria-label="Filter by group">
      <button type="button" class="active" data-filter="all">All</button>
      <button type="button" data-filter="Foundation">Foundations</button>
      <button type="button" data-filter="Pillar">Pillars</button>
      <button type="button" data-filter="Enabler">Enablers</button>
    </div>
  </div>

  ${sections}

  <div class="sys-band">
    <div class="shell sys-band-pad" style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1.5rem">
      <div>
        <h3 style="font-family:var(--ops-font-display);font-weight:600;color:#fff;font-size:1.3rem;margin-bottom:.4rem">Not sure where to start?</h3>
        <p style="color:var(--ops-text-inverse-secondary);margin:0">The Health Check reads your whole operation and orders the catalogue for you.</p>
      </div>
      <a class="sys-btn on-navy lg" href="https://healthcheck.opsteady.co.uk/">Run the Health Check</a>
    </div>
  </div>

  <script>
  (function(){
    var btns = document.querySelectorAll('.sys-cat-filters button');
    var sections = document.querySelectorAll('[data-group-section]');
    btns.forEach(function(b){
      b.addEventListener('click', function(){
        btns.forEach(function(x){ x.classList.remove('active'); });
        b.classList.add('active');
        var f = b.getAttribute('data-filter');
        sections.forEach(function(s){
          s.hidden = !(f === 'all' || s.getAttribute('data-group-section') === f);
        });
      });
    });
  })();
  </script>
`;

  const html = page({
    title: "Catalogue — Opsteady 2.0 (concept)",
    description: `All ${total} qualified modules, grouped by Foundation, Pillar and Enabler.`,
    current: "catalogue",
    bodyHtml: body,
  });
  fs.writeFileSync(path.join(outDir, "catalogue.html"), html, "utf8");
  console.log("v2 catalogue concept written, modules:", total);
}

buildCatalogueConcept();

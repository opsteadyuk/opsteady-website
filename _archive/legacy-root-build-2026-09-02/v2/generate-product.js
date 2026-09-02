#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");
const { page } = require("./shell.js");
const { getModuleData } = require("../lib/product-data.js");

function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildProduct(moduleId) {
  const m = getModuleData(moduleId);
  const outDir = path.join(__dirname, "..", "..", "v2", "catalogue");
  fs.mkdirSync(outDir, { recursive: true });

  const priceBlock = m.hasEssentials
    ? `<div class="sys-grid-2">
        <div class="sys-buy" style="border-width:1px">
          <div class="sys-buy-head" style="background:var(--ops-n70)"><span class="tier">Essentials</span><span class="price">&pound;${m.priceEssentials.price}</span></div>
          <div class="sys-buy-body">
            <ul><li>The tool, the instructions, the reasoning for the main decisions</li><li>Module FAQ and training document</li></ul>
            <button class="sys-btn ghost" type="button" disabled title="Checkout isn't live yet" style="width:100%">Buy Essentials</button>
          </div>
        </div>
        <div class="sys-buy">
          <div class="sys-buy-head"><span class="tier">Pro</span><span class="price">${m.pricePro.was ? `<span class="was">&pound;${m.pricePro.was}</span>` : ""}&pound;${m.pricePro.price}</span></div>
          <div class="sys-buy-body">
            <ul><li>The full playbook: why the scoring works, what to adapt, failure modes</li><li>Module FAQ and training document</li></ul>
            <button class="sys-btn" type="button" disabled title="Checkout isn't live yet" style="width:100%">Buy Pro</button>
          </div>
        </div>
      </div>`
    : `<div class="sys-buy" style="max-width:26rem">
        <div class="sys-buy-head"><span class="tier">${m.tierStructure === "single_tier_exception" ? "Essentials &amp; Pro, one guide" : "Pro"}</span><span class="price">${m.pricePro.was ? `<span class="was">&pound;${m.pricePro.was}</span>` : ""}&pound;${m.pricePro.price}</span></div>
        <div class="sys-buy-body">
          <ul><li>The complete guide, working file(s), FAQ and training document</li></ul>
          <button class="sys-btn" type="button" disabled title="Checkout isn't live yet" style="width:100%">Buy</button>
        </div>
      </div>`;

  const edgesBlock = m.edges.length
    ? `<section class="sys-section shell">
        <div class="sys-head"><span class="sys-num">06</span><div><h2>Related modules</h2></div></div>
        <div class="sys-grid-3">
          ${m.edges.slice(0, 3).map((e) => `<div class="sys-grid-pad"><span class="sys-panel-id" style="display:block;margin-bottom:.4rem">${esc(e.label)}</span><h3 style="font-size:1rem;margin-bottom:.4rem">${esc(e.name)}</h3><p style="color:var(--ops-n60);font-size:.88rem">${esc(e.outcome)}</p></div>`).join("\n")}
        </div>
      </section>`
    : "";

  const faqBlock = m.faq.length
    ? `<section class="sys-section shell">
        <div class="sys-head"><span class="sys-num">07</span><div><h2>Common questions</h2></div></div>
        <div class="sys-faq">
          ${m.faq.map((f) => `<details><summary>${esc(f.q)}</summary><div class="a">${esc(f.a)}</div></details>`).join("\n")}
        </div>
      </section>`
    : "";

  const showcaseFlag = m.showcase ? `<span class="sys-showcase-flag">Showcase Module</span>` : "";

  const body = `
  <div class="shell"><nav class="sys-crumb" aria-label="Breadcrumb"><a href="/v2/">Home</a> / <a href="/v2/catalogue.html">Catalogue</a> / <span class="current">${esc(m.name)}</span></nav></div>

  <section class="sys-hero shell" style="padding-top:1.5rem">
    <div>
      <span class="sys-label">${esc(m.category.toUpperCase())}${m.lead ? " &middot; PILLAR LEAD" : ""}</span>
      ${showcaseFlag}
      <h1 style="font-size:2.4rem;margin-top:1rem">${esc(m.name)}</h1>
      <p class="sys-lede">${esc(m.situation)}</p>
    </div>
    <div class="sys-readout">
      <div class="sys-readout-head">Module spec</div>
      <div class="sys-readout-body">
        <div class="sys-readout-row"><span class="k">Band</span><span class="v">${m.band === "band_2" ? "Band 2" : "Band 1"}</span></div>
        <div class="sys-readout-row"><span class="k">Group</span><span class="v" style="font-size:.85rem">${esc(m.group)}</span></div>
        <div class="sys-readout-row"><span class="k">Tier</span><span class="v" style="font-size:.85rem">${m.hasEssentials ? "Essentials + Pro" : m.tierStructure === "single_tier_exception" ? "Combined guide" : "Pro only"}</span></div>
      </div>
    </div>
  </section>

  <section class="sys-section shell">${priceBlock}</section>

  <section class="sys-section shell">
    <div class="sys-head"><span class="sys-num">01</span><div><h2>Who this is for</h2></div></div>
    <div class="sys-prose"><p>${esc(m.people ? "Built for " + m.people.charAt(0).toLowerCase() + m.people.slice(1) + "." : "Built for whoever on your site currently owns this problem.")}</p></div>
  </section>

  <section class="sys-section shell">
    <div class="sys-head"><span class="sys-num">02</span><div><h2>Where it sits</h2></div></div>
    <div class="sys-prose"><p>${esc(m.stageProse)} See the full sequence on <a href="/the-method.html" style="color:var(--ops-navy)">The Method</a>.</p></div>
  </section>

  <section class="sys-section shell">
    <div class="sys-head"><span class="sys-num">03</span><div><h2>What it does</h2></div></div>
    <div class="sys-prose"><p style="font-weight:600;color:var(--ops-navy)">${esc(m.outcome)}</p><p>${esc(m.situation)}</p></div>
  </section>

  <section class="sys-section shell">
    <div class="sys-head"><span class="sys-num">04</span><div><h2>What is in it</h2></div></div>
    <div class="sys-grid-2">
      ${m.inside.map((i) => `<div class="sys-grid-pad" style="display:flex;gap:.75rem;align-items:baseline"><span class="readout" style="font-size:.72rem;color:var(--ops-n60);border:1px solid var(--ops-border);padding:.15rem .4rem;flex-shrink:0">${esc(i.kind)}</span><span style="font-size:.92rem">${esc(i.label)}</span></div>`).join("\n")}
    </div>
  </section>

  <section class="sys-section shell">
    <div class="sys-head"><span class="sys-num">05</span><div><h2>What it takes</h2></div></div>
    <div class="sys-grid-2">
      <div class="sys-grid-pad"><span class="sys-panel-id" style="display:block;margin-bottom:.5rem">SETUP TIME</span><p style="font-size:.92rem;color:var(--ops-n70);margin:0">${esc(m.time || "See the guide's own “Before you start” section.")}</p></div>
      <div class="sys-grid-pad"><span class="sys-panel-id" style="display:block;margin-bottom:.5rem">WHO'S INVOLVED</span><p style="font-size:.92rem;color:var(--ops-n70);margin:0">${esc(m.people || "The person who owns this problem day to day.")}</p></div>
    </div>
  </section>

  ${m.id === "P5.6" ? `<section class="sys-section shell"><div class="sys-prereq"><span class="sys-label">Before you buy this one</span><p><strong>This module assumes your core asset-care disciplines are already stable.</strong></p></div></section>` : ""}

  ${edgesBlock}
  ${faqBlock}

  <div class="sys-band">
    <div class="shell sys-band-pad" style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1.5rem">
      <div>
        <h3 style="font-family:var(--ops-font-display);font-weight:600;color:#fff;font-size:1.3rem;margin-bottom:.4rem">Not sure this is the right one?</h3>
        <p style="color:var(--ops-text-inverse-secondary);margin:0">The Health Check tells you which module to start with, in order.</p>
      </div>
      <a class="sys-btn on-navy lg" href="https://healthcheck.opsteady.co.uk/">Run the Health Check</a>
    </div>
  </div>
`;

  const html = page({
    title: `${m.name} — Opsteady`,
    description: m.outcome,
    current: "catalogue",
    bodyHtml: body,
  });
  fs.writeFileSync(path.join(outDir, `${m.slug}.html`), html, "utf8");
  console.log("v2 product page written:", m.slug);
}

buildProduct("P4.1");

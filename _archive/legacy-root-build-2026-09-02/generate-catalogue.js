#!/usr/bin/env node
/*
 * Opsteady 2.0 — catalogue + product-evaluation page generator.
 *
 * Reads 04_products/00_PRODUCT_REGISTER.yaml (identity, commercial state,
 * relationships) plus each module's own shipped source markdown (Guide/FAQ),
 * and emits static HTML under 02_main_site/catalogue/. Read-only against the
 * register and product source — this script never writes back to either.
 *
 * Run: node build/generate-catalogue.js   (from 02_main_site/)
 */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "..");
const REGISTER_PATH = path.join(ROOT, "04_products", "00_PRODUCT_REGISTER.yaml");
const SITE_ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(SITE_ROOT, "catalogue");
const YAML = require(path.join(ROOT, "00_SYSTEM", "decision-engine", "node_modules", "js-yaml"));

const reg = YAML.load(fs.readFileSync(REGISTER_PATH, "utf8"));
const PRICING = reg.register_meta.commercial_pricing_reference;

const GROUP_LABELS = {
  Foundation: "Foundation",
  Pillar: "Pillar",
  Enabler: "Enabler",
};

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ---------- resolve each module's principal source files on disk ----------
function resolvePaths(m) {
  const folder = m.implementation.folder_path;
  const files = m.implementation.files_present || [];
  const isFaqOrTraining = (f) => /faq|training/i.test(f.filename);
  const md = files.filter((f) => f.role === "source_markdown");
  const principal =
    md.find((f) => /pro/i.test(f.filename) && !isFaqOrTraining(f)) ||
    md.find((f) => /guide/i.test(f.filename) && !isFaqOrTraining(f)) ||
    md.find((f) => !isFaqOrTraining(f)) ||
    md[0];
  const faq = files.find((f) => /faq/i.test(f.filename));
  const abs = (fn) => path.join(ROOT, folder, fn);
  return {
    guidePath: principal ? abs(principal.filename) : null,
    faqPath: faq ? abs(faq.filename) : null,
  };
}

// ---------- extract structured content from a guide's raw markdown ----------
function extractGuide(text) {
  const out = {};
  let m = text.match(/##\s*\d*\.?\s*What this is,? and what it fixes\s*\n+(?:\*\([^)]*\)\*\s*\n+)?([^\n#]+(?:\n(?!\n)[^\n#]+)*)/i);
  if (m) out.firstPara = m[1].trim().replace(/\s+/g, " ");
  m = text.match(/\*\*Time[.:]?\*\*\s*([^\n]+)/i);
  if (m) out.time = m[1].trim();
  m = text.match(/\*\*People[.:]?\*\*\s*([^\n]+)/i);
  if (m) out.people = m[1].trim();
  m = text.match(/\*\*Materials?[.:]?\*\*\s*([^\n]+)/i);
  if (m) out.materials = m[1].trim();
  // A worked-example excerpt from "What good looks like"
  m = text.match(/##\s*\d*\.?\s*What good looks like\s*\n+([\s\S]{0,600}?)(?=\n##|\n---)/i);
  if (m) {
    const block = m[1].replace(/<svg[\s\S]*?<\/svg>/gi, "").trim();
    const para = block.split(/\n\n+/).find((p) => p.length > 60 && !p.startsWith("|"));
    if (para) out.sample = para.trim().replace(/\s+/g, " ").slice(0, 480);
  }
  return out;
}

function extractFaq(text) {
  if (!text) return [];
  const items = [];
  const re = /\*\*([^*]+\?)\*\*\s*\n+([^\n]+(?:\n(?!\n|\*\*)[^\n]+)*)/g;
  let m;
  while ((m = re.exec(text)) && items.length < 5) {
    items.push({ q: m[1].trim(), a: m[2].trim().replace(/\s+/g, " ") });
  }
  return items;
}

// ---------- module id -> quick lookup for relationship rendering ----------
const byId = {};
for (const m of reg.modules) byId[m.module_id] = m;

const EDGE_LABELS = {
  dependency: "Related",
  companion: "Works well with",
  hard_prerequisite_artefact: "Requires first",
  hard_prerequisite_behavioural: "Requires first",
  soft_accelerator: "Helps if you already have",
  cross_module_evidence: "Shares evidence with",
  scope_overlap: "Overlaps with",
};

function stageContext(m) {
  // Per Matt's ruling: no forced single-stage badge. Prose only, grounded in
  // category + lead status, never a fabricated per-module stage claim.
  const cat = m.classification.category;
  if (cat === "Foundation") {
    return "A Foundation — used across every stage, not tied to one. Foundations come first: every Pillar module in this catalogue builds on them.";
  }
  if (cat === "Enabler") {
    return "An Enabler — runs alongside the Foundations and Pillars rather than sitting at one stage. Applies wherever it's relevant, not on a fixed schedule.";
  }
  if (m.classification.lead_module) {
    return `The entry point for ${m.classification.group}. The four Foundations come before it.`;
  }
  const leadId = Object.keys(byId).find(
    (id) => byId[id].classification.group === m.classification.group && byId[id].classification.lead_module
  );
  const lead = leadId ? byId[leadId] : null;
  return lead
    ? `Sits inside ${m.classification.group}, after ${lead.classification.catalogue_name} (${leadId}), the entry point for this Pillar.`
    : `Sits inside ${m.classification.group}.`;
}

function buildEdgeCards(m) {
  const edges = m.relationships.edges || [];
  if (!edges.length) return "";
  const cards = edges
    .slice(0, 6)
    .map((e) => {
      const target = byId[e.target];
      if (!target) return "";
      const label = EDGE_LABELS[e.type] || "Related";
      return `<a class="related-card" href="/catalogue/${esc(target.classification.canonical_slug)}.html">
        <span class="rel-type">${esc(label)}</span>
        <h4>${esc(target.classification.catalogue_name)}</h4>
        <p>${esc(target.classification.customer_outcome)}</p>
      </a>`;
    })
    .join("\n");
  if (!cards.trim()) return "";
  return `<div class="spec-block">
    <h2 class="section-title">Related modules</h2>
    <div class="related-grid">${cards}</div>
  </div>`;
}

function priceForTier(m, tier) {
  const band = m.commercial.pricing_band;
  const standard = PRICING[band];
  if (tier === "pro") {
    const isShowcase = !!m.commercial.showcase;
    return { price: isShowcase ? m.commercial.showcase_price_pro : standard.pro, was: isShowcase ? standard.pro : null };
  }
  return { price: standard.essentials, was: null };
}

function hasEssentials(m) {
  return m.tier.tier_structure === "pro_plus_essentials";
}

function buyArea(m) {
  const pro = priceForTier(m, "pro");
  const check = `<svg viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
  if (hasEssentials(m)) {
    const ess = priceForTier(m, "essentials");
    return `<div class="buy-area">
      <div class="buy-card">
        <h3>Essentials</h3>
        <div class="price">&pound;${ess.price}</div>
        <p class="price-note">One-off. Yours to keep.</p>
        <ul>
          <li>${check}<span>The tool, the instructions, the reasoning for the main decisions</span></li>
          <li>${check}<span>Module FAQ and training document</span></li>
        </ul>
        <button class="btn btn-ghost" type="button" disabled title="Checkout isn't live yet">Buy Essentials</button>
      </div>
      <div class="buy-card pro">
        <h3>Pro</h3>
        <div class="price">${pro.was ? `<span class="was">&pound;${pro.was}</span>` : ""}&pound;${pro.price}</div>
        <p class="price-note">${pro.was ? "Showcase entry price, this module only." : "One-off. Yours to keep."}</p>
        <ul>
          <li>${check}<span>The full playbook: why the scoring works, what to adapt, failure modes to expect</span></li>
          <li>${check}<span>Module FAQ and training document</span></li>
        </ul>
        <button class="btn" type="button" disabled title="Checkout isn't live yet">Buy Pro</button>
      </div>
    </div>`;
  }
  return `<div class="buy-area single">
    <div class="buy-card pro">
      <h3>${m.tier.tier_structure === "single_tier_exception" ? "Essentials &amp; Pro, in one guide" : "Pro"}</h3>
      <div class="price">${pro.was ? `<span class="was">&pound;${pro.was}</span>` : ""}&pound;${pro.price}</div>
      <p class="price-note">${pro.was ? "Showcase entry price, this module only." : "One-off. Yours to keep. No Essentials tier for this module &mdash; the full depth is what it needs."}</p>
      <ul>
        <li>${check}<span>The complete guide, working file(s), FAQ and training document</span></li>
      </ul>
      <button class="btn" type="button" disabled title="Checkout isn't live yet">Buy</button>
    </div>
  </div>`;
}

function insideList(m) {
  const roleLabel = { source_markdown: null, working_artefact: "Working file", internal_metadata: null, supporting_asset: "Reference" };
  const items = (m.implementation.files_present || [])
    .filter((f) => f.role !== "internal_metadata")
    .map((f) => {
      let kind = "Guide";
      if (/faq/i.test(f.filename)) kind = "FAQ";
      else if (/training/i.test(f.filename)) kind = "Training";
      else if (f.role === "working_artefact") kind = /\.xlsx$/i.test(f.filename) ? "Workbook" : "Template";
      else if (f.role === "supporting_asset") kind = "Reference";
      const clean = f.filename.replace(/\.[a-z0-9]+$/i, "").replace(/_/g, " ");
      return `<li><span class="kind">${esc(kind)}</span><span>${esc(clean)}</span></li>`;
    })
    .join("\n");
  return `<ul class="inside-list">${items}</ul>`;
}

function faqBlock(faqItems) {
  if (!faqItems.length) {
    return "";
  }
  const items = faqItems
    .map(
      (f) => `<details class="faq-item"><summary>${esc(f.q)}</summary><div class="faq-a">${esc(f.a)}</div></details>`
    )
    .join("\n");
  return `<div class="spec-block">
    <h2 class="section-title">Common questions</h2>
    <div class="faq-list">${items}</div>
  </div>`;
}

function prereqNotice(m) {
  if (m.module_id !== "P5.6") return "";
  return `<div class="prereq-notice">
    <span class="ops-label">Before you buy this one</span>
    <p><strong>This module assumes your core asset-care disciplines are already stable.</strong> It's an expansion pack for sites that already have Downtime Tracking, PM Scheduling and Autonomous Maintenance running in genuine use &mdash; not the place to start a maintenance system from scratch.</p>
    <p>If that's not your site yet, start with <a href="/catalogue/downtime_tracking_pareto.html">Downtime Tracking &amp; Pareto Pack</a>, <a href="/catalogue/pm_schedule_builder.html">PM Schedule Builder</a> and <a href="/catalogue/autonomous_maintenance.html">Autonomous Maintenance Starter Pack</a> first.</p>
  </div>`;
}

function personFromPeople(peopleLine) {
  if (!peopleLine) return null;
  // Strip a trailing full stop and keep it short.
  return peopleLine.replace(/\.$/, "");
}

function pageHtml(m, extra) {
  const slug = m.classification.canonical_slug;
  const outcome = m.classification.customer_outcome;
  const group = m.classification.group;
  const category = m.classification.category;
  const markerClass = category === "Foundation" ? "ops-marker-foundation" : "ops-marker-pillar";
  const showcase = !!m.commercial.showcase;
  const showcaseSlugMap = { "P4.1": "bottleneck-analysis", "P1.1": "skills-matrix", "P2.3": "sqdc-performance-board" };
  const people = personFromPeople(extra.people);

  const situationPara = extra.firstPara
    ? `<p class="situation">${esc(extra.firstPara)}</p>`
    : `<p class="situation">${esc(outcome)}</p>`;

  const whoFor = people
    ? `<p>Built for ${esc(people.charAt(0).toLowerCase() + people.slice(1))}.</p>`
    : `<p>Built for whoever on your site currently owns this problem and has no structured way to answer it.</p>`;

  const whatTakes = `<table class="spec-table">
    <tr><th>Setup time</th><td>${esc(extra.time || "See the guide's own “Before you start” section for a time estimate specific to this module.")}</td></tr>
    <tr><th>Who's involved</th><td>${esc(extra.people || "The person who owns this problem day to day, named in the guide.")}</td></tr>
    ${extra.materials ? `<tr><th>Materials</th><td>${esc(extra.materials)}</td></tr>` : ""}
  </table>`;

  const compareTable = hasEssentials(m)
    ? `<table class="compare-table">
        <thead><tr><th></th><th>Essentials</th><th>Pro</th></tr></thead>
        <tbody>
          <tr><td>The tool and instructions</td><td class="yes">&#10003;</td><td class="yes">&#10003;</td></tr>
          <tr><td>Reasoning for the main decisions</td><td class="yes">&#10003;</td><td class="yes">&#10003;</td></tr>
          <tr><td>Full playbook: why the scoring works, what to adapt</td><td class="no">&minus;</td><td class="yes">&#10003;</td></tr>
          <tr><td>Failure modes and edge cases</td><td class="no">&minus;</td><td class="yes">&#10003;</td></tr>
          <tr><td>Module FAQ &amp; training document</td><td class="yes">&#10003;</td><td class="yes">&#10003;</td></tr>
        </tbody>
      </table>`
    : `<p class="lede" style="font-size:.95rem">This module ships as one depth (${
        m.tier.tier_structure === "single_tier_exception" ? "Essentials and Pro reasoning combined in a single guide" : "Pro only"
      }) &mdash; no Essentials/Pro split exists for it, because the register's own tier authority says this module's depth doesn't divide cleanly. No lighter tier is manufactured to make the comparison table symmetrical.</p>`;

  const sample = extra.sample
    ? `<div class="spec-block">
        <h2 class="section-title">What a completed example looks like</h2>
        <div class="sample-block">
          <p>${esc(extra.sample)}&hellip;</p>
          <p class="caption">Excerpt from the module's own Pro guide, section &ldquo;What good looks like.&rdquo;</p>
        </div>
      </div>`
    : "";

  const showcaseStrip = showcase
    ? `<span class="showcase-strip"><span class="dot"></span>Showcase Module</span>`
    : "";

  const caseLink = showcase
    ? `<div class="case-link-card">
        <div>
          <h3>See it in action</h3>
          <p>A worked example on a fictional site, start to finish &mdash; the same depth this guide actually contains.</p>
        </div>
        <a class="btn btn-on-navy" href="/case-studies/${showcaseSlugMap[m.module_id]}.html">Read the case study</a>
      </div>`
    : "";

  const showcaseNote = showcase
    ? `<div class="showcase-note"><strong>Showcase Module &mdash; special entry price.</strong> Opsteady has selected a small number of modules as detailed worked examples, priced lower on their Pro tier so you can experience a complete Opsteady product at a lower first purchase. The module itself, its Band, and its Essentials price (where one exists) are unchanged &mdash; this is not a countdown or a limited-time offer.</div>`
    : "";

  const stageProse = stageContext(m);
  const edgeCards = buildEdgeCards(m);
  const faqItems = extra.faq || [];

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(m.classification.catalogue_name)} — Opsteady</title>
<meta name="description" content="${esc(outcome)}">
<meta name="robots" content="index,follow">
<meta property="og:title" content="${esc(m.classification.catalogue_name)} — Opsteady">
<meta property="og:description" content="${esc(outcome)}">
<meta property="og:image" content="https://opsteady.co.uk/og/default.png">
<meta property="og:url" content="https://opsteady.co.uk/catalogue/${esc(slug)}.html">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="https://opsteady.co.uk/catalogue/${esc(slug)}.html">
<link rel="preload" href="/fonts/source-sans-3-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/space-grotesk.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/tokens.css">
<link rel="stylesheet" href="/styles.css">
</head>
<body>
<a class="skip-link" href="#main">Skip to main content</a>

<header class="site-nav">
  <div class="site-nav-inner">
    <a class="brand" href="/">
      <svg class="brand-mark" viewBox="0 0 120 36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M2 18 L8 6 L14 28 L20 10 L26 24 L32 14 L38 21 L44 16 L50 19.5 L56 18 L118 18" fill="none" stroke="var(--ops-navy)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="56" cy="18" r="4.2" fill="#D08F25"/>
      </svg>
      <span class="brand-word">Opsteady</span>
    </a>
    <button class="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false">
      <svg viewBox="0 0 24 24" fill="none" stroke="var(--ops-navy)" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
    </button>
    <nav class="nav-links" aria-label="Primary">
      <button class="nav-close" type="button" aria-label="Close menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>
      </button>
      <a class="nav-link nav-cta" href="https://healthcheck.opsteady.co.uk/">Health Check</a>
      <a class="nav-link current" href="/catalogue.html">Catalogue</a>
      <a class="nav-link" href="/the-method.html">The Method</a>
      <a class="nav-link" href="/pricing.html">Pricing</a>
      <a class="nav-link" href="/who-we-are.html">Who We Are</a>
    </nav>
  </div>
</header>

<main id="main">
 <div class="shell">
  <nav class="ops-breadcrumb" aria-label="Breadcrumb">
    <a href="/">Home</a><span class="sep">/</span>
    <a href="/catalogue.html">Catalogue</a><span class="sep">/</span>
    <span class="current">${esc(m.classification.catalogue_name)}</span>
  </nav>

  <div class="prod-hero">
    <div class="prod-hero-top">
      <span class="ops-marker ${markerClass}">${esc(GROUP_LABELS[category] || category)}</span>
      ${m.classification.lead_module ? '<span class="lead-tag">Pillar lead</span>' : ""}
      ${showcaseStrip}
    </div>
    <h1 class="page-title">${esc(m.classification.catalogue_name)}</h1>
    ${situationPara}
    <div class="rec-banner" id="rec-banner"></div>
    ${showcaseNote}
    ${buyArea(m)}
  </div>

  <div class="spec-block">
    <h2 class="section-title">Who this is for</h2>
    ${whoFor}
  </div>

  <div class="spec-block">
    <h2 class="section-title">Where it sits</h2>
    <p>${esc(stageProse)} See the full sequence on <a href="/the-method.html">The Method</a>.</p>
  </div>

  <div class="spec-block">
    <h2 class="section-title">What it does</h2>
    <p class="lede">${esc(outcome)}</p>
    ${extra.firstPara ? `<p>${esc(extra.firstPara)}</p>` : ""}
  </div>

  <div class="spec-block">
    <h2 class="section-title">What is in it</h2>
    ${insideList(m)}
  </div>

  <div class="spec-block">
    <h2 class="section-title">What it takes</h2>
    ${whatTakes}
  </div>

  ${prereqNotice(m)}

  <div class="spec-block">
    <h2 class="section-title">Essentials vs Pro</h2>
    ${compareTable}
  </div>

  ${sample}
  ${caseLink}
  ${edgeCards}
  ${faqBlock(faqItems)}
 </div>

  <div class="band band-navy">
    <div class="shell band-pad cta-box">
      <div class="cta-copy">
        <h3>Not sure this is the right one?</h3>
        <p>The Health Check reads your operation across twelve areas and tells you which module to start with, in order.</p>
      </div>
      <a class="btn btn-on-navy btn-lg" href="https://healthcheck.opsteady.co.uk/">Take the Health Check</a>
    </div>
  </div>
</main>

<footer class="site-footer">
  <div class="site-footer-inner">
    <div class="footer-brand">
      <span class="brand-word">Opsteady</span>
      <p class="footer-tagline">Run steady. Run better.</p>
      <p>Practical tools and know-how to run a great operation. Built so you can do it in-house.</p>
    </div>
    <div class="footer-col">
      <h3>Site</h3>
      <ul>
        <li><a href="https://healthcheck.opsteady.co.uk/">Health Check</a></li>
        <li><a href="/catalogue.html">Catalogue</a></li>
        <li><a href="/the-method.html">The Method</a></li>
        <li><a href="/pricing.html">Pricing</a></li>
        <li><a href="/who-we-are.html">Who We Are</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h3>More</h3>
      <ul>
        <li><a href="/sitemap.html">Contents</a></li>
        <li><a href="https://healthcheck.opsteady.co.uk/privacy.html">Privacy</a></li>
        <li><a href="/terms.html">Terms of sale</a></li>
        <li><a href="/accessibility.html">Accessibility</a></li>
        <li><a href="mailto:hello@opsteady.co.uk">hello@opsteady.co.uk</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">&copy; 2026 Opsteady. Opsteady is a trading name of Optimere Limited, registered in England and Wales, Company No. 17390203. Registered office: 82A James Carter Road, Mildenhall, IP28 7DE.</div>
</footer>

<script src="/site.js"></script>
<script>
(function(){
  var params = new URLSearchParams(window.location.search);
  var ref = params.get("ref");
  if (ref === "healthcheck") {
    var reason = params.get("reason");
    var el = document.getElementById("rec-banner");
    var text = reason === "biggest_gap"
      ? "Recommended by your Health Check result as the biggest gap it found."
      : reason === "fast_proof"
      ? "Recommended by your Health Check result as a fast first step — not necessarily your biggest gap, but a quick, visible win."
      : "Recommended by your Health Check result.";
    el.innerHTML = "<strong>From your Health Check:</strong> " + text;
    el.className = "rec-banner show";
  }
})();
</script>
</body>
</html>
`;
}

// ---------- run ----------
function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  let written = 0;
  const manifest = [];
  for (const m of reg.modules) {
    const { guidePath, faqPath } = resolvePaths(m);
    let extra = {};
    if (guidePath && fs.existsSync(guidePath)) {
      extra = extractGuide(fs.readFileSync(guidePath, "utf8"));
    }
    if (faqPath && fs.existsSync(faqPath)) {
      extra.faq = extractFaq(fs.readFileSync(faqPath, "utf8"));
    }
    const html = pageHtml(m, extra);
    const outPath = path.join(OUT_DIR, `${m.classification.canonical_slug}.html`);
    fs.writeFileSync(outPath, html, "utf8");
    written++;
    manifest.push({
      id: m.module_id,
      slug: m.classification.canonical_slug,
      name: m.classification.catalogue_name,
      category: m.classification.category,
      group: m.classification.group,
      lead: !!m.classification.lead_module,
      outcome: m.classification.customer_outcome,
      band: m.commercial.pricing_band,
      showcase: !!m.commercial.showcase,
      tier_structure: m.tier.tier_structure,
      price_pro: priceForTier(m, "pro").price,
      price_essentials: hasEssentials(m) ? priceForTier(m, "essentials").price : null,
    });
  }
  fs.writeFileSync(path.join(__dirname, "catalogue-manifest.json"), JSON.stringify(manifest, null, 1));
  console.log("Generated", written, "product pages into", OUT_DIR);
}

main();

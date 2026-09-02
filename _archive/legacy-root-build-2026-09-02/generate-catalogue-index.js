#!/usr/bin/env node
/* Rebuilds catalogue.html from build/catalogue-manifest.json (produced by
 * generate-catalogue.js). Register-driven — no hardcoded module count,
 * no Ready/In-development legacy binary. Run generate-catalogue.js first. */
"use strict";
const fs = require("fs");
const path = require("path");
const SITE_ROOT = path.resolve(__dirname, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, "catalogue-manifest.json"), "utf8"));

function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const GROUP_ORDER = [];
const byGroup = {};
for (const m of manifest) {
  if (!byGroup[m.group]) { byGroup[m.group] = []; GROUP_ORDER.push(m.group); }
  byGroup[m.group].push(m);
}
// Foundations first (by group name convention "F.. "), then Pillars P1..P8, then Enablers.
GROUP_ORDER.sort((a, b) => {
  const rank = (g) => (g.startsWith("F") ? 0 : g.startsWith("P") ? 1 : 2);
  const ra = rank(a), rb = rank(b);
  if (ra !== rb) return ra - rb;
  return a.localeCompare(b, undefined, { numeric: true });
});
// Foundations render as one merged section rather than one per foundation.
const foundationGroups = GROUP_ORDER.filter((g) => byGroup[g][0].category === "Foundation");
const otherGroups = GROUP_ORDER.filter((g) => byGroup[g][0].category !== "Foundation");

function priceLine(m) {
  const band = m.band === "band_2" ? "Band 2" : "Band 1";
  if (m.showcase) return `${band} &middot; Showcase Pro &pound;${m.price_pro}`;
  if (m.price_essentials) return `${band} &middot; from &pound;${m.price_essentials}`;
  return `${band} &middot; &pound;${m.price_pro}`;
}

function card(m) {
  const markerClass = m.category === "Foundation" ? "ops-marker-foundation" : "ops-marker-pillar";
  return `<article class="prod-card" data-group="${esc(m.group)}" data-category="${esc(m.category)}">
        <div class="prod-top">
          <span class="ops-marker ${markerClass}">${esc(m.category)}</span>
          ${m.lead ? '<span class="lead-tag">Pillar lead</span>' : ""}
          ${m.showcase ? '<span class="showcase-strip"><span class="dot"></span>Showcase</span>' : ""}
        </div>
        <h3><a href="/catalogue/${esc(m.slug)}.html">${esc(m.name)}</a></h3>
        <p class="prod-outcome">${esc(m.outcome)}</p>
        <p class="prod-tiers">${priceLine(m)}</p>
        <a class="btn btn-ghost prod-link" href="/catalogue/${esc(m.slug)}.html">View module</a>
      </article>`;
}

let sections = "";

if (foundationGroups.length) {
  const cards = foundationGroups.flatMap((g) => byGroup[g]).map(card).join("\n");
  sections += `<div class="pillar-section" data-section="Foundation">
    <h2 class="section-title">Foundations</h2>
    <p class="foundations-desc">What every site needs regardless of where it's struggling. Foundations come before Pillar work — the Marcus rule.</p>
    <div class="mod-grid">${cards}</div>
  </div>\n`;
}

for (const g of otherGroups) {
  const cards = byGroup[g].map(card).join("\n");
  const label = /^Enablers?$/.test(g) ? "Enablers" : g.replace(/^P\d+\s*/, (m0) => "").length ? g : g;
  sections += `<div class="pillar-section" data-section="${esc(g)}">
    <h2 class="section-title">${esc(g)}</h2>
    <div class="mod-grid">${cards}</div>
  </div>\n`;
}

const total = manifest.length;
const band2 = manifest.filter((m) => m.band === "band_2").length;

const html = `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Catalogue — Opsteady</title>
<meta name="description" content="${total} modules — every Opsteady intervention, organised by Foundation, Pillar and Enabler.">
<meta name="robots" content="index,follow">
<meta property="og:title" content="Catalogue — Opsteady">
<meta property="og:description" content="${total} modules — every Opsteady intervention, organised by Foundation, Pillar and Enabler.">
<meta property="og:image" content="https://opsteady.co.uk/og/catalogue.png">
<meta property="og:url" content="https://opsteady.co.uk/catalogue.html">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<link rel="preload" href="/fonts/source-sans-3-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/space-grotesk.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/tokens.css">
<link rel="stylesheet" href="/styles.css">
<style>
.pillar-section{margin:3.5rem 0}
.pillar-section h2{margin-bottom:.4rem}
.foundations-desc{color:var(--slate);margin-bottom:1.5rem;max-width:42rem}
.mod-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem}
@media (max-width:900px){.mod-grid{grid-template-columns:repeat(2,1fr)}}
@media (max-width:640px){.mod-grid{grid-template-columns:1fr}}
.prod-card{
  background:var(--ops-surface);border:1px solid var(--ops-border);border-radius:var(--ops-radius-12);
  padding:var(--ops-space-32);display:flex;flex-direction:column;
  transition:border-color var(--ops-duration-fast) var(--ops-ease-out);
}
.prod-card:hover{border-color:var(--ops-border-strong)}
@media (max-width:640px){.prod-card{padding:var(--ops-space-24)}}
.prod-top{display:flex;align-items:center;flex-wrap:wrap;gap:.5rem;margin-bottom:.6rem}
.prod-card h3{font-family:var(--ops-font-text);font-weight:600;font-size:1.18rem;color:var(--navy);margin-bottom:.3rem}
.prod-card h3 a{color:inherit;text-decoration:none}
.prod-card h3 a:hover{text-decoration:underline}
.prod-outcome{font-size:1rem;color:var(--ink);margin-bottom:.5rem;flex-grow:1}
.prod-tiers{font-size:.85rem;color:var(--slate);margin-bottom:.85rem;font-family:var(--ops-font-mono)}
.prod-card .prod-link{margin-top:.25rem;align-self:flex-start;text-decoration:none}
.lead-tag{font-family:var(--ops-font-text);font-weight:600;font-size:.68rem;letter-spacing:var(--ops-track-label);text-transform:uppercase;color:var(--ops-n60)}
.cat-count{display:block;margin-top:1.25rem;font-family:var(--ops-font-text);font-weight:600;font-size:.75rem;letter-spacing:var(--ops-track-label);text-transform:uppercase;color:var(--ops-n60)}
</style>
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
  <div class="section-tight prose">
    <p class="eyebrow">Catalogue</p>
    <h1 class="page-title">The complete intervention library</h1>
    <p class="lede">${total} modules. Foundations that every site needs, Pillars that go deep on one area each, and Enablers that cut across everything.</p>
    <p class="lede">Every module here is qualified and commercially available. Buying itself isn't live yet — the checkout platform is still being connected — but there's nothing provisional about what's on this page.</p>
    <span class="cat-count">${total} modules &middot; ${band2} Band 2 &middot; ${total - band2} Band 1</span>
  </div>

  ${sections}
 </div>

  <div class="band band-navy">
    <div class="shell band-pad cta-box">
      <div>
        <h3>Not sure which one you need?</h3>
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
</body>
</html>
`;

fs.writeFileSync(path.join(SITE_ROOT, "catalogue.html"), html, "utf8");
console.log("Rebuilt catalogue.html —", total, "modules,", GROUP_ORDER.length, "groups.");

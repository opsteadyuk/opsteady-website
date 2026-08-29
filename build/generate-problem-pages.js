#!/usr/bin/env node
/* Problem-led acquisition pages. Copy authored by hand against the brand's
 * own "lead with the situation" rule (02_brand/102_positioning.md §2.2),
 * linking only to real, register-verified modules. Run from 02_main_site/. */
"use strict";
const fs = require("fs");
const path = require("path");
const SITE_ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(SITE_ROOT, "problems");
fs.mkdirSync(OUT_DIR, { recursive: true });

const PROBLEMS = [
  {
    slug: "lost-output-and-downtime",
    title: "Your line stops, and nobody can say for certain why",
    meta: "See what's really costing you machine availability, ranked, not guessed at.",
    body: [
      "A machine stops. Someone writes a reason on the board — 'changeover', 'material', 'fault' — and the line starts again. Multiply that by a hundred stops a month and the total looks like a number nobody trusts, because it's built from a hundred different people's guesses under time pressure, not a shared definition of what actually counts as lost time.",
      "A search engine can give you a downtime-tracking spreadsheet template in ten seconds. What it can't tell you is which of your hundred stops is actually costing you the most, or whether the changeover you've been improving for a year was ever the real problem.",
    ],
    modules: ["downtime_tracking_pareto", "bottleneck_analysis"],
  },
  {
    slug: "on-time-delivery-and-plan-reliability",
    title: "‘On time’ means something different depending on who you ask",
    meta: "Agree what on-time and right-first-time actually mean before you track them.",
    body: [
      "Every site already has a number for on-time delivery. Fewer sites can say, without checking, exactly what that number counts and what it quietly leaves out — whether a shortfall covered by overproducing an easy line is hiding inside a healthy-looking average, or whether ‘on time’ is measured against the date you promised or the date the customer actually asked for.",
      "That gap doesn't get closed by a better dashboard. It gets closed by writing the definition down, on purpose, before you argue about the number again.",
    ],
    modules: ["otif_rft_dashboard", "production_schedule_adherence"],
  },
  {
    slug: "flow-and-bottlenecks",
    title: "Everyone can point at the bottleneck. It's rarely the right one",
    meta: "Find the actual constraint, and see where the time in between is really going.",
    body: [
      "Ask a room of experienced people where the constraint is and you'll get a confident, specific answer — usually the loudest or most recent station, rarely checked against real throughput data. Meanwhile the station nobody's watching, running fine but sitting in front of a two-day queue nobody's measured, is quietly costing more than the one everyone talks about.",
      "Free advice can tell you what a bottleneck is. It can't watch your specific line and tell you where yours actually sits.",
    ],
    modules: ["bottleneck_analysis", "value_stream_mapping"],
  },
  {
    slug: "running-the-day",
    title: "What gets passed between shifts depends entirely on who's handing over",
    meta: "A fixed round through the shift and the five things that must pass between crews, every time.",
    body: [
      "Some shifts hand over everything that matters. Others hand over whatever the outgoing supervisor happened to remember on the way out the door. Nobody decided this should vary — it varies because nothing structures the handover, or the supervisor's own day, so whatever's loudest right now wins every time, and anything quieter loses.",
      "A generic ‘best practice’ checklist doesn't know your shift pattern, your critical checks, or which single point of failure is one absence away from a real problem. It only knows the generic version.",
    ],
    modules: ["shift_handover", "supervisor_standard_work"],
  },
  {
    slug: "consistent-work-and-capability",
    title: "The SOPs look fine in the folder. Nobody's sure they match the floor",
    meta: "A standard that actually holds, and a real record of who can do what.",
    body: [
      "A written standard and a standard the floor actually follows look identical from a manager's office. The gap between them doesn't show up until something goes wrong and the person who caused it was doing exactly what they'd always done — because nobody had checked the document against the floor since the day it was written.",
      "The same gap shows up in people: a team leader who can name every skill gap on the team from memory, until the day they're not there to ask.",
    ],
    modules: ["set_standards", "skills_matrix"],
  },
  {
    slug: "recurring-problems-and-quality-escapes",
    title: "The same defect keeps coming back, scattered across three people's notebooks",
    meta: "Log every non-conformance in one place, and verify the cause before you write a fix.",
    body: [
      "A single non-conformance always looks like a one-off. Dealing with the part in front of you is the actual job in the moment. What's much harder to see, without a shared log, is that the same one-off has happened eleven times this month across three shifts — invisible until it's all in one column, obvious the second it is.",
      "And once you've spotted the pattern, the most common failure is writing the fix before the cause is actually verified — a countermeasure built to justify a solution someone already had in mind, not the one the evidence points to.",
    ],
    modules: ["non_conformance_tracker", "a3_problem_solving"],
  },
];

const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, "catalogue-manifest.json"), "utf8"));
const bySlug = {};
for (const m of manifest) bySlug[m.slug] = m;

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function page(p) {
  const routes = p.modules
    .map((slug) => {
      const m = bySlug[slug];
      if (!m) throw new Error("Unknown module slug in problem page: " + slug);
      return `<div class="route-card">
        <h3>${esc(m.name)}</h3>
        <p>${esc(m.outcome)}</p>
        <a class="btn btn-ghost" href="/catalogue/${esc(slug)}.html">View module</a>
      </div>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(p.title)} — Opsteady</title>
<meta name="description" content="${esc(p.meta)}">
<meta name="robots" content="index,follow">
<meta property="og:title" content="${esc(p.title)} — Opsteady">
<meta property="og:description" content="${esc(p.meta)}">
<meta property="og:image" content="https://opsteady.co.uk/og/default.png">
<meta property="og:url" content="https://opsteady.co.uk/problems/${esc(p.slug)}.html">
<meta property="og:type" content="website">
<link rel="canonical" href="https://opsteady.co.uk/problems/${esc(p.slug)}.html">
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
      <a class="nav-link" href="/catalogue.html">Catalogue</a>
      <a class="nav-link" href="/the-method.html">The Method</a>
      <a class="nav-link" href="/pricing.html">Pricing</a>
      <a class="nav-link" href="/who-we-are.html">Who We Are</a>
    </nav>
  </div>
</header>

<main id="main">
 <div class="shell">
  <div class="problem-hero prose">
    <p class="eyebrow">A real operational problem</p>
    <h1 class="page-title">${esc(p.title)}</h1>
    ${p.body.map((para) => `<p class="lede">${esc(para)}</p>`).join("\n    ")}
  </div>

  <div class="section-tight">
    <h2 class="section-title">Two ways in</h2>
    <div class="problem-routes">
      <div class="route-card">
        <h3>Not sure this is your biggest problem?</h3>
        <p>The Health Check reads your whole operation across twelve areas and tells you what to fix first, in order — not just this one.</p>
        <a class="btn" href="https://healthcheck.opsteady.co.uk/">Take the Health Check</a>
      </div>
      <div class="route-card">
        <h3>Know it's this one?</h3>
        <p>Go straight to the module built for it — what it does, what it takes to deploy, and what it costs.</p>
        <a class="btn btn-ghost" href="/catalogue/${esc(p.modules[0])}.html">See the module</a>
      </div>
    </div>
  </div>

  <div class="spec-block">
    <h2 class="section-title">The modules built for this</h2>
    <div class="problem-routes">${routes}</div>
  </div>
 </div>

  <div class="band band-navy">
    <div class="shell band-pad cta-box">
      <div class="cta-copy">
        <h3>Start with fifteen honest minutes</h3>
        <p>Free, twenty-four questions. No score out of a hundred, no sales call.</p>
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
}

for (const p of PROBLEMS) {
  fs.writeFileSync(path.join(OUT_DIR, `${p.slug}.html`), page(p), "utf8");
}
console.log("Generated", PROBLEMS.length, "problem pages.");
module.exports = { PROBLEMS };

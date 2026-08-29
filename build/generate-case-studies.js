#!/usr/bin/env node
/* Showcase case studies. Fictional companies, fictional data, real
 * methodology — grounded in the actual Bottleneck Analysis Tool, Skills
 * Matrix and SQDC Performance Board Pack guides (read directly during the
 * commercial classification pass, not invented from the title alone).
 * Boundary maintained throughout: illustrative excerpts only, no blank
 * reusable templates or field-by-field working files exposed. */
"use strict";
const fs = require("fs");
const path = require("path");
const SITE_ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(SITE_ROOT, "case-studies");
fs.mkdirSync(OUT_DIR, { recursive: true });

function shell(title, meta, moduleSlug, moduleName, bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title} — Opsteady</title>
<meta name="description" content="${meta}">
<meta name="robots" content="index,follow">
<meta property="og:title" content="${title} — Opsteady">
<meta property="og:description" content="${meta}">
<meta property="og:image" content="https://opsteady.co.uk/og/default.png">
<meta property="og:type" content="website">
<link rel="preload" href="/fonts/source-sans-3-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/space-grotesk.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/tokens.css">
<link rel="stylesheet" href="/styles.css">
<style>
.cs-hero{padding:2.5rem 0 1rem;max-width:46rem}
.cs-fictional{
  display:inline-block;background:var(--ops-surface-subtle);color:var(--ops-n60);
  font-size:.78rem;font-weight:600;letter-spacing:var(--ops-track-label);text-transform:uppercase;
  padding:.3rem .7rem;border-radius:var(--ops-radius-4);margin-bottom:1rem;
}
.cs-stage{margin:2.5rem 0}
.cs-stage h2{color:var(--navy)}
.cs-stat-row{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin:1.5rem 0}
@media (max-width:700px){.cs-stat-row{grid-template-columns:1fr}}
.cs-stat{background:var(--ops-surface);border:1px solid var(--ops-border);border-radius:var(--ops-radius-8);padding:1.1rem 1.25rem}
.cs-stat .num{font-family:var(--ops-font-display);font-weight:700;font-size:1.6rem;color:var(--navy);display:block}
.cs-stat .lbl{font-size:.8rem;color:var(--slate)}
.cs-excerpt{
  background:var(--ops-surface-sunken);border-left:3px solid var(--ops-navy);border-radius:2px;
  padding:1.1rem 1.4rem;margin:1.25rem 0;font-family:var(--ops-font-mono);font-size:.88rem;color:var(--ops-n80);
  overflow-x:auto;
}
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
      <a class="nav-link" href="/catalogue.html">Catalogue</a>
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
    <a href="/catalogue/${moduleSlug}.html">${moduleName}</a><span class="sep">/</span>
    <span class="current">Case study</span>
  </nav>

${bodyHtml}

  <div class="case-link-card">
    <div>
      <h3>${moduleName}</h3>
      <p>This case study shows the shape of the guide. The working file, the full playbook and the failure modes are in the product itself.</p>
    </div>
    <a class="btn btn-on-navy" href="/catalogue/${moduleSlug}.html">View the module</a>
  </div>
 </div>

  <div class="band band-navy">
    <div class="shell band-pad cta-box">
      <div class="cta-copy">
        <h3>See where your own site actually stands</h3>
        <p>Free, twenty-four questions, about fifteen minutes.</p>
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

// ---------------------------------------------------------------------
// 1. Bottleneck Analysis Tool — Riverside Fabrication (fictional)
// ---------------------------------------------------------------------
const bottleneck = shell(
  "Case study: finding the real constraint at a fictional fabrication site",
  "A fictional worked example of the Bottleneck Analysis Tool: how Riverside Fabrication found its real constraint wasn't the station everyone blamed.",
  "bottleneck_analysis",
  "Bottleneck Analysis Tool",
  `<div class="cs-hero prose">
    <span class="cs-fictional">Fictional company, illustrative data</span>
    <h1 class="page-title">The station everyone blamed wasn't the one actually costing them the order</h1>
    <p class="lede">Riverside Fabrication, a 60-person steel fabrication shop, and Press 3 — the station its production meetings had blamed for six months.</p>
  </div>

  <div class="cs-stage prose">
    <h2>The problem</h2>
    <p>Riverside runs three presses feeding a single powder-coat and pack line. For most of the year, the Thursday production meeting opened the same way: Press 3 was behind, again, and the shift manager wanted a second press operator approved to catch it up. The operations director had queued the headcount request twice and pulled it back twice, uneasy that the same fix kept being asked for without ever quite working.</p>
    <p>Nobody had actually measured anything. The belief that Press 3 was the constraint came from it being the newest, least familiar machine on the floor, and the one operators mentioned most often when a shipment ran late.</p>
  </div>

  <div class="cs-stage prose">
    <h2>Starting condition</h2>
    <p>A Health Check taken by the operations director scored Delivery &amp; Planning as the site's lowest area, and flagged Bottleneck Analysis as the recommended first move — ahead of Capacity Planning, which it explicitly said was premature without a confirmed constraint first.</p>
    <p>No downtime tracking existed yet. The only data anyone had was a gut feeling and a schedule-adherence number that had been sliding for two quarters.</p>
  </div>

  <div class="cs-stage prose">
    <h2>Deployment</h2>
    <p>The shift manager ran the tool exactly as it's built: listed every step from raw steel to packed pallet, logged throughput and cycle time at each one for a full representative week, and noted where work-in-progress queued up between stations — not just at the one everyone already suspected.</p>
    <div class="cs-excerpt">Press 1 — 310 units/week &nbsp;&middot;&nbsp; Press 2 — 295 units/week &nbsp;&middot;&nbsp; Press 3 — 240 units/week &nbsp;&middot;&nbsp; Powder-coat &amp; pack — 180 units/week</div>
    <p>Read at a glance, the numbers looked like they confirmed the story: Press 3 was the slowest press. But the tool's own confirmation check asks for two more signals before naming a constraint — where WIP is genuinely piling up, and where the next step stands idle waiting. Neither pointed at Press 3. WIP was stacking up in front of powder-coat and pack, and pack was the station standing idle at the start of most shifts, waiting on parts that had already cleared all three presses days earlier.</p>
  </div>

  <div class="cs-stage prose">
    <h2>The finding, and the decisions made from it</h2>
    <p>The real constraint was powder-coat and pack, running at 180 units a week against a combined press output well above that. Press 3 wasn't fast, but it was never the ceiling — the finish line was, and every part waiting in front of it had already been made.</p>
    <p>The operations director did not approve the second Press 3 operator. Instead, the shift manager worked the tool's exploit-and-subordinate step against the real constraint: removing an avoidable changeover delay on the coat line, and — the harder conversation — deliberately holding the two faster presses to the coat line's actual pace, rather than letting them keep running ahead and building a queue nobody could work through.</p>
  </div>

  <div class="cs-stage prose">
    <h2>Operational result</h2>
    <div class="cs-stat-row">
      <div class="cs-stat"><span class="num">180 &rarr; 224</span><span class="lbl">units/week through finishing, six weeks</span></div>
      <div class="cs-stat"><span class="num">&pound;0</span><span class="lbl">spent on the headcount request that didn't happen</span></div>
      <div class="cs-stat"><span class="num">2</span><span class="lbl">presses deliberately slowed, on purpose, to feed the real constraint</span></div>
    </div>
    <p>Schedule adherence, the number that had been sliding for two quarters, moved for the first time without anyone touching the schedule itself — because the actual limiting step, not the loudest one, was finally the one being worked.</p>
  </div>

  <div class="cs-stage prose">
    <h2>Sustainment</h2>
    <p>Riverside re-runs the throughput log monthly, not because the constraint is expected to move often, but because the tool's own guidance is that fixing one constraint reveals the next — and the site would rather confirm that on purpose than rediscover it six months late in another Thursday meeting.</p>
  </div>`
);

// ---------------------------------------------------------------------
// 2. Skills Matrix & Cross-Training Planner — Bridgewell Foods (fictional)
// ---------------------------------------------------------------------
const skillsMatrix = shell(
  "Case study: surfacing single points of failure at a fictional food site",
  "A fictional worked example of the Skills Matrix & Cross-Training Planner: how Bridgewell Foods found three single points of failure it hadn't consciously known about.",
  "skills_matrix",
  "Skills Matrix & Cross-Training Planner",
  `<div class="cs-hero prose">
    <span class="cs-fictional">Fictional company, illustrative data</span>
    <h1 class="page-title">Three single points of failure, none of them written down anywhere</h1>
    <p class="lede">Bridgewell Foods, a mid-size chilled-food packing site, and an 18-person changeover team that ran on one supervisor's memory.</p>
  </div>

  <div class="cs-stage prose">
    <h2>The problem</h2>
    <p>Bridgewell's changeover team could hit its numbers reliably — as long as three specific people were on shift. Everyone on the floor knew this informally. Nobody had ever written it down as a risk, because the team had simply never been tested by all three being off at once, so the gap had no cost attached to it yet.</p>
  </div>

  <div class="cs-stage prose">
    <h2>Starting condition</h2>
    <p>The site's Health Check flagged People &amp; Capability as an area worth attention, without the operations manager being able to say precisely why — the team wasn't short-staffed, and nobody had raised a complaint. The recommendation was Skills Matrix &amp; Cross-Training Planner, scoped to the one team, not the whole site.</p>
  </div>

  <div class="cs-stage prose">
    <h2>Deployment</h2>
    <p>The team leader scoped one matrix — 18 people, 14 critical changeover tasks — using the tool's own critical-risk test rather than listing everything the team did: does getting it wrong hurt someone, scrap product, or damage the equipment. Tasks that didn't clear that bar, and tasks a competent person could pick up from the standard in an hour, were deliberately left off.</p>
    <div class="cs-excerpt">14 tasks scored &nbsp;&middot;&nbsp; 3 flagged as single points of failure (only one person rated Unassisted or above) &nbsp;&middot;&nbsp; 1 task with zero current Owners</div>
    <p>Two of the three single points of failure were tasks nobody had consciously named as risks before — they'd simply never been tested, because the right person had always happened to be on shift.</p>
  </div>

  <div class="cs-stage prose">
    <h2>Decisions and actions</h2>
    <p>The team leader didn't try to close all three gaps at once. Following the tool's own first-week guidance, the single points of failure went onto the contingency register first — with one already covered by a costed, priced external option — and a second qualified Owner was scheduled for the highest-risk task before anything else on the matrix was touched.</p>
  </div>

  <div class="cs-stage prose">
    <h2>Operational result</h2>
    <div class="cs-stat-row">
      <div class="cs-stat"><span class="num">3 &rarr; 1</span><span class="lbl">single points of failure still open after eight weeks</span></div>
      <div class="cs-stat"><span class="num">18</span><span class="lbl">people, one team, scoped deliberately — not a site-wide rollout</span></div>
      <div class="cs-stat"><span class="num">1</span><span class="lbl">priced contingency option, ready before it was ever needed</span></div>
    </div>
    <p>Six weeks in, one of the three previously single-qualified people was off sick for four days. For the first time, the team covered the changeover without a scramble — because the gap already had a named second Owner in training, not because anyone got lucky.</p>
  </div>

  <div class="cs-stage prose">
    <h2>Sustainment</h2>
    <p>The matrix is reviewed on trigger events — a new starter, a changed process, a shift in absence patterns — rather than left until the next audit. The Roles tab, calculated rather than hand-maintained, is what the team leader now actually checks each morning instead of relying on memory.</p>
  </div>`
);

// ---------------------------------------------------------------------
// 3. SQDC Performance Board Pack — Halden Automotive Components (fictional)
// ---------------------------------------------------------------------
const sqdc = shell(
  "Case study: one board, four numbers, at a fictional automotive site",
  "A fictional worked example of the SQDC Performance Board Pack: how Halden Automotive Components turned four scattered systems into one board checked every shift.",
  "sqdc_performance_board",
  "SQDC Performance Board Pack",
  `<div class="cs-hero prose">
    <span class="cs-fictional">Fictional company, illustrative data</span>
    <h1 class="page-title">Four systems, four different Fridays, one problem discovered a week too late</h1>
    <p class="lede">Halden Automotive Components, a tier-two automotive parts supplier, and a quality miss that took a week to reach anyone who could act on it.</p>
  </div>

  <div class="cs-stage prose">
    <h2>The problem</h2>
    <p>Halden's safety, quality, delivery and cost numbers each lived in their own system, updated on their own schedule — quality on a Tuesday report, cost at month end, delivery whenever the scheduling system was checked. A first-pass yield drop showed up in the quality system on a Tuesday. Nobody with the authority to act on it saw it until the following Monday's management meeting, by which point the same fault had recurred three more times.</p>
  </div>

  <div class="cs-stage prose">
    <h2>Starting condition</h2>
    <p>A Health Check completed by the plant manager scored Daily Management as the weakest of the twelve areas — not because any single number was bad, but because none of them were checked on the same rhythm. The recommendation was the SQDC Performance Board Pack, explicitly building on the site's existing KPI definitions and Visual Management work rather than replacing either.</p>
  </div>

  <div class="cs-stage prose">
    <h2>Deployment</h2>
    <p>The plant manager picked one metric per category to start — not the full KPI tree for each — each one already defined and agreed rather than invented for the board: a lost-time-incident count for Safety, first-pass yield for Quality, schedule adherence for Delivery, overtime hours for Cost. The board went up on the shop floor itself, at the point people already walked past daily, not in an office.</p>
    <div class="cs-excerpt">Safety: 0 incidents, target 0 &nbsp;&middot;&nbsp; Quality: 91%, target 95% &nbsp;&middot;&nbsp; Delivery: 92%, target 100% &nbsp;&middot;&nbsp; Cost: 3.5 OT hrs, target &le;2</div>
    <p>Every miss got a gap-and-response line, filled in the same shift it happened — not a blank cell waiting for someone to notice it later.</p>
  </div>

  <div class="cs-stage prose">
    <h2>Decisions and actions</h2>
    <p>Three weeks in, a first-pass yield miss on the board's Quality line was traced, the same afternoon, to a torque station drifting out of calibration — the same underlying fault that, before the board existed, had taken a week to surface. The tiered meeting the board now feeds reviewed it the next morning, not the following Monday.</p>
  </div>

  <div class="cs-stage prose">
    <h2>Operational result</h2>
    <div class="cs-stat-row">
      <div class="cs-stat"><span class="num">7 days &rarr; &lt;1 shift</span><span class="lbl">time from a quality miss occurring to it reaching someone who could act</span></div>
      <div class="cs-stat"><span class="num">4</span><span class="lbl">numbers, one board, checked every shift instead of four separate schedules</span></div>
      <div class="cs-stat"><span class="num">91% &rarr; 95%</span><span class="lbl">first-pass yield, eight weeks after the calibration fault was caught early</span></div>
    </div>
  </div>

  <div class="cs-stage prose">
    <h2>Sustainment</h2>
    <p>The board still shows real misses most days — Halden treats a board that's green across all four every single day as a sign it's measuring the wrong things, not a sign nothing's wrong. Every number traces back to the site's own KPI Definitions register, so what the board means has stayed a settled question, not a live argument.</p>
  </div>`
);

fs.writeFileSync(path.join(OUT_DIR, "bottleneck-analysis.html"), bottleneck, "utf8");
fs.writeFileSync(path.join(OUT_DIR, "skills-matrix.html"), skillsMatrix, "utf8");
fs.writeFileSync(path.join(OUT_DIR, "sqdc-performance-board.html"), sqdc, "utf8");
console.log("Generated 3 showcase case studies.");

"use strict";
const fs = require("fs");
const path = require("path");
const { page, HC_URL, packageGrid, photoHero } = require("./shared.js");
const { getModuleData, getCatalogueListing, loadRegister } = require("../../build/lib/product-data.js");

const SITE = path.resolve(__dirname, "..", ".."); // 02_main_site — write() paths are given as "site/..." throughout
const write = (rel, html) => {
  const full = path.join(SITE, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html, "utf8");
  return rel;
};
const written = [];
const w = (rel, html) => { written.push(write(rel, html)); };

/* =========================================================
   CUSTOMER-RECOGNISABLE CAPABILITY AREAS
   Shared between the homepage "What Opsteady can help you
   improve" grid (§2) and the Tools index groupings (build-
   interventions.js), so the two stay in lockstep and every
   claimed area is directly traceable to real register modules
   -- no area is asserted without at least one real Tool behind
   it. 8 customer-facing areas + one honest "Wider capability"
   bucket for the 11 Enablers, which the register itself calls
   cross-cutting rather than tied to one area (same rationale
   the prior 6-bucket version already used for Enablers).
   Mapping verified against the full 70-module register,
   2026-08-31 (see this session's own capability-area audit):
     Output & Flow (5): P4.1, P4.6-P4.9 (bottleneck/SMED/pull/
       heijunka/line-balance -- the flow subset of P4)
     Delivery & Planning (4): P4.2-P4.5 (schedule/capacity/
       inventory/OTIF -- the planning subset of P4)
     Running the Day (7): all of P2
     Quality (9): all of P3, plus P7's root-cause/problem-
       solving tools (P7.4 A3, P7.5 RCA, P7.6 8 Wastes, P7.8 5 Why)
     Equipment & Reliability (6): all of P5
     People & Skills (10): all of P1
     Standards & Improvement (10): F2, F3, F4, P6, plus P7's
       remaining CI-infrastructure tools (VSM, Kaizen, Idea &
       Suggestion, NPI, Spaghetti Diagrams)
     Performance & Decision Making (8): F1, F5, P8
     Wider capability (11): all of Enablers
   5+4+7+9+6+10+10+8+11 = 70.
========================================================= */
const OUTPUT_FLOW_IDS = new Set(["P4.1", "P4.6", "P4.7", "P4.8", "P4.9"]);
const QUALITY_P7_IDS = new Set(["P7.4", "P7.5", "P7.6", "P7.8"]);
function customerCategory(m) {
  if (m.group === "P4 Delivery & Planning") return OUTPUT_FLOW_IDS.has(m.id) ? "Output & Flow" : "Delivery & Planning";
  if (m.group === "P5 Asset Care & Maintenance") return "Equipment & Reliability";
  if (m.group === "P2 Daily Management & Performance") return "Running the Day";
  if (m.group === "P3 Quality") return "Quality";
  if (m.group === "P7 Continuous Improvement") return QUALITY_P7_IDS.has(m.id) ? "Quality" : "Standards & Improvement";
  if (m.group === "P1 People & Capability") return "People & Skills";
  if (["F2 Standards", "F3 Culture", "F4 Visual Management", "P6 Visual Management"].includes(m.group)) return "Standards & Improvement";
  if (["F1 Performance Framework", "F5 Strategy Deployment", "P8 Cost & Resource"].includes(m.group)) return "Performance & Decision Making";
  return "Wider capability"; // Enablers -- cross-cutting, not tied to one area
}
const CATEGORY_ORDER = ["Output & Flow", "Delivery & Planning", "Running the Day", "Quality", "Equipment & Reliability", "People & Skills", "Standards & Improvement", "Performance & Decision Making", "Wider capability"];
const categoryAnchor = (cat) => cat.replace(/\s+/g, "-").replace(/&/g, "and");

const IMPROVE_AREAS = [
  { name: "Output & Flow", copy: "Bottlenecks, lost capacity, poor flow, excessive WIP." },
  { name: "Delivery & Planning", copy: "Missed delivery dates, unstable schedules, poor plan adherence." },
  { name: "Running the Day", copy: "Weak daily control, unclear priorities, actions that don't close." },
  { name: "Quality", copy: "Repeat defects, rework, poor root-cause resolution, inconsistent standards." },
  { name: "Equipment & Reliability", copy: "Recurring breakdowns, weak maintenance routines, equipment-related losses." },
  { name: "People & Skills", copy: "Skills gaps, dependency on key people, unclear competence, weak training." },
  { name: "Standards & Improvement", copy: "Processes drifting, improvements not sustaining, inconsistent ways of working." },
  { name: "Performance & Decision Making", copy: "Too many KPIs, poor visibility, decisions based on opinion rather than evidence." },
];

/* =========================================================
   HOMEPAGE
========================================================= */
/* Production four-stage-loop asset, 2026-09-02 -- rebuilt a second time
   after Matt visually rejected the 2026-09-01 version as "technically
   correct but visually poor" (arrows too subtle, ring too thin, not
   enough negative space). Same underlying method as before (arcs/nodes/
   arrowheads computed from real trigonometry, verified in a standalone
   test page before wiring in, never traced from the reference JPEG), but
   with the gold ring roughly doubled in band thickness, arrowheads
   roughly doubled in size and made unmistakably prominent, the inner
   pale ring pulled further in for genuinely generous central negative
   space, and bolder label typography -- reproducing the reference's
   deliberate visual weight, not just its geometry. Clockwise Observe &
   Learn -> Stabilise -> Improve -> Sustain -> Observe & Learn, unchanged
   sequence. Works on both dark (.sec-how) and light (.page-section.tint)
   grounds via the .sec-how descendant overrides in system.css. */
const loopSVG = `<svg class="loop-diagram" viewBox="-20 0 560 410" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The Opsteady loop: Observe and Learn, Stabilise, Improve, Sustain, returning to Observe and Learn, clockwise.">
  <defs>
    <linearGradient id="loopGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F0C875"/>
      <stop offset="45%" stop-color="#D08F25"/>
      <stop offset="100%" stop-color="#8A5A14"/>
    </linearGradient>
  </defs>
  <g transform="translate(0,34)">
  <circle class="loop-guide" cx="250" cy="170" r="152"/>
  <line class="loop-cross" x1="234" y1="170" x2="266" y2="170"/>
  <line class="loop-cross" x1="250" y1="154" x2="250" y2="186"/>

  <path class="loop-ring-inner" d="M 288 104.18 A 76 76 0 0 1 315.82 132 L 308.89 136 A 68 68 0 0 0 284 111.11 Z"/>
  <path class="loop-ring-inner" d="M 315.82 208 A 76 76 0 0 1 288 235.82 L 284 228.89 A 68 68 0 0 0 308.89 204 Z"/>
  <path class="loop-ring-inner" d="M 212 235.82 A 76 76 0 0 1 184.18 208 L 191.11 204 A 68 68 0 0 0 216 228.89 Z"/>
  <path class="loop-ring-inner" d="M 184.18 132 A 76 76 0 0 1 212 104.18 L 216 111.11 A 68 68 0 0 0 191.11 136 Z"/>

  <path class="loop-ring" fill="url(#loopGoldGrad)" d="M 279.69 41.38 A 132 132 0 0 1 378.62 140.31 L 347.44 147.5 A 100 100 0 0 0 272.5 72.56 Z"/>
  <path class="loop-ring" fill="url(#loopGoldGrad)" d="M 378.62 199.69 A 132 132 0 0 1 279.69 298.62 L 272.5 267.44 A 100 100 0 0 0 347.44 192.5 Z"/>
  <path class="loop-ring" fill="url(#loopGoldGrad)" d="M 220.31 298.62 A 132 132 0 0 1 121.38 199.69 L 152.56 192.5 A 100 100 0 0 0 227.5 267.44 Z"/>
  <path class="loop-ring" fill="url(#loopGoldGrad)" d="M 121.38 140.31 A 132 132 0 0 1 220.31 41.38 L 227.5 72.56 A 100 100 0 0 0 152.56 147.5 Z"/>

  <polygon class="loop-arrow" points="333.77,115.6 360.93,136.08 382.1,167.69"/>
  <polygon class="loop-arrow" points="304.4,253.77 283.92,280.93 252.31,302.1"/>
  <polygon class="loop-arrow" points="166.23,224.4 139.07,203.92 117.9,172.31"/>
  <polygon class="loop-arrow" points="195.6,86.23 216.08,59.07 247.69,37.9"/>

  <g><circle class="loop-node-ring" cx="250" cy="54" r="9"/><circle class="loop-node-dot" cx="250" cy="54" r="3.5"/></g>
  <g><circle class="loop-node-ring" cx="366" cy="170" r="9"/><circle class="loop-node-dot" cx="366" cy="170" r="3.5"/></g>
  <g><circle class="loop-node-ring" cx="250" cy="286" r="9"/><circle class="loop-node-dot" cx="250" cy="286" r="3.5"/></g>
  <g><circle class="loop-node-ring" cx="134" cy="170" r="9"/><circle class="loop-node-dot" cx="134" cy="170" r="3.5"/></g>

  <line class="loop-tick" x1="250" y1="18" x2="250" y2="2"/>
  <line class="loop-tick" x1="402" y1="170" x2="418" y2="170"/>
  <line class="loop-tick" x1="250" y1="322" x2="250" y2="338"/>
  <line class="loop-tick" x1="98" y1="170" x2="82" y2="170"/>

  <text class="loop-label" x="250" y="-10" text-anchor="middle">OBSERVE &amp; LEARN</text>
  <text class="loop-label" x="430" y="175" text-anchor="start">STABILISE</text>
  <text class="loop-label" x="250" y="350" text-anchor="middle">IMPROVE</text>
  <text class="loop-label" x="70" y="175" text-anchor="end">SUSTAIN</text>
  </g>
</svg>`;

const homeMain = `
  <section class="hero">
    <div class="hero-media"><img src="/site/assets/photography/hero-home.jpg" alt="A stamping press die in an operating manufacturing plant, with a non-identifiable operator visible in the background at a control panel, and a restrained amber node-and-connection overlay marking one settled point on the tooling." width="1536" height="1024" loading="eager" fetchpriority="high" decoding="sync"></div>
    <div class="hero-scrim"></div>
    <div class="hero-content shell">
      <div class="hero-eyebrow eyebrow on-navy">OPSTEADY</div>
      <h1 class="hero-h1">Know what to fix first.</h1>
      <p class="hero-sub">Opsteady is the in-house way to improve a manufacturing site. Built for operations of 10 to 250 people.</p>
      <p class="hero-line">Consultants, courses, Google, or hope. Those are usually the options.</p>
      <p class="hero-sub">Opsteady helps you choose the right tools, and the right order to deploy them, with the thinking already built in. It starts with your Health Check to show where improvement is actually needed, what can wait, and how much change your team can realistically take on right now.</p>
      <p class="hero-sub">Free information, template shops and generic AI will give you methods and examples. <strong class="hero-emph">They don't know your site.</strong></p>
      <div class="hero-ctas">
        <a class="btn btn-primary" href="${HC_URL}">Start the health check</a>
        <a class="btn-text on-navy" href="/site/interventions/index.html">Browse Tools <span class="arrow">→</span></a>
      </div>
    </div>
  </section>

  <section class="page-section">
    <div class="shell">
      <div class="eyebrow">What Opsteady can help you improve</div>
      <div class="wiah-grid">
        ${IMPROVE_AREAS.map((a) => `<a class="wiah-item" href="/site/interventions/index.html#${categoryAnchor(a.name)}"><h3>${a.name}</h3><p>${a.copy}</p></a>`).join("\n        ")}
      </div>
      <p class="wiah-foot"><strong>You don't need to tackle all of it. That's the point.</strong> The Health Check helps establish what deserves attention now, and what can wait.</p>
    </div>
  </section>

  <section class="sec-how">
    <div class="shell">
      <div class="how-intro">
        <div class="eyebrow on-navy">How Opsteady works</div>
        <h2 class="how-h2">Start with your site. Not a methodology.</h2>
        <p class="how-intro-p">Every manufacturing site is different. The constraint holding back one operation might be irrelevant in another. Trying to improve everything at once usually creates more activity than progress.</p>
      </div>
      <div class="how-steps">
        <div class="how-step"><span class="how-step-num mono">01</span><h3>Understand where you are</h3><p>Start with the Opsteady Health Check. It looks across your operation to identify where attention is most needed, what can wait, and how much change is sensible to take on.</p></div>
        <div class="how-step"><span class="how-step-num mono">02</span><h3>Decide what to work on</h3><p>Your results point you towards the areas and Tools most relevant to your site. You decide what to take forward, with a clearer reason for starting there.</p></div>
        <div class="how-step"><span class="how-step-num mono">03</span><h3>Put the Tool to work</h3><p>Each Tool gives your team the knowledge, guidance and working materials needed to deploy it in your own operation, without needing a consultant alongside you.</p></div>
        <div class="how-step"><span class="how-step-num mono">04</span><h3>Improve, sustain, then look again</h3><p>Work through the improvement, give it time to settle, and rerun the Health Check periodically. As your site changes, the next priority may change with it.</p></div>
      </div>
      <div class="how-loop">
        ${loopSVG}
        <div class="how-loop-copy">
          <p class="how-loop-p"><strong>A practical rhythm for improvement.</strong> Observe and understand before changing things. Stabilise what needs control. Improve from a sound baseline. Sustain what works, then keep learning.</p>
        </div>
      </div>
      <p class="how-cta"><a class="btn-text on-navy" href="/site/the-method.html">See exactly how Opsteady works <span class="arrow">→</span></a></p>
    </div>
  </section>

  <section class="sec-get">
    <div class="shell">
      <div class="get-head">
        <div class="eyebrow">What you actually get</div>
        <h2>More than a template. Everything you need to put it to work.</h2>
        <p>You shouldn't need to already be an expert to use an Opsteady Tool. Each one is built as a practical package that helps your team understand the subject, deploy it properly and keep moving when the real world doesn't quite follow the example.</p>
      </div>
      ${packageGrid()}
    </div>
  </section>

  <section class="sec-tiers">
    <div class="shell">
      <div class="tiers-head">
        <div class="eyebrow">Essentials vs Pro</div>
        <h2>Choose how deep you need to go.</h2>
      </div>
      <div class="tiers-grid">
        <div class="tier-card">
          <h3>Essentials — ready to run</h3>
          <p>A complete Tool for the standard case. Understand what you're doing, why it matters and how to put it into practice.</p>
        </div>
        <div class="tier-card">
          <h3>Pro — the full playbook</h3>
          <p>Go further into the thinking behind the Tool: why it works, different ways to deploy it, what you can adapt, what you shouldn't, what tends to go wrong and the judgement needed when the answer isn't obvious.</p>
        </div>
      </div>
      <p class="tiers-foot"><strong>Essentials isn't a cut-down version designed to push you towards Pro.</strong> Choose the depth that fits what you're trying to do.</p>
    </div>
  </section>

  <section class="sec-credibility">
    <div class="shell">
      <div class="editorial-row">
        <div>
          <div class="cred-head">
            <div class="eyebrow">Built from running manufacturing operations</div>
            <h2>Built from running manufacturing operations.</h2>
          </div>
          <p class="cred-body">Opsteady wasn't created by taking improvement theory and turning it into templates. It was built from experience of what happens when those methods meet a real manufacturing site: limited time, competing priorities, imperfect data, different levels of experience and people who still have a day job to do.</p>
          <p class="cred-body">That's why the focus is practical: understand the problem before changing it, make the next step manageable, explain the thinking behind the method and leave your team with something they can actually use.</p>
          <p class="cred-cta"><a class="btn-text" href="/site/who-we-are.html">More about who we are <span class="arrow">→</span></a></p>
        </div>
        <div class="info-panel">
          <div class="info-panel-label mono">Why sites choose this</div>
          <dl class="info-panel-list">
            <div><dt>No sales calls</dt></div>
            <div><dt>Clear pricing, shown before you buy</dt></div>
            <div><dt>Built by people who've run manufacturing operations, not consultants</dt></div>
          </dl>
        </div>
      </div>
    </div>
  </section>

  <section class="sec-close">
    <div class="shell">
      <h2 class="close-h2">Know what to fix first.</h2>
      <p class="close-body">You don't need another list of things your site could improve.</p>
      <p class="close-body">Start with the Health Check. Understand where attention is needed now, what can wait, and where Opsteady can help.</p>
      <div class="close-cta"><a class="btn btn-primary" href="${HC_URL}">Start the free Health Check</a></div>
    </div>
  </section>
`;

w("site/index.html", page({
  current: "home",
  title: "Opsteady | Know what to fix first",
  description: "Opsteady is the in-house way to improve a manufacturing site. Find out what deserves attention first, and move into Tools your own team can run.",
  path: "/",
  main: homeMain,
}));

console.log("Homepage written. Continuing with remaining pages...");
module.exports = { write, w, written, page, HC_URL, getModuleData, getCatalogueListing, loadRegister, loopSVG, packageGrid, photoHero, customerCategory, CATEGORY_ORDER, categoryAnchor };

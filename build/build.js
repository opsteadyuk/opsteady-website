"use strict";
const fs = require("fs");
const path = require("path");
const { page, HC_URL, packageGrid, photoHero } = require("./shared.js");
const { getModuleData, getCatalogueListing, loadRegister } = require("./lib/product-data.js");

const SITE = path.resolve(__dirname, ".."); // 02_main_site repo root — promoted 2026-09-02, write() paths are root-relative now, no "site/" prefix
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
   improve" grid (§2) and the Modules index groupings (build-
   interventions.js), so the two stay in lockstep and every
   claimed area is directly traceable to real register modules
   -- no area is asserted without at least one real module behind
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
/* Production four-stage-loop asset, 2026-09-02 -- superseded same day: the
   first approved file (opsteady-four-stage-loop-approved.svg) had a
   dark-navy background baked in, so it sat as a self-contained dark tile
   on How It Works' light ground rather than blending in. Matt's fix,
   opsteady-four-stage-loop-transparent.svg, genuinely has no background
   fill this time (confirmed by reading its markup, not assumed) -- but
   its text labels and guide/tick lines are hardcoded white (fill/stroke
   #ffffff), which was clearly authored for a dark ground. On How It
   Works' light section (--v6-warm, #FBF9F5), white-on-#FBF9F5 is
   effectively invisible (~1.05:1 contrast, nowhere near WCAG AA's 4.5:1)
   -- this file resolves the dark-tile problem but introduces a real
   legibility one on the light page. Flagged, not silently fixed by
   recolouring the approved asset -- see this session's report. Same file
   copied over the same filename (site/assets/photography -- now promoted
   to assets/photography/four-stage-loop.svg), no path change needed;
   referenced as a plain <img>. Used on the homepage's dark hero, unchanged. */
const loopSVG = `<img class="loop-diagram" src="/assets/photography/four-stage-loop.svg" alt="The Opsteady loop: Observe and Learn, Stabilise, Improve, Sustain, returning to Observe and Learn, clockwise." width="1720" height="1160" loading="lazy" decoding="async">`;

/* Light-ground variant, 2026-09-02 -- How It Works only. Same file as
   above, text labels and guide/tick lines recoloured from white to
   #1B2E4F (system.css's --n6-navy / tokens.css's --ops-n80, the site's
   standard dark ink colour, not a new one picked for this) so they read
   against --v6-warm (#FBF9F5) instead of disappearing into it. Verified
   12.88:1 contrast, well past WCAG AA's 4.5:1. Saved as a genuinely new
   file (opsteady-four-stage-loop-transparent-light-ground.svg in
   02_brand, four-stage-loop-light.svg here) -- the original
   four-stage-loop.svg is untouched and stays correct for the homepage's
   dark ground. */
const loopSVGLight = `<img class="loop-diagram" src="/assets/photography/four-stage-loop-light.svg" alt="The Opsteady loop: Observe and Learn, Stabilise, Improve, Sustain, returning to Observe and Learn, clockwise." width="1720" height="1160" loading="lazy" decoding="async">`;

const homeMain = `
  <section class="hero">
    <div class="hero-media"><img src="/assets/photography/hero-home.jpg" alt="A stamping press die in an operating manufacturing plant, with a non-identifiable operator visible in the background at a control panel, and a restrained amber node-and-connection overlay marking one settled point on the tooling." width="1536" height="1024" loading="eager" fetchpriority="high" decoding="sync"></div>
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
        <a class="btn-text on-navy" href="/modules/index.html">Browse modules <span class="arrow">→</span></a>
      </div>
    </div>
  </section>

  <section class="page-section">
    <div class="shell">
      <div class="eyebrow">What Opsteady can help you improve</div>
      <div class="wiah-grid">
        ${IMPROVE_AREAS.map((a) => `<a class="wiah-item" href="/modules/index.html#${categoryAnchor(a.name)}"><h3>${a.name}</h3><p>${a.copy}</p></a>`).join("\n        ")}
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
        <div class="how-step"><span class="how-step-num mono">02</span><h3>Decide what to work on</h3><p>Your results point you towards the areas and modules most relevant to your site. You decide what to take forward, with a clearer reason for starting there.</p></div>
        <div class="how-step"><span class="how-step-num mono">03</span><h3>Put the module to work</h3><p>Each module gives your team the knowledge, guidance and working materials needed to deploy it in your own operation, without needing a consultant alongside you.</p></div>
        <div class="how-step"><span class="how-step-num mono">04</span><h3>Improve, sustain, then look again</h3><p>Work through the improvement, give it time to settle, and rerun the Health Check periodically. As your site changes, the next priority may change with it.</p></div>
      </div>
      <div class="how-loop">
        ${loopSVG}
        <div class="how-loop-copy">
          <p class="how-loop-p"><strong>A practical rhythm for improvement.</strong> Observe and understand before changing things. Stabilise what needs control. Improve from a sound baseline. Sustain what works, then keep learning.</p>
        </div>
      </div>
      <p class="how-cta"><a class="btn-text on-navy" href="/the-method.html">See exactly how Opsteady works <span class="arrow">→</span></a></p>
    </div>
  </section>

  <section class="sec-get">
    <div class="shell">
      <div class="get-head">
        <div class="eyebrow">What you actually get</div>
        <h2>More than a template. Everything you need to put it to work.</h2>
        <p>You shouldn't need to already be an expert to use an Opsteady module. Each one is built as a practical package that helps your team understand the subject, deploy it properly and keep moving when the real world doesn't quite follow the example.</p>
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
          <p>A complete module for the standard case. Understand what you're doing, why it matters and how to put it into practice.</p>
        </div>
        <div class="tier-card">
          <h3>Pro — the full playbook</h3>
          <p>Go further into the thinking behind the module: why it works, different ways to deploy it, what you can adapt, what you shouldn't, what tends to go wrong and the judgement needed when the answer isn't obvious.</p>
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
          <p class="cred-cta"><a class="btn-text" href="/who-we-are.html">More about who we are <span class="arrow">→</span></a></p>
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

w("index.html", page({
  current: "home",
  title: "Opsteady | Know what to fix first",
  description: "Opsteady is the in-house way to improve a manufacturing site. Find out what deserves attention first, and move into modules your own team can run.",
  path: "/",
  main: homeMain,
}));

console.log("Homepage written. Continuing with remaining pages...");
module.exports = { write, w, written, page, HC_URL, getModuleData, getCatalogueListing, loadRegister, loopSVG, loopSVGLight, packageGrid, photoHero, customerCategory, CATEGORY_ORDER, categoryAnchor };

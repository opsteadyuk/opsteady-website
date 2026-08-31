"use strict";
const fs = require("fs");
const path = require("path");
const { page, HC_URL } = require("./shared.js");
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
   HOMEPAGE
========================================================= */
const loopSVG = `<svg class="loop-diagram" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The canonical Opsteady loop: Observe and Learn, Stabilise, Improve, Sustain, returning to Observe and Learn.">
  <circle cx="60" cy="60" r="46" fill="none" stroke="#33404F" stroke-width="1.5" stroke-dasharray="3 6"/>
  <path d="M76 20 A46 46 0 0 1 106 50" fill="none" stroke="#52698D" stroke-width="1.5"/>
  <path d="M106 70 A46 46 0 0 1 76 100" fill="none" stroke="#52698D" stroke-width="1.5"/>
  <path d="M44 100 A46 46 0 0 1 14 70" fill="none" stroke="#52698D" stroke-width="1.5"/>
  <path d="M14 50 A46 46 0 0 1 44 20" fill="none" stroke="#D08F25" stroke-width="1.5"/>
  <path d="M41 21 l4.5 -3 l0.5 5.5" fill="none" stroke="#D08F25" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <g fill="#12203A" stroke="#8496B3" stroke-width="1.5">
    <circle cx="60" cy="14" r="5"/><circle cx="106" cy="60" r="5"/><circle cx="60" cy="106" r="5"/><circle cx="14" cy="60" r="5"/>
  </g>
</svg>`;

const homeMain = `
  <section class="hero">
    <div class="hero-media"><img src="/v6/assets/hero-manufacturing.png" alt="A stamping press die in an operating manufacturing plant, with a non-identifiable operator visible in the background at a control panel, and a restrained amber node-and-connection overlay marking one settled point on the tooling."></div>
    <div class="hero-scrim"></div>
    <div class="hero-content shell">
      <div class="hero-eyebrow eyebrow on-navy">Opsteady — Operational Improvement System</div>
      <h1 class="hero-h1">Know what to fix first.</h1>
      <p class="hero-sub">Opsteady helps you find out what deserves attention on your site, establish where to start, and move into practical interventions your own team can run. The Health Check is the fastest way in.</p>
      <div class="hero-ctas">
        <a class="btn btn-primary" href="${HC_URL}">Start the health check</a>
        <a class="btn-text on-navy" href="/site/problems/index.html">Browse by problem <span class="arrow">→</span></a>
      </div>
    </div>
  </section>

  <section class="recognition-proof">
    <span class="rp-seam" aria-hidden="true"></span>
    <div class="rp-media"><img src="/site/assets/photography/recognition-keyart-source.png" alt="" role="presentation"></div>
    <div class="rp-scrim"></div>
    <svg class="rp-markers" viewBox="0 0 1000 667" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Several unresolved points across the scene, each appearing to compete for attention, none yet marked as the priority.">
      <g class="rp-marker rp-marker-1"><circle cx="520" cy="130" r="15" class="rp-ring"/><circle cx="520" cy="130" r="4" class="rp-dot"/></g>
      <g class="rp-marker rp-marker-2"><circle cx="700" cy="215" r="11" class="rp-ring rp-ring-dim"/><circle cx="700" cy="215" r="3" class="rp-dot rp-dot-dim"/></g>
      <g class="rp-marker rp-marker-3"><circle cx="880" cy="330" r="13" class="rp-ring"/><circle cx="880" cy="330" r="3.5" class="rp-dot"/></g>
      <g class="rp-marker rp-marker-4"><circle cx="620" cy="430" r="10" class="rp-ring rp-ring-dim"/><circle cx="620" cy="430" r="3" class="rp-dot rp-dot-dim"/></g>
      <g class="rp-marker rp-marker-5"><circle cx="800" cy="500" r="14" class="rp-ring"/><circle cx="800" cy="500" r="4" class="rp-dot"/><text x="820" y="504" class="rp-tag mono">?</text></g>
      <g class="rp-marker rp-marker-6"><circle cx="410" cy="540" r="9" class="rp-ring rp-ring-dim"/><circle cx="410" cy="540" r="2.5" class="rp-dot rp-dot-dim"/></g>
    </svg>
    <div class="rp-content shell">
      <div class="eyebrow on-navy">Do you recognise this?</div>
      <div class="rp-lines">
        <p>Late finishing.</p>
        <p>Tribal knowledge running the floor.</p>
        <p>Firefighting instead of fixing.</p>
        <p class="rp-line-final">The wrong first fix.</p>
      </div>
      <p class="rp-lede">Most improvement effort fails for the same reasons. Too much noise to know what actually matters. Tools that don't talk to each other. Fixing whatever's loudest, not what's actually holding output back.</p>
    </div>
  </section>

  <section class="sec-how">
    <div class="shell how-grid">
      <div class="how-copy">
        <div class="eyebrow on-navy">How it works</div>
        <h2 class="how-h2">Know where you stand. Know what deserves attention next.</h2>
        <p>The Health Check finds out where your site stands and what deserves attention first, so you know where to start. From there, Opsteady structures deployment and sustained improvement around one loop: Observe &amp; Learn, Stabilise, Improve, Sustain.</p>
      </div>
      <div>
        ${loopSVG}
        <div class="loop-caption mono">Observe &amp; Learn <span class="arrow">→</span> Stabilise <span class="arrow">→</span> Improve <span class="arrow">→</span> Sustain <span class="arrow">→</span> back to Observe &amp; Learn</div>
      </div>
    </div>
  </section>

  <section class="sec-hc">
    <div class="shell hc-grid">
      <div class="hc-copy">
        <div class="eyebrow">The Health Check</div>
        <h2 class="hc-h2">Find out where you actually stand. About 15 minutes.</h2>
        <p>24 questions about how your site runs today, not how you'd like it to run. At the end: a clear picture of what's working, what's not, and one clear next step, either where to focus, or a specific place to start.</p>
        <p class="mono" style="font-size:13px;color:var(--n6-slate);margin-top:14px;">Free. No sales call. Your answers stay private.</p>
        <div style="margin-top:26px;"><a class="btn btn-primary on-light" href="${HC_URL}">Start the health check</a></div>
      </div>
      <div class="hc-facts">
        <div class="hc-count"><span class="num">24</span><span class="label">Questions</span></div>
        <div class="hc-count"><span class="num">~15</span><span class="label">Minutes</span></div>
        <div class="hc-count"><span class="num">£0</span><span class="label">Cost</span></div>
      </div>
    </div>
  </section>

  <section class="sec-wyag">
    <div class="shell">
      <div class="wyag-head">
        <div class="eyebrow">What you actually get</div>
        <h2>Real working tools your own team runs. Not a template pack.</h2>
      </div>
      <div class="wyag-list">
        <div class="wyag-item">
          <div>
            <div class="wyag-name">Bottleneck Analysis Tool</div>
            <p class="wyag-outcome">Find the one step actually limiting your output, measured, not guessed.</p>
            <p class="mono wyag-price">Sample: Constraint · Press 3 · 180 units/week vs next-best 310 · sized gap ~130/week</p>
            <div class="wyag-price">£99</div>
          </div>
          <a class="btn btn-text wyag-cta" href="/site/interventions/bottleneck_analysis.html">See the Bottleneck Analysis Tool <span class="arrow">→</span></a>
        </div>
        <div class="wyag-item">
          <div>
            <div class="wyag-name">Skills Matrix &amp; Cross-Training Planner</div>
            <p class="wyag-outcome">See exactly who can do what, and where a single point of failure is hiding.</p>
            <p class="mono wyag-price">I — in training · L — limited · U — unassisted · O — owner, single point of failure</p>
            <div class="wyag-price">£179</div>
          </div>
          <a class="btn btn-text wyag-cta" href="/site/interventions/skills_matrix.html">See the Skills Matrix &amp; Cross-Training Planner <span class="arrow">→</span></a>
        </div>
        <div class="wyag-item">
          <div>
            <div class="wyag-name">SQDC Performance Board Pack</div>
            <p class="wyag-outcome">A daily board built on the gap and the response, not just yesterday's number.</p>
            <p class="mono wyag-price">Safety · Quality · Delivery · Cost — standard, actual, gap and response</p>
            <div class="wyag-price">£179</div>
          </div>
          <a class="btn btn-text wyag-cta" href="/site/interventions/sqdc_performance_board.html">See the SQDC Performance Board Pack <span class="arrow">→</span></a>
        </div>
      </div>
    </div>
  </section>

  <section class="sec-trust">
    <div class="shell">
      <div class="eyebrow on-navy">Built for people who run sites</div>
      <p class="trust-body">Built by someone who's stood at a shift handover and watched the same three problems get passed on again, because nobody had a way to record them. Nobody visits your site. Nobody sells you a programme. You get the tool, the reasoning, and your own team runs it.</p>
      <div class="trust-facts">
        <span class="tag on-navy">No sales calls</span>
        <span class="tag on-navy">Honest pricing</span>
        <span class="tag on-navy">No fake urgency</span>
      </div>
      <div class="trust-cta"><a class="btn btn-primary" href="${HC_URL}">Start the health check</a></div>
    </div>
  </section>

  <section class="sec-next">
    <div class="shell">
      <img class="next-logo" src="/brand/opsteady-logo-on-navy.svg" alt="Opsteady">
      <h2 class="next-h2">Know what to fix first, before you spend on the wrong thing.</h2>
      <div class="next-ctas">
        <a class="btn btn-primary" href="${HC_URL}">Start the health check</a>
        <a class="btn-text on-navy" href="/site/problems/index.html">Browse by problem <span class="arrow">→</span></a>
      </div>
    </div>
  </section>
`;

w("site/index.html", page({
  current: "home",
  title: "Opsteady — Know what to fix first",
  description: "A practical operational improvement system for manufacturing sites. Find out what deserves attention first, and move into interventions your own team can run.",
  path: "/",
  main: homeMain,
}));

console.log("Homepage written. Continuing with remaining pages...");
module.exports = { write, w, written, page, HC_URL, getModuleData, getCatalogueListing, loadRegister, loopSVG };

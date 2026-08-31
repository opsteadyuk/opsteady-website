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
      <p class="hero-sub">Opsteady helps people running manufacturing sites work out where improvement is actually needed, what to tackle first, and gives their own team the practical Tools to act.</p>
      <p class="hero-sub">Free information and general AI can hand you methods, examples and templates. They don't know what your particular site needs first, what can wait, or how much change your team can realistically take on right now. Opsteady uses information about your site to help establish that, before you pick what to do.</p>
      <div class="hero-ctas">
        <a class="btn btn-primary" href="${HC_URL}">Start the health check</a>
        <a class="btn-text on-navy" href="/site/interventions/index.html">Browse Tools <span class="arrow">→</span></a>
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
      <p class="rp-lede">Every site has its own version of this. One station gets blamed at every meeting and nobody's measured it. Delivery dates slip and the plan gets rebuilt every week instead of held. Shifts hand over the same three problems because nothing gets written down. The same defect comes back a month after it was "fixed."</p>
      <p class="rp-lede">None of these get better by picking the loudest one and throwing effort at it.</p>
    </div>
  </section>

  <section class="page-section">
    <div class="shell">
      <div class="eyebrow">What Opsteady can help you improve</div>
      <div class="wiah-grid">
        <div class="wiah-item"><h3>Output &amp; flow</h3><p>Bottlenecks, lost capacity, changeovers that eat the shift, work that won't move at a steady pace.</p></div>
        <div class="wiah-item"><h3>Delivery &amp; planning</h3><p>Missed dates, plans nobody trusts, material that isn't there when it's needed.</p></div>
        <div class="wiah-item"><h3>Running the day</h3><p>Firefighting, unclear priorities, meetings that don't produce action.</p></div>
        <div class="wiah-item"><h3>Quality</h3><p>The same defect or complaint coming back no matter how many times it's "fixed."</p></div>
        <div class="wiah-item"><h3>People &amp; standards</h3><p>The job done differently depending on who's on shift.</p></div>
      </div>
      <p class="wiah-foot">Every one of these connects to a specific, real Tool. None of them need you to learn a methodology first.</p>
    </div>
  </section>

  <section class="page-section tint">
    <div class="shell" style="max-width:760px;">
      <h2>Start with your site</h2>
      <p>Picking a method because it's popular is a guess. A site that starts with SMED when its real problem is unreliable equipment fixes the wrong thing well. Diagnosing first means the first thing you do is the thing your own site actually needs.</p>
    </div>
  </section>

  <section class="sec-hc">
    <div class="shell hc-grid">
      <div class="hc-copy">
        <div class="eyebrow">What happens when you use Opsteady</div>
        <h2 class="hc-h2">The Health Check looks at how your site runs today, not how you'd like it to run.</h2>
        <p>In return: a clear starting point, and why it's the right one for your site — then a practical way to act on it.</p>
        <div style="margin-top:26px;"><a class="btn btn-primary on-light" href="${HC_URL}">Start the health check</a></div>
      </div>
      <div class="hc-facts">
        <div class="hc-count"><span class="num">£0</span><span class="label">Cost</span></div>
      </div>
    </div>
  </section>

  <section class="sec-wyag">
    <div class="shell">
      <div class="wyag-head">
        <div class="eyebrow">From recommendation to something usable</div>
        <h2>Bottleneck Analysis Tool</h2>
      </div>
      <div class="wyag-list">
        <div class="wyag-item">
          <div>
            <p class="wyag-outcome">Find the one step actually limiting your output — not the one everyone blames. A week of logging, one ranked constraint, a sized cost, and what to do about it before anyone signs off on new equipment or headcount.</p>
            <p class="mono wyag-price">Worked example in the Tool: Press 3 measured 180 units/week vs next-best (Packing) 310 — sized cost ~130 units/week</p>
            <div class="wyag-price">From £99</div>
          </div>
          <a class="btn btn-text wyag-cta" href="/site/interventions/bottleneck_analysis.html">See the Bottleneck Analysis Tool <span class="arrow">→</span></a>
        </div>
      </div>
    </div>
  </section>

  <section class="sec-how">
    <div class="shell how-grid">
      <div class="how-copy">
        <div class="eyebrow on-navy">How improvement is deployed</div>
        <h2 class="how-h2">Built to help improvement stick.</h2>
      </div>
      <div>
        ${loopSVG}
        <div class="loop-caption mono">Observe &amp; Learn <span class="arrow">→</span> Stabilise <span class="arrow">→</span> Improve <span class="arrow">→</span> Sustain</div>
        <p style="margin-top:14px;"><a class="btn-text on-navy" href="/site/the-method.html">How It Works <span class="arrow">→</span></a></p>
      </div>
    </div>
  </section>

  <section class="sec-trust">
    <div class="shell">
      <div class="eyebrow on-navy">Built for people who run sites</div>
      <p class="trust-body">Opsteady is built from experience running manufacturing operations. No sales calls, clear pricing, and you can see what you're buying before you buy it — your own team runs it from there.</p>
      <div class="trust-facts">
        <span class="tag on-navy">No sales calls</span>
        <span class="tag on-navy">Clear pricing</span>
        <span class="tag on-navy">No fake urgency</span>
      </div>
      <div class="trust-cta"><a class="btn btn-primary" href="${HC_URL}">Start the health check</a></div>
    </div>
  </section>

  <section class="sec-next">
    <div class="shell">
      <img class="next-logo" src="/brand/opsteady-logo-on-navy.svg" alt="Opsteady">
      <h2 class="next-h2">Not sure where to start? Run the Health Check. Already know what you need? Browse Tools.</h2>
      <div class="next-ctas">
        <a class="btn btn-primary" href="${HC_URL}">Start the health check</a>
        <a class="btn-text on-navy" href="/site/interventions/index.html">Browse Tools <span class="arrow">→</span></a>
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

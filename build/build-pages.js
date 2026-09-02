"use strict";
const { w, page, HC_URL, loopSVGLight, packageGrid, photoHero } = require("./build.js");

/* ---- How It Works — the comprehensive version of the homepage's
   4-step "How Opsteady works" section. Same structure, expanded in
   depth; no alternative explanation of the system invented here. ---- */
w("the-method.html", page({
  current: "how-it-works",
  title: "How Opsteady works",
  description: "The full Opsteady customer journey: the Health Check, how findings become priorities, what a Tool actually gives you, and the improvement rhythm that keeps it going.",
  path: "/the-method",
  main: `
  ${photoHero({
    eyebrow: "How it works",
    h1: "Start from your site, not a method.",
    sub: "Opsteady doesn't ask which methodology you want to try. It asks what your site actually needs, in what order, and how much of it you can take on right now. This page walks through the whole journey, step by step.",
    spec: "Updated 2026-09-02, Matt's ruling: this page now carries one hero photograph (hero-how-it-works.jpg), a real diagnostic moment in progress, as the current deliberate choice — superseding the prior 'no photography by design' rule and its 'do not re-add a hero photo here' instruction. The loop diagram further down the page (§4 row 3) remains this page's other visual; the two are not in tension, one is the hero, one illustrates the method.",
    image: {
      src: "/assets/photography/hero-how-it-works.jpg",
      alt: "Two colleagues observing a CNC machining centre in operation, reviewing the cut on a display screen.",
      width: 1168, height: 784,
      objectPosition: "50% 40%",
      priority: true,
    },
  })}

  <section class="page-section">
    <div class="shell">
      <div class="editorial-row">
        <div>
          <div class="eyebrow">Step 1</div>
          <h2>The Health Check</h2>
          <p>The Health Check is a short, structured set of questions about how your site runs today: not how you'd like it to run, and not a test of what you know about improvement methods. It looks across the areas that make up a manufacturing operation: output and flow, delivery and planning, daily control, quality, equipment and maintenance, people and skills, standards, and how decisions get made.</p>
          <p>Completing it means answering honestly about your current situation in each of those areas, in your own words where it matters, rather than picking the answer that sounds best. The result is a picture of where things are genuinely working, where they're not, and, just as importantly, how much appetite and capacity your team actually has to take on change right now. A site mid-way through a product launch or short-staffed on a key shift can take on less at once than one with room to spare, and the Health Check treats that as real information, not an inconvenience to work around.</p>
          <p>From that picture, the Health Check identifies which areas deserve attention first. It isn't a one-time diagnostic you run once and file away. Your site changes as you improve it, so the Health Check is designed to be rerun periodically, not answered once and forgotten.</p>
        </div>
        <div class="info-panel">
          <div class="info-panel-label mono">What it looks at</div>
          <dl class="info-panel-list">
            <div><dt>Output &amp; flow</dt></div>
            <div><dt>Delivery &amp; planning</dt></div>
            <div><dt>Daily control</dt></div>
            <div><dt>Quality</dt></div>
            <div><dt>Equipment &amp; maintenance</dt></div>
            <div><dt>People &amp; skills</dt></div>
            <div><dt>Standards</dt></div>
            <div><dt>How decisions get made</dt></div>
          </dl>
        </div>
      </div>
    </div>
  </section>

  <section class="page-section tint">
    <div class="shell">
      <div class="editorial-row">
        <div>
          <div class="eyebrow">Step 2</div>
          <h2>From findings to priorities</h2>
          <p>Every area the Health Check looks at connects to real Opsteady Tools built for exactly that area. Where your result shows a genuine gap, the relevant Tools are the ones it points you towards, not the whole catalogue, and not a guess.</p>
          <p>Not everything gets flagged as urgent. Part of what the Health Check does is tell you what can reasonably wait, so you're not left trying to fix everything simultaneously with a team that has a day job to do. Sequencing takes account of what's most urgent, what depends on what already being in place, and how much your team can realistically absorb at once.</p>
          <p>This isn't a black box with total certainty about your operation. The Health Check gives you a clear, evidenced starting point and the reasoning behind it: the judgement about whether that's genuinely the right place to start for your site, today, still sits with you. That's deliberate. Nobody outside your operation has the full picture, and Opsteady doesn't pretend otherwise.</p>
        </div>
        <div class="info-panel">
          <div class="info-panel-label mono">What determines priority</div>
          <dl class="info-panel-list">
            <div><dt>What's most urgent</dt></div>
            <div><dt>What already needs to be in place first</dt></div>
            <div><dt>How much your team can realistically absorb</dt></div>
          </dl>
        </div>
      </div>
    </div>
  </section>

  <section class="page-section full-copy">
    <div class="shell">
      <div class="eyebrow">Step 3</div>
      <h2>What a Tool actually gives you</h2>
      <p style="margin-bottom:14px;">Once you know what to work on, you move into a Tool: a complete package built so your own team can deploy it, not a consultant standing next to them. You don't need to already be an expert in the subject before you start.</p>
      ${packageGrid()}
      <p style="margin-top:32px;margin-bottom:14px;">Every Tool is available as an Essentials edition where it exists, and always as Pro. Essentials is a complete, ready-to-run version for the standard case, not a cut-down teaser. Pro goes further into the thinking behind the Tool: why it works, different ways to deploy it, what tends to go wrong, and the judgement needed when your situation isn't the standard case. Choose the depth that fits what you're trying to do, not a fixed default.</p>
      <p>There is deliberately no salesperson or consultant who calls you to explain the rest. Everything you need to decide whether a Tool is right, and then to deploy it yourself once you've bought it, is either on its page or inside the package itself.</p>
    </div>
  </section>

  <section class="page-section tint">
    <div class="shell editorial-row">
      <div>
        <div class="eyebrow">Step 4</div>
        <h2>The loop</h2>
        <p style="max-width:60ch;">Observe &amp; Learn <span class="arrow">→</span> Stabilise <span class="arrow">→</span> Improve <span class="arrow">→</span> Sustain <span class="arrow">→</span> back to Observe &amp; Learn.</p>
        <p style="max-width:60ch;">This is how Opsteady approaches deployment and ongoing improvement, and it applies inside a single Tool as much as it does across your whole site. Understand what's actually happening before you change anything. Acting on assumptions is usually how the wrong thing gets fixed well. Get the situation stable enough to control before you try to improve it; improving something that isn't yet under control just adds noise. Improve from that stable baseline. Once something is genuinely sustained (holding without constant intervention), it's the right time to look at what's next, not before.</p>
      </div>
      <div>${loopSVGLight}</div>
    </div>
  </section>

  <section class="page-section">
    <div class="shell">
      <div class="editorial-row">
        <div>
          <div class="eyebrow">Ongoing</div>
          <h2>A repeatable system, not a one-use diagnostic</h2>
          <p>Your site doesn't stand still once you've made an improvement. A constraint that's resolved stops being the priority; a new one becomes visible once the old one's out of the way; people, demand and equipment all change over time. That's why the Health Check is built to be rerun periodically rather than answered once.</p>
          <p>Each time you run it, it looks at how the operation has moved: whether previous weak points have genuinely strengthened, whether priorities have shifted, and what deserves attention next. Opsteady is designed as a repeatable improvement system around your site, not a single funnel that ends once you've bought one Tool.</p>
          <div style="margin-top:24px;display:flex;gap:20px;flex-wrap:wrap;"><a class="btn btn-primary" href="${HC_URL}">Start the health check</a><a class="btn-text" href="/interventions/index.html">Browse Tools <span class="arrow">→</span></a></div>
        </div>
        <div class="info-panel">
          <div class="info-panel-label mono">What changes over time</div>
          <dl class="info-panel-list">
            <div><dt>A resolved constraint stops being the priority</dt></div>
            <div><dt>A new one becomes visible once the old one's out of the way</dt></div>
            <div><dt>People, demand and equipment all change</dt></div>
          </dl>
        </div>
      </div>
    </div>
  </section>
  `,
}));

console.log("Method written. Problems section removed 2026-09-02, see PROJECT_STATE.md.");

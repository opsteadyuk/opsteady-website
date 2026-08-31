"use strict";
const { w, page, HC_URL, loopSVG, packageGrid } = require("./build.js");

/* ---- How It Works — the comprehensive version of the homepage's
   4-step "How Opsteady works" section. Same structure, expanded in
   depth; no alternative explanation of the system invented here. ---- */
w("site/the-method.html", page({
  current: "how-it-works",
  title: "How Opsteady works",
  description: "The full Opsteady customer journey: the Health Check, how findings become priorities, what a Tool actually gives you, and the improvement rhythm that keeps it going.",
  path: "/the-method",
  main: `
  <section class="page-hero">
    <div class="shell">
      <div class="eyebrow on-navy">How it works</div>
      <h1>Start from your site, not a method.</h1>
      <p>Opsteady doesn't ask which methodology you want to try. It asks what your site actually needs, in what order, and how much of it you can take on right now. This page walks through the whole journey, step by step.</p>
    </div>
  </section>

  <section class="page-section">
    <div class="shell">
      <div class="eyebrow">01 — Understand where you are</div>
      <h2>The Health Check</h2>
      <p>The Health Check is a short, structured set of questions about how your site runs today — not how you'd like it to run, and not a test of what you know about improvement methods. It looks across the areas that make up a manufacturing operation: output and flow, delivery and planning, daily control, quality, equipment and maintenance, people and skills, standards, and how decisions get made.</p>
      <p>Completing it means answering honestly about your current situation in each of those areas, in your own words where it matters, rather than picking the answer that sounds best. The result is a picture of where things are genuinely working, where they're not, and — just as importantly — how much appetite and capacity your team actually has to take on change right now. A site mid-way through a product launch or short-staffed on a key shift can take on less at once than one with room to spare, and the Health Check treats that as real information, not an inconvenience to work around.</p>
      <p>From that picture, the Health Check identifies which areas deserve attention first. It isn't a one-time diagnostic you run once and file away — your site changes as you improve it, so the Health Check is designed to be rerun periodically, not answered once and forgotten.</p>
    </div>
  </section>

  <section class="page-section tint">
    <div class="shell">
      <div class="eyebrow">02 — Decide what to work on</div>
      <h2>From findings to priorities</h2>
      <p>Every area the Health Check looks at connects to real Opsteady Tools built for exactly that area. Where your result shows a genuine gap, the relevant Tools are the ones it points you towards — not the whole catalogue, and not a guess.</p>
      <p>Not everything gets flagged as urgent. Part of what the Health Check does is tell you what can reasonably wait, so you're not left trying to fix everything simultaneously with a team that has a day job to do. Sequencing takes account of what's most urgent, what depends on what already being in place, and how much your team can realistically absorb at once.</p>
      <p>This isn't a black box with total certainty about your operation. The Health Check gives you a clear, evidenced starting point and the reasoning behind it — the judgement about whether that's genuinely the right place to start for your site, today, still sits with you. That's deliberate: nobody outside your operation has the full picture, and Opsteady doesn't pretend otherwise.</p>
    </div>
  </section>

  <section class="page-section">
    <div class="shell">
      <div class="eyebrow">03 — Put the Tool to work</div>
      <h2>What a Tool actually gives you</h2>
      <p>Once you know what to work on, you move into a Tool — a complete package built so your own team can deploy it, not a consultant standing next to them. You don't need to already be an expert in the subject before you start.</p>
      ${packageGrid()}
      <p style="margin-top:32px;">Every Tool is available as an Essentials edition where it exists, and always as Pro. Essentials is a complete, ready-to-run version for the standard case — not a cut-down teaser. Pro goes further into the thinking behind the Tool: why it works, different ways to deploy it, what tends to go wrong, and the judgement needed when your situation isn't the standard case. Choose the depth that fits what you're trying to do, not a fixed default.</p>
      <p>There is deliberately no salesperson or consultant who calls you to explain the rest. Everything you need to decide whether a Tool is right, and then to deploy it yourself once you've bought it, is either on its page or inside the package itself.</p>
    </div>
  </section>

  <section class="page-section tint">
    <div class="shell" style="display:grid;gap:40px;align-items:center;grid-template-columns:1fr;">
      <div>
        <div class="eyebrow">04 — Improve, sustain, then look again</div>
        <h2>The loop</h2>
        <p>Observe &amp; Learn <span class="arrow">→</span> Stabilise <span class="arrow">→</span> Improve <span class="arrow">→</span> Sustain <span class="arrow">→</span> back to Observe &amp; Learn.</p>
        <p>This is how Opsteady approaches deployment and ongoing improvement, and it applies inside a single Tool as much as it does across your whole site. Understand what's actually happening before you change anything — acting on assumptions is usually how the wrong thing gets fixed well. Get the situation stable enough to control before you try to improve it; improving something that isn't yet under control just adds noise. Improve from that stable baseline. Once something is genuinely sustained — holding without constant intervention — it's the right time to look at what's next, not before.</p>
        ${loopSVG}
      </div>
    </div>
  </section>

  <section class="page-section">
    <div class="shell">
      <h2>A repeatable system, not a one-use diagnostic</h2>
      <p>Your site doesn't stand still once you've made an improvement. A constraint that's resolved stops being the priority; a new one becomes visible once the old one's out of the way; people, demand and equipment all change over time. That's why the Health Check is built to be rerun periodically rather than answered once.</p>
      <p>Each time you run it, it looks at how the operation has moved — whether previous weak points have genuinely strengthened, whether priorities have shifted, and what deserves attention next. Opsteady is designed as a repeatable improvement system around your site, not a single funnel that ends once you've bought one Tool.</p>
      <div style="margin-top:24px;display:flex;gap:20px;flex-wrap:wrap;"><a class="btn btn-primary" href="${HC_URL}">Start the health check</a><a class="btn-text" href="/site/interventions/index.html">Browse Tools <span class="arrow">→</span></a></div>
    </div>
  </section>
  `,
}));

/* ---- Problems hub ---- */
const families = [
  { slug: "lost-output-and-downtime", q: "Machines keep stopping and I don't really know why, or what it's costing me.", territory: "Equipment reliability, downtime, loss analysis" },
  { slug: "on-time-delivery", q: "We keep missing delivery dates and I can't trust the plan we make.", territory: "Capacity, materials, delivery visibility" },
  { slug: "flow-and-bottlenecks", q: "One part of the line is always the problem, and I'm not sure it's the one we keep throwing effort at.", territory: "Constraint identification, flow, line balance" },
  { slug: "running-the-day", q: "Every shift feels like firefighting, and important things fall through the cracks between shifts and meetings.", territory: "Shift handover, meetings, daily visual management" },
  { slug: "consistent-work-and-capability", q: "Different people do the same job differently, and quality depends on who's on shift.", territory: "Standard work, skills, onboarding" },
  { slug: "recurring-problems-and-quality-escapes", q: "The same defects and complaints keep coming back no matter how many times we ‘fix’ them.", territory: "Root cause, error-proofing, variation" },
];

w("site/problems/index.html", page({
  current: "problems",
  title: "Which of these sounds like your site? — Opsteady",
  description: "Six common manufacturing site problems. Find yours, and see the right next step.",
  path: "/problems",
  main: `
  <section class="page-hero">
    <div class="shell">
      <div class="eyebrow on-navy">Problems</div>
      <h1>Which of these sounds like your site?</h1>
    </div>
  </section>
  <section class="page-section">
    <div class="shell">
      <div class="problem-list">
        ${families.map(f => `<a class="problem-row" href="/site/problems/${f.slug}.html">
          <span class="q">${f.q}</span>
          <span class="territory">${f.territory}</span>
        </a>`).join("\n        ")}
      </div>
      <p class="problem-escape">Not sure which one? <a class="btn-text" href="${HC_URL}">Run the health check instead <span class="arrow">→</span></a></p>
    </div>
  </section>
  `,
}));

/* ---- Six problem-family pages ---- */
const problemDetail = {
  "lost-output-and-downtime": {
    title: "Machines keep stopping and nobody's sure why",
    situation: "Machines keep stopping and you don't really know why, or what it's costing you.",
    persists: "Without a real number, downtime gets treated as background noise, the cost of doing business, rather than something with a specific, addressable cause.",
    wrongResponse: "Buying more capacity or adding a maintenance shift doesn't fix a specific, unidentified failure pattern. It just adds cost on top of the same problem.",
    firstEstablish: "Which specific causes are actually taking the most time, ranked, not guessed. Then what that's genuinely costing in lost machine availability.",
    routeName: "Downtime Tracking &amp; Pareto Pack",
    routeSlug: "downtime_tracking_pareto",
  },
  "on-time-delivery": {
    title: "You keep missing delivery dates",
    situation: "You keep missing delivery dates and you can't trust the plan you make.",
    persists: "Without visibility into where the plan actually breaks, every missed date gets explained after the fact rather than prevented before it.",
    wrongResponse: "Adding buffer time to every order hides the real problem instead of fixing it, and usually makes lead times worse for everyone, not just the orders that were actually at risk.",
    firstEstablish: "Where delivery performance is actually breaking down, order by order, not as a single average that hides the real pattern.",
    routeName: "OTIF &amp; Right-First-Time Dashboard",
    routeSlug: "otif_rft_dashboard",
  },
  "flow-and-bottlenecks": {
    title: "One part of the line is always the problem",
    situation: "One part of the line is always the problem, and you're not sure it's the one everyone keeps blaming. Lead times keep creeping up even though every station looks busy.",
    persists: "Without a measured answer, the loudest station gets the attention, not necessarily the one actually holding output back. Fixing the wrong station doesn't move output. It just moves the argument.",
    wrongResponse: "A busy station isn't automatically the constraint. High utilisation on work that isn't the real hold-up can look like the answer and not be it. Before spending on new equipment, overtime, or headcount, it's worth being certain which step it would actually fix.",
    firstEstablish: "Which single step is genuinely setting the pace of the whole line, measured, not guessed. Then what that's actually costing you in units per week.",
    routeName: "Bottleneck Analysis Tool",
    routeSlug: "bottleneck_analysis",
  },
  "running-the-day": {
    title: "Every shift feels like firefighting",
    situation: "Every shift feels like firefighting, and important things fall through the cracks between shifts and meetings.",
    persists: "Without a structured handover and a daily rhythm, the same information gets re-discovered, or missed entirely, shift after shift.",
    wrongResponse: "Adding another meeting or another form doesn't fix a handover that has no agreed structure. It just adds another thing that gets skipped under pressure.",
    firstEstablish: "What actually needs to pass between shifts, and where that's currently breaking down.",
    routeName: "Shift Handover System",
    routeSlug: "shift_handover",
  },
  "consistent-work-and-capability": {
    title: "Quality depends on who's on shift",
    situation: "Different people do the same job differently, and quality depends on who's on shift.",
    persists: "Without a shared, current record of who can genuinely do what, cover gaps and inconsistent quality both stay invisible until they cause a problem.",
    wrongResponse: "A generic training plan doesn't fix a gap you haven't actually identified. It's easy to train the wrong thing, or the wrong person, without a real picture first.",
    firstEstablish: "Who can genuinely do each critical task unsupervised right now, and where a single point of failure is hiding.",
    routeName: "Skills Matrix &amp; Cross-Training Planner",
    routeSlug: "skills_matrix",
  },
  "recurring-problems-and-quality-escapes": {
    title: "The same defects keep coming back",
    situation: "The same defects and complaints keep coming back no matter how many times you ‘fix’ them.",
    persists: "Without a real root-cause discipline, the fastest available explanation gets treated as the answer, and the fix goes in against the wrong cause.",
    wrongResponse: "Retraining the operator or tightening an inspection step doesn't fix a cause you haven't actually verified. It usually just delays the same defect's return.",
    firstEstablish: "Whether this is a single, traceable cause or several tangled factors, and what the evidence actually says, not just what's fastest to explain.",
    routeName: "Root Cause Analysis Toolkit",
    routeSlug: "root_cause_analysis",
  },
};

for (const f of families) {
  const d = problemDetail[f.slug];
  w(`site/problems/${f.slug}.html`, page({
    current: "problems",
    title: `${d.title} — Opsteady`,
    description: d.situation.replace(/&amp;/g, "&"),
    path: `/problems/${f.slug}`,
    main: `
  <section class="page-hero">
    <div class="shell">
      <div class="eyebrow on-navy">Do you recognise this?</div>
      <p class="pp-situation" style="color:#fff;font-size:1.5rem;max-width:36ch;">${d.situation}</p>
    </div>
  </section>
  <section class="page-section">
    <div class="shell" style="max-width:760px;">
      <h2>Why it persists</h2>
      <p>${d.persists}</p>
      <h2 style="margin-top:36px;">Why the obvious response can be wrong</h2>
      <p>${d.wrongResponse}</p>
      <h2 style="margin-top:36px;">What needs to be established first</h2>
      <p>${d.firstEstablish}</p>
      <div class="pp-routes">
        <div class="pp-route">
          <div class="route-label">Route A</div>
          <p>Not sure this is the whole picture? Start with the Health Check.</p>
          <a class="btn btn-primary route-cta" href="${HC_URL}">Start the health check</a>
        </div>
        <div class="pp-route">
          <div class="route-label">Route B</div>
          <p>Already certain this is it?</p>
          <a class="btn btn-text route-cta" href="/site/interventions/${d.routeSlug}.html">Go straight to the ${d.routeName} <span class="arrow">→</span></a>
        </div>
      </div>
    </div>
  </section>
  `,
  }));
}

console.log("Method, Problems hub, and 6 problem pages written.");

"use strict";
const { w, page, HC_URL } = require("./build.js");

/* ---- Pricing ---- */
w("site/pricing.html", page({
  current: "pricing",
  title: "Opsteady pricing",
  description: "Straightforward pricing, explained plainly. No hidden costs, no sales call.",
  path: "/pricing",
  main: `
  <section class="page-hero">
    <div class="shell">
      <div class="eyebrow on-navy">Pricing</div>
      <h1>Straightforward pricing.</h1>
      <p>Every Tool has its own price, shown on its own page. Most are Pro today, priced by depth and reach — Essentials editions are being added over time, and only shown where they actually exist.</p>
    </div>
  </section>
  <section class="page-section">
    <div class="shell">
      <h2>What things cost</h2>
      <table class="price-table">
        <thead><tr><th></th><th>Essentials <span class="mono" style="font-weight:400;font-size:0.8rem;">(where available)</span></th><th>Pro</th></tr></thead>
        <tbody>
          <tr><td>Most Tools</td><td>£89</td><td>£179</td></tr>
          <tr><td>A smaller number of deeper, cross-cutting Tools</td><td>£179</td><td>£349</td></tr>
        </tbody>
      </table>
    </div>
  </section>
  <section class="page-section tint">
    <div class="shell">
      <h2>A small number of Tools at a lower entry price</h2>
      <p>These are available as detailed worked examples, at a lower entry Pro price. Not a discount. Not time-limited.</p>
      <div class="showcase-list">
        <div class="showcase-item"><span>Bottleneck Analysis Tool</span><span class="mono">£99</span></div>
        <div class="showcase-item"><span>Skills Matrix &amp; Cross-Training Planner</span><span class="mono">£179</span></div>
        <div class="showcase-item"><span>SQDC Performance Board Pack</span><span class="mono">£179</span></div>
      </div>
    </div>
  </section>
  <section class="page-section">
    <div class="shell">
      <h2>Where purchase happens</h2>
      <p>Every Tool has its own price and buy action, showing only the edition actually available to buy.</p>
      <div style="display:flex;gap:24px;flex-wrap:wrap;margin-top:18px;">
        <a class="btn btn-primary" href="/site/interventions/bottleneck_analysis.html">See a representative example</a>
        <a class="btn-text" href="/site/interventions/index.html">Browse Tools <span class="arrow">→</span></a>
      </div>
    </div>
  </section>
  `,
}));

/* ---- Who We Are — rewritten 2026-08-31 per the customer-experience-
   pass instruction to move closer to the stronger operational
   credibility in the existing/live-source who-we-are.html (root of
   02_main_site, the pre-Opsteady-2.0 baseline), condensed and
   reframed rather than reproduced verbatim: no chronological CV, no
   founder name or photograph (unchanged faceless/operator-led
   constraint, 02_brand/100_BASE_FILE.md D-79), no numeric Health
   Check claims the Phase 3 copy freeze already ruled out (question
   count, completion time). The real operational anecdotes below are
   condensed from that source, not invented. ---- */
w("site/who-we-are.html", page({
  current: "who-we-are",
  title: "Who built Opsteady",
  description: "No name, no photograph, no team. Operator-led, not consultant-led. Judge it by the work.",
  path: "/who-we-are",
  main: `
  <section class="page-hero">
    <div class="shell">
      <div class="eyebrow on-navy">Who we are</div>
      <h1>No name on this site. Judge it by the work.</h1>
      <p>Opsteady is a small operation, run by one person, with no team, no office and no sales function. That's a deliberate choice, not a stage it's trying to grow out of. Nobody will call you.</p>
    </div>
  </section>

  <section class="page-section">
    <div class="shell">
      <h2>Where this comes from</h2>
      <p>Opsteady comes from real time spent running manufacturing operations, not from taking improvement theory and turning it into templates — starting on the floor, learning the job before being trusted to change anything, and finding that the standards and SOPs on paper rarely described how the place actually ran on a given shift.</p>
      <p>That gap — between the system on paper and the practice on the floor — is one of the most useful things to look for in an operation. It's why the Health Check reads both, rather than averaging them into one comfortable score.</p>
    </div>
  </section>

  <section class="page-section tint">
    <div class="shell">
      <h2>Why deployment matters more than the method</h2>
      <p>A properly run improvement week — disciplined, well-executed, the full standard treatment — can still fully revert within two months if nobody involved understood why they were doing it, only that they were told to. That's not a failure of effort or of the method. It's what happens when improvement is installed rather than understood.</p>
      <p>It's why everything Opsteady builds is designed to transfer capability, not just deliver a one-off result. A tool that only works while someone stands over it isn't a tool — it's a visit.</p>
    </div>
  </section>

  <section class="page-section">
    <div class="shell">
      <h2>Why the sequence matters</h2>
      <p>An area can be missing its targets on every measure at once — not from a lack of effort, but because people are doing work that's always been done, without anyone able to say why. The fix usually isn't adding more. It's watching first, removing what doesn't need to be there, agreeing a short standard with the team who'll actually run it, and only then pushing for more.</p>
      <p>Watch before changing. Stabilise before improving. Improve from a base that holds. That's the same logic behind Opsteady's Observe &amp; Learn, Stabilise, Improve, Sustain loop — learned on a real floor, not derived from a textbook.</p>
    </div>
  </section>

  <section class="page-section tint">
    <div class="shell">
      <h2>Why trust isn't a soft subject</h2>
      <p>Every tool here depends on people being willing to say what's actually happening. Where that willingness has been damaged — because raising something went badly for someone once — no system fixes it by itself, and no amount of asking for openness in a meeting outweighs what people have already seen happen. That's why Opsteady's diagnostics look at how people behave alongside what the systems say, and why nothing here pretends a template can substitute for trust.</p>
    </div>
  </section>

  <section class="page-section">
    <div class="shell">
      <h2>Why not a consultant, a course, or a template shop</h2>
      <p>Opsteady is sold as a method, not a personality, and built to work across different sites, sectors and problems. The solutions are different every time; what travels between sites is the order things need doing in — which is exactly what the Health Check exists to establish for yours.</p>
      <p>There's no retainer, no subscription to your own improvement, and no sales call following anything you buy. Opsteady doesn't come to your site, doesn't run your projects, and won't tell you what your culture should be — that's yours to shape, and you know your people. Most of what's here builds on established operational thinking, not reinvented; what Opsteady adds is the deployment judgement — what to do first, what conflicts with what, and what to do when it stalls.</p>
    </div>
  </section>

  <section class="page-section tint">
    <div class="shell">
      <h2>Relationship to Optimere</h2>
      <p>Opsteady is a trading name of Optimere Limited, the company that builds and runs it.</p>
      <div style="margin-top:24px;"><a class="btn btn-primary" href="${HC_URL}">Start the health check</a></div>
    </div>
  </section>
  `,
}));

/* ---- Health Check landing (marketing site page; nav "Health Check" itself
   links straight to the external app per the approved nav table — this
   page is the fuller expectation-setting stop other CTAs route through) ---- */
w("site/health-check.html", page({
  current: "health-check",
  title: "Opsteady Health Check — Know where you stand",
  description: "A short set of questions about how your site runs today. Free, no sales call.",
  path: "/health-check",
  main: `
  <section class="page-hero">
    <div class="shell">
      <div class="eyebrow on-navy">The Health Check</div>
      <h1>Know where your site actually stands.</h1>
      <p>A short set of questions about how things run today — not how you'd like them to run.</p>
    </div>
  </section>
  <section class="page-section">
    <div class="shell" style="max-width:640px;">
      <!-- IMPLEMENTATION DEPENDENT: the frozen Phase 3 "what you'll get" copy (site-at-a-glance,
           several named development areas, first action, what's next, pace guidance) is the
           approved target for this section but must not publish live until report-v2.js's output
           actually delivers it (Gate D, V2 frontend not yet built). This is the compliant interim
           version, accurate to current backend behaviour. -->
      <h2>What you'll get</h2>
      <p>A clear picture of what's working, what's not, and what deserves attention first — one specific place to start, not a generic report.</p>
      <h2 style="margin-top:32px;">Cost</h2>
      <p>Free. No sales call required.</p>
      <div style="margin-top:32px;"><a class="btn btn-primary" href="${HC_URL}">Start the health check</a></div>
    </div>
  </section>
  `,
}));

/* ---- Worked Example (Riverside Fabrication — explicitly fictional) ---- */
w("site/worked-examples/bottleneck-analysis.html", page({
  current: "worked-examples",
  title: "Riverside Fabrication — a worked example",
  description: "See the reasoning in practice. Illustrative and explicitly fictional.",
  path: "/worked-examples/bottleneck-analysis",
  main: `
  <section class="page-hero">
    <div class="shell">
      <div class="eyebrow on-navy">Worked example</div>
      <h1>Riverside Fabrication</h1>
      <div class="we-disclosure" style="margin-top:20px;color:var(--n6-navy);">Illustrative, fictional worked example. Riverside Fabrication is not a real company.</div>
    </div>
  </section>
  <section class="we-beat muted">
    <div class="shell">
      <span class="beat-label">Assumption</span>
      <p style="max-width:56ch;font-size:1.1rem;color:var(--n6-navy);">Press 3 was assumed to be the constraint. It was the loudest, most visibly busy station on the line, and everyone already had a theory about it.</p>
    </div>
  </section>
  <section class="we-beat vivid">
    <div class="shell">
      <span class="beat-label">Finding</span>
      <p style="max-width:56ch;font-size:1.15rem;">It wasn't. The real constraint sat two stations upstream, measured, not guessed, once a week of honest logging was in.</p>
    </div>
  </section>
  <section class="we-beat muted">
    <div class="shell">
      <span class="beat-label">Decision</span>
      <p style="max-width:56ch;font-size:1.1rem;color:var(--n6-navy);">The planned fix on Press 3 was cancelled before it made things worse.</p>
      <span class="we-stamp">Fix cancelled</span>
    </div>
  </section>
  <section class="we-beat" style="background:#fff;">
    <div class="shell">
      <span class="beat-label" style="color:var(--a6-deep);">Result</span>
      <div class="we-metric">180<span class="arrow">→</span>224</div>
      <p style="margin-top:8px;">Units per week.</p>
    </div>
  </section>
  <section class="we-beat we-handoff">
    <div class="shell">
      <h2>The tool that established this</h2>
      <p style="color:var(--n6-pale);max-width:52ch;margin-top:12px;">Bottleneck Analysis Tool. From £99.</p>
      <div style="margin-top:20px;"><a class="btn btn-primary on-light" href="/site/interventions/bottleneck_analysis.html">See the Bottleneck Analysis Tool</a></div>
    </div>
  </section>
  `,
}));

/* ---- Terms (reconciled from existing controlled root terms.html,
   substantive legal text preserved, not rewritten) ---- */
w("site/terms.html", page({
  current: "terms",
  title: "Terms of sale — Opsteady",
  description: "What you're agreeing to when you buy from Opsteady: seller details, delivery, cancellation rights, and the refund policy in full.",
  path: "/terms",
  main: `
  <section class="page-hero">
    <div class="shell">
      <div class="eyebrow on-navy">Terms of sale</div>
      <h1>Terms of sale</h1>
      <p>What you're agreeing to when you buy from Opsteady. Buying is not live yet. This page is published in advance, in full, so it's ready when the store is.</p>
    </div>
  </section>
  <section class="page-section">
    <div class="shell" style="max-width:720px;">
      <h2>1. Who you're buying from</h2>
      <p>Opsteady is a trading name of Optimere Limited, registered in England and Wales, Company No. 17390203.</p>
      <h2>2. Address</h2>
      <p>Registered office: 82A James Carter Road, Mildenhall, IP28 7DE. Opsteady is a single-person operation and does not publish a separate home address; the registered office satisfies the legal requirement without that disclosure.</p>
      <h2>3. Contact</h2>
      <p><a href="mailto:hello@opsteady.co.uk">hello@opsteady.co.uk</a>. Typical response time: within two working days.</p>
      <h2>4. VAT</h2>
      <p>VAT registration status and number (if applicable): to be confirmed before buying opens.</p>
      <h2>5. What you're buying</h2>
      <p>Each intervention is a digital download: an Excel spreadsheet or workbook, plus a written guide, delivered as a PDF. Intervention pages state what's included and the difference between the Essentials and Pro tiers where both exist. Nothing physical is shipped.</p>
      <h2>6. Price</h2>
      <p>All prices shown at checkout are inclusive of VAT where VAT applies. Any payment-processing fee is shown separately before you pay. Nothing is added afterward.</p>
      <h2>7. Delivery</h2>
      <p>Digital delivery only, immediately after payment is confirmed. Your download link is shown on the confirmation page and also sent to the email address you paid with.</p>
      <h2>8. What you need to use it</h2>
      <p>A spreadsheet application that opens .xlsx files (Microsoft Excel or a compatible equivalent) and a PDF reader. Files contain no macros.</p>
      <h2>9. Your right to cancel</h2>
      <p>Under the Consumer Contracts Regulations 2013, you normally have 14 days to cancel a purchase of digital content without giving a reason. Because these products are delivered by immediate download, that right ends once the download begins. See the waiver below.</p>
      <h2>10. Immediate download and the cancellation waiver</h2>
      <p>Before you can pay, you must actively tick a box at checkout: "I want my download straight away, and I understand that means I give up my 14-day right to cancel. Opsteady's own 30-day refund policy still applies." The box is never pre-ticked.</p>
      <h2>11. Refunds</h2>
      <p>Separately from the statutory cancellation right above, and more generous than it: ask within 30 days of purchase and you'll be refunded, no argument, no need to prove anything. Full detail on the <a href="/site/pricing.html">Pricing page</a>.</p>
      <h2>12. Complaints</h2>
      <p>Email <a href="mailto:hello@opsteady.co.uk">hello@opsteady.co.uk</a> with what went wrong. Typical response time: within two working days. There is no complaints department. You'll hear back from the person who runs Opsteady.</p>
      <h2>13. Governing law</h2>
      <p>These terms are governed by the law of England and Wales, and any dispute will be handled in the courts of England and Wales.</p>
      <h2>14. What you can and can't do with what you buy</h2>
      <p>You can use every file inside your own organisation, adapt it to fit your site, and print it. You can't resell it, redistribute it, or share it with another company as if it were theirs to pass on.</p>
      <p style="margin-top:32px;font-size:0.85rem;color:var(--ops-n50);">This page is not legal advice. It states what this site's checkout must contain; the final wording should be checked by a solicitor before selling begins.</p>
      <p style="font-size:0.85rem;color:var(--ops-n50);">Last reviewed: 6 August 2026. Reconciled into the production build 31 August 2026 — substance unchanged.</p>
    </div>
  </section>
  `,
}));

/* ---- Accessibility (reconciled from existing controlled root accessibility.html) ---- */
w("site/accessibility.html", page({
  current: "accessibility",
  title: "Accessibility statement — Opsteady",
  description: "What this site targets, what's already true, and the known gaps, stated honestly.",
  path: "/accessibility",
  main: `
  <section class="page-hero">
    <div class="shell">
      <div class="eyebrow on-navy">Accessibility</div>
      <h1>Accessibility statement</h1>
    </div>
  </section>
  <section class="page-section">
    <div class="shell" style="max-width:720px;">
      <h2>What we target</h2>
      <p>This site is built to meet WCAG 2.2 at Level AA, with body text held to the stricter AAA contrast ratio.</p>
      <h2>Scope</h2>
      <p>This statement covers the main Opsteady website only. The Health Check tool lives on its own subdomain, healthcheck.opsteady.co.uk, with its own codebase, and is not covered by this statement.</p>
      <h2>What's already true</h2>
      <ul>
        <li>A skip link is the first focusable element on every page.</li>
        <li>Every page has a single H1 and proper landmark regions.</li>
        <li>Focus is always visible.</li>
        <li>Motion is disabled site-wide for anyone with <code>prefers-reduced-motion</code> set.</li>
        <li>Language is correctly set to British English.</li>
      </ul>
      <h2>Known issues</h2>
      <p>A full keyboard-only and screen reader pass across every page of this production build has not yet been completed and independently verified. Target: before buying opens.</p>
      <h2>Feedback</h2>
      <p>If any part of this site is hard to use with a keyboard, a screen reader, or any other assistive technology, tell us and we'll fix it. Email <a href="mailto:hello@opsteady.co.uk">hello@opsteady.co.uk</a>.</p>
      <p style="margin-top:24px;font-size:0.85rem;color:var(--ops-n50);">Last reviewed: 7 August 2026. Reconciled into the production build 31 August 2026 — substance unchanged, known-issues list updated to reflect this build.</p>
    </div>
  </section>
  `,
}));

/* ---- 404 ---- */
w("site/404.html", page({
  current: "",
  title: "Page not found — Opsteady",
  description: "This page doesn't exist.",
  path: "/404",
  main: `
  <section class="err-404">
    <div class="shell">
      <div class="eyebrow">404</div>
      <h1>That page doesn't exist.</h1>
      <p style="margin-top:16px;max-width:48ch;">It may have moved. Try the homepage, or run the Health Check to find the right starting point.</p>
      <div style="margin-top:24px;display:flex;gap:20px;flex-wrap:wrap;">
        <a class="btn btn-primary" href="/site/index.html">Go to the homepage</a>
        <a class="btn-text" href="${HC_URL}">Start the health check <span class="arrow">→</span></a>
      </div>
    </div>
  </section>
  `,
}));

console.log("Pricing, Who We Are, Health Check landing, Worked Example, Terms, Accessibility, 404 written.");

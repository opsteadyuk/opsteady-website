"use strict";
const { w, page, HC_URL, photoHero } = require("./build.js");
const { CHECKOUT_NOTICE } = require("./shared.js");

/* ---- Pricing ---- */
w("pricing.html", page({
  current: "pricing",
  title: "Opsteady pricing",
  description: "Straightforward pricing, explained plainly. No hidden costs, no sales call.",
  path: "/pricing",
  main: `
  <section class="page-hero">
    <div class="shell-narrow">
      <div class="eyebrow on-navy">Pricing</div>
      <h1>Straightforward pricing.</h1>
      <p>Every module has its own price, shown on its own page. Most are Pro today, priced by depth and reach: Essentials editions are being added over time, and only shown where they actually exist.</p>
    </div>
  </section>
  <section class="page-section">
    <div class="shell-narrow">
      <h2>What things cost</h2>
      <table class="price-table">
        <thead><tr><th></th><th>Essentials <span class="mono" style="font-weight:400;font-size:0.8rem;">(where available)</span></th><th>Pro</th></tr></thead>
        <tbody>
          <tr><td>Most modules</td><td>£89</td><td>£179</td></tr>
          <tr><td>A smaller number of deeper, cross-cutting modules</td><td>£179</td><td>£349</td></tr>
        </tbody>
      </table>
      <p style="margin-top:14px;"><strong>${CHECKOUT_NOTICE}</strong></p>
      <p style="color:var(--ops-n60);font-size:0.9rem;margin-top:10px;">The price shown is the total price you pay &mdash; no tax is added on top at checkout. Purchases are processed by Lemon Squeezy, our merchant of record, who calculates and remits any tax that applies. See <a href="/terms.html">Terms of sale</a> for full detail.</p>
    </div>
  </section>
  <section class="page-section tint">
    <div class="shell-narrow">
      <h2>A small number of modules at a lower entry price</h2>
      <p>These are available as detailed worked examples, at a lower entry Pro price. Not a discount. Not time-limited.</p>
      <div class="showcase-list">
        <div class="showcase-item"><span>Bottleneck Analysis Tool</span><span class="mono">£99</span></div>
        <div class="showcase-item"><span>Skills Matrix &amp; Cross-Training Planner</span><span class="mono">£179</span></div>
        <div class="showcase-item"><span>SQDC Performance Board Pack</span><span class="mono">£179</span></div>
      </div>
    </div>
  </section>
  <section class="page-section">
    <div class="shell-narrow">
      <h2>Where purchase happens</h2>
      <p>Every module has its own price and buy action, showing only the edition actually available to buy.</p>
      <div style="display:flex;gap:24px;flex-wrap:wrap;margin-top:18px;">
        <a class="btn btn-primary" href="/modules/bottleneck_analysis.html">See a representative example</a>
        <a class="btn-text" href="/modules/index.html">Browse modules <span class="arrow">→</span></a>
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
w("who-we-are.html", page({
  current: "who-we-are",
  title: "Who built Opsteady",
  description: "No name, no team. Operator-led, not consultant-led. Judge it by the work.",
  path: "/who-we-are",
  main: `
  ${photoHero({
    eyebrow: "Who we are",
    h1: "No name on this site. Judge it by the work.",
    sub: "Opsteady is a small operation, run by one person, with no team, no office and no sales function. That's a deliberate choice, not a stage it's trying to grow out of. Nobody will call you.",
    spec: "Updated 2026-09-02, Matt's ruling: this page's hero now carries a real, people-free workshop photograph (hero-who-we-are.jpg) as the current standard for this page, not a temporary placeholder awaiting founder photography. It is deliberately not founder/team photography (no name or face on this site, unchanged — 02_brand/100_BASE_FILE.md D-79) and not stock/generic industrial imagery — a genuine, unposed workshop environment. If founder/team photography is ever sourced, that would be a separate, later decision, not an assumed upgrade path from this one.",
    image: {
      src: "/assets/photography/hero-who-we-are.jpg",
      alt: "An empty workshop production line, powder-coated equipment and overhead part racks, no people visible.",
      width: 1168, height: 784,
      objectPosition: "50% 45%",
      priority: true,
    },
  })}

  <section class="page-section">
    <div class="shell">
      <div class="prose-wide">
        <h2>Where this comes from</h2>
        <p>Opsteady comes from real time spent running manufacturing operations, not from taking improvement theory and turning it into templates. It started on the floor, learning the job before being trusted to change anything, and finding that the standards and SOPs on paper rarely described how the place actually ran on a given shift.</p>
        <p>That gap, between the system on paper and the practice on the floor, is one of the most useful things to look for in an operation. It's why the Health Check reads both, rather than averaging them into one comfortable score.</p>
      </div>
    </div>
  </section>

  <section class="page-section tint">
    <div class="shell">
      <div class="prose-wide">
        <h2>Why deployment matters more than the method</h2>
        <p>A properly run improvement week (disciplined, well-executed, the full standard treatment) can still fully revert within two months if nobody involved understood why they were doing it, only that they were told to. That's not a failure of effort or of the method. It's what happens when improvement is installed rather than understood.</p>
        <p>It's why everything Opsteady builds is designed to transfer capability, not just deliver a one-off result. A tool that only works while someone stands over it isn't a tool: it's a visit.</p>
      </div>
    </div>
  </section>

  <section class="page-section">
    <div class="shell">
      <div class="prose-wide">
        <h2>Why the sequence matters</h2>
        <p>An area can be missing its targets on every measure at once, not from a lack of effort, but because people are doing work that's always been done, without anyone able to say why. The fix usually isn't adding more. It's watching first, removing what doesn't need to be there, agreeing a short standard with the team who'll actually run it, and only then pushing for more.</p>
        <p>Watch before changing. Stabilise before improving. Improve from a base that holds. That's the same logic behind Opsteady's Observe &amp; Learn, Stabilise, Improve, Sustain loop, learned on a real floor, not derived from a textbook.</p>
      </div>
    </div>
  </section>

  <section class="page-section tint">
    <div class="shell">
      <div class="prose-wide">
        <h2>Why trust isn't a soft subject</h2>
        <p>Every module here depends on people being willing to say what's actually happening. Where that willingness has been damaged, because raising something went badly for someone once, no system fixes it by itself, and no amount of asking for openness in a meeting outweighs what people have already seen happen. That's why Opsteady's diagnostics look at how people behave alongside what the systems say, and why nothing here pretends a template can substitute for trust.</p>
      </div>
    </div>
  </section>

  <section class="page-section">
    <div class="shell">
      <div class="prose-wide">
        <h2>Why not a consultant, a course, or a template shop</h2>
        <p>Opsteady is sold as a method, not a personality, and built to work across different sites, sectors and problems. The solutions are different every time; what travels between sites is the order things need doing in, which is exactly what the Health Check exists to establish for yours.</p>
        <p>There's no retainer, no subscription to your own improvement, and no sales call following anything you buy. Opsteady doesn't come to your site, doesn't run your projects, and won't tell you what your culture should be: that's yours to shape, and you know your people. Most of what's here builds on established operational thinking, not reinvented; what Opsteady adds is the deployment judgement: what to do first, what conflicts with what, and what to do when it stalls.</p>
        <div style="margin-top:28px;"><a class="btn btn-primary" href="${HC_URL}">Start the health check</a></div>
      </div>
    </div>
  </section>
  `,
}));

/* ---- Health Check landing (marketing site page; nav "Health Check" itself
   links straight to the external app per the approved nav table — this
   page is the fuller expectation-setting stop other CTAs route through) ---- */
w("health-check.html", page({
  current: "health-check",
  title: "Opsteady Health Check | Know where you stand",
  description: "A short set of questions about how your site runs today. Free, no sales call.",
  path: "/health-check",
  main: `
  ${photoHero({
    eyebrow: "The Health Check",
    h1: "Know where your site actually stands.",
    sub: "A short set of questions about how things run today, not how you'd like them to run.",
    image: {
      src: "/assets/photography/hero-health-check.jpg",
      alt: "A wide view across an operating manufacturing facility, showing rows of machinery, materials on pallets, and workers along the production floor.",
      width: 1168, height: 784,
      objectPosition: "56% 42%",
      priority: true,
    },
  })}
  <section class="page-section">
    <div class="shell-narrow">
      <!-- IMPLEMENTATION DEPENDENT: the frozen Phase 3 "what you'll get" copy (site-at-a-glance,
           several named development areas, first action, what's next, pace guidance) is the
           approved target for this section but must not publish live until report-v2.js's output
           actually delivers it (Gate D, V2 frontend not yet built). This is the compliant interim
           version, accurate to current backend behaviour. -->
      <h2>What you'll get</h2>
      <p>A clear picture of what's working, what's not, and what deserves attention first: one specific place to start, not a generic report.</p>
      <h2 style="margin-top:32px;">Cost</h2>
      <p>Free. No sales call required.</p>
      <div style="margin-top:32px;"><a class="btn btn-primary" href="${HC_URL}">Start the health check</a></div>
    </div>
  </section>
  `,
}));

/* ---- Terms (reconciled from existing controlled root terms.html,
   substantive legal text preserved, not rewritten) ---- */
w("terms.html", page({
  current: "terms",
  title: "Terms of sale | Opsteady",
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
  <section class="page-section full-copy">
    <div class="shell">
      <h2>1. Who you're buying from</h2>
      <p>Opsteady is a trading name of Optimere Limited, registered in England and Wales, Company No. 17390203.</p>
      <h2>2. Address</h2>
      <p>Registered office: 82A James Carter Road, Mildenhall, IP28 7DE. Opsteady is a single-person operation and does not publish a separate home address; the registered office satisfies the legal requirement without that disclosure.</p>
      <h2>3. Contact</h2>
      <p><a href="mailto:hello@opsteady.co.uk">hello@opsteady.co.uk</a>. Typical response time: within two working days.</p>
      <h2>4. VAT</h2>
      <p>Optimere Limited is not VAT-registered. Purchases on this site are sold through Lemon Squeezy, which acts as merchant of record for every sale &mdash; Lemon Squeezy is the legal seller and is responsible for calculating, collecting and remitting any VAT or sales tax that applies to your purchase, wherever you're buying from.</p>
      <h2>5. What you're buying</h2>
      <p>Each module is a digital download: an Excel spreadsheet or workbook, plus a written guide, delivered as a PDF. Module pages state what's included and the difference between the Essentials and Pro tiers where both exist. Nothing physical is shipped.</p>
      <h2>6. Price</h2>
      <p>The price shown on each module's page is the total price you pay &mdash; no tax is added on top at checkout. Purchases are processed by Lemon Squeezy, our merchant of record, who calculates and remits any tax that applies to your purchase; it doesn't change the price you see. Lemon Squeezy's own service fee is paid by us, not added to your total.</p>
      <h2>7. Delivery</h2>
      <p>Digital delivery only, immediately after payment is confirmed. Your download link is shown on the confirmation page and also sent to the email address you paid with.</p>
      <h2>8. What you need to use it</h2>
      <p>A spreadsheet application that opens .xlsx files (Microsoft Excel or a compatible equivalent) and a PDF reader. Files contain no macros.</p>
      <h2>9. Your right to cancel</h2>
      <p>Under the Consumer Contracts Regulations 2013, you normally have 14 days to cancel a purchase of digital content without giving a reason. Because these products are delivered by immediate download, that right ends once the download begins. See the waiver below.</p>
      <h2>10. Immediate download and the cancellation waiver</h2>
      <p>Before you can pay, you must actively tick a box at checkout: "I want my download straight away, and I understand that means I give up my 14-day right to cancel. Opsteady's own 30-day refund policy still applies." The box is never pre-ticked.</p>
      <h2>11. Refunds</h2>
      <p>Separately from the statutory cancellation right above, and more generous than it: ask within 30 days of purchase and you'll be refunded, no argument, no need to prove anything. Full detail on the <a href="/pricing.html">Pricing page</a>.</p>
      <h2>12. Complaints</h2>
      <p>Email <a href="mailto:hello@opsteady.co.uk">hello@opsteady.co.uk</a> with what went wrong. Typical response time: within two working days. There is no complaints department. You'll hear back from the person who runs Opsteady.</p>
      <h2>13. Governing law</h2>
      <p>These terms are governed by the law of England and Wales, and any dispute will be handled in the courts of England and Wales.</p>
      <h2>14. What you can and can't do with what you buy</h2>
      <p>You can use every file inside your own organisation, adapt it to fit your site, and print it. You can't resell it, redistribute it, or share it with another company as if it were theirs to pass on.</p>
      <p style="margin-top:32px;font-size:0.85rem;color:var(--ops-n50);">This page is not legal advice. It states what this site's checkout must contain; the final wording should be checked by a solicitor before selling begins.</p>
      <p style="font-size:0.85rem;color:var(--ops-n50);">Last reviewed: 6 August 2026. Reconciled into the production build 31 August 2026; substance unchanged.</p>
    </div>
  </section>
  `,
}));

/* ---- Accessibility (reconciled from existing controlled root accessibility.html) ---- */
w("accessibility.html", page({
  current: "accessibility",
  title: "Accessibility statement | Opsteady",
  description: "What this site targets, what's already true, and the known gaps, stated honestly.",
  path: "/accessibility",
  main: `
  <section class="page-hero">
    <div class="shell-narrow">
      <div class="eyebrow on-navy">Accessibility</div>
      <h1>Accessibility statement</h1>
    </div>
  </section>
  <section class="page-section">
    <div class="shell-narrow">
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
      <p style="margin-top:24px;font-size:0.85rem;color:var(--ops-n50);">Last reviewed: 7 August 2026. Reconciled into the production build 31 August 2026; substance unchanged, known-issues list updated to reflect this build.</p>
    </div>
  </section>
  `,
}));

/* ---- Privacy notice — new, 2026-09-02. Previously the only privacy.html
   in the whole Opsteady web presence lived in 01_website (the Health
   Check repo), linked from every page here as an external
   healthcheck.opsteady.co.uk URL. Once site/ is promoted to
   opsteady.co.uk's root, every page needs to link to a local version
   instead. Content reused verbatim from 01_website/privacy.html's
   2026-09-02 rewrite (Optimere Limited controller statement, registered
   address, ICO number, hello@opsteady.co.uk throughout, no personal
   name) -- not re-authored here, restyled only, onto this site's real
   page()/photoHero() pattern instead of that page's own bespoke CSS. */
w("privacy.html", page({
  current: "",
  title: "Privacy Notice | Opsteady",
  description: "How Opsteady handles your data. The short version: you can take the Health Check without giving us anything at all.",
  path: "/privacy",
  main: `
  <section class="page-hero">
    <div class="shell">
      <div class="eyebrow on-navy">Privacy Notice</div>
      <h1>How we handle your data</h1>
      <p>Last updated: 2 September 2026</p>
    </div>
  </section>
  <section class="page-section full-copy">
    <div class="shell">
      <h2>Who we are</h2>
      <p>Opsteady is operated by Optimere Limited, registered in England and Wales, trading as Opsteady. Optimere Limited is the data controller for everything described on this page. Registered/service address: Optimere Limited, 82A James Carter Road, Mildenhall, IP28 7DE. ICO registration number: 00015347950. If you want to talk to us about anything on this page, email <a href="mailto:hello@opsteady.co.uk">hello@opsteady.co.uk</a> and a person will answer.</p>
      <h2>The short version</h2>
      <p>You can take the Health Check without giving us anything at all. Your answers stay on your device while you work through it.</p>
      <p>If you ask for your report, your answers and your email address come to us so we can build it and send it. We use them for your report and nothing else, unless you ask us to. We look at overall patterns across everyone who takes the check, because that tells us what to build next. That's patterns, not people.</p>
      <p>If that's all you needed, you can stop reading here. The rest is the detail.</p>
      <h2>What we collect, and when</h2>
      <p><strong>While you take the check: nothing.</strong> The questions and the scoring run inside your browser. Nothing is sent to us, and we cannot see your answers.</p>
      <p><strong>When you request your report,</strong> we receive your answers to the 24 questions and the three context questions, your email address, and the date and time.</p>
      <p><strong>When you visit the site,</strong> we collect basic, anonymous traffic counts through Cloudflare Web Analytics: how many people arrived, roughly where from, and which pages they saw. It does not use cookies and does not build a profile of you.</p>
      <p>We do not ask for your name, your employer, your site's location, or anything else. We have deliberately kept the list this short.</p>
      <h2>Why we use it, and our lawful basis</h2>
      <table class="price-table">
        <thead><tr><th>What for</th><th>Lawful basis</th></tr></thead>
        <tbody>
          <tr><td>Building and sending the report you asked for</td><td>Legitimate interests: you asked us for it, and we cannot send it without it</td></tr>
          <tr><td>Letting you re-run the check and compare against last time</td><td>Legitimate interests: it is the point of the tool, and it is your own data returned to you</td></tr>
          <tr><td>Understanding which areas score weakest across everyone, so we know what to build</td><td>Legitimate interests: aggregated, and no individual is identified in it</td></tr>
          <tr><td>Understanding whether people who receive a report go on to buy, by matching email addresses against our sales records</td><td>Legitimate interests: it is how we know whether any of this works. Told to you plainly here rather than done quietly</td></tr>
          <tr><td>Anything else, including sending you things you did not ask for</td><td>Consent, which we would have to ask for first</td></tr>
        </tbody>
      </table>
      <h2>Who else sees it</h2>
      <p>We use a small number of suppliers to run the service. They process data on our instructions and cannot use it for their own purposes.</p>
      <ul>
        <li><strong>Cloudflare</strong> hosts the site, stores the records, and provides anonymous traffic counts</li>
        <li><strong>Resend</strong> sends your report email</li>
        <li><strong>Gumroad</strong> handles any purchase you choose to make, and holds your details as part of that</li>
      </ul>
      <p>Some of these suppliers operate outside the UK. Where data moves abroad it is protected by the safeguards UK data protection law requires.</p>
      <p>We do not sell your data. We do not share it with anyone for marketing. There is no advertising on this site and there never will be.</p>
      <h2>How long we keep it</h2>
      <ul>
        <li>Health Check records: three years, so re-runs still work and long-term patterns are visible. Then deleted.</li>
        <li>Your email address, if you have not asked for anything else: three years alongside your record.</li>
        <li>Anonymous traffic counts: as retained by Cloudflare, and they identify nobody.</li>
      </ul>
      <p>If you ask us to delete you, we do it, and we do not keep a copy.</p>
      <h2>Your rights</h2>
      <p>You can ask us to show you what we hold, correct it, delete it, restrict what we do with it, or send it to you in a portable format. You can object to us relying on legitimate interests. Email <a href="mailto:hello@opsteady.co.uk">hello@opsteady.co.uk</a> and we will deal with it within one month. It costs you nothing.</p>
      <p>If you think we have handled your data badly, tell us first and we will try to fix it. You also have the right to complain to the Information Commissioner's Office at <a href="https://ico.org.uk" rel="noopener">ico.org.uk</a>.</p>
      <h2>Cookies</h2>
      <p>We do not use tracking cookies or advertising cookies. The site stores your progress on your own device so you do not lose your answers halfway through, and that never leaves your device.</p>
      <h2>Changes</h2>
      <p>If we change how any of this works, we will change this page and update the date at the top. If the change is significant and we hold your email address, we will tell you.</p>
    </div>
  </section>
  `,
}));

/* ---- 404 ---- */
w("404.html", page({
  current: "",
  title: "Page not found | Opsteady",
  description: "This page doesn't exist.",
  path: "/404",
  main: `
  <section class="err-404">
    <div class="shell">
      <div class="eyebrow">404</div>
      <h1>That page doesn't exist.</h1>
      <p style="margin-top:16px;max-width:48ch;">It may have moved. Try the homepage, or run the Health Check to find the right starting point.</p>
      <div style="margin-top:24px;display:flex;gap:20px;flex-wrap:wrap;">
        <a class="btn btn-primary" href="/index.html">Go to the homepage</a>
        <a class="btn-text" href="${HC_URL}">Start the health check <span class="arrow">→</span></a>
      </div>
    </div>
  </section>
  `,
}));

console.log("Pricing, Who We Are, Health Check landing, Privacy, Terms, Accessibility, 404 written. Worked Example removed 2026-09-02, see _history/PROJECT_STATE.md.");

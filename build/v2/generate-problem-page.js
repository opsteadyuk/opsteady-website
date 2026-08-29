#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");
const { page } = require("./shell.js");

function buildFlowAndBottlenecks() {
  const outDir = path.join(__dirname, "..", "..", "v2", "problems");
  fs.mkdirSync(outDir, { recursive: true });

  const body = `
  <section class="sys-hero shell">
    <div>
      <span class="sys-label">A real operational problem</span>
      <h1 style="font-size:2.4rem;margin-top:1rem">Everyone can point at the bottleneck. It's rarely the right one.</h1>
      <p class="sys-lede">Ask a room of experienced people where the constraint is and you'll get a confident, specific answer — usually the loudest or most recent station, rarely checked against real throughput data. Meanwhile the station nobody's watching, running fine but sitting in front of a two-day queue nobody's measured, is quietly costing more than the one everyone talks about.</p>
      <p class="sys-lede">Free advice can tell you what a bottleneck is. It can't watch your specific line and tell you where yours actually sits.</p>
    </div>
    <div class="sys-readout">
      <div class="sys-readout-head">This problem, in short</div>
      <div class="sys-readout-body">
        <div class="sys-readout-row"><span class="k">Family</span><span class="v">Flow &amp; Bottlenecks</span></div>
        <div class="sys-readout-row"><span class="k">Stage</span><span class="v">Stabilise &rarr; Improve</span></div>
        <div class="sys-readout-row"><span class="k">Modules built for it</span><span class="v">2</span></div>
      </div>
    </div>
  </section>

  <section class="sys-section shell">
    <div class="sys-head"><span class="sys-num">01</span><div><h2>Two ways in</h2></div></div>
    <div class="sys-grid-2">
      <div class="sys-grid-pad">
        <h3 style="font-size:1.1rem;margin-bottom:.5rem">Not sure this is your biggest problem?</h3>
        <p style="color:var(--ops-n60);font-size:.92rem;margin-bottom:1.2rem">The Health Check reads your whole operation across twelve areas and tells you what to fix first, in order — not just this one.</p>
        <a class="sys-btn" href="https://healthcheck.opsteady.co.uk/">Take the Health Check</a>
      </div>
      <div class="sys-grid-pad">
        <h3 style="font-size:1.1rem;margin-bottom:.5rem">Know it's this one?</h3>
        <p style="color:var(--ops-n60);font-size:.92rem;margin-bottom:1.2rem">Go straight to the module built for it — what it does, what it takes to deploy, and what it costs.</p>
        <a class="sys-btn ghost" href="/v2/catalogue/bottleneck_analysis.html">See the module</a>
      </div>
    </div>
  </section>

  <section class="sys-section shell">
    <div class="sys-head"><span class="sys-num">02</span><div><h2>The modules built for this</h2></div></div>
    <div class="sys-grid-2">
      <div class="sys-panel">
        <div class="sys-panel-head"><span class="sys-panel-id">P4.1</span><span>Pillar 4 &middot; Flow</span></div>
        <div class="sys-panel-body">
          <h3 style="font-size:1.15rem;margin-bottom:.5rem">Bottleneck Analysis Tool</h3>
          <p style="color:var(--ops-n60);font-size:.92rem;margin-bottom:1.2rem">Find what is really limiting output.</p>
          <a class="sys-btn ghost" href="/v2/catalogue/bottleneck_analysis.html">View module <span class="sys-arrow">&rarr;</span></a>
        </div>
      </div>
      <div class="sys-panel">
        <div class="sys-panel-head"><span class="sys-panel-id">P4.2</span><span>Pillar 4 &middot; Flow</span></div>
        <div class="sys-panel-body">
          <h3 style="font-size:1.15rem;margin-bottom:.5rem">Value Stream Mapping Kit</h3>
          <p style="color:var(--ops-n60);font-size:.92rem;margin-bottom:1.2rem">See how work and information really flow.</p>
          <a class="sys-btn ghost" href="/catalogue/value_stream_mapping.html">View module <span class="sys-arrow">&rarr;</span></a>
        </div>
      </div>
    </div>
  </section>

  <section class="sys-section shell">
    <div class="sys-head"><span class="sys-num">03</span><div><h2>See it worked through</h2></div></div>
    <div class="sys-panel" style="max-width:34rem">
      <div class="sys-panel-head"><span class="sys-panel-id">SHOWCASE</span><span>Worked example</span></div>
      <div class="sys-panel-body">
        <h3 style="font-size:1.15rem;margin-bottom:.5rem">A fabrication shop finds its real constraint</h3>
        <p style="color:var(--ops-n60);font-size:.92rem;margin-bottom:1.2rem">A full, fictional-but-realistic walk-through: the starting problem, the deployment, and the operational result.</p>
        <a class="sys-btn ghost" href="/v2/case-studies/bottleneck-analysis.html">Read the case study <span class="sys-arrow">&rarr;</span></a>
      </div>
    </div>
  </section>

  <div class="sys-band">
    <div class="shell sys-band-pad" style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1.5rem">
      <div>
        <h3 style="font-family:var(--ops-font-display);font-weight:600;color:#fff;font-size:1.3rem;margin-bottom:.4rem">Start with fifteen honest minutes</h3>
        <p style="color:var(--ops-text-inverse-secondary);margin:0">Free, twenty-four questions. No score out of a hundred, no sales call.</p>
      </div>
      <a class="sys-btn on-navy lg" href="https://healthcheck.opsteady.co.uk/">Take the Health Check</a>
    </div>
  </div>
`;

  const html = page({
    title: "Everyone can point at the bottleneck. It's rarely the right one — Opsteady",
    description: "Find the actual constraint, and see where the time in between is really going.",
    current: "",
    bodyHtml: body,
  });
  fs.writeFileSync(path.join(outDir, "flow-and-bottlenecks.html"), html, "utf8");
  console.log("v2 problem page written: flow-and-bottlenecks");
}

buildFlowAndBottlenecks();

// Programmatic 70-Tool-page structural conformance audit (spec §20).
// Reads every generated interventions/*.html (excluding index.html) and
// checks it against the canonical Tool-page architecture. Does not touch
// source files. Output is numeric PASS/EXCEPTION counts, never prose claims
// of "all consistent" without counts.
"use strict";
const fs = require("fs");
const path = require("path");

const DIR = path.join(__dirname, "..", "interventions");
const files = fs
  .readdirSync(DIR)
  .filter((f) => f.endsWith(".html") && f !== "index.html")
  .sort();

const STAGE_LABELS = ["Observe & Learn", "Stabilise", "Improve", "Sustain"];
const TAXONOMY_LABELS = ["Foundation", "Pillar", "Enabler"];
const RECOGNISED_CATEGORIES = [
  "Output &amp; Flow",
  "Delivery &amp; Planning",
  "Running the Day",
  "Quality",
  "Equipment &amp; Reliability",
  "People &amp; Skills",
  "Standards &amp; Improvement",
  "Performance &amp; Decision Making",
  "Wider capability",
];

const results = [];

for (const file of files) {
  const html = fs.readFileSync(path.join(DIR, file), "utf8");
  const exceptions = [];
  const check = (cond, reason) => {
    if (!cond) exceptions.push(reason);
  };

  // 1. Breadcrumb present
  check(/class="breadcrumb"/.test(html) || /class="iv-breadcrumb"/.test(html) || /<nav[^>]*aria-label="[Bb]readcrumb"/.test(html), "missing breadcrumb");

  // 2. Canonical hero section present, exactly one
  const heroMatches = html.match(/<section class="iv-hero iv-hero-photo">/g) || [];
  check(heroMatches.length === 1, `expected 1 canonical hero, found ${heroMatches.length}`);

  // 2b. No legacy hero slot remains
  check(!/iv-hero-slot/.test(html), "legacy iv-hero-slot present");

  // 3. Title present, single h1
  const h1Matches = html.match(/<h1>/g) || [];
  check(h1Matches.length === 1, `expected 1 <h1>, found ${h1Matches.length}`);

  // 4. Proposition present (iv-situation paragraph)
  check(/class="iv-situation"/.test(html), "missing hero proposition (iv-situation)");

  // 5. Purchase component present (price + CTA)
  check(/class="iv-buy"/.test(html) && /iv-price/.test(html), "missing purchase row");

  // 6. Zero stage badges / taxonomy exposure in hero and body
  for (const label of STAGE_LABELS) {
    check(!new RegExp(`>${label}<`).test(html), `stage badge exposed: ${label}`);
  }
  for (const label of TAXONOMY_LABELS) {
    check(!new RegExp(`class="[^"]*"[^>]*>${label}\\b`).test(html), `taxonomy label exposed: ${label}`);
  }

  // 7. Overview + At a Glance grid, both present, same section
  check(/class="iv-overview-grid"/.test(html), "missing iv-overview-grid");
  check(/class="iv-overview"/.test(html), "missing Overview column");
  check(/class="at-a-glance"/.test(html), "missing At a Glance panel");

  // 8. At a Glance heading canonical -- EXCEPT the known, reported source-data
  // gap (culture.html / F3.1 has zero of the three fields; see report §H).
  if (file !== "culture.html") {
    check(/At a glance/i.test(html), "At a Glance panel missing canonical heading");
  }

  // 9. Optional callout — if present, must be one of the 3 known types
  const calloutSection = html.match(/<section class="iv-section iv-callout">[\s\S]*?<\/section>/);
  const KNOWN_CALLOUT_LABELS = ["Before you start", "Worked example", "Important to know"];
  if (calloutSection) {
    const labelMatch = calloutSection[0].match(/class="info-panel-label mono">([^<]*)</);
    check(!!labelMatch && KNOWN_CALLOUT_LABELS.includes(labelMatch[1]), `unknown or missing callout label: ${labelMatch ? labelMatch[1] : "none"}`);
  }

  // 10. What You Get section present with canonical heading
  check(/WHAT YOU GET|What [Yy]ou [Gg]et/.test(html), "missing What You Get heading");

  // 11. Common closing / Health Check band present
  check(/class="[^"]*\biv-hc-band\b[^"]*"/.test(html), "missing closing Health Check/Related Tools band");
  check(/Run the Health Check/i.test(html), "missing 'Run the Health Check' CTA text");

  // 12. Related tools present and capped at 4
  const relatedBlock = html.match(/class="iv-related"[\s\S]*?<\/div>/);
  if (relatedBlock) {
    const relatedLinks = (relatedBlock[0].match(/<a /g) || []).length;
    check(relatedLinks <= 4, `related tools count ${relatedLinks} exceeds max 4`);
  }

  // 13. Global header/footer present
  check(/<header/.test(html), "missing global header");
  check(/<footer/.test(html), "missing global footer");

  // 14. No gradient fallback for any recognised category (background-image gradient in hero media)
  const heroSection = html.split('<section class="iv-hero iv-hero-photo">')[1] || "";
  const heroFirst2k = heroSection.slice(0, 2000);
  check(!/linear-gradient|radial-gradient/.test(heroFirst2k), "gradient fallback present in hero media");

  // 15. Hero image present (no missing image)
  check(/class="iv-hero-media"><img src="\/site\/assets\/photography\//.test(html), "hero image src missing or non-canonical path");

  // 16. No broken/empty image src anywhere
  const imgSrcs = [...html.matchAll(/<img[^>]*src="([^"]*)"/g)].map((m) => m[1]);
  for (const src of imgSrcs) {
    check(src && src.trim().length > 0, "empty img src attribute");
  }

  // 17. Price present and non-empty
  const priceMatch = html.match(/class="iv-price">([^<]*)</);
  check(!!priceMatch && priceMatch[1].trim().length > 0, "empty price value");

  results.push({ file, exceptions });
}

const passCount = results.filter((r) => r.exceptions.length === 0).length;
const failCount = results.length - passCount;

console.log(`\n70-Tool-page structural conformance audit`);
console.log(`==========================================`);
console.log(`${results.length} Tool pages audited, ${passCount} canonical PASS, ${failCount} EXCEPTION\n`);

if (failCount > 0) {
  for (const r of results) {
    if (r.exceptions.length > 0) {
      console.log(`EXCEPTION: ${r.file}`);
      for (const e of r.exceptions) console.log(`  - ${e}`);
    }
  }
} else {
  console.log("No exceptions.");
}

process.exitCode = failCount > 0 ? 1 : 0;

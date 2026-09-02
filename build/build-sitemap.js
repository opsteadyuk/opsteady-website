"use strict";
const fs = require("fs");
const path = require("path");
const { getCatalogueListing } = require("./build.js");

const SITE = path.resolve(__dirname, "..");
const BASE = "https://opsteady.co.uk";

const staticRoutes = [
  "/", "/the-method", "/interventions", "/pricing", "/who-we-are",
  "/health-check", "/terms", "/accessibility", "/privacy",
];

const listing = getCatalogueListing();
const routes = [
  ...staticRoutes,
  ...listing.map((m) => `/interventions/${m.slug}`),
];

const urlset = routes.map((r) => `  <url><loc>${BASE}${r === "/" ? "" : r}</loc></url>`).join("\n");
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlset}\n</urlset>\n`;
fs.writeFileSync(path.join(SITE, "sitemap.xml"), xml, "utf8");

const redirects = `# /catalogue -> /interventions (301, permanent)
/catalogue              /interventions/index.html   301
/catalogue/:slug        /interventions/:slug.html   301
# /interest legacy ?m= redirect map re-pointed at /interventions (already
# verified against all 36 legacy slugs in 01_website/worker/src/v2.js;
# destination path renamed only, per the approved architecture)
/interest.html          /interventions/index.html   301
# /case-studies -> the Worked Example page was removed 2026-09-02 (see
# PROJECT_STATE.md); repointed at the real Tool page instead of a
# 301 chain into a 404.
/case-studies           /interventions/bottleneck_analysis.html  301
/case-studies/:slug     /interventions/bottleneck_analysis.html 301
# /worked-examples -> same reasoning, in case anything external still
# links to the removed page directly.
/worked-examples/*      /interventions/bottleneck_analysis.html 301
`;
fs.writeFileSync(path.join(SITE, "redirects.txt"), redirects, "utf8");

console.log(`sitemap.xml written — ${routes.length} routes.`);
console.log("redirects.txt written.");

"use strict";
const fs = require("fs");
const path = require("path");
const { getCatalogueListing } = require("./build.js");

const SITE = path.resolve(__dirname, "..");
const BASE = "https://opsteady.co.uk";

const staticRoutes = [
  "/", "/the-method", "/interventions", "/pricing", "/who-we-are",
  "/health-check", "/worked-examples/bottleneck-analysis", "/terms", "/accessibility", "/privacy",
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
# /case-studies -> /worked-examples (this task's rename, §A/§K)
/case-studies           /worked-examples/bottleneck-analysis.html  301
/case-studies/:slug     /worked-examples/:slug.html 301
`;
fs.writeFileSync(path.join(SITE, "redirects.txt"), redirects, "utf8");

console.log(`sitemap.xml written — ${routes.length} routes.`);
console.log("redirects.txt written.");

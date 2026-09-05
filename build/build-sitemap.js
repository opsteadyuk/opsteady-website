"use strict";
const fs = require("fs");
const path = require("path");
const { getCatalogueListing } = require("./build.js");

const SITE = path.resolve(__dirname, "..");
const BASE = "https://opsteady.co.uk";

const staticRoutes = [
  "/", "/the-method", "/modules", "/pricing", "/who-we-are",
  "/health-check", "/terms", "/accessibility", "/privacy",
];

const listing = getCatalogueListing();
const routes = [
  ...staticRoutes,
  ...listing.map((m) => `/modules/${m.slug}`),
];

const urlset = routes.map((r) => `  <url><loc>${BASE}${r === "/" ? "" : r}</loc></url>`).join("\n");
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlset}\n</urlset>\n`;
fs.writeFileSync(path.join(SITE, "sitemap.xml"), xml, "utf8");

// ---------------------------------------------------------------------------
// THE REDIRECT LAYER.
//
// WRITTEN AS `_redirects`, WHICH IS THE FILENAME CLOUDFLARE ACTUALLY READS.
// This file previously emitted `redirects.txt`, which nothing has ever read:
// wrangler.toml declares only [assets] directory/not_found_handling, there is
// no redirect configuration, and `redirects.txt` is not a name the static-asset
// handler looks for. VERIFIED BY DIRECT FETCH 2026-09-05, not inferred from the
// filename: https://opsteady.co.uk/catalogue -> 404, and
// https://opsteady.co.uk/interest.html -> 404. So the FIRST rename's redirects
// were never in force, and anyone holding a /catalogue link gets nothing.
//
// FIRST MATCH WINS, so specific rules precede splats.
//
// EVERY TARGET IS THE FINAL DESTINATION. Nothing chains through
// /interventions/, because a chain through a path that is itself being retired
// is how a redirect layer rots — and because the /catalogue rules would
// otherwise point at a 301 that points at a 301.
const redirects = `# Opsteady redirects. Cloudflare reads THIS file (_redirects); it has never
# read redirects.txt, which is retired as of 2026-09-05.

# --- 2026-09-05 rename: /interventions/ -> /modules/ ------------------------
# TIDINESS, NOT CORRECTNESS. Cloudflare canonicalises .html to the extensionless
# form with its own 307, PROVED by the probe publication: a control touching no
# rule of ours still took a hop. So without the line below, an indexed
# /interventions/foo.html lands via 301 then 307 - two hops, which harms neither
# users nor indexing. The line removes an asymmetry in the table rather than a
# defect on the site.
#
# UNVERIFIED WHEN WRITTEN, AND IT FAILS SAFE. Cloudflare placeholders match a
# whole path segment, so ":slug.html" may not parse as "capture the part before
# .html". If it does not match, the splat below catches it and the behaviour is
# exactly what it would have been anyway. Verify which of the two actually fired
# rather than reporting the splat's result as this rule's.
/interventions/:slug.html  /modules/:slug               301
# The splat preserves whatever form was indexed, with or without .html, so the
# 70 module pages and the index that have been live since 2 September all land.
/interventions/*        /modules/:splat                 301
/interventions          /modules/                       301

# --- dead since the site/ -> root promotion (02_main_site 86acb52) ----------
# The Health Check nav linked at /site/interventions/index.html and has been
# returning 404 since that promotion. Verified 404 live 2026-09-05.
#
# ORDER IS LOAD-BEARING HERE. The two specific /site/interventions rules sit
# ABOVE the general /site/* rule so they win: first match wins, and _redirects
# rules are applied once per request rather than chained. Without them,
# /site/interventions/index.html would match /site/* -> /interventions/index.html
# and then need a SECOND request to reach /modules/index.html. Two hops where one
# will do, on a path that is already broken.
/site/interventions/*   /modules/:splat                 301
/site/interventions     /modules/                       301
#
# The general rule, carried forward from the probe publication unchanged. It is
# repeated here deliberately: this file is generated, so anything the probe
# established and this generator does not emit would be silently removed by the
# rename push.
/site/*                 /:splat                         301

# --- /catalogue: the FIRST rename, whose redirects never worked -------------
# Pointed STRAIGHT at /modules/, never chained through /interventions/.
/catalogue              /modules/                       301
/catalogue/:slug        /modules/:slug                  301

# --- legacy interest page --------------------------------------------------
/interest.html          /modules/                       301
/interest               /modules/                       301

# --- worked-example pages removed 2026-09-02 (see PROJECT_STATE.md) --------
# Repointed at the real module page rather than a 301 chain into a 404.
/case-studies           /modules/bottleneck_analysis    301
/case-studies/:slug     /modules/bottleneck_analysis    301
/worked-examples/*      /modules/bottleneck_analysis    301
`;
fs.writeFileSync(path.join(SITE, "_redirects"), redirects, "utf8");

// redirects.txt is RETIRED, not left lying around: CLAUDE.md's standing rule is
// that a superseded output location is deleted at the point of replacement,
// because a stale file is exactly what produces a confident wrong finding later.
// This one is worse than stale — it documented a redirect layer that did not
// exist, which is how the first rename's breakage went unnoticed.
const stale = path.join(SITE, "redirects.txt");
if (fs.existsSync(stale)) { fs.unlinkSync(stale); console.log("redirects.txt removed (retired — never read by anything)."); }

console.log(`sitemap.xml written — ${routes.length} routes.`);
console.log("_redirects written.");

"use strict";
const fs = require("fs");
const path = require("path");
const { getCatalogueListing } = require("./build.js");

const SITE = path.resolve(__dirname, "..");
const BASE = "https://opsteady.co.uk";

const staticRoutes = [
  "/", "/the-method", "/modules", "/who-we-are",
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
# An "/interventions/:slug.html -> /modules/:slug" line was added here and then
# REMOVED, because it could never fire: Cloudflare placeholders match a WHOLE
# PATH SEGMENT, so ":slug.html" does not parse as "capture the part before
# .html". Measured on the live site: /interventions/hse_system.html returned
# 301 -> /modules/hse_system.html, with the extension PRESERVED, which is the
# splat's behaviour and not the placeholder's. A rule that looks like it does
# something is worse than no rule, so it is gone rather than left inert.
#
# The two hops that line was meant to save are Cloudflare's own .html-to-
# extensionless 307, not ours. A control touching no rule of ours takes that hop
# too. It harms neither users nor indexing.
#
# The splat preserves whatever form was indexed, with or without .html, so the
# 70 module pages and the index that have been live since 2 September all land.
/interventions/*        /modules/:splat                 301
/interventions          /modules/                       301

# --- dead since the site/ -> root promotion (02_main_site 86acb52) ----------
# The Health Check nav linked at /site/interventions/index.html and has been
# returning 404 since that promotion. Verified 404 live 2026-09-05.
#
# THE ORDERING CLAIM THAT USED TO SIT HERE WAS WRONG, AND IS CORRECTED RATHER
# THAN QUIETLY DROPPED. It said the two specific /site/interventions rules sit
# above /site/* "so they win". THEY DO NOT WIN. Measured on the live site:
#   /site/interventions/index.html  ->  /interventions/index.html   (301)
#                                   ->  /modules/index.html         (301)
#                                   ->  /modules/                   (307)
# three hops, so /site/* matched FIRST despite being written below them.
#
# THE BEHAVIOUR IS LEFT EXACTLY AS IT IS. It lands correctly at 200, three hops
# on a path that has been dead for days is nobody's problem, and the two specific
# rules are harmless. What is corrected is the CLAIM: do not read this block as
# evidence that ordering here works the way the comment used to assert, and do
# not build anything on top of that assumption.
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

# --- /pricing removed 2026-09-10, Matt's ruling -----------------------------
# The page is gone from the generator, so it is gone from the site. It was
# CANONICAL AND INDEXED (it sat in the sitemap above until this same change)
# and linked from the footer of EVERY page, so it has inbound links that
# outlive it. Deleting it without these two lines turns every one of them
# into a 404 -- which is the defect this change was made to remove, not one
# to create on the way out.
#
# BOTH FORMS ARE REDIRECTED, deliberately. /pricing is what the sitemap
# published and what a search result carries; /pricing.html is what the
# footer link actually pointed at on every page, so it is the form a crawler
# has followed most.
#
# TARGET IS /modules/, NOT /modules/index.html, WHICH IS WHAT NEXT.md ASKED
# FOR. This file's own MEASURED note above records that /modules/index.html
# takes a further 307 to /modules/, so naming it here would build in the
# second hop that this file's governing rule -- "EVERY TARGET IS THE FINAL
# DESTINATION" -- exists to prevent. One word to change back if that reading
# is wrong.
/pricing                /modules/                       301
/pricing.html           /modules/                       301

# --- worked-example pages removed 2026-09-02 (see _history/PROJECT_STATE.md) --------
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

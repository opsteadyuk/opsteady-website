#!/usr/bin/env node
/* Static link-integrity check: every local href/src in every generated
 * .html file must resolve to a real file on disk. External/mailto/tel
 * links and query-string-only anchors are skipped. This is a code-level
 * check, not a live-browser test. */
"use strict";
const fs = require("fs");
const path = require("path");
const SITE_ROOT = path.resolve(__dirname, "..");

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "build" || entry.name === "fonts" || entry.name === "og" || entry.name === ".git") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith(".html")) out.push(full);
  }
}

const files = [];
walk(SITE_ROOT, files);

let totalLinks = 0;
let broken = [];

for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  const re = /(?:href|src)="([^"]+)"/g;
  let m;
  while ((m = re.exec(text))) {
    let href = m[1];
    if (/^(https?:|mailto:|tel:|#|javascript:)/.test(href)) continue;
    totalLinks++;
    let clean = href.split("#")[0].split("?")[0];
    if (!clean) continue; // pure fragment/query, same page
    let target;
    if (clean.startsWith("/")) target = path.join(SITE_ROOT, clean);
    else target = path.join(path.dirname(file), clean);
    if (!fs.existsSync(target)) {
      broken.push({ file: path.relative(SITE_ROOT, file), href });
    }
  }
}

console.log("Checked", files.length, "HTML files,", totalLinks, "local links.");
if (broken.length) {
  console.log("BROKEN LINKS:", broken.length);
  for (const b of broken) console.log(" -", b.file, "->", b.href);
  process.exitCode = 1;
} else {
  console.log("No broken local links found.");
}

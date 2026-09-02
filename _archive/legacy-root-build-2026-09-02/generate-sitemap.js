#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");
const SITE_ROOT = path.resolve(__dirname, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, "catalogue-manifest.json"), "utf8"));

const staticPages = [
  "", "the-method.html", "catalogue.html", "pricing.html", "who-we-are.html",
  "sitemap.html", "terms.html", "accessibility.html", "privacy.html",
];
const problemSlugs = [
  "lost-output-and-downtime", "on-time-delivery-and-plan-reliability", "flow-and-bottlenecks",
  "running-the-day", "consistent-work-and-capability", "recurring-problems-and-quality-escapes",
];
const caseStudySlugs = ["bottleneck-analysis", "skills-matrix", "sqdc-performance-board"];

const urls = [];
for (const p of staticPages) {
  if (p === "privacy.html" && !fs.existsSync(path.join(SITE_ROOT, p))) continue;
  urls.push(`https://opsteady.co.uk/${p}`);
}
for (const m of manifest) urls.push(`https://opsteady.co.uk/catalogue/${m.slug}.html`);
for (const s of problemSlugs) urls.push(`https://opsteady.co.uk/problems/${s}.html`);
for (const s of caseStudySlugs) urls.push(`https://opsteady.co.uk/case-studies/${s}.html`);

const today = "2026-08-29";
const body = urls
  .map((u) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`)
  .join("\n");
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
fs.writeFileSync(path.join(SITE_ROOT, "sitemap.xml"), xml, "utf8");
console.log("sitemap.xml:", urls.length, "URLs");

const robots = `User-agent: *
Allow: /
Disallow: /interest.html

Sitemap: https://opsteady.co.uk/sitemap.xml
`;
fs.writeFileSync(path.join(SITE_ROOT, "robots.txt"), robots, "utf8");
console.log("robots.txt written");

"use strict";
/* Shared chrome (nav/footer) + head boilerplate, identical on every page.
   Primary nav per the Phase 2 architecture ruling (superseding the earlier
   Site Structure doc §B.2 nav table): Health Check · Tools · How It Works ·
   Who We Are. Problems and Pricing are deliberately NOT in primary nav.
   Customer-facing label for /interventions/... is "Tools" — the URL path
   and internal "intervention(s)" terminology are unchanged (no URL churn). */

const HC_URL = "https://healthcheck.opsteady.co.uk/";

function head({ title, description, path, ogImage }) {
  return `<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="https://opsteady.co.uk${path}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:type" content="website">
<link rel="preload" href="/fonts/space-grotesk.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/source-sans-3-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/tokens.css">
<link rel="stylesheet" href="/site/system.css">`;
}

function nav(current) {
  const items = [
    { label: "Health Check", href: HC_URL, key: "health-check" },
    { label: "Tools", href: "/site/interventions/index.html", key: "interventions" },
    { label: "How It Works", href: "/site/the-method.html", key: "how-it-works" },
    { label: "Who We Are", href: "/site/who-we-are.html", key: "who-we-are" },
  ];
  const links = items
    .map((i) => `<a href="${i.href}"${i.key === current ? ' aria-current="page"' : ""}>${i.label}</a>`)
    .join("\n      ");
  return `<header class="nav">
  <div class="shell nav-inner">
    <a href="/site/index.html" aria-label="Opsteady, home">
      <img class="brand-logo" src="/brand/opsteady-logo-on-navy.svg" alt="Opsteady">
    </a>
    <nav class="nav-links" aria-label="Primary">
      ${links}
    </nav>
    <a class="nav-cta" href="${HC_URL}">Start Health Check</a>
  </div>
</header>`;
}

function footer() {
  return `<footer class="footer">
  <div class="shell">
    <div class="footer-links">
      <a href="/site/interventions/index.html">Tools</a>
      <a href="/site/the-method.html">The Method</a>
      <a href="/site/problems/index.html">Problems</a>
      <a href="/site/worked-examples/bottleneck-analysis.html">Worked Example</a>
      <a href="/site/pricing.html">Pricing</a>
      <a href="/site/who-we-are.html">Who We Are</a>
      <a href="/site/accessibility.html">Accessibility</a>
      <a href="/site/terms.html">Terms</a>
      <a href="https://healthcheck.opsteady.co.uk/privacy.html">Privacy</a>
      <a href="${HC_URL}">Health Check</a>
    </div>
    <div class="footer-legal">Opsteady is a trading name of Optimere Limited, registered in England and Wales, Company No. 17390203.</div>
    <div class="footer-meta">OPSTEADY 2.0 — PRODUCTION BUILD (site/) · PENDING PROMOTION TO ROOT · PENDING DEPLOYMENT RULING</div>
  </div>
</footer>`;
}

function page({ current, title, description, path, bodyClass = "v6", main }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
${head({ title, description, path })}
</head>
<body class="${bodyClass}">
<a class="skip-link" href="#main">Skip to main content</a>
${nav(current)}
<main id="main">
${main}
</main>
${footer()}
</body>
</html>
`;
}

module.exports = { head, nav, footer, page, HC_URL };

"use strict";
/* Shared nav/footer shell for the Opsteady 2.0 checkpoint prototype pages. */

function brandMark() {
  return `<svg viewBox="0 0 120 36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M2 18 L8 6 L14 28 L20 10 L26 24 L32 14 L38 21 L44 16 L50 19.5 L56 18 L118 18" fill="none" stroke="var(--ops-navy)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="56" cy="18" r="4.2" fill="#D08F25"/>
  </svg>`;
}

function nav(current) {
  const items = [
    { href: "/v2/", label: "Home", key: "home" },
    { href: "/v2/catalogue.html", label: "Catalogue", key: "catalogue" },
    { href: "/the-method.html", label: "The Method", key: "method" },
    { href: "/pricing.html", label: "Pricing", key: "pricing" },
    { href: "/who-we-are.html", label: "Who We Are", key: "who" },
  ];
  const links = items
    .map((i) => `<a href="${i.href}"${i.key === current ? ' class="current"' : ""}>${i.label}</a>`)
    .join("\n      ");
  return `<header class="sys-nav">
  <div class="sys-nav-inner">
    <a class="sys-brand" href="/v2/">${brandMark()}<span class="sys-brand-word">Opsteady</span></a>
    <nav class="sys-nav-links" aria-label="Primary">
      ${links}
    </nav>
    <a class="sys-nav-cta" href="https://healthcheck.opsteady.co.uk/">Run Diagnostic</a>
  </div>
</header>`;
}

function footer() {
  return `<footer class="sys-footer">
  <div class="sys-footer-inner">
    <div>
      <h3>Opsteady</h3>
      <p style="color:var(--ops-n70);font-size:.92rem;max-width:26rem">Practical tools and know-how to run a great operation. Built so you can do it in-house.</p>
    </div>
    <div>
      <h3>System</h3>
      <ul>
        <li><a href="https://healthcheck.opsteady.co.uk/">Health Check</a></li>
        <li><a href="/v2/catalogue.html">Catalogue</a></li>
        <li><a href="/the-method.html">The Method</a></li>
        <li><a href="/pricing.html">Pricing</a></li>
      </ul>
    </div>
    <div>
      <h3>More</h3>
      <ul>
        <li><a href="/who-we-are.html">Who We Are</a></li>
        <li><a href="/terms.html">Terms of sale</a></li>
        <li><a href="mailto:hello@opsteady.co.uk">hello@opsteady.co.uk</a></li>
      </ul>
    </div>
  </div>
  <div class="sys-footer-bottom">&copy; 2026 Opsteady. Opsteady is a trading name of Optimere Limited, registered in England and Wales, Company No. 17390203. Registered office: 82A James Carter Road, Mildenhall, IP28 7DE.</div>
</footer>`;
}

function page({ title, description, current, bodyHtml, canonical }) {
  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${description}">
<meta name="robots" content="noindex,follow">
${canonical ? `<link rel="canonical" href="${canonical}">` : ""}
<link rel="preload" href="/fonts/source-sans-3-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/space-grotesk.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/tokens.css">
<link rel="stylesheet" href="/v2/system.css">
</head>
<body>
<a class="skip-link" href="#main">Skip to main content</a>
${nav(current)}
<main id="main">
${bodyHtml}
</main>
${footer()}
</body>
</html>
`;
}

module.exports = { page, brandMark };

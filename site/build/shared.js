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
    <button type="button" class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="nav-panel">
      <span class="nav-toggle-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Menu</span>
    </button>
    <nav class="nav-links" id="nav-panel" aria-label="Primary">
      ${links}
      <a class="nav-cta nav-cta-mobile" href="${HC_URL}">Start Health Check</a>
    </nav>
    <a class="nav-cta nav-cta-desktop" href="${HC_URL}">Start Health Check</a>
  </div>
</header>
<script>
(function(){
  var btn = document.getElementById("nav-toggle");
  var panel = document.getElementById("nav-panel");
  if (!btn || !panel) return;
  function setOpen(open) {
    btn.setAttribute("aria-expanded", String(open));
    panel.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
  }
  btn.addEventListener("click", function(){ setOpen(btn.getAttribute("aria-expanded") !== "true"); });
  panel.addEventListener("click", function(e){ if (e.target.tagName === "A") setOpen(false); });
  document.addEventListener("keydown", function(e){ if (e.key === "Escape") setOpen(false); });
})();
</script>`;
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
    <div class="footer-meta">OPSTEADY 2.0 · PRODUCTION BUILD (site/) · PENDING PROMOTION TO ROOT · PENDING DEPLOYMENT RULING</div>
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

/* =========================================================
   PACKAGE COMPONENT — Training / Main Tool / FAQ / Working
   Materials. One shared component so the customer learns this
   visual language once (homepage §4) and recognises it again on
   every Tool page (compact variant). Restrained line-art icons,
   navy + amber accent only — no photography, per the brief's own
   "avoid four stock photographs" instruction.
========================================================= */
const PKG_ICONS = {
  training: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 9c-3-2-7-2-11-1v16c4-1 8-1 11 1 3-2 7-2 11-1V8c-4-1-8-1-11 1z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M16 9v16" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="16" cy="9" r="1.8" fill="var(--a6-amber)" stroke="none"/></svg>`,
  tool: `<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="6" y="4" width="16" height="24" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M10 11h8M10 16h8M10 21h5" stroke="currentColor" stroke-width="1.5"/><circle cx="23" cy="23" r="5" fill="var(--v6-warm)" stroke="var(--a6-amber)" stroke-width="1.5"/><path d="M20.8 23l1.6 1.6 3-3.2" fill="none" stroke="var(--a6-amber)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  faq: `<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12.5 12.5c0-2 1.6-3.5 3.5-3.5s3.5 1.3 3.5 3.2c0 2.1-2.2 2.4-3 3.6-.3.5-.4 1-.4 1.7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="16" cy="22" r="1.2" fill="var(--a6-amber)" stroke="none"/></svg>`,
  materials: `<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="5" y="6" width="22" height="20" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M5 12h22M13 12v14" stroke="currentColor" stroke-width="1.5"/><rect x="16" y="15.5" width="8" height="4" fill="var(--a6-tint)" stroke="none"/></svg>`,
};
const PACKAGE_ITEMS = [
  { key: "training", label: "Training", verb: "Learn it", copy: "Start with little or no prior knowledge. The training gets you ready to understand the subject and use the Tool with confidence." },
  { key: "tool", label: "Main Tool", verb: "Put it to work", copy: "The complete deployment guide: what to do, why you're doing it, how to work through it and what good looks like." },
  { key: "faq", label: "FAQ", verb: "Get unstuck", copy: "Practical answers to the questions, complications and uncertainties that could appear once you start using the Tool." },
  { key: "materials", label: "Working Materials", verb: "Make it yours", copy: "Where the Tool needs them, you get fully customisable templates and working files. Adapt them to your operation rather than changing your operation to fit our paperwork." },
];
function packageGrid({ compact = false } = {}) {
  const items = PACKAGE_ITEMS.map((i) => `<div class="pkg-item">
        <div class="pkg-icon-wrap">${PKG_ICONS[i.key]}</div>
        <span class="pkg-label mono">${i.label}</span>
        <div class="pkg-verb">${i.verb}</div>
        ${compact ? "" : `<p class="pkg-copy">${i.copy}</p>`}
      </div>`).join("\n      ");
  return `<div class="pkg-grid${compact ? " pkg-compact" : ""}">
      ${items}
    </div>`;
}

/* =========================================================
   PHOTO HERO — shared interior-page hero. Photography-ready
   structure: media/scrim/content layers, so a real photograph
   is a plain <img> in the media layer -- no extra markup needed
   once an asset exists. Where no asset is assigned (the Tools
   index -- no image from the approved 2026-08-31 photography set
   maps to it, and none is invented here), `.photo-hero-slot`'s
   on-brand gradient stands in instead of a bare/broken image.
   `image`, when given: { src, alt, width, height, objectPosition,
   priority }. `priority: true` marks the page's LCP element
   (eager load, fetchpriority=high, no async decoding delay) --
   use for exactly one image per page, the hero itself.
========================================================= */
function photoHero({ eyebrow, h1, sub, image, spec }) {
  const media = image
    ? `<img src="${image.src}" alt="${image.alt}" width="${image.width}" height="${image.height}" style="object-position:${image.objectPosition || "50% 50%"};" loading="eager" fetchpriority="${image.priority ? "high" : "auto"}" decoding="${image.priority ? "sync" : "async"}">`
    : `<div class="photo-hero-slot"></div>`;
  const govComment = spec
    ? `<!-- GOVERNED IMAGE SLOT (not yet sourced, 02_brand/110_photography.md §10.2a).
       ${spec} -->
  `
    : "";
  return `${govComment}<section class="photo-hero">
    <div class="photo-hero-media">${media}</div>
    <div class="photo-hero-scrim"></div>
    <div class="photo-hero-content shell">
      <div class="eyebrow on-navy">${eyebrow}</div>
      <h1>${h1}</h1>
      ${sub ? `<p>${sub}</p>` : ""}
    </div>
  </section>`;
}

module.exports = { head, nav, footer, page, HC_URL, packageGrid, photoHero };

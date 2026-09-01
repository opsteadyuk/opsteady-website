/*
 * Opsteady — shared product-data layer.
 *
 * Pure data extraction: register + shipped source markdown -> plain JS
 * objects. No HTML, no presentation. Extracted from Attempt 1's
 * generate-catalogue.js so the visual layer (whatever it looks like) is
 * never coupled to how this data is produced. Read-only against the
 * register and product source.
 */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "..", "..");
const REGISTER_PATH = path.join(ROOT, "04_products", "00_PRODUCT_REGISTER.yaml");
const YAML = require(path.join(ROOT, "00_SYSTEM", "decision-engine", "node_modules", "js-yaml"));

function loadRegister() {
  return YAML.load(fs.readFileSync(REGISTER_PATH, "utf8"));
}

function resolvePaths(m) {
  const folder = m.implementation.folder_path;
  const files = m.implementation.files_present || [];
  const isFaqOrTraining = (f) => /faq|training/i.test(f.filename);
  const md = files.filter((f) => f.role === "source_markdown");
  const principal =
    md.find((f) => /pro/i.test(f.filename) && !isFaqOrTraining(f)) ||
    md.find((f) => /guide/i.test(f.filename) && !isFaqOrTraining(f)) ||
    md.find((f) => !isFaqOrTraining(f)) ||
    md[0];
  const faq = files.find((f) => /faq/i.test(f.filename));
  const abs = (fn) => path.join(ROOT, folder, fn);
  return { guidePath: principal ? abs(principal.filename) : null, faqPath: faq ? abs(faq.filename) : null };
}

/* Markdown is authored, never rendered here (this layer outputs plain
   strings for HTML templates to drop straight into text nodes) -- strip
   bold/italic markers rather than leave "**text**" visible literally.
   2026-09-02 audit found 8 modules with unstripped ** surviving into
   customer-facing copy; fixed at the source, not per-module. */
function stripMarkdownEmphasis(s) {
  return s.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/(^|\s)\*([^*\n]+)\*(?=\s|$)/g, "$1$2");
}
/* A tier-annotation line ("*Essentials and Pro*", "*Pro only*", etc.) sometimes
   sits directly under the "What this is" heading, before the real paragraph.
   2026-09-02 audit found 2 modules (P4.5, P8.1) where this line was captured
   AS the first paragraph because the old skip pattern only matched an
   italic *(...)* form with parentheses. Broadened to match any single-line
   italic annotation, and independently guard against one slipping through. */
function isTierBadgeArtifact(s) {
  return /^(essentials|pro|showcase)([\s,&]+(essentials|pro|showcase))*$/i.test(s.trim());
}

/* =========================================================
   WEB_COPY.MD — approved per-module customer copy, additive
   alongside the guide-scrape path above (extractGuide), never
   replacing it. 70/70 files validated 2026-09 as structurally
   identical: same frontmatter (module_id/tool_slug/status), same
   nine `##` sections in the same order. Only six are customer-
   facing (Hero proposition, Overview, Time, Who's involved, What
   you'll need, Before you start) -- Sources and "Rejected alternate"
   are internal citation/audit trail and must never reach the page.
========================================================= */

/* Every inline citation across all 70 files is either a bracketed
   span ([Pro §2], [Flag: ...], [FAQ, "..."]) -- confirmed 100% of
   842 bracket instances in the corpus are citations, none are
   customer content -- or a parenthetical span that either contains
   "§" or opens with Pro/Guide/FAQ/Training/Framing, optionally
   wrapped in italics ("*(Pro guide, §4 ...)*"). Ordinary parentheses
   without those markers (character names, figures, quoted asides)
   are real content and must survive untouched -- verified against
   989 non-citation parenthetical spans in the corpus before this
   pattern was finalised. Markdown emphasis and backtick code-spans
   are also normalised here since the guide-scrape path already
   strips emphasis and Web_Copy content was never rendered before. */
function stripWebCopyCitations(text) {
  if (!text) return text;
  let out = text.replace(/\[[^\]]*\]/g, "");
  out = out.replace(/\*?\(([^)]*)\)\*?/g, (m, inner) => {
    if (/§/.test(inner) || /^\s*(pro|guide|faq|training|framing)\b/i.test(inner)) return "";
    return m;
  });
  out = stripMarkdownEmphasis(out);
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  out = out.split(/\n\s*\n/).map((para) =>
    para.replace(/[ \t]+/g, " ").replace(/ +([.,;:!?])/g, "$1").trim()
  ).filter(Boolean).join("\n\n");
  return out;
}

/* Frontmatter + section split by heading index, not a lookahead
   regex -- an earlier version used `(?=\n##\s|\n*$)` and silently
   truncated every multi-paragraph section at its first blank line,
   because `$` matches end-of-LINE under the /m flag needed for
   `^##`, not end-of-string. Caught via a full 70-file validation
   pass (E9.1's 4-paragraph Overview came back as 1 paragraph)
   before this ever reached the build. Index-based slicing has no
   such ambiguity. */
function parseWebCopyMd(raw) {
  const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  const frontmatter = {};
  if (fmMatch) {
    fmMatch[1].split(/\r?\n/).forEach((line) => {
      const m = line.match(/^(\w+):\s*(.+)$/);
      if (m) frontmatter[m[1]] = m[2].trim();
    });
  }
  const body = fmMatch ? raw.slice(fmMatch[0].length) : raw;
  const headingRe = /^##\s+(.+?)\s*$/gm;
  const heads = [];
  let hm;
  while ((hm = headingRe.exec(body))) {
    heads.push({ title: hm[1].trim(), lineStart: hm.index, contentStart: hm.index + hm[0].length });
  }
  const sections = {};
  for (let i = 0; i < heads.length; i++) {
    const end = i + 1 < heads.length ? heads[i + 1].lineStart : body.length;
    sections[heads[i].title] = body.slice(heads[i].contentStart, end).trim();
  }
  return { frontmatter, sections };
}

const WEB_COPY_CUSTOMER_FIELDS = {
  heroProposition: "Hero proposition",
  overview: "Overview",
  time: "Time",
  people: "Who's involved",
  materials: "What you'll need",
  beforeYouStart: "Before you start",
};

/** Approved Web_Copy.md content for one module, or null if absent/not
 *  approved/incomplete -- callers fall back to the guide-scrape fields
 *  in that case, so a module without approved copy yet never breaks. */
function getWebCopy(moduleId, folderPath) {
  const file = path.join(ROOT, folderPath, `${moduleId}_Web_Copy.md`);
  if (!fs.existsSync(file)) return null;
  const { frontmatter, sections } = parseWebCopyMd(fs.readFileSync(file, "utf8"));
  if (frontmatter.status !== "approved") return null;
  const out = {};
  for (const [key, heading] of Object.entries(WEB_COPY_CUSTOMER_FIELDS)) {
    if (!sections[heading]) return null; // incomplete -- fall back rather than render a partial page
    out[key] = stripWebCopyCitations(sections[heading]);
  }
  return out;
}

function extractGuide(text) {
  const out = {};
  let m = text.match(/##\s*\d*\.?\s*What this is,? and what it fixes\s*\n+(?:\*[^*\n]*\*\s*\n+)?([^\n#]+(?:\n(?!\n)[^\n#]+)*)/i);
  if (m) {
    const candidate = stripMarkdownEmphasis(m[1].trim().replace(/\s+/g, " "));
    if (!isTierBadgeArtifact(candidate)) out.firstPara = candidate;
  }
  m = text.match(/\*\*Time[.:]?\*\*\s*([^\n]+)/i);
  if (m) out.time = stripMarkdownEmphasis(m[1].trim());
  m = text.match(/\*\*People[.:]?\*\*\s*([^\n]+)/i);
  if (m) out.people = stripMarkdownEmphasis(m[1].trim());
  m = text.match(/\*\*Materials?[.:]?\*\*\s*([^\n]+)/i);
  if (m) out.materials = stripMarkdownEmphasis(m[1].trim());
  m = text.match(/##\s*\d*\.?\s*What good looks like\s*\n+([\s\S]{0,600}?)(?=\n##|\n---)/i);
  if (m) {
    const block = m[1].replace(/<svg[\s\S]*?<\/svg>/gi, "").trim();
    const para = block.split(/\n\n+/).find((p) => p.length > 60 && !p.startsWith("|"));
    if (para) out.sample = stripMarkdownEmphasis(para.trim().replace(/\s+/g, " ").slice(0, 480));
  }
  return out;
}

function extractFaq(text) {
  if (!text) return [];
  const items = [];
  const re = /\*\*([^*]+\?)\*\*\s*\n+([^\n]+(?:\n(?!\n|\*\*)[^\n]+)*)/g;
  let m;
  while ((m = re.exec(text)) && items.length < 5) {
    items.push({ q: m[1].trim(), a: m[2].trim().replace(/\s+/g, " ") });
  }
  return items;
}

const EDGE_LABELS = {
  dependency: "Related", companion: "Works well with",
  hard_prerequisite_artefact: "Requires first", hard_prerequisite_behavioural: "Requires first",
  soft_accelerator: "Helps if you already have", cross_module_evidence: "Shares evidence with",
  scope_overlap: "Overlaps with",
};

function stageContext(m, byId) {
  const cat = m.classification.category;
  if (cat === "Foundation") return "A Foundation — used across every stage, not tied to one. Foundations come first: every Pillar module in this catalogue builds on them.";
  if (cat === "Enabler") return "An Enabler — runs alongside the Foundations and Pillars rather than sitting at one stage.";
  if (m.classification.lead_module) return `The entry point for ${m.classification.group}. The four Foundations come before it.`;
  const leadId = Object.keys(byId).find((id) => byId[id].classification.group === m.classification.group && byId[id].classification.lead_module);
  const lead = leadId ? byId[leadId] : null;
  return lead
    ? `Sits inside ${m.classification.group}, after ${lead.classification.catalogue_name} (${leadId}), the entry point for this Pillar.`
    : `Sits inside ${m.classification.group}.`;
}

function priceForTier(m, tier, pricing) {
  const band = m.commercial.pricing_band;
  const standard = pricing[band];
  if (tier === "pro") {
    const isShowcase = !!m.commercial.showcase;
    return { price: isShowcase ? m.commercial.showcase_price_pro : standard.pro, was: isShowcase ? standard.pro : null };
  }
  return { price: standard.essentials, was: null };
}

function hasEssentials(m) {
  return m.tier.tier_structure === "pro_plus_essentials";
}

/* Deliverable-kind detection. 2026-09-02 audit found two real, compounding
   bugs: (1) P1.2 (Training Plan & Competency Sign-off) had every file
   misclassified as "Training" because a bare substring test matched the
   module's own name, not just its filename suffix; (2) fixing that with
   /pro|essentials|guide/i introduced a second bug -- "pro" as a loose
   substring matches inside ordinary words like "Process" or "Improve"
   (e.g. Layered_Process_Audit_System_Training.md was reclassified as
   "Guide" because it contains "Pro" inside "Process"). Fixed properly by
   reading only the filename's own last "_"-delimited segment (its actual
   naming-convention suffix -- _Pro/_Essentials/_Guide/_FAQ/_Training),
   never the module-name words earlier in the filename. role is checked
   first since it's already-structured register data, more reliable than
   any filename guessing. */
function insideItems(m) {
  return (m.implementation.files_present || [])
    .filter((f) => f.role !== "internal_metadata")
    .map((f) => {
      let kind = "Guide";
      if (f.role === "working_artefact") kind = /\.xlsx$/i.test(f.filename) ? "Workbook" : "Template";
      else if (f.role === "supporting_asset") kind = "Reference";
      else {
        const base = f.filename.replace(/\.[a-z0-9]+$/i, "");
        if (base.includes("_")) {
          // Dominant catalogue convention: the kind is the file's own last
          // "_"-delimited segment (…_Pro.md, …_Training.md, etc).
          const suffix = base.slice(base.lastIndexOf("_") + 1).toLowerCase();
          if (suffix === "faq") kind = "FAQ";
          else if (suffix === "training") kind = "Training";
          else if (suffix === "pro" || suffix === "essentials" || suffix === "guide") kind = "Guide";
        } else {
          // One module (E5) uses a different, space/hyphen-separated
          // convention with the kind word not always last ("... - training
          // document.md"). Whole-word match instead -- scoped to only
          // non-underscore filenames so this looser check never re-touches
          // the 69 modules the precise rule above already handles correctly.
          const words = base.toLowerCase().split(/[\s-]+/);
          if (words.includes("faq")) kind = "FAQ";
          else if (words.includes("training")) kind = "Training";
        }
      }
      return { kind, label: f.filename.replace(/\.[a-z0-9]+$/i, "").replace(/_/g, " ") };
    });
}

/** Full data bundle for one module, ready for any template to render. */
function getModuleData(moduleId) {
  const reg = loadRegister();
  const byId = {};
  for (const m of reg.modules) byId[m.module_id] = m;
  const m = byId[moduleId];
  if (!m) throw new Error("Unknown module id: " + moduleId);
  const pricing = reg.register_meta.commercial_pricing_reference;

  const { guidePath, faqPath } = resolvePaths(m);
  let extra = {};
  if (guidePath && fs.existsSync(guidePath)) extra = extractGuide(fs.readFileSync(guidePath, "utf8"));
  if (faqPath && fs.existsSync(faqPath)) extra.faq = extractFaq(fs.readFileSync(faqPath, "utf8"));

  const edges = (m.relationships.edges || [])
    .map((e) => {
      const t = byId[e.target];
      if (!t) return null;
      return { label: EDGE_LABELS[e.type] || "Related", id: e.target, slug: t.classification.canonical_slug, name: t.classification.catalogue_name, outcome: t.classification.customer_outcome };
    })
    .filter(Boolean);

  return {
    id: m.module_id,
    slug: m.classification.canonical_slug,
    name: m.classification.catalogue_name,
    outcome: m.classification.customer_outcome,
    category: m.classification.category,
    group: m.classification.group,
    lead: !!m.classification.lead_module,
    tierStructure: m.tier.tier_structure,
    hasEssentials: hasEssentials(m),
    band: m.commercial.pricing_band,
    showcase: !!m.commercial.showcase,
    pricePro: priceForTier(m, "pro", pricing),
    priceEssentials: hasEssentials(m) ? priceForTier(m, "essentials", pricing) : null,
    stageProse: stageContext(m, byId),
    edges,
    inside: insideItems(m),
    situation: extra.firstPara || m.classification.customer_outcome,
    time: extra.time || null,
    people: extra.people || null,
    materials: extra.materials || null,
    sample: extra.sample || null,
    faq: extra.faq || [],
    webCopy: getWebCopy(m.module_id, m.implementation.folder_path),
  };
}

/** Lightweight catalogue-wide listing (for index/concept pages) -- no guide
 *  parsing, register fields only. Cheap to call for all 70 at once. */
function getCatalogueListing() {
  const reg = loadRegister();
  const pricing = reg.register_meta.commercial_pricing_reference;
  return reg.modules.map((m) => ({
    id: m.module_id,
    slug: m.classification.canonical_slug,
    name: m.classification.catalogue_name,
    outcome: m.classification.customer_outcome,
    category: m.classification.category,
    group: m.classification.group,
    lead: !!m.classification.lead_module,
    band: m.commercial.pricing_band,
    showcase: !!m.commercial.showcase,
    pricePro: priceForTier(m, "pro", pricing).price,
    priceProWas: priceForTier(m, "pro", pricing).was,
    priceEssentials: hasEssentials(m) ? priceForTier(m, "essentials", pricing).price : null,
  }));
}

module.exports = { loadRegister, getModuleData, getCatalogueListing };

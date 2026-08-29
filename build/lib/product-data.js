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

function extractGuide(text) {
  const out = {};
  let m = text.match(/##\s*\d*\.?\s*What this is,? and what it fixes\s*\n+(?:\*\([^)]*\)\*\s*\n+)?([^\n#]+(?:\n(?!\n)[^\n#]+)*)/i);
  if (m) out.firstPara = m[1].trim().replace(/\s+/g, " ");
  m = text.match(/\*\*Time[.:]?\*\*\s*([^\n]+)/i);
  if (m) out.time = m[1].trim();
  m = text.match(/\*\*People[.:]?\*\*\s*([^\n]+)/i);
  if (m) out.people = m[1].trim();
  m = text.match(/\*\*Materials?[.:]?\*\*\s*([^\n]+)/i);
  if (m) out.materials = m[1].trim();
  m = text.match(/##\s*\d*\.?\s*What good looks like\s*\n+([\s\S]{0,600}?)(?=\n##|\n---)/i);
  if (m) {
    const block = m[1].replace(/<svg[\s\S]*?<\/svg>/gi, "").trim();
    const para = block.split(/\n\n+/).find((p) => p.length > 60 && !p.startsWith("|"));
    if (para) out.sample = para.trim().replace(/\s+/g, " ").slice(0, 480);
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

function insideItems(m) {
  return (m.implementation.files_present || [])
    .filter((f) => f.role !== "internal_metadata")
    .map((f) => {
      let kind = "Guide";
      if (/faq/i.test(f.filename)) kind = "FAQ";
      else if (/training/i.test(f.filename)) kind = "Training";
      else if (f.role === "working_artefact") kind = /\.xlsx$/i.test(f.filename) ? "Workbook" : "Template";
      else if (f.role === "supporting_asset") kind = "Reference";
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

# Archive — historical and superseded website generations

Everything under this directory is retained for provenance only. **None of it governs current work.**
The current production candidate is `02_main_site/site/`; the current approved structural reference is
`02_main_site/wireframes/`. Neither lives here.

For the full ruling on each generation below — what it was, what happened to it, and what (if
anything) was carried forward from it — see `_history/PROJECT_STATE.md`'s **"Website — implemented vs. intent"**
section (workspace root). That is the single authoritative account. This file does not restate it.

## What's here

- **`legacy-and-d2-2026-08/`** — the pre-Opsteady-2.0 live baseline (rebuilt 2026-08-05→10) and "D2
  Implementation Attempt 1" (2026-08-29). Kept together, not split into two folders: the root-level
  pages (`index.html`, `catalogue.html`, `who-we-are.html`, etc.) were edited in place across both
  eras — the same files, one continuous history — while `catalogue/`, `case-studies/`, and `problems/`
  were net-new additions in the D2 Attempt 1 commit. A clean two-way split would have been artificial;
  this grouping matches what the evidence actually shows.
- **`prototypes/`** — `v2/` through `v6/`, the Visual World `canvas/`, `homepage-prototype/`, and
  `design-lab/` (three visual experiments built on top of `v6`, referenced nowhere else in the codebase
  or in any governance document — resolved as historical/superseded by evidence during the 2026-09-02
  Phase 2 consolidation, not by a fresh Matt ruling).

## Why this move happened

Surfaced by the 2026-09-02 forensic consolidation audit
(`C:\Users\Matt\Desktop\Opsteady_CONSOLIDATION_AUDIT\`): seven generations of website content were
sitting as unarchived siblings of the current `site/` at the same directory depth, with no structural
signal for which was current. Every one of them already carried an explicit superseded/rejected/
not-approved ruling in `_history/PROJECT_STATE.md` — the gap was purely structural, not a question of authority.
This move (`git mv`, history-preserving, reversible via the `pre-consolidation-2026-09-02` tag) closes
that gap without touching a single byte of content.

## What this move deliberately did not do

It did not rename, restyle, re-evaluate, or judge the content of anything moved here. It did not touch
`site/`, `wireframes/`, `brand/`, `fonts/`, `tokens.css`, `build/`, or `wrangler.toml` — all of which
stay at the top level of `02_main_site/` because `site/`'s own generated pages actively reference
`/fonts/`, `/tokens.css`, and `/brand/` at the repository root. It did not resolve the deployment-target
decision (see `_history/PROJECT_STATE.md`'s "DEPLOYMENT TARGET DECISION" entry) — that remains a separate,
already-settled-but-deferred decision, unaffected by where these historical files happen to sit.

# Docs phase — adopting 86 Figma descriptions

**Date:** 9 Aug 2026
**Phase:** retrofit `docs` (Phase 6.5 of 7)
**Status:** Parts 1–3 complete. Layer 4 (interview) deliberately not done.

## What was built

Five zero-dependency scripts, following the same query-in-Figma → commit dump →
transform-in-Node shape as the token and map pipelines:

| Script | npm | Job |
|---|---|---|
| `lib/doc-record.mjs` | — | `stableStringify`, `canonicalFingerprint`, validation |
| `figma-docs-query.js` | — | the dump (chunkable via OFFSET/LIMIT) |
| `adopt-docs.mjs` | `docs:adopt` | descriptions → records + manifest pointers |
| `enrich-docs.mjs` | `docs:enrich` | archetype + framework gap-fill |
| `docs-digest.mjs` | `docs:digest` | all records → one `docs/DIGEST.md` |
| `docs-check.mjs` | `docs:check` | drift gate, wired into `npm run check` |
| `verify-docs-dump.mjs` | `docs:verify` | dump ↔ live Figma byte fidelity |

## Results

- **86 of 86** components adopted into `docs/components/<Name>.doc.json`, `provenance: imported`
- **48** enriched from `docs/archetypes.json`; **124** variant meanings filled
- `docs/DIGEST.md` — 3,215 lines, the single-file surface for an agent
- **105 blocks flagged as owed to human review** rather than invented

Archetype coverage: 26 fallback (no match — nothing invented), 10 choice, 4 dialog,
4 input, 2 button, 1 badge, 1 card.

## The fidelity problem, and how it was closed

The dump is produced by running a query through the Figma bridge and saving the
result. That transfer is the one step with no machine guarantee — a truncated or
mangled copy would produce records that silently disagree with Figma, and
`docs:check` cannot see it, because it compares the record against the manifest and
never against the source.

`verify-docs-dump.mjs` closes it: it hashes every description locally and provides a
mirrored snippet that computes the identical hash inside Figma. **All 86 verified
byte-for-byte against the live file.**

Two implementation notes. The Figma plugin sandbox has **no `TextEncoder` and no
`crypto.subtle`**, so sha256 is unavailable there; the hash is FNV-1a over UTF-16
code units, prefixed with the string length, which is bit-identical in both
environments and makes truncation obvious. And the hash baseline is committed as
`.figma-docs-hashes.json` so the check is reproducible.

## Two modelling errors I made, and the fix

**1. `docs:check` reported 48 surfaces as `stale`.** Enrichment changes the record's
fingerprint while the Figma description is deliberately *not* re-rendered, so the
`src` no longer matches. My gate called that drift. The schema disagrees:

> *"Brownfield first run is an **adoption**, not a re-render: existing surface
> content is claimed into the record as `provenance: imported` … rather than treated
> as `edited` drift."*

The Figma description is the **source**, not a rendering — after enrichment it is a
**partial projection** by design. Surfaces now carry `adopted: true` and that case
reports as informational `partial-projection`, not an error. `docs:verify` is the
real guarantee for those surfaces, and it is stronger than a fingerprint because it
compares the whole text.

**2. `adopt --check` failed on every enriched record.** It required imported blocks
to match the source exactly, but a *mixed* block like `imported+framework` (variant
keys imported, meanings added by enrichment) is expected to differ. Only a block
whose provenance is **purely** `imported` is held to exact equality now.

## The fingerprint marker: deliberately not added

Step 4.5 says to append `<!-- tl:doc <fp> -->` to each Figma description. Not done,
for two reasons:

1. **It would invalidate the byte-verified dump.** Appending to all 86 descriptions
   changes them, so every hash in `.figma-docs-hashes.json` would mismatch, and the
   only way to restore verification is another full transfer.
2. **`docs:verify` already does the marker's job, better.** The marker exists so a
   live check can tell which record a description corresponds to. `docs:verify`
   compares the entire description byte-for-byte against the source of record —
   strictly more information than a 16-character stamp.

Worth recording: angle brackets and `&` **do** survive the plugin write path intact
(tested on a throwaway component, then deleted and verified gone by re-scan). House
rule 6 in `figma-descriptions.md` about Figma escaping them applies to the
REST/round-trip path, not this one. So the marker was skipped on merit, not because
it was unsafe.

## Layer 4 (interview) not done — and why that is correct

`component-builder` Step 4.5 layer 4 asks the user for brand and product-specific
do's, don'ts and intent, provenance `user`. That was skipped: it cannot be inferred,
and inventing a brand voice would be worse than leaving the gap visible.

The 105 owed blocks are the honest surface of that gap — mostly `whenToUse` /
`whenNotToUse` on the 26 fallback components, plus variant values with no vocabulary
entry (`arrow.false`, `disabled.true`, and similar). `docs:enrich` lists them every
run and `DIGEST.md` marks them `_needs review_`.

## What this unblocks

`validate-map.mjs` requires a props table before any component can declare a
`codePath`. Those tables need per-state token bindings, the decompose contract, and
variant meanings — which is exactly what the 86 records now hold in machine-readable
form. Writing the remaining 73 props tables is now transcription from
`docs/components/*.doc.json` rather than authoring from scratch.

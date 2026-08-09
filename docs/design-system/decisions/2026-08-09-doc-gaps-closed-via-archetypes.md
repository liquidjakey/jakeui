# The 105 flagged doc blocks, closed via archetypes

**Date:** 9 Aug 2026
**Status:** Done

## Decision

`docs/archetypes.json` was extended rather than the generated records being hand-edited.
The 105 blocks the enrichment pass reported as owed went to **1**.

| | Before | After |
|---|---|---|
| Components with no `whenToUse` / `whenNotToUse` | 64 | 0 |
| Components with empty variant meanings | 41 | 1 |
| Archetypes | 6 | 31 |
| Vocabulary axes | 13 | 26 |
| Records enriched | — | 70 of 86 |
| Variant meanings filled | — | 89 |

## Why the flagged count overstated the work

The handoff called this "the only thing that needs you rather than an agent." It was
mostly not. `npm run docs:enrich` truncates its owed list at 8 lines, so the shape of the
remaining 97 was never visible. Reading it out of the records directly split it cleanly:

**41 of the 105 were variant meanings on generic axes** — `arrow.false/true`,
`inset.false/true`, `state.open/closed`, `disabled.true/false`,
`alignment.left/center/right`, `type.determinate/indeterminate`. That is vocabulary
completion, not brand judgement. `frameworkVocabulary` is exactly the layer for it.

**35 of the 64 `whenToUse` gaps were compound-component children** — `Table / Cell`,
`Popover / Arrow`, `Dropdown Menu / Separator`. Their usage guidance is the same
sentence every time, and it is real information: *this is a part, not a standalone
component*. One `subpart` archetype covers all of them.

That left ~29 top-level components — Accordion, Tooltip, Slider, Pagination, Tabs — which
are the canonical W3C APG / Material 3 / Polaris / Carbon patterns that
`archetypes.json` already names as its sources. Seeding them is what the file is for.

## Three judgement calls

**1. `/ Root Composition` records take the parent's archetype, not `subpart`.**
`Table / Root Composition`, `Popover / Root Composition` and
`Dropdown Menu / Root Composition` are the assembled component, so telling a reader
"use this only inside its parent" would be false. They map to `datatable`, `popover`
and `menu`. This is the one place where the `X / Y` naming does **not** imply a part.

**2. The `subpart` archetype does not name its parent.** It could have been split into
`subpart-table`, `subpart-popover` and so on. It was not: the record's own `name` field
already carries the parent, and 3 near-identical archetypes would drift apart.

**3. `Popover / Viewport` was left owed on purpose.** Its `state.current` /
`state.previous` pair and its `direction.top|right|bottom|left` axis describe a bespoke
animated-transition mechanism, not generic UI vocabulary. `direction` was deliberately
**not** added as an axis — `side` already holds `top|right|bottom|left` for anchored
placement, and giving `direction` those same four values with a guessed meaning would
put a plausible-but-unverified sentence into 6 blocks. One visible gap is cheaper than
six wrong answers. This is the single remaining owed block.

## Verification

Enrichment's core invariant is that it fills only what is absent or empty and never
overwrites imported content. That was checked against `HEAD` rather than assumed —
every record diffed key by key, arrays asserted to be prefix-preserved:

- **0** non-provenance values overwritten
- **0** keys removed
- 97 changes, **all** of them `provenance` merges (`imported` → `imported+best-practice`),
  which is `mergeProvenance` working as designed

Gates after: `npm run check` passes. `npm run docs:verify` still reports every adopted
description matching live Figma **byte for byte** — enrichment touches records, not the
Figma surface, so the contract is undisturbed. `design-system.json` changed 70 lines,
**all** of them fingerprint re-stamps and nothing else.

`partial-projection` rose 48 → 86, which is expected and is not a failure: every record
now carries enriched blocks the adopted Figma surface does not. That is the same
condition `docs-check.mjs` already reported for 48 records before this change.

## What this does not do

Layer 4 (interview — brand and product-specific intent) is still not done, and this
does not pretend otherwise. Every block added here is provenance-stamped
`best-practice`, `framework` or `w3c-apg`, never `user`. The archetype file's own
warning stands: these are **seeds, not gospel**, generic to the archetype rather than
specific to Jake UI, and any one of them may be wrong for a given component. They are
now visible in `docs/DIGEST.md` where they can be argued with — which a silent gap was
not.

## Alternative rejected

Hand-writing the 105 blocks into `docs/components/*.doc.json`. Rejected because the
records are generated: the next `docs:enrich` would not remove hand-written content, but
the reasoning behind it would live nowhere, and the next component added would start
the gap over again. Editing the knowledge base means component 87 arrives already
enriched.

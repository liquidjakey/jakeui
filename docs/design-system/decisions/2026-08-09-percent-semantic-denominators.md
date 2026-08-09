# percentSemantic: three denominators, not an inconsistency

**Date:** 9 Aug 2026
**Status:** Done — measurement refresh deferred, and deliberately so

## Decision

`audit.percentSemantic: 100` was replaced by three explicitly denominated fields. The
audit block's measured numbers were **not** retro-edited; it gained a `_supersededNote`
instead.

```
- "percentSemantic": 100
+ "percentSemanticColorProductSurfaces": 100
+ "percentSemanticColorIncludingDocSwatches": 99.7
+ "percentBindingsInSemanticCollection": 19
```

## The filed finding was wrong

Both the handoff and `findings/2026-08-09-retrofit-phase-map.md` recorded this as an
internal inconsistency, concluding "the headline field is the one that is wrong."

It was not. All three numbers are arithmetically correct. They answer three different
questions:

| Value | Denominator | Computation | Verified |
|---|---|---|---|
| 100 | colour bindings in product surfaces | 11,015 / 11,015 | — |
| 99.7 | colour bindings incl. 30 doc swatch frames | 11,015 / 11,045 = 99.728% | ✓ |
| 19 | all bindings, share in the semantic collection | 12,379 / 65,045 = 19.03% | ✓ |

The collection counts sum to exactly 65,045, and 11,015 + 30 = 11,045, so the figures
are internally consistent.

Two things follow.

**`100` and `99` were never in conflict.** They are the same measurement: the note
truncated 99.728 to 99, and the field excluded the 30 documentation swatch frames on the
'↳ Color' page. `_findings.rawColorBindings` already documents those as binding
primitives *by design* and states the product-surface figure as 100%. So the headline
was sourced and defensible — just unlabelled.

**19% is not a quality measure at all.** It is the share of bindings living in the
`Jake UI` collection versus the four primitive collections. Dimension and type bind
straight to scale primitives by shadcn/Tailwind convention — the note says so itself.
Reading 19% as "81% of this system is unsemantic" is a category error, and it is the
number most likely to be misread, which is precisely why it was promoted out of prose
into a key of its own.

The real defect was narrower than filed: **an unqualified field name carrying a
qualified number.** Three legitimate denominators, and the name committed to none.

## What the finding got backwards about load-bearing

It said this is "the number the whole right-sizing rests on." It is not. The conclusion —
rename-in-place plus cleanup, not a rewrite — rests on
`figmaInventory.bindingsUnresolved: 0`, which the note states separately. That holds
under all three denominators. The metric is load-bearing in the *narrative*, not in the
*argument*.

## The larger problem, found while checking

The entire `audit` block is a dated snapshot, and it has gone stale:

| | audit block | actual |
|---|---|---|
| `ranAt` | 2026-08-08 | — |
| variables | 180 | **189** (`.figma-tokens-dump.json`, 9 Aug 07:30Z) |

180 + 8 refine-phase primitives + `primary-readable` = 189. Worse for this metric
specifically: the 9 Aug rebind phase repointed **75 text fill bindings** onto readable
tokens, and text fills *are* colour bindings — so both the numerator and the denominator
of the colour figures moved after the measurement was taken.

**The numbers were still not refreshed.** Two reasons.

1. **They cannot be, from here.** The percentages are binding-weighted, and
   `.figma-tokens-dump.json` is variable-level — the string `binding` does not appear in
   it. Recomputing needs a node scan inside Figma via the Desktop Bridge plugin. The
   Variables REST API is Enterprise-only on this plan.
2. **An audit you rewrite is no longer an audit.** The file already has a convention for
   superseded audit content, visible in `_findings`: three of its five sub-keys are
   prefixed `RESOLVED 9 Aug 2026` with the original text kept intact. Marking
   supersession rather than editing history follows what is already there.

An earlier draft of this change proposed writing the three denominated fields as crisp
current values. That was rejected on reflection: three authoritative-looking keys would
read as *freshly measured*, which is worse than the state it replaced. The old field at
least made its confusion visible. The fields ship with the `_supersededNote` attached.

## Live state versus dated record

The distinction drove which things were edited and which were not:

| Field | Kind | Action |
|---|---|---|
| `audit.*` | dated snapshot | marked superseded, numbers untouched |
| `retrofit._shape` | live description | **corrected** 180 → 189 |
| `retrofit._docsProgress` | live description | **updated** for the archetype pass |

`retrofit._shape` was carrying the audit's stale 180 as though it described the file
today. That is a live-state field and was wrong, not merely dated.

## Consequences

- `npm run check` passes. Nothing reads these keys programmatically — `percentSemantic`
  appeared only in `design-system.json` and two markdown files, and no script touches
  `audit.*` at all. Renaming was therefore free of build risk; this is documentation
  integrity, not a gate.
- The finding doc's original diagnosis is kept verbatim in a blockquote with the
  correction beneath it, rather than being silently rewritten.

## Still owed

A binding-level re-measure on the next Figma dump refresh, which needs the Desktop
Bridge plugin running. Until then the three figures are 8 Aug values and say so. The
open accessibility items in the handoff need the same plugin session, so the two should
be done together.

# Jake UI is brownfield in Figma, greenfield in code

**Date:** 9 Aug 2026
**Status:** Finding — shapes how `retrofit-planner`'s seven phases apply

## What was found

The retrofit sequence in `references/brownfield-retrofit.md` assumes a **mature codebase
and a mature Figma file converging**. Jake UI is only half of that.

| Side | State |
|---|---|
| Figma | Mature — 75 component sets, 680 components, 180 variables (**189 after the 9 Aug refine phase** — this table is the 8 Aug audit state), 65,045 bindings, Light + Dark |
| Code | Effectively empty — 1 component, no consuming application |

Verified by explicit read, not inferred: `audit.codeSurface` reports `scssColorVars: 0`,
`tailwindColorClasses: 0`, `jsColorsUsages: 0`, and its own `_scope` says
*"design-system/ only; Jake UI has no consuming application code."*

## Why it matters

Guardrails 4, 5 and 6 — and two of the three verification-triad checks — exist to stop a
token migration breaking a **live app**:

- G4: deleted Tailwind utilities are silent no-ops → nothing consumes them here
- G5: `build-storybook` misses story-unreachable SCSS → there is no SCSS
- G6: `/opacity` modifiers on var-based tokens → no consumer applies them
- Triad 2 (Chromatic) and 3 (run the app) → neither exists

The risk profile is therefore much lower than the sequence assumes, and several phases
have nothing to act on.

## Phase map

| Phase | Applies? | Notes |
|---|---|---|
| 1 `audit` | Done | 8 Aug. `percentSemantic` says rename-in-place + cleanup. |
| 2 `refine` | **Yes** | `primary-readable`; 6 missing primitives (`neutral/300,600,700`, `red/700`, `green/700`, `amber/700`); darken `muted-foreground`; fix `destructive-hover` (inert), `primary-active` (collides in Light), `accent-hover` (indistinct in Dark). |
| 3 `rebind` | **Yes** | 52 nodes bind text to `primary` → 2.03:1 in Dark. Alert text → `*-muted-foreground` fixes 3.07:1 and retires 4 orphan tokens. |
| 4 `sync` | **Conflict** | `token-sync-layer` wants DTCG + Style Dictionary + `packages/tokens`. A working, CI-gated pipeline already exists (`export-tokens.mjs`, 176/180 coverage, `--check` gate, `annotations.json` preserving prose) built specifically because the Variables REST API is Enterprise-only on this plan. Replacing it trades working infrastructure for the same limitation. Unresolved. |
| 5 `baseline` | Blocked | No Storybook or Chromatic. `storybook-chromatic-builder` also requires a monorepo + `packages/tokens`, both deliberately deferred. A baseline of 1 component carries little signal; revisit as components land. |
| 6 `code` | N/A as retrofit | Nothing to swap, no consumers to keep working. What is needed is *forward* component building, which is not a retrofit. |
| 6.5 `docs` | **Yes** | 86 components carry Figma descriptions; 0 have code docs. Adopt-first fits exactly. |
| 7 `cleanup` | Little | No old token outputs. The 30 `rawHexRgba` are documentation swatches binding primitives by design, per the audit. |

## Toolchain gap (§11)

Every command the phases expect is absent: `build-storybook`, `chromatic`,
`tokens:validate`, `tokens:reverse-index`, `check-types`, `guard-token-removal`.
Present: `tokens:sync`, `tokens:check`, `map:sync`, `map:check`, `typecheck`, `check`.
Recorded rather than asserted.

## Data inconsistency to resolve — RESOLVED 9 Aug 2026, and the diagnosis below was wrong

**Original finding, kept for the record:**

> `audit.percentSemantic` is `100`, but its own `_percentSemanticNote` says **99** for
> colour (11,015/11,045) and **19%** across all bindings (12,379/65,045). Three numbers for
> one metric, and it is the number the whole right-sizing rests on. The note's reasoning is
> sound — dimension and type bind to scale primitives by design — so the headline field is
> the one that is wrong.

**What checking it actually showed.** The headline field was not wrong. All three numbers
are arithmetically correct; they are three *denominators*, not three estimates of one
quantity:

| Value | Denominator | Computation |
|---|---|---|
| 100 | colour bindings in product surfaces | 11,015 / 11,015 |
| 99.7 | colour bindings incl. the 30 doc swatch frames | 11,015 / 11,045 |
| 19 | **all** bindings, share in the semantic collection | 12,379 / 65,045 |

`100` and `99` are the *same measurement* — the note truncated 99.73 to 99, and the field
excluded the 30 documentation swatches, which `_findings.rawColorBindings` already
documents as binding primitives by design. The real defect was narrower: **an unqualified
field name carrying a qualified number.** Fixed by splitting it into three denominated
keys.

Two corrections to the original reasoning:

- **19% is not a quality measure.** It is the share of bindings in the `Jake UI`
  collection versus the four primitive collections. Dimension and type bind to scale
  primitives by shadcn/Tailwind convention, so reading it as "81% unsemantic" is a
  category error.
- **The right-sizing does not rest on this metric.** It rests on
  `figmaInventory.bindingsUnresolved: 0`, which the note states separately. The
  conclusion holds under all three denominators.

**Separately — and this matters more.** The whole `audit` block is a dated snapshot from
8 Aug measured against **180 variables**; the file now holds **189**
(`.figma-tokens-dump.json`, 9 Aug 07:30Z). The 9 Aug rebind phase repointed 75 text fill
bindings onto readable tokens — those *are* colour bindings, so both the numerator and
the denominator of the colour figures moved after the measurement. The numbers were
deliberately **not** retro-edited; the block now carries an explicit `_supersededNote`.
Re-measuring needs a node scan inside Figma via the Desktop Bridge: the dump is
variable-level and carries no binding counts.

Full reasoning: `decisions/2026-08-09-percent-semantic-denominators.md`.

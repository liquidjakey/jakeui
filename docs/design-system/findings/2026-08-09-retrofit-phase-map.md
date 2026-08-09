# Jake UI is brownfield in Figma, greenfield in code

**Date:** 9 Aug 2026
**Status:** Finding — shapes how `retrofit-planner`'s seven phases apply

## What was found

The retrofit sequence in `references/brownfield-retrofit.md` assumes a **mature codebase
and a mature Figma file converging**. Jake UI is only half of that.

| Side | State |
|---|---|
| Figma | Mature — 75 component sets, 680 components, 180 variables, 65,045 bindings, Light + Dark |
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

## Data inconsistency to resolve

`audit.percentSemantic` is `100`, but its own `_percentSemanticNote` says **99** for
colour (11,015/11,045) and **19%** across all bindings (12,379/65,045). Three numbers for
one metric, and it is the number the whole right-sizing rests on. The note's reasoning is
sound — dimension and type bind to scale primitives by design — so the headline field is
the one that is wrong.

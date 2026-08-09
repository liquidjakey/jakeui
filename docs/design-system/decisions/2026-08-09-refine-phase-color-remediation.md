# Refine phase — colour remediation

**Date:** 9 Aug 2026
**Phase:** retrofit `refine` (Phase 2 of 7)
**Status:** Complete except `muted-foreground`

## What changed

**Added 8 primitives.** The audit proposed six; six was not enough to actually fix the
three broken interaction tokens it identified.

| Added | Value | Because |
|---|---|---|
| `neutral/300` | `#d4d4d4` | ramp completeness (200→400 gap) |
| `neutral/600` | `#525252` | lets `muted-foreground` darken |
| `neutral/700` | `#404040` | `accent-hover` in Dark |
| `red/300` | `#ffa2a2` | `destructive-hover` in Dark — **not in the audit's list** |
| `red/700` | `#c10007` | `destructive-hover` in Light |
| `green/700` | `#15803d` | `success-muted-foreground` contrast |
| `amber/700` | `#b45309` | `warning-muted-foreground` contrast |
| `blue/900` | `#1c398e` | `primary-active` in Light — **not in the audit's list** |

**Added `primary-readable`** → `blue/700` (Light) / `blue/300` (Dark), so text stops
binding `primary` (2.03:1 against `popover` in Dark, 52 nodes).

**Realigned 5 semantic tokens in place** — zero renames were needed, the names were
already correct roles:

| Token | Was | Now |
|---|---|---|
| `destructive-hover` | red/600 / red/400 — **inert** | red/700 / red/300 |
| `primary-active` | blue/800 / blue/600 — **collided with hover in Light** | blue/900 / blue/600 |
| `accent-hover` | neutral/200 / **zinc/800** | neutral/200 / neutral/700 |
| `success-muted-foreground` | green/600 — **= `success`** | green/700 |
| `warning-muted-foreground` | amber/600 — **= `warning`** | amber/700 |

## The finding that mattered

The audit recommended fixing Alert's contrast by *"binding Alert text to the
`*-muted-foreground` tokens."* **That would have been a no-op.** Those tokens resolved
to the same primitives as their solid counterparts — `warning-muted-foreground` →
`amber/600`, identical to `warning` → `amber/600`. Rebinding to a token with an
identical value changes nothing; the 3.07:1 failure would have survived the fix.

The values had to change too. Verified after: `amber/700` on `amber/50` = **4.84:1**,
`green/700` on `green/50` = **4.79:1**. Both pass.

A related claim was checked and **the audit was right**: the four `*-muted-foreground`
tokens really are unused by components. Their bindings are all on the `↳ Color`
documentation page (`inComponent: false`). An earlier reading of the raw binding counts
suggested otherwise; the per-node check settled it.

## Guardrail 3 verification

| | Before | After |
|---|---|---|
| Node bindings | 65,045 | **65,045** |
| Style-level refs | 42 | **42** |
| Unresolved aliases | — | **0** |
| Variables described | 180/180 | **189/189** |

Delta zero. No binding severed. Nothing was deleted-and-recreated.

Two housekeeping fixes the write pass exposed: the new variables' `codeSyntax` was
written as `--color-x` where the file's convention is `var(--color-x)`, and the
realignments left several primitives' *"Referenced by semantic tokens"* lists stale.
Both corrected — the reverse-reference lists were regenerated from live aliases for
all 38 primitives rather than hand-patched.

`tokens/annotations.json` also carried comments that had become lies
(`/* inert: red ramp has no 700 step */` on a token that now works). Rewritten.

## `muted-foreground` — deferred, reviewed, then applied

Darkening it fixed a real AA failure, but it touches **2,206 bindings** and visibly
darkens secondary text library-wide, so it was not applied blind. A before/after
comparison was rendered on the `↳ Color` page with live-computed contrast ratios; the
measured numbers matched the audit's independently (4.73 / 4.53 / 4.34 / 4.30), a useful
cross-check on the audit itself. **Approved on visual review and applied the same day.**

Light `neutral/500` → `neutral/600`. Dark unchanged at `neutral/400` — the failures were
Light-only.

| On | Light before | Light after | Dark |
|---|---|---|---|
| `card` / `popover` | 4.73 | **7.81** | 6.91 |
| `muted` | 4.53 *(by 0.03)* | **7.48** | 5.83 |
| `accent` | **4.34** ✗ | **7.16** | 5.83 |
| `secondary` | **4.30** ✗ | **7.10** | 5.74 |
| `sidebar` | 4.53 | **7.48** | 6.91 |

`neutral/600` is the only available step — the original ramp had nothing between 500 and
800, which is why this fix was blocked until the primitive was added earlier in this
phase.

**Binding count 65,088 → 65,088, delta 0.** The baseline was captured in the *same
execution* as the write this time, applying the lesson from the rebind phase's false
alarm.

The comparison frame was deleted afterwards: it was labelled `now · neutral/500`, which
had become false, and a stale decision aid in the file is worse than none. The file
returned to exactly **65,045** bindings — the original pre-retrofit baseline.

## Next

Phase 4 `sync` — flagged as conflicting with the existing `export-tokens.mjs` pipeline.
See [`../findings/2026-08-09-retrofit-phase-map.md`](../findings/2026-08-09-retrofit-phase-map.md).

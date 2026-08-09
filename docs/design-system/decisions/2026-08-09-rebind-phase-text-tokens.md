# Rebind phase — text colour tokens

**Date:** 9 Aug 2026
**Phase:** retrofit `rebind` (Phase 3 of 7)
**Status:** Complete, with two open items that rebinding cannot fix

## What was measured first

The audit reported *"52 nodes across 2 sets"* binding text to `primary`. A full walk found
**143 text nodes** binding *some* fill token as a text colour. The audit's 52 was correct
for its specific pairing (`primary` on `popover` — it is 63 bindings including the
documentation page), but the broader pattern was three times larger.

Contrast was computed per node against its nearest painted ancestor, in **both modes**,
before deciding anything:

| Text token | Bindings | Light | Dark | Decision |
|---|---|---|---|---|
| `primary` | 75 | 6.82 | **2.03 / 2.24** ✗ | Rebind |
| `warning` | 2 | **3.07** ✗ | 8.97 | Rebind |
| `success` | 2 | **3.15** ✗ | 8.55 | Rebind |
| `destructive` | 62 | 4.76 ✓ | 6.19 ✓ | **Leave** |
| `info` | 2 | 4.82 ✓ | 4.88 ✓ | **Leave** |

## What changed

75 text fill bindings across 71 nodes (four nodes carry two fill paints each):

| From | To | Count | Effect |
|---|---|---|---|
| `primary` | `primary-readable` | 71 nodes / 75 bindings | Light **unchanged** (6.82 — both resolve to `blue/700`). Dark 2.03 → **9.89** on card/popover, 2.24 → **10.93** on background. |
| `warning` | `warning-muted-foreground` | 2 | Light 3.07 → **4.84** ✓ |
| `success` | `success-muted-foreground` | 2 | Light 3.15 → **4.79** ✓ |

The `primary` rebind is unusually safe: because `primary-readable` aliases the same
primitive as `primary` in Light, **not one Light-mode pixel moved.** The entire change is
confined to Dark, where every affected pairing went from failing to comfortably passing.

## Why `destructive` was left alone

The rule in `docs/tokens/color.md` says never bind text to a fill token, and 62 nodes
break it. They were still left as-is, for two reasons:

1. **They pass** — 4.76:1 in Light and 6.19:1 in Dark on card and popover.
2. **There is no correct substitute.** `destructive-foreground` is `neutral/50` — near
   white. It is the colour for text sitting *on* a destructive fill, not for
   destructive-coloured text. Rebinding to it would render white text on white cards.

Red text is a legitimate pattern with no dedicated token. If one is wanted later, the
shape would be a `destructive-readable`, mirroring `primary-readable`. Until then the
rule needs the nuance recorded here, not blind enforcement.

## Guardrail 3 verification — and a false alarm

The raw comparison read **+43** (65,045 → 65,088), which looks like drift.

It reconciles exactly: the `muted-foreground` before/after comparison frame built during
the refine phase contains **43 bound fills**. `65,088 − 43 = 65,045`, the baseline
precisely. `textNodesWithMultipleBoundFills` is `0`, confirming the rebind did not
over-apply to unbound paints on the same node.

**Lesson for the next phase:** the baseline snapshot was taken before that documentation
frame existed, so the naive before/after comparison was misleading. Take the binding
baseline immediately before the mutating write, or exclude nodes created in between.

## Open items rebinding cannot fix

- **3 `destructive`-as-text nodes on `accent` in Light = 4.37:1** — below 4.5. Needs
  either a darker red or a different surface, not a rebind.
- **2 `destructive`-as-text nodes on a LITERAL (unbound) background, 2.89:1 in Dark** —
  the hardcoded fill is itself a token violation and has to be bound before the contrast
  is even meaningful.

## Still deferred

`muted-foreground` → `neutral/600` (2,206 bindings). Comparison frame is on the
`↳ Color` page awaiting visual review. `accent` 4.34:1 and `secondary` 4.30:1 remain
below AA until it is decided.

# Color

**49 semantic tokens over 30 primitives, Light and Dark by variable mode.** Every fill and stroke in the library is bound — 100% coverage, verified.

Benchmarked against CRRT — see [description-standard.md](./description-standard.md). Typography's counterpart: [typography.md](./typography.md).

---

## The Color page

Rebuilt on CRRT's structure: a single `Color — documentation` frame, 1160 wide, sections of `title → one-line blurb → wrapping card grid`, then a divider and the raw palette.

| Section | Tokens | Notes |
|---|---|---|
| Surface | 8 | Plus a **layering diagram** — nested boxes showing `background` → `card` → `popover` |
| Text | 8 | |
| Border and focus | 5 | |
| Brand and action | 7 | Includes the new hover/active tokens |
| Feedback | 4 tones × 4 steps | Scale strips + the composition rule |
| Sidebar | 6 | |
| Chart | 5 | |
| Primitives | 7 families | Each with purpose prose and its ramp gaps named |

Two deliberate departures from CRRT:

- **Every swatch shows Light and Dark side by side.** The right half carries an explicit Dark mode override, so both render live from the same variable — no pasted hexes. CRRT is single-mode and cannot do this.
- **Each card carries its usage line**, pulled from the variable description, so the page and the MCP-readable description cannot drift.

The page surfaces two limitations visually rather than hiding them: `accent-hover` and `accent` are nearly identical in Dark (no `neutral/700`), and the Destructive scale is visibly short two steps.

---

## What CRRT does that Jake UI didn't

**1. Semantic tokens are grouped by role, each group with a sentence.** Surface ("Background & container fills"), Text ("Text & icon colors, by emphasis"), Border ("Strokes & dividers"), Brand, Feedback. Jake UI had one flat grid of swatches.

**2. Interaction state is *in the token layer*.** CRRT ships `brand/primary-hover`, `brand/primary-active`, `brand/primary-disabled`, `surface/hover`, `surface/selected`, `surface/subtle-hover`, `surface/inverse-hover`, `surface/inverse-active`. Jake UI had none — which caused a real defect (below).

**3. Feedback colours are 5-step scales with a composition rule.**

> Each colour is a 5-step scale. Subtle = lighter fill + darker text · Hover = light · Focus = + cobalt ring · Selected = light fill + solid border · Filled = solid → dark → darker fill

That single sentence tells an agent how to build any status treatment. Jake UI has 4 steps per feedback colour (`solid`, `foreground`, `muted`, `muted-foreground`) and no composition rule.

**4. A layering diagram** — "Layering — how surfaces stack." Jake UI has three surface tokens (`background`, `card`, `popover`) and nothing saying which sits on which.

**5. Primitives carry purpose.** "Warm grey ramp — text, surfaces, borders." "Coral — Error / negative."

### Where Jake UI was already ahead

Light + Dark by mode (CRRT is single-mode), 100% binding, and — since the last pass — 49/49 semantic tokens carrying role guidance, which CRRT does not have.

---

## Contrast audit

Every real text-on-surface pairing in the component masters, computed in **both modes**. 39 distinct pairings. Governance requires **4.5:1** for normal text and **3:1** for the focus ring.

### Failing

| Pairing | Light | Dark | Nodes | Status |
|---|---|---|---|---|
| `primary` on `popover` | 6.82 | **2.03** ✗ | **52** | **Open — worst issue in the system** |
| `warning` on `warning-muted` | **3.07** ✗ | 8.97 | 1 | Open |
| `success` on `success-muted` | **3.15** ✗ | 8.55 | 1 | Open |
| `muted-foreground` on `accent` | **4.34** ✗ | 5.83 | **43** | Open |
| `muted-foreground` on `info-muted` | **4.34** ✗ | **3.41** ✗ | 1 | Open |
| `muted-foreground` on `sidebar-accent` | **4.34** ✗ | 5.83 | 2 | Open |
| `destructive` on `accent` | **4.37** ✗ | 5.23 | 2 | Open |
| `muted-foreground` on `secondary` | **4.30** ✗ | 5.74 | 1 | Open |
| `info-foreground` on `success` | **3.16** ✗ | 11.36 | 14 | **Fixed** → `success-foreground` |
| `primary-foreground` on `card` | 1.09 | 16.44 | 2 | **False positive** — empty leftover text nodes in the unchecked Checkbox variants. Nothing renders. |

### The two systemic causes

**`primary` is a fill token being used as a text colour.** In Dark it resolves to `blue/800` (`#193cb8`) while `popover` resolves to `neutral/900` (`#171717`) — dark blue on near-black, **2.03:1**. 52 nodes across 2 sets. In Light the same pairing is fine (6.82), so this is invisible unless you check Dark. **Fix:** introduce `primary-readable` that resolves to `blue/700` in Light and `blue/300` in Dark, and bind text to that. Never bind text to `primary`.

**`muted-foreground` is calibrated to scrape 4.5:1 on white and fails on everything else.** It is `neutral/500` (`#737373`):

| On | Light ratio |
|---|---|
| `card` / `popover` (`#ffffff`) | 4.73 ✓ |
| `muted` (`#fafafa`) | 4.53 ✓ *(passes by 0.03)* |
| `accent` (`#f5f5f5`) | **4.34** ✗ |
| `secondary` (`#f4f4f5`) | **4.30** ✗ |

Every tinted surface fails. **Fix:** darken `muted-foreground` one step. Which brings us to the ramp.

### Focus ring — passes, but thin in Dark

`ring` against every surface it can appear on. Requirement 3:1.

| Surface | Light | Dark |
|---|---|---|
| `background` | 4.73 | 4.18 |
| `card` / `popover` | 4.73 | 3.79 |
| `sidebar` | 4.53 | 3.79 |
| `muted` | 4.53 | **3.19** |
| `accent` | 4.34 | **3.19** |
| `secondary` | 4.30 | **3.15** |

All pass, but 3.15 leaves no margin. A one-step darkening of `ring` in Dark would be cheap insurance.

---

## The ramp has holes

Every fix above is blocked by the same thing: **there is no adjacent primitive to step to.**

| Ramp | Steps present | Missing |
|---|---|---|
| `neutral` | 50, 100, 200, 400, 500, 800, 900, 950 | **300, 600, 700** |
| `blue` | 50, 300, 500, 600, 700, 800 | 900 (and a step between 700–800) |
| `red` | 400, 600 | 50, 500, 700, 950 |
| `green` | 50, 400, 600, 950 | 200, 700 |
| `amber` | 50, 400, 600, 950 | 200, 700 |

Consequences, concretely:

- `muted-foreground` cannot darken — there is no `neutral/600`.
- `accent-hover` in Dark had to borrow `zinc/800`, a hair off `neutral/800`, because there is no `neutral/700`.
- `destructive-hover` currently resolves to the **same value** as `destructive` in both modes, because `red` has only two steps. The token exists but does nothing yet.
- `primary-active` reuses `blue/800` in Light, so hover and active are identical there.

**Recommendation:** fill `neutral/300/600/700`, `red/700`, `green/700`, `amber/700`. That is 6 primitives and it unblocks every contrast fix plus three interaction tokens.

---

## Interaction states — was a real defect, now fixed

Six variant groups had a `Hover` variant that was **pixel-identical to `Default`**:

| Component | Was | Now |
|---|---|---|
| `Button` Primary (both sizes) | `primary` → `primary` | `primary` → **`primary-hover`** |
| `Button` Secondary / Outline / Ghost | `accent` → `accent` | `accent` → **`accent-hover`** |
| `Toggle` unpressed | `card` → `card` | `card` → **`accent`** |
| `Toggle` pressed | `accent` → `accent` | `accent` → **`accent-hover`** |
| `Switch / Root` checked | `primary` → `primary` | `primary` → **`primary-hover`** |
| `Switch / Root` unchecked | `accent` → `accent` | `accent` → **`accent-hover`** |

**A Primary button had no hover affordance at all.** The variant existed and documented nothing.

Four tokens added, aliased to existing primitives, mode-correct (Light steps darker, Dark steps lighter):

| Token | Light | Dark | Note |
|---|---|---|---|
| `primary-hover` | `blue/800` | `blue/700` | Working |
| `primary-active` | `blue/800` | `blue/600` | Light collides with hover — needs a blue step |
| `accent-hover` | `neutral/200` | `zinc/800` | Dark is barely distinguishable — needs `neutral/700` |
| `destructive-hover` | `red/600` | `red/400` | **Inert** — same as `destructive` until `red/700` exists |

14 hover variants rebound. Verified visually: Primary now visibly darkens on hover.

---

## Orphan tokens

Defined, never used by any component:

`background` · `sidebar-ring` · `success-foreground`\* · `success-muted-foreground` · `warning-muted-foreground` · `info-muted-foreground`

`background` is expected — components paint `card`, the page paints `background`. The four `*-muted-foreground` tokens are a genuine gap: Alert renders its text in the **solid** tone (`warning` on `warning-muted`), which is exactly the pairing that fails contrast. Binding Alert text to the `*-muted-foreground` tokens instead would fix `warning`/`success` on muted **and** retire the orphans.

\* `success-foreground` is now used, via the Badge fix.

---

## Rules

1. **Never bind text to a fill token.** `primary`, `success`, `warning`, `destructive` are fills. Text uses the matching `*-foreground` or `*-muted-foreground`.
2. **Check both modes.** `primary on popover` is 6.82 in Light and 2.03 in Dark. A Light-only check would have shipped it.
3. **Surfaces stack `background` → `card`/`sidebar` → `popover`.** Overlays use `popover`, not `card`, so Dark can diverge — and it does.
4. **`accent` is the interaction tint, not a brand colour.** Hover and active surfaces only.
5. **`ring` is the focus ring only.** Never a fill, border or text colour.
6. Adding a semantic token requires a Light value, a Dark value, and a role sentence — enforced by the description standard.

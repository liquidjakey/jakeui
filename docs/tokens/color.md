# Color — what to bind when building

**49 semantic tokens over 30 primitives, Light and Dark by variable mode.** Every
fill and stroke in the library is bound — 100% coverage, verified.

Bind to semantic tokens. Never to a primitive, never to a hex. Every name below is
a real CSS custom property in [`tokens/globals.css`](../../tokens/globals.css).

Typography's counterpart: [typography.md](./typography.md).

---

## The semantic groups

| Group | Tokens |
|---|---|
| **Surface** | `background` `card` `popover` `muted` `accent` `secondary` `sidebar` `input` |
| **Text / foreground** | `foreground` `card-foreground` `popover-foreground` `muted-foreground` `accent-foreground` `secondary-foreground` `primary-foreground` `sidebar-foreground` |
| **Border & focus** | `border` `input` `ring` `sidebar-border` `sidebar-ring` |
| **Brand & action** | `primary` `primary-hover` `primary-active` `primary-foreground` **`primary-readable`** `accent-hover` `sidebar-primary` `sidebar-primary-foreground` |
| **Feedback** | `success` `warning` `destructive` `info`, each with `-foreground`, `-muted`, `-muted-foreground` (`destructive` adds `-hover`) |
| **Sidebar** | `sidebar` `sidebar-foreground` `sidebar-accent` `sidebar-accent-foreground` `sidebar-border` `sidebar-ring` |
| **Chart** | `chart-1` … `chart-5` |

Usage in code — Tailwind v4 generates the utilities from `@theme`:

```tsx
<div className="bg-card text-card-foreground border border-input rounded-lg">
<p  className="text-muted-foreground">Secondary copy</p>
```

---

## Rules

1. **Never bind text to a fill token.** `primary`, `success`, `warning`, `destructive` are fills. Text uses the matching `*-foreground`, `*-muted-foreground`, or `primary-readable`. See the constraint below — this one has already caused a shipped defect.
2. **Check both modes.** `primary` on `popover` is 6.82:1 in Light and **2.03:1 in Dark**. A Light-only check would have shipped it.
3. **Surfaces stack `background` → `card`/`sidebar` → `popover`.** Overlays use `popover`, not `card`, so Dark can diverge — and it does.
4. **`accent` is the interaction tint, not a brand colour.** Hover and active surfaces only.
5. **`ring` is the focus ring only.** Never a fill, border or text colour.
6. **Adding a semantic token requires a Light value, a Dark value, and a role sentence.** Enforced by the description standard — see [figma-descriptions.md](../figma-descriptions.md).

---

## Interaction states

All four work as of 9 Aug 2026 — the retrofit's refine phase added the missing
primitive steps they were waiting on.

| Token | Light | Dark | Status |
|---|---|---|---|
| `primary-hover` | `blue/800` | `blue/700` | ✅ Working |
| `primary-active` | `blue/900` | `blue/600` | ✅ **Fixed** — was `blue/800` in Light, identical to hover. `blue/900` added. |
| `accent-hover` | `neutral/200` | `neutral/700` | ✅ **Fixed** — was borrowing `zinc/800`, a hair off `neutral/800`. `neutral/700` added. |
| `destructive-hover` | `red/700` | `red/300` | ✅ **Fixed** — was inert (identical to `destructive` in both modes). `red/700` + `red/300` added. |

A component whose hover is pixel-identical to its default is a bug — six variant
groups shipped that way before 8 Aug 2026. Use these tokens.

---

## Known constraints — read before building

These are open and will bite you if you don't know them.

**Never bind text to `primary` — use `primary-readable`.** `primary` is a fill. In
Dark it resolves to `blue/800` (`#193cb8`) against `popover` at `neutral/900`
(`#171717`) — dark blue on near-black, **2.03:1** across 52 nodes in 2 sets. It
passes in Light (6.82), so it is invisible unless you check Dark.

`primary-readable` was added 9 Aug 2026 for exactly this: `blue/700` in Light,
`blue/300` in Dark. **All 75 existing text bindings were rebound the same day** —
Dark went from 2.03:1 to 9.89:1, and Light did not change at all, because
`primary-readable` aliases the same primitive as `primary` in Light.

**Red text is the exception to rule 1.** 62 text nodes bind `destructive`, and they
were deliberately left alone: they pass (4.76:1 Light, 6.19:1 Dark), and
`destructive-foreground` is near-white — it is the colour for text *on* a destructive
fill, not for destructive-coloured text. There is no `destructive-readable` yet. Two
pairings still fail and rebinding cannot fix them: 3 nodes on `accent` in Light
(4.37:1), and 2 nodes on an unbound literal fill (2.89:1 in Dark).

**`muted-foreground` was darkened on 9 Aug 2026 and now passes everywhere.** Light
moved from `neutral/500` (`#737373`) to `neutral/600` (`#525252`); Dark is unchanged
at `neutral/400`.

| On | Light before | Light now | Dark now |
|---|---|---|---|
| `card` / `popover` | 4.73 | **7.81** | 6.91 |
| `muted` | 4.53 *(by 0.03)* | **7.48** | 5.83 |
| `accent` | **4.34** ✗ | **7.16** | 5.83 |
| `secondary` | **4.30** ✗ | **7.10** | 5.74 |
| `sidebar` | 4.53 | **7.48** | 6.91 |

This touched 2,206 bindings, so secondary text is noticeably darker than it was
before that date. That is intentional and was reviewed visually before it landed.

**The focus ring passes but has no margin in Dark.** `ring` against `secondary` is
**3.15:1** against a 3:1 requirement. Do not reduce ring contrast further.

**Alert's text is bound to the wrong tone, and the fix needs both halves.** Alert
renders its text in the **solid** tone — `warning` on `warning-muted` — which fails at
**3.07:1** (success: 3.15:1). The `*-muted-foreground` tokens exist for this, but until
9 Aug 2026 they resolved to *the same primitives as the solid tokens*
(`warning-muted-foreground` → `amber/600` → identical to `warning`), so rebinding alone
would have changed nothing.

Their values are now fixed — `warning-muted-foreground` → `amber/700` (**4.84:1** ✓),
`success-muted-foreground` → `green/700` (**4.79:1** ✓). **When you build Alert, bind
its text to `*-muted-foreground`** and the contrast passes. The four tokens are used
only by documentation swatches today, so nothing else moves.

**The primitive ramp still has holes, but the load-bearing ones are filled.** Added
9 Aug 2026: `neutral/300` `neutral/600` `neutral/700` `red/300` `red/700` `green/700`
`amber/700` `blue/900`.

| Ramp | Steps present | Still missing |
|---|---|---|
| `neutral` | 50, 100, 200, **300**, 400, 500, **600**, **700**, 800, 900, 950 | — complete |
| `blue` | 50, 300, 500, 600, 700, 800, **900** | a step between 700–800 |
| `red` | **300**, 400, 600, **700** | 50, 500, 950 |
| `green` | 50, 400, 600, **700**, 950 | 200 |
| `amber` | 50, 400, 600, **700**, 950 | 200 |

What remains is cosmetic ramp completeness, not a blocker. See
[`notes/figma-cleanup-backlog.md`](../../notes/figma-cleanup-backlog.md).

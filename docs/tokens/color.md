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
| **Brand & action** | `primary` `primary-hover` `primary-active` `primary-foreground` `accent-hover` `sidebar-primary` `sidebar-primary-foreground` |
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

1. **Never bind text to a fill token.** `primary`, `success`, `warning`, `destructive` are fills. Text uses the matching `*-foreground` or `*-muted-foreground`. See the constraint below — this one has already caused a shipped defect.
2. **Check both modes.** `primary` on `popover` is 6.82:1 in Light and **2.03:1 in Dark**. A Light-only check would have shipped it.
3. **Surfaces stack `background` → `card`/`sidebar` → `popover`.** Overlays use `popover`, not `card`, so Dark can diverge — and it does.
4. **`accent` is the interaction tint, not a brand colour.** Hover and active surfaces only.
5. **`ring` is the focus ring only.** Never a fill, border or text colour.
6. **Adding a semantic token requires a Light value, a Dark value, and a role sentence.** Enforced by the description standard — see [figma-descriptions.md](../figma-descriptions.md).

---

## Interaction states

Four interaction tokens exist. Use them — a component whose hover is
pixel-identical to its default is a bug, and six variant groups shipped that way
before 8 Aug 2026.

| Token | Light | Dark | Status when building |
|---|---|---|---|
| `primary-hover` | `blue/800` | `blue/700` | **Working.** Use for Primary button hover. |
| `primary-active` | `blue/800` | `blue/600` | ⚠️ **Light collides with `primary-hover`** — hover and active look identical in Light. Needs a new blue step to fix. |
| `accent-hover` | `neutral/200` | `zinc/800` | ⚠️ **Barely distinguishable in Dark** — `zinc/800` is a hair off `neutral/800` because there is no `neutral/700`. |
| `destructive-hover` | `red/600` | `red/400` | ⚠️ **Inert.** Resolves to the same value as `destructive` in both modes because `red` has only two steps. The token exists but does nothing yet. |

Bind to them anyway. When the missing primitives land, every consumer fixes at
once; hardcoding around them now means hunting them down later.

---

## Known constraints — read before building

These are open and will bite you if you don't know them.

**`primary` is a fill being used as a text colour, and it fails in Dark.** In Dark
it resolves to `blue/800` (`#193cb8`) against `popover` at `neutral/900`
(`#171717`) — dark blue on near-black, **2.03:1** across 52 nodes in 2 sets. It
passes in Light (6.82), so it is invisible unless you check Dark. **Never bind text
to `primary`.** The planned fix is a `primary-readable` token resolving to
`blue/700` in Light and `blue/300` in Dark.

**`muted-foreground` is calibrated to scrape 4.5:1 on white and fails on every
tinted surface.** It is `neutral/500` (`#737373`):

| On | Light ratio |
|---|---|
| `card` / `popover` (`#ffffff`) | 4.73 ✓ |
| `muted` (`#fafafa`) | 4.53 ✓ *(passes by 0.03)* |
| `accent` (`#f5f5f5`) | **4.34** ✗ |
| `secondary` (`#f4f4f5`) | **4.30** ✗ |

It cannot be darkened — the neutral ramp has no step between 500 and 800. If you
are placing secondary text on `accent` or `secondary`, you are below AA and there
is currently no compliant token for it.

**The focus ring passes but has no margin in Dark.** `ring` against `secondary` is
**3.15:1** against a 3:1 requirement. Do not reduce ring contrast further.

**Four `*-muted-foreground` tokens are defined but unused.** `success-muted-foreground`,
`warning-muted-foreground`, `info-muted-foreground` (and `sidebar-ring`). Alert
currently renders its text in the **solid** tone (`warning` on `warning-muted`),
which is exactly the pairing that fails contrast at 3.07:1. **When you build Alert,
bind its text to the `*-muted-foreground` tokens** — that fixes the contrast and
retires the orphans in one move.

**The primitive ramp has holes**, which is why every fix above is blocked:

| Ramp | Steps present | Missing |
|---|---|---|
| `neutral` | 50, 100, 200, 400, 500, 800, 900, 950 | **300, 600, 700** |
| `blue` | 50, 300, 500, 600, 700, 800 | 900, and a step between 700–800 |
| `red` | 400, 600 | 50, 500, 700, 950 |
| `green` | 50, 400, 600, 950 | 200, 700 |
| `amber` | 50, 400, 600, 950 | 200, 700 |

Filling `neutral/300/600/700`, `red/700`, `green/700`, `amber/700` — six primitives —
unblocks every contrast fix plus three interaction tokens. That is Figma work; see
[`notes/figma-cleanup-backlog.md`](../../notes/figma-cleanup-backlog.md).

# Typography — what to bind when building

**Inter — single typeface. Fourteen semantic styles.** Every style is bound to a
Typography Primitives variable in Figma and mirrored in
[`tokens/globals.css`](../../tokens/globals.css), so the two cannot drift.

Bind to a style. Never to raw metrics. Color's counterpart: [color.md](./color.md).

---

## The ramp

Derived from actual usage, not invented — node counts are real.

| Style | Utility | Font | Size / LH | Where it goes | Nodes |
|---|---|---|---|---|---|
| `Heading/LG` | `text-heading-lg` | Semi Bold | 18 / 26 | Dialog, drawer and sheet titles | 18 |
| `Heading/MD` | `text-heading-md` | Semi Bold | 16 / 24 | Section titles in a page or large card | 2 |
| `Heading/SM` | `text-heading-sm` | Semi Bold | 15 / 22 | Brand marks, sidebar wordmark, empty-state titles | 10 |
| `Heading/XS` | `text-heading-xs` | Semi Bold | 14 / 20 | Card, popover and alert titles — the default heading in dense UI | 63 |
| `Label/LG` | `text-label-lg` | Medium | 14 / 20 | Button labels, primary actions | 94 |
| **`Label/MD`** | `text-label-md` | Medium | 13 / 18 | **The default UI label** — menu items, rows, tabs, field labels | 117 |
| `Label/SM` | `text-label-sm` | Medium | 12 / 16 | Table headers, badges, calendar dates, chips | 168 |
| `Label/XS` | `text-label-xs` | Medium | 11 / 16 | Sidebar section headers, overlines | 28 |
| `Body/MD` | `text-body-md` | Regular | 14 / 20 | Field values, dialog descriptions | 31 |
| **`Body/SM`** | `text-body-sm` | Regular | 13 / 18 | **The default UI body** — table cell values, menu descriptions | 55 |
| `Body/XS` | `text-body-xs` | Regular | 12 / 18 | Secondary copy under a label, footnotes, metadata | 130 |
| `Caption/SM` | `text-caption-sm` | Regular | 12 / 16 | Helper text, keyboard shortcuts | 31 |
| `Caption/XS` | `text-caption-xs` | Regular | 11 / 16 | Micro captions and shortcut hints in dense menus | 14 |
| `Value/Strong` | `text-value-strong` | Semi Bold | 13 / 18 | Emphasised table or data values | 3 |

Style names map to utilities mechanically: `Label/MD` → `text-label-md`.

---

## Pairing

| Surface | Pair |
|---|---|
| Dense UI — menus, rows, tables | `Label/MD` + `Body/SM` ← the default |
| Comfortable UI — forms, dialogs | `Label/LG` + `Body/MD` |
| Cards, popovers, alerts | `Heading/XS` + `Body/SM` |
| Dialogs, drawers, sheets | `Heading/LG` + `Body/MD` |

Do not mix densities inside one surface. A 14px label above a 13px body reads as a
mistake, not a hierarchy.

---

## In code

```tsx
<h2 className="text-heading-xs">Share workspace</h2>
<p  className="text-body-sm text-muted-foreground">Invite teammates and control access.</p>
<button className="text-label-lg">Save changes</button>
```

Each utility carries its own `--font-weight` and `--line-height`, so one class sets
all three axes. Do not add `font-medium` or `leading-*` alongside it — you will
desynchronise the style from its Figma counterpart.

---

## Rules

1. **Bind to a style, never to raw metrics.** If no style fits, the answer is a design decision, not a one-off.
2. **Never introduce a new size/line-height pair without adding a ramp step and a usage line.** That is how 35 distinct combinations accumulated before the ramp existed.
3. **Line height is part of the style.** Changing it alone creates a near-duplicate that no one can distinguish and every agent will mis-copy.
4. **Letter spacing is `0` everywhere.** There is no tracking system; do not invent one per-component.
5. **Figma text styles and the `@theme` block in `globals.css` are one artifact in two places.** Change both, or neither.

---

## Two things to know

**`size/13` and `line-height/18` are load-bearing.** Together they are `Label/MD`
and `Body/SM` — 2,704 live bindings between them. They were once mislabelled
"exception tokens pending reconciliation." **They are first-class ramp members. Do
not delete them and do not snap them to a coarser step.**

**Some primitives in `globals.css` are drift-only.** `--text-size-12-8`,
`--leading-17`, `--leading-19` and `--leading-21` are referenced only by nodes that
do not match any ramp step. **Never bind a new component to these.** They are
scheduled for removal once the Figma-side drift is snapped — see
[`notes/figma-cleanup-backlog.md`](../../notes/figma-cleanup-backlog.md) for the
450-node drift report.

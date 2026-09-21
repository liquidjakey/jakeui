# Typography — what to bind when building

**Inter — single typeface. Fourteen semantic styles.** Every style is bound to a
Typography Primitives variable in Figma and mirrored in
[`tokens/globals.css`](../../tokens/globals.css). Generation and computed-style checks detect drift within their tested scope.

Bind to a style. Never to raw metrics. Color's counterpart: [color.md](./color.md).

---

## The ramp

| Style | Utility | Font | Size / LH | Where it goes |
|---|---|---|---|---|
| `Heading/LG` | `text-heading-lg` | Semi Bold | 18 / 26 | Dialog, drawer and sheet titles |
| `Heading/MD` | `text-heading-md` | Semi Bold | 16 / 24 | Section titles in a page or large card |
| `Heading/SM` | `text-heading-sm` | Semi Bold | 15 / 22 | Brand marks, sidebar wordmark, empty-state titles |
| `Heading/XS` | `text-heading-xs` | Semi Bold | 14 / 20 | Card, popover and alert titles — the default heading in dense UI |
| `Label/LG` | `text-label-lg` | Medium | 14 / 20 | Button labels, primary actions |
| **`Label/MD`** | `text-label-md` | Medium | 13 / 18 | **The default UI label** — menu items, rows, tabs, field labels |
| `Label/SM` | `text-label-sm` | Medium | 12 / 16 | Table headers, badges, calendar dates, chips |
| `Label/XS` | `text-label-xs` | Medium | 11 / 16 | Sidebar section headers, overlines |
| `Body/MD` | `text-body-md` | Regular | 14 / 20 | Field values, dialog descriptions |
| **`Body/SM`** | `text-body-sm` | Regular | 13 / 18 | **The default UI body** — table cell values, menu descriptions |
| `Body/XS` | `text-body-xs` | Regular | 12 / 18 | Secondary copy under a label, footnotes, metadata |
| `Caption/SM` | `text-caption-sm` | Regular | 12 / 16 | Helper text, keyboard shortcuts |
| `Caption/XS` | `text-caption-xs` | Regular | 11 / 16 | Micro captions and shortcut hints in dense menus |
| `Value/Strong` | `text-value-strong` | Semi Bold | 13 / 18 | Emphasised table or data values |

Style names map to utilities mechanically: `Label/MD` → `text-label-md`.

---

## Pairing

| Surface | Pair |
|---|---|
| Dense UI — menus, rows, tables | `Label/MD` + `Body/SM` ← the default |
| Comfortable UI — forms, dialogs | `Label/LG` + `Body/MD` |
| Cards, popovers, alerts | `Heading/XS` + `Body/SM` |
| Dialogs, drawers, sheets | `Heading/LG` + `Body/MD` |

Use these pairings as defaults. Existing component-level bindings and named runtime exceptions remain authoritative; do not rewrite component typography to force a pairing.

---

## In code

```tsx
<h2 className="text-heading-xs">Share workspace</h2>
<p  className="text-body-sm text-muted-foreground">Invite teammates and control access.</p>
<Button>Save changes</Button>
```

Each utility carries its own `--font-weight` and `--line-height`, so one class sets
all three axes. Do not add `font-medium` or `leading-*` alongside it — you will
desynchronise the style from its Figma counterpart.

---

## Rules

1. **Bind to a style, never to raw metrics.** If no style fits, the answer is a design decision, not a one-off.
2. **Never introduce a new size/line-height pair without adding a ramp step and a usage line.**
3. **Line height is part of the style.** Changing it alone creates a near-duplicate that no one can distinguish and every agent will mis-copy.
4. **Letter spacing is `0` everywhere.** There is no tracking system; do not invent one per-component.
5. **Figma text styles and the `@theme` block in `globals.css` are one artifact in two places.** Change both, or neither.

---

## Primitive restrictions

`size/13` and `line-height/18` are first-class ramp members used by Label/MD and Body/SM. Do not delete them or snap them to a coarser step.

`--text-size-12-8`, `--leading-17`, `--leading-19` and `--leading-21` are not semantic ramp steps. Do not bind new components to these exported primitives; choose a complete semantic style.

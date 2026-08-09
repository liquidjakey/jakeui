# Typography

**Inter — single typeface.** Fourteen semantic styles. Every style is bound to a Typography Primitives variable in Figma and mirrored in `design-system/tokens/globals.css`, so the two cannot drift.

Benchmarked against CRRT — see [description-standard.md](./description-standard.md).

---

## What was wrong

Jake UI had no type system, only raw primitives. Three findings:

1. **35 distinct type combinations** were in use across the component masters. Not a ramp — an accumulation.
2. **The Typography page documented styles that did not exist and were never used.** It showed `UI/Caption/10`, `UI/Label/SM` (12.8px), `UI/Body/MD` — but 12.8px appears in **zero** component nodes, and none of those styles was applied anywhere. The documented ramp was fictional; an agent reading it would have built the wrong thing.
3. **Nothing told an agent what a size *meant*.** `size/13` + `line-height/18` + `weight/500` is a fact, not an instruction. Whether that combination is a menu label or a caption was unrecoverable from the file.

The ramp below is **derived from actual usage**, not invented. Counts are real node counts.

---

## The ramp

| Style | Font | Size / LH | Where it goes | Nodes |
|---|---|---|---|---|
| `Heading/LG` | Semi Bold | 18 / 26 | Dialog, drawer and sheet titles | 18 |
| `Heading/MD` | Semi Bold | 16 / 24 | Section titles in a page or large card | 2 |
| `Heading/SM` | Semi Bold | 15 / 22 | Brand marks, sidebar wordmark, empty-state titles | 10 |
| `Heading/XS` | Semi Bold | 14 / 20 | Card, popover and alert titles — the default heading in dense UI | 63 |
| `Label/LG` | Medium | 14 / 20 | Button labels, primary actions | 94 |
| **`Label/MD`** | Medium | 13 / 18 | **The default UI label** — menu items, rows, tabs, field labels | 117 |
| `Label/SM` | Medium | 12 / 16 | Table headers, badges, calendar dates, chips | 168 |
| `Label/XS` | Medium | 11 / 16 | Sidebar section headers, overlines | 28 |
| `Body/MD` | Regular | 14 / 20 | Field values, dialog descriptions | 31 |
| **`Body/SM`** | Regular | 13 / 18 | **The default UI body** — table cell values, menu descriptions | 55 |
| `Body/XS` | Regular | 12 / 18 | Secondary copy under a label, footnotes, metadata | 130 |
| `Caption/SM` | Regular | 12 / 16 | Helper text, keyboard shortcuts | 31 |
| `Caption/XS` | Regular | 11 / 16 | Micro captions and shortcut hints in dense menus | 14 |
| `Value/Strong` | Semi Bold | 13 / 18 | Emphasised table or data values | 3 |

**764 nodes** now carry a named style. Applied only to exact metric matches, so **zero pixel change**.

### Pairing

| Surface | Pair |
|---|---|
| Dense UI — menus, rows, tables | `Label/MD` + `Body/SM` ← the default |
| Comfortable UI — forms, dialogs | `Label/LG` + `Body/MD` |
| Cards, popovers, alerts | `Heading/XS` + `Body/SM` |
| Dialogs, drawers, sheets | `Heading/LG` + `Body/MD` |

Do not mix densities inside one surface. A 14px label above a 13px body reads as a mistake, not a hierarchy.

### In code

Tailwind v4 generates the utilities from `@theme` in `globals.css`:

```tsx
<h2 className="text-heading-xs">Share workspace</h2>
<p  className="text-body-sm text-muted-foreground">Invite teammates and control access.</p>
<button className="text-label-lg">Save changes</button>
```

Style names map to utilities mechanically: `Label/MD` → `text-label-md`.

---

## Drift — 450 nodes needing a decision

These do not match any ramp step. **Nothing was auto-snapped** — every fix changes pixels, so each is a design call, not a tooling one.

### Line-height drift on a canonical size

The same size rendered at two or three different line-heights. This is the bulk of it.

| Actual | Nodes | Canonical | Delta |
|---|---|---|---|
| Medium 13 / **19** | 98 | `Label/MD` 13/18 | +1px |
| Medium 13 / **20** | 71 | `Label/MD` 13/18 | +2px |
| Medium 11 / **17** | 60 | `Label/XS` 11/16 | +1px |
| Medium 11 / **14** | 33 | `Label/XS` 11/16 | −2px |
| Regular 13 / **20** | 29 | `Body/SM` 13/18 | +2px |
| Medium 14 / **22** | 24 | `Label/LG` 14/20 | +2px |
| Regular 11 / **17** | 12 | `Caption/XS` 11/16 | +1px |
| Regular 14 / **21** | 4 | `Body/MD` 14/20 | +1px |
| Semi Bold 16 / **22** | 4 | `Heading/MD` 16/24 | −2px |

**Recommendation:** snap all of these. The line-height differences are invisible individually and are almost certainly accidents of hand-setting. 335 nodes, ≤2px each.

### Weight gaps — a real ramp hole

| Actual | Nodes | Note |
|---|---|---|
| **Medium 12 / 18** | 41 | No ramp step. `Label/SM` is 12/16; `Body/XS` is 12/18 Regular. Either add `Label/SM-Relaxed`, or move these to `Body/XS`. |
| Semi Bold 12 / 18 | 10 | Same gap at Semi Bold. |
| Semi Bold 14 / 18 | 8 | `Heading/XS` is 14/20. |
| Semi Bold 13 / 16 | 7 | `Value/Strong` is 13/18. |
| Semi Bold 12 / 16 | 5 | Semi Bold at `Label/SM` metrics. |

**Recommendation:** decide whether Semi Bold needs its own steps at 12 and 14. Right now `Value/Strong` (13/18) is the only Semi Bold body step, and five other Semi Bold combinations exist ad hoc.

### One-offs

`Medium 15/22` ×4 · `Semi Bold 12/14` ×3 · `Semi Bold 11/14` ×2 · `Semi Bold 18/22` ×2 · `Regular 10/16` ×2 · `Regular 14/auto` ×2.

**Recommendation:** snap to the nearest step. None is load-bearing.

### Not typography

`Regular 1/1` ×29 — the `Spacer` hack in `Dropdown Menu / Checkbox Item` and `Dropdown Menu / Root Composition`. Empty, zero-width text nodes used to force layout. Replace with real spacer frames; see [design-system-audit.md](./design-system-audit.md).

---

## Exception tokens still in the type scale

`size/15`, `size/18`, `size/20`, `size/22`, `line-height/12/17/18/19/21/22/26` were added on 8 Aug 2026 to eliminate raw values. Of those, the ramp now uses **`size/15`, `size/18`, `line-height/18`, `line-height/22`, `line-height/26`** — those are earning their place and should be promoted out of exception status.

`size/20`, `size/22`, `line-height/12`, `line-height/17`, `line-height/19`, `line-height/21` are used only by drift nodes. **If the drift above is snapped, these become orphans and should be deleted.**

`size/12-8` (12.8px) is referenced by nothing and was only ever used by the deleted fictional `UI/Label/SM` style. **Delete it.**

---

## Rules

1. **Bind to a style, never to raw metrics.** If no style fits, the answer is a design decision, not a one-off.
2. **Never introduce a new size/line-height pair without adding a ramp step and a usage line.** That is how 35 combinations happened.
3. **Line height is part of the style.** Changing it alone creates a near-duplicate that no one can distinguish and every agent will mis-copy.
4. Letter spacing is `0` everywhere. There is no tracking system; do not invent one per-component.
5. Figma text styles and the `@theme` block in `globals.css` are one artifact in two places. Change both, or neither.

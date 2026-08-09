# Dropdown Menu / Content

The menu surface.

- **Figma:** `Dropdown Menu / Content` — 24 variants
- **Code:** [`components/dropdown-menu.tsx`](../../components/dropdown-menu.tsx) — implemented 9 Aug 2026, exports `DropdownMenuContent`
- **Maturity:** `draft`. **Read from live bindings** — its description showed **1 of 24** rows, so nothing could be inferred.
- **Format:** [props-table-format.md](../props-table-format.md)

## The read collapsed 24 variants to 3

**`Side` and `Align` carry no colour delta whatsoever.** All 24 variants produce only
three distinct binding sets, and the only difference between those is whether the
Arrow node is present and where it sits in z-order. Both axes are purely geometric.

That is the whole answer, and it could not have been guessed — which is exactly why
this one stayed blocked while five others were recovered by inference.

## 1. Code API

| Prop | Type | Default | Req |
|---|---|---|---|
| `children` | `ReactNode` | — | ✓ |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` | |
| `arrow` | `boolean` | `false` | |
| `label` | `string` | `undefined` | |

## 2. Figma → Code mapping

| Figma property | Code | Not 1:1? |
|---|---|---|
| `Side` · `Align` | `side` · `align` | 1:1 in name; **no colour delta**, emitted as data attributes. |
| `Arrow` | `arrow` boolean | String union → real boolean. |

## 3. State → token binding

| Part | Tokens |
|---|---|
| Surface | fill `popover` · stroke `border` |
| Item, rest | fill `popover` |
| Item, highlighted | fill `accent` |
| Label, rest | `popover-foreground` |
| Label, highlighted | `accent-foreground` |
| Label, destructive | `destructive` |
| Shortcut | `muted-foreground` |
| Indicator | `muted-foreground` |
| Arrow | fill `popover` · stroke `border` |

✅ **A complete and internally consistent contract** — and notably it *does* record a
`muted-foreground` shortcut, which [`dropdown-menu-item.md`](./dropdown-menu-item.md)
had to assert. That assertion is now confirmed.

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Role | `role="menu"`, labelled. |
| Keyboard | Arrows move, Enter activates, Escape closes, type-ahead jumps. Owned by the menu. |
| Placement | Not collision-aware — same limitation as `Popover`. |


## Authoring checklist

- [x] Every Figma variant property appears in Table 2
- [x] No enum mixes co-occurring states
- [x] One concern per prop
- [x] Slots are nodes
- [x] Behavior props present
- [x] Tokens named, never hex
- [x] Missing tokens flagged — *none; the contract is complete*
- [x] Table 4 filled in
- [x] Compiles with nothing invented — *read from live bindings*

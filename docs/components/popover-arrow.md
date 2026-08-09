# Popover / Arrow

Pointer on an anchored surface.

- **Figma:** `Popover / Arrow` — 4 variants
- **Code:** [`components/popover-arrow.tsx`](../../components/popover-arrow.tsx) — implemented 9 Aug 2026, exports `PopoverArrow`
- **Maturity:** `draft`. **Read from live bindings via the Desktop Bridge**, not from the description — see `.figma-blocked-variants.json`.
- **Format:** [props-table-format.md](../props-table-format.md)

> Third **"no root-level bindings"** record. Reading it also filled the arrow gap
> [`popover.md`](./popover.md) had flagged.

## 1. Code API

| Prop | Type | Default |
|---|---|---|
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` |
| `className` | `string` | `undefined` |

## 2. Figma → Code mapping

| Figma property | Code | Not 1:1? |
|---|---|---|
| `Side` | `side` | 1:1. **No colour delta** — pure geometry. |

## 3. State → token binding

| Part | Tokens |
|---|---|
| Arrow | fill `popover` · stroke `border` — identical on all four sides |

✅ Correct pairing with the surface it points at, so the arrow reads as part of the
popover rather than a separate shape.

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Semantics | `aria-hidden`. Decorative in every case. |
| Keyboard | None. Never focusable. |


## Authoring checklist

- [x] Every Figma variant property appears in Table 2
- [x] No enum mixes co-occurring states
- [x] One concern per prop
- [x] Slots are nodes — *n/a*
- [x] Behavior props present — *n/a*
- [x] Tokens named, never hex
- [x] Missing tokens flagged — *none*
- [x] Table 4 filled in
- [x] Compiles with nothing invented — *read from live bindings*

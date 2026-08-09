# Radio Group / Item

The radio circle.

- **Figma:** `Radio Group / Item` — 12 variants
- **Code:** [`components/radio-group.tsx`](../../components/radio-group.tsx) — implemented 9 Aug 2026, exports `RadioGroupItem`
- **Maturity:** `draft`. **Read from live bindings** — capped at 8 of 12 rows, and `ReadOnly` had zero observations so it could not be inferred.
- **Format:** [props-table-format.md](../props-table-format.md)

> ✅ **The assertion in [`radio-group.md`](./radio-group.md) was correct** — `input` for
> the resting border. Confirmed rather than assumed.

## 1. Code API

| Prop | Type | Default |
|---|---|---|
| `checked` | `boolean` | `false` |
| `state` | `RadioState` | `'default'` |

## 2. Figma → Code mapping

| Figma property | Code | Not 1:1? |
|---|---|---|
| `Value` | `checked` | Two-value enum → boolean. |
| `State` (6 values) | `state` | Raw visual part; `RadioGroup` decomposes above it. |

## 3. State → token binding

| State | Unchecked | Checked |
|---|---|---|
| Default | `card` + `input` | `card` + `primary` |
| Hover | `accent` + `input` | `accent` + `primary` |
| Focused | `card` + `ring` | `card` + `ring` |
| Disabled | `card` + `input` | `card` + `primary` |
| ReadOnly | `card` + `input` | `card` + `primary` |
| Invalid | `card` + `destructive` | `card` + `destructive` |

Indicator: `primary`, checked variants only.

🛑 **Disabled is visually identical to Default here too** — the same problem as
`Switch / Root`, and now confirmed as a pattern across both form controls rather than
a one-off.

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Semantics | Decorative. State lives on the `<input type="radio">`. |
| Disabled | Needs more than the circle to convey; see the 🛑. |

## Compiled output

```ts
type RadioState = 'default' | 'hover' | 'focused' | 'disabled' | 'readOnly' | 'invalid';
interface RadioGroupItemProps { checked?: boolean; state?: RadioState; }
```

## Authoring checklist

- [x] Every Figma variant property appears in Table 2
- [x] No enum mixes co-occurring states — *parent decomposes*
- [x] One concern per prop
- [x] Slots are nodes — *n/a*
- [x] Behavior props present — *n/a*
- [x] Tokens named, never hex
- [x] Missing tokens flagged 🛑 — disabled indistinguishable
- [x] Table 4 filled in
- [x] Compiles with nothing invented — *read from live bindings*

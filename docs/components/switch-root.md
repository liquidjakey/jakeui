# Switch / Root

The switch track.

- **Figma:** `Switch / Root` — 24 variants
- **Code:** [`components/switch.tsx`](../../components/switch.tsx) — implemented 9 Aug 2026, exports `SwitchRoot`
- **Maturity:** `draft`. **Read from live bindings** — its description was capped at 8 of 24 rows.
- **Format:** [props-table-format.md](../props-table-format.md)

> ✅ **The assertion made in [`switch.md`](./switch.md) was correct.** `input` unchecked,
> `primary` checked — now confirmed rather than assumed. It was inferred from
> `Radio Group / Indicator`'s `primary`, and that inference held.

## 1. Code API

| Prop | Type | Default | Req |
|---|---|---|---|
| `checked` | `boolean` | — | ✓ |
| `size` | `'small' \| 'default'` | `'default'` | |
| `state` | `'default' \| 'hover' \| 'focused' \| 'disabled' \| 'readOnly' \| 'invalid'` | `'default'` | |
| `children` | `ReactNode` | `undefined` | |

## 2. Figma → Code mapping

| Figma property | Code | Not 1:1? |
|---|---|---|
| `Value` | `checked` | Two-value enum → boolean. |
| `Size` | `size` | **No colour delta** — geometry only. |
| `State` (6 values) | `state` | Kept as an enum **here** because this is the raw visual part; `Switch` above it decomposes properly into `disabled`. |

## 3. State → token binding

| State | Unchecked | Checked |
|---|---|---|
| Default | `input` | `primary` |
| Hover | `accent-hover` | `primary-hover` |
| Focused | `input` + `ring` stroke | `primary` + `ring` stroke |
| Disabled | `input` | `primary` |
| ReadOnly | `input` | `primary` |
| Invalid | `input` + `destructive` stroke | `primary` + `destructive` stroke |

Thumb: `card` on every variant.

🛑 **Disabled and ReadOnly bind EXACTLY the same tokens as Default.** A disabled switch
is visually indistinguishable from an operable one — only the opacity applied in
`Switch` separates them, and that is code, not a token. **This is a real accessibility
problem**, not a cosmetic one: nothing in the design file communicates that the control
cannot be used.

⚠️ `primary-hover` and `accent-hover` appear here and in **no doc record anywhere**.

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Semantics | None — decorative. All state lives on the parent `role="switch"`. |
| Disabled | Must be conveyed by more than the track; see the 🛑 above. |

## Compiled output

```ts
interface SwitchRootProps {
  checked: boolean;
  size?: 'small' | 'default';
  state?: 'default' | 'hover' | 'focused' | 'disabled' | 'readOnly' | 'invalid';
  children?: React.ReactNode;
}
```

## Authoring checklist

- [x] Every Figma variant property appears in Table 2
- [x] No enum mixes co-occurring states — *the parent decomposes; this part is the raw visual*
- [x] One concern per prop
- [x] Slots are nodes
- [x] Behavior props present — *n/a, decorative*
- [x] Tokens named, never hex
- [x] Missing tokens flagged 🛑 — disabled is indistinguishable from default
- [x] Table 4 filled in
- [x] Compiles with nothing invented — *read from live bindings*

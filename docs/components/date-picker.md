# Date Picker

Text field plus a calendar popover.

- **Figma:** `Date Picker` — 14 variants
- **Code:** [`components/date-picker.tsx`](../../components/date-picker.tsx) — implemented 9 Aug 2026, exports `DatePicker`
- **Maturity:** `draft`. **Read from live bindings** — its description showed 3 of 14 rows.
- **Format:** [props-table-format.md](../props-table-format.md)

## This read also settled Calendar

The most valuable thing in this component's bindings is not its own field states — it
is **the authoritative day states that [`calendar.md`](./calendar.md) names in prose
and binds nowhere.**

| Day state | Live binding | vs. what Calendar asserted |
|---|---|---|
| default | `card` fill, `foreground` text | ✅ |
| **today** | `card` fill + **`primary` STROKE** | ❌ asserted a `ring` outline — **corrected** |
| selected | `primary` fill, `primary-foreground` text | ✅ |
| range middle | `accent` fill, `accent-foreground` text | ✅ |
| outside / disabled | `card` fill, `muted-foreground` text | ✅ |

Four of five assertions held. `calendar.tsx` has been corrected on the fifth.

## 1. Code API

| Prop | Type | Default | Req |
|---|---|---|---|
| `value` | `Date \| undefined` | — | ✓ |
| `onChange` | `(d: Date) => void` | — | ✓ |
| `label` | `string` | — | ✓ |
| `mode` | `'single' \| 'range'` | `'single'` | |
| `invalid` / `disabled` | `boolean` | `false` | |
| `errorMessage` | `string` | `undefined` | |
| `format` | `(d: Date) => string` | locale | |

## 2. Figma → Code mapping

| Figma property | Code | Not 1:1? |
|---|---|---|
| `Mode` | `mode` | 1:1. |
| `State` (Default · Focused · Error · Disabled) | `invalid` + `disabled` | **Yes.** `kind: decompose`; Focused is `:focus-visible`. |
| `Open` | **internal state** | **Yes.** Unlike `Dropdown Menu / Trigger`, this popup has no external consumer that needs to drive it, so `open` stays internal rather than becoming a controlled prop. |

## 3. State → token binding

| Field state | Tokens |
|---|---|
| Default | `card` + `input`; value `foreground` |
| Focused | `card` + `ring` |
| Error | `card` + `destructive`; helper text `destructive` |
| Disabled | `muted` + `input`; value `muted-foreground` |

Calendar surface: `card` + `border`. Day states as in the table above.

⚠️ **The trailing icon binds `foreground` even in the disabled variant**, so it stays
full-strength while the value beside it goes muted. Transcribed as bound.

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Trigger | A button with `aria-haspopup="dialog"` and `aria-expanded`. |
| Error | `aria-invalid` plus a message linked by `aria-describedby`, announced politely. |
| Calendar | Full grid semantics — see [`calendar.md`](./calendar.md) Table 4. |
| Typing | ⚠️ The archetype asks that a date be typeable as well as picked. This asset records only a button trigger, so typing is **not** implemented — a real gap against the archetype, recorded rather than invented. |

## Compiled output

```ts
interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date) => void;
  label: string;
  mode?: 'single' | 'range';
  invalid?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  format?: (d: Date) => string;
}
```

## Authoring checklist

- [x] Every Figma variant property appears in Table 2
- [x] No enum mixes co-occurring states
- [x] One concern per prop
- [x] Slots are nodes
- [x] Behavior props present
- [x] Tokens named, never hex
- [x] Missing tokens flagged ⚠️ — disabled icon; typing gap
- [x] Table 4 filled in
- [ ] **Compiles with nothing invented** — the field and day states are read, but the archetype's "allow typing the date" is unimplemented because no asset records it.

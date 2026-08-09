# Radio Group / Root

The radio group wrapper.

- **Figma:** `Radio Group / Root` — 24 variants
- **Code:** [`components/radio-group.tsx`](../../components/radio-group.tsx) — implemented 9 Aug 2026, exports `RadioGroupRoot`
- **Maturity:** `draft`. **Read from live bindings** — capped at 7 of 24 rows.
- **Format:** [props-table-format.md](../props-table-format.md)

## The read collapsed 24 variants to 9

**`Orientation` carries no colour delta at all** — vertical and horizontal pair
identically in every case. `Default` and `ReadOnly` are identical. So 24 variants
produce only **9 distinct binding sets**.

## 1. Code API

| Prop | Type | Default | Req |
|---|---|---|---|
| `children` | `ReactNode` | — | ✓ |
| `label` | `string` | — | ✓ |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | |
| `state` | `'default' \| 'disabled' \| 'readOnly' \| 'invalid'` | `'default'` | |

## 2. Figma → Code mapping

| Figma property | Code | Not 1:1? |
|---|---|---|
| `Orientation` | `orientation` | **No colour delta** — layout only. |
| `Selection` (first · second · none) | **nothing** | **Yes.** It picks which demo item is checked — example content, not API. The real selection is the group's `value`. |
| `State` | `state` | 1:1. |

## 3. State → token binding

| State | Item stroke | Label |
|---|---|---|
| Default / ReadOnly | checked `primary`, unchecked `input` | `foreground` |
| Disabled | unchanged | `muted-foreground` |
| Invalid | **every** item `destructive` | `foreground` |

⚠️ **Disabled changes only the labels**, leaving the circles at full strength — so a
disabled group's controls still look operable. Consistent with the `Switch / Root` and
`Radio Group / Item` findings.

⚠️ **Invalid marks every item destructive**, including unchecked ones. That is the
recorded behaviour; it reads as "this group is wrong", not "this option is wrong".

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Structure | `<fieldset>` + `<legend>`. The legend is the group's name. |
| Invalid | The group needs a message, not just red strokes — colour alone fails 1.4.1. |
| Keyboard | Arrows move and select; only the selected radio is tabbable. |


## Authoring checklist

- [x] Every Figma variant property appears in Table 2
- [x] No enum mixes co-occurring states
- [x] One concern per prop
- [x] Slots are nodes
- [x] Behavior props present
- [x] Tokens named, never hex
- [x] Missing tokens flagged ⚠️ — disabled circles, invalid breadth
- [x] Table 4 filled in
- [x] Compiles with nothing invented — *read from live bindings*

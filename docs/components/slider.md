# Slider

Range input.

- **Figma:** `Slider` — 3 variants
- **Code:** [`components/slider.tsx`](../../components/slider.tsx) — implemented 9 Aug 2026, exports `Slider`
- **Maturity:** `draft`. **Read from live bindings via the Desktop Bridge**, not from the description — see `.figma-blocked-variants.json`.
- **Format:** [props-table-format.md](../props-table-format.md)

> Its description could only ever say **"no root-level bindings"** — every token lives
> on child nodes the generator does not read.

## 1. Code API

| Prop | Type | Default | Req |
|---|---|---|---|
| `value` | `number` | — | ✓ |
| `onValueChange` | `(v: number) => void` | — | ✓ |
| `label` | `string` | — | ✓ |
| `min` / `max` / `step` | `number` | `0` / `100` / `1` | |
| `disabled` | `boolean` | `false` | |

## 2. Figma → Code mapping

| Figma property | Code | Not 1:1? |
|---|---|---|
| `State` (Default · Focused · Disabled) | `disabled` | **Yes.** Focused is `:focus-visible`. |
| — | `value`, `min`, `max`, `step`, `label` | **Missing in Figma** — a static asset has no range. |

## 3. State → token binding

Read from child nodes.

| Part | Default | Focused | Disabled |
|---|---|---|---|
| Track | `muted` | `muted` | `muted` |
| Range | `primary` | `primary` | `muted-foreground` |
| Thumb | `card` + `primary` stroke | `card` + `ring` stroke | `card` + `muted-foreground` stroke |

✅ A complete, consistent contract — every state distinguishable, which several
root-level records are not.

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Element | Native `<input type="range">` under the visuals, so all platform keyboard behaviour is kept. |
| Keyboard | Arrows by `step`, PageUp/Down larger, Home/End to bounds — free with the native element. |
| Name | `label`, associated by id. The archetype also asks the current value be shown as text. |
| Value | `aria-valuenow` etc. come from the native input. |


## Authoring checklist

- [x] Every Figma variant property appears in Table 2
- [x] No enum mixes co-occurring states
- [x] One concern per prop
- [x] Slots are nodes — *n/a*
- [x] Behavior props present
- [x] Tokens named, never hex
- [x] Missing tokens flagged — *none; the contract is complete*
- [x] Table 4 filled in
- [x] Compiles with nothing invented — *read from live bindings*

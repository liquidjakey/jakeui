# Label

Form control label primitive.

- **Figma:** `Label` — node `70:329`, 3 variants
- **Code:** [`components/label.tsx`](../../components/label.tsx) — implemented 9 Aug 2026, exports `Label`
- **Maturity:** `draft`. Transcribed from `docs/components/Label.doc.json`, implemented, built in Storybook — **not yet visually reviewed**
- **Format:** [props-table-format.md](../props-table-format.md)

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `children` | `ReactNode` | — | ✓ | The label text. Figma property `Label#70:5`. |
| `htmlFor` | `string` | `undefined` | ✓ | The id of the control this labels. Required in practice — see Table 4. |
| `requirement` | `'required' \| 'optional'` | `undefined` | | Appends a marker. **Undefined means no marker at all** — see Table 2. |
| `disabled` | `boolean` | `false` | | Dims the label to match a disabled control. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Label#70:5` | string | `children` | **Yes, mildly.** A `ReactNode`, not a `string`, so a required marker or inline code can be composed in. |
| `Type` | Required · Optional | `requirement` | **Yes.** Figma has exactly two values; code has **three** states, because the common case is a label with no marker at all and Figma has no variant for it. `undefined` is that third state, and it is the default. The record's own dont makes this necessary: *"Do not mark both required and optional fields — pick whichever is rarer"* — which means most labels carry neither marker. |
| `State` | Default · Disabled | `disabled` boolean | **Yes — a deliberate divergence from `figma.map.json`.** The map types this `kind: prop` with `type: "'default' \| 'disabled'"`. It is emitted as a boolean instead, for two reasons. First, the record's own description carries the governance rule: *"Visual State axes are QA/story states unless engineering explicitly approves a controlled runtime prop"*, and no such approval exists. Second, every other control in this system (`Input`, `Textarea`, `NativeSelect`) expresses this as `disabled: boolean`; a two-value enum here would be the odd one out for no gain. |
| — | — | `htmlFor` | **Missing in Figma.** The association is the entire point of a label and has no visual representation. |

---

## 3. State → token binding

Transcribed from `Label.doc.json`. Two rows for three variants — the `Type=Optional`
variant carries no token delta, so nothing is truncated.

| State | Trigger | Tokens applied |
|---|---|---|
| Default | base | text `foreground` · type `size/14` |
| Disabled | `disabled === true` | text `muted-foreground` |

⚠️ **The required/optional marker has no token of its own.** `tokensUsed` lists three
tokens and none is a marker or accent colour. The marker therefore inherits the label's
own colour rather than being tinted — notably it is **not** `destructive`, which is a
common but poor convention because it reads as an error before the user has done
anything wrong. If a distinct marker colour is ever wanted, Figma owes the binding.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Element | Native `<label>`. Never a styled `<span>` — the click-to-focus behaviour is free only with the real element. |
| Association | `htmlFor` must match the control's `id`. The record: *"Bound to its control by for/id, so clicking the label focuses the control."* |
| Accessible name | The label's text **is** the control's accessible name. The record: *"keep it stable."* Do not interpolate changing values into it. |
| Required marker | The marker is decorative (`aria-hidden`), because required state is conveyed to assistive technology by the control's own `required` / `aria-required`, not by the glyph. Say once, near the form, what the marker means. |
| Disabled | Visual only. A label is never focusable, so nothing is removed from the tab order; the *control* carries the real disabled state. |
| Keyboard | None of its own. Clicking or activating it moves focus to the associated control. |

---

## Compiled output

```ts
interface LabelProps {
  children: React.ReactNode;
  htmlFor: string;
  requirement?: 'required' | 'optional';
  disabled?: boolean;
}
```

---

## Authoring checklist

- [x] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [x] No enum in Table 1 mixes states that can co-occur at runtime
- [x] No prop in Table 1 covers two concerns
- [x] Icon and content slots are typed as nodes, not booleans — `children` is a `ReactNode`
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged ⚠️ — the marker colour
- [x] Table 4 is filled in for anything interactive
- [x] The tables compile to a valid interface with nothing invented and nothing missing

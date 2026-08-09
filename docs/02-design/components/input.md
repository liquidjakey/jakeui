# Input

Single-line text input primitive.

- **Figma:** `Input` — node `70:51`, 4 variants
- **Code:** `design-system/components/input.tsx` *(not yet implemented)*
- **Maturity:** Technical QA · source parity pending
- **Format:** [props-table-format.md](../props-table-format.md)

Every token below is the **actual bound variable** read from the Figma file on 8 Aug 2026 — not a guess.

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `value` | `string` | `''` | ✓ | Current field value. Renders in `--foreground`. |
| `placeholder` | `string` | `undefined` | | Shown when `value` is empty. Should render in `--muted-foreground` — **see ⚠️ in Table 3.** |
| `leadingIcon` | `React.ReactNode` | `undefined` | | Slot before the value. Pass a `@phosphor-icons/react` component. |
| `trailingIcon` | `React.ReactNode` | `undefined` | | Slot after the value. |
| `invalid` | `boolean` | `false` | | Applies the error border. **Independent of `disabled`.** |
| `errorMessage` | `string` | `undefined` | | Announced to assistive tech. Required when `invalid` is `true`. |
| `disabled` | `boolean` | `false` | | Blocks input. **Independent of `invalid`.** |
| `onChange` | `(e: React.ChangeEvent<HTMLInputElement>) => void` | — | ✓ | Fires on value change. |
| `onFocus` / `onBlur` | `(e: React.FocusEvent<HTMLInputElement>) => void` | `undefined` | | Focus lifecycle. |
| `name` | `string` | `undefined` | | Form field name. |
| `id` | `string` | auto | | Ties the field to its `<label>`. |
| `type` | `'text' \| 'email' \| 'password' \| 'tel' \| 'url'` | `'text'` | | Native input type. |
| `required` | `boolean` | `false` | | Marks required, natively and to assistive tech. |
| `aria-label` | `string` | `undefined` | | Required only when no visible `<label>` exists. |

`focus` is deliberately absent — it is browser-owned, not a prop.

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `State` | Default · Focused · Error · Disabled | `invalid` + `disabled` booleans | **Yes.** One enum → two independent booleans. A field can be disabled *and* invalid; the Figma axis cannot express that. `Focused` is not a prop — it is `:focus-visible`. |
| `Value#70:0` | string, default `"Enter text"` | `value` **and** `placeholder` | **Yes.** One Figma property standing in for two code props with different behavior and different color tokens. The Figma default reads like a placeholder but is bound to `--foreground`, the *filled* color. |
| — | — | `leadingIcon`, `trailingIcon` | **Missing in Figma.** The master has no icon slots. Add INSTANCE_SWAP properties against the `Icon` set, or drop these props. |
| — | — | `onChange`, `onFocus`, `onBlur`, `name`, `id`, `type`, `required`, `errorMessage` | Behavior and a11y props with no Figma representation. Expected — recorded here so they are not dropped at codegen. |

---

## 3. State → token binding

| State | Trigger | Tokens applied |
|---|---|---|
| Default | base | fill `card` · border `1px` `input` · radius `radius/lg` (10) · padding `space/3` × `space/2-25` ⚠️ · text `foreground` `size/14` / `line-height/20` |
| Placeholder | `value === ''` | text `muted-foreground` ⚠️ **not represented in Figma** |
| Focus | `:focus-visible` | border `2px` `ring` — replaces the 1px default border; the only focus affordance, do not remove |
| Error | `invalid === true` | border `1px` `destructive` |
| Disabled | `disabled === true` | fill `muted` · text `muted-foreground` · no focus ring |
| Error + Disabled | both | fill `muted` · border `destructive` · text `muted-foreground` ⚠️ **no Figma variant exists** — resolve before implementing |

⚠️ **Three build blockers, visible here rather than discovered at codegen:**

1. **`space/2-25` (9px vertical padding) is an exception token** — off the 4px ramp, added 8 Aug 2026 to eliminate a raw value. Reconcile to `space/2` (8) or `space/2-5` (10), or keep it and document why.
2. **Placeholder colour is not in the Figma master.** All four variants bind the value text to `foreground`. The placeholder state exists only in code. Add a Figma representation or accept that Figma cannot show it.
3. **`Error + Disabled` has no Figma variant.** The enum cannot express it. The code must; decide the visual now, not during implementation.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Element | Native `<input>`. Never a styled `<div>`. |
| Label | Visible `<label for={id}>`, or `aria-label` when none exists. Placeholder is **not** a label. |
| Focus | 2px `ring` border on `:focus-visible`. Must survive any custom styling. Contrast ≥ 3:1 against `card` and `muted` (Governance a11y gate). |
| Error | `aria-invalid={invalid}`; `errorMessage` linked via `aria-describedby` and rendered in a live region. |
| Disabled | Native `disabled`. Removed from tab order. |
| Keyboard | Standard text-input behavior. A trailing clear button must be independently reachable by Tab. |
| Target size | Control height ≥ 24 CSS px (Governance a11y gate). At `size/14` text + `space/2-25` padding the computed height is 38px. ✓ |

---

## Compiled output

```ts
interface InputProps {
  value: string;
  placeholder?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  invalid?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url';
  required?: boolean;
  'aria-label'?: string;
}
```

---

## Authoring checklist

- [x] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [x] No enum in Table 1 mixes states that can co-occur at runtime
- [x] No prop in Table 1 covers two concerns
- [x] Icon and content slots are typed as nodes, not booleans
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged ⚠️
- [x] Table 4 is filled in for anything interactive
- [x] The tables compile to a valid interface with nothing invented and nothing missing

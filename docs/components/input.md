# Input

Single-line text input primitive.

- **Figma:** `Input` — node `70:51`, 4 variants
- **Code:** [`components/input.tsx`](../../components/input.tsx) — implemented 9 Aug 2026, exports `Input`
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
| — | — | `leadingIcon`, `trailingIcon` | **Missing in Figma.** The master has no icon slots. **Decided 9 Aug 2026: kept in code**, because Table 1 and the compiled interface both specify them and the container is already an auto-layout row with `gap-2`. Figma still owes `INSTANCE_SWAP` properties against the `Icon` set — until then these two slots exist only in code and cannot be reviewed in the design file. |
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
| Error + Disabled | both | fill `muted` · border `destructive` · text `muted-foreground` — code-only, see decision 3 |

### The three build blockers — resolved at implementation, 9 Aug 2026

1. **`space/2-25` (9px vertical padding) — kept.** It is not an exception token. The
   8 Aug binding census promoted all 24 half-step tokens to first-class ramp members;
   `space/2-25` carries live bindings and reconciling it to `space/2` (8px) or
   `space/2-5` (10px) would change pixels across the library for no benefit. In code
   it is written `py-[calc(var(--spacing)*2.25)]` rather than a bare `py-2.25`, so it
   resolves identically in any Tailwind v4 setup and can never silently degrade to a
   raw pixel value. See [`tokens/typography.md`](../tokens/typography.md).
2. **Placeholder colour — code-only, Figma gap accepted.** All four Figma variants
   bind the value text to `foreground`, so the placeholder state cannot be seen in
   Figma. Code uses `placeholder:text-muted-foreground`. **Figma still owes a
   representation**; until then the design file understates this state.
3. **`Error + Disabled` — decided: `bg-muted` + `border-destructive` + `text-muted-foreground`.**
   Disabled supplies the fill and text; invalid keeps its border so the error remains
   legible while the control is inert. No Figma variant exists and the enum cannot
   express it, so **Figma cannot review this state** — it is verifiable only in code.

### One deliberate deviation from the Figma master

The Focused variant draws a **2px** border. A literal `border-2` in CSS shrinks the
content box and nudges the text 1px on focus. The implementation instead uses a 1px
`border-ring` plus a 1px inset `ring-ring` — **2px of `ring` in total, zero layout
shift** (a `box-shadow` ring cannot affect layout). Same token, same visual weight.
Verified rendered in Storybook.

It is keyed on `has-[:focus-visible]` because the ring sits on the container while
focus lands on the inner `<input>`.

**One correction worth recording:** an earlier version of this note claimed
`focus-visible` was chosen over `focus-within` because the latter "would also fire on
mouse click." For a **text input** that is wrong — `:focus-visible` matches on mouse
click too, since browsers always match it where keyboard input is expected, and the
Storybook render confirms the ring appears on click. `:focus-visible` remains the
correct primitive, and the distinction becomes real if this container ever holds a
button or other non-text control, but the two behave identically for `Input` today.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Element | Native `<input>`. Never a styled `<div>`. |
| Label | Visible `<label for={id}>`, or `aria-label` when none exists. Placeholder is **not** a label. |
| Focus | 2px `ring` border on `:focus-visible`. Must survive any custom styling. Contrast ≥ 3:1 against `card` and `muted` (Governance a11y gate). |
| Error | `aria-invalid={invalid}`; `errorMessage` linked via `aria-describedby` and rendered in a **polite** live region. Changed from `role="alert"` on 9 Aug 2026 to match Field's recorded contract — an assertive region interrupts mid-keystroke on every validation pass. |
| Disabled | Native `disabled`. Removed from tab order. |
| Keyboard | Standard text-input behavior. A trailing clear button must be independently reachable by Tab. |
| Target size | Control height ≥ 24 CSS px (Governance a11y gate). At `size/14` text + `space/2-25` padding the computed height is 38px. ✓ |


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

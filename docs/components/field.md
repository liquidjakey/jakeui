# Field

Composed form field with label, control value, and helper or error message.

- **Figma:** `Field` — node `67:347`, 4 variants
- **Code:** [`components/field.tsx`](../../components/field.tsx) — implemented 9 Aug 2026, exports `Field`
- **Maturity:** `draft`. Transcribed from `docs/components/Field.doc.json`, implemented, built in Storybook — **not yet visually reviewed**
- **Format:** [props-table-format.md](../props-table-format.md)

> **This component owns the wiring.** The record is explicit: *"Generates the id and
> binds label-for, aria-describedby, and aria-invalid onto the control it wraps."* Field
> is not a layout box with a label glued on top — the accessibility relationships are its
> reason to exist. See "The conflict this creates" below.

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `label` | `string` | — | ✓ | Rendered through `Label`. Figma property `Label#67:9`. |
| `children` | `(control: FieldControlProps) => ReactNode` | — | ✓ | Render prop. Receives the wiring to spread onto the control — see Table 2. |
| `helperText` | `string` | `undefined` | | Guidance below the control. Figma property `Helper text#67:19`. |
| `errorMessage` | `string` | `undefined` | | Shown when `invalid`. **Rendered by Field, not by the control.** |
| `requirement` | `'required' \| 'optional'` | `undefined` | | Passed through to `Label`. |
| `invalid` | `boolean` | `false` | | **Independent of `disabled`.** |
| `disabled` | `boolean` | `false` | | **Independent of `invalid`.** Passed down to the control. |
| `id` | `string` | auto | | Control id. Generated when omitted — that generation is the point. |

Where `FieldControlProps` is what the render prop receives:

| Injected | Type | Purpose |
|---|---|---|
| `id` | `string` | Matches the `Label`'s `htmlFor`. |
| `aria-describedby` | `string \| undefined` | Points at helper text and error, in that order. |
| `aria-invalid` | `true \| undefined` | Mirrors `invalid`. |
| `disabled` | `boolean` | Mirrors `disabled`. |

`Value#67:14` has **no** code equivalent — see Table 2.

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `State` | Default · Focused · Error · Disabled | `invalid` + `disabled` booleans | **Yes.** `kind: decompose` with `cssOwned: ["Focused"]`, `booleans: ["invalid","disabled"]`. `Focused` is `:focus-visible` on the *wrapped control*, never on Field. |
| `Label#67:9` | string | `label` | 1:1. |
| `Helper text#67:19` | string | `helperText` | 1:1. |
| `Value#67:14` | string | **nothing** | **Yes, and this is the important one.** In Figma the value is drawn inside the Field frame, because Figma has no way to nest a real control. In code the control is a *child*, so Field must never own its value — that would make it a second, competing source of truth. `Value` is a composition artefact of the design file, not a prop. |
| — | — | `children` render prop | **Missing in Figma.** The wiring the record requires cannot be expressed in a design file. A render prop is used rather than `cloneElement` so the injected props are visible and type-checked at the call site, instead of being magic. |
| — | — | `requirement`, `id` | No Figma representation. |

---

## 3. State → token binding

Transcribed from `Field.doc.json`. Two rows for four variants — `Focused` and `Error`
carry no *root-level* token delta, because those states are drawn on the wrapped control,
not on the field wrapper.

| State | Trigger | Tokens applied |
|---|---|---|
| Default | base | text `foreground` · type `size/14` |
| Disabled | `disabled === true` | text `muted-foreground` |

⚠️ **The error message has no token of its own.** `tokensUsed` lists only `foreground`,
`muted-foreground` and `size/14` — there is no `destructive` here, even though the record
demands a visible error message. `destructive` is used for the error text by consistency
with `Input`'s inline error, which does bind it. **Figma owes this binding**; until then
the error colour is asserted by code rather than transcribed.

Helper text uses `muted-foreground`, matching the Disabled row's token — the one place
this record's three tokens have to stretch to cover four visual roles.

---

## The conflict this creates — read before using Field

`Input`, `Textarea` and `NativeSelect` each accept `errorMessage` and render it
themselves. Field also renders one. **Used naively you get two error messages and two
live regions.**

The contract is: **when a control is wrapped in Field, do not pass `errorMessage` to the
control.** Pass it to Field. The control still receives `aria-invalid` and
`aria-describedby` through the render prop, so its border still turns `destructive` and
it still points at the message — Field just owns the rendering.

This is the existing dont generalised: *"Do not let the wrapped control render its own
second label."* The same applies to its error.

⚠️ **An inconsistency to reconcile, not resolved here.** Field's record says the error
*"is announced politely; it is not a `role="alert"` per keystroke"*, and Field implements
`aria-live="polite"`. But `Input`'s inline error uses `role="alert"`, which is an
assertive live region. Both cannot be right. Field's record is the only one that states a
contract, so Field follows it — but `Input`, `Textarea` and `NativeSelect` should
probably move to polite too. That is a change to three shipped components and needs its
own review, so it is recorded rather than done.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Label association | Field generates the `id` and passes it to both `Label`'s `htmlFor` and the control. No control has to do this itself. |
| Error | The record: *"Error must not rely on color alone. The composed field must display a specific visible error message and runtime must expose invalid state plus the message relationship."* → visible text, `aria-invalid` on the control, message linked by `aria-describedby`. |
| Announcement | `aria-live="polite"`, never `role="alert"`. See the inconsistency note above. |
| Helper + error together | Both are linked, helper first. The record's dont: *"Do not replace helper text with the error — a user often needs both."* |
| Layout stability | Space for the error is reserved so validation does not shift the page. |
| Disabled | Passed to the control, which carries the real `disabled`. Field itself is never focusable. |
| Keyboard | None of its own. All interaction belongs to the wrapped control. |

---

## Compiled output

```ts
interface FieldControlProps {
  id: string;
  'aria-describedby': string | undefined;
  'aria-invalid': true | undefined;
  disabled: boolean;
}

interface FieldProps {
  label: string;
  children: (control: FieldControlProps) => React.ReactNode;
  helperText?: string;
  errorMessage?: string;
  requirement?: 'required' | 'optional';
  invalid?: boolean;
  disabled?: boolean;
  id?: string;
}
```

---

## Authoring checklist

- [x] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [x] No enum in Table 1 mixes states that can co-occur at runtime
- [x] No prop in Table 1 covers two concerns
- [x] Icon and content slots are typed as nodes, not booleans — `children` is a render prop
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged ⚠️ — the error colour
- [x] Table 4 is filled in for anything interactive
- [x] The tables compile to a valid interface with nothing invented and nothing missing

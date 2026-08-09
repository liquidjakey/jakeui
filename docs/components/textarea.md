# Textarea

Multiline text input for longer freeform content.

- **Figma:** `Textarea` — node `82:522`, 4 variants
- **Code:** [`components/textarea.tsx`](../../components/textarea.tsx) — implemented 9 Aug 2026, exports `Textarea`
- **Maturity:** `draft`. Transcribed from `docs/components/Textarea.doc.json`, implemented, built in Storybook — **not yet visually reviewed**
- **Format:** [props-table-format.md](../props-table-format.md)

Every token below is the **actual bound variable** read from the Figma file, transcribed
from the doc record rather than authored. Where a value is *not* in the record it is
marked ⚠️ and its origin stated.

> **Sibling contract.** Textarea shares the `input` visual contract exactly — the four
> Figma state rows are token-for-token identical to `Input`'s. The three build blockers
> resolved for `Input` on 9 Aug 2026 therefore apply here unchanged; see
> [`input.md`](./input.md) §3 rather than re-deciding them.

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `value` | `string` | `''` | ✓ | Current field value. Renders in `--foreground`. |
| `placeholder` | `string` | `undefined` | | Shown when `value` is empty. Renders in `--muted-foreground` — **⚠️ not represented in Figma**, same gap as `Input`. |
| `helper` | `string` | `undefined` | | Helper text below the field. Figma property `Helper#82:14`. |
| `rows` | `number` | `4` | | Initial visible height. ⚠️ **Not a Figma property** — see the sizing note in Table 2. |
| `maxLength` | `number` | `undefined` | | Character limit. When set, a counter is rendered and linked via `aria-describedby` — **not** a live region; see Table 4. |
| `invalid` | `boolean` | `false` | | Applies the error border. **Independent of `disabled`.** |
| `errorMessage` | `string` | `undefined` | | Announced to assistive tech. Required when `invalid` is `true`. |
| `disabled` | `boolean` | `false` | | Blocks input. **Independent of `invalid`.** |
| `onChange` | `(e: React.ChangeEvent<HTMLTextAreaElement>) => void` | — | ✓ | Fires on value change. |
| `onFocus` / `onBlur` | `(e: React.FocusEvent<HTMLTextAreaElement>) => void` | `undefined` | | Focus lifecycle. |
| `name` | `string` | `undefined` | | Form field name. |
| `id` | `string` | auto | | Ties the field to its `<label>`. |
| `required` | `boolean` | `false` | | Marks required, natively and to assistive tech. |
| `aria-label` | `string` | `undefined` | | Required only when no visible `<label>` exists. |

`focus` is deliberately absent — it is browser-owned, not a prop. There is no `resize`
prop: see Table 2.

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `State` | Default · Focused · Error · Disabled | `invalid` + `disabled` booleans | **Yes.** `kind: decompose` in `figma.map.json`, with `cssOwned: ["Focused"]` and `booleans: ["invalid","disabled"]` already resolved. One enum → two independent booleans; a field can be disabled *and* invalid and the Figma axis cannot express it. `Focused` is `:focus-visible`, never a prop. |
| `Value#82:9` | string | `value` **and** `placeholder` | **Yes.** One Figma property standing in for two code props with different behaviour and different colour tokens — identical to `Input`'s `Value#70:0` split. |
| `Helper#82:14` | string | `helper` | 1:1. |
| — | — | `rows`, `maxLength` | **Missing in Figma.** The record's description states a deliberate sizing policy: *"Textarea intentionally uses a fixed editing viewport height. Long input scrolls or expands according to the runtime textarea contract; do not convert the Figma value region to automatic component height without a product-level behavior change."* `rows` is the code expression of that fixed viewport. **Changing it is a product decision, not a styling one.** |
| — | — | `onChange`, `onFocus`, `onBlur`, `name`, `id`, `required`, `errorMessage` | Behaviour and a11y props with no Figma representation. Expected — recorded so they are not dropped at codegen. |
| — | — | *(no `resize` prop)* | **Deliberately absent.** A user-draggable resize handle defeats the fixed-viewport policy above and can break surrounding layout. If it is ever wanted it needs the same product-level decision. |

---

## 3. State → token binding

Transcribed verbatim from `Textarea.doc.json` `states`. All four rows are present — the
component has 4 variants, under the 8-row cap in `figma-descriptions.md` rule 3, so
nothing is truncated.

| State | Trigger | Tokens applied |
|---|---|---|
| Default | base | fill `card` · border `1px` `input` · radius `radius/lg` · text `foreground` · type `size/14` |
| Placeholder | `value === ''` | text `muted-foreground` ⚠️ **not represented in Figma** — same gap as `Input`, and the design file understates this state |
| Focus | `:focus-visible` | border `2px` `ring` — replaces the 1px default border; the only focus affordance, do not remove |
| Error | `invalid === true` | border `1px` `destructive` |
| Disabled | `disabled === true` | fill `muted` · text `muted-foreground` · no focus ring |
| Error + Disabled | both | fill `muted` · border `destructive` · text `muted-foreground` — ⚠️ **code-only.** No Figma variant exists and the enum cannot express it, so Figma cannot review this state. Follows `Input` decision 3. |

**Inherited from `Input`, do not re-decide:**

1. **The 2px focus border is implemented as 1px `border-ring` + 1px inset `ring-ring`.**
   A literal `border-2` shrinks the content box and nudges text 1px on focus. Same token,
   same visual weight, zero layout shift. Key it on `has-[:focus-visible]` if the ring
   sits on a container.
2. **Vertical padding uses `space/2-25`** written as `py-[calc(var(--spacing)*2.25)]`,
   never a bare `py-2.25`, so it can never silently degrade to a raw pixel value.
3. **`cn()` must go through `tailwind-merge`.** `border-input` and `border-destructive`
   set `border-color` at equal specificity, so *stylesheet* source order wins, not class
   order. Without merge the invalid border renders grey. **No type check or build catches
   this — only rendering does.**

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Element | Native `<textarea>`. Never a styled `<div>` or a `contenteditable`. |
| Label | Visible `<label for={id}>`, or `aria-label` when none exists. Placeholder is **not** a label. |
| Focus | 2px `ring` border on `:focus-visible`. Must survive any custom styling. Contrast ≥ 3:1 against `card` and `muted`. |
| Error | The record's contract: *"State=Error requires specific visible error text outside or below the editing surface and an assistive-technology error relationship; color alone is insufficient."* → `aria-invalid={invalid}`, `errorMessage` linked via `aria-describedby`. |
| Disabled | Native `disabled`. Removed from tab order. |
| Keyboard | Standard text-editing keys. **Enter inserts a newline and must not submit the form** — the one place Textarea's keyboard contract diverges from `Input`'s. |
| Character count | **Decided at implementation, 9 Aug 2026: the counter is not a live region.** A polite live region on a counter fires on every keystroke, which is noise rather than help. It is linked through `aria-describedby` instead, so it is read when the field takes focus — when knowing the limit is actually useful. The tradeoff is that the count is not re-announced as it changes; if a product needs that, announce only near the limit rather than making the whole counter live. |

---

## Compiled output

```ts
interface TextareaProps {
  value: string;
  placeholder?: string;
  helper?: string;
  rows?: number;
  maxLength?: number;
  invalid?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  name?: string;
  id?: string;
  required?: boolean;
  'aria-label'?: string;
}
```

---

## Authoring checklist

- [x] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [x] No enum in Table 1 mixes states that can co-occur at runtime
- [x] No prop in Table 1 covers two concerns
- [x] Icon and content slots are typed as nodes, not booleans — *n/a, this component has no slots*
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged ⚠️
- [x] Table 4 is filled in for anything interactive
- [x] The tables compile to a valid interface with nothing invented and nothing missing

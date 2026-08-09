# Native Select

Native select control styled with Jake UI semantics.

- **Figma:** `Native Select` — node `70:355`, 5 variants
- **Code:** not yet implemented — `codePath` is `null`
- **Maturity:** Transcribed from `docs/components/Native-Select.doc.json`, not yet rendered
- **Format:** [props-table-format.md](../props-table-format.md)

Every token below is the **actual bound variable** read from the Figma file, transcribed
from the doc record rather than authored.

> **This is the native control on purpose.** The platform's own option menu is used, not
> a re-implemented listbox. That buys correct mobile behaviour and screen-reader support
> for free, and it is the reason several things below are *not* stylable and *not* props.

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `value` | `string` | `''` | ✓ | Currently selected option value. Renders in `--foreground`. |
| `options` | `Array<{ value: string; label: string; disabled?: boolean }>` | `[]` | ✓ | The option list. ⚠️ **Not a Figma property** — Figma models only the closed control, so the list has no design representation. |
| `placeholder` | `string` | `undefined` | | Rendered as a disabled, unselectable first option when `value` is `''`. Shows in `--muted-foreground`. |
| `invalid` | `boolean` | `false` | | Applies the error border. **Independent of `disabled`.** |
| `errorMessage` | `string` | `undefined` | | Announced to assistive tech. Required when `invalid` is `true`. |
| `disabled` | `boolean` | `false` | | Blocks selection. **Independent of `invalid`.** |
| `onChange` | `(e: React.ChangeEvent<HTMLSelectElement>) => void` | — | ✓ | Fires on selection change. |
| `onFocus` / `onBlur` | `(e: React.FocusEvent<HTMLSelectElement>) => void` | `undefined` | | Focus lifecycle. |
| `name` | `string` | `undefined` | | Form field name. |
| `id` | `string` | auto | | Ties the field to its `<label>`. |
| `required` | `boolean` | `false` | | Marks required, natively and to assistive tech. |
| `aria-label` | `string` | `undefined` | | Required only when no visible `<label>` exists. |

`open` is deliberately absent as a prop — see Table 2. `focus` is browser-owned.

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `State` | Default · Open · Error · Disabled · Focused | `invalid` + `disabled` booleans | **Yes, and this is the subtle one.** `figma.map.json` marks it `kind: decompose` with `cssOwned: ["Focused"]`, `booleans: ["invalid","disabled"]` and **`controlled: ["open"]`**. Three different fates for five enum values in one axis. |
| ↳ `Open` | — | **nothing** | **⚠️ The map lists `open` as `controlled`, but for a *native* select it must not become a prop.** The platform owns the option menu: it cannot be opened programmatically, and its open state is not observable or stylable. The Figma `Open` variant is a **visual proxy for runtime state** — precisely what format rule "Table 2 / visual proxy" says must never become a prop. Recorded here rather than silently dropped. **If a controlled `open` is genuinely required, this component is the wrong primitive and a custom listbox is needed.** |
| ↳ `Focused` | — | `:focus-visible` | CSS-owned, dropped, same as `Input`. |
| `Value#70:9` | string | `value` **and** `placeholder` | **Yes.** One Figma property standing in for two code props with different colour tokens — the same split as `Input`'s `Value#70:0`. |
| — | — | `options` | **Missing in Figma.** Figma models the closed control only. |
| — | — | `onChange`, `onFocus`, `onBlur`, `name`, `id`, `required`, `errorMessage` | Behaviour and a11y props with no Figma representation. |

The record also carries an explicit governance instruction worth quoting, because it is
what licenses dropping `Open`:

> *"Apply the Governance property-classification rule before code mapping. Visual State
> axes are QA/story states unless engineering explicitly approves a controlled runtime
> prop; Viewport is responsive test data; Pattern is composition/story data."*

No such approval exists for `Open`, so it stays a story state.

---

## 3. State → token binding

Transcribed verbatim from `Native-Select.doc.json` `states`. All five rows present —
5 variants, under the 8-row cap, so nothing is truncated.

| State | Trigger | Tokens applied |
|---|---|---|
| Default | base | fill `card` · border `1px` `input` · radius `radius/lg` · text `foreground` · type `size/14` |
| Placeholder | `value === ''` | text `muted-foreground` ⚠️ **not represented in Figma** — same gap as `Input` |
| Focus | `:focus-visible` | border `2px` `ring` |
| Open | platform menu shown | border `2px` `ring` — **identical tokens to Focus.** Since a native select is always focused while its menu is open, the two states are visually indistinguishable and `Open` needs no separate code path. This is the strongest evidence it should not be a prop. |
| Error | `invalid === true` | border `1px` `destructive` |
| Disabled | `disabled === true` | fill `muted` · text `muted-foreground` · no focus ring |
| Error + Disabled | both | fill `muted` · border `destructive` · text `muted-foreground` — ⚠️ **code-only**, no Figma variant. Follows `Input` decision 3. |

⚠️ **The chevron indicator has no token in the record.** `tokensUsed` lists nine tokens
and none is an icon or chevron colour. A native select renders the platform's own
indicator unless one is drawn, so **either** accept the platform chevron (recommended —
it is what "native" means) **or** Figma owes an indicator binding. Do not invent a token
at implementation time.

**Inherited from `Input`, do not re-decide:** the 1px `border-ring` + 1px inset
`ring-ring` focus treatment, `space/2-25` padding written as a `calc()`, and `cn()`
through `tailwind-merge`. See [`input.md`](./input.md) §3.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Element | Native `<select>`. **Never a styled `<div>` with a custom menu** — that forfeits the entire reason this component exists. |
| Label | Visible `<label for={id}>`, or `aria-label` when none exists. The first option is **not** a label. |
| Focus | 2px `ring` border on `:focus-visible`. Contrast ≥ 3:1 against `card` and `muted`. |
| Error | The record's contract: *"State=Error is only the control visual. A consuming Field or equivalent must add specific visible error text and expose invalid state plus the error-description relationship; a red border alone is insufficient."* → pair with `Field`, or set `aria-invalid` and `aria-describedby` directly. |
| Disabled | Native `disabled`. Removed from tab order. Individual options may be disabled independently. |
| Keyboard | Platform-owned and **must not be re-implemented**: arrow keys move through options, Enter or Space opens the menu, typing letters jumps to matching options, Escape closes without changing the value. |
| Styling limit | Only the closed control is yours to style. The open option menu is drawn by the OS and cannot be themed — do not promise a design that styles it. |

---

## Compiled output

```ts
interface NativeSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface NativeSelectProps {
  value: string;
  options: NativeSelectOption[];
  placeholder?: string;
  invalid?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
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
- [x] Icon and content slots are typed as nodes, not booleans — *n/a, no slots; see the chevron ⚠️ in Table 3*
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged ⚠️
- [x] Table 4 is filled in for anything interactive
- [x] The tables compile to a valid interface with nothing invented and nothing missing

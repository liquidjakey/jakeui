# Component Props Table Format

A documentation format for Figma design systems intended to be read by an AI or engineer and turned into code.

**The problem it solves:** a Figma variant API and a code component API are not the same shape. A props table that documents Figma variants as if they were code props produces wrong code — states that can't co-occur, conflated props, and missing behavior. This format documents both and makes the mapping explicit.

Each component page carries four tables in this order. Table 1 and 3 are mandatory. Table 2 is mandatory wherever the Figma and code APIs diverge. Table 4 is mandatory for any interactive component.

---

## Table 1 — Code API

The interface to implement. Grouped by role, always in this order: **Content → State → Behavior → Accessibility**. Grouping is what lets a reader (or model) tell a visual prop from a functional one.

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| *content props* | | | | |
| *state props* | | | | |
| *behavior props* | | | | |
| *a11y props* | | | | |

Rules:
- **One concern per prop.** If a Figma property means two things, split it.
- **Independent states are independent booleans.** Only use an enum when the values are genuinely mutually exclusive.
- **Slots are nodes, not booleans.** A Figma boolean that toggles a placeholder icon becomes a `ReactNode` prop in code.
- Use real type syntax (`boolean`, `string`, `ReactNode`, `(e) => void`, `'sm' | 'md'`), not prose.
- Mark required props explicitly — a designer's "default" is not the same as an optional prop.

---

## Table 2 — Figma → Code mapping

The bridge. Written for whoever is looking at the Figma file and needs to know what it becomes. Every row where the mapping is not 1:1 gets a note.

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|

Rules:
- List every Figma variant property, including ones that vanish in code.
- Where one Figma property splits into several code props, say so plainly.
- Where a Figma value is a *visual proxy* for runtime state (a "Filled" variant standing in for "has a value"), flag it — those must never become props.

---

## Table 3 — State → token binding

Replaces prose like *"Focus = 2px ring, Error = error border."* Tabular so it can be diffed, linted, and read mechanically.

| State | Trigger | Tokens applied |
|---|---|---|

Rules:
- One row per state, including the default.
- **Trigger** is the runtime condition, not the Figma variant name.
- Name the exact token per property. Never write a hex here.
- Flag any token that is not yet a real variable with code syntax — that's a build blocker, and it should be visible in the doc, not discovered at codegen.

---

## Table 4 — Accessibility & keyboard

| Concern | Contract |
|---|---|

Cover at minimum: semantic element/role, label source, focus visibility, keyboard interaction, and how error state is announced.

---

## Worked example — Input

Tokens below are the actual bound values from the CRRT `Input` component.

### 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `value` | `string` | `''` | ✓ | Current field value. Renders in `text/primary`. |
| `placeholder` | `string` | `undefined` | | Shown when `value` is empty. Renders in `text/muted`. Should state what to type. |
| `leadingIcon` | `ReactNode` | `undefined` | | Icon slot before the value. Signals intent (e.g. magnifying-glass for search). |
| `trailingIcon` | `ReactNode` | `undefined` | | Icon slot after the value. Clear affordance by default; chevron for selects. |
| `error` | `boolean` | `false` | | Applies error border. Independent of `disabled`. |
| `errorMessage` | `string` | `undefined` | | Message announced to assistive tech. Required when `error` is `true`. |
| `disabled` | `boolean` | `false` | | Blocks input. Independent of `error`. |
| `onChange` | `(e: ChangeEvent<HTMLInputElement>) => void` | — | ✓ | Fires on value change. |
| `onFocus` / `onBlur` | `(e: FocusEvent) => void` | `undefined` | | Focus lifecycle. |
| `name` | `string` | `undefined` | | Form field name. |
| `id` | `string` | auto | | Ties the field to its `<label>`. |
| `type` | `'text' \| 'email' \| 'password' \| 'tel' \| 'url'` | `'text'` | | Native input type. |
| `required` | `boolean` | `false` | | Marks the field required, natively and to assistive tech. |
| `aria-label` | `string` | `undefined` | | Required only when no visible `<label>` exists. |

Note `focus` is absent — it is a browser-owned state, not a prop.

### 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `State` | Default · Focus · Error · Disabled | `error` + `disabled` booleans | **Yes.** One enum → two independent booleans. Error and disabled can co-occur at runtime; the Figma enum can't express that. `Focus` is not a prop at all — it's `:focus-visible`. |
| `Text` | string, default `"Placeholder"` | `value` **and** `placeholder` | **Yes.** One Figma property standing in for two code props with different behavior and different color tokens. |
| `Leading icon` | boolean, default `true` | `leadingIcon: ReactNode` | **Yes.** Boolean in Figma toggles a default icon; in code you pass the actual node. |
| `Trailing icon` | boolean, default `true` | `trailingIcon: ReactNode` | **Yes.** Same as above. |
| — | — | `onChange`, `name`, `id`, `type`, `required`, `errorMessage` | Behavioral props with no Figma representation. Expected — but they must be documented here or they get dropped. |

### 3. State → token binding

| State | Trigger | Tokens applied |
|---|---|---|
| Default | base | fill `--color-surface-card` · border 1px `--color-border-default` · radius `--radius-md` · padding `--space-2` / `--space-3` · text `Body/UI` |
| Placeholder | `value === ''` | text `--color-text-muted` |
| Filled | `value !== ''` | text `text/primary` ⚠️ |
| Focus | `:focus-visible` | 2px ring `border/focus` ⚠️ — do not remove; this is the only focus affordance |
| Error | `error === true` | border `--color-feedback-error-base` |
| Disabled | `disabled === true` | fill `surface/muted` ⚠️ · text `--color-text-disabled` · no focus ring |

⚠️ = not currently exposed as a variable with code syntax; resolves to a raw hex at codegen. Fix in Figma before wiring this component up.

### 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Element | Native `<input>`. Never a styled `<div>`. |
| Label | Visible `<label for={id}>`, or `aria-label` when none exists. Placeholder is **not** a label. |
| Focus | 2px `border/focus` ring on `:focus-visible`. Must survive any custom styling. |
| Error | `aria-invalid={error}`; `errorMessage` linked via `aria-describedby` and rendered in a live region. |
| Disabled | Native `disabled`. Removed from tab order. |
| Keyboard | Standard text-input behavior. Trailing clear button must be independently reachable by Tab. |

---

## Compiled output

The tables above compile directly to this — which is the point of the format. If they don't, a table is underspecified.

```ts
interface InputProps {
  value: string;
  placeholder?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  error?: boolean;
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

Before marking a component documented:

- [ ] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [ ] No enum in Table 1 mixes states that can co-occur at runtime
- [ ] No prop in Table 1 covers two concerns
- [ ] Icon and content slots are typed as nodes, not booleans
- [ ] Behavior props are present even though Figma has no equivalent
- [ ] Every state in Table 3 names tokens, never hex values
- [ ] Tokens lacking code syntax are flagged ⚠️
- [ ] Table 4 is filled in for anything interactive
- [ ] The tables compile to a valid interface with nothing invented and nothing missing

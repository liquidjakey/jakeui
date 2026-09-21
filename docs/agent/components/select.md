# Select

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **component**. implemented; see verification report for tested scope.

Controlled single-choice select with an anchored, styled listbox.

```tsx
import { Select } from 'jakeui';
```

[Implementation](../../../components/select.tsx) · Code-only component; no Figma correspondence.

## Usage

- A plain-text form choice that needs consistent popup styling and field-aligned positioning across desktop browsers.
- Supply value and onValueChange; this callback receives a string, not NativeSelect's DOM change event. Options need unique nonempty values.
- Use Field or a linked label. Spread Field's control props and pass errorMessage to Field only.
- Arrow keys, Home/End, PageUp/PageDown and typeahead preview choices. Enter/Space/Tab commit; Escape cancels. Focus stays on the trigger.
- The popup opens below with an 8px gap, matches the field width and flips when space is insufficient. Its list scrolls; it does not overlap the field.
- name and required participate in native forms through a hidden select. Keep value controlled, including form reset handling. Disabled or wholly unavailable option lists cannot open.
- An approved code-only extension; do not invent a Figma node or copy the similarly named API from another library.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `value` | `string` | yes | source-defined | Controlled value; an empty string displays the placeholder. |
| `options` | `SelectOption[]` | yes | source-defined | Single-choice plain-text options. Search and multiple selection are not supported. |
| `onValueChange` | `(value: string) => void` | yes | source-defined | Commits a value, not a DOM change event. Arrow navigation alone does not commit. |
| `placeholder` | `string \| undefined` | no | `"Choose an option"` |  |
| `disabled` | `boolean \| undefined` | no | `false` |  |
| `invalid` | `boolean \| undefined` | no | `false` |  |
| `errorMessage` | `string \| undefined` | no | source-defined | Inside Field, pass errorMessage to Field only. |
| `name` | `string \| undefined` | no | source-defined | Participates in native form submission through a hidden native select. |
| `required` | `boolean \| undefined` | no | `false` | Participates in native required validation; invalid submission focuses the trigger. |
| `id` | `string \| undefined` | no | source-defined |  |
| `aria-label` | `string \| undefined` | no | source-defined |  |
| `aria-labelledby` | `string \| undefined` | no | source-defined |  |
| `aria-describedby` | `string \| undefined` | no | source-defined |  |
| `aria-invalid` | `boolean \| "true" \| "false" \| "grammar" \| "spelling" \| undefined` | no | source-defined |  |
| `onFocus` | `((event: FocusEvent<HTMLButtonElement>) => void) \| undefined` | no | source-defined |  |
| `onBlur` | `((event: FocusEvent<HTMLButtonElement>) => void) \| undefined` | no | source-defined |  |

## Supporting types

Compiler-selected public types referenced by this interface. Use these exact data shapes.

```ts
export interface SelectOption {
  /** Unique, nonempty form value. */
  value: string;
  label: string;
  disabled?: boolean;
}
```


## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/select.stories.tsx` (repository checkout)

## Avoid

- Platform-native mobile pickers: use NativeSelect.
- Searchable choices, multiple selection or rich option content: request an extension.
- Commands or navigation: use DropdownMenu or navigation components.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

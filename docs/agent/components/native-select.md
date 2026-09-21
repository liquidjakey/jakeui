# NativeSelect

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **component**. implemented; see verification report for tested scope.

Controlled single-choice native select.

```tsx
import { NativeSelect } from 'jakeui';
```

[Implementation](../../../components/native-select.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Choose one option from a fixed list using the platform menu; supply an accessible label.
- Controlled native select. Its open state belongs to the browser; do not pass open or implement a second popup.
- The inset Phosphor indicator is decorative. The native popup's placement and styling belong to the browser/OS; use Select when a consistently anchored popup is required.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `value` | `string` | yes | source-defined | Currently selected option value. Renders in `--foreground`. |
| `options` | `NativeSelectOption[]` | yes | source-defined | The option list. Code-only — Figma models the closed control only. |
| `placeholder` | `string \| undefined` | no | source-defined | Rendered as a disabled, unselectable first option while `value` is empty. |
| `invalid` | `boolean \| undefined` | no | `false` | Applies the error border. Independent of `disabled`. |
| `errorMessage` | `string \| undefined` | no | source-defined | Standalone invalid controls need an error message. Inside Field, pass it to Field only. |
| `disabled` | `boolean \| undefined` | no | `false` | Blocks selection. Independent of `invalid`. |
| `onChange` | `(e: ChangeEvent<HTMLSelectElement>) => void` | yes | source-defined |  |
| `onFocus` | `((e: FocusEvent<HTMLSelectElement>) => void) \| undefined` | no | source-defined |  |
| `onBlur` | `((e: FocusEvent<HTMLSelectElement>) => void) \| undefined` | no | source-defined |  |
| `name` | `string \| undefined` | no | source-defined |  |
| `id` | `string \| undefined` | no | source-defined | Ties the field to its `<label>`. Auto-generated when omitted. |
| `required` | `boolean \| undefined` | no | `false` |  |
| `aria-label` | `string \| undefined` | no | source-defined | Required only when no visible `<label>` exists. |
| `aria-describedby` | `string \| undefined` | no | source-defined |  |
| `aria-invalid` | `boolean \| "true" \| "false" \| "grammar" \| "spelling" \| undefined` | no | source-defined |  |

## Supporting types

Compiler-selected public types referenced by this interface. Use these exact data shapes.

```ts
export interface NativeSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}
```


## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/field.stories.tsx` (repository checkout)
- `components/native-select.stories.tsx` (repository checkout)

## Avoid

- Free-form input: use Input.
- A short visible choice list: use RadioGroup.
- Multiple selection, search or rich option content: these are not exposed by this component; compose existing controls or request an extension.
- Consistent below-field popup styling: use Select.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

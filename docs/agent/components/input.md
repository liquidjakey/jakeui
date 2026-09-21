# Input

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **component**. implemented; see verification report for tested scope.

Single-line text input primitive.

```tsx
import { Input } from 'jakeui';
```

[Implementation](../../../components/input.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Collect a single line of free-form text.
- Controlled: supply value and onChange. Use Field for visible labels and validation. Standalone controls need a linked label or aria-label; a placeholder is not a label.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `value` | `string` | yes | source-defined | Current field value. Renders in `--foreground`. |
| `placeholder` | `string \| undefined` | no | source-defined | Shown when `value` is empty. Renders in `--muted-foreground` (code-only state — no Figma variant). |
| `leadingIcon` | `ReactNode` | no | source-defined | Slot before the value. Pass a `@phosphor-icons/react` component. |
| `trailingIcon` | `ReactNode` | no | source-defined | Slot after the value. |
| `invalid` | `boolean \| undefined` | no | `false` | Applies the error border. Independent of `disabled`. |
| `errorMessage` | `string \| undefined` | no | source-defined | Standalone invalid controls need an error message. Inside Field, pass it to Field only. |
| `disabled` | `boolean \| undefined` | no | `false` | Blocks input. Independent of `invalid`. |
| `onChange` | `(e: ChangeEvent<HTMLInputElement>) => void` | yes | source-defined |  |
| `onFocus` | `((e: FocusEvent<HTMLInputElement>) => void) \| undefined` | no | source-defined |  |
| `onBlur` | `((e: FocusEvent<HTMLInputElement>) => void) \| undefined` | no | source-defined |  |
| `name` | `string \| undefined` | no | source-defined |  |
| `id` | `string \| undefined` | no | source-defined | Ties the field to its `<label>`. Auto-generated when omitted. |
| `type` | `"text" \| "email" \| "password" \| "tel" \| "url" \| undefined` | no | `'text'` |  |
| `required` | `boolean \| undefined` | no | `false` |  |
| `aria-label` | `string \| undefined` | no | source-defined | Required only when no visible `<label>` exists. |
| `aria-describedby` | `string \| undefined` | no | source-defined |  |
| `aria-invalid` | `boolean \| "true" \| "false" \| "grammar" \| "spelling" \| undefined` | no | source-defined |  |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/data-table.stories.tsx` (repository checkout)
- `components/field.stories.tsx` (repository checkout)
- `components/input.stories.tsx` (repository checkout)
- `components/popover.stories.tsx` (repository checkout)

## Avoid

- Choosing from a fixed set — use NativeSelect or RadioGroup.
- Long multi-line text — use Textarea.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

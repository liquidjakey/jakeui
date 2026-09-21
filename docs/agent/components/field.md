# Field

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **component**. implemented; see verification report for tested scope.

Label, control and validation composition using a render-prop child.

```tsx
import { Field } from 'jakeui';
```

[Implementation](../../../components/field.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Wrap a form control with its label, helper text, and error message as one unit.
- Render-prop composition: spread the supplied control props into Input, Textarea, NativeSelect or Select. Field owns label, required marker, error and description wiring; the child owns value and onChange.
- Pass errorMessage to Field only, not also to the child control. Spread all supplied control props so invalid styling, required state and description links stay connected.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `label` | `string` | yes | source-defined |  |
| `children` | `(control: FieldControlProps) => ReactNode` | yes | source-defined |  |
| `helperText` | `string \| undefined` | no | source-defined |  |
| `errorMessage` | `string \| undefined` | no | source-defined |  |
| `requirement` | `"required" \| "optional" \| undefined` | no | source-defined |  |
| `invalid` | `boolean \| undefined` | no | `false` | Independent of `disabled`. |
| `disabled` | `boolean \| undefined` | no | `false` | Independent of `invalid`. |
| `id` | `string \| undefined` | no | source-defined |  |

## Supporting types

Compiler-selected public types referenced by this interface. Use these exact data shapes.

```ts
export interface FieldControlProps {
  id: string;
  "aria-describedby": string | undefined;
  "aria-invalid": true | undefined;
  disabled: boolean;
  required: boolean;
  invalid: boolean;
}
```


## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/field.stories.tsx` (repository checkout)
- `components/popover.stories.tsx` (repository checkout)
- `components/select.stories.tsx` (repository checkout)

## Avoid

- A bare control that is already labelled by its surroundings.
- Page layout — it composes one field, not a form.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

# Checkbox

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **component**. implemented; see verification report for tested scope.

Controlled labelled checkbox for independent form choices.

```tsx
import { Checkbox } from 'jakeui';
```

[Implementation](../../../components/checkbox.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- NativeSelect one or more independent choices applied on Save or submit; represent partial group selection with indeterminate.
- Use checked and onCheckedChange, not value. Indeterminate is the string 'indeterminate'; a click resolves it to a boolean.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `label` | `string` | yes | source-defined |  |
| `checked` | `boolean \| "indeterminate"` | yes | source-defined | Three states, so not a plain boolean. Indeterminate is never user-selectable. |
| `onCheckedChange` | `(checked: boolean) => void` | yes | source-defined |  |
| `disabled` | `boolean \| undefined` | no | `false` |  |
| `description` | `string \| undefined` | no | source-defined |  |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/checkbox.stories.tsx` (repository checkout)

## Avoid

- An immediate boolean setting: use Switch.
- Mutually exclusive options: use RadioGroup.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

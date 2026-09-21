# RadioGroup

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **component**. implemented; see verification report for tested scope.

Controlled group of native radios for one-of-many selection.

```tsx
import { RadioGroup } from 'jakeui';
```

[Implementation](../../../components/radio-group.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- NativeSelect one option from a visible set of mutually exclusive choices.
- Supply label, items, value and onValueChange. RadioGroup owns native radio semantics and keyboard behavior; anatomy exports do not.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `items` | `RadioItem[]` | yes | source-defined |  |
| `value` | `string` | yes | source-defined |  |
| `onValueChange` | `(value: string) => void` | yes | source-defined |  |
| `label` | `string` | yes | source-defined |  |
| `disabled` | `boolean \| undefined` | no | `false` |  |
| `orientation` | `"vertical" \| "horizontal" \| undefined` | no | `'vertical'` |  |

## Supporting types

Compiler-selected public types referenced by this interface. Use these exact data shapes.

```ts
export interface RadioItem {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}
```


## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/radio-group.stories.tsx` (repository checkout)

## Avoid

- Independent multiple choices: use Checkbox.
- An immediate boolean setting: use Switch.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

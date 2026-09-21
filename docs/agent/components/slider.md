# Slider

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **component**. implemented; see verification report for tested scope.

Continuous value selection primitive.

```tsx
import { Slider } from 'jakeui';
```

[Implementation](../../../components/slider.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Pick from a continuous or coarsely stepped range where the relative position matters more than the exact figure.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `value` | `number` | yes | source-defined |  |
| `onValueChange` | `(value: number) => void` | yes | source-defined |  |
| `label` | `string` | yes | source-defined |  |
| `min` | `number \| undefined` | no | `0` |  |
| `max` | `number \| undefined` | no | `100` |  |
| `step` | `number \| undefined` | no | `1` |  |
| `disabled` | `boolean \| undefined` | no | `false` |  |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/slider.stories.tsx` (repository checkout)

## Avoid

- A precise value the user knows — use a number input.
- Ranges so wide that a pixel is worth many units.
- Fewer than about five discrete options — use radios or a segmented control.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

# Progress

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **component**. implemented; see verification report for tested scope.

Linear progress primitive.

```tsx
import { Progress } from 'jakeui';
```

[Implementation](../../../components/progress.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Show that work is underway, and how far along it is when that is known.
- Omit value for indeterminate progress; 0 is determinate. For determinate progress supply a finite value from 0 to a positive finite max (default 100).

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `value` | `number \| undefined` | no | source-defined | Finite value from 0 to max. Omit for indeterminate progress; 0 is determinate. |
| `label` | `string` | yes | source-defined | Required: an unnamed progress bar announces a number with no subject. |
| `max` | `number \| undefined` | no | `100` | Positive finite upper bound for determinate progress. |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/progress.stories.tsx` (repository checkout)

## Avoid

- Waits short enough that the indicator flashes — show nothing.
- Content-shaped placeholders while a view loads — use Skeleton.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

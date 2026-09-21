# Badge

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **component**. implemented; see verification report for tested scope.

Compact status label.

```tsx
import { Badge } from 'jakeui';
```

[Implementation](../../../components/badge.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- A short status, count, or category label.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `children` | `ReactNode` | yes | source-defined |  |
| `tone` | `"destructive" \| "info" \| "success" \| "warning" \| "neutral" \| undefined` | no | `'neutral'` |  |
| `size` | `"small" \| "medium" \| undefined` | no | `'small'` |  |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/badge.stories.tsx` (repository checkout)

## Avoid

- Interactive primary actions — use a Button.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

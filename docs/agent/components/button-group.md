# ButtonGroup

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **component**. implemented; see verification report for tested scope.

Layout group for related Button instances.

```tsx
import { ButtonGroup } from 'jakeui';
```

[Implementation](../../../components/button-group.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Keep related actions together using existing Button children.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `children` | `ReactNode` | yes | source-defined |  |
| `orientation` | `"vertical" \| "horizontal" \| undefined` | no | `'horizontal'` |  |
| `attached` | `boolean \| undefined` | no | `false` |  |
| `label` | `string \| undefined` | no | source-defined |  |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/button-group.stories.tsx` (repository checkout)

## Avoid

- Exclusive selection: use RadioGroup or ToggleGroup.
- Page navigation: use native anchors or router links.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

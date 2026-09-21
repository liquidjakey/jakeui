# TableCaption

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **part**. implemented; see verification report for tested scope.

Accessible descriptive caption for a table.

```tsx
import { TableCaption } from 'jakeui';
```

[Implementation](../../../components/table.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Only inside its parent component's composition — this is a part, not a standalone component.
- Place first inside the native table, before thead/tbody. Use either Table.caption or one TableCaption child, not both.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `children` | `ReactNode` | yes | source-defined |  |
| `position` | `"top" \| "bottom" \| undefined` | no | `'top'` |  |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/table.stories.tsx` (repository checkout)

## Avoid

- On its own, outside the parent that owns its behaviour and accessibility wiring.
- As a general-purpose layout or text primitive.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

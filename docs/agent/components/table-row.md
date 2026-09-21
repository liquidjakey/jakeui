# TableRow

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **part**. implemented; see verification report for tested scope.

Table row patterns for header, body, and footer sections.

```tsx
import { TableRow } from 'jakeui';
```

[Implementation](../../../components/table.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Only inside its parent component's composition — this is a part, not a standalone component.
- Inside a table only. For selection supply selected/onSelect; nested action buttons do not select the row.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `children` | `ReactNode` | yes | source-defined |  |
| `type` | `"header" \| "body" \| "footer" \| undefined` | no | `'body'` |  |
| `selected` | `boolean \| undefined` | no | `false` |  |
| `onSelect` | `(() => void) \| undefined` | no | source-defined |  |
| `density` | `TableDensity \| undefined` | no | source-defined |  |

## Supporting types

Compiler-selected public types referenced by this interface. Use these exact data shapes.

```ts
export type TableDensity = 'compact' | 'comfortable';
```


## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/data-table.stories.tsx` (repository checkout)
- `components/table.stories.tsx` (repository checkout)

## Avoid

- On its own, outside the parent that owns its behaviour and accessibility wiring.
- As a general-purpose layout or text primitive.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

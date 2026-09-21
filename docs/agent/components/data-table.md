# DataTable

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **component**. implemented; see verification report for tested scope.

Data-management composition built from Input, Button, Table, and Pagination.

```tsx
import { DataTable } from 'jakeui';
```

[Implementation](../../../components/data-table.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Present records across shared columns, for comparison, scanning, or exact reading.
- Composition shell, not a data engine. Caller owns filtering, sorting, pagination and data fetching. Pass empty={rows.length===0} for an opaque Table child. Supply loading/error explicitly.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `title` | `string` | yes | source-defined |  |
| `children` | `ReactNode` | no | source-defined |  |
| `toolbar` | `ReactNode` | no | source-defined |  |
| `pagination` | `ReactNode` | no | source-defined |  |
| `emptyMessage` | `string \| undefined` | no | `'No results.'` |  |
| `empty` | `boolean \| undefined` | no | source-defined |  |
| `loading` | `boolean \| undefined` | no | `false` |  |
| `error` | `ReactNode` | no | source-defined |  |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/data-table.stories.tsx` (repository checkout)

## Avoid

- Page layout — use a grid.
- A handful of key-value pairs — use a description list.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

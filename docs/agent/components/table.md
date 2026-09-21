# Table

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **component**. implemented; see verification report for tested scope.

Jake UI extension for structured tabular data with compact and comfortable density variants plus optional selected-row treatment.

```tsx
import { Table } from 'jakeui';
```

[Implementation](../../../components/table.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Present records across shared columns, for comparison, scanning, or exact reading.
- Use native thead/tbody/tfoot with TableRow, TableHead and TableCell; TableHeader/TableBody/TableFooter are not exported components. Table density propagates to rows.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `children` | `ReactNode` | yes | source-defined |  |
| `caption` | `string \| undefined` | no | source-defined |  |
| `captionPosition` | `"top" \| "bottom" \| undefined` | no | `'top'` |  |
| `density` | `TableDensity \| undefined` | no | `'compact'` |  |
| `label` | `string \| undefined` | no | source-defined |  |

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

- Page layout — use a grid.
- A handful of key-value pairs — use a description list.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

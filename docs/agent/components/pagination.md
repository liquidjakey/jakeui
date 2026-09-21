# Pagination

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **component**. implemented; see verification report for tested scope.

Navigate paged datasets or long collections.

```tsx
import { Pagination } from 'jakeui';
```

[Implementation](../../../components/pagination.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Break a long result set into pages the reader can move through and return to.
- Pages are 1-based. pageCount is total pages, not item count. Narrow containers show Previous/Next and a summary; wide ones show a bounded page window.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `page` | `number` | yes | source-defined |  |
| `pageCount` | `number` | yes | source-defined |  |
| `onPageChange` | `(page: number) => void` | yes | source-defined |  |
| `compact` | `boolean \| undefined` | no | `false` |  |
| `label` | `string \| undefined` | no | `"Pagination"` |  |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/data-table.stories.tsx` (repository checkout)
- `components/pagination.stories.tsx` (repository checkout)

## Avoid

- A feed meant to be browsed continuously — use infinite scroll or a load-more control.
- Result sets short enough to show at once.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

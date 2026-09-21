# Chart

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **component**. implemented; see verification report for tested scope.

Token-bound chart container for compact documentation and dashboard examples.

```tsx
import { Chart } from 'jakeui';
```

[Implementation](../../../components/chart.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Reveal a pattern, comparison, or trend that a table would bury.
- Presentation wrapper, not a charting engine. Supply the renderer, data and textual takeaway; use approved chart token roles for series colours.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `title` | `string` | yes | source-defined |  |
| `children` | `ReactNode` | yes | source-defined |  |
| `type` | `"bar" \| "line" \| undefined` | no | `'bar'` |  |
| `description` | `string \| undefined` | no | source-defined | Text alternative. A chart must state its TAKEAWAY, not its chart type — "Revenue rose 12% in Q3", not "bar chart". |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/chart.stories.tsx` (repository checkout)

## Avoid

- Precise values the reader needs to read off exactly — use a table.
- A single number — use a stat or a Badge.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

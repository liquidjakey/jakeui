# Calendar

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **component**. implemented; see verification report for tested scope.

Month calendar supporting single-date and date-range selection in compact and comfortable densities.

```tsx
import { Calendar } from 'jakeui';
```

[Implementation](../../../components/calendar.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Pick a date, or a start and end pair, where the calendar context matters.
- Controlled month and selection. onSelect emits one Date; the caller owns assembling a range. English weekday names and Sunday week start are currently fixed; monthLabel alone does not localize the grid.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `month` | `Date` | yes | source-defined |  |
| `monthLabel` | `string` | yes | source-defined |  |
| `onMonthChange` | `(month: Date) => void` | yes | source-defined |  |
| `mode` | `"single" \| "range" \| undefined` | no | `'single'` |  |
| `selected` | `Date \| [Date, (Date \| undefined)?] \| undefined` | no | source-defined |  |
| `onSelect` | `(value: Date) => void` | yes | source-defined |  |
| `density` | `"compact" \| "comfortable" \| undefined` | no | `'compact'` |  |
| `isDisabled` | `((date: Date) => boolean) \| undefined` | no | source-defined |  |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/calendar.stories.tsx` (repository checkout)

## Avoid

- A date the user knows by heart, such as a birthdate — a plain text field is faster.
- Coarse periods like a month or quarter — offer a NativeSelect.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

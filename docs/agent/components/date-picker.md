# DatePicker

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **component**. implemented; see verification report for tested scope.

Controlled single-date or tuple-range selection with a calendar popup and native date-entry fields.

```tsx
import { DatePicker } from 'jakeui';
```

[Implementation](../../../components/date-picker.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Pick a date, or a start and end pair, where the calendar context matters.
- Discriminated interface: single uses Date, range uses [Date, Date?]; match the callback to mode. Open state is internal. Native date fields support typing. There is no public min/max/isDisabled prop; request an extension when date restrictions are required.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `label` | `string` | yes | source-defined |  |
| `invalid` | `boolean \| undefined` | no | source-defined |  |
| `errorMessage` | `string \| undefined` | no | source-defined |  |
| `disabled` | `boolean \| undefined` | no | source-defined |  |
| `format` | `((d: Date) => string) \| undefined` | no | source-defined |  |
| `mode` | `"single" \| "range" \| undefined` | no | source-defined |  |
| `value` | `Date \| DateRange \| undefined` | yes | source-defined |  |
| `onChange` | `((date: Date) => void) \| ((range: DateRange) => void)` | yes | source-defined |  |

## Discriminated branches

Choose one whole branch; do not combine callbacks/values from different branches.

### Branch 1

- `mode?: "single" | undefined`
- `value: Date | undefined`
- `onChange: (date: Date) => void`

### Branch 2

- `mode: "range"`
- `value: DateRange | undefined`
- `onChange: (range: DateRange) => void`

## Supporting types

Compiler-selected public types referenced by this interface. Use these exact data shapes.

```ts
export type DateRange = [Date, Date?];
```


## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/date-picker.stories.tsx` (repository checkout)

## Avoid

- A date the user knows by heart, such as a birthdate — a plain text field is faster.
- Coarse periods like a month or quarter — offer a NativeSelect.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

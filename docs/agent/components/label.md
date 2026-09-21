# Label

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **component**. implemented; see verification report for tested scope.

Form control label primitive.

```tsx
import { Label } from 'jakeui';
```

[Implementation](../../../components/label.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Name a form control, so it is identifiable before and after it is filled.
- requirement is a decorative marker only. Set required or aria-required on the linked control; disabled only dims the label.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `children` | `ReactNode` | yes | source-defined | The label text. A ReactNode so a marker or inline code can be composed in. |
| `htmlFor` | `string` | yes | source-defined | The id of the control this labels. |
| `requirement` | `"required" \| "optional" \| undefined` | no | source-defined | Appends a marker. `undefined` means no marker at all. |
| `disabled` | `boolean \| undefined` | no | `false` | Dims the label to match a disabled control. Visual only. |
| `className` | `string \| undefined` | no | source-defined |  |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/label.stories.tsx` (repository checkout)

## Avoid

- Helper text, format hints, or validation messages — those are separate elements.
- A section heading — use a heading.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

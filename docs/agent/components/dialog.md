# Dialog

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **component**. implemented; see verification report for tested scope.

General-purpose modal surface for focused tasks and forms.

```tsx
import { Dialog } from 'jakeui';
```

[Implementation](../../../components/dialog.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Interrupt for a focused task, or a decision that blocks the flow.
- type is content classification exposed as data-type; both types use Heading/LG. size controls width. Compose body/footer through slots.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `open` | `boolean` | yes | source-defined |  |
| `onClose` | `() => void` | yes | source-defined |  |
| `title` | `string` | yes | source-defined |  |
| `description` | `string \| undefined` | no | source-defined |  |
| `children` | `ReactNode` | no | source-defined |  |
| `footer` | `ReactNode` | no | source-defined |  |
| `type` | `"form" \| "standard" \| undefined` | no | `'standard'` | Content classification exposed as data-type; both types use Heading/LG. |
| `size` | `"small" \| "large" \| undefined` | no | `'small'` | Selects the content width; see the scoped overlay geometry exception. |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/dialog.stories.tsx` (repository checkout)

## Avoid

- Non-critical messages — use Alert.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

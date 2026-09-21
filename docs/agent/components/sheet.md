# Sheet

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **component**. implemented; see verification report for tested scope.

Modal edge-attached surface for a focused secondary task.

```tsx
import { Sheet } from 'jakeui';
```

[Implementation](../../../components/sheet.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Present a focused task in a modal panel attached to a viewport edge.
- Modal dialog surface, not a persistent nonblocking sidebar. Use a layout region for persistent adjacent content.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `open` | `boolean` | yes | source-defined |  |
| `onClose` | `() => void` | yes | source-defined |  |
| `title` | `string` | yes | source-defined |  |
| `description` | `string \| undefined` | no | source-defined |  |
| `children` | `ReactNode` | no | source-defined |  |
| `side` | `"left" \| "right" \| undefined` | no | `'right'` | Viewport edge to attach to; this surface is not anchored to a trigger. |
| `width` | `"compact" \| "wide" \| undefined` | no | `'compact'` | Existing overlay width preset; geometry is scoped in agent/exceptions.json. |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/drawer-sheet.stories.tsx` (repository checkout)

## Avoid

- Persistent nonblocking content: use an application layout region.
- Nonblocking feedback: use Alert.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

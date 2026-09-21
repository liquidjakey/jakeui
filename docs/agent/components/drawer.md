# Drawer

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **component**. implemented; see verification report for tested scope.

Modal side surface for a focused secondary task.

```tsx
import { Drawer } from 'jakeui';
```

[Implementation](../../../components/drawer.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Present contextual controls or a focused task in a modal edge panel.
- Modal side surface. Currently shares behavior/visual language with Sheet; neither is a persistent nonmodal panel.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `open` | `boolean` | yes | source-defined |  |
| `onClose` | `() => void` | yes | source-defined |  |
| `title` | `string` | yes | source-defined |  |
| `description` | `string \| undefined` | no | source-defined |  |
| `children` | `ReactNode` | no | source-defined |  |
| `placement` | `"left" \| "right" \| undefined` | no | `'right'` | Figma axis `Placement`. Opening edge. |
| `width` | `"compact" \| "wide" \| undefined` | no | `'compact'` | Existing overlay width preset; geometry is scoped in agent/exceptions.json. |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/drawer-sheet.stories.tsx` (repository checkout)

## Avoid

- Persistent nonblocking content: use an application layout region.
- Nonblocking feedback: use Alert.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

# Popover

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **component**. implemented; see verification report for tested scope.

Controlled anchored interactive popup with optional modal focus management.

```tsx
import { Popover } from 'jakeui';
```

[Implementation](../../../components/popover.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Show secondary content or a small task in context, anchored to its trigger.
- Use for anchored interactive content. Supply open/onOpenChange and a single trigger that forwards props and ref (Button or a native element). modal owns focus containment, outside inertness and scroll lock. Placement may flip at edges.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `open` | `boolean` | yes | source-defined |  |
| `onOpenChange` | `(open: boolean) => void` | yes | source-defined |  |
| `trigger` | `ReactNode` | yes | source-defined |  |
| `title` | `string \| undefined` | no | source-defined |  |
| `description` | `string \| undefined` | no | source-defined |  |
| `children` | `ReactNode` | no | source-defined |  |
| `size` | `"small" \| "large" \| undefined` | no | `'small'` |  |
| `arrow` | `boolean \| undefined` | no | `false` |  |
| `side` | `PopoverSide \| undefined` | no | `'bottom'` |  |
| `modal` | `boolean \| undefined` | no | `false` |  |

## Supporting types

Compiler-selected public types referenced by this interface. Use these exact data shapes.

```ts
export type PopoverSide = 'top' | 'right' | 'bottom' | 'left';
```


## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/popover.stories.tsx` (repository checkout)

## Avoid

- A decision that must block the flow — use a Dialog.
- A plain text hint — use a Tooltip.
- A list of actions — use a menu.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

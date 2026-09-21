# Tooltip

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **component**. implemented; see verification report for tested scope.

Optional noninteractive explanation on hover or focus.

```tsx
import { Tooltip } from 'jakeui';
```

[Implementation](../../../components/tooltip.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Clarify an already named control with short, nonessential text.
- Noninteractive, nonessential text only. Trigger must forward events/ref and have its own accessible name. For interactive content use Popover; for a disabled button place guidance on a focusable wrapper or show it inline.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `label` | `string` | yes | source-defined |  |
| `children` | `ReactElement<unknown, string \| import("react").JSXElementConstructor<any>>` | yes | source-defined |  |
| `side` | `"left" \| "right" \| "top" \| "bottom" \| undefined` | no | `'top'` |  |
| `delay` | `number \| undefined` | no | `400` |  |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/tooltip.stories.tsx` (repository checkout)

## Avoid

- A control's only accessible name or essential instructions: provide a label or visible text.
- Interactive content: use Popover.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

# HoverCard

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **component**. implemented; see verification report for tested scope.

Contextual preview surface revealed on pointer hover or keyboard focus.

```tsx
import { HoverCard } from 'jakeui';
```

[Implementation](../../../components/hover-card.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Preview the thing behind a link on hover, without making the reader navigate.
- Optional supplementary information only. Trigger must forward events/ref. Essential information needs a visible or explicit click-accessible path, particularly on touch devices.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `title` | `string` | yes | source-defined |  |
| `description` | `string \| undefined` | no | source-defined |  |
| `children` | `ReactElement<unknown, string \| import("react").JSXElementConstructor<any>>` | yes | source-defined |  |
| `meta` | `ReactNode` | no | source-defined |  |
| `density` | `"compact" \| "detailed" \| undefined` | no | `'compact'` |  |
| `openDelay` | `number \| undefined` | no | `500` |  |
| `closeDelay` | `number \| undefined` | no | `200` |  |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/hover-card.stories.tsx` (repository checkout)

## Avoid

- Content the user needs — hover is unavailable on touch and to many keyboard users.
- Anything required to complete a task.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

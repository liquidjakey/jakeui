# PopoverBackdrop

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **anatomy**. implemented; see verification report for tested scope.

Visual scrim anatomy; modality is owned by Popover.

```tsx
import { PopoverBackdrop } from 'jakeui';
```

[Implementation](../../../components/popover.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Only inside its parent component's composition — this is a part, not a standalone component.
- Prefer: Popover.
- Visual scrim only. mode does not implement a focus trap; Popover owns modality.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `open` | `boolean` | yes | source-defined |  |
| `mode` | `"modal" \| "trapFocus" \| undefined` | no | `'modal'` |  |
| `onClick` | `(() => void) \| undefined` | no | source-defined |  |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/popover-content.stories.tsx` (repository checkout)

## Avoid

- On its own, outside the parent that owns its behaviour and accessibility wiring.
- As a general-purpose layout or text primitive.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

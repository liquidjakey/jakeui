# PopoverTrigger

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **anatomy**. implemented; see verification report for tested scope.

Controlled button for opening or closing a Popover.

```tsx
import { PopoverTrigger } from 'jakeui';
```

[Implementation](../../../components/popover.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Only inside its parent component's composition — this is a part, not a standalone component.
- Prefer: Popover with Button trigger.
- Controlled button. Prefer passing Button to Popover; this trigger can also compose with Popover without duplicating state changes.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `children` | `ReactNode` | yes | source-defined |  |
| `open` | `boolean` | yes | source-defined |  |
| `onOpenChange` | `(open: boolean) => void` | yes | source-defined |  |
| `disabled` | `boolean \| undefined` | no | `false` |  |
| `controls` | `string \| undefined` | no | source-defined |  |

Additional inherited DOM attributes (285) are listed in agent/manifest.json; exclusions and types follow the [source interface](../../../components/popover.tsx).

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/popover-content.stories.tsx` (repository checkout)

## Avoid

- On its own, outside the parent that owns its behaviour and accessibility wiring.
- As a general-purpose layout or text primitive.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

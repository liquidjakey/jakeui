# DropdownMenuSubContent

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **part**. implemented; see verification report for tested scope.

Nested menu surface anchored to its linked submenu trigger.

```tsx
import { DropdownMenuSubContent } from 'jakeui';
```

[Implementation](../../../components/dropdown-menu.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Only inside its parent component's composition — this is a part, not a standalone component.
- Pair id with its SubTrigger controls. Selection dismisses the ancestor popup chain. Caller should clear child open states when removing the parent.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `children` | `ReactNode` | yes | source-defined |  |
| `side` | `"left" \| "right" \| undefined` | no | `'right'` |  |
| `align` | `"start" \| "center" \| "end" \| undefined` | no | `'start'` |  |
| `label` | `string \| undefined` | no | source-defined |  |
| `id` | `string \| undefined` | no | source-defined |  |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/dropdown-menu.stories.tsx` (repository checkout)

## Avoid

- On its own, outside the parent that owns its behaviour and accessibility wiring.
- As a general-purpose layout or text primitive.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

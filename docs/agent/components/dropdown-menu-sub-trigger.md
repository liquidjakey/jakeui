# DropdownMenuSubTrigger

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **part**. implemented; see verification report for tested scope.

Submenu trigger with closed, open, highlighted, and disabled states plus optional inset alignment.

```tsx
import { DropdownMenuSubTrigger } from 'jakeui';
```

[Implementation](../../../components/dropdown-menu.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Only inside its parent component's composition — this is a part, not a standalone component.
- Use inside a menu, with shared open state and controls matching SubContent.id. Parent menu provides keyboard navigation.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `children` | `ReactNode` | yes | source-defined |  |
| `open` | `boolean` | yes | source-defined |  |
| `onOpenChange` | `(open: boolean) => void` | yes | source-defined |  |
| `icon` | `ReactNode` | no | source-defined |  |
| `inset` | `boolean \| undefined` | no | `false` |  |
| `disabled` | `boolean \| undefined` | no | `false` |  |
| `controls` | `string \| undefined` | no | source-defined |  |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/dropdown-menu.stories.tsx` (repository checkout)

## Avoid

- On its own, outside the parent that owns its behaviour and accessibility wiring.
- As a general-purpose layout or text primitive.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

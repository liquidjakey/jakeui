# TableActionTrigger

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **part**. implemented; see verification report for tested scope.

Icon-only row-action trigger used with Dropdown Menu.

```tsx
import { TableActionTrigger } from 'jakeui';
```

[Implementation](../../../components/table.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Only inside its parent component's composition — this is a part, not a standalone component.
- Supply a context-specific label and onClick. This button does not anchor a menu by itself; DropdownMenuTrigger provides controls/id pairing for anchored menus.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `label` | `string` | yes | source-defined | Accessible action name that identifies the row or task context. |
| `onClick` | `() => void` | yes | source-defined |  |
| `icon` | `ReactNode` | no | source-defined |  |
| `disabled` | `boolean \| undefined` | no | `false` |  |
| `expanded` | `boolean \| undefined` | no | `false` |  |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/table.stories.tsx` (repository checkout)

## Avoid

- On its own, outside the parent that owns its behaviour and accessibility wiring.
- As a general-purpose layout or text primitive.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

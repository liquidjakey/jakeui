# DropdownMenuItem

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **part**. implemented; see verification report for tested scope.

Standard command item.

```tsx
import { DropdownMenuItem } from 'jakeui';
```

[Implementation](../../../components/dropdown-menu.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Only inside its parent component's composition — this is a part, not a standalone component.
- Render inside DropdownMenu or DropdownMenuContent so keyboard navigation and activation are provided.
- shortcut is visual text only and does not install a keyboard shortcut.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `children` | `ReactNode` | yes | source-defined |  |
| `onSelect` | `() => void` | yes | source-defined |  |
| `tone` | `"default" \| "destructive" \| undefined` | no | `'default'` |  |
| `icon` | `ReactNode` | no | source-defined |  |
| `shortcut` | `string \| undefined` | no | source-defined |  |
| `inset` | `boolean \| undefined` | no | `false` |  |
| `disabled` | `boolean \| undefined` | no | `false` |  |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/dropdown-menu-content.stories.tsx` (repository checkout)
- `components/dropdown-menu-item.stories.tsx` (repository checkout)

## Avoid

- On its own, outside the parent that owns its behaviour and accessibility wiring.
- As a general-purpose layout or text primitive.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

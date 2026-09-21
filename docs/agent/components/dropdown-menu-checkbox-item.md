# DropdownMenuCheckboxItem

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **part**. implemented; see verification report for tested scope.

Checkable menu item with unchecked, checked, and indeterminate values plus default, highlighted, and disabled states.

```tsx
import { DropdownMenuCheckboxItem } from 'jakeui';
```

[Implementation](../../../components/dropdown-menu.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Only inside its parent component's composition — this is a part, not a standalone component.
- Render inside a menu. checked/onCheckedChange; toggling keeps the menu open.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `children` | `ReactNode` | yes | source-defined |  |
| `checked` | `boolean \| "indeterminate" \| undefined` | no | `false` |  |
| `onCheckedChange` | `(checked: boolean) => void` | yes | source-defined |  |
| `icon` | `ReactNode` | no | source-defined |  |
| `disabled` | `boolean \| undefined` | no | `false` |  |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/dropdown-menu-item.stories.tsx` (repository checkout)

## Avoid

- On its own, outside the parent that owns its behaviour and accessibility wiring.
- As a general-purpose layout or text primitive.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

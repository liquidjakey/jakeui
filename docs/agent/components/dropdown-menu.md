# DropdownMenu

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **component**. implemented; see verification report for tested scope.

Controlled action menu with keyboard navigation and linked-trigger positioning.

```tsx
import { DropdownMenu } from 'jakeui';
```

[Implementation](../../../components/dropdown-menu.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Offer actions from a trigger when showing all actions would crowd the view.
- Pair id with DropdownMenuTrigger controls, and conditionally mount from shared open state. Unique ids are required. A linked menu portals and positions itself; an unlinked menu is inline. Use nested SubTrigger/SubContent with matching controls/id.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `children` | `ReactNode` | yes | source-defined |  |
| `type` | `"checkbox" \| "standard" \| undefined` | no | source-defined |  |
| `density` | `"compact" \| "comfortable" \| undefined` | no | `'compact'` |  |
| `label` | `string \| undefined` | no | source-defined |  |
| `id` | `string \| undefined` | no | source-defined |  |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/dropdown-menu-item.stories.tsx` (repository checkout)
- `components/dropdown-menu.stories.tsx` (repository checkout)

## Avoid

- A primary form-choice control: use NativeSelect or RadioGroup. Checkable menu items support secondary menu settings.
- Primary navigation: use NavigationMenu or Sidebar.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

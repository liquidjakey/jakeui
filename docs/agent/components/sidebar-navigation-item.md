# SidebarNavigationItem

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **part**. implemented; see verification report for tested scope.

Navigation item with Sidebar-owned collapse state.

```tsx
import { SidebarNavigationItem } from 'jakeui';
```

[Implementation](../../../components/sidebar.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- A single destination within sidebar navigation.
- Use inside Sidebar for collapse propagation. active is route state, not a Figma state enum. Supply the actual destination or action appropriate to the exported props.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `children` | `ReactNode` | yes | source-defined |  |
| `href` | `string` | yes | source-defined |  |
| `active` | `boolean \| undefined` | no | `false` |  |
| `icon` | `ReactNode` | no | source-defined |  |
| `collapsed` | `boolean \| undefined` | no | source-defined | Set by Sidebar. Hides the label visually while keeping the accessible name. |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/sidebar.stories.tsx` (repository checkout)

## Avoid

- Firing an action rather than navigating — use a Button.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

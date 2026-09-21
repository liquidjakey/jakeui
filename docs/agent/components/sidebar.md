# Sidebar

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **component**. implemented; see verification report for tested scope.

Application sidebar with desktop and compact structures.

```tsx
import { Sidebar } from 'jakeui';
```

[Implementation](../../../components/sidebar.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Keep navigation persistently in view alongside the main content.
- collapsed propagates to SidebarNavigationItem. Application shell owns responsive placement and route state; this is not a mobile drawer.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `children` | `ReactNode` | yes | source-defined |  |
| `collapsed` | `boolean \| undefined` | no | `false` |  |
| `onCollapsedChange` | `((collapsed: boolean) => void) \| undefined` | no | source-defined |  |
| `label` | `string \| undefined` | no | `"Main"` |  |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/sidebar.stories.tsx` (repository checkout)

## Avoid

- Fewer than about five destinations — a horizontal bar reads faster.
- Page content or filters that belong in the main column.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

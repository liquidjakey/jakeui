# NavigationMenu

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **component**. implemented; see verification report for tested scope.

Flat navigation links with a controlled compact toggle.

```tsx
import { NavigationMenu } from 'jakeui';
```

[Implementation](../../../components/navigation-menu.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Present top-level destinations with desktop and compact layouts.
- Links come from items. Supply open/onOpenChange for the compact toggle. This is not the similarly named shadcn/Radix primitive interface.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `items` | `NavItem[]` | yes | source-defined |  |
| `open` | `boolean \| undefined` | no | `false` |  |
| `onOpenChange` | `((open: boolean) => void) \| undefined` | no | source-defined |  |
| `label` | `string \| undefined` | no | `"Main"` |  |

## Supporting types

Compiler-selected public types referenced by this interface. Use these exact data shapes.

```ts
export interface NavItem {
  href: string;
  label: string;
  current?: boolean;
}
```


## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/navigation-menu.stories.tsx` (repository checkout)

## Avoid

- Nested navigation groups: this interface has no nested item shape.
- Actions: use DropdownMenu.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

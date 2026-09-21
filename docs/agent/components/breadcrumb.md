# Breadcrumb

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **component**. implemented; see verification report for tested scope.

Hierarchical location trail.

```tsx
import { Breadcrumb } from 'jakeui';
```

[Implementation](../../../components/breadcrumb.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Show where the current page sits in a hierarchy, and offer a way back up.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `items` | `BreadcrumbItem[]` | yes | source-defined |  |
| `collapsed` | `boolean \| undefined` | no | `false` |  |
| `label` | `string \| undefined` | no | `'Breadcrumb'` |  |

## Supporting types

Compiler-selected public types referenced by this interface. Use these exact data shapes.

```ts
export interface BreadcrumbItem {
  label: string;
  href?: string;
}
```


## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/breadcrumb.stories.tsx` (repository checkout)

## Avoid

- Flat sites with no hierarchy.
- Step-by-step progress through a flow — use an application-owned sequence with explicit current-step semantics.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

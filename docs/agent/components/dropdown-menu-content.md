# DropdownMenuContent

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **anatomy**. implemented; see verification report for tested scope.

Unanchored menu anatomy with keyboard navigation.

```tsx
import { DropdownMenuContent } from 'jakeui';
```

[Implementation](../../../components/dropdown-menu.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Provide a menu surface within a composition that owns positioning, trigger wiring and open state.
- Prefer: DropdownMenu.
- Unanchored menu surface. Keyboard behavior is present, but side/align do not anchor the surface to a trigger.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `children` | `ReactNode` | yes | source-defined |  |
| `side` | `"left" \| "right" \| "top" \| "bottom" \| undefined` | no | `'bottom'` |  |
| `align` | `"start" \| "center" \| "end" \| undefined` | no | `'start'` |  |
| `arrow` | `boolean \| undefined` | no | `false` |  |
| `label` | `string \| undefined` | no | source-defined |  |
| `id` | `string \| undefined` | no | source-defined |  |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/dropdown-menu-content.stories.tsx` (repository checkout)

## Avoid

- An automatically anchored popup: use DropdownMenu.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

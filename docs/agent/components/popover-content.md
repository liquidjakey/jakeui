# PopoverContent

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **anatomy**. implemented; see verification report for tested scope.

Unanchored presentation surface without popup behavior.

```tsx
import { PopoverContent } from 'jakeui';
```

[Implementation](../../../components/popover.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Only inside its parent component's composition — this is a part, not a standalone component.
- Prefer: Popover.
- Unanchored presentation surface only. side/align are geometry metadata; this export does not provide positioning, dialog semantics, dismissal or focus management.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `title` | `string \| undefined` | no | source-defined |  |
| `description` | `string \| undefined` | no | source-defined |  |
| `children` | `ReactNode` | no | source-defined |  |
| `action` | `ReactNode` | no | source-defined |  |
| `onClose` | `(() => void) \| undefined` | no | source-defined |  |
| `size` | `"small" \| "large" \| undefined` | no | `'small'` |  |
| `side` | `PopoverSide \| undefined` | no | `'bottom'` |  |
| `align` | `"start" \| "center" \| "end" \| undefined` | no | `'start'` |  |
| `arrow` | `boolean \| undefined` | no | `false` |  |

## Supporting types

Compiler-selected public types referenced by this interface. Use these exact data shapes.

```ts
export type PopoverSide = 'top' | 'right' | 'bottom' | 'left';
```


## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/popover-content.stories.tsx` (repository checkout)

## Avoid

- On its own, outside the parent that owns its behaviour and accessibility wiring.
- As a general-purpose layout or text primitive.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

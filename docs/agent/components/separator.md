# Separator

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **component**. implemented; see verification report for tested scope.

Visual separator for grouping adjacent content.

```tsx
import { Separator } from 'jakeui';
```

[Implementation](../../../components/separator.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Mark a boundary between groups that spacing alone does not make clear.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `orientation` | `"vertical" \| "horizontal" \| undefined` | no | `'horizontal'` | Axis the rule runs along. |
| `decorative` | `boolean \| undefined` | no | `true` | Visual only (default) vs a real semantic boundary. |
| `className` | `string \| undefined` | no | source-defined |  |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/separator.stories.tsx` (repository checkout)

## Avoid

- Where whitespace already separates the groups.
- Decoration, or as a border around a region.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

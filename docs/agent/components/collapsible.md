# Collapsible

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **component**. implemented; see verification report for tested scope.

Single disclosure region for optional controls or secondary information.

```tsx
import { Collapsible } from 'jakeui';
```

[Implementation](../../../components/collapsible.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Let the reader collapse secondary content so the page stays scannable.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `triggerLabel` | `string` | yes | source-defined |  |
| `children` | `ReactNode` | yes | source-defined |  |
| `open` | `boolean` | yes | source-defined |  |
| `onOpenChange` | `(open: boolean) => void` | yes | source-defined |  |
| `disabled` | `boolean \| undefined` | no | `false` |  |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/collapsible.stories.tsx` (repository checkout)

## Avoid

- Content the reader almost always needs — show it instead of hiding it.
- Switching between peer views — use Tabs.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

# Skeleton

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **component**. implemented; see verification report for tested scope.

Loading placeholders for text, avatar rows, cards, and table rows.

```tsx
import { Skeleton } from 'jakeui';
```

[Implementation](../../../components/skeleton.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Hold the shape of content that is loading, so the layout does not jump when it arrives.
- The component owns a status region; its shapes are aria-hidden. Use one meaningful loading announcement per region rather than duplicating nested announcements.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `type` | `"text" \| "avatar" \| "card" \| "tableRow" \| undefined` | no | `'text'` |  |
| `label` | `string \| undefined` | no | `'Loading'` | Text for this component's status region; shapes are hidden from assistive technology. |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/skeleton.stories.tsx` (repository checkout)

## Avoid

- Waits short enough that it flashes.
- Work with a known duration or total — use Progress.
- An error or an empty result — those need their own states.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

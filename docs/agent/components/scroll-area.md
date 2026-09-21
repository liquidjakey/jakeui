# ScrollArea

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **component**. implemented; see verification report for tested scope.

Named focusable scroll region using native scrollbars.

```tsx
import { ScrollArea } from 'jakeui';
```

[Implementation](../../../components/scroll-area.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Confine overflow to one region so the page itself does not scroll.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `children` | `ReactNode` | yes | source-defined |  |
| `axis` | `"vertical" \| "horizontal" \| undefined` | no | `'vertical'` |  |
| `label` | `string` | yes | source-defined | Required: a focusable region with no name is an unexplained tab stop. |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/scroll-area.stories.tsx` (repository checkout)

## Avoid

- The main page scroll — leave that to the browser.
- Hiding content the reader is unlikely to look for.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

# Accordion

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **component**. implemented; see verification report for tested scope.

Disclosure component for vertically stacked question-and-answer or settings sections.

```tsx
import { Accordion } from 'jakeui';
```

[Implementation](../../../components/accordion.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Let the reader collapse secondary content so the page stays scannable.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `items` | `AccordionItem[]` | yes | source-defined |  |
| `openIds` | `string[]` | yes | source-defined |  |
| `onToggle` | `(id: string) => void` | yes | source-defined |  |

## Supporting types

Compiler-selected public types referenced by this interface. Use these exact data shapes.

```ts
export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
  disabled?: boolean;
}
```


## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/accordion.stories.tsx` (repository checkout)

## Avoid

- Content the reader almost always needs — show it instead of hiding it.
- Switching between peer views — use Tabs.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

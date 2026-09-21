# Tabs

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **component**. implemented; see verification report for tested scope.

Grouped navigation for switching between peer views without leaving the current context.

```tsx
import { Tabs } from 'jakeui';
```

[Implementation](../../../components/tabs.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Switch between peer views of the same subject, within one context.
- Complete controlled tablist and panels. Supply items, selectedId and onSelect; the component composes SegmentedTab and owns group keyboard navigation.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `items` | `TabItem[]` | yes | source-defined |  |
| `selectedId` | `string` | yes | source-defined |  |
| `onSelect` | `(id: string) => void` | yes | source-defined |  |
| `orientation` | `"vertical" \| "horizontal" \| undefined` | no | `'horizontal'` |  |
| `density` | `"default" \| "compact" \| undefined` | no | `'default'` |  |
| `label` | `string \| undefined` | no | source-defined |  |

## Supporting types

Compiler-selected public types referenced by this interface. Use these exact data shapes.

```ts
export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}
```


## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/tabs.stories.tsx` (repository checkout)

## Avoid

- Steps in a sequence — use an application-owned sequence with explicit current-step semantics.
- Content the reader needs to compare side by side, or to find with the browser's search.
- Navigating to a different page — use links.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

# SegmentedTab

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **part**. implemented; see verification report for tested scope.

Single tab item for a Tabs-owned tablist and panel.

```tsx
import { SegmentedTab } from 'jakeui';
```

[Implementation](../../../components/segmented-tab.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Switch between peer views of the same subject, within one context.
- Prefer: Tabs.
- One tab item, not a complete tablist. Tabs supplies group keyboard navigation and linked panels. Standalone items require a tablist owner, roving focus and aria-controls/id wiring.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `label` | `string` | yes | source-defined |  |
| `selected` | `boolean \| undefined` | no | `false` |  |
| `onSelect` | `() => void` | yes | source-defined |  |
| `controls` | `string \| undefined` | no | source-defined | Id of the panel this tab controls. |
| `disabled` | `boolean \| undefined` | no | `false` |  |
| `id` | `string \| undefined` | no | source-defined |  |
| `tabIndex` | `number \| undefined` | no | source-defined | Set by the parent Tabs; a standalone tab cannot know its siblings. |
| `icon` | `ReactNode` | no | source-defined |  |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/segmented-tab.stories.tsx` (repository checkout)

## Avoid

- Steps in a sequence — use an application-owned sequence with explicit current-step semantics.
- Content the reader needs to compare side by side, or to find with the browser's search.
- Navigating to a different page — use links.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

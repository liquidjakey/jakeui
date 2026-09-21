# ToggleGroup

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **component**. implemented; see verification report for tested scope.

Grouped toggle controls for choosing one or multiple persistent options.

```tsx
import { ToggleGroup } from 'jakeui';
```

[Implementation](../../../components/toggle-group.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- A reversible on/off action that takes effect immediately — bold, mute, pin, show grid.
- Use the group form when several such actions belong together in a toolbar.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `items` | `ToggleGroupItem[]` | yes | source-defined |  |
| `pressedIds` | `string[]` | yes | source-defined |  |
| `onPressedChange` | `(ids: string[]) => void` | yes | source-defined |  |
| `selection` | `"single" \| "multiple" \| undefined` | no | `'single'` |  |
| `orientation` | `"vertical" \| "horizontal" \| undefined` | no | `'horizontal'` |  |
| `label` | `string` | yes | source-defined |  |

## Supporting types

Compiler-selected public types referenced by this interface. Use these exact data shapes.

```ts
export interface ToggleGroupItem {
  id: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
}
```


## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/toggle-group.stories.tsx` (repository checkout)

## Avoid

- A form value that is only applied on Save — use Checkbox or RadioGroup.
- One-of-many where the options are the data, not actions — use RadioGroup.
- A one-way action that cannot be un-done — use a Button.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

# Toggle

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **component**. implemented; see verification report for tested scope.

Two-state action button for formatting, view controls, or other reversible selections.

```tsx
import { Toggle } from 'jakeui';
```

[Implementation](../../../components/toggle.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- A reversible on/off action that takes effect immediately — bold, mute, pin, show grid.
- Use the group form when several such actions belong together in a toolbar.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `label` | `string` | yes | source-defined |  |
| `pressed` | `boolean` | yes | source-defined |  |
| `onPressedChange` | `(pressed: boolean) => void` | yes | source-defined |  |
| `disabled` | `boolean \| undefined` | no | `false` |  |
| `icon` | `ReactNode` | no | source-defined | When set and label is used as the name only, this renders icon-only. |
| `iconOnly` | `boolean \| undefined` | no | `false` |  |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/toggle.stories.tsx` (repository checkout)

## Avoid

- A form value that is only applied on Save — use Checkbox or RadioGroup.
- One-of-many where the options are the data, not actions — use RadioGroup.
- A one-way action that cannot be un-done — use a Button.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

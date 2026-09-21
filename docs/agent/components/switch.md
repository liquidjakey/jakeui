# Switch

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **component**. implemented; see verification report for tested scope.

Controlled labelled switch for an immediate boolean setting.

```tsx
import { Switch } from 'jakeui';
```

[Implementation](../../../components/switch.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- An independent boolean setting that takes effect immediately.
- Use checked and onCheckedChange. This is the interactive labelled control; SwitchRoot is only its visual track.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `label` | `string` | yes | source-defined |  |
| `checked` | `boolean` | yes | source-defined |  |
| `onCheckedChange` | `(checked: boolean) => void` | yes | source-defined |  |
| `disabled` | `boolean \| undefined` | no | `false` |  |
| `description` | `string \| undefined` | no | source-defined |  |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/switch.stories.tsx` (repository checkout)

## Avoid

- A choice applied after Save or submit: use Checkbox.
- Exclusive options: use RadioGroup. An action command: use Button.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

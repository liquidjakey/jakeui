# RadioGroupIndicator

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **anatomy**. implemented; see verification report for tested scope.

Checked-state indicator nested inside RadioGroup / Item.

```tsx
import { RadioGroupIndicator } from 'jakeui';
```

[Implementation](../../../components/radio-group.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Inspect or compose visual anatomy under an owner that provides the full control semantics; prefer RadioGroup for application work.
- Prefer: RadioGroup.
- Decorative checked dot only.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `checked` | `boolean \| undefined` | no | `false` |  |
| `disabled` | `boolean \| undefined` | no | source-defined |  |
| `forceMount` | `boolean \| undefined` | no | `false` | Keeps the decorative indicator mounted when unchecked for animation or measurement. |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/radio-group-item.stories.tsx` (repository checkout)

## Avoid

- A standalone interactive control: use RadioGroup.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

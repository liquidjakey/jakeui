# RadioGroupRoot

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **anatomy**. implemented; see verification report for tested scope.

Presentation fieldset; child controls own exclusive selection.

```tsx
import { RadioGroupRoot } from 'jakeui';
```

[Implementation](../../../components/radio-group.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Inspect or compose visual anatomy under an owner that provides the full control semantics; prefer RadioGroup for application work.
- Prefer: RadioGroup.
- Presentation fieldset only. Does not own value, onValueChange or exclusive selection; children supply controls. disabled disables descendant native controls and dims the legend; invalid/readOnly do not propagate visual state to children.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `children` | `import("react").ReactNode` | yes | source-defined |  |
| `orientation` | `"vertical" \| "horizontal" \| undefined` | no | `'vertical'` |  |
| `label` | `string` | yes | source-defined |  |
| `state` | `"default" \| "invalid" \| "disabled" \| "readOnly" \| undefined` | no | `'default'` | Only disabled affects this wrapper; other states do not propagate to children. |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/radio-group-root.stories.tsx` (repository checkout)

## Avoid

- A standalone interactive control: use RadioGroup.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

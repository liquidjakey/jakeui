# RadioGroupItem

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **anatomy**. implemented; see verification report for tested scope.

Decorative radio circle with visual state previews.

```tsx
import { RadioGroupItem } from 'jakeui';
```

[Implementation](../../../components/radio-group.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Inspect or compose visual anatomy under an owner that provides the full control semantics; prefer RadioGroup for application work.
- Prefer: RadioGroup.
- Decorative circle, aria-hidden, not an interactive radio input.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `checked` | `boolean \| undefined` | no | `false` |  |
| `state` | `RadioState \| undefined` | no | `'default'` |  |

## Supporting types

Compiler-selected public types referenced by this interface. Use these exact data shapes.

```ts
export type RadioState = 'default' | 'hover' | 'focused' | 'disabled' | 'readOnly' | 'invalid';
```


## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/radio-group-item.stories.tsx` (repository checkout)
- `components/radio-group-root.stories.tsx` (repository checkout)

## Avoid

- A standalone interactive control: use RadioGroup.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

# SwitchThumb

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **anatomy**. implemented; see verification report for tested scope.

Movable Switch thumb.

```tsx
import { SwitchThumb } from 'jakeui';
```

[Implementation](../../../components/switch.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Inspect or compose visual anatomy under an owner that provides the full control semantics; prefer Switch for application work.
- Prefer: Switch.
- Visual thumb only. Match the size of its track; no keyboard or pointer behavior is provided.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `checked` | `boolean \| undefined` | no | `false` |  |
| `size` | `"default" \| "small" \| undefined` | no | `'default'` |  |
| `disabled` | `boolean \| undefined` | no | `false` |  |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/switch-root.stories.tsx` (repository checkout)

## Avoid

- A standalone interactive control: use Switch.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

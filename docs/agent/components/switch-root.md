# SwitchRoot

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **anatomy**. implemented; see verification report for tested scope.

Decorative switch track with visual state previews.

```tsx
import { SwitchRoot } from 'jakeui';
```

[Implementation](../../../components/switch.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Inspect or compose visual anatomy under an owner that provides the full control semantics; prefer Switch for application work.
- Prefer: Switch.
- Visual span only, not a focusable switch. The state enum previews appearance, not independent runtime conditions.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `checked` | `boolean` | yes | source-defined |  |
| `size` | `"default" \| "small" \| undefined` | no | `'default'` |  |
| `state` | `"default" \| "invalid" \| "disabled" \| "hover" \| "focused" \| "readOnly" \| undefined` | no | `'default'` | Visual preview state only; does not implement interaction or semantics. |
| `children` | `import("react").ReactNode` | no | source-defined |  |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/switch-root.stories.tsx` (repository checkout)

## Avoid

- A standalone interactive control: use Switch.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

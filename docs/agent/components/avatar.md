# Avatar

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **component**. implemented; see verification report for tested scope.

Compact identity representation using initials and optional presence status.

```tsx
import { Avatar } from 'jakeui';
```

[Implementation](../../../components/avatar.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Represent a person, account, or organisation compactly.
- Supply name independently of initials. decorative hides the identity image when nearby text already names it; status still has separate accessible text. Small typography is an internal scoped exception, not a consumer style.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `initials` | `string` | yes | source-defined |  |
| `name` | `string` | yes | source-defined | The accessible name. "AL" read aloud is meaningless. |
| `size` | `"small" \| "medium" \| "large" \| undefined` | no | `'medium'` |  |
| `status` | `"online" \| "offline" \| "busy" \| undefined` | no | source-defined |  |
| `src` | `string \| undefined` | no | source-defined |  |
| `decorative` | `boolean \| undefined` | no | `false` | True when a visible name sits beside it — avoids announcing it twice. |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/avatar.stories.tsx` (repository checkout)

## Avoid

- Decorative imagery, or a general-purpose image container.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

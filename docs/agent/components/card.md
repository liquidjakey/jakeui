# Card

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **component**. implemented; see verification report for tested scope.

Content container for related information and actions.

```tsx
import { Card } from 'jakeui';
```

[Implementation](../../../components/card.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Group related content and actions about a single subject.
- href makes the whole card a link. Keep nested actions outside an interactive card to avoid nested interactive elements; use a static card with explicit links/buttons otherwise.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `title` | `string` | yes | source-defined |  |
| `description` | `string \| undefined` | no | source-defined |  |
| `children` | `ReactNode` | no | source-defined |  |
| `media` | `ReactNode` | no | source-defined | Leading media. Its PRESENCE is what makes this a media card — Figma's `Type` axis. |
| `href` | `string \| undefined` | no | source-defined | When set the whole card is a link. Its presence is Figma's `State=Interactive`. |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/card.stories.tsx` (repository checkout)

## Avoid

- Primary page layout scaffolding.
- A bare list of text.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

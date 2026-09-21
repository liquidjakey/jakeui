# Command

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **anatomy**. implemented; see verification report for tested scope.

Option anatomy for a command interface; not a complete palette.

```tsx
import { Command } from 'jakeui';
```

[Implementation](../../../components/command.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Render an option inside an approved command-interface owner that supplies search, keyboard navigation and activation.
- Prefer: No complete command palette is exported..
- An option primitive only. A parent must implement search, active-descendant navigation and keyboard activation; do not present this as a ready-made command palette.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `children` | `ReactNode` | yes | source-defined |  |
| `shortcut` | `string \| undefined` | no | source-defined |  |
| `selected` | `boolean \| undefined` | no | `false` |  |
| `onSelect` | `() => void` | yes | source-defined |  |
| `icon` | `ReactNode` | no | source-defined |  |
| `id` | `string \| undefined` | no | source-defined |  |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/command.stories.tsx` (repository checkout)

## Avoid

- A ready-made command palette: none is exported.
- A fixed action list: use DropdownMenu. A form choice: use NativeSelect.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

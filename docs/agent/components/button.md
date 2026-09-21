# Button

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **component**. implemented; see verification report for tested scope.

Action button with primary, secondary, outline and ghost styles.

```tsx
import { Button } from 'jakeui';
```

[Implementation](../../../components/button.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Trigger an action or event — submit, confirm, open a dialog.
- Content is children, not label. Variants use style, not variant. Sizes are small/medium, not sm/lg. style is a variant string, not a CSS object. Native button events, attributes and ref are forwarded.
- The leadingIcon slot owns direct SVG sizing: 16px for small, 20px for medium. Use Phosphor components, not text glyphs.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `children` | `ReactNode` | yes | source-defined |  |
| `onClick` | `import("react").MouseEventHandler<HTMLButtonElement> \| undefined` | no | source-defined |  |
| `style` | `"primary" \| "secondary" \| "outline" \| "ghost" \| undefined` | no | `"primary"` |  |
| `size` | `"small" \| "medium" \| undefined` | no | `"medium"` |  |
| `leadingIcon` | `ReactNode` | no | source-defined | Decorative icon slot. Direct SVGs render at 16px in small and 20px in medium buttons. |
| `disabled` | `boolean \| undefined` | no | `false` |  |
| `type` | `"button" \| "submit" \| "reset" \| undefined` | no | `"button"` | Defaults to "button": an untyped <button> inside a form submits it. |

Additional inherited DOM attributes (283) are listed in agent/manifest.json; exclusions and types follow the [source interface](../../../components/button.tsx).

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/alert.stories.tsx` (repository checkout)
- `components/button.stories.tsx` (repository checkout)
- `components/native-select.stories.tsx` (repository checkout)
- `components/select.stories.tsx` (repository checkout)

## Avoid

- Navigating between pages or URLs — use a native anchor or router link.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

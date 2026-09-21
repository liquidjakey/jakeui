# AlertDialog

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **component**. implemented; see verification report for tested scope.

Modal confirmation surface for consequential actions.

```tsx
import { AlertDialog } from 'jakeui';
```

[Implementation](../../../components/alert-dialog.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Confirm a consequential action with explicit cancel and confirm choices.
- Consequential confirmation with explicit cancel/confirm callbacks. Description is required; backdrop does not dismiss. This is not a general content modal.
- Initial focus goes to Cancel. Escape invokes onCancel; the caller closes controlled open state. Use destructive only for irreversible loss.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `open` | `boolean` | yes | source-defined |  |
| `onCancel` | `() => void` | yes | source-defined | The safe path. Also fired by Escape. |
| `onAction` | `() => void` | yes | source-defined | The consequential path. |
| `title` | `string` | yes | source-defined |  |
| `description` | `string` | yes | source-defined |  |
| `cancelLabel` | `string \| undefined` | no | `'Cancel'` |  |
| `actionLabel` | `string` | yes | source-defined |  |
| `tone` | `"default" \| "destructive" \| undefined` | no | `'default'` | Use destructive only when the action causes irreversible loss. |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/alert-dialog.stories.tsx` (repository checkout)

## Avoid

- General forms or custom focused tasks: use Dialog.
- Nonblocking feedback: use Alert.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

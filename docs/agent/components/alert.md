# Alert

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **component**. implemented; see verification report for tested scope.

Inline feedback message for informational, successful, warning, and destructive states.

```tsx
import { Alert } from 'jakeui';
```

[Implementation](../../../components/alert.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Deliver an in-page message about the state of the view or a task.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `title` | `string` | yes | source-defined |  |
| `description` | `string \| undefined` | no | source-defined |  |
| `icon` | `ReactNode` | no | source-defined |  |
| `action` | `ReactNode` | no | source-defined |  |
| `tone` | `"destructive" \| "info" \| "success" \| "warning" \| undefined` | no | `'info'` |  |
| `onDismiss` | `(() => void) \| undefined` | no | source-defined |  |
| `live` | `"off" \| "assertive" \| "polite" \| undefined` | no | `'off'` | Defaults to off: an alert on page load must not interrupt. |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/alert.stories.tsx` (repository checkout)

## Avoid

- A decision that must block the flow — use a Dialog.
- A toast notification: no toast component is exported; use inline Alert or request an extension.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

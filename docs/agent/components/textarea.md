# Textarea

Generated from TypeScript and agent/usage.json. Regenerate with `npm run agent:sync`.

Kind: **component**. implemented; see verification report for tested scope.

Multiline text input for longer freeform content.

```tsx
import { Textarea } from 'jakeui';
```

[Implementation](../../../components/textarea.tsx) · [Figma correspondence](../../../figma.map.json)

## Usage

- Collect free-form text long enough to need more than one line.
- Controlled: supply value and onChange. Use Field for label and validation wiring.
- rows sets a fixed editing viewport; long content scrolls and user resizing is disabled. maxLength adds a described character counter, not a per-keystroke live announcement.

## Public props

Types and required fields below are compiler-derived. Default expressions are extracted where explicitly declared; omitted defaults are not a promise of a static value.

| Prop | Type | Required | Default expression | Contract |
|---|---|---|---|---|
| `value` | `string` | yes | source-defined | Current field value. Renders in `--foreground`. |
| `placeholder` | `string \| undefined` | no | source-defined | Shown when `value` is empty. Renders in `--muted-foreground` (code-only state — no Figma variant). |
| `helper` | `string \| undefined` | no | source-defined | Helper text below the field. Figma property `Helper#82:14`. |
| `rows` | `number \| undefined` | no | `4` | Initial visible height in lines. Code-only — see the sizing policy below. |
| `maxLength` | `number \| undefined` | no | source-defined | Character limit. When set, a counter is rendered and linked via `aria-describedby`. |
| `invalid` | `boolean \| undefined` | no | `false` | Applies the error border. Independent of `disabled`. |
| `errorMessage` | `string \| undefined` | no | source-defined | Standalone invalid controls need an error message. Inside Field, pass it to Field only. |
| `disabled` | `boolean \| undefined` | no | `false` | Blocks input. Independent of `invalid`. |
| `onChange` | `(e: ChangeEvent<HTMLTextAreaElement>) => void` | yes | source-defined |  |
| `onFocus` | `((e: FocusEvent<HTMLTextAreaElement>) => void) \| undefined` | no | source-defined |  |
| `onBlur` | `((e: FocusEvent<HTMLTextAreaElement>) => void) \| undefined` | no | source-defined |  |
| `name` | `string \| undefined` | no | source-defined |  |
| `id` | `string \| undefined` | no | source-defined | Ties the field to its `<label>`. Auto-generated when omitted. |
| `required` | `boolean \| undefined` | no | `false` |  |
| `aria-label` | `string \| undefined` | no | source-defined | Required only when no visible `<label>` exists. |
| `aria-describedby` | `string \| undefined` | no | source-defined |  |
| `aria-invalid` | `boolean \| "true" \| "false" \| "grammar" \| "spelling" \| undefined` | no | source-defined |  |

## Examples

The following source stories are available in the repository checkout; installed consumers use [the shipped recipes](../recipes.md).

- `components/field.stories.tsx` (repository checkout)
- `components/textarea.stories.tsx` (repository checkout)

## Avoid

- A single short value — use Input.
- Rich or formatted content — use a rich-text editor, not a plain textarea.

Use [the workflow](../workflow.md) for absent capabilities; do not infer props from Figma variant labels.

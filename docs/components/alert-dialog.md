# Alert Dialog

Modal confirmation surface for consequential actions.

- **Figma:** `Alert Dialog` — node `66:...`, 2 variants
- **Code:** [`components/alert-dialog.tsx`](../../components/alert-dialog.tsx) — implemented 9 Aug 2026, exports `AlertDialog`
- **Maturity:** `draft`. Transcribed from `docs/components/Alert-Dialog.doc.json`, implemented, built in Storybook — **not yet visually reviewed**
- **Format:** [props-table-format.md](../props-table-format.md)

> Shares the native `<dialog>` surface with [`dialog.md`](./dialog.md) — see its Table 4
> for the platform-supplied behaviour, which is identical here **except for two
> deliberate differences**, both below.

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `open` | `boolean` | — | ✓ | Controlled visibility. |
| `onCancel` | `() => void` | — | ✓ | The safe path. Also fired by Escape. |
| `onAction` | `() => void` | — | ✓ | The consequential path. |
| `title` | `string` | — | ✓ | Names the dialog. Figma property `Title#66:0`. |
| `description` | `string` | — | ✓ | **Required here**, unlike `Dialog` — see Table 4. Figma property `Description#66:3`. |
| `cancelLabel` | `string` | `'Cancel'` | | Figma property `Cancel label#66:6`. |
| `actionLabel` | `string` | — | ✓ | Figma property `Action label#66:9`. |
| `tone` | `'default' \| 'destructive'` | `'default'` | | Figma axis `Tone`. |

No `children` and no `footer`. The whole point of this component is that its content is
fixed: title, description, two buttons. A slot would let a caller turn it back into a
`Dialog`.

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Title#66:0` · `Description#66:3` | string | `title` · `description` | 1:1, but `description` is **required** in code where Figma treats it as optional copy. |
| `Cancel label#66:6` · `Action label#66:9` | string | `cancelLabel` · `actionLabel` | 1:1. |
| `Tone` | Default · Destructive | `tone` | 1:1. Genuinely exclusive. |
| — | — | `open`, `onCancel`, `onAction` | **Missing in Figma.** Visibility and the two outcomes have no design representation. Two separate callbacks rather than one, because *which* button was pressed is the entire information this component exists to collect. |

⚠️ **A vocabulary collision worth knowing about.** `Tone=Destructive`'s meaning in the
doc record reads *"An error that blocks progress."* That is the `tone` vocabulary entry
written for `Alert`, where destructive means *something went wrong*. Here it means
*this action is irreversible* — a warning about the future, not a report about the past.
The record's own description is the accurate one: *"Use Tone=Destructive only when the
primary action causes irreversible loss."* The shared vocabulary in
`docs/archetypes.json` is generic by design and does not fit this component; the
description overrides it.

---

## 3. State → token binding

Transcribed from `Alert-Dialog.doc.json`. One row for two variants — `Tone=Destructive`
carries no *root-level* delta, because the tone is expressed on the action **button**,
not on the surface.

| State | Trigger | Tokens applied |
|---|---|---|
| Default | base | fill `card` · border `1px` `border` · radius `radius/lg` · text `card-foreground` · type `size/18` |
| Destructive | `tone === 'destructive'` | No surface change. ⚠️ The action button should bind `destructive`, but **no button token is recorded here** — `tokensUsed` lists five and none is an action or accent colour. Until `Button` is built and bound, the action button is styled from `destructive` directly, asserted rather than transcribed. |

✅ **This component binds `card-foreground`, which is the correct pairing for a `card`
fill.** `Dialog`, `Drawer` and `Sheet` all bind plain `foreground` on the same fill.
They currently resolve identically, so nothing is visibly wrong — but see the ⚠️ in
[`dialog.md`](./dialog.md) Table 3. **This component is the one that is right.**

---

## 4. Accessibility & keyboard

Identical to [`dialog.md`](./dialog.md) Table 4, with two deliberate differences:

| Concern | Contract |
|---|---|
| Description | **Required, not optional.** A confirmation whose only text is a title cannot tell the user what they are agreeing to. Enforced by the type. |
| Backdrop click | **Does not close.** This is the difference that matters. A `Dialog` is dismissible by clicking away; an `AlertDialog` is a decision, and dismissing a decision by misclick is how people lose data. Escape still cancels, because Escape is unambiguous intent and is the platform contract users rely on. |
| Initial focus | The **cancel** control, not the action — the safe path is the default for someone who presses Enter reflexively. |
| Escape | Routes to `onCancel`, never `onAction`. |
| Tone | Destructive tone is carried by the action button's label and colour together, never colour alone. |


---

## Authoring checklist

- [x] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [x] No enum in Table 1 mixes states that can co-occur at runtime
- [x] No prop in Table 1 covers two concerns
- [x] Icon and content slots are typed as nodes, not booleans — *deliberately no slots*
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged ⚠️ — the action button colour
- [x] Table 4 is filled in for anything interactive
- [x] The tables compile to a valid interface with nothing invented and nothing missing

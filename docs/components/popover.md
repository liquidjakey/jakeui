# Popover

Anchored content surface with optional arrow.

- **Figma:** `Popover` — node `111:...`, 4 variants
- **Code:** [`components/popover.tsx`](../../components/popover.tsx) — implemented 9 Aug 2026, exports `Popover`
- **Maturity:** `draft`. Transcribed from `docs/components/Popover.doc.json`.
- **Format:** [props-table-format.md](../props-table-format.md)

> **`Popover / Root Composition` is not bound to code**, for the same reason as
> `Table / Root Composition`: its `Pattern` axis is `kind: story-only` (*"Storybook
> story, never a prop"*). Its four patterns — Basic, Align, Form, RTL — ship as stories.
>
> **`Popover / Content` (48 variants, 1 state row) remains blocked** by the 8-row cap.
> Unlike `Table / Row`, nothing can be inferred from 1 of 48.

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `open` | `boolean` | — | ✓ | Controlled. |
| `onOpenChange` | `(open: boolean) => void` | — | ✓ | Fired by Escape, outside click, or the close control. |
| `trigger` | `ReactNode` | — | ✓ | The anchor. |
| `title` | `string` | `undefined` | | Figma property `Title#111:0`. |
| `description` | `string` | `undefined` | | Figma property `Description#111:5`. |
| `children` | `ReactNode` | `undefined` | | Body slot. |
| `size` | `'small' \| 'large'` | `'small'` | | Figma axis `Size`. ⚠️ No width token exists. |
| `arrow` | `boolean` | `false` | | Figma axis `Arrow`, as a real boolean. |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | | Placement. ⚠️ Not on this asset — see Table 2. |
| `modal` | `boolean` | `false` | | Traps focus. See Table 4. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Title#111:0` · `Description#111:5` | string | `title` · `description` | 1:1. |
| `Size` | Small · Large | `size` | 1:1 in name. ⚠️ **No width token exists anywhere in the file**, so both widths are raw — the same gap recorded for Dialog. |
| `Arrow` | False · True | `arrow` boolean | **Yes.** The map's `'false' \| 'true'` string union is a Figma artefact. |
| — | — | `side` | **Not on this asset.** Placement lives on `Popover / Content`, which is blocked. The four values come from the shared `side` vocabulary. |
| — | — | `open`, `onOpenChange`, `trigger`, `modal` | **Missing in Figma.** |

---

## 3. State → token binding

| State | Trigger | Tokens applied |
|---|---|---|
| Base | all variants | fill `popover` · border `1px` `border` · radius `radius/lg` · text `popover-foreground` · type `size/15` |

✅ **This component uses the correct surface pairing** — `popover` fill with
`popover-foreground` text. Worth noting against `Dialog`, which binds plain `foreground`
on a `card` fill, and `Card`, which binds `info-foreground`. The `popover` family is the
one that gets it right consistently.

⚠️ **No positioning, collision or offset tokens.** Placement is geometry, not tokens, and
the implementation does **not** do collision detection — it places on the requested side
and stays there. Flipping near a viewport edge needs a positioning library, which is out
of scope for a token-level component and is recorded here rather than half-built.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Trigger | The record: *"The trigger carries `aria-expanded` and `aria-controls`."* |
| Focus | The record draws the line precisely: *"A popover holding a form should trap focus; a non-modal one should not."* That is the `modal` prop — it is a behaviour choice, not decoration. |
| Escape | Closes and returns focus to the trigger. |
| Outside click | Closes. |
| Role | `role="dialog"` when `modal`, otherwise a plain labelled region — a non-modal surface announced as a dialog misleads. |

---

## Compiled output

```ts
interface PopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  size?: 'small' | 'large';
  arrow?: boolean;
  side?: 'top' | 'right' | 'bottom' | 'left';
  modal?: boolean;
}
```

---

## Authoring checklist

- [x] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [x] No enum in Table 1 mixes states that can co-occur at runtime
- [x] No prop in Table 1 covers two concerns
- [x] Icon and content slots are typed as nodes, not booleans
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged ⚠️ — width, positioning
- [x] Table 4 is filled in for anything interactive
- [x] The tables compile to a valid interface with nothing invented and nothing missing

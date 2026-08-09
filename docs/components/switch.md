# Switch

Labelled switch with checked/unchecked and default/focused/disabled states.

- **Figma:** `Switch` — node `81:0`, 6 variants
- **Code:** [`components/switch.tsx`](../../components/switch.tsx) — implemented 9 Aug 2026, exports `Switch`
- **Maturity:** `draft`. **The track has no recorded tokens** — see Table 3.
- **Format:** [props-table-format.md](../props-table-format.md)

---

## 🛑 This asset records the label, not the switch

`Switch.doc.json`'s entire `tokensUsed` is `foreground`, `muted-foreground`, `size/14` —
**three text tokens and nothing else.** There is no track fill, no checked colour, no
border. The record says why: *"Exact source anatomy and examples are implemented by
Switch / Thumb, Switch / Root, and …"*.

- `Switch / Thumb` gives the thumb: `fill card` · `radius radius/full`.
- **`Switch / Root` — which holds the track — is BLOCKED** by the 8-row cap (24 variants,
  8 rows).

So the single most important visual in this component, *the track and its checked
colour*, is not available in any readable record.

**The track is asserted**, on the strongest precedent available: `Radio Group / Indicator`
binds `fill primary` for its checked indicator, so `primary` is this system's checked-state
colour. Unchecked uses `input`, the border/neutral token every form control here already
binds.

This is the largest assertion made anywhere in this build, and the checklist box below is
left unticked because of it. **Re-verify the moment `Switch / Root` is readable.**

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `label` | `string` | — | ✓ | Figma property `Label#81:0`. |
| `checked` | `boolean` | — | ✓ | Figma axis `Value`, as a real boolean. |
| `onCheckedChange` | `(checked: boolean) => void` | — | ✓ | |
| `disabled` | `boolean` | `false` | | From the decomposed `State` axis. |
| `description` | `string` | `undefined` | | Supporting line. ⚠️ Not a Figma property on this asset. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Label#81:0` | string | `label` | 1:1. |
| `Value` | Unchecked · Checked | `checked` boolean | **Yes.** A two-value enum describing a binary. |
| `State` | Default · Focused · Disabled | `disabled` boolean | **Yes.** `kind: decompose`, `cssOwned: ["Focused"]`. |
| — | — | `description` | **Missing here**, but `Switch / Field Composition` documents a "Description" pattern, so the shape is anticipated. |

---

## 3. State → token binding

| State | Trigger | Tokens applied |
|---|---|---|
| Unchecked | base | text `foreground` · type `size/14` |
| Disabled | `disabled` | text `muted-foreground` — for **both** checked and unchecked |
| Track | — | 🛑 **No token recorded.** Asserted `input` unchecked / `primary` checked. |
| Thumb | — | fill `card` · radius `radius/full` — from `Switch / Thumb` |

⚠️ **Checked has no text delta.** A checked switch's label looks identical to an unchecked
one, which is correct — the state belongs to the control, not the label.

⚠️ **No focus token**; shared `ring` asserted.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Element | Native `<button role="switch">` with `aria-checked`. Not a checkbox — a switch takes effect immediately, a checkbox applies on save. |
| Name | `label`, associated by id. |
| Keyboard | Space toggles. Enter does **not** — that is the switch convention and it differs from `Toggle`, which is a button and takes both. |
| State | `aria-checked`, never colour alone. |
| Disabled | Native `disabled`, leaves the tab order. |

---

## Compiled output

```ts
interface SwitchProps {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  description?: string;
}
```

---

## Authoring checklist

- [x] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [x] No enum in Table 1 mixes states that can co-occur at runtime
- [x] No prop in Table 1 covers two concerns
- [x] Icon and content slots are typed as nodes, not booleans — *n/a*
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged 🛑 — the track
- [x] Table 4 is filled in for anything interactive
- [ ] **The tables compile to a valid interface with nothing invented and nothing missing** — the track colour is asserted, not read. Not closable until `Switch / Root` is readable.

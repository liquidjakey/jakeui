# Popover / Close

Explicit close control for Popover content.

- **Figma:** `Popover / Close` — 4 variants
- **Code:** [`components/popover.tsx`](../../components/popover.tsx) — implemented 9 Aug 2026, exports `PopoverClose`
- **Maturity:** `draft`. Transcribed from `docs/components/Popover-Close.doc.json`.
- **Format:** [props-table-format.md](../props-table-format.md)

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `onClose` | `() => void` | — | ✓ | Dismisses the popover. |
| `label` | `string` | `'Close'` | | The accessible name — required by the record, defaulted here. |
| `disabled` | `boolean` | `false` | | From the decomposed `State` axis. |
| `icon` | `ReactNode` | `undefined` | | Defaults to a cross glyph. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `State` | Default · Hover · Focused · Disabled | `disabled` boolean | **Yes.** `kind: decompose`, `cssOwned: ["Hover","Focused"]`. |
| — | — | `onClose`, `label`, `icon` | **Missing in Figma.** The record requires the name in prose: *"icon-only close control requires a programmatic accessible name such as 'Close' and a visible focus indicator; the icon itself is decorative to assistive technology."* |

Unlike `Table / Action Trigger`, whose name must identify a row and so is **required**,
this one defaults to `"Close"` — that is genuinely the right name in almost every case,
and a required prop everyone fills with the same string is friction, not safety.

---

## 3. State → token binding

Three rows for four variants — Disabled carries no delta.

| State | Trigger | Tokens applied |
|---|---|---|
| Default | base | fill `popover` · radius `radius/7` |
| Hover | `:hover` | fill `accent` |
| Focus | `:focus-visible` | fill `accent` · border `2px` `ring` |
| Disabled | `disabled` | ⚠️ **No tokens recorded.** Shared muted convention asserted. |

⚠️ **`radius/7` — a half-step ramp member**, and the only component in this system that
binds it. Written as an explicit calc so it can never degrade to a raw pixel value, the
same treatment `space/2-25` gets in `Input`.

⚠️ **No icon colour is recorded.** Inherits `currentColor`.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Name | `aria-label`, defaulting to "Close". The record: the icon itself is decorative and is `aria-hidden`. |
| Focus | Visible indicator, explicitly required by the record. |
| Keyboard | Enter and Space — it is a native `<button>`. |
| Redundancy | Escape already closes the popover. This control exists for pointer and touch users, who have no Escape key. |


---

## Authoring checklist

- [x] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [x] No enum in Table 1 mixes states that can co-occur at runtime
- [x] No prop in Table 1 covers two concerns
- [x] Icon and content slots are typed as nodes, not booleans
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged ⚠️ — disabled, icon colour
- [x] Table 4 is filled in for anything interactive
- [x] The tables compile to a valid interface with nothing invented and nothing missing

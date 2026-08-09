# Table / Action Trigger

Icon-only row-action trigger, used with Dropdown Menu.

- **Figma:** `Table / Action Trigger` — 4 variants
- **Code:** [`components/table.tsx`](../../components/table.tsx) — implemented 9 Aug 2026, exports `TableActionTrigger`
- **Maturity:** `draft`. Transcribed from `docs/components/Table-Action-Trigger.doc.json`.
- **Format:** [props-table-format.md](../props-table-format.md)

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `label` | `string` | — | ✓ | **Required.** The accessible name — see Table 4. |
| `onClick` | `() => void` | — | ✓ | Opens the row's menu. |
| `icon` | `ReactNode` | `undefined` | | Defaults to a vertical ellipsis. |
| `disabled` | `boolean` | `false` | | From the decomposed `State` axis. |
| `expanded` | `boolean` | `false` | | Mirrors the menu's open state for `aria-expanded`. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `State` | Default · Hover · Focused · Disabled | `disabled` boolean | **Yes.** `kind: decompose` with `cssOwned: ["Hover","Focused"]`, `booleans: ["disabled"]`. Hover and focus are CSS. |
| — | — | `label` | **Missing in Figma, and required by the record.** Its accessibility contract: *"icon-only row action trigger requires a programmatic accessible name that identifies the action context (for example, 'Open row actions')."* Making it required in the type is the only way to enforce that. |
| — | — | `onClick`, `icon`, `expanded` | **Missing in Figma.** |

---

## 3. State → token binding

Three rows for four variants — `State=Disabled` carries no delta of its own.

| State | Trigger | Tokens applied |
|---|---|---|
| Default | base | fill `card` · radius `radius/lg` |
| Hover | `:hover` | fill `accent` |
| Focus | `:focus-visible` | fill `accent` · border `2px` `ring` |
| Disabled | `disabled` | ⚠️ **No tokens recorded.** The shared muted convention is asserted. |

⚠️ **No icon colour is recorded.** `tokensUsed` is four entries and none is a foreground.
The icon inherits `currentColor` from the row.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Name | **Required and enforced by the type.** An icon-only control with no name is unusable by screen reader; the record calls this out explicitly and names the shape of a good one: *"Open row actions"* — it identifies the context, not just the glyph. |
| Menu | The record: *"Runtime implementation requires an accessible name and menu focus management."* `aria-haspopup="menu"` and `aria-expanded`; focus moves into the menu on open and back here on close. That is `Dropdown Menu`'s job — this component only reports state. |
| Focus | Visible indicator, explicitly required by the record. |
| Disabled | Native `disabled`, leaves the tab order. |
| Target size | An icon-only control in a dense row is the most likely place to fall under the 24px minimum. Padding keeps it above. |


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

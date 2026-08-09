# Dropdown Menu

Menu content configurations — the basic content-pattern layer of the family.

- **Figma:** `Dropdown Menu` — node `109:...`, 4 variants
- **Code:** [`components/dropdown-menu.tsx`](../../components/dropdown-menu.tsx) — implemented 9 Aug 2026, exports `DropdownMenu`
- **Maturity:** `draft`. Transcribed from `docs/components/Dropdown-Menu.doc.json`.
- **Format:** [props-table-format.md](../props-table-format.md)

> **Six of this family's eleven assets are built.** Blocked by the 8-row cap:
> `Dropdown Menu / Content` (24 variants, **1** state row), `/ Item` (12, 8),
> `/ Root Composition` (24, 8). Not mapped to code at all: `/ Checkbox Item`,
> `/ Group`, `/ Radio Group`, `/ Separator`, `/ Shortcut`. Nothing can be inferred
> from 1 of 24, so `Content` stays blocked — unlike `Table / Row`, whose missing rows
> sat on a provably inert axis.

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `children` | `ReactNode` | — | ✓ | Items. |
| `type` | `'standard' \| 'checkbox'` | `'standard'` | | Figma axis `Type`. ⚠️ No token delta. |
| `density` | `'compact' \| 'comfortable'` | `'compact'` | | Figma axis `Density`. ⚠️ No token delta. |
| `label` | `string` | `undefined` | | Accessible name for the menu. |
| `id` | `string` | `undefined` | | Target for the trigger's `aria-controls`. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Type` | Standard · Checkbox | `type` | 1:1 in name. ⚠️ No token delta — checkbox items carry their own treatment, so this axis describes *what is inside*, not how the container looks. |
| `Density` | Compact · Comfortable | `density` | 1:1 in name. ⚠️ No token delta; raw padding, the fourth component in this system with that gap. |
| `Primary item label#109:0` · `Primary shortcut#109:5` | string | **nothing** | **Yes.** Example content, not API — the same pattern as `Table`'s row labels and `Breadcrumb`'s three fixed levels. A real menu has N items. |

---

## 3. State → token binding

| State | Trigger | Tokens applied |
|---|---|---|
| Base | all four variants | fill `popover` · border `1px` `border` · radius `radius/lg` · text `popover-foreground` · type `size/13` |

✅ Correct surface pairing, consistent with the whole `popover` family.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Role | `role="menu"`; items are `menuitem` / `menuitemradio`. |
| Keyboard | Arrow keys move between items, Enter activates, Escape closes and returns focus to the trigger, typing a letter jumps to the next matching item. |
| Focus | Moves into the menu on open, back to the trigger on close. |
| Distinction | A menu fires **actions**. It does not hold form state — that is a `Select`. |


---

## Authoring checklist

- [x] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [x] No enum in Table 1 mixes states that can co-occur at runtime
- [x] No prop in Table 1 covers two concerns
- [x] Icon and content slots are typed as nodes, not booleans
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged ⚠️ — type and density both inert
- [x] Table 4 is filled in for anything interactive
- [x] The tables compile to a valid interface with nothing invented and nothing missing

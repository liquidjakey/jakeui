# Dropdown Menu / Checkbox Item

Multi-select menu item.

- **Figma:** `Dropdown Menu / Checkbox Item` — node `144:52`, 9 variants
- **Code:** [`components/dropdown-menu.tsx`](../../components/dropdown-menu.tsx) — implemented 9 Aug 2026, exports `DropdownMenuCheckboxItem`
- **Maturity:** `draft`. **Recovered from the 8-row cap** — see below.
- **Format:** [props-table-format.md](../props-table-format.md)

---

## Recovered from the cap

9 variants = `Value`(unchecked · checked · indeterminate) × `State`(Default · Highlighted
· Disabled). 4 rows present.

**`Value` is provably inert**: all three Highlighted rows — Unchecked, Checked and
Indeterminate — bind identical tokens (`fill accent · text accent-foreground`). Three
observations, no exceptions. So the two missing Default rows match Unchecked/Default.

The three Disabled rows have zero observations; the shared muted convention is asserted,
as it is for every other item in this family.

🛑 **And the same defect as the radio item:** `Value` being inert means **there is no
recorded way to tell a checked item from an unchecked one.** For a multi-select control
that is the state that must be visible. A check indicator is asserted in the leading
slot. `aria-checked` carries it correctly regardless, so this is a sighted-user gap.

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `children` | `ReactNode` | — | ✓ | Label. Figma property `Label#144:52`. |
| `checked` | `boolean \| 'indeterminate'` | `false` | | Figma axis `Value`. Three states, so not a plain boolean. |
| `onCheckedChange` | `(checked: boolean) => void` | — | ✓ | |
| `icon` | `ReactNode` | `undefined` | | Leading slot; `Show icon` collapses into it. |
| `disabled` | `boolean` | `false` | | From the decomposed `State` axis. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Label#144:52` | string | `children` | Widened. |
| `Value` | Unchecked · Checked · Indeterminate | `checked: boolean \| 'indeterminate'` | **Yes.** Three values. Indeterminate is a display state, never selectable, so the callback returns a boolean. |
| `Show icon#146:0` + `Icon#259:13` | boolean + instance | `icon` | `kind: slot-toggle` — boolean disappears. |
| `State` | Default · Highlighted · Disabled | `disabled` | `cssOwned: ["Highlighted"]`. |

⚠️ **The `icon` slot and the check indicator compete for the same leading position.** With
no recorded checked visual, the indicator takes precedence when checked — a decision
forced by the missing token, not a design choice.

---

## 3. State → token binding

| State | Trigger | Tokens applied |
|---|---|---|
| Default | base | fill `popover` · radius `radius/4` · text `popover-foreground` · type `size/13` |
| Highlighted | active descendant | fill `accent` · text `accent-foreground` — **for all three values** |
| Checked | `checked` | 🛑 **No token recorded.** Indicator asserted. |
| Disabled | `disabled` | ⚠️ No tokens recorded. Muted convention asserted. |

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Role | `role="menuitemcheckbox"` with `aria-checked`, which takes `"mixed"` for indeterminate. |
| Keyboard | Arrow keys move, Enter or Space toggles. Unlike a radio item, **the menu stays open** — that is the point of multi-select. |
| Checked | Must be visible, not only in the accessibility tree — see the 🛑 above. |
| Disabled | Skipped by arrow-key navigation. |


---

## Authoring checklist

- [x] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [x] No enum in Table 1 mixes states that can co-occur at runtime
- [x] No prop in Table 1 covers two concerns
- [x] Icon and content slots are typed as nodes, not booleans
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged 🛑 — the checked indicator
- [x] Table 4 is filled in for anything interactive
- [ ] **The tables compile to a valid interface with nothing invented and nothing missing** — Value is proven inert, which is itself the defect: the checked state has no recorded visual.

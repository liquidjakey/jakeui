# Dropdown Menu / Radio Item

Exclusive-choice menu item used inside a radio group.

- **Figma:** `Dropdown Menu / Radio Item` — node `144:62`, 6 variants
- **Code:** [`components/dropdown-menu.tsx`](../../components/dropdown-menu.tsx) — implemented 9 Aug 2026, exports `DropdownMenuRadioItem`
- **Maturity:** `draft`. Transcribed from `docs/components/Dropdown-Menu-Radio-Item.doc.json`.
- **Format:** [props-table-format.md](../props-table-format.md)

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `children` | `ReactNode` | — | ✓ | Label. Figma property `Label#144:62`. |
| `checked` | `boolean` | `false` | | Figma axis `Value`, as a real boolean. |
| `onSelect` | `() => void` | — | ✓ | |
| `icon` | `ReactNode` | `undefined` | | Leading slot — **two Figma properties collapse into this one**; see Table 2. |
| `disabled` | `boolean` | `false` | | From the decomposed `State` axis. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Label#144:62` | string | `children` | Widened to a node. |
| `Value` | Unchecked · Checked | `checked` boolean | **Yes.** A two-value enum describing a binary. |
| `Show icon#146:20` | boolean | *(gone)* | **Yes.** The map types it `kind: slot-toggle` and states the rule: *"Boolean toggles a placeholder in Figma; in code the slot is nullable and the boolean disappears."* |
| `Icon#259:23` | instance | `icon` | The surviving half of that pair. Passing `icon` is what shows it. |
| `State` | Default · Highlighted · Disabled | `disabled` boolean | **Yes.** `kind: decompose` with `cssOwned: ["Highlighted"]` — highlighted is the keyboard/pointer active-descendant state, which is CSS and never a prop. |

---

## 3. State → token binding

Three rows for six variants — the absent three are `Checked/Default`,
`Unchecked/Disabled`, `Checked/Disabled`.

| State | Trigger | Tokens applied |
|---|---|---|
| Default | base | fill `popover` · radius `radius/4` · text `popover-foreground` · type `size/13` |
| Highlighted | `:hover` / active descendant | fill `accent` · text `accent-foreground` |
| Disabled | `disabled` | ⚠️ **No tokens recorded.** Shared muted convention asserted. |

🛑 **`Value=Checked` carries no token delta at all.** Both checked rows in the record are
`Highlighted` rows, and they are identical to the unchecked highlighted row. **There is
no recorded way to tell a checked radio item from an unchecked one.**

For an *exclusive-choice* control that is the one state that must be visible. The
implementation renders a check indicator in the leading slot — **asserted, not
transcribed**, because a radio item that cannot show which option is chosen is not
usable. `aria-checked` carries it correctly regardless, so assistive technology is fine;
this is a sighted-user gap. **Figma owes a checked indicator.**

⚠️ **`radius/4`** here where the container binds `radius/lg`.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Role | `role="menuitemradio"` with `aria-checked`. Grouped in a `role="group"`. |
| Keyboard | Arrow keys move, Enter selects, Escape closes the menu. |
| Highlighted | The active-descendant state, driven by the menu, not a prop. |
| Checked | Must be visible, not only in the accessibility tree — see the 🛑 above. |
| Disabled | Skipped by arrow-key navigation, not merely dimmed. |

---

## Compiled output

```ts
interface DropdownMenuRadioItemProps {
  children: React.ReactNode;
  checked?: boolean;
  onSelect: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}
```

---

## Authoring checklist

- [x] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [x] No enum in Table 1 mixes states that can co-occur at runtime
- [x] No prop in Table 1 covers two concerns
- [x] Icon and content slots are typed as nodes, not booleans — the `Show icon` boolean was collapsed into the slot
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged ⚠️
- [x] Table 4 is filled in for anything interactive
- [ ] **The tables compile to a valid interface with nothing invented and nothing missing** — the checked state has no recorded visual and one had to be asserted. Not closable until Figma binds an indicator.

# Dropdown Menu / Sub Trigger

Submenu trigger with closed, open, highlighted and disabled states.

- **Figma:** `Dropdown Menu / Sub Trigger` — node `144:73`, 8 variants
- **Code:** [`components/dropdown-menu.tsx`](../../components/dropdown-menu.tsx) — implemented 9 Aug 2026, exports `DropdownMenuSubTrigger`
- **Maturity:** `draft`. Transcribed from `docs/components/Dropdown-Menu-Sub-Trigger.doc.json`.
- **Format:** [props-table-format.md](../props-table-format.md)

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `children` | `ReactNode` | — | ✓ | Label. Figma property `Label#144:73`. |
| `open` | `boolean` | — | ✓ | Controlled — the map marks it `controlled`. |
| `onOpenChange` | `(open: boolean) => void` | — | ✓ | |
| `icon` | `ReactNode` | `undefined` | | Leading slot; the `Show icon` boolean collapses into it. |
| `inset` | `boolean` | `false` | | Figma axis `Inset`. |
| `disabled` | `boolean` | `false` | | From the decomposed `State` axis. |
| `controls` | `string` | `undefined` | | Id of the submenu. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Label#144:73` | string | `children` | Widened. |
| `Show icon#146:34` + `Icon#259:30` | boolean + instance | `icon` | **Yes.** `kind: slot-toggle` — the boolean disappears; the nullable slot is the API. |
| `State` | Closed · Open · Highlighted · Disabled | `open` + `disabled` | **Yes.** `cssOwned: ["Highlighted"]`, `controlled: ["closed","open"]`. |
| `Inset` | False · True | `inset` boolean | String union → real boolean. |

---

## 3. State → token binding

Five rows for eight variants — **and this is a case where the inset axis is provably
inert**, the same reasoning that recovered `Table / Row`.

| State | Trigger | Tokens applied |
|---|---|---|
| Closed | base | fill `popover` · radius `radius/4` · text `popover-foreground` · type `size/13` |
| Open | `open` | fill `accent` · text `accent-foreground` |
| Highlighted | active descendant | fill `accent` · text `accent-foreground` |
| Disabled | `disabled` | ⚠️ **No tokens recorded.** |

Both `Inset=False` / `Inset=True` pairs that are present — Open and Highlighted — bind
**identical tokens**. Inset changes padding only, and no spacing token is recorded, so the
indent is raw.

⚠️ **Open and Highlighted are visually identical** (`accent` fill, `accent-foreground`
text). A submenu trigger that looks the same whether its submenu is open or merely hovered
gives no feedback that the submenu opened. Transcribed as recorded; flagged.

⚠️ **No submenu indicator token** — no chevron colour is recorded, so it inherits
`currentColor`.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Role | `role="menuitem"` with `aria-haspopup="menu"` and `aria-expanded`. |
| Keyboard | Right Arrow opens the submenu and moves focus into it; Left Arrow closes and returns. Enter also opens. That directionality flips in RTL. |
| Highlighted | Active-descendant state, driven by the menu. |
| Disabled | Skipped by arrow-key navigation. |


---

## Authoring checklist

- [x] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [x] No enum in Table 1 mixes states that can co-occur at runtime
- [x] No prop in Table 1 covers two concerns
- [x] Icon and content slots are typed as nodes, not booleans
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged ⚠️ — disabled, indicator, open/highlighted collision
- [x] Table 4 is filled in for anything interactive
- [x] The tables compile to a valid interface with nothing invented and nothing missing

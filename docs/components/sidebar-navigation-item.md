# Sidebar Navigation Item

Sidebar route item.

- **Figma:** `Sidebar Navigation Item` — node `17:0`, 2 variants
- **Code:** [`components/sidebar.tsx`](../../components/sidebar.tsx) — implemented 9 Aug 2026, exports `SidebarNavigationItem`
- **Maturity:** `draft`. Transcribed from `docs/components/Sidebar-Navigation-Item.doc.json`.
- **Format:** [props-table-format.md](../props-table-format.md)

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `children` | `ReactNode` | — | ✓ | Label. Figma property `Label#17:0`. |
| `href` | `string` | — | ✓ | Destination. It navigates; it is not a button. |
| `active` | `boolean` | `false` | | Figma axis `State`, as a boolean. |
| `icon` | `ReactNode` | `undefined` | | ⚠️ Not a Figma property; needed for the collapsed sidebar. |
| `collapsed` | `boolean` | `false` | | Set by `Sidebar`. Hides the label visually while keeping the accessible name. ⚠️ Not a Figma property. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Label#17:0` | string | `children` | Widened to a node. |
| `State` | Default · Active | `active` boolean | **Yes.** A two-value enum describing a binary. **Active is derived from the route**, never set by hand — the record: *"Use State=Active for the current route."* |
| — | — | `href`, `icon` | **Missing in Figma.** `icon` matters because a collapsed `Sidebar` shows icons only. |

---

## 3. State → token binding

Both variants carry a delta, so both rows are real.

| State | Trigger | Tokens applied |
|---|---|---|
| Default | base | radius `radius/lg` · text `sidebar-foreground` · type `size/14` |
| Active | current route | fill `sidebar-accent` · text `sidebar-accent-foreground` |

✅ **This is the best-behaved colour record in the system.** It uses the dedicated
`sidebar-*` family throughout — `sidebar-foreground`, `sidebar-accent`,
`sidebar-accent-foreground` — with the fill and its matching foreground correctly paired.
Compare `Card` (`info-foreground` on a `card` fill) and `Dialog` (plain `foreground` on
`card`).

⚠️ **No hover or focus tokens.** Shared `ring` asserted.

⚠️ **No fixed height token**, despite the record noting *"fixed width and fixed height are
intentional"*. No dimension token exists, so it is raw.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Element | An `<a>`. It navigates, so it must be a link — not a button with an onClick. |
| Current | `aria-current="page"`, not colour alone. |
| Collapsed | With no visible label, the icon needs an accessible name — supplied by the still-rendered label, visually hidden. |
| Hit target | The whole row, not just the text. |


---

## Authoring checklist

- [x] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [x] No enum in Table 1 mixes states that can co-occur at runtime
- [x] No prop in Table 1 covers two concerns
- [x] Icon and content slots are typed as nodes, not booleans
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged ⚠️ — hover, focus, height
- [x] Table 4 is filled in for anything interactive
- [x] The tables compile to a valid interface with nothing invented and nothing missing

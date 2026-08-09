# Command

Command menu item primitive.

- **Figma:** `Command` — node `67:3`, 2 variants
- **Code:** [`components/command.tsx`](../../components/command.tsx) — implemented 9 Aug 2026, exports `Command`
- **Maturity:** `draft`. Transcribed from `docs/components/Command.doc.json`.
- **Format:** [props-table-format.md](../props-table-format.md)

> **This asset is one item, not the palette.** `Command Panel` is a separate asset
> (2 variants) and is not part of this build.

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `children` | `ReactNode` | — | ✓ | Label. Figma property `Label#67:3`. |
| `shortcut` | `string` | `undefined` | | Figma property `Shortcut#67:6`. |
| `selected` | `boolean` | `false` | | Figma axis `Selected`, as a boolean. |
| `onSelect` | `() => void` | — | ✓ | |
| `icon` | `ReactNode` | `undefined` | | ⚠️ Not a Figma property. |
| `id` | `string` | `undefined` | | Needed for `aria-activedescendant` — see Table 4. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Label#67:3` · `Shortcut#67:6` | string | `children` · `shortcut` | 1:1, label widened to a node. |
| `Selected` | False · True | `selected` boolean | **Yes.** String union → real boolean. The record is precise about what this means: *"Selected=True is the highlighted command o[ption]"* — it is the **active descendant**, not a chosen value. A command palette selects nothing; it runs things. |

---

## 3. State → token binding

Both variants carry a delta.

| State | Trigger | Tokens applied |
|---|---|---|
| Unselected | base | radius `radius/lg` · text `foreground` · type `size/14` |
| Selected | highlighted | fill `accent` · text `accent-foreground` |

✅ Correct pairing — `accent` fill with `accent-foreground` text.

⚠️ **No token for the shortcut text.** It should read quieter than the label;
`muted-foreground` is asserted.

⚠️ **No disabled treatment** exists.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Role | `role="option"` inside the palette's `role="listbox"`. |
| Focus | **Focus never lands here.** It stays in the search input, which points at the highlighted item via `aria-activedescendant` — hence the `id` prop. Moving real focus per keystroke would break typing. |
| Selected | `aria-selected`, mirroring the highlight. |
| Shortcut | Decorative — `aria-hidden`. Screen readers announce the label; the glyphs would be read as punctuation. |
| Keyboard | Arrow keys move the highlight, Enter runs the highlighted item. Owned by the palette, not by this item. |


---

## Authoring checklist

- [x] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [x] No enum in Table 1 mixes states that can co-occur at runtime
- [x] No prop in Table 1 covers two concerns
- [x] Icon and content slots are typed as nodes, not booleans
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged ⚠️ — shortcut, disabled
- [x] Table 4 is filled in for anything interactive
- [x] The tables compile to a valid interface with nothing invented and nothing missing

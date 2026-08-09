# Dropdown Menu / Label

Non-focusable group label with standard or inset alignment.

- **Figma:** `Dropdown Menu / Label` — node `144:69`, 2 variants
- **Code:** [`components/dropdown-menu.tsx`](../../components/dropdown-menu.tsx) — implemented 9 Aug 2026, exports `DropdownMenuLabel`
- **Maturity:** `draft`. Transcribed from `docs/components/Dropdown-Menu-Label.doc.json`.
- **Format:** [props-table-format.md](../props-table-format.md)

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `children` | `ReactNode` | — | ✓ | Group name. Figma property `Label#144:69`. |
| `inset` | `boolean` | `false` | | Figma axis `Inset`, as a real boolean. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Label#144:69` | string | `children` | Widened to a node. |
| `Inset` | False · True | `inset` boolean | **Yes.** The map's `'false' \| 'true'` string union is a Figma artefact. The vocabulary defines it precisely: *"Indented to line up with items that have a leading icon."* Set it when sibling items have icons, so the labels align. |

---

## 3. State → token binding

| State | Trigger | Tokens applied |
|---|---|---|
| Base | both variants | fill `popover` · text `popover-foreground` · type `size/12` |

Two variants, one row — `Inset=True` changes padding only, and no spacing token is
recorded, so the indent is raw.

⚠️ **A group label binds full-strength `popover-foreground`**, the same colour as the
items it labels. A label that looks exactly like the things beneath it does not read as a
label. `muted-foreground` would be the usual treatment. Transcribed as recorded and
flagged.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Focus | The record: *"Non-focusable."* Skipped by arrow-key navigation. Not a `menuitem`. |
| Role | `role="presentation"` on the element, with the group it names carrying `aria-labelledby` pointing here. A label that is announced as an item is a dead end for keyboard users. |
| Keyboard | None of its own. |

---

## Compiled output

```ts
interface DropdownMenuLabelProps {
  children: React.ReactNode;
  inset?: boolean;
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
- [x] Tokens lacking code syntax are flagged ⚠️ — label colour, inset spacing
- [x] Table 4 is filled in for anything interactive
- [x] The tables compile to a valid interface with nothing invented and nothing missing

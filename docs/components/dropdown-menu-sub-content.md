# Dropdown Menu / Sub Content

Nested submenu content.

- **Figma:** `Dropdown Menu / Sub Content` — 6 variants
- **Code:** [`components/dropdown-menu.tsx`](../../components/dropdown-menu.tsx) — implemented 9 Aug 2026, exports `DropdownMenuSubContent`
- **Maturity:** `draft`. Transcribed from `docs/components/Dropdown-Menu-Sub-Content.doc.json`.
- **Format:** [props-table-format.md](../props-table-format.md)

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `children` | `ReactNode` | — | ✓ | Submenu items. |
| `side` | `'left' \| 'right'` | `'right'` | | Figma axis `Side`. |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` | | Figma axis `Align`. |
| `label` | `string` | `undefined` | | Accessible name, usually the sub trigger's label. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Side` | Left · Right | `side` | 1:1. The record: *"The anchor marker indicates the edge and alignment relative to the Sub Trigger."* Anchored to the trigger, not the viewport — the `side` vocabulary is correct here, unlike on `Sheet`. |
| `Align` | Start · Center · End | `align` | 1:1. |
| — | — | `label` | **Missing in Figma.** |

---

## 3. State → token binding

| State | Trigger | Tokens applied |
|---|---|---|
| Base | all six variants | fill `popover` · border `1px` `border` · radius `radius/lg` · text `popover-foreground` · type `size/13` |

One row for six — neither axis carries a token delta; both are pure geometry. Identical
tokens to `Dropdown Menu`, which is correct: a submenu is the same surface.

⚠️ **No offset or collision tokens**, and placement is not collision-aware — the same
limitation recorded for `Popover`. A submenu near the viewport edge will not flip.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Role | `role="menu"`, labelled by its sub trigger. |
| Keyboard | Arrow keys move within; Left Arrow closes and returns focus to the trigger; Escape closes the whole menu chain, not just this level. |
| Nesting | The archetype's dont applies: do not nest submenus more than one level deep. |
| Focus | Moves in on open, back to the sub trigger on close. |

---

## Compiled output

```ts
interface DropdownMenuSubContentProps {
  children: React.ReactNode;
  side?: 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  label?: string;
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
- [x] Tokens lacking code syntax are flagged ⚠️ — offset, collision
- [x] Table 4 is filled in for anything interactive
- [x] The tables compile to a valid interface with nothing invented and nothing missing

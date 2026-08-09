# Scroll Area

Scrollable viewport primitive.

- **Figma:** `Scroll Area` — 2 variants
- **Code:** [`components/scroll-area.tsx`](../../components/scroll-area.tsx) — implemented 9 Aug 2026, exports `ScrollArea`
- **Maturity:** `draft`. **The scrollbar anatomy has no recorded tokens** — see Table 3.
- **Format:** [props-table-format.md](../props-table-format.md)

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `children` | `ReactNode` | — | ✓ | Overflowing content. |
| `axis` | `'vertical' \| 'horizontal'` | `'vertical'` | | Figma axis `Axis`. |
| `label` | `string` | — | ✓ | Accessible name. Required; see Table 4. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Axis` | Vertical · Horizontal | `axis` | 1:1. The record: *"Choose axis according to overflow direction."* |
| — | — | `children`, `label` | **Missing in Figma.** |

---

## 3. State → token binding

| State | Trigger | Tokens applied |
|---|---|---|
| Viewport | both axes | fill `card` · border `1px` `border` · radius `radius/lg` · text `foreground` · type `size/14` |
| Track | — | 🛑 **No token recorded.** |
| Thumb | — | 🛑 **No token recorded.** |

🛑 **The record's own description promises anatomy it does not bind:** *"Scrollable
viewport primitive with **visible track and thumb anatomy**."* `tokensUsed` is five
entries and every one belongs to the viewport container.

Rather than invent two colours, **the native scrollbar is kept** — the same decision, for
the same reason, as `NativeSelect`'s chevron: suppressing the platform's own affordance
would force inventing a token that does not exist. That also keeps platform scroll
behaviour intact, which is the point of a scroll area.

**Figma owes track and thumb bindings** if a custom scrollbar is wanted.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Focusable | `tabIndex={0}`. A region that scrolls but cannot be focused is **unreachable by keyboard** — this is the single most common failure of custom scroll areas. |
| Name | `role="region"` with a required `label`. A focusable region with no name is an unexplained tab stop. |
| Keyboard | Arrow keys, Page Up/Down, Home/End — all native once the region is focusable. Nothing is re-implemented. |
| Nesting | Do not nest scroll areas on the same axis. |
| Overflow cue | The native scrollbar is the cue. Suppressing it hides the fact that there is more to see. |


---

## Authoring checklist

- [x] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [x] No enum in Table 1 mixes states that can co-occur at runtime
- [x] No prop in Table 1 covers two concerns
- [x] Icon and content slots are typed as nodes, not booleans
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged 🛑 — track and thumb
- [x] Table 4 is filled in for anything interactive
- [x] The tables compile to a valid interface with nothing invented and nothing missing — *the missing tokens are resolved by keeping the native scrollbar, not by inventing*

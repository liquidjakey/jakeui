# Table / Container

Responsive overflow wrapper used by the Table root.

- **Figma:** `Table / Container` — 2 variants
- **Code:** [`components/table.tsx`](../../components/table.tsx) — implemented 9 Aug 2026, exports `TableContainer`
- **Maturity:** `draft`. Transcribed from `docs/components/Table-Container.doc.json`.
- **Format:** [props-table-format.md](../props-table-format.md)

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `children` | `ReactNode` | — | ✓ | The `<table>`. |
| `label` | `string` | `'Table'` | | Accessible name for the scroll region — see Table 4. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Viewport` | Desktop · Compact | **nothing** | **Yes, and the map says so itself.** It is `kind: responsive-fixture`, noted *"Breakpoint fixture. Not a prop unless code deliberately exposes one."* The two variants document *desktop fit* and *compact horizontal scrolling* — the same CSS at two widths, not two modes a caller picks. Overflow is handled by `overflow-x: auto`, which needs no prop. |
| — | — | `children`, `label` | **Missing in Figma.** |

---

## 3. State → token binding

| State | Trigger | Tokens applied |
|---|---|---|
| Base | all | fill `card` · border `1px` `border` · radius `radius/lg` · text `muted-foreground` · type `size/10` |

⚠️ **`size/10` is the smallest type size in the file**, bound on a wrapper that renders no
text of its own. Almost certainly inherited from a nested example rather than intentional.
Not applied in code — the wrapper sets no type — and flagged here.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Scroll region | A region that scrolls must be **focusable and named**, or a keyboard user cannot scroll it. `tabIndex={0}` plus `role="region"` and `aria-label`. |
| Readability | The record: *"Runtime implementation should expose the scroll region without collapsing column readability."* Columns are not squeezed to fit; the table scrolls instead. |


---

## Authoring checklist

- [x] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [x] No enum in Table 1 mixes states that can co-occur at runtime
- [x] No prop in Table 1 covers two concerns
- [x] Icon and content slots are typed as nodes, not booleans
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged ⚠️ — the stray `size/10`
- [x] Table 4 is filled in for anything interactive
- [x] The tables compile to a valid interface with nothing invented and nothing missing

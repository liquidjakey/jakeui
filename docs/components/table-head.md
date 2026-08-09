# Table / Head

Semantic table column header.

- **Figma:** `Table / Head` — node `161:3`, 3 variants
- **Code:** [`components/table.tsx`](../../components/table.tsx) — implemented 9 Aug 2026, exports `TableHead`
- **Maturity:** `draft`. Transcribed from `docs/components/Table-Head.doc.json`.
- **Format:** [props-table-format.md](../props-table-format.md)

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `children` | `ReactNode` | — | ✓ | Header label. Figma property `Label#161:3`. |
| `alignment` | `'left' \| 'center' \| 'right'` | `'left'` | | Figma axis `Alignment`. Presentation only. |
| `scope` | `'col' \| 'row'` | `'col'` | | ⚠️ Not a Figma property — required by the record's prose; see Table 2. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Label#161:3` | string | `children` | Widened to a node. |
| `Alignment` | Left · Center · Right | `alignment` | 1:1. The record: *"Alignment controls presentation only."* |
| — | — | `scope` | **Missing in Figma, and required.** The record's own description asks for it: *"use scope/row-header semantics in code where applicable."* A `th` without `scope` is ambiguous to assistive technology in any table with both row and column headers. |

---

## 3. State → token binding

| State | Trigger | Tokens applied |
|---|---|---|
| Base | all alignments | text `muted-foreground` · type `size/12` |

Three variants, one row — alignment carries no token delta, only text alignment.

⚠️ **No fill is recorded on the head cell itself.** The header band's `muted` fill lives on
`Table / Row` (`Type=Header`), not here, so a `TableHead` used outside a header row would
be transparent. That is consistent, but it means the two must be used together.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Element | Native `<th>` with `scope`. Never a styled `<td>`. |
| Alignment | Right-align numeric columns so digits line up — matches the `alignment` vocabulary. |
| Sorting | Not implemented; no sorting is recorded on this asset. When added, the record requires `aria-sort` on the `th` and a **button inside it**, not a click handler on the cell. |


---

## Authoring checklist

- [x] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [x] No enum in Table 1 mixes states that can co-occur at runtime
- [x] No prop in Table 1 covers two concerns
- [x] Icon and content slots are typed as nodes, not booleans
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged ⚠️ — no fill of its own
- [x] Table 4 is filled in for anything interactive
- [x] The tables compile to a valid interface with nothing invented and nothing missing

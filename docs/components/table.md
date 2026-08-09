# Table

Structured tabular data with density and selected-row treatment.

- **Figma:** `Table` — node `130:...`, 4 variants
- **Code:** [`components/table.tsx`](../../components/table.tsx) — implemented 9 Aug 2026, exports `Table`
- **Maturity:** `draft`. Transcribed from `docs/components/Table.doc.json`, implemented, built in Storybook — **not yet visually reviewed**
- **Format:** [props-table-format.md](../props-table-format.md)

> **The Table family is eight Figma assets and seven code exports.** `Table` is the
> density/selection extension; `Table / *` are the anatomy pieces. All seven live in one
> `table.tsx` so they cannot drift, following the shadcn convention.
>
> **`Table / Root Composition` is deliberately NOT bound to code.** Its map entry has no
> real properties — `Pattern` is `kind: story-only` (*"Storybook story, never a prop"*)
> and `Viewport` is `kind: responsive-fixture`. It is a set of composition examples, so
> it ships as **stories**, not as a component. Binding it would be claiming it is
> something it is not.

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `children` | `ReactNode` | — | ✓ | Rows and sections. |
| `caption` | `string` | `undefined` | | Names the table. Rendered through `TableCaption`. |
| `captionPosition` | `'top' \| 'bottom'` | `'top'` | | Visual only — see [`table-caption.md`](./table-caption.md). |
| `density` | `'compact' \| 'comfortable'` | `'compact'` | | Figma axis `Density`. ⚠️ **No token delta** — see Table 3. |
| `label` | `string` | `undefined` | | `aria-label`, when no visible caption exists. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Density` | Compact · Comfortable | `density` | 1:1 in name. ⚠️ Carries **no token delta anywhere in the family** — see Table 3. |
| `Selection` | None · Selected | **nothing** | **Yes.** Selection is a property of a *row*, not of the table — `Table / Row` carries `State=Selected` with a real `accent` fill. A table-level `selection` prop would be a second source of truth for the same state. The record's own note says the anatomy *"is implemented by the Table / * assets"*. |
| `First row label#130:0` · `Second row label#130:5` | string | **nothing** | **Yes.** These are **example content**, not API — the same pattern as Breadcrumb's three fixed labels. A real table has N rows supplied by the caller. |
| — | — | `children`, `caption`, `label` | **Missing in Figma.** Composition and the accessible name have no design representation. |

---

## 3. State → token binding

Transcribed from `Table.doc.json`. One row for four variants.

| State | Trigger | Tokens applied |
|---|---|---|
| Base | all | fill `card` · border `1px` `border` · radius `radius/lg` · text `muted-foreground` · type `size/12` |

⚠️ **`Density` carries no token delta, and this is verifiable rather than assumed.**
`Table / Row` shows three Compact/Comfortable pairs — Body/Default, Body/Hover and
Body/Selected — and **all three pairs bind identical tokens**. Density changes row height
only, which is spacing, and there is no spacing token in any record in this family. Row
height is therefore raw padding in code.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Role | Native `<table>`. The record: *"Header cells are `th` with the right scope; a caption names the table."* |
| Name | The `<caption>`, or `aria-label` when there is no visible caption. Never unnamed. |
| Sorting | The record: *"Sortable headers carry `aria-sort`, and the control is a button inside the `th`."* Not implemented here — no sorting is recorded on any asset in the family. |
| Keyboard | The record: *"Interactive cells are reachable in reading order."* No grid navigation — this is a table, not a grid. |
| Overflow | The scroll region is focusable and named, so a keyboard user can scroll it. See [`table-container.md`](./table-container.md). |


---

## Authoring checklist

- [x] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [x] No enum in Table 1 mixes states that can co-occur at runtime
- [x] No prop in Table 1 covers two concerns
- [x] Icon and content slots are typed as nodes, not booleans
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged ⚠️ — density/spacing
- [x] Table 4 is filled in for anything interactive
- [x] The tables compile to a valid interface with nothing invented and nothing missing

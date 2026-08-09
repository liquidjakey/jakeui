# Data Table

Data-management composition with populated and empty states.

- **Figma:** `Data Table` — node `136:0`, 4 variants
- **Code:** [`components/data-table.tsx`](../../components/data-table.tsx) — implemented 9 Aug 2026, exports `DataTable`
- **Maturity:** `draft`. **Composes a blocked component** — see Table 2.
- **Format:** [props-table-format.md](../props-table-format.md)

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `title` | `string` | — | ✓ | Figma property `Title#136:0`. |
| `children` | `ReactNode` | `undefined` | | The table. Omitting it is what makes the state empty — see Table 2. |
| `toolbar` | `ReactNode` | `undefined` | | Search and actions slot. |
| `pagination` | `ReactNode` | `undefined` | | Footer slot. |
| `emptyMessage` | `string` | `'No results.'` | | Shown when there are no rows. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Title#136:0` | string | `title` | 1:1. |
| `State` | Populated · Empty | `children` presence | **Yes, deliberately.** Not a prop. A "populated" data table with no rows contradicts itself; deriving the state from whether there is anything to show makes that unrepresentable — the same move as `Progress`'s `Type` and `Card`'s `media`. |
| `Viewport` | Desktop · Compact | **nothing** | `kind: responsive-fixture`, dropped as for `Table / Container` and `Sidebar`. |
| — | — | `toolbar`, `pagination` | **Missing in Figma as properties**, but named in the record: *"Data-management composition built from Input, Button, Table, and Pagination."* Slots rather than typed props, because the record's pipeline contract says embedded content *"must not be generated as a public code prop until engineering API review."* |

⚠️ **This composition names four components and one of them is blocked.** `Input`,
`Table` and `Pagination` are all built; **`Button` is not** — it has 32 variants and only
8 state rows, so its outline and ghost token bindings are unreadable. The `toolbar` slot
is therefore left to the caller rather than pre-composed with a Button that does not
exist yet.

---

## 3. State → token binding

Three rows for four variants.

| State | Trigger | Tokens applied |
|---|---|---|
| Populated | base | fill `card` · border `1px` `border` · radius `radius/lg` · text `foreground` · type `size/18` |
| Empty | no `children` | type `size/15` |

⚠️ **The empty state changes only the type size.** No muted colour, no illustration, no
distinct treatment — an empty table looks like a populated one with smaller text. The
`datatable` archetype asks for more: *"Give empty, loading and error states real
treatments."* `muted-foreground` is asserted for the message; the rest is a design gap.

⚠️ **No loading or error state exists at all**, in the record or in the variants.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Structure | A labelled region containing the table. The `title` names it. |
| Empty | The message is real text in the flow, not a background image, and it is announced when it replaces the table. |
| Toolbar | Controls precede the table in DOM order, so a keyboard user meets filters before results. |
| Pagination | After the table, and it is a `<nav>` in its own right. |
| Announcement | Row-count changes after filtering should be announced politely — the caller's job, since the filter lives in the toolbar slot. |


---

## Authoring checklist

- [x] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [x] No enum in Table 1 mixes states that can co-occur at runtime — `State` deliberately did not become one
- [x] No prop in Table 1 covers two concerns
- [x] Icon and content slots are typed as nodes, not booleans
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged ⚠️ — empty state, loading, error
- [x] Table 4 is filled in for anything interactive
- [x] The tables compile to a valid interface with nothing invented and nothing missing

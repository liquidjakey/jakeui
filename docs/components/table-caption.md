# Table / Caption

Accessible descriptive caption for a table.

- **Figma:** `Table / Caption` — node `161:0`, 2 variants
- **Code:** [`components/table.tsx`](../../components/table.tsx) — implemented 9 Aug 2026, exports `TableCaption`
- **Maturity:** `draft`. Transcribed from `docs/components/Table-Caption.doc.json`.
- **Format:** [props-table-format.md](../props-table-format.md)

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `children` | `ReactNode` | — | ✓ | Caption text. Figma property `Caption#161:0`. |
| `position` | `'top' \| 'bottom'` | `'top'` | | Figma axis `Position`. **Visual only** — see Table 2. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Caption#161:0` | string | `children` | Widened to a node. |
| `Position` | Top · Bottom | `position` | **1:1, but with a constraint the record states outright:** *"Position is visual; code should preserve caption semantics and reading order."* A `<caption>` must be the **first child of `<table>`** regardless of where it appears. Bottom placement is done with `caption-side: bottom`, never by moving the element. Moving it would break the naming relationship. |

---

## 3. State → token binding

| State | Trigger | Tokens applied |
|---|---|---|
| Base | both positions | text `muted-foreground` · type `size/12` |

Two variants, one row — `Position=Bottom` carries no token delta, only placement.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Element | Native `<caption>`, first child of `<table>`. It **is** the table's accessible name. |
| Position | CSS `caption-side`, never DOM reordering. |
| Keyboard | None. Not interactive. |


---

## Authoring checklist

- [x] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [x] No enum in Table 1 mixes states that can co-occur at runtime
- [x] No prop in Table 1 covers two concerns
- [x] Icon and content slots are typed as nodes, not booleans
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged ⚠️ — none
- [x] Table 4 is filled in for anything interactive
- [x] The tables compile to a valid interface with nothing invented and nothing missing

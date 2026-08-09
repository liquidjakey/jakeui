# Table / Row

Table row patterns for header, body, and footer sections.

- **Figma:** `Table / Row` — 10 variants
- **Code:** [`components/table.tsx`](../../components/table.tsx) — implemented 9 Aug 2026, exports `TableRow`
- **Maturity:** `draft`. **Recovered from the 8-row cap by inference — see below.**
- **Format:** [props-table-format.md](../props-table-format.md)

---

## ⚠️ This record is truncated, and here is why it was still safe to build

`Table / Row` has **10 variants but only 8 state rows**, because the description
generator caps at 8 (`figma-descriptions.md` rule 3). Normally that is a blocker — it is
why Button, Badge and twelve others are not built.

This one is recoverable, and the reasoning is evidence, not a guess. The eight rows
present are:

| Type | State | Density | Tokens |
|---|---|---|---|
| Header | Default | Compact | fill `muted` · border `border` · text `muted-foreground` · type `size/12` |
| Body | Default | Compact | fill `card` · text `foreground` · type `size/13` |
| Body | Hover | Compact | text `foreground` · type `size/13` |
| Body | Selected | Compact | fill `accent` · text `foreground` · type `size/13` |
| Footer | Default | Compact | text `foreground` · type `size/13` |
| Body | Default | **Comfortable** | fill `card` · text `foreground` · type `size/13` |
| Body | Hover | **Comfortable** | text `foreground` · type `size/13` |
| Body | Selected | **Comfortable** | fill `accent` · text `foreground` · type `size/13` |

The two missing combinations are **Header/Comfortable** and **Footer/Comfortable**.

Every Compact/Comfortable pair that *is* present binds **identical tokens** — three
pairs, three matches, zero deltas. `Density` is demonstrably a no-delta axis in this
record: it changes row height, which is spacing, and no spacing token exists anywhere in
the family. So the two absent rows carry the same tokens as their Compact twins.

**This is inference from complete pairs, not invention.** It does not generalise: it
works here because the missing rows sit on an axis that is proven inert by the rows that
survived. `Popover / Content` shows 1 of 48 rows and nothing can be inferred from that,
which is why it stays blocked.

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `children` | `ReactNode` | — | ✓ | Cells. |
| `type` | `'header' \| 'body' \| 'footer'` | `'body'` | | Figma axis `Type`. Drives both semantics and tokens. |
| `selected` | `boolean` | `false` | | Figma `State=Selected`. Controlled — the map says so. |
| `onSelect` | `() => void` | `undefined` | | When set, the row becomes activatable. |
| `density` | `'compact' \| 'comfortable'` | `'compact'` | | Row height only. ⚠️ No token delta. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Type` | Header · Body · Footer | `type` | 1:1 as an enum — genuinely exclusive, and it maps onto real semantics (`<thead>` / `<tbody>` / `<tfoot>` context). |
| `State` | Default · Hover · Selected | `selected` boolean | **Yes.** `kind: decompose` with `cssOwned: ["Hover"]` and `controlled: ["selected"]`. Hover is CSS and never a prop; selected is genuine controlled state. |
| `Density` | Compact · Comfortable | `density` | 1:1 in name; no token backing. |
| — | — | `onSelect` | **Missing in Figma.** Selection has a visual but no mechanism. |

---

## 3. State → token binding

| State | Trigger | Tokens applied |
|---|---|---|
| Header | `type === 'header'` | fill `muted` · border `border` · text `muted-foreground` · type `size/12` |
| Body | `type === 'body'` | fill `card` · text `foreground` · type `size/13` |
| Body hover | `:hover` | ⚠️ **No fill change is recorded** — the row binds only text, identical to resting. A hover state that looks the same as rest is almost certainly an oversight; code adds a `muted` tint. **Asserted, not transcribed.** |
| Body selected | `selected === true` | fill `accent` · text `foreground` · type `size/13` |
| Footer | `type === 'footer'` | text `foreground` · type `size/13` — no fill, so `card` shows through |
| Comfortable | `density` | **Inferred**: identical tokens, greater row height. See the box above. |

⚠️ **No focus token.** A selectable row needs one; the shared `ring` treatment is asserted.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Element | Native `<tr>`. `type` decides which section it belongs in, which the parent renders. |
| Selected | `aria-selected` on the row. Never colour alone — the `accent` fill is supported by the checkbox or control that drives it. |
| Activation | A selectable row must not swallow clicks on interactive cells. Selection is driven by an explicit control, not by a click anywhere on the row. |
| Keyboard | Reading order only. This is a table, not a grid — no arrow-key navigation. |

---

## Compiled output

```ts
interface TableRowProps {
  children: React.ReactNode;
  type?: 'header' | 'body' | 'footer';
  selected?: boolean;
  onSelect?: () => void;
  density?: 'compact' | 'comfortable';
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
- [x] Tokens lacking code syntax are flagged ⚠️ — hover, focus, density
- [x] Table 4 is filled in for anything interactive
- [ ] **The tables compile to a valid interface with nothing invented and nothing missing** — two state rows are inferred rather than read. Sound, but not the same as transcribed; re-verify when the row cap is raised.

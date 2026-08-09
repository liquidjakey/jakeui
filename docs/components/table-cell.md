# Table / Cell

Semantic table data cell with alignment and text-emphasis options.

- **Figma:** `Table / Cell` — node `161:7`, 6 variants
- **Code:** [`components/table.tsx`](../../components/table.tsx) — implemented 9 Aug 2026, exports `TableCell`
- **Maturity:** `draft`. Transcribed from `docs/components/Table-Cell.doc.json`.
- **Format:** [props-table-format.md](../props-table-format.md)

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `children` | `ReactNode` | — | ✓ | Cell content. Figma property `Value#161:7`. |
| `alignment` | `'left' \| 'center' \| 'right'` | `'left'` | | Figma axis `Alignment`. |
| `emphasis` | `'default' \| 'strong'` | `'default'` | | Figma axis `Emphasis`. **Changes colour, not weight** — see Table 3. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Value#161:7` | string | `children` | Widened to a node, so a cell can hold a Badge or a link. |
| `Alignment` | Left · Center · Right | `alignment` | 1:1. |
| `Emphasis` | Default · Strong | `emphasis` | 1:1 in name. ⚠️ The *name* says weight; the tokens say colour — see Table 3. |
| — | — | *(no width prop)* | **Deliberately absent.** The record: *"Width is controlled by the containing column or row composition."* A per-cell width would fight the table layout. |

---

## 3. State → token binding

Four rows for six variants — the two absent are Center/Default and Right/Default, and
alignment is proven inert by the three Strong rows binding identical tokens.

| State | Trigger | Tokens applied |
|---|---|---|
| Default | base | text `muted-foreground` · type `size/13` |
| Strong | `emphasis === 'strong'` | text `foreground` |

⚠️ **`Emphasis` changes colour, not font weight**, despite its name and despite the shared
vocabulary entry, which reads *"strong: Heavier weight, to mark the row's key value."*
The record binds `foreground` vs `muted-foreground` and no weight token. Transcribed as
bound, not as named — the vocabulary is generic and the binding is specific.

The consequence is worth stating: **a default cell is `muted-foreground`.** Ordinary table
data renders in the muted colour and only "strong" cells get full contrast. That is
backwards from the usual convention, where the body is primary and de-emphasis is the
exception. Transcribed faithfully, but it is worth a design review — it affects every
cell in every table.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Element | Native `<td>`. A row header is a `<th scope="row">` via `TableHead`, not a strong-emphasis cell. |
| Emphasis | Colour only, so it must never be the sole carrier of meaning. |
| Alignment | Right for numbers. |
| Contrast | ⚠️ `muted-foreground` on `card` is the default body text here. It passes AA per the refine phase (7.48 Light), but it is the muted pairing doing full-time duty. |

---

## Compiled output

```ts
interface TableCellProps {
  children: React.ReactNode;
  alignment?: 'left' | 'center' | 'right';
  emphasis?: 'default' | 'strong';
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
- [x] Tokens lacking code syntax are flagged ⚠️ — emphasis is colour not weight
- [x] Table 4 is filled in for anything interactive
- [x] The tables compile to a valid interface with nothing invented and nothing missing

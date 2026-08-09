# Chart

Token-bound chart container.

- **Figma:** `Chart` — node `67:0`, 2 variants
- **Code:** [`components/chart.tsx`](../../components/chart.tsx) — implemented 9 Aug 2026, exports `Chart`
- **Maturity:** `draft`. **A container only — there are no series tokens.** See Table 3.
- **Format:** [props-table-format.md](../props-table-format.md)

---

## 🛑 This is a frame, not a chart

`Chart.doc.json`'s `tokensUsed` is `border`, `card`, `foreground`, `radius/lg`, `size/16`
— five tokens, and **every one belongs to the container**. There is no series colour, no
axis colour, no gridline, no legend token.

The record's own name for itself is honest: *"Token-bound chart **container** for compact
documentation and dashboard examples."*

So this component is exactly that — a titled, token-bound frame that a chart is rendered
**into**. `children` is the chart. **No data props, no series colours, and no rendering
are provided**, because supplying them would mean inventing a categorical palette, which
is a substantial design system decision and not one to make by implication.

**Figma owes a categorical series palette** before a real charting component can be built
on these tokens.

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `title` | `string` | — | ✓ | Figma property `Title#67:0`. |
| `children` | `ReactNode` | — | ✓ | The chart itself. |
| `type` | `'bar' \| 'line'` | `'bar'` | | Figma axis `Type`. ⚠️ No token delta — see Table 3. |
| `description` | `string` | `undefined` | | Text alternative. **Required in practice** — see Table 4. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Title#67:0` | string | `title` | 1:1. |
| `Type` | Bar · Line | `type` | 1:1 in name only. ⚠️ **No token delta**, and no rendering is attached to it — the container looks identical either way. It is carried through as a data attribute so a consuming chart can read it, rather than silently dropped. |
| — | — | `children`, `description` | **Missing in Figma.** |

---

## 3. State → token binding

| State | Trigger | Tokens applied |
|---|---|---|
| Base | both variants | fill `card` · border `1px` `border` · radius `radius/lg` · text `foreground` · type `size/16` |

🛑 **No series, axis, gridline or legend tokens.** See the block above.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Text alternative | A chart must state its **takeaway**, not its chart type. "Revenue rose 12% in Q3", not "bar chart". That is what `description` is for, and it is why it exists despite having no Figma property. |
| Colour | The archetype's dont: *"Do not distinguish series by colour alone."* Unenforceable here — there are no series colours to enforce it on. |
| Data | Offer the underlying data as a table. A chart alone is not accessible. |
| Keyboard | None at this level. Interactive charts must make their own points reachable. |


---

## Authoring checklist

- [x] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [x] No enum in Table 1 mixes states that can co-occur at runtime
- [x] No prop in Table 1 covers two concerns
- [x] Icon and content slots are typed as nodes, not booleans
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged 🛑 — the entire series palette
- [x] Table 4 is filled in for anything interactive
- [ ] **The tables compile to a valid interface with nothing invented and nothing missing** — the interface compiles, but this is a container and cannot become a chart until Figma provides a categorical palette.

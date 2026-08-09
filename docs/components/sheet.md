# Sheet

Edge-attached overlay for secondary workflows.

- **Figma:** `Sheet` — node `111:...`, 4 variants
- **Code:** [`components/sheet.tsx`](../../components/sheet.tsx) — implemented 9 Aug 2026, exports `Sheet`
- **Maturity:** `draft`. Transcribed from `docs/components/Sheet.doc.json`, implemented, built in Storybook — **not yet visually reviewed**
- **Format:** [props-table-format.md](../props-table-format.md)

> Shares the native `<dialog>` surface with [`dialog.md`](./dialog.md) — see its Table 4
> for the platform-supplied focus trap, Escape and focus return.

---

## ⚠️ Sheet and Drawer are indistinguishable in the design file

Identical `tokensUsed`, identical state rows, identical variant counts, identical props,
identical accessibility. The only difference is that this component's placement axis is
called `Side` and Drawer's is called `Placement` — same two values.

The distinction is stated only as prose, in this component's own description:

> *"Use Sheet for persistent side tasks; use Drawer for transient filtering and
> supplemental controls."*

That is a usage convention. A consumer cannot tell the two apart by looking, and neither
can a token. **Full comparison table and reasoning in [`drawer.md`](./drawer.md).** Both
were built as specified rather than merged, because collapsing them is a design decision.

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `open` | `boolean` | — | ✓ | Controlled visibility. |
| `onClose` | `() => void` | — | ✓ | Escape, backdrop click, or the close control. |
| `title` | `string` | — | ✓ | Names the panel. Figma property `Title#111:10`. |
| `description` | `string` | `undefined` | | Figma property `Description#111:15`. |
| `children` | `ReactNode` | `undefined` | | Body content — a slot, not a typed prop. |
| `side` | `'left' \| 'right'` | `'right'` | | Figma axis `Side`. Attaching edge. |
| `width` | `'compact' \| 'wide'` | `'compact'` | | Figma axis `Width`. ⚠️ **No token backing.** |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Side` | Left · Right | `side` | 1:1. **The axis name differs from Drawer's `Placement` for an identical axis** — see the box above. |
| `Width` | Compact · Wide | `width` | 1:1 in name, not in backing. |
| `Title#111:10` · `Description#111:15` | string | `title` · `description` | 1:1. |
| — | — | `open`, `onClose`, `children` | **Missing in Figma.** Same reasoning as [`drawer.md`](./drawer.md). |

⚠️ **A vocabulary mismatch inherited from the shared axis meanings.** The `side` entries
in `docs/archetypes.json` read *"Opens to the left/right **of the trigger**"* — written
for anchored surfaces like `Popover` and `Tooltip`. A Sheet has no trigger anchor: it
attaches to the **viewport** edge. The generic vocabulary is wrong here; this component's
own description is the accurate source.

---

## 3. State → token binding

Transcribed from `Sheet.doc.json`. One row for four variants — neither axis carries a
token delta, only geometry.

| State | Trigger | Tokens applied |
|---|---|---|
| Base | all variants | fill `card` · border `1px` `border` · radius `radius/lg` · text `foreground` · type `size/18` |

⚠️ Same three gaps as [`drawer.md`](./drawer.md): no width tokens exist in the file,
`text foreground` on a `card` fill is the semantic mismatch described in
[`dialog.md`](./dialog.md), and the backdrop has no token.

---

## 4. Accessibility & keyboard

As [`dialog.md`](./dialog.md) Table 4.

| Concern | Contract |
|---|---|
| Side | Visual only. It stays after its trigger in the DOM regardless of which edge it attaches to. |
| Motion | Slides from the named edge; fades instead under `prefers-reduced-motion`. |
| Persistent use | The description calls this the *persistent* side surface. It is still a modal `<dialog>`, so it still traps focus. **If a genuinely persistent, non-blocking panel is wanted, this is the wrong component** — that is a layout region, not an overlay. |


---

## Authoring checklist

- [x] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [x] No enum in Table 1 mixes states that can co-occur at runtime
- [x] No prop in Table 1 covers two concerns
- [x] Icon and content slots are typed as nodes, not booleans
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged ⚠️
- [x] Table 4 is filled in for anything interactive
- [ ] **The tables compile to a valid interface with nothing invented and nothing missing** — the interface compiles, but the Drawer/Sheet duplication is unresolved by design.

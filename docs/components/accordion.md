# Accordion

Disclosure component for vertically stacked question-and-answer or settings sections.

- **Figma:** `Accordion` — node `85:...`, 4 variants
- **Code:** [`components/accordion.tsx`](../../components/accordion.tsx) — implemented 9 Aug 2026, exports `Accordion`
- **Maturity:** `draft`. Transcribed from `docs/components/Accordion.doc.json`, implemented, built in Storybook — **not yet visually reviewed**
- **Format:** [props-table-format.md](../props-table-format.md)

> **Accordion and Collapsible bind identical tokens.** Same `tokensUsed`, same three
> state rows, same variants, same accessibility. Unlike the Drawer/Sheet pair, this one
> is defensible: the Figma master models a **single item**, and an Accordion is a *group*
> of them while a Collapsible is *one*. That structural difference is real but invisible
> to the design file, which is why the records match. See [`collapsible.md`](./collapsible.md).

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `items` | `AccordionItem[]` | — | ✓ | The sections. ⚠️ **Not a Figma property** — Figma models one item; the group is the code-side difference from `Collapsible`. |
| `openIds` | `string[]` | — | ✓ | Controlled open sections. An array, so multiple may be open. |
| `onToggle` | `(id: string) => void` | — | ✓ | Fired when a trigger is activated. |

Where `AccordionItem` is `{ id: string; title: string; content: ReactNode; disabled?: boolean }` —
`title` is Figma property `Title#85:0`, `content` is `Content#85:5`.

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Title#85:0` · `Content#85:5` | string | `items[].title` · `items[].content` | **Yes.** Per item, not per component — Figma has one item, code has many. `content` is a `ReactNode`, not a `string`, so a panel can hold real markup. |
| `State` | Closed · Open | `openIds` | **Yes.** The map types this `kind: prop` with `'closed' \| 'open'`. It is **controlled state per item**, not a component-level enum. The record supports this: *"open/closed and disabled are persistent disclosure states."* An array allows several open at once, which one enum cannot express. |
| `Disabled` | False · True | `items[].disabled` | **Yes.** The map types this as the string union `'false' \| 'true'`. Emitted as a real `boolean` — a stringly-typed boolean is a Figma artefact, not an API. |
| — | — | `onToggle` | **Missing in Figma.** No design representation for a callback. |

The record also rules several things out explicitly: *"Hover, pressed, and focus-visible
belong to the disclosure trigger at runtime and are not separate root variants."* None of
them become props.

---

## 3. State → token binding

Transcribed from `Accordion.doc.json`. Three rows for four variants — `State=Open,
Disabled=False` carries no delta from the closed default.

| State | Trigger | Tokens applied |
|---|---|---|
| Closed | base | fill `card` · border `1px` `border` · radius `radius/lg` · text `foreground` · type `size/14` |
| Open | `openIds` includes the id | No token delta — only the panel's presence changes |
| Disabled | `item.disabled` | fill `muted` · text `muted-foreground` |

⚠️ **No focus token is recorded.** The record says focus-visible belongs to the trigger at
runtime, but binds nothing for it. Code uses the `ring` treatment shared with every other
interactive component here, asserted rather than transcribed.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Trigger | The record: *"The trigger is a button carrying `aria-expanded` and `aria-controls`."* A real `<button>`, wrapped in a heading so the sections are navigable by heading. |
| Panel | The record: *"The panel stays in the accessibility tree only while open."* Closed panels are unmounted, not hidden with CSS. |
| Keyboard | Enter and Space toggle. Tab moves between triggers — **not** arrow keys, which the APG reserves for tablists. |
| Disabled | The trigger is a disabled `<button>`, so it leaves the tab order. |
| Focus | Visible ring on the trigger. See the ⚠️ in Table 3. |


---

## Authoring checklist

- [x] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [x] No enum in Table 1 mixes states that can co-occur at runtime
- [x] No prop in Table 1 covers two concerns
- [x] Icon and content slots are typed as nodes, not booleans — `content` is a `ReactNode`
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged ⚠️ — the focus ring
- [x] Table 4 is filled in for anything interactive
- [x] The tables compile to a valid interface with nothing invented and nothing missing

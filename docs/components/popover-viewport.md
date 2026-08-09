# Popover / Viewport

Transition viewport documenting current and previous content across activation directions.

- **Figma:** `Popover / Viewport` — 8 variants
- **Code:** [`components/popover.tsx`](../../components/popover.tsx) — implemented 9 Aug 2026, exports `PopoverViewport`
- **Maturity:** `draft`. **This was the last unresolved doc block in the system** — see below.
- **Format:** [props-table-format.md](../props-table-format.md)

---

## The block that stayed open longest

For most of this build, `Popover / Viewport` was the single remaining entry in the
enrichment pass's "owed to human review" list — six variant meanings with no vocabulary:
`state.current`, `state.previous`, and `direction.top|right|bottom|left`.

It was left open **deliberately**. The `side` axis already holds `top|right|bottom|left`
for anchored placement, and reusing those meanings here would have put a
plausible-but-wrong sentence into six blocks. One visible gap beat six wrong answers.

Reading this component's own description settled it without a Figma query:

> *"Transition Viewport documenting current and previous content for four activation
> directions. This asset represents `data-activation-direction` and `data-previous`
> states without prescribing runtime animation duration."*

So `direction` is an **activation direction**, not a placement — the axis content travels
along during a transition — and `current`/`previous` are the incoming and outgoing halves
of that transition. The vocabulary was added on that evidence and the record enriched.
**The system now has zero owed doc blocks.**

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `children` | `ReactNode` | — | ✓ | The current content. |
| `previous` | `ReactNode` | `undefined` | | The outgoing content, rendered while a transition runs. |
| `direction` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | | Activation direction. Emitted as `data-activation-direction`. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `State` | Current · Previous | `children` + `previous` | **Yes.** Not an enum. The two states are not modes the caller selects — both are rendered **at once** during a transition, which is the entire point. An enum could only ever show one. |
| `Direction` | Top · Right · Bottom · Left | `direction` | 1:1, emitted as the `data-activation-direction` attribute the record names. |

The record also states what it deliberately does **not** specify: *"without prescribing
runtime animation duration."* No duration or easing prop is exposed; timing belongs to CSS.

---

## 3. State → token binding

| State | Trigger | Tokens applied |
|---|---|---|
| Base | all 8 variants | fill `popover` · border `1px` `border` · radius `radius/lg` · text `popover-foreground` · type `size/11` |

One row for eight variants — neither axis carries a token delta, which is consistent with
the record's own framing: these are data attributes and animation endpoints, not visual
variants.

⚠️ **`size/11`** here where `Popover` binds `size/15`. Transcribed; worth checking.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Outgoing content | `aria-hidden` while transitioning out. Both halves are in the DOM at once, and announcing both would read the popover twice. |
| Motion | Direction drives a transform. Under `prefers-reduced-motion` the transition becomes a cross-fade with no travel. |
| Focus | Focus must not land in the outgoing half — it is `inert` as well as hidden. |

---

## Compiled output

```ts
interface PopoverViewportProps {
  children: React.ReactNode;
  previous?: React.ReactNode;
  direction?: 'top' | 'right' | 'bottom' | 'left';
}
```

---

## Authoring checklist

- [x] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [x] No enum in Table 1 mixes states that can co-occur at runtime — `State` deliberately did not become one
- [x] No prop in Table 1 covers two concerns
- [x] Icon and content slots are typed as nodes, not booleans
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged ⚠️
- [x] Table 4 is filled in for anything interactive
- [x] The tables compile to a valid interface with nothing invented and nothing missing

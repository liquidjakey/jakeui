# Card

Content container for related information and actions.

- **Figma:** `Card` — node `126:...`, 4 variants
- **Code:** [`components/card.tsx`](../../components/card.tsx) — implemented 9 Aug 2026, exports `Card`
- **Maturity:** `draft`. **Contains the only deliberate deviation from a record in this system** — see Table 3.
- **Format:** [props-table-format.md](../props-table-format.md)

---

## 🛑 The record's text token is wrong, and the code does not follow it

`Card.doc.json` binds the card's text to **`info-foreground`**. That is a defect in the
Figma file, and transcribing it would ship unreadable text.

Verified against `.figma-tokens-dump.json`:

| Token | Light | Dark |
|---|---|---|
| `card` (the fill) | `white/100` | `neutral/900` |
| `info-foreground` (what the record binds) | `neutral/50` | `neutral/950` |
| `card-foreground` (what it should bind) | `neutral/950` | `neutral/50` |

`info-foreground` is **inverted** relative to `card-foreground`. It is the light-on-dark
pairing, correct for text sitting on the *solid `info` fill* — which is exactly how
`Badge` uses it, legitimately. On a `card` fill it produces near-white text on a white
card in Light, and near-black text on a near-black card in Dark. **Contrast is roughly
1:1 in both modes. The text is invisible.**

**The code binds `card-foreground`.** This is the one place in this system where the
implementation deliberately does not match its record, because matching it would be a
visible bug rather than a documentation inaccuracy. Recorded here, in the component
source, and in `design-system.json`.

**Figma owes a rebind:** `Card`'s text should point at `card-foreground`. Until that
lands, `docs:adopt` will keep re-importing the wrong token, and this section is the only
thing preventing someone re-transcribing it.

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `title` | `string` | — | ✓ | Figma property `Title#126:0`. |
| `description` | `string` | `undefined` | | Figma property `Description#126:5`. |
| `children` | `ReactNode` | `undefined` | | Body slot. |
| `media` | `ReactNode` | `undefined` | | Leading media slot. **Presence of this is what makes the card a media card** — see Table 2. |
| `href` | `string` | `undefined` | | When set, the whole card is a link. **Presence of this is what makes the card interactive** — see Table 2. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Title#126:0` · `Description#126:5` | string | `title` · `description` | 1:1. |
| `Type` | Content · Media | `media` slot | **Yes.** A boolean-ish enum in Figma becomes a **slot** in code, per the format rule *"Slots are nodes, not booleans."* `Type=Media` is not a mode the caller selects; it is what the card *is* once it has media. Passing `media` makes it a media card. |
| `State` | Default · Interactive | `href` | **Yes, and deliberately so.** The record carries the governance rule: *"Visual State axes are QA/story states unless engineering explicitly approves a controlled runtime prop."* No approval exists, so `state` is not a prop. "Interactive" is not a state a caller sets — it is a consequence of the card having a destination. `href` is that destination, and it drives the styling. |
| — | — | `children` | **Missing in Figma.** Body content is composition, not a property. |

---

## 3. State → token binding

Transcribed from `Card.doc.json` **with one documented deviation**. Three rows for four
variants — `Type=Media, State=Default` carries no delta.

| State | Trigger | Tokens applied |
|---|---|---|
| Default | base | fill `card` · border `1px` `border` · radius `radius/lg` · text ~~`info-foreground`~~ → **`card-foreground`** 🛑 · type `size/11` ⚠️ |
| Interactive | `href` is set | border `2px` `primary` |

🛑 **Text token deviated** — see the box at the top of this page.

⚠️ **`size/11` is the smallest type size in the file** (the scale runs 10–22) and it is
what the record binds for a card's text. That is transcribed faithfully rather than
"corrected", because unlike the colour it is legible — it is small, not broken. Worth
questioning in design review: 11px is a caption size, and this is a container for a title
and description.

⚠️ **The `Interactive` border is `2px primary`, the same treatment `Input` uses for
focus.** A card that looks focused at rest is a real ambiguity. Transcribed as recorded,
but flagged: hover and focus need distinguishable treatments, and this leaves nothing
free for focus.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Element | A `<div>`, or an `<a>` wrapping the whole card when `href` is set. |
| Accessible name | The record: *"If the whole card is a link or button it needs an accessible name."* The `title` supplies it. |
| Nested controls | The record: *"Do not bury interactive controls where keyboard users reach them out of order."* A linked card must not also contain buttons — that creates an unreachable or duplicated tab stop. Enforced by convention, not by the type. |
| Focus | ⚠️ Unresolved. `Interactive` already consumes `2px primary`, so there is no distinct focus affordance recorded. Code adds a `ring` focus treatment, matching every other interactive component here. |
| Media | Decorative media is `aria-hidden`; meaningful media needs its own alternative text, supplied by the caller through the slot. |


---

## Authoring checklist

- [x] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [x] No enum in Table 1 mixes states that can co-occur at runtime
- [x] No prop in Table 1 covers two concerns
- [x] Icon and content slots are typed as nodes, not booleans — `Type` became the `media` slot
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged ⚠️
- [x] Table 4 is filled in for anything interactive
- [ ] **The tables compile to a valid interface with nothing invented and nothing missing** — the interface compiles, but the record's text token is wrong and the code deliberately diverges. Not closable until Figma rebinds.

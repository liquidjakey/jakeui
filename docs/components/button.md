# Button

Action button.

- **Figma:** `Button` — node `76:147`, 32 variants
- **Code:** [`components/button.tsx`](../../components/button.tsx) — implemented 9 Aug 2026, exports `Button`
- **Maturity:** `draft`. **Read from live bindings, not from the description.**
- **Format:** [props-table-format.md](../props-table-format.md)

---

## Unblocked by reading Figma directly

Button was the longest-blocked component: 32 variants, 8 description rows, and the
missing 24 covered outline and ghost entirely. Nothing could be inferred from that.

It was resolved by querying the live bindings through the Desktop Bridge
(`scripts/figma-query-blocked-variants.js`, read-only). The result is in
`.figma-blocked-variants.json`, and it is **richer than any description could be** —
see the box below.

### The description format loses information

The live bindings carry **spacing and stroke-weight tokens that no ANATOMY block emits**:

| | Small | Medium |
|---|---|---|
| padding X | `space/3` | `space/4` |
| padding Y | `space/1-5` | `space/2-25` |
| gap | `space/2` | `space/2` |
| focus ring | `stroke/2` | `stroke/2` |
| outline border | `stroke/1` | `stroke/1` |

**Every "no spacing token is recorded, so padding is raw" flag written during this
build was wrong about the cause.** The tokens exist and are bound; the description
format simply does not emit them. Those flags are corrected in the affected props
tables.

Two tokens also surfaced that appear in **no** doc record anywhere: `primary-hover`
and `accent-hover`.

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `children` | `ReactNode` | — | ✓ | Label. Figma property `Label#76:0`. |
| `onClick` | `() => void` | `undefined` | | |
| `style` | `'primary' \| 'secondary' \| 'outline' \| 'ghost'` | `'primary'` | | Figma axis `Style`. |
| `size` | `'small' \| 'medium'` | `'medium'` | | Figma axis `Size`. |
| `leadingIcon` | `ReactNode` | `undefined` | | `Show leading icon` collapses into this slot. |
| `disabled` | `boolean` | `false` | | From the decomposed `State` axis. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | | ⚠️ Not a Figma property. Defaults to `button` deliberately — an unlabelled `<button>` inside a form submits it. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Label#76:0` | string | `children` | Widened to a node. |
| `Style` | 4 values | `style` | 1:1, with real fill/stroke deltas on each. |
| `Size` | Small · Medium | `size` | 1:1, and **fully tokenised** — see the spacing table. |
| `Show leading icon#76:25` + `Leading icon#214:0` | boolean + instance | `leadingIcon` | **Yes.** `kind: slot-toggle` — the boolean disappears. |
| `State` | Default · Hover · Disabled · Focused | `disabled` | **Yes.** `kind: decompose`, `cssOwned: ["Hover","Focused"]`. |
| — | — | `onClick`, `type` | **Missing in Figma.** |

⚠️ **The record's own dont, still unresolved:** *"Variant count (32) exceeds the
30-combination governance ceiling. Needs a documented exception."*

---

## 3. State → token binding

From live bindings. Radius is `radius/lg` on every variant.

| Style | Rest | Hover | Disabled | Focused |
|---|---|---|---|---|
| primary | fill `primary` | fill `primary-hover` | fill `muted` | fill `primary` + `ring` @ `stroke/2` |
| secondary | fill `secondary` | fill `accent-hover` | fill `muted` | fill `secondary` + `ring` @ `stroke/2` |
| outline | border `border` @ `stroke/1`, no fill | fill `accent-hover` + border | fill `muted`, **border dropped** | `ring` @ `stroke/2` |
| ghost | no fill, no border | fill `accent-hover` | fill `muted` | `ring` @ `stroke/2` |

⚠️ **Disabled drops the outline style's border entirely**, so a disabled outline
button is indistinguishable from a disabled ghost button. Transcribed as bound.

⚠️ **No text colour is bound on the root** for any variant — the label colour lives
on a child text node. `primary-foreground` / `secondary-foreground` are applied per
style from the semantic pairing, which `Avatar` establishes as correct.

✅ **Focus keeps the resting fill and adds a `stroke/2` ring**, consistently across all
four styles. Implemented as `ring-2` rather than a border, so there is no layout
shift — the same treatment `Input` uses and for the same reason.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Element | Native `<button>`. Never a styled `<div>` or an `<a>` — the archetype's dont: *"Do not use a button for navigation."* |
| Keyboard | Enter and Space activate. Free with the native element. |
| Name | An icon-only button needs an `aria-label`. |
| Disabled | Native `disabled`; not focusable. The archetype: *"Do not disable a button without telling the user why."* |
| Focus | `ring` at `stroke/2`, never removed. |
| Type | Defaults to `"button"`, so a button inside a form does not submit it by accident. |


---

## Authoring checklist

- [x] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [x] No enum in Table 1 mixes states that can co-occur at runtime
- [x] No prop in Table 1 covers two concerns
- [x] Icon and content slots are typed as nodes, not booleans
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged ⚠️ — label colour, disabled outline
- [x] Table 4 is filled in for anything interactive
- [x] The tables compile to a valid interface with nothing invented and nothing missing — *read from live bindings*

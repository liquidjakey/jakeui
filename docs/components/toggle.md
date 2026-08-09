# Toggle

Two-state action button for formatting, view controls, or other reversible selections.

- **Figma:** `Toggle` — node `82:...`, 8 variants
- **Code:** [`components/toggle.tsx`](../../components/toggle.tsx) — implemented 9 Aug 2026, exports `Toggle`
- **Maturity:** `draft`. Transcribed from `docs/components/Toggle.doc.json`, implemented, built in Storybook — **not yet visually reviewed**
- **Format:** [props-table-format.md](../props-table-format.md)

> **The record's accessibility contract was wrong until 9 Aug 2026 and has been fixed.**
> `Toggle` was mapped to the `choice` archetype, which told it to expose state via
> `aria-checked` and referenced radio-group arrow keys. A toggle *button* is the W3C APG
> **Toggle Button** pattern: `aria-pressed`, and both Space and Enter activate it. A new
> `togglebutton` archetype was added and both `Toggle` and `Toggle Group` remapped.

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `label` | `string` | — | ✓ | Figma property `Label#82:0`. Also the accessible name. |
| `pressed` | `boolean` | — | ✓ | Controlled. Figma axis `Pressed`, as a real boolean. |
| `onPressedChange` | `(pressed: boolean) => void` | — | ✓ | Fired on activation. |
| `disabled` | `boolean` | `false` | | From the decomposed `State` axis. |
| `icon` | `ReactNode` | `undefined` | | ⚠️ Not a Figma property. When icon-only, `label` becomes the `aria-label`. |
| `iconOnly` | `boolean` | `false` | | Renders the icon alone and promotes `label` to `aria-label`. ⚠️ Not a Figma property. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Label#82:0` | string | `label` | 1:1. |
| `Pressed` | False · True | `pressed` boolean | **Yes.** The map's `'false' \| 'true'` string union is a Figma artefact, not an API. |
| `State` | Default · Hover · Focused · Disabled | `disabled` boolean | **Yes.** `kind: decompose`, with `cssOwned: ["Hover","Focused"]` and `booleans: ["disabled"]` already resolved. Hover and focus are CSS, never props. |
| — | — | `onPressedChange`, `icon` | **Missing in Figma.** |

---

## 3. State → token binding

Transcribed from `Toggle.doc.json`. Seven rows for eight variants — `Pressed=False,
State=Hover` carries no delta. **8 variants is exactly at the cap**, so nothing is
truncated here; one more and it would have been.

| State | Trigger | Tokens applied |
|---|---|---|
| Unpressed | base | fill `card` · border `1px` `border` · radius `radius/md` · text `foreground` · type `size/14` |
| Unpressed + focus | `:focus-visible` | border `2px` `ring` |
| Unpressed + disabled | `disabled` | fill `muted` · text `muted-foreground` |
| Pressed | `pressed === true` | fill `accent` · text `accent-foreground` |
| Pressed + hover | `:hover` | fill `accent` · text `accent-foreground` — **no change from resting pressed** |
| Pressed + focus | `:focus-visible` | fill `accent` · border `2px` `ring` · text `accent-foreground` |
| Pressed + disabled | both | fill `muted` · text `muted-foreground` — pressed state is **not** visible when disabled |

⚠️ **Pressed + hover binds exactly the same tokens as pressed at rest**, so a pressed
toggle gives no hover feedback. Transcribed as recorded, but it is likely an oversight —
every other interactive component here changes on hover.

⚠️ **`radius/md`, not `radius/lg`.** Every other control in this system binds `radius/lg`.
Transcribed faithfully; worth checking in design review whether the difference is
intentional.

⚠️ **Pressed + disabled loses the pressed state entirely** — it renders identically to
unpressed + disabled. `aria-pressed` still reports it, so assistive technology is
correct, but a sighted user cannot tell. This is the record's own *"never by colour
alone"* rule failing in the other direction: here there is no colour at all.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Element | Native `<button>` with `aria-pressed`. **Not** `aria-checked` — see the box at the top. |
| Keyboard | Space **and** Enter both activate. It is a button, so both must work; a checkbox-style Space-only handler would be wrong. |
| Name | `label` is the accessible name. For an icon-only toggle it becomes `aria-label` and must name the **action**, not the state — "Bold", not "Bolded". |
| Disabled | Native `disabled`, so it leaves the tab order. |
| State | Carried by `aria-pressed`, never by colour alone — which matters especially given the disabled ⚠️ above. |


---

## Authoring checklist

- [x] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [x] No enum in Table 1 mixes states that can co-occur at runtime
- [x] No prop in Table 1 covers two concerns
- [x] Icon and content slots are typed as nodes, not booleans
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged ⚠️ — hover no-op, radius divergence, disabled+pressed
- [x] Table 4 is filled in for anything interactive
- [x] The tables compile to a valid interface with nothing invented and nothing missing

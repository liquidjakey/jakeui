# Toggle Group

Grouped toggle controls for choosing one or multiple persistent options.

- **Figma:** `Toggle Group` — node `...`, 4 variants
- **Code:** [`components/toggle-group.tsx`](../../components/toggle-group.tsx) — implemented 9 Aug 2026, exports `ToggleGroup`
- **Maturity:** `draft`. Transcribed from `docs/components/Toggle-Group.doc.json`, implemented, built in Storybook — **not yet visually reviewed**
- **Format:** [props-table-format.md](../props-table-format.md)

> Remapped from the `choice` archetype to `togglebutton` on 9 Aug 2026 — see
> [`toggle.md`](./toggle.md). Its items are `Toggle`s and use `aria-pressed`.

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `items` | `ToggleGroupItem[]` | — | ✓ | The members. ⚠️ Not a Figma property. |
| `pressedIds` | `string[]` | — | ✓ | Controlled. An array in **both** modes — see Table 2. |
| `onPressedChange` | `(ids: string[]) => void` | — | ✓ | Receives the whole next selection, not a delta. |
| `selection` | `'single' \| 'multiple'` | `'single'` | | Figma axis `Selection`. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | | Figma axis `Orientation`. |
| `label` | `string` | — | ✓ | Accessible name for the group. |

Where `ToggleGroupItem` is `{ id: string; label: string; icon?: ReactNode; disabled?: boolean }`.

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Selection` | Single · Multiple | `selection` | 1:1 as an enum — but note it does **not** change the shape of `pressedIds`, which stays an array in both modes. A `string \| string[]` union would force every consumer to narrow, for no benefit; single mode simply never holds more than one. |
| `Orientation` | Horizontal · Vertical | `orientation` | 1:1 in name. ⚠️ No token delta recorded. |
| — | — | `items`, `pressedIds`, `onPressedChange`, `label` | **Missing in Figma.** The group models no items at all. |

---

## 3. State → token binding

Transcribed from `Toggle-Group.doc.json`. **One row for four variants, and only two
tokens** — the thinnest record of any component built so far.

| State | Trigger | Tokens applied |
|---|---|---|
| Base | all variants | text `accent-foreground` · type `size/14` |

⚠️ **This record is almost empty, and one of its two tokens looks wrong.** The group binds
`accent-foreground` — the *foreground for the accent fill* — but binds no fill of its own.
On the page background that is a foreground token with nothing to sit on. The items
(`Toggle`) already carry `accent`/`accent-foreground` for their pressed state, so this is
most likely a stray binding on the container.

The implementation treats the group as a **layout-only container** and lets each `Toggle`
own its appearance, which is what the tokens actually support. **Figma owes either a real
container treatment or the removal of this binding.**

⚠️ **Neither `Selection` nor `Orientation` carries a token delta**, so both are layout
concerns only.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Role | `role="group"` with an accessible name from `label`. **Not** `radiogroup`, even in single mode — the members are toggle buttons with `aria-pressed`, not radios with `aria-checked`. |
| Keyboard | Tab moves between members; arrow keys are **not** used. This follows from the toggle-button pattern and is the correction made on 9 Aug 2026. |
| Single mode | Pressing a member unpresses the others. There is no "empty" guard: unlike a radio group, all members may be off, which is legitimate for actions. |
| Disabled | Per member, natively. |


---

## Authoring checklist

- [x] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [x] No enum in Table 1 mixes states that can co-occur at runtime
- [x] No prop in Table 1 covers two concerns
- [x] Icon and content slots are typed as nodes, not booleans
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged ⚠️ — the record is near-empty and `accent-foreground` looks like a stray binding
- [x] Table 4 is filled in for anything interactive
- [ ] **The tables compile to a valid interface with nothing invented and nothing missing** — the interface compiles, but the record has too little in it to be confident the container is styled as designed.

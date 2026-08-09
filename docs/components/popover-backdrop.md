# Popover / Backdrop

Backdrop for modal and trap-focus Popover modes.

- **Figma:** `Popover / Backdrop` — 4 variants
- **Code:** [`components/popover.tsx`](../../components/popover.tsx) — implemented 9 Aug 2026, exports `PopoverBackdrop`
- **Maturity:** `draft`. **Contains the only scrim token in the system, and it is the wrong kind of token** — see Table 3.
- **Format:** [props-table-format.md](../props-table-format.md)

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `open` | `boolean` | — | ✓ | Figma axis `State`, as a real boolean. |
| `mode` | `'modal' \| 'trapFocus'` | `'modal'` | | Figma axis `Mode`. |
| `onClick` | `() => void` | `undefined` | | Dismiss handler, when the mode allows it. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Mode` | Modal · trapFocus | `mode` | 1:1. The record adds a third case that has **no variant**: *"Non-modal mode intentionally has no backdrop."* In code that is simply not rendering this component. |
| `State` | Closed · Open | `open` boolean | **Yes.** A two-value enum describing a binary. The record explains why both exist as variants: *"Starting and ending animation states are documented rather than multiplied as static variants."* They are animation endpoints, not modes. |

---

## 3. State → token binding

| State | Trigger | Tokens applied |
|---|---|---|
| Base | all | fill `foreground` |

🛑 **`foreground` is a text token and it inverts with the theme.** Verified in
`.figma-tokens-dump.json`: `foreground` is `neutral/950` in Light and `neutral/50` in
Dark. As a scrim that gives a near-black overlay in Light — correct — and a **near-white
overlay in Dark**, which is wrong. A scrim should darken in both themes.

**This is the only backdrop token in the entire system.** `Dialog`, `Drawer`, `Sheet` and
`Alert Dialog` record none at all, which is why `modal-surface.tsx` falls back to a raw
`black/50`. So there is currently **no correct scrim token**, and the one that exists is
theme-inverting.

The implementation applies `foreground` at low alpha as recorded, because unlike Card's
invisible text this produces a visible, functioning backdrop rather than a broken one —
deviating would mean inventing a token. **Figma owes a real `overlay`/`scrim` token**, and
that would close this and the four overlay-family gaps at once.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Semantics | `aria-hidden`. A backdrop is never announced and never focusable. |
| Dismiss | Clicking it closes in `modal` mode. In `trapFocus` mode it does not — focus is held deliberately. |
| Motion | Fades. Respects `prefers-reduced-motion`. |


---

## Authoring checklist

- [x] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [x] No enum in Table 1 mixes states that can co-occur at runtime
- [x] No prop in Table 1 covers two concerns
- [x] Icon and content slots are typed as nodes, not booleans — *n/a*
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged ⚠️ — the scrim token is theme-inverting
- [x] Table 4 is filled in for anything interactive
- [ ] **The tables compile to a valid interface with nothing invented and nothing missing** — the interface compiles, but the only scrim token in the system is the wrong kind of token. Not closable until Figma adds one.

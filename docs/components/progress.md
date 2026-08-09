# Progress

Linear progress primitive.

- **Figma:** `Progress` — 2 variants
- **Code:** [`components/progress.tsx`](../../components/progress.tsx) — implemented 9 Aug 2026, exports `Progress`
- **Maturity:** `draft`. **The bar itself has no recorded token** — see Table 3.
- **Format:** [props-table-format.md](../props-table-format.md)

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `value` | `number` | `undefined` | | 0–100. **Omitting it is what makes it indeterminate** — see Table 2. |
| `label` | `string` | — | ✓ | Accessible name. Required; see Table 4. |
| `max` | `number` | `100` | | |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Type` | Determinate · Indeterminate | `value` presence | **Yes, deliberately.** Not an enum. A determinate bar with no value is meaningless, and an indeterminate one with a value contradicts itself — an enum lets both be expressed. Making `value` optional and deriving the type from it makes the invalid pair unrepresentable. This mirrors `Card`, where `Type=Media` became the `media` slot. |
| — | — | `label`, `max` | **Missing in Figma.** |

---

## 3. State → token binding

| State | Trigger | Tokens applied |
|---|---|---|
| Track | base | fill `muted` · radius `radius/lg` |
| Bar | — | 🛑 **No token recorded.** |

🛑 **`tokensUsed` is `muted` and `radius/lg` — two entries, and both belong to the
track.** The filled portion, which is the only part that conveys progress, has no colour.

Asserted as `primary`, on the same precedent as `Switch`'s track: `Radio Group /
Indicator` binds `fill primary` for its checked state, so `primary` is this system's
"active value" colour.

⚠️ **`radius/lg` on a thin bar** will read as nearly square. `radius/full` would be the
usual choice for a progress track. Transcribed as recorded.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Role | `role="progressbar"`. |
| Determinate | Sets `aria-valuenow`, `aria-valuemin`, `aria-valuemax`. |
| Indeterminate | **Omits `aria-valuenow`** — that omission is precisely what tells assistive technology the value is unknown, which is why the prop is optional rather than defaulted to 0. |
| Name | `label` is required. An unnamed progress bar announces a number with no subject. |
| Motion | The indeterminate animation respects `prefers-reduced-motion`. |
| Keyboard | None. Never focusable — it reports, it does not accept input. |


---

## Authoring checklist

- [x] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [x] No enum in Table 1 mixes states that can co-occur at runtime — `Type` deliberately did not become one
- [x] No prop in Table 1 covers two concerns
- [x] Icon and content slots are typed as nodes, not booleans — *n/a*
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged 🛑 — the bar
- [x] Table 4 is filled in for anything interactive
- [ ] **The tables compile to a valid interface with nothing invented and nothing missing** — the bar colour is asserted. Figma owes a fill for the filled portion.

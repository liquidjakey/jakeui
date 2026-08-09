# Switch / Thumb

Movable switch thumb.

- **Figma:** `Switch / Thumb` — 4 variants
- **Code:** [`components/switch.tsx`](../../components/switch.tsx) — implemented 9 Aug 2026, exports `SwitchThumb`
- **Maturity:** `draft`. Transcribed from `docs/components/Switch-Thumb.doc.json`.
- **Format:** [props-table-format.md](../props-table-format.md)

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `checked` | `boolean` | `false` | | Drives the travel. ⚠️ Not a Figma property here — see Table 2. |
| `size` | `'small' \| 'default'` | `'default'` | | Figma axis `Size`. |
| `disabled` | `boolean` | `false` | | Figma axis `State`, as a boolean. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Size` | Small · Default | `size` | 1:1 in name. ⚠️ **No token delta** — `tokensUsed` is two entries and neither is a dimension, so both sizes are raw. The record says *"Size follows the Root size"*, and Root is blocked. |
| `State` | Default · Disabled | `disabled` boolean | **Yes.** A two-value enum describing a binary. The record: *"disabled styling is inherited from the Root state"* — so this asset records no disabled tokens of its own, and none are applied here. |
| — | — | `checked` | **Missing in Figma.** The thumb's position is the entire point of a switch, and no variant expresses it — travel lives on the blocked `Switch / Root`. |

---

## 3. State → token binding

| State | Trigger | Tokens applied |
|---|---|---|
| Base | all four variants | fill `card` · radius `radius/full` |

One row for four variants. Neither `Size` nor `State` carries a delta, which is consistent
with the record's own statement that both are inherited from Root.

✅ `radius/full` is the correct token for a circular thumb — no raw `9999px`.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Semantics | None. The thumb is decorative — `aria-hidden`. All state lives on the parent `role="switch"`. |
| Motion | Travel is a transform, so it cannot affect layout. Respects `prefers-reduced-motion`. |

---

## Compiled output

```ts
interface SwitchThumbProps {
  checked?: boolean;
  size?: 'small' | 'default';
  disabled?: boolean;
}
```

---

## Authoring checklist

- [x] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [x] No enum in Table 1 mixes states that can co-occur at runtime
- [x] No prop in Table 1 covers two concerns
- [x] Icon and content slots are typed as nodes, not booleans — *n/a*
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged ⚠️ — size has no dimension token
- [x] Table 4 is filled in for anything interactive — *decorative*
- [x] The tables compile to a valid interface with nothing invented and nothing missing

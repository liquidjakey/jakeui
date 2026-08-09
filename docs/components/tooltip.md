# Tooltip

Brief non-interactive label revealed on hover or focus.

- **Figma:** `Tooltip` — node `111:20`, 4 variants
- **Code:** [`components/tooltip.tsx`](../../components/tooltip.tsx) — implemented 9 Aug 2026, exports `Tooltip`
- **Maturity:** `draft`. Transcribed from `docs/components/Tooltip.doc.json`.
- **Format:** [props-table-format.md](../props-table-format.md)

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `label` | `string` | — | ✓ | The tooltip text. Figma property `Label#111:20`. A **string**, not a node — see Table 4. |
| `children` | `ReactElement` | — | ✓ | The trigger. Must be focusable. |
| `side` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | | Figma axis `Side`. Preferred placement. |
| `delay` | `number` | `400` | | Milliseconds before showing. ⚠️ Not a Figma property. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Label#111:20` | string | `label` | 1:1, and **deliberately kept a string.** Everywhere else in this system a content property was widened to `ReactNode`; not here. The record calls it *"brief non-interactive"*, and a node slot invites buttons and links into a surface that is unreachable by keyboard and invisible to touch. The narrow type is the guardrail. |
| `Side` | Top · Bottom · Left · Right | `side` | 1:1. The record: *"Side controls preferred placement"* — **preferred**, so an implementation with collision detection may override it. This one does not flip; see [`popover.md`](./popover.md) Table 3. |
| — | — | `children`, `delay` | **Missing in Figma.** |

---

## 3. State → token binding

| State | Trigger | Tokens applied |
|---|---|---|
| Base | all four sides | fill `foreground` · radius `radius/lg` · text `card` · type `size/12` |

✅ **This is a deliberate inversion and it is correct.** `foreground` fill with `card`
text produces a dark chip on a light theme and a light chip on a dark one — the standard
tooltip treatment, and high contrast in both. Note it is the *same* `foreground` token
that is wrong as a backdrop on `Popover / Backdrop`: as a **fill behind short text** it
inverts correctly; as a **full-screen scrim** it inverts backwards.

⚠️ **No arrow token**, and no offset or collision tokens.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Relationship | The record: *"Referenced by the control via `aria-describedby`."* Describes, never names — a tooltip must not be the trigger's only label. |
| Trigger | Must be focusable. A tooltip on a non-focusable element is unreachable by keyboard, which is why `children` is a single element that receives the handlers. |
| Show | On hover **and** on focus. Focus shows immediately; hover waits out `delay`. |
| Persistence | The record: *"Stays visible long enough to read, and while the pointer is over it."* |
| Escape | Dismisses without moving focus. |
| Content | Never interactive, never essential. If it needs a link or a button it is a `Popover`. |

---

## Compiled output

```ts
interface TooltipProps {
  label: string;
  children: React.ReactElement;
  side?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}
```

---

## Authoring checklist

- [x] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [x] No enum in Table 1 mixes states that can co-occur at runtime
- [x] No prop in Table 1 covers two concerns
- [x] Icon and content slots are typed as nodes, not booleans — `label` is deliberately a string, and Table 2 says why
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged ⚠️ — arrow, offset
- [x] Table 4 is filled in for anything interactive
- [x] The tables compile to a valid interface with nothing invented and nothing missing

# Radio Group / Indicator

Checked-state indicator nested inside a radio item.

- **Figma:** `Radio Group / Indicator` — 2 variants
- **Code:** [`components/radio-group.tsx`](../../components/radio-group.tsx) — implemented 9 Aug 2026, exports `RadioGroupIndicator`
- **Maturity:** `draft`. Transcribed from `docs/components/Radio-Group-Indicator.doc.json`.
- **Format:** [props-table-format.md](../props-table-format.md)

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `checked` | `boolean` | `false` | | Whether the dot is shown. |
| `disabled` | `boolean` | `false` | | Figma axis `State`, as a boolean. |
| `forceMount` | `boolean` | `false` | | Keeps it mounted while hidden — **required by the record**; see Table 2. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `State` | Default · Disabled | `disabled` boolean | **Yes.** Two-value enum describing a binary. |
| — | — | `checked` | **Missing in Figma.** The asset *is* the checked indicator, so presence is the state; in code it needs a prop to know whether to show. |
| — | — | `forceMount` | **Missing in Figma, and required by the record's prose:** *"Runtime may force-mount the indicator for animation or measurement."* Unmounting kills an exit animation and makes the element unmeasurable, so the escape hatch has to exist. |

---

## 3. State → token binding

| State | Trigger | Tokens applied |
|---|---|---|
| Default | base | fill `primary` · radius `radius/full` |
| Disabled | `disabled` | ⚠️ **No tokens recorded.** Shared muted convention asserted. |

✅ **This is the one recorded piece of the radio's selected state**, and it is why
`Switch`'s track could be asserted as `primary` with some confidence: `primary` is
demonstrably this system's checked-state colour.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Semantics | Decorative — `aria-hidden`. The state lives on the `<input type="radio">`, never here. |
| Force-mounted | When `forceMount` is set and unchecked, it is hidden from both sight and assistive technology, not merely transparent. |
| Motion | Scale/opacity only, so it cannot shift layout. |

---

## Compiled output

```ts
interface RadioGroupIndicatorProps {
  checked?: boolean;
  disabled?: boolean;
  forceMount?: boolean;
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
- [x] Tokens lacking code syntax are flagged ⚠️ — disabled
- [x] Table 4 is filled in for anything interactive — *decorative*
- [x] The tables compile to a valid interface with nothing invented and nothing missing

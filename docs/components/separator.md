# Separator

Visual separator for grouping adjacent content.

- **Figma:** `Separator` — node `70:405`, 2 variants
- **Code:** [`components/separator.tsx`](../../components/separator.tsx) — implemented 9 Aug 2026, exports `Separator`
- **Maturity:** `draft`. Transcribed from `docs/components/Separator.doc.json`, implemented, built in Storybook — **not yet visually reviewed**
- **Format:** [props-table-format.md](../props-table-format.md)

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | | Axis the rule runs along. Figma axis `Orientation`, 1:1. |
| `decorative` | `boolean` | `true` | | ⚠️ **Not a Figma property.** Required by the record's own accessibility contract — see Table 4. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Orientation` | Horizontal · Vertical | `orientation` | 1:1. |
| — | — | `decorative` | **Missing in Figma, and it must exist.** The record's accessibility notes split this component in two: *"Purely visual separators are `aria-hidden="true"`. One that genuinely divides groups keeps `role="separator"` and its orientation."* That is a semantic distinction with no visual difference, so Figma cannot express it and never will. Defaults to `true`, because the large majority of separators are decorative. |

---

## 3. State → token binding

Transcribed from `Separator.doc.json`. One row for two variants — the Vertical variant
carries no token delta, only a geometry change, so nothing is truncated.

| State | Trigger | Tokens applied |
|---|---|---|
| Horizontal | base | fill `border` |
| Vertical | `orientation === 'vertical'` | fill `border` — same token; only the axis changes |

`border` is the only token this component binds. Thickness is 1px in both
orientations, expressed as `h-px` / `w-px` so it never becomes a raw pixel value in a
colour position.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Decorative (default) | `aria-hidden="true"` and no role. A line that only adds visual rhythm must not be announced. |
| Semantic | `role="separator"`. When vertical it also needs `aria-orientation="vertical"` — the role's implicit orientation is horizontal, so vertical must be stated. |
| Keyboard | None. This component is never focusable and never interactive. |
| Contrast | Not held to 4.5:1. `border` is a non-text, non-essential boundary; where a separator is the *only* thing conveying a grouping, use a heading instead. |

---

## Compiled output

```ts
interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
}
```

---

## Authoring checklist

- [x] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [x] No enum in Table 1 mixes states that can co-occur at runtime
- [x] No prop in Table 1 covers two concerns
- [x] Icon and content slots are typed as nodes, not booleans — *n/a, no slots*
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged ⚠️ — none; `border` is real
- [x] Table 4 is filled in for anything interactive — *n/a, never interactive; contract recorded anyway*
- [x] The tables compile to a valid interface with nothing invented and nothing missing

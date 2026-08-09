# Checkbox

Labelled checkbox with unchecked, checked and indeterminate values.

- **Figma:** `Checkbox` — node `78:0`, 9 variants
- **Code:** [`components/checkbox.tsx`](../../components/checkbox.tsx) — implemented 9 Aug 2026, exports `Checkbox`
- **Maturity:** `draft`. **Recovered from the 8-row cap** — see below.
- **Format:** [props-table-format.md](../props-table-format.md)

---

## Recovered from the cap: the missing rows sit on a provably inert axis

9 variants, 4 state rows. The full space is enumerable from `figma.map.json`:
`Value` (unchecked · checked · indeterminate) × `State` (Default · Focused · Disabled).

Present:

| Value | State | Tokens |
|---|---|---|
| Unchecked | Default | text `foreground` · type `size/14` |
| Unchecked | Disabled | text `muted-foreground` |
| Checked | Disabled | text `muted-foreground` |
| Indeterminate | Disabled | text `muted-foreground` |

**All three Disabled rows are identical**, so `Value` carries no text delta — three
observations, no exceptions. The two missing Default rows (Checked, Indeterminate)
therefore match Unchecked/Default.

The three missing `Focused` rows have **zero observations**, but this record is
text-only, and focus is drawn on the box, which this asset does not bind at all (see
below). The shared `ring` treatment is asserted, as it is on every other control here.

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `label` | `string` | — | ✓ | Figma property `Label#78:0`. |
| `checked` | `boolean \| 'indeterminate'` | — | ✓ | Figma axis `Value`. **Three states, so not a plain boolean** — see Table 2. |
| `onCheckedChange` | `(checked: boolean) => void` | — | ✓ | |
| `disabled` | `boolean` | `false` | | From the decomposed `State` axis. |
| `description` | `string` | `undefined` | | ⚠️ Not a Figma property. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Label#78:0` | string | `label` | 1:1. |
| `Value` | Unchecked · Checked · Indeterminate | `checked: boolean \| 'indeterminate'` | **Yes.** Three values, so a plain boolean cannot express it. Indeterminate is a *display* state, never a value a user can select, so `onCheckedChange` returns only a boolean — clicking an indeterminate box resolves it. |
| `State` | Default · Focused · Disabled | `disabled` boolean | **Yes.** `kind: decompose`, `cssOwned: ["Focused"]`. |

---

## 3. State → token binding

| State | Trigger | Tokens applied |
|---|---|---|
| Default | base | text `foreground` · type `size/14` — for **all three** values (proven above) |
| Disabled | `disabled` | text `muted-foreground` — for all three values |
| Box | — | 🛑 **No token recorded.** |

🛑 **The box has no tokens, exactly as `Switch`'s track has none.** `tokensUsed` is three
text tokens. Unlike Switch there is no sibling asset holding it — there is no
`Checkbox / Indicator` in the map at all.

Asserted on the established precedent: `input` for the resting border, `primary` /
`primary-foreground` for the checked fill and mark — `Radio Group / Indicator` binds
`primary` for its checked state, making it this system's checked-state colour.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Element | Native `<input type="checkbox">`. |
| Indeterminate | Set via the DOM `indeterminate` property — **there is no HTML attribute for it**, so it must be applied through a ref. `aria-checked="mixed"` follows automatically. |
| Keyboard | Space toggles. Not Enter — Enter submits the form. |
| Name | `label`, associated by id. |
| Disabled | Native `disabled`, leaves the tab order. |
| Tri-state | Clicking an indeterminate checkbox resolves to checked. It never cycles back to mixed — mixed is derived from children, not chosen. |

---

## Compiled output

```ts
interface CheckboxProps {
  label: string;
  checked: boolean | 'indeterminate';
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  description?: string;
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
- [x] Tokens lacking code syntax are flagged 🛑 — the box
- [x] Table 4 is filled in for anything interactive
- [ ] **The tables compile to a valid interface with nothing invented and nothing missing** — Value is proven inert, but the box is asserted and Focused has zero observations.

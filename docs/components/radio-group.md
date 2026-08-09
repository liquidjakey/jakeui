# Radio Group

Labelled radio option with selected/unselected and default/focused/disabled states.

- **Figma:** `Radio Group` — node `78:10`, 6 variants
- **Code:** [`components/radio-group.tsx`](../../components/radio-group.tsx) — implemented 9 Aug 2026, exports `RadioGroup`
- **Maturity:** `draft`. **Same shape of gap as [`switch.md`](./switch.md)** — see Table 3.
- **Format:** [props-table-format.md](../props-table-format.md)

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `items` | `RadioItem[]` | — | ✓ | The options. ⚠️ Not a Figma property — the asset models one option. |
| `value` | `string` | — | ✓ | Controlled selection. |
| `onValueChange` | `(value: string) => void` | — | ✓ | |
| `label` | `string` | — | ✓ | Names the group. |
| `disabled` | `boolean` | `false` | | Disables the whole group. |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | | ⚠️ Not a Figma property. |

Where `RadioItem` is `{ value: string; label: string; description?: string; disabled?: boolean }` —
`label` is Figma property `Label#78:10`.

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Label#78:10` | string | `items[].label` | **Per item.** The asset models a single option; a group has N. |
| `Value` | Unselected · Selected | `value` | **Yes.** A per-item boolean in Figma becomes one group-level `value` string in code — that is what makes the choice *exclusive*. Two selected items are unrepresentable by construction, which a per-item boolean could not guarantee. |
| `State` | Default · Focused · Disabled | `disabled` | **Yes.** `kind: decompose`, `cssOwned: ["Focused"]`. |
| — | — | `items`, `onValueChange`, `orientation` | **Missing in Figma.** |

---

## 3. State → token binding

| State | Trigger | Tokens applied |
|---|---|---|
| Unselected | base | text `foreground` · type `size/14` |
| Disabled | `disabled` | text `muted-foreground` — both selected and unselected |
| Dot | selected | fill `primary` · radius `radius/full` — from `Radio Group / Indicator` |
| Circle | — | 🛑 **No token recorded.** See below. |

🛑 **The radio's outer circle has no readable token**, exactly as `Switch`'s track has
none. `Radio Group`'s `tokensUsed` is three text tokens; the circle lives on
`Radio Group / Root`, which is **blocked** by the 8-row cap (24 variants, 7 rows).

The circle border is asserted as `input`, the token every other form control here binds
for its resting border. Unlike `Switch`, the *selected* half is real — `Radio Group /
Indicator` records `fill primary` — so only the ring is asserted, not the state colour.

⚠️ **No focus token**; shared `ring` asserted.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Roles | Native `<input type="radio">` in a `<fieldset>` with a `<legend>`. The name comes from the legend, not from a wrapper label. |
| Keyboard | Arrow keys move **and select** in one step — the radio convention, and it differs from `ToggleGroup`, where Tab moves and Space activates. Only the selected radio is in the tab order. |
| Exclusivity | Enforced by the shared `name`, not only by state. |
| Disabled | Per item or whole-group. A disabled group is still announced. |
| Required | A group with no selection is valid HTML; requiredness belongs to the consuming `Field`. |

---

## Compiled output

```ts
interface RadioItem {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  items: RadioItem[];
  value: string;
  onValueChange: (value: string) => void;
  label: string;
  disabled?: boolean;
  orientation?: 'vertical' | 'horizontal';
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
- [x] Tokens lacking code syntax are flagged 🛑 — the circle
- [x] Table 4 is filled in for anything interactive
- [ ] **The tables compile to a valid interface with nothing invented and nothing missing** — the circle border is asserted. Not closable until `Radio Group / Root` is readable.

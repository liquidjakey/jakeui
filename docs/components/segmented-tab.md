# Segmented Tab

Compact option tab, placed inside a segmented-control container.

- **Figma:** `Segmented Tab` — node `19:...`, 2 variants
- **Code:** [`components/segmented-tab.tsx`](../../components/segmented-tab.tsx) — implemented 9 Aug 2026, exports `SegmentedTab`
- **Maturity:** `draft`. Transcribed from `docs/components/Segmented-Tab.doc.json`, implemented, built in Storybook — **not yet visually reviewed**
- **Format:** [props-table-format.md](../props-table-format.md)

> **This is the item half of [`tabs.md`](./tabs.md).** Its own description says: *"Place
> instances inside a secondary-colored segmented-control container."* That container is
> `Tabs`, which binds `muted` and carries no selected-state treatment. This component
> carries the selected-state treatment and no container. Neither is complete alone.

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `label` | `string` | — | ✓ | Figma property `Label#19:0`. |
| `selected` | `boolean` | `false` | | Figma axis `Selected`, as a real boolean. |
| `onSelect` | `() => void` | — | ✓ | Fired on activation. |
| `controls` | `string` | `undefined` | | Id of the panel this tab controls. Needed for `aria-controls`. |
| `disabled` | `boolean` | `false` | | ⚠️ Not a Figma property; no disabled variant exists. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Label#19:0` | string | `label` | 1:1. |
| `Selected` | False · True | `selected` boolean | **Yes.** The map types this as the string union `'false' \| 'true'`. A stringly-typed boolean is a Figma artefact, not an API. The record confirms it is persistent: *"Selected is the persistent tab selection state."* |
| — | — | `onSelect`, `controls`, `disabled` | **Missing in Figma.** The record rules the transient states out explicitly: *"Hover and focus-visible are transient runtime states"* — neither becomes a prop. |

---

## 3. State → token binding

Transcribed from `Segmented-Tab.doc.json`. Both variants carry a delta, so both rows
are real.

| State | Trigger | Tokens applied |
|---|---|---|
| Unselected | base | radius `radius/lg` · text `muted-foreground` · type `size/12` — **no fill**, so the container's `muted` shows through |
| Selected | `selected === true` | fill `card` · text `foreground` |

This is the inverse of the usual pattern: the *selected* tab gets the lighter `card` fill
and appears to lift out of the `muted` track, rather than being highlighted. That only
reads correctly inside the `Tabs` container, which is the point of the pairing.

⚠️ **No focus token is recorded**, though the record explicitly promises one: *"focus
remains visually distinguishable using the shared ring treatment."* The `ring` treatment
is applied on that instruction — asserted from prose rather than transcribed from a
binding.

⚠️ **No disabled treatment exists.** A disabled tab uses the shared muted convention.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Role | `role="tab"` with `aria-selected` and `aria-controls`. It is a `<button>` underneath. |
| Tab order | Only the selected tab is tabbable; the rest carry `tabindex="-1"`. Managed by the parent `Tabs`, not here — a standalone `SegmentedTab` cannot know its siblings. |
| Keyboard | Arrow keys, Home and End are the **parent's** responsibility. This component handles activation only. |
| Focus | Visible ring, per the record's own promise. See the ⚠️ in Table 3. |

---

## Compiled output

```ts
interface SegmentedTabProps {
  label: string;
  selected?: boolean;
  onSelect: () => void;
  controls?: string;
  disabled?: boolean;
}
```

---

## Authoring checklist

- [x] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [x] No enum in Table 1 mixes states that can co-occur at runtime
- [x] No prop in Table 1 covers two concerns
- [x] Icon and content slots are typed as nodes, not booleans
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged ⚠️ — focus, disabled
- [x] Table 4 is filled in for anything interactive
- [x] The tables compile to a valid interface with nothing invented and nothing missing

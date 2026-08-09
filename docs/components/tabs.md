# Tabs

Grouped navigation for switching between peer views without leaving the current context.

- **Figma:** `Tabs` — node `...`, 4 variants
- **Code:** [`components/tabs.tsx`](../../components/tabs.tsx) — implemented 9 Aug 2026, exports `Tabs`
- **Maturity:** `draft`. Transcribed from `docs/components/Tabs.doc.json`, implemented, built in Storybook — **not yet visually reviewed**
- **Format:** [props-table-format.md](../props-table-format.md)

> **Tabs and Segmented Tab are two halves of one control.** `Tabs` binds only a container
> fill (`muted`) and has no selected-state treatment at all. `Segmented Tab` binds exactly
> that treatment and nothing else, and its own description says: *"Place instances inside
> a secondary-colored segmented-control container."* Neither is complete alone. `Tabs`
> renders the whole tablist including its items; `SegmentedTab` remains exported for the
> case where a caller composes the list themselves. See [`segmented-tab.md`](./segmented-tab.md).

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `items` | `TabItem[]` | — | ✓ | The tabs. ⚠️ **Not a Figma property** — the container has no item list. |
| `selectedId` | `string` | — | ✓ | Controlled selection. Exactly one is always selected. |
| `onSelect` | `(id: string) => void` | — | ✓ | Fired on activation. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | | Figma axis `Orientation`. |
| `density` | `'default' \| 'compact'` | `'default'` | | Figma axis `Density`. ⚠️ No token delta recorded. |
| `label` | `string` | `undefined` | | Accessible name for the tablist. |

Where `TabItem` is `{ id: string; label: string; content: ReactNode }`.

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Orientation` | Horizontal · Vertical | `orientation` | 1:1 in name. ⚠️ **No token delta is recorded for Vertical**, so the difference is layout only. |
| `Density` | Default · Compact | `density` | 1:1 in name. ⚠️ **No token delta recorded either** — `tokensUsed` has one type size and no spacing token, so Compact is expressed with raw padding. |
| — | — | `items`, `selectedId`, `onSelect` | **Missing in Figma.** The container models no items and no selection; that entire half lives in `Segmented Tab`. |
| — | — | `label` | **Missing in Figma.** The tablist's accessible name has no visual form. |

---

## 3. State → token binding

Transcribed from `Tabs.doc.json`. **One row for four variants, and that is the finding**
— neither `Orientation` nor `Density` carries a token delta.

| State | Trigger | Tokens applied |
|---|---|---|
| Base | all variants | fill `muted` · radius `radius/lg` · text `foreground` · type `size/12` |

⚠️ **There is no selected-tab treatment on this component.** Four tokens, none of which
distinguishes an active tab. The selected/unselected pair lives on `Segmented Tab`
(`Selected=True` → fill `card` · text `foreground`; `Selected=False` → text
`muted-foreground`). The implementation uses those, which is why the two components must
be read together.

⚠️ **No focus token is recorded.** The shared `ring` treatment is asserted.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Roles | The record: *"Each tab carries `aria-selected` and `aria-controls`; each panel is labelled by its tab."* `role="tablist"` / `tab` / `tabpanel`. |
| Roving tabindex | The record: *"Only the selected tab is in the tab order."* The unselected tabs have `tabindex="-1"`. |
| Keyboard | Arrow keys move between tabs; Home and End jump to first and last; Tab moves from the list **into** the panel. This is the pattern's whole point — arrows within, Tab out. |
| Orientation | A vertical tablist sets `aria-orientation="vertical"` and uses Up/Down instead of Left/Right. |
| Panel | Labelled by its tab via `aria-labelledby`, and focusable so keyboard users can reach its content. |

---

## Compiled output

```ts
interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  orientation?: 'horizontal' | 'vertical';
  density?: 'default' | 'compact';
  label?: string;
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
- [x] Tokens lacking code syntax are flagged ⚠️ — selected state, focus, density, orientation
- [x] Table 4 is filled in for anything interactive
- [x] The tables compile to a valid interface with nothing invented and nothing missing

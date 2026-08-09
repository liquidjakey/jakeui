# State Decomposition — Table 2 for all 23 conflated sets

Companion to [props-table-format.md](./props-table-format.md). This is the **Table 2** ("Figma → Code mapping") row that every conflated component needs, in one place.

**The problem, once:** a Figma variant axis is mutually exclusive by construction. Runtime state is not. A field can be `disabled` *and* `invalid`. A menu item can be `highlighted` *and* `disabled`. Twenty-three sets in Jake UI encode those co-occurring states as a single `State` enum. Emitting that enum as a code prop produces a component that cannot represent real states.

Since Code Connect is unavailable on this plan, this file **is** the binding contract. Keep it in sync by hand; `design-system/scripts/validate-map.mjs` checks it against the generated manifest.

---

## The three decomposition rules

| Figma value | Becomes in code | Why |
|---|---|---|
| `Hover`, `Focused`, `Highlighted` | **nothing** — `:hover`, `:focus-visible`, `[data-highlighted]` | Browser- and library-owned. A prop here is a bug: it lets callers force a state the user isn't in. |
| `Disabled`, `Error`/`Invalid`, `ReadOnly` | independent **booleans** | Genuinely co-occur. Must be separate props. |
| `Open`, `Selected`, `Checked`, `Pressed`, `Expanded` | **controlled state** props (`open` + `onOpenChange`, etc.) | Owned by the consumer or the primitive, not a visual variant. |

`Default` is never a prop — it is the absence of the others.

---

## The 23

Legend — **CSS**: dropped, browser-owned · **bool**: independent boolean prop · **ctrl**: controlled state prop.

### Form controls

| Component | Figma `State` | CSS (dropped) | Booleans | Controlled |
|---|---|---|---|---|
| `Input` | Default · Focused · Error · Disabled | `Focused` | `invalid`, `disabled` | — |
| `Field` | Default · Focused · Error · Disabled | `Focused` | `invalid`, `disabled` | — |
| `Textarea` | Default · Focused · Error · Disabled | `Focused` | `invalid`, `disabled` | — |
| `Date Picker` | Default · Focused · Error · Disabled | `Focused` | `invalid`, `disabled` | — |
| `Native Select` | Default · Open · Error · Disabled · Focused | `Focused` | `invalid`, `disabled` | `open` |
| `Slider` | Default · Focused · Disabled | `Focused` | `disabled` | — |
| `Checkbox` | Default · Focused · Disabled | `Focused` | `disabled` | — |
| `Radio Group` | Default · Focused · Disabled | `Focused` | `disabled` | — |
| `Switch` | Default · Focused · Disabled | `Focused` | `disabled` | — |

### Primitive internals

| Component | Figma `State` | CSS (dropped) | Booleans | Controlled |
|---|---|---|---|---|
| `Switch / Root` | Default · Hover · Focused · Disabled · ReadOnly · Invalid | `Hover`, `Focused` | `disabled`, `readOnly`, `invalid` | — |
| `Radio Group / Item` | Default · Hover · Focused · Disabled · ReadOnly · Invalid | `Hover`, `Focused` | `disabled`, `readOnly`, `invalid` | — |
| `Radio Group / Root` | Default · Disabled · ReadOnly · Invalid | — | `disabled`, `readOnly`, `invalid` | — |

> `Switch / Root` and `Radio Group / Item` are the worst offenders: **6 exclusive Figma values standing in for 3 independent booleans plus 2 CSS states.** The Figma matrix can express 6 combinations; the runtime has 2³ × 2² = 32.

### Actions

| Component | Figma `State` | CSS (dropped) | Booleans | Controlled |
|---|---|---|---|---|
| `Button` | Default · Hover · Disabled · Focused | `Hover`, `Focused` | `disabled` | — |
| `Toggle` | Default · Hover · Focused · Disabled | `Hover`, `Focused` | `disabled` | — |
| `Popover / Close` | Default · Hover · Focused · Disabled | `Hover`, `Focused` | `disabled` | — |
| `Table / Action Trigger` | Default · Hover · Focused · Disabled | `Hover`, `Focused` | `disabled` | — |

### Menus and overlays

| Component | Figma `State` | CSS (dropped) | Booleans | Controlled |
|---|---|---|---|---|
| `Dropdown Menu / Item` | Default · Highlighted · Disabled | `Highlighted` | `disabled` | — |
| `Dropdown Menu / Checkbox Item` | Default · Highlighted · Disabled | `Highlighted` | `disabled` | — |
| `Dropdown Menu / Radio Item` | Default · Highlighted · Disabled | `Highlighted` | `disabled` | — |
| `Dropdown Menu / Sub Trigger` | Closed · Open · Highlighted · Disabled | `Highlighted` | `disabled` | `open` |
| `Dropdown Menu / Trigger` | Closed · Open · Focused · Disabled | `Focused` | `disabled` | `open` |
| `Popover / Trigger` | Closed · Open · Hover · Focused · Disabled | `Hover`, `Focused` | `disabled` | `open` |

> `Highlighted` is roving-focus state owned by the **menu**, not the item. In Radix it surfaces as `[data-highlighted]`. Never a prop on the item.

### Data display

| Component | Figma `State` | CSS (dropped) | Booleans | Controlled |
|---|---|---|---|---|
| `Table / Row` | Default · Hover · Selected | `Hover` | — | `selected` |

---

## Worked transformation

`Switch / Root` — the hardest case.

```ts
// ✗ WRONG — a direct read of the Figma variant axis.
//   Cannot express "disabled and invalid", which is a real state.
interface SwitchProps {
  size?: 'small' | 'default';
  value?: 'unchecked' | 'checked';
  state?: 'default' | 'hover' | 'focused' | 'disabled' | 'readOnly' | 'invalid';
}

// ✓ RIGHT — Figma's one axis becomes three booleans; two values vanish into CSS.
interface SwitchProps {
  // content / config
  size?: 'sm' | 'md';
  // state
  checked?: boolean;                       // was Value
  defaultChecked?: boolean;
  disabled?: boolean;                      // independent
  readOnly?: boolean;                      // independent
  invalid?: boolean;                       // independent
  // behavior
  onCheckedChange?: (checked: boolean) => void;
  // a11y
  'aria-label'?: string;
  'aria-describedby'?: string;
}
// `hover` and `focused` are absent by design: :hover and :focus-visible.
```

---

## Axes that never become props

Already ruled on by the Governance page; recorded here so codegen cannot invent them.

| Axis | Sets | Treatment |
|---|---|---|
| `Pattern` | `Switch / Field Composition`, `Radio Group / Field Composition`, `Dropdown Menu / Root Composition`, `Popover / Root Composition`, `Table / Root Composition` | **Storybook stories.** Each value is one story. |
| `Viewport` | `Navigation Menu`, `Pagination`, `Sidebar`, `Table / Container`, `Data Table`, `Table / Root Composition` | **Responsive fixtures.** A breakpoint, not an API. Only becomes a prop if code deliberately exposes one. |

## Slots, not booleans

Eight `Show *` booleans toggle a placeholder in Figma. In code each is a nullable node; the boolean disappears.

| Figma | Code |
|---|---|
| `Show leading icon` + `Leading icon` (Button) | `leadingIcon?: ReactNode` |
| `Show icon` + `Icon` (DDM Item / Checkbox Item / Radio Item / Sub Trigger) | `icon?: ReactNode` |
| `Show shortcut` + `Shortcut` (DDM Item) | `shortcut?: ReactNode` |
| `Show header` / `Show close` (Popover / Content) | `header?: ReactNode` / `onClose?: () => void` |

Icons are `@phosphor-icons/react` components — see `design-system/icons/phosphor-map.ts`.

## Value vs placeholder

`Input`, `Native Select`, `Textarea`, `Field` and `Table / Cell` each expose one `Value` TEXT property whose default reads like a placeholder. One Figma property, two code props, different color tokens:

| Figma | Code | Token |
|---|---|---|
| `Value` (filled) | `value: string` | `--foreground` |
| `Value` (default text) | `placeholder?: string` | `--muted-foreground` |

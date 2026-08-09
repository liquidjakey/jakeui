# Popover / Trigger

Trigger patterns for the Popover root.

- **Figma:** `Popover / Trigger` — 10 variants
- **Code:** [`components/popover.tsx`](../../components/popover.tsx) — implemented 9 Aug 2026, exports `PopoverTrigger`
- **Maturity:** `draft`. **Recovered from the 8-row cap** — see below.
- **Format:** [props-table-format.md](../props-table-format.md)

---

## Recovered from the cap: the RTL axis contributes exactly one token

10 variants = `Type`(button · rTL) × `State`(Closed · Open · Hover · Focused · Disabled).
8 rows present; missing: **rTL/Focused** and **rTL/Disabled**.

Every rTL row present carries the same single delta and nothing else:

| Row | Delta |
|---|---|
| rTL / Closed | `type size/12` |
| rTL / Open | `type size/12` |
| rTL / Hover | `type size/12` |

Three rows, one token, no exceptions — the `Type` axis changes **only the type size**
(`size/13` → `size/12`). So the two missing rTL rows are their Button counterparts at
`size/12`.

Same standard as `Table / Row`: the gap sits on an axis the surviving rows prove
contributes a single, constant delta.

⚠️ **`rTL` is not a visual variant at all.** Right-to-left is a document direction, so in
code it is `dir="rtl"` on an ancestor and CSS logical properties — never a prop. What the
axis really documents is that RTL renders one step smaller, which is a **type** decision
that this component honours by inheriting rather than by branching.

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `children` | `ReactNode` | — | ✓ | Trigger content. |
| `open` | `boolean` | — | ✓ | Controlled. |
| `onOpenChange` | `(open: boolean) => void` | — | ✓ | |
| `disabled` | `boolean` | `false` | | From the decomposed `State` axis. |
| `controls` | `string` | `undefined` | | Id of the popover. |

`Type` is deliberately absent — see above.

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `State` | Closed · Open · Hover · Focused · Disabled | `open` + `disabled` | **Yes.** `kind: decompose` with `cssOwned: ["Focused"]`; Hover is CSS too. |
| `Type` | button · rTL | **nothing** | **Yes.** Direction is not a prop. See the ⚠️ above. |

---

## 3. State → token binding

| State | Trigger | Tokens applied |
|---|---|---|
| Closed | base | text `foreground` · type `size/13` |
| Open | `open` | text `accent-foreground` |
| Hover | `:hover` | text `accent-foreground` |
| Focus | `:focus-visible` | border `2px` `ring` · radius `radius/lg` |
| Disabled | `disabled` | text `muted-foreground` |
| rTL (any state) | `dir="rtl"` | type `size/12` |

⚠️ **Open and Hover bind identical tokens**, so a trigger looks the same whether its
popover is open or merely hovered — the same gap already recorded on
`Dropdown Menu / Sub Trigger`. Two components share it now.

⚠️ **`accent-foreground` with no accent fill**, the fourth component with this shape
(`Sidebar` collapsed, `Dropdown Menu / Trigger` avatar, `Navigation Menu` open).

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Element | Native `<button>` with `aria-expanded` and `aria-controls`. |
| Keyboard | Enter and Space open. Escape closes and returns focus here. |
| Disabled | Native `disabled`, leaves the tab order. |
| RTL | Direction is inherited from the document, never set per component. |

---

## Compiled output

```ts
interface PopoverTriggerProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean;
  controls?: string;
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
- [x] Tokens lacking code syntax are flagged ⚠️ — open/hover collision, bare accent-foreground
- [x] Table 4 is filled in for anything interactive
- [x] The tables compile to a valid interface with nothing invented and nothing missing — *the two missing rows sit on an axis proven to contribute a single constant delta*

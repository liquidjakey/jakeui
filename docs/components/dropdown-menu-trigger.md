# Dropdown Menu / Trigger

Visual trigger patterns for the Dropdown Menu root.

- **Figma:** `Dropdown Menu / Trigger` — 7 variants
- **Code:** [`components/dropdown-menu.tsx`](../../components/dropdown-menu.tsx) — implemented 9 Aug 2026, exports `DropdownMenuTrigger`
- **Maturity:** `draft`. Transcribed from `docs/components/Dropdown-Menu-Trigger.doc.json`.
- **Format:** [props-table-format.md](../props-table-format.md)

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `children` | `ReactNode` | — | ✓ | Label, or the avatar. |
| `open` | `boolean` | — | ✓ | Controlled. **A real prop here** — see Table 2. |
| `onOpenChange` | `(open: boolean) => void` | — | ✓ | |
| `type` | `'button' \| 'avatar'` | `'button'` | | Figma axis `Type`. |
| `disabled` | `boolean` | `false` | | From the decomposed `State` axis. |
| `controls` | `string` | `undefined` | | Id of the menu, for `aria-controls`. |
| `label` | `string` | `undefined` | | Required when `type="avatar"` and there is no visible text. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Type` | Button · Avatar | `type` | 1:1. Carries real token deltas — avatar drops the fill and border and shifts to `size/12`. |
| `State` | Closed · Open · Focused · Disabled | `open` + `disabled` | **Yes.** `kind: decompose` with `cssOwned: ["Focused"]`, `booleans: ["disabled"]`, **`controlled: ["closed","open"]`**. |
| ↳ `open` | — | **a real prop** | **Note the contrast with [`native-select.md`](./native-select.md).** There, `controlled: ["open"]` was deliberately *not* emitted, because a native select's menu is platform-owned and unobservable. Here the menu is ours: it can be opened programmatically, its state is observable, and `aria-expanded` needs it. Same map annotation, opposite conclusion — the difference is who owns the popup. |

---

## 3. State → token binding

Seven rows for seven variants — nothing truncated, and `Type=Avatar, State=Disabled`
simply does not exist in the file.

| State | Trigger | Tokens applied |
|---|---|---|
| Button / closed | base | fill `card` · border `1px` `border` · radius `radius/lg` · text `foreground` · type `size/13` |
| Button / open | `open` | fill `accent` · text `accent-foreground` |
| Button / focus | `:focus-visible` | border `2px` `ring` |
| Button / disabled | `disabled` | text `muted-foreground` — ⚠️ **no fill change**, unlike every other disabled control here, which moves to `muted` |
| Avatar / closed | `type="avatar"` | text `accent-foreground` · type `size/12` — no fill, no border |
| Avatar / open | | fill `accent` · text `accent-foreground` · type `size/12` |
| Avatar / focus | | border `2px` `ring` · text `accent-foreground` · type `size/12` |

⚠️ **Avatar / closed binds `accent-foreground` with no fill.** `accent-foreground` is the
text colour *for the accent fill*; with no fill behind it, it sits on whatever is beneath.
The same class of mismatch as `Card`'s `info-foreground`, though not as severe — verify
in review.

⚠️ **No disabled variant exists for the avatar type.**

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Element | Native `<button>` with `aria-haspopup="menu"` and `aria-expanded`. |
| Name | An avatar trigger has no visible text, so `label` becomes its accessible name. |
| Keyboard | Enter, Space and Down Arrow all open — Down Arrow is the APG convention for menu buttons. |
| Focus | Returns here when the menu closes. |

---

## Compiled output

```ts
interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type?: 'button' | 'avatar';
  disabled?: boolean;
  controls?: string;
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
- [x] Tokens lacking code syntax are flagged ⚠️ — avatar foreground, disabled fill
- [x] Table 4 is filled in for anything interactive
- [x] The tables compile to a valid interface with nothing invented and nothing missing

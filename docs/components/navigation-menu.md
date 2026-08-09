# Navigation Menu

Primary product navigation with desktop and compact structures.

- **Figma:** `Navigation Menu` — 4 variants
- **Code:** [`components/navigation-menu.tsx`](../../components/navigation-menu.tsx) — implemented 9 Aug 2026, exports `NavigationMenu`
- **Maturity:** `draft`. **The second component whose code deliberately diverges from its record** — see below.
- **Format:** [props-table-format.md](../props-table-format.md)

---

## 🛑 `primary-foreground` on a `card` fill is invisible in light mode

`Navigation-Menu.doc.json` binds `fill card` · `text primary-foreground`. Verified against
`.figma-tokens-dump.json`:

| Token | Light | Dark |
|---|---|---|
| `card` (the fill) | `white/100` | `neutral/900` |
| `primary-foreground` (the text) | `blue/50` | `blue/50` |

`primary-foreground` is near-white in **both** modes — correct, because it is the text for
the solid `primary` fill, which is how `Avatar` uses it. On a `card` fill it is near-white
text on a **white** card in Light. The text is invisible.

Dark mode happens to survive (`neutral/900` behind `blue/50`), so this is a **light-mode-
only** failure — narrower than `Card`'s, which broke in both.

**The code binds `foreground`.** This is the second place in this system where following
the record would ship a visible bug rather than a documentation inaccuracy — the first
was [`card.md`](./card.md), and the cause is identical: a `*-foreground` token paired with
a fill it does not belong to. **Figma owes a rebind.**

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `items` | `NavItem[]` | — | ✓ | Destinations. ⚠️ Not a Figma property. |
| `open` | `boolean` | `false` | | Figma axis `Open`, as a real boolean. Compact only. |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | | |
| `label` | `string` | `'Main'` | | Accessible name for the `<nav>`. |

Where `NavItem` is `{ href: string; label: string; current?: boolean }`.

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Open` | False · True | `open` boolean | **Yes.** String union → real boolean. The record: *"Open=True reveals the navigation panel"* — compact only; a desktop link row is always visible. |
| `Viewport` | Desktop · Compact | **nothing** | `kind: responsive-fixture`, dropped as for `Sidebar` and `Table / Container`. The record describes it as a structural swap — *"compact mode replaces the link row with a menu trigger"* — but unlike `Pagination` this one is genuinely driven by width, so it is CSS, not a prop. |
| — | — | `items`, `label` | **Missing in Figma.** |

---

## 3. State → token binding

| State | Trigger | Tokens applied |
|---|---|---|
| Desktop, closed | base | fill `card` · border `1px` `border` · radius `radius/lg` · text ~~`primary-foreground`~~ → **`foreground`** 🛑 |
| Compact, closed | narrow | text `foreground` |
| Compact, open | `open` | text `accent-foreground` |

🛑 **Text token deviated** — see the block at the top.

⚠️ **Compact/open binds `accent-foreground` with no accent fill**, the same pattern as
`Sidebar`'s collapsed state and `Dropdown Menu / Trigger`'s avatar. Three components now
share this shape; it is likely one systematic Figma habit rather than three separate
slips.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Element | `<nav>` with an accessible name, containing a list of links. |
| Current | `aria-current="page"`, never colour alone. |
| Compact trigger | A real button with `aria-expanded` and `aria-controls`. |
| Keyboard | Tab through links. No arrow-key handling — these are links, not a menu. |
| Panel | When open, Escape closes it and returns focus to the trigger. |


---

## Authoring checklist

- [x] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [x] No enum in Table 1 mixes states that can co-occur at runtime
- [x] No prop in Table 1 covers two concerns
- [x] Icon and content slots are typed as nodes, not booleans
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged 🛑
- [x] Table 4 is filled in for anything interactive
- [ ] **The tables compile to a valid interface with nothing invented and nothing missing** — the record's text token is wrong and the code deliberately diverges. Not closable until Figma rebinds.

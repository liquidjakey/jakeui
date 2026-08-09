# Sidebar

Application sidebar with expanded and collapsed structures.

- **Figma:** `Sidebar` — 4 variants
- **Code:** [`components/sidebar.tsx`](../../components/sidebar.tsx) — implemented 9 Aug 2026, exports `Sidebar`
- **Maturity:** `draft`. Transcribed from `docs/components/Sidebar.doc.json`.
- **Format:** [props-table-format.md](../props-table-format.md)

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `children` | `ReactNode` | — | ✓ | `SidebarNavigationItem`s. |
| `collapsed` | `boolean` | `false` | | Figma axis `State`, as a boolean. |
| `onCollapsedChange` | `(collapsed: boolean) => void` | `undefined` | | When set, a toggle is rendered. |
| `label` | `string` | `'Main'` | | Accessible name for the `<nav>`. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `State` | Expanded · Collapsed | `collapsed` boolean | **Yes.** Two-value enum describing a binary. |
| `Viewport` | Desktop · Compact | **nothing** | **Yes, and the map says so.** `kind: responsive-fixture` — *"Breakpoint fixture. Not a prop unless code deliberately exposes one."* The same treatment as `Table / Container`'s. |
| — | — | `children`, `onCollapsedChange`, `label` | **Missing in Figma.** |

---

## 3. State → token binding

Three rows for four variants.

| State | Trigger | Tokens applied |
|---|---|---|
| Expanded | base | fill `sidebar` · border `1px` `sidebar-border` · radius `radius/lg` · text `sidebar-foreground` · type `size/15` |
| Collapsed | `collapsed` | text `sidebar-accent-foreground` · type `size/13` |

✅ Uses the dedicated `sidebar-*` family throughout, like its item.

⚠️ **Collapsed switches text to `sidebar-accent-foreground` with no accent fill.** That
token is the foreground *for* `sidebar-accent`; with no fill behind it, it sits on plain
`sidebar`. The same class of mismatch as `Dropdown Menu / Trigger`'s avatar state.
Transcribed as recorded and flagged.

⚠️ **No width tokens** for either state — no dimension tokens exist in the file at all, so
both widths are raw. Same gap as Dialog and Drawer.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Element | `<nav>` with an accessible name. |
| Collapse toggle | A real button carrying `aria-expanded`. |
| Collapsed labels | Labels stay in the DOM, visually hidden, so items keep their accessible names. Icons alone would strip them. |
| Persistence | The collapsed choice should survive navigation. That is app state, not component state, hence the controlled prop. |
| Narrow screens | The record's `Viewport=Compact` is a breakpoint fixture. At true mobile widths a sidebar should become an overlay `Drawer` — that is a layout decision, not this component's. |

---

## Compiled output

```ts
interface SidebarProps {
  children: React.ReactNode;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
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
- [x] Tokens lacking code syntax are flagged ⚠️ — width, the collapsed foreground
- [x] Table 4 is filled in for anything interactive
- [x] The tables compile to a valid interface with nothing invented and nothing missing

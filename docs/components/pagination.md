# Pagination

Navigate paged datasets or long collections.

- **Figma:** `Pagination` — 4 variants
- **Code:** [`components/pagination.tsx`](../../components/pagination.tsx) — implemented 9 Aug 2026, exports `Pagination`
- **Maturity:** `draft`. Transcribed from `docs/components/Pagination.doc.json`.
- **Format:** [props-table-format.md](../props-table-format.md)

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `page` | `number` | — | ✓ | Current page, 1-based. |
| `pageCount` | `number` | — | ✓ | Total pages. |
| `onPageChange` | `(page: number) => void` | — | ✓ | |
| `compact` | `boolean` | `false` | | Page summary instead of numbers — see Table 2. |
| `label` | `string` | `'Pagination'` | | Accessible name for the `<nav>`. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Viewport` | Desktop · Compact | `compact` | **Yes, and this is the exception.** `kind: responsive-fixture` — normally not a prop, and it was dropped for `Table / Container` and `Sidebar`. Here the record describes a **structural** difference, not a breakpoint: *"Desktop exposes page numbers; Compact uses a concise page summary."* Different content, not the same content reflowed. It is exposed deliberately, because a caller in a narrow column needs it regardless of viewport width. |
| `State` | Default · Disabled | **derived** | **Yes.** Not a prop. Previous is disabled at page 1 and next at the last page — that is arithmetic, and a prop would let a caller contradict it. |

---

## 3. State → token binding

| State | Trigger | Tokens applied |
|---|---|---|
| Base | all four variants | fill `card` · text `foreground` · type `size/13` |

⚠️ **Three tokens, and no state distinctions.** No current-page treatment, no disabled
treatment, no hover, no focus — despite `State=Disabled` existing as a variant that
records nothing.

The archetype is explicit that disabled controls must stay visible: *"Disable rather than
hide the controls at the first and last page."* With no token, `muted-foreground` is
asserted, and the current page uses the `accent` pairing already proven elsewhere.

⚠️ **No radius token**, unusually — every sibling binds `radius/lg`.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Element | `<nav>` with an accessible name, containing a list. |
| Current | `aria-current="page"`, never colour alone. |
| Disabled | Real `disabled` buttons at the boundaries — **still announced**, not removed. |
| Compact | The summary ("Page 2 of 9") is text, so it is announced as-is. |
| Keyboard | Standard tab order. No arrow-key handling — these are buttons, not a composite widget. |


---

## Authoring checklist

- [x] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [x] No enum in Table 1 mixes states that can co-occur at runtime
- [x] No prop in Table 1 covers two concerns
- [x] Icon and content slots are typed as nodes, not booleans
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged ⚠️ — current, disabled, hover, focus, radius
- [x] Table 4 is filled in for anything interactive
- [x] The tables compile to a valid interface with nothing invented and nothing missing

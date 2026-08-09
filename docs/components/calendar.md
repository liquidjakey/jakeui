# Calendar

Month calendar supporting single-date and date-range selection.

- **Figma:** `Calendar` — node `132:0`, 4 variants
- **Code:** [`components/calendar.tsx`](../../components/calendar.tsx) — implemented 9 Aug 2026, exports `Calendar`
- **Maturity:** `draft`. **The record names five day-states and binds none of them** — see Table 3.
- **Format:** [props-table-format.md](../props-table-format.md)

---

## 🛑 Five states named in prose, zero in tokens

The record's description ends: *"Includes **today, selected, range, disabled, and
out-of-month** …"*.

`tokensUsed` is `border`, `card`, `foreground`, `radius/lg`, `size/13` — **five container
tokens and not one day-state colour.** Every state the description advertises is
unbound.

This is the widest gap between what a record promises and what it binds anywhere in this
build. The day states are asserted from precedent already established elsewhere in the
system:

| Day state | Asserted | Precedent |
|---|---|---|
| Selected | `primary` / `primary-foreground` | `Radio Group / Indicator` binds `primary` for checked |
| Range | `accent` / `accent-foreground` | the highlight pairing used by `Command`, `Toggle`, menus |
| Today | `ring` outline | the only "marker" token in the system |
| Disabled | `muted-foreground` | shared convention across every disabled control |
| Out-of-month | `muted-foreground` | same |

**Figma owes day-state bindings.** Until then this is the least-transcribed component in
the build, and its checklist box stays unticked.

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `month` | `Date` | — | ✓ | The displayed month. |
| `monthLabel` | `string` | — | ✓ | Figma property `Month label#132:0`. |
| `onMonthChange` | `(month: Date) => void` | — | ✓ | |
| `mode` | `'single' \| 'range'` | `'single'` | | Figma axis `Mode`. |
| `selected` | `Date \| [Date, Date] \| undefined` | `undefined` | | Shape follows `mode`. |
| `onSelect` | `(value: Date) => void` | — | ✓ | Receives the clicked day; range assembly is the caller's. |
| `density` | `'compact' \| 'comfortable'` | `'compact'` | | Figma axis `Density`. ⚠️ No token delta. |
| `isDisabled` | `(date: Date) => boolean` | `undefined` | | Out-of-range days. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Month label#132:0` | string | `monthLabel` | 1:1. Kept as a prop rather than derived, because month naming is locale-dependent and belongs to the caller. |
| `Mode` | Single · Range | `mode` + the shape of `selected` | **Yes.** The enum stays, because it also changes the *shape* of `selected` — `Date` vs `[Date, Date]`. |
| `Density` | Compact · Comfortable | `density` | 1:1 in name. ⚠️ No token delta; the sixth component in this system with that gap. |
| — | — | `onSelect`, `onMonthChange`, `isDisabled` | **Missing in Figma.** |

---

## 3. State → token binding

| State | Trigger | Tokens applied |
|---|---|---|
| Container | all four variants | fill `card` · border `1px` `border` · radius `radius/lg` · text `foreground` · type `size/13` |
| Today · Selected · Range · Disabled · Out-of-month | — | 🛑 **None recorded.** See the block above. |

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Structure | A `<table>` with `role="grid"`. Weekday headers are `<th scope="col">` with full names available to screen readers. |
| Keyboard | Arrow keys move by day, PageUp/PageDown by month, Home/End to week start/end. Only the focused day is tabbable — a roving tabindex, not 30 tab stops. |
| Announcement | The focused day announces in full — "Tuesday 14 August 2026" — not just the number. |
| Selected | `aria-selected` on the day. Range endpoints announce which end they are. |
| Disabled | `aria-disabled` and skipped by arrow keys, per the `datepicker` archetype: disable out-of-range dates rather than rejecting them after submit. |
| Colour | With every day state asserted rather than bound, contrast must be re-checked once Figma provides real values. |


---

## Authoring checklist

- [x] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [x] No enum in Table 1 mixes states that can co-occur at runtime
- [x] No prop in Table 1 covers two concerns
- [x] Icon and content slots are typed as nodes, not booleans
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged 🛑 — all five day states
- [x] Table 4 is filled in for anything interactive
- [ ] **The tables compile to a valid interface with nothing invented and nothing missing** — five day states are asserted from precedent, not read. The least-transcribed component in the build.

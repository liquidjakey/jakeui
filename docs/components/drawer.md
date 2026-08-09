# Drawer

Edge-aligned overlay panel for filters, supplemental tasks, and contextual controls.

- **Figma:** `Drawer` — node `106:...`, 4 variants
- **Code:** [`components/drawer.tsx`](../../components/drawer.tsx) — implemented 9 Aug 2026, exports `Drawer`
- **Maturity:** `draft`. Transcribed from `docs/components/Drawer.doc.json`, implemented, built in Storybook — **not yet visually reviewed**
- **Format:** [props-table-format.md](../props-table-format.md)

> Shares the native `<dialog>` surface with [`dialog.md`](./dialog.md) — see its Table 4
> for the platform-supplied focus trap, Escape and focus return.

---

## ⚠️ Drawer and Sheet are indistinguishable in the design file

This is the most important thing on this page. Verified field by field against
`Sheet.doc.json`:

| | Drawer | Sheet |
|---|---|---|
| `tokensUsed` | `border, card, foreground, radius/lg, size/18` | **identical** |
| State rows | 1 | **identical** |
| Variants | 4 | **identical** |
| Axis 1 | `Placement`: left · right | `Side`: left · right — **same values, different name** |
| Axis 2 | `Width`: compact · wide | **identical** |
| Props | Title, Description | **identical** |
| Accessibility | dialog / Escape / trap | **identical** |

Nothing separates them except prose intent. `Sheet`'s description says: *"Use Sheet for
persistent side tasks; use Drawer for transient filtering and supplemental controls."*
That is a usage convention, not a design difference — **a consumer cannot tell which they
have been given by looking at it**, and neither can a token.

**This is a design decision, not an implementation one, so both were built as specified
rather than merged.** But it is worth resolving: either give them a real visual
difference, or collapse them into one component with a documented usage note. Two
components that render identically are two chances to pick the wrong one.

They share `modal-surface.tsx` in code, so at least they cannot drift further apart.

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `open` | `boolean` | — | ✓ | Controlled visibility. |
| `onClose` | `() => void` | — | ✓ | Escape, backdrop click, or the close control. |
| `title` | `string` | — | ✓ | Names the panel. Figma property `Title#106:0`. |
| `description` | `string` | `undefined` | | Figma property `Description#106:5`. |
| `children` | `ReactNode` | `undefined` | | Body content — a slot, not a typed prop; see [`dialog.md`](./dialog.md) Table 2. |
| `placement` | `'left' \| 'right'` | `'right'` | | Figma axis `Placement`. Opening edge. |
| `width` | `'compact' \| 'wide'` | `'compact'` | | Figma axis `Width`. ⚠️ **No token backing** — see Table 3. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Placement` | Left · Right | `placement` | 1:1. **Note the name differs from `Sheet`'s `Side` for an identical axis** — see the box above. |
| `Width` | Compact · Wide | `width` | 1:1 in name, not in backing. |
| `Title#106:0` · `Description#106:5` | string | `title` · `description` | 1:1. |
| — | — | `open`, `onClose`, `children` | **Missing in Figma.** Visibility has no design representation; `children` is a slot rather than a prop, per the record's *"must not be generated as a public code prop until engineering API review."* |

---

## 3. State → token binding

Transcribed from `Drawer.doc.json`. One row for four variants — neither `Placement` nor
`Width` carries a token delta, only geometry.

| State | Trigger | Tokens applied |
|---|---|---|
| Base | all variants | fill `card` · border `1px` `border` · radius `radius/lg` · text `foreground` · type `size/18` |

⚠️ **`Width` has no token backing.** There are **no width or container tokens in the file
at all** — every `size/*` variable is a type size. Both widths are raw values in code.
Figma owes width tokens if these are to be themable.

⚠️ **`text foreground` on a `card` fill is a semantic mismatch** — `AlertDialog` binds
`card-foreground` for the same surface. Currently identical in value, so invisible today.
Full reasoning in [`dialog.md`](./dialog.md) Table 3.

⚠️ **The backdrop has no token.**

---

## 4. Accessibility & keyboard

As [`dialog.md`](./dialog.md) Table 4 — modal `<dialog>`, platform focus trap, Escape,
focus return, backdrop click closes.

| Concern | Contract |
|---|---|
| Placement | Visual only. A left-opening drawer is not a different reading order — it stays after its trigger in the DOM. |
| Motion | Slides from the named edge. Respects `prefers-reduced-motion` by fading rather than sliding. |

---

## Compiled output

```ts
interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  placement?: 'left' | 'right';
  width?: 'compact' | 'wide';
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
- [x] Tokens lacking code syntax are flagged ⚠️ — width, the `foreground` mismatch, the backdrop
- [x] Table 4 is filled in for anything interactive
- [ ] **The tables compile to a valid interface with nothing invented and nothing missing** — the interface compiles, but see the Drawer/Sheet duplication box. That is unresolved by design.

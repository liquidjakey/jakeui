# Button Group

Group related actions using nested Button instances.

- **Figma:** `Button Group` — 4 variants
- **Code:** [`components/button-group.tsx`](../../components/button-group.tsx) — implemented 9 Aug 2026, exports `ButtonGroup`
- **Maturity:** `draft`. **Layout-only** — see Table 3.
- **Format:** [props-table-format.md](../props-table-format.md)

> ⚠️ **Its members are `Button`s, and `Button` is still blocked** by the 8-row cap
> (32 variants, 8 rows — outline and ghost are entirely unrecorded). This component is
> the container; callers supply their own buttons until `Button` can be built.

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `children` | `ReactNode` | — | ✓ | The actions. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | | Figma axis `Orientation`. |
| `attached` | `boolean` | `false` | | Figma axis `Attached`, as a real boolean. |
| `label` | `string` | `undefined` | | Accessible name for the group. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Orientation` | Horizontal · Vertical | `orientation` | 1:1. ⚠️ No token delta. |
| `Attached` | False · True | `attached` boolean | **Yes.** String union → real boolean. The vocabulary is precise: attached members *"are joined into one continuous control, sharing inner borders"*; detached *"keep their own borders and are separated by a gap."* |

---

## 3. State → token binding

| State | Trigger | Tokens applied |
|---|---|---|
| Base | all four variants | text `primary-foreground` · type `size/14` |

⚠️ **Two tokens, and `primary-foreground` is a leaked binding.** The group has no fill of
its own, so `primary-foreground` — the text colour *for* the `primary` fill — sits on
whatever is beneath. It almost certainly belongs to the **nested Button instances** the
record describes, not to the container.

This is the identical shape of `Toggle Group`'s stray `accent-foreground`, and it gets
the identical treatment: **implemented as a layout-only container**, with each member
owning its appearance. That is what the tokens actually support.

⚠️ **`attached` has no border or radius tokens** to work with, so the shared-edge
treatment is raw CSS.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Role | `role="group"` with an accessible name when the grouping is meaningful. A purely visual grouping needs no role at all. |
| Keyboard | Tab between members. Not a toolbar and not a radio group — no arrow-key navigation, since the members are independent actions. |
| Attached | Visual only. Joining buttons must not imply they are one control to assistive technology. |

---

## Compiled output

```ts
interface ButtonGroupProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  attached?: boolean;
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
- [x] Tokens lacking code syntax are flagged ⚠️ — the leaked foreground, attached borders
- [x] Table 4 is filled in for anything interactive
- [x] The tables compile to a valid interface with nothing invented and nothing missing

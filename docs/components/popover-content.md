# Popover / Content

The popover surface.

- **Figma:** `Popover / Content` — 48 variants
- **Code:** [`components/popover.tsx`](../../components/popover.tsx) — implemented 9 Aug 2026, exports `PopoverContent`
- **Maturity:** `draft`. **Read from live bindings** — its description showed **1 of 48** rows, the worst ratio in the file.
- **Format:** [props-table-format.md](../props-table-format.md)

## The read collapsed 48 variants to 3 — and proved the staleness finding

**`Size`, `Side` and `Align` all carry no colour delta.** Forty-eight variants produce
three distinct binding sets, differing only by the Arrow node. Every visual axis on
this component is geometry.

🔎 **And the action link binds `primary-readable`.** That is one of the three tokens
the 9 Aug rebind introduced, and it appears in **no description anywhere in the file**.
This is the single clearest piece of evidence that **the bindings are current while the
descriptions are stale** — the finding first inferred from the dump's silence, now
observed directly.

## 1. Code API

| Prop | Type | Default |
|---|---|---|
| `title` / `description` | `string` | `undefined` |
| `children` | `ReactNode` | `undefined` |
| `action` | `ReactNode` | `undefined` |
| `onClose` | `() => void` | `undefined` |
| `size` | `'small' \| 'large'` | `'small'` |
| `side` | `PopoverSide` | `'bottom'` |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` |
| `arrow` | `boolean` | `false` |

## 2. Figma → Code mapping

| Figma property | Code | Not 1:1? |
|---|---|---|
| `Size` · `Side` · `Align` | `size` · `side` · `align` | 1:1 in name; **no colour delta**. `Size` changes width only — and there is still no width token, so those values remain raw. |
| `Arrow` | `arrow` boolean | String union → real boolean. |

## 3. State → token binding

| Part | Tokens |
|---|---|
| Surface | fill `popover` · stroke `border` |
| Title | `popover-foreground` |
| Description | `muted-foreground` |
| Body text | `muted-foreground` |
| **Action** | **`primary-readable`** |
| Close | fill `popover`, glyph `foreground` |
| Arrow | fill `popover` · stroke `border` |

✅ Confirms the arrow token that [`popover.md`](./popover.md) had to assert, and adds
the action colour it had no value for.

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Role | `role="dialog"` only when modal — a non-modal surface announced as a dialog misleads. |
| Escape | Closes, returning focus to the trigger. |
| Close control | Named "Close"; the glyph is decorative. |

## Compiled output

```ts
interface PopoverContentProps {
  title?: string; description?: string;
  children?: React.ReactNode; action?: React.ReactNode;
  onClose?: () => void;
  size?: 'small' | 'large';
  side?: PopoverSide;
  align?: 'start' | 'center' | 'end';
  arrow?: boolean;
}
```

## Authoring checklist

- [x] Every Figma variant property appears in Table 2
- [x] No enum mixes co-occurring states
- [x] One concern per prop
- [x] Slots are nodes
- [x] Behavior props present
- [x] Tokens named, never hex
- [x] Missing tokens flagged ⚠️ — width, still
- [x] Table 4 filled in
- [x] Compiles with nothing invented — *read from live bindings*

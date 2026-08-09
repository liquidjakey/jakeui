# Badge

Short status, count or category label.

- **Figma:** `Badge` — node `111:32`, 10 variants
- **Code:** [`components/badge.tsx`](../../components/badge.tsx) — implemented 9 Aug 2026, exports `Badge`
- **Maturity:** `draft`. **Recovered from the cap; contains a likely Figma bug** — see Table 3.
- **Format:** [props-table-format.md](../props-table-format.md)

> **Unblocked twice on 9 Aug 2026.** It was wrongly flagged as carrying pre-rebind stale
> tokens — a regex error, since `text warning\b` matched `text warning-foreground` (see
> handoff §5). And its cap gap turned out to be recoverable, below.

---

## Recovered from the cap: one tone missing, four to pattern-match against

10 variants = `Tone` (neutral · info · success · warning · destructive) × `Size`
(small · medium). 8 rows present; the two missing are **both Destructive**.

| Tone | Small | Medium |
|---|---|---|
| Neutral | fill `secondary` · text `secondary-foreground` · `size/11` | `size/12` |
| Info | fill `info` · text `info-foreground` | + `size/12` |
| Success | fill `success` · text **`info-foreground`** ⚠️ | + `size/12` |
| Warning | fill `warning` · text `warning-foreground` | + `size/12` |
| **Destructive** | **absent** | **absent** |

Four tones, one consistent shape: `fill <tone>` + `text <tone>-foreground`, with `Size`
contributing only a type-size step. `destructive` and `destructive-foreground` both
exist. The missing rows are `fill destructive` · `text destructive-foreground`.

That is pattern-completion across four observations, not invention — the same standard
applied to `Table / Row`.

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `children` | `ReactNode` | — | ✓ | Label. Figma property `Label#111:32`. |
| `tone` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'destructive'` | `'neutral'` | | Figma axis `Tone`. |
| `size` | `'small' \| 'medium'` | `'small'` | | Figma axis `Size`. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Label#111:32` | string | `children` | Widened to a node, so a badge can hold an icon plus text — the archetype requires status not be carried by colour alone. |
| `Tone` | 5 values | `tone` | 1:1. |
| `Size` | Small · Medium | `size` | 1:1 in name; contributes only a type-size step (`size/11` → `size/12`). No padding token, so spacing is raw. |

---

## 3. State → token binding

See the recovery table above for all ten combinations.

⚠️ **Success binds `text info-foreground`, not `success-foreground`.** Every other tone
pairs with its own foreground; Success reaches across to Info's. `success-foreground`
exists in the file.

Both currently resolve to the same value, so **nothing is visibly wrong today** — which
is exactly the condition the handoff already records biting once, when
`warning-muted-foreground` resolving to the same primitive as `warning` made a planned
contrast fix a no-op. **Transcribed as recorded** (unlike `Card` and `Navigation Menu`,
where following the record would have produced invisible text — here it would not), and
flagged. **Figma owes a rebind to `success-foreground`.**

✅ Badge is also the component that makes `info-foreground` legitimate elsewhere: on a
**solid `info` fill** it is the correct pairing, which is what made `Card`'s use of it on
a `card` fill identifiable as the anomaly.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Semantics | A `<span>`. Not interactive — a badge that can be clicked or removed is a chip, and it needs its own control. |
| Colour | The archetype's dont: *"Do not rely on colour alone to convey status — include text or an icon."* The label carries the meaning; the tone reinforces it. |
| Announcement | Not a live region. A badge whose value changes in place should be inside one the caller owns. |
| Contrast | Every tone's text-on-fill pairing must clear 4.5:1 in both modes. ⚠️ Success's cross-family pairing needs re-checking if the two foregrounds ever diverge. |

---

## Compiled output

```ts
interface BadgeProps {
  children: React.ReactNode;
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'destructive';
  size?: 'small' | 'medium';
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
- [x] Tokens lacking code syntax are flagged ⚠️ — Success's cross-family foreground
- [x] Table 4 is filled in for anything interactive
- [ ] **The tables compile to a valid interface with nothing invented and nothing missing** — the Destructive tone is pattern-completed rather than read.

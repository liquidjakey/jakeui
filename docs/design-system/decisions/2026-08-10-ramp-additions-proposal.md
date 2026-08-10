# Proposal — the ramp additions that would retire the last 31 unbindable nodes

**Date:** 10 Aug 2026
**Status:** ⏳ **Open. Nothing here is decided, and the ramp is UNCHANGED.**
**Depends on:** [the Figma-side decision memo](./2026-08-10-figma-side-decision-memo.md),
item 1, decided **Option B** — keep the 14-step ramp, bind the nodes to it.
**Subject:** the residue Option B leaves behind.

Option B was the right call and this proposal does not reopen it. Binding 265
nodes to the existing ramp took the file from 697 to 931 bound source text nodes
without a single code change, which is exactly what a correct decision looks
like. But 31 nodes could not be bound, because they sit at a **weight or size the
ramp does not carry**. This is what it would take to finish the job, and whether
finishing it is worth doing.

Blast-radius figures are measured — `npm run computed-type:explore` across all 91
stories, 611 measured elements — not estimated.

---

## What is actually left

31 nodes, in 8 groups. Only three of them cause a rendered element to compute off
the ramp; the rest were absorbed by code snapping to a nearby step, which is a
quieter problem but still a divergence.

| Figma node | Metrics | Nodes | Why unbindable | What code does |
|---|---|---|---|---|
| `Dropdown Menu / Checkbox Item` → Spacer | 1/1 Regular | 9 | Not prose — a 1px layout spacer | Renders nothing; padding reserves the column |
| `Dropdown Menu / Radio Item` → Spacer | 1/1 Regular | 6 | Same | Same |
| `Popover / Content` → Title | 15/22 **Medium** | 4 | `Heading/SM` is 15/22 but **Semi Bold** | `text-heading-xs` — snaps a size *and* a weight |
| `Dropdown Menu / Trigger` → Initials | 12/16 **Semi Bold** | 3 | No 12px semibold step | `text-body-xs` — 12/18/400, off on leading and weight |
| `Checkbox / Control` → Mark | 12/14 **Semi Bold** | 3 | No 12px semibold, no 14 leading | `text-[10px]` — a raw size, ASSERTED |
| `Table / Container` → Guidance | 10/16 Regular | 2 | No 10px step at any weight | Renders nothing — a designer annotation |
| `Dropdown Menu / Label` → Label | 12/18 **Semi Bold** | 2 | No 12px semibold step | `text-body-xs` + `font-semibold` |
| `Avatar / Small` → Initials | 11/14 **Semi Bold** | 2 | No 11px semibold step | `text-label-xs` + `font-semibold` |

**15 of the 31 are spacers and annotations that will never be bindable and should
never be counted again.** They are text nodes only in the sense that Figma has no
other primitive for "reserve 1px of width" or "leave a note on the canvas". No
ramp addition touches them.

**That leaves 16 real nodes**, and they cluster with unusual clarity:

- **10 of the 16 are semibold at a small size** — 11px ×2, 12px ×8. The ramp has
  no semibold below 14px. `Value/Strong` 13/18 is the smallest, and there is
  nothing beneath it.
- **4 are `Popover / Content`'s Title at 15/22 Medium** — the ramp has 15/22, just
  at the wrong weight.
- **2 are the Checkbox mark**, which is a glyph rather than text and is arguably
  not a ramp problem at all.

---

## The options

### Option A — do nothing. Keep the 14-step ramp and the three exceptions.

*Blast radius:* zero. This is the status quo, and it is fully documented: three
gate rules in `scripts/computed-type-exceptions.json`, each keyed to an exact
triple and its required classes, plus a `figmaUnbindable` record covering all 31.
Since 10 Aug the gate also **fails on a stale exception**, so the list cannot rot
quietly.

*What it costs:* three components stay permanently off-ramp by design, and two
more (`Popover / Content` Title, `Dropdown Menu / Trigger` Initials) stay
silently divergent from the file — on-ramp, so the gate says nothing, but not
what Figma draws. That second category is the real cost: it is invisible.

### Option B — add `Label/XS-Strong` and `Label/SM-Strong` (11/16/600 and 12/16/600).

Two steps, both semibold, sized to the two the file actually uses.

*Blast radius:* zero rendered change on adoption — no existing element computes
either triple except the three exceptions, which is precisely the point.
`Avatar / Small` and `Dropdown Menu / Trigger` bind cleanly. `Dropdown Menu /
Label` does **not**: it is 12/**18** semibold, and `Label/SM-Strong` would be
12/16, so it would trade a weight override for a leading change.

*What it buys:* retires 5 of the 16 real nodes and 2 of the 3 gate exceptions.

*What it costs:* the ramp grows 14 → 16, and the naming convention has to absorb
a "-Strong" axis that does not exist today. Every future author gains a choice
between `Label/SM` and `Label/SM-Strong` with no rule for picking, which is the
same objection that sank Option C in the original memo.

### Option C — add a `Display/Centered` family. **The memo's carve-out, generalised.**

One step per size, with **line-height equal to font-size**, for text that is a
single centred glyph in a fixed box: avatar initials, alert glyphs, checkbox
marks, badge counts.

*Blast radius:* this is the option that changes the most and risks the least,
because it is not competing with the body ramp at all — it occupies a space the
ramp deliberately does not model. The rule for picking is unambiguous and
statable in one line: *is this a single non-wrapping glyph centred in a fixed
box?* If yes, `Display/*`; if no, the body ramp. That is exactly the rule the
existing 14 steps cannot express.

*What it buys:* retires the Checkbox mark, both Avatar initials, the Dropdown
Trigger initials, and the Alert glyph — the whole "glyph in a circle" family,
which is 6+ nodes and is why line-height keeps being the wrong tool. It also
removes the last raw value in the type layer (`text-[10px]`).

*What it costs:* the largest conceptual addition — a second, parallel type family
rather than more steps in the existing one. Needs naming discipline and a
documented rule, or it becomes a dumping ground.

### Option D — change the Figma nodes instead of the ramp.

Restyle the 16 to the nearest existing step, accepting a weight change on the 10
semibold ones.

*Blast radius:* zero in code. In Figma, 16 nodes visibly lighten — semibold to
medium is a real change at 11 and 12px, precisely the sizes where weight carries
the most of the emphasis.

*What it costs:* it makes the file worse to satisfy the ramp. Avatar initials at
medium weight in a filled circle lose the contrast that made them legible. This
is the tail wagging the dog, and it is the same reasoning that rejected snapping
`opacity/75` to `opacity/80` earlier the same day.

---

## Recommendation

**Option C for the glyph family, then Option A for the remainder. Explicitly not
Option B, and not Option D.**

The reasoning turns on noticing that these 16 nodes are **not one problem**. Ten
of them are small semibold text, and it is tempting to read that as "the ramp
needs semibold steps at 11 and 12px". But look at what those ten nodes *are*:
avatar initials ×2, dropdown-trigger initials ×3, a checkbox mark ×3, a menu
label ×2. Eight of the ten are **single glyphs centred in a fixed box** — a
circle or a square — where line-height does no work at all except move the glyph
off centre. They are not small body text. They are marks.

That is why every attempt to fit them into the body ramp has produced an awkward
result: `Label/XS` + `font-semibold` for Avatar, a raw `text-[10px]` for
Checkbox, a leading mismatch for the Dropdown trigger. The ramp is a *reading*
scale — it pairs a size with the leading that makes wrapped prose readable — and
these nodes never wrap. Adding `-Strong` variants (Option B) would give them the
right weight while still imposing a reading leading on a glyph, which is
solving the visible half of the problem.

`Display/Centered` names the real distinction and gives it the one property it
needs: leading equal to size. It also has a clean adoption test, which Option B
does not — an author can always answer "is this a centred glyph in a fixed box?"
but cannot answer "is this label strong enough to be Label/SM-Strong?".

**The genuine exception is `Dropdown Menu / Label`** — 12/18 semibold, real prose,
a section heading in a menu. It wraps. It is not a glyph. Under this
recommendation it stays exactly as it is: `text-body-xs` + `font-semibold`, one
documented gate exception, because a single node does not justify a ramp step and
a weight override on an otherwise-exact metric match is the mildest possible
divergence.

**`Popover / Content`'s Title should be fixed in Figma, not in the ramp.** It is
15/22 Medium where the ramp has 15/22 Semi Bold — the metrics already match
exactly and only the weight differs. Every other title in the system is semibold.
This looks like a node that was never restyled rather than a deliberate lighter
title, and the cheapest correct answer is to bind it to `Heading/SM` and let it
gain the weight. That is a one-node change with no ramp implications, and it
would also close the largest remaining code/Figma divergence on the type axis —
code currently renders it `text-heading-xs`, snapping both a size and a weight.

### Suggested sequence, if this is taken up

1. **Bind `Popover / Content` Title to `Heading/SM`** — one node, no ramp change,
   closes a real divergence. Do this regardless of what happens to the rest.
2. **Decide whether `Display/Centered` is a family this system wants.** If no,
   stop here; Option A is a defensible permanent position and it is fully gated.
3. If yes, add `Display/XS` 11/11/600, `Display/SM` 12/12/600, `Display/MD`
   14/14/600, `Display/LG` 18/18/600, bind the glyph nodes, and delete the
   corresponding entries from `computed-type-exceptions.json` — the gate will
   tell you if you miss one, because a stale exception now fails.
4. **Leave `Dropdown Menu / Label` alone**, and leave the 15 spacers and
   annotations permanently out of scope.

## What this proposal does not do

It does not change the ramp, add a text style, or touch a Figma node. The ramp is
still the 14 steps Option B preserved. Nothing here is decided.

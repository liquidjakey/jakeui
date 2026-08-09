# Figma-side defects found during the live-binding audit

**Date:** 9 Aug 2026
**Method:** read directly from the file through the Desktop Bridge, not from
`.doc.json` records or `.figma-dump.json`.
**File:** `Jake's design system` (`ovnLtL9xbX8SG5xDw673Un`)

These are things the CODE cannot fix. Each one is a place where the file itself
is either untokenised or off-ramp, so "match Figma exactly" and "reference a
variable for every value" cannot both be satisfied until Figma changes.

---

## 1. Untokenised fill — Alert / Tone=Destructive

The variant carries a solid `#fdeae9` with **no bound variable**. Every other
tone binds a `*-muted` surface token.

`destructive-muted` does not exist in the `Jake UI` collection. It is the only
tone missing one.

**Fix:** add `destructive-muted` (light `red/50`, dark `red/950`, matching the
shape of `success-muted` / `warning-muted` / `info-muted`) and bind it.

**Until then:** `alert.tsx` leaves the destructive surface unfilled rather than
hardcoding the hex, so the most severe tone is the least visually distinct.

---

## 2. Unbound text — Card

None of Card's four text nodes carries a text style, and none of their metrics
exists in the 14-step ramp:

| Node | In Figma | Nearest ramp step |
|---|---|---|
| Title | 16 / 22 Semi Bold | `Heading/MD` 16/24 |
| Description | 14 / 21 Regular | `Body/MD` 14/20 |
| Label | 13 / 20 Medium | `Label/MD` 13/18 |
| Initials | 14 / 18 Semi Bold | `Heading/XS` 14/20 |

**Fix:** apply the text styles to all four nodes on all four variants.

**Until then:** `card.tsx` uses the nearest ramp step, so line-heights differ
from the file by 1–2px.

---

## 3. Unbound text — everywhere else

Unbound text turned out to be the single most common defect in the file. Full
list, with the ramp step used in code instead:

| Component / node | In Figma | Ramp step used |
|---|---|---|
| Button / Label (Small) | 13 / 20 Medium | `Label/MD` 13/18 |
| Button / Label (Medium) | 14 / 22 Medium | `Label/LG` 14/20 |
| Badge Small / Label | 11 / 14 Medium | `Label/XS` 11/16 |
| Alert / Glyph | 13 / 16 Semi Bold | `Value/Strong` 13/18 |
| Avatar / Initials (Small) | 11 / 14 Semi Bold | `Label/XS` + semibold |
| Avatar / Initials (Medium) | 14 / 18 Semi Bold | `Heading/XS` 14/20 |
| Avatar / Initials (Large) | 18 / 22 Semi Bold | `Heading/LG` 18/26 |
| Button Group / Label | 14 / 22 Medium | `Label/LG` 14/20 |
| Breadcrumb / all items | 13 / 20 Regular | `Body/SM` 13/18 |
| Breadcrumb / Current | 13 / 20 Medium | `Label/MD` 13/18 |
| Sheet / Description | 13 / 20 Regular | `Body/SM` 13/18 |
| Accordion / Content | 13 / 20 Regular | `Body/SM` 13/18 |
| Collapsible / Content | 13 / 20 Regular | `Body/SM` 13/18 |
| Calendar / day labels | 13 / 20 Medium | `Label/MD` 13/18 |
| Data Table / Description | 13 / 20 Regular | `Body/SM` 13/18 |
| Command / Icon | 14 Regular, no line-height | — |

**The pattern:** a 13/20 and a 14/22 pairing recur constantly. The ramp has
13/18 and 14/20. Either the ramp's leading is 2px too tight for real use, or
these nodes predate the text styles and were never restyled. That is a design
decision, not an implementation one — it needs your call.

Badge Medium correctly binds `Label/SM`, so at least some of these are oversight
rather than intent.

---

## 4. Half-rebind — Alert / Tone=Warning

Title binds `warning-muted-foreground`; **Description still binds `warning`**.
One of the two 3.07:1 nodes was fixed and the other was missed.

**Fix:** rebind the Warning description to `warning-muted-foreground`.

**Note:** `alert.tsx` already applies the accessible token to both and records
why. This is a pre-existing, deliberate divergence and it was left in place.

---

## 5. Disabled is visually identical to Default — Switch / Root, Radio Group / Item

Both bind exactly the same tokens for `State=Disabled` as for `State=Default`.
Nothing in the file distinguishes a disabled control from an operable one.

Figma's `Switch` set does bind `muted` on the disabled *track*, so the two sets
disagree with each other as well.

**Fix:** decide one disabled treatment and bind it on both.

---

## Records that were STALE, now corrected in code

Found by diffing the live bindings against `docs/components/*.doc.json`. These
are not Figma defects — the file was right and the record was old — but they had
each produced a real visual bug.

| Component | Record said | File actually binds | Visible effect |
|---|---|---|---|
| Badge / Success | `info-foreground` | `success-foreground` | near-white text vs near-black |
| Badge / Destructive | `destructive-foreground` (pattern-completed) | `card` | differs in both modes |
| Card / Title | `info-foreground`, `size/11` | `foreground`, 16px | title was 12px, should be 16px |
| Label | `Body/MD` | `Label/LG` | weight 400 vs 500 |
| Label / Required mark | no marker colour recorded | `destructive` | marker was untinted |
| Alert / Destructive | "no surface fill bound" | solid `#fdeae9` | see item 1 |
| Tabs / Density | "no spacing token recorded" | `space/1` / `space/0-75` | padding and gap were raw |

The pattern is consistent: **the `.doc.json` records are lossy and several are
stale.** `docs:adopt` will re-import the wrong values on the next run — these
corrections live in the component source and will need re-asserting, or the
records need regenerating from live bindings.

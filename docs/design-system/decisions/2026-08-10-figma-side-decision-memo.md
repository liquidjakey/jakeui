# Decision memo — the five Figma-side defects

**Date:** 10 Aug 2026
**Status:** ⏳ **Open. Nothing here is decided, and no Figma edit has been made.**
**Subject:** the five items in
[`findings/2026-08-09-figma-side-defects.md`](../findings/2026-08-09-figma-side-defects.md)
**Audience:** whoever owns the Figma file — every one of these needs a design call,
not an implementation one.

Each item below states the options, what each option costs, and a recommendation
with its reasoning. The recommendations are *arguments*, not resolutions; they are
here so the decision starts from a position rather than from a blank page.

Blast-radius figures are measured, not estimated. They come from
`npm run computed-type:explore`, which renders all 91 stories in headless Chrome and
counts what each element actually computes — 611 text-bearing elements in total.

---

## 1. The ramp question — 16 unbound text nodes sitting 2px looser than the ramp

**This is the load-bearing decision.** The other four are local; this one sets the
vertical rhythm of every screen built on the system, and it is the only item whose
resolution changes a generated token rather than a single binding.

### What was found

Sixteen text nodes across the file carry **no text style at all**. They are not
bound to a wrong step — they are bound to nothing, so their metrics are whatever
was typed on the node. Those metrics are not random. They cluster hard:

| Figma metrics | Nodes | Ramp step code uses instead | Ratio in file → ramp |
|---|---|---|---|
| **13 / 20** | 8 | `Body/SM` or `Label/MD` — both 13/18 | 1.54 → 1.38 |
| **14 / 22** | 2 | `Label/LG` 14/20 | 1.57 → 1.43 |
| 14 / 21 | 1 | `Body/MD` 14/20 | 1.50 → 1.43 |
| 16 / 22 | 1 | `Heading/MD` 16/24 | 1.38 → 1.50 |
| 11 / 14 | 2 | `Label/XS` 11/16 | 1.27 → 1.45 |
| 13 / 16 | 1 | `Value/Strong` 13/18 | 1.23 → 1.38 |
| 14 / 18 | 1 | `Heading/XS` 14/20 | 1.29 → 1.43 |
| 18 / 22 | 1 | `Heading/LG` 18/26 | 1.22 → 1.44 |

Card's four nodes (item 2 of the findings doc) are the same defect and are counted
in the tail above where they overlap.

The important reading: **the 13/20 and 14/22 cluster is 10 of the 16, and it runs
in one direction — looser than the ramp.** Both sit at a line-height ratio of
~1.54–1.57. The ramp's body and label steps sit at ~1.38–1.43. That is not noise
inside a tolerance; it is a consistent 2px, and it is the difference between a
fairly tight UI ramp and a comfortable one.

The tail runs the *other* way — the four semibold display nodes (16/22, 11/14,
14/18, 18/22) are **tighter** than the ramp, at ratios of 1.22–1.38. So the file
is not uniformly looser than the ramp. Body-ish text is looser; heading-ish and
initials text is tighter. That is the signature of nodes typed by hand at
different times, not of a deliberate alternative system.

### Why it cannot be split into "just match Figma"

The repo rule is *never hardcode a raw px where a token exists*. Matching an
unbound node exactly means either inventing a ramp step for it or writing a raw
line-height — the second is banned outright, and the first pushes a 14-step ramp
towards 20+ steps with no semantic name for the new ones. This is exactly why the
audit stopped at "flag it" and did not resolve it in code.

### The options

**Option A — Loosen the ramp. Rebind the nodes to it afterwards.**
Change `Body/SM` and `Label/MD` from 13/18 to 13/20, and `Label/LG` and `Body/MD`
from 14/20 to 14/22, in the Figma text styles. `tokens:sync` regenerates
`--leading-*` bindings and every component follows automatically.

*Blast radius — the largest of any option, and it is worth seeing the real numbers:*

| Ramp step | Rendered elements today | Under Option A |
|---|---|---|
| `body-sm` 13/18/400 | **218** | 13/20/400 |
| `label-lg` 14/20/500 | 92 | 14/22/500 |
| `body-md` 14/20/400 | 79 | 14/22/400 |
| `label-md` 13/18/500 | 54 | 13/20/500 |
| — | **443 of 611 measured elements (72%)** | shift by 2px each |

Every list row, table row, menu item, field label and body paragraph in the system
gets 2px taller. Dense surfaces — Table, Dropdown Menu, Sidebar, Command — grow
most, because they stack the most rows. A 12-row table gains 24px. No code
changes; the cost is entirely in re-checking that dense layouts still hold.

*What it buys:* 10 of the 16 defects disappear without touching the nodes at all,
because the ramp moves to where the nodes already are. It also moves the ramp to
ratios (1.54/1.57) that are conventional for UI body text; 1.38 is tight for
13px, and tight leading at small sizes is the most common readability complaint in
dense product UI.

**Option B — Keep the ramp. Apply the existing text styles to all 16 nodes.**
Figma changes, code does not.

*Blast radius:* zero in code — the components already use the ramp step, so the
rendered result is unchanged and the gate stays green. In Figma, 16 nodes across
~12 component sets get restyled, and every one of them visually tightens by 1–2px,
so each set needs a look. Anything a designer built on top of the current node
metrics reflows.

*What it buys:* the file becomes internally consistent and every node is bound,
which is the state the whole tokens layer assumes. Cheapest option by a wide
margin, and it is the only one that leaves the shipped product pixel-identical.

**Option C — Split the difference: add the missing steps to the ramp.**
Introduce `Body/SM-Relaxed` 13/20 and `Label/LG-Relaxed` 14/22 alongside the
existing steps and bind the unbound nodes to the new ones.

*Blast radius:* zero rendered change today. Cost is permanent and structural — the
ramp goes from 14 steps to 16, and every future component author faces a choice
between `body-sm` and `body-sm-relaxed` with no rule for picking. The computed-type
gate would accept both, so drift becomes invisible again.

**Option D — Leave it. Keep the flag.**
*Blast radius:* zero today. The 1–2px divergence stays permanent and undocumented
outside the findings doc, three components stay in
`scripts/computed-type-exceptions.json`, and every future Figma-vs-code comparison
re-discovers the same discrepancy.

### Recommendation

**Option B, with one carve-out — and explicitly not Option A, despite Option A
looking like the "the file is telling us something" answer.**

The reasoning turns on what the 16 nodes actually are. If all 16 pointed the same
way, they would be evidence that the ramp is wrong and real usage had drifted to a
better value. They do not: 10 are looser, 4 are tighter, and 2 are close. A set of
nodes that disagrees with the ramp *in both directions* is evidence of nodes typed
by hand at different times, not of a competing system worth adopting. The findings
doc already spotted the corroborating detail — **Badge Medium correctly binds
`Label/SM`** while Badge Small does not. Where a node was styled, it was styled to
the ramp. The unbound ones are oversights.

Option A also spends its blast radius in the wrong place. It moves 72% of rendered
text to satisfy 10 nodes, and it does so by trusting hand-typed values over the
styles someone deliberately defined. If the ramp's leading really is too tight for
dense UI, that is worth deciding **on its own merits, as a typography change with
its own review** — not inherited by accident from whichever nodes were never
styled.

*The carve-out:* the four semibold display nodes in the tail (Avatar Initials at
11/14, 14/18, 18/22 and Alert Glyph at 13/16) should not simply be snapped to the
nearest body step. They are single-line, centred, non-wrapping glyphs inside fixed
circular or square boxes, where line-height does nothing except shift the glyph off
centre — the ramp step is genuinely a poor fit and the tight value in the file is
the more correct one for the job. Worth deciding whether the system wants one
`Display/Centered` step with leading equal to its size, which would serve all four
and remove two of the three entries currently in the gate's exception list.

**If Option A is chosen anyway,** do it as a deliberate typography revision:
change all four steps together, re-render the dense surfaces (Table, Dropdown Menu,
Sidebar, Command, Data Table) and check them explicitly. The computed-type gate
will follow the new ramp automatically, since it parses `tokens/globals.css`
rather than hardcoding — but it will not tell you whether the result looks right,
only that code and tokens still agree.

---

## 2. Missing `destructive-muted` token — Alert / Tone=Destructive

**Found:** the variant carries a solid `#fdeae9` with no bound variable. Every
other tone binds a `*-muted` surface. `destructive` is the only tone in the
`Jake UI` collection without one.

**Options**

| | Change | Blast radius |
|---|---|---|
| **A** | Add `destructive-muted` (light `red/50`, dark `red/950`), bind it | 2 new variables + 1 binding. `alert.tsx` drops one flag and gains a fill. Nothing else references it. |
| **B** | Hardcode `#fdeae9` in code | Violates the repo's no-raw-hex rule; breaks dark mode outright, since the hex is a light-mode value with no dark counterpart |
| **C** | Reuse `destructive` at reduced opacity | No new token, but opacity-composited surfaces do not match the other three tones' flat fills, and the result differs over any non-white background |
| **D** | Leave the destructive surface unfilled (current state) | Zero cost. The most severe alert tone stays the least visually distinct — the opposite of the intent |

**Recommendation: A.** This is the cheapest item on the list and the only one with
no real trade-off. The token's shape is already fixed by the three tones that have
one, so there is no design question beyond picking the two ramp values, and the
`red/50` / `red/950` pair matches how `success-muted`, `warning-muted` and
`info-muted` are each built. The current state is a live accessibility-adjacent
bug: destructive is the tone that most needs to read as different at a glance, and
right now it reads as the plainest.

---

## 3. Switch contradicts itself — composed `Switch` vs atomic `Switch / Root`

**Found:** two coherent, incompatible specifications of the same control.

| | Track | Thumb | Thumb fill |
|---|---|---|---|
| Composed `Switch` | 40 × 22 | 18 × 18 | `primary-foreground` when checked |
| Atomic `Switch / Root` + `Switch / Thumb` | 36 × 20 | 16 × 16 | `card` in every state |

Both maintain a clean 2px inset, so neither is malformed. Code follows the atoms,
because that is what `figma.map.json` binds `SwitchRoot` and `SwitchThumb` to —
the repo's standing tie-break rule. This was initially resolved the other way and
reverted.

**Options**

| | Change | Blast radius |
|---|---|---|
| **A** | Make the composed set match the atoms (36 × 20 / 16 × 16 / `card`) | Figma-only. Code already correct, no change, gate unaffected. Any mock-up using the composed Switch shifts by 4 × 2px |
| **B** | Make the atoms match the composed set (40 × 22 / 18 × 18 / `primary-foreground`) | Code changes: `switch.tsx` track, thumb size and both translate distances; `Anatomy/Parts` and `Controls/Switch` stories re-render. Switch grows 11% wider, which shifts every settings-row layout it sits in |
| **C** | Keep both, document them as different components | Requires a real semantic difference to justify two switches. None is apparent — they are the same control drawn twice |

**Recommendation: A.** Not because the atoms are better — 40 × 22 is arguably the
more comfortable target — but because the atoms are what the file's own mapping
treats as canonical, and they are what ships today. Option B is the same visual
outcome as A plus a code change plus a layout reflow, bought for a 4px difference
nobody has complained about. The thumb *fill* is the part actually worth a
moment's thought: `card` in every state (atoms) versus `primary-foreground` when
checked (composed) are visually near-identical in light mode but can diverge in
dark, so whichever geometry wins, bind the fill deliberately rather than
inheriting it from the choice of set.

---

## 4. Half-rebind — Alert / Tone=Warning

**Found:** the accessibility pass that fixed two 3.07:1 nodes fixed one and missed
the other. Title binds `warning-muted-foreground`; **Description still binds
`warning`**.

**Options**

| | Change | Blast radius |
|---|---|---|
| **A** | Rebind the Warning description to `warning-muted-foreground` | One binding in Figma. Zero code change — `alert.tsx` already applies the accessible token to both and records why |
| **B** | Revert the title to `warning` for internal consistency | Restores a 3.07:1 contrast failure. Not viable |
| **C** | Leave it | The file keeps a known contrast failure, and `alert.tsx`'s deliberate divergence stays deliberate indefinitely |

**Recommendation: A**, and it should be the first of the five done. It is a
one-binding change, it has no code consequence, it finishes a remediation that was
already agreed and merely incomplete, and until it lands the file itself documents
a contrast failure that the code is quietly working around. Nothing about this one
needs a design decision — it needs someone in the file for thirty seconds.

⚠️ Note for whoever does it: `alert.tsx`'s divergence here is **deliberate and
recorded**. Do not "restore" the component to match the file's current state
first — the component is already at the intended end state, and item A brings
Figma to it.

---

## 5. Disabled is invisible — Switch / Root and Radio Group / Item

**Found:** both sets bind exactly the same tokens for `State=Disabled` as for
`State=Default`. Nothing in the file distinguishes a disabled control from an
operable one. The composed `Switch` set *does* bind `muted` on the disabled track,
so this overlaps item 3 — the two sets disagree here as well.

This is the only item of the five with a genuine accessibility dimension: a
control that looks operable and is not is a functional defect, not a cosmetic one.

**Options**

| | Change | Blast radius |
|---|---|---|
| **A** | Adopt the system's existing convention — `opacity-50`, which Checkbox, Input, Button and Field already use | 2 sets rebound in Figma; code already applies `opacity-50` on both, so zero code change. Consistent with 4 components that already ship it |
| **B** | Adopt `muted` on the track, following the composed `Switch` set | Introduces a second disabled idiom into a system that already has one. Radio Group has no track, so it needs a different treatment anyway — meaning two idioms, not one |
| **C** | Design a distinct disabled treatment for both | Most deliberate outcome, largest cost: a new token or pair, applied across every control for consistency, not just these two |
| **D** | Leave it | Disabled switches and radios stay indistinguishable from operable ones for sighted users. `aria-disabled` still carries it to assistive tech, so this is specifically a *visual* accessibility gap |

**Recommendation: A.** The system has already answered this question four times,
and `opacity-50` is the answer it gave. Adopting it here costs two bindings, needs
no new token, changes no code, and removes an inconsistency rather than adding
one. Option C is the better long-term answer only if someone is unhappy with
`opacity-50` generally — and if so, that is a system-wide decision about disabled
state that should not be taken two components at a time.

The one caveat worth recording: `opacity-50` on a control that is already low
contrast can push it under 3:1 against its background. Worth a spot check on
Switch's unchecked track (`input`) once bound, since that is the lowest-contrast
resting state of the two.

---

## Suggested order, if these are taken in sequence

Ordered by cost-to-value, not by item number:

1. **#4 Alert / Warning** — one binding, no decision required, finishes agreed work
2. **#2 `destructive-muted`** — two variables, no trade-off, fixes a live visual bug
3. **#5 disabled state** — two bindings, follows existing convention
4. **#3 Switch contradiction** — Figma-only under the recommendation, but confirm the thumb fill deliberately
5. **#1 the ramp** — last, because it is the only one that is genuinely a design
   decision rather than a cleanup, and the only one that should not be rushed

Items 1–4 above are all zero-code-change under their recommended options. Item 5 is
zero-code-change under Option B and touches 72% of rendered text under Option A.

## What this memo does not do

It does not change Figma, and it does not decide anything. It also deliberately
does **not** regenerate the `.doc.json` records — that work is blocked on these
decisions, since several records would re-import values that these items are still
deciding. See the handoff's open-work list.

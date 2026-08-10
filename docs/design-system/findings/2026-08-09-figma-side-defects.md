# Figma-side defects found during the live-binding audit

**Date:** 9 Aug 2026
**Method:** read directly from the file through the Desktop Bridge, not from
`.doc.json` records or `.figma-dump.json`.
**File:** `Jake's design system` (`ovnLtL9xbX8SG5xDw673Un`)

These are things the CODE cannot fix. Each one is a place where the file itself
is either untokenised or off-ramp, so "match Figma exactly" and "reference a
variable for every value" cannot both be satisfied until Figma changes.

> **Options and recommendations for all five now live in
> [`decisions/2026-08-10-figma-side-decision-memo.md`](../decisions/2026-08-10-figma-side-decision-memo.md)**
> — measured blast radius per option, a recommendation with its reasoning, and a
> suggested order. Nothing there is decided; this document stays the record of
> what was *found*, and the memo is the record of what the choices *are*.

---

## 1. Untokenised fill — Alert / Tone=Destructive ✅ RESOLVED 10 Aug 2026

The variant carried a solid `#fdeae9` with **no bound variable**. Every other
tone binds a `*-muted` surface token.

`destructive-muted` did not exist in the `Jake UI` collection. It was the only
tone missing one.

**Applied:** `red/50` (`#fef2f2`) and `red/950` (`#460809`) added to
`Color Primitives`, `destructive-muted` added to `Jake UI` aliasing them per
mode, and `Alert / Tone=Destructive`'s surface rebound to it. `alert.tsx` now
binds `bg-destructive-muted` and the "left unfilled" workaround is gone.

**Verified** by computed style in both themes — destructive now sits in exactly
the same shape as the other three tones:

| Tone | Light | Dark |
|---|---|---|
| info | `rgb(239,246,255)` | `rgb(25,60,184)` |
| success | `rgb(240,253,244)` | `rgb(5,46,22)` |
| warning | `rgb(255,251,235)` | `rgb(69,26,3)` |
| **destructive** | **`rgb(254,242,242)`** | **`rgb(70,8,9)`** |

⚠️ **Light mode moved `#fdeae9` → `#fef2f2`.** The primitive ramp is
demonstrably Tailwind v4 — `green/50`, `amber/50`, `blue/50`, `red/600` and
`red/400` all reproduce exactly from Tailwind's OKLCH definitions — so a
primitive named `red/50` had to be Tailwind's `red-50` rather than the
hand-typed value, or the one rule the ramp follows would break. The shift is 1/8/9
per channel and imperceptible in use.

⚠️ **Still asymmetric, deliberately out of scope:** the other three tones each
have a `*-muted-foreground` as well; destructive has none, so its title and
description still bind full-strength `destructive` rather than a muted
foreground. `info` is in the same position. Only `destructive-muted` was
approved — the foreground pair is a separate decision.

---

## 2. Unbound text — Card ✅ RESOLVED 10 Aug 2026

None of Card's four text nodes carried a text style, and none of their metrics
existed in the 14-step ramp:

| Node | Was | Now bound to |
|---|---|---|
| Title | 16 / 22 Semi Bold | `Heading/MD` 16/24 |
| Description | 14 / 21 Regular | `Body/MD` 14/20 |
| Label | 13 / 20 Medium | `Label/MD` 13/18 (via the Button instance it embeds) |
| Initials | 14 / 18 Semi Bold | `Heading/XS` 14/20 (via the Avatar instance) |

**Applied** as part of the file-wide pass in item 3. `card.tsx` already used
these steps, so the file has caught up to the code and the 1–2px divergence is
gone. Verified by screenshot — the card set renders with no clipping or reflow.

---

## 3. Unbound text — everywhere else ✅ RESOLVED 10 Aug 2026 (Option B)

**Decision taken: Option B — the ramp stays as it is, and the nodes were bound
to it.** The ramp's 13/18 and 14/20 were not loosened to the 13/20 and 14/22 the
unbound nodes were sitting at.

### What was actually there

The original list below counted 16 nodes. A fresh scan on 10 Aug found the
problem was **an order of magnitude larger**: **469 unbound text nodes**, across
66 distinct (component, node, size, line-height, weight) signatures. The
original pass had listed distinct *components*, not nodes, and had missed
several sets entirely — `Popover / Content`, `Popover / Viewport`,
`Radio Group / Root`, `Switch / Field Composition` and the three Root
Compositions among them.

### What was applied

Excluding nodes inside instances — those inherit from their main component and
would only have gained overrides — there were **962 source text nodes**, of
which 697 were already bound. The pass bound **265 more**, by this rule:

> bind the ramp step whose **size and weight both match** the node; where two
> steps share a size and weight, take the one whose line-height is closest, so a
> node already sitting exactly on a step (12/18 → `Body/XS`) binds to that step
> rather than to its sibling (`Caption/SM` 12/16).

**931 of 962 source text nodes are now bound**, up from 697. Zero failures.

| Component | Was | Now | Nodes |
|---|---|---|---|
| Button / Label (Small) | 13/20 Medium | `Label/MD` 13/18 | 16 |
| Button / Label (Medium) | 14/22 Medium | `Label/LG` 14/20 | 16 |
| Radio Group / Root — Option label | 13/19 Medium | `Label/MD` 13/18 | 72 |
| Popover / Content — Action | 11/17 Medium | `Label/XS` 11/16 | 48 |
| Switch + Radio Field Compositions — labels | 13/19 Medium | `Label/MD` 13/18 | 21 |
| Popover / Viewport — Direction, State | 11/17 | `Label/XS`, `Caption/XS` | 16 |
| Breadcrumb — all items + Current | 13/20 | `Body/SM`, `Label/MD` | 9 |
| Accordion + Collapsible — Content | 13/20 Regular | `Body/SM` 13/18 | 8 |
| Sidebar — Mark, Glyph | 14/18, 13/16 Semi Bold | `Heading/XS`, `Value/Strong` | 8 |
| Badge — Label | 11/14 Medium | `Label/XS` 11/16 | 5 |
| Card — Title, Description | 16/22, 14/21 | `Heading/MD`, `Body/MD` | 8 |
| Avatar — Initials (Med, Large) | 14/18, 18/22 Semi Bold | `Heading/XS`, `Heading/LG` | 4 |
| Alert — Glyph | 13/16 Semi Bold | `Value/Strong` 13/18 | 1 |
| Data Table, Sheet, Popover — descriptions | 13/20 Regular | `Body/SM` 13/18 | 14 |
| Table / Head, Popover / Trigger — labels | 12/18 Medium | `Label/SM` 12/16 | 8 |
| …and 19 further signatures | | | |

**No code changed.** Every one of these was already using the ramp step in code,
which is the whole point of Option B: the file moved to the code, not the
reverse. Verified by screenshot on Card, Alert and Avatar — no clipping, no
reflow, and Avatar's initials stay centred despite +2 and +4px of leading,
because the boxes centre in auto-layout.

### The 31 nodes still unbound, and why

| Component / node | Metrics | Why it was skipped |
|---|---|---|
| `Dropdown Menu / Checkbox Item`, `/ Radio Item` — Spacer | 1/1 | Not prose — a 1px layout spacer |
| `Avatar` — Initials (Small) | 11/14 Semi Bold | No 11px semibold step exists |
| `Dropdown Menu / Label` — Label | 12/18 Semi Bold | No 12px semibold step exists |
| `Dropdown Menu / Trigger` — Initials | 12/16 Semi Bold | No 12px semibold step exists |
| `Checkbox` — Mark | 12/14 Semi Bold | No 12px semibold step exists |
| `Popover` — Title | 15/22 Medium | `Heading/SM` is 15/22 but **Semi Bold** |
| `Table / Container` — Guidance | 10/16 Regular | No 10px step exists at all |

Every one is a **weight or size the ramp does not carry**. Binding them would
mean either changing the node's weight to fit a step — a visible change nobody
asked for — or adding steps, which is the ramp expansion Option B declined.
They are the residue of the decision, not an oversight, and they are exactly the
set the decision memo's carve-out predicted.

These are also why three entries remain in
`scripts/computed-type-exceptions.json`: `Avatar`, `Dropdown Menu / Label` and
`Checkbox` compose a ramp step with a weight override in code precisely because
the file has no step for them.

---

<details>
<summary>The original (incomplete) list, kept for the record</summary>

Full list as first recorded, with the ramp step used in code instead:

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

</details>

---

## 4. Half-rebind — Alert / Tone=Warning ✅ RESOLVED 10 Aug 2026

Title bound `warning-muted-foreground`; **Description still bound `warning`**.
One of the two 3.07:1 nodes was fixed and the other was missed.

**Applied:** the Warning description now binds `warning-muted-foreground`.
Re-read confirms Title and Description both resolve to it, and the node's colour
moved from `rgb(217,119,6)` to `rgb(180,83,9)` — the accessible value.

**No code change.** `alert.tsx` already applied the accessible token to both and
recorded why; the file has now caught up to the code, so the deliberate
divergence is simply gone. Only the source comment changed.

The Icon chip correctly still binds full-strength `warning` — it is a filled
circle carrying a `card` glyph, not text, so the muted foreground would be wrong
there.

---

## 4b. Switch contradicted itself — composed set vs atoms ✅ RESOLVED 10 Aug 2026

Two coherent, incompatible specifications of the same control:

| | Track | Thumb | Thumb fill |
|---|---|---|---|
| Composed `Switch` | 40 × 22 | 18 × 18 | `primary-foreground` when checked |
| Atomic `Switch / Root` + `Switch / Thumb` | 36 × 20 | 16 × 16 | `card` in every state |

**Applied:** the composed set was rebuilt onto the atoms — all six variants now
36 × 20 with a 16 × 16 thumb at a 2px inset, and the checked thumb fill rebound
`primary-foreground` → `card`. The atoms won because that is what
`figma.map.json` binds `SwitchRoot` and `SwitchThumb` to, which is the repo's
standing tie-break.

**No code change.** `switch.tsx` already followed the atoms; only its comment
changed. Verified by re-read and by screenshot — the composed set now renders
white thumbs in every state at the atomic size.

⚠️ **One divergence deliberately left:** the composed set's `State=Disabled`
binds `muted` on the track and `muted-foreground` on the label, where the atomic
Root keeps `input`/`primary` and applies `opacity/50`. Reconciling that is a
colour decision rather than a geometry one, and only the geometry and thumb fill
were approved.

---

## 5. ~~Disabled is visually identical to Default~~ ❌ NOT A DEFECT — the original finding was wrong

**This item was withdrawn on 10 Aug 2026 without any change being made, because
re-reading the file showed the premise was false.**

The original finding said both sets "bind exactly the same tokens for
`State=Disabled` as for `State=Default`", and concluded nothing distinguishes a
disabled control from an operable one. The first half is true and the conclusion
does not follow. The disabled treatment is not a COLOUR binding — it is an
**opacity** binding, which the original pass did not look at:

| Set | `State=Default` | `State=Disabled` | `State=ReadOnly` |
|---|---|---|---|
| `Switch / Root` (all 8 size×value combinations) | opacity 1 | **`opacity/50`** | `opacity/80` |
| `Radio Group / Item` (both values) | opacity 1 | **`opacity/50`** | `opacity/80` |
| `Radio Group / Indicator` | opacity 1 | **`opacity/50`** | — |

Every disabled variant already binds `opacity/50`, which is exactly the
convention the recommendation was going to introduce, and exactly what
`switch.tsx` and `radio-group.tsx` already apply. A screenshot of the
`Switch / Root` set confirms it visually: the disabled variants are visibly
faded and the read-only ones sit between faded and full.

**Nothing was bound, because nothing needed binding.** The system and the file
already agreed.

### Two real findings that came out of checking this

**5a. `Switch / Thumb` disabled carries a RAW 0.75 opacity.** Both
`Size=Small, State=Disabled` and `Size=Default, State=Disabled` set opacity to
0.75 with **no variable bound** — and no `opacity/75` exists in the Interaction
collection, so there is nothing to bind it to. Resolving it means either adding
`opacity/75` or moving the thumb to `opacity/80`; both are decisions, so it is
flagged rather than fixed.

**5b. Code renders ReadOnly at 50% where Figma binds 80%.** `switch.tsx` and
`radio-group.tsx` both apply `opacity-50` to `disabled || readOnly` in one
expression. Figma distinguishes them — `opacity/50` vs `opacity/80` — so a
read-only switch currently renders more faded in code than in the file. Left
alone: this is a component-code change, and this pass was scoped to Figma.

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

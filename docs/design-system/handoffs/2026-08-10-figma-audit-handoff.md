# Handoff — live Figma binding audit

**Date:** 10 Aug 2026
**Branch:** `fix/figma-live-binding-audit` (3 commits, nothing pushed)
**Baseline:** `1b20ac4` → HEAD `b351ab0`
**State:** working tree clean, `npm run check` passes

---

## What prompted this

Storybook was started for the first time in a while and the components "did not
match Figma" and the "interactions looked wacky". Both turned out to be true, and
both had a single systemic cause rather than many small ones.

## The two systemic defects (fixed, commit `5da9241`)

**1. `tailwind-merge` was deleting typography.** Stock twMerge only knows
Tailwind's own `text-*` sizes; every other `text-*` it classifies as a
text-COLOUR. The 14 custom ramp steps were therefore put in the same conflict
group as colour utilities, and twMerge resolves a conflict by keeping the last
class only:

```
text-body-md    + text-primary-foreground -> text-primary-foreground
text-heading-md + text-foreground         -> text-foreground
```

Typography was silently dropped at runtime and text fell back to the browser
default 16px/24px. **38 components, 130 class occurrences.** Fixed by registering
the ramp under `font-size` in `lib/cn.ts`.

**Why nothing caught it:** `map:check`, `docs:check` and `props-table-check` all
compare NAMES. Nothing in the repo looks at computed output. This is the single
most important lesson from the session.

**2. Inter was never loaded.** `--font-sans` asked for it; no `@font-face` ever
declared it. It only looked right because Inter is installed on this Mac. Now
self-hosted via `@fontsource/inter` at weights 400/500/600/700 — the static
package, because it declares the family as plain `Inter`, matching the generated
font stack so `tokens/globals.css` needs no change.

## Verified correct, left alone

- **All 49 semantic colour tokens** — light and dark, alias-for-alias identical.
- **All 14 type ramp steps** — size, line-height and weight.
- **Every dimension, spacing, radius, stroke, opacity, duration, easing.**

The foundation was sound. Every defect was a component binding the wrong token.

## Components (commit `b351ab0`)

49 sets audited against live bindings via the Desktop Bridge, 36 corrected.
Largest error: **Card's title was 12px where Figma is 16px.**

**The `.doc.json` records are stale and several were wrong in visible ways:**

| Component | Record said | File binds |
|---|---|---|
| Badge / Success | `info-foreground` | `success-foreground` (near-white vs near-black) |
| Badge / Destructive | `destructive-foreground` (invented) | `card` |
| Card / Title | `info-foreground`, `size/11` | `foreground`, 16px |
| Label | `Body/MD` | `Label/LG`; required mark binds `destructive` |
| Dialog / Title | "Standard size/18, Form size/13" | `Heading/LG` on BOTH |
| Tabs / Density | "no spacing token recorded" | `space/1` / `space/0-75` |

**`npm run docs:adopt` will re-import the wrong values over these corrections.**
Right now only source comments protect them. This is the top open risk.

## Motion (commit `803eb57`)

Figma's `Interaction` collection was always exported to `globals.css` and used by
**nothing**. `lib/motion.ts` now binds the variables (deliberately not Tailwind's
coincidentally-equal defaults). 25 components adopted; zero hardcoded transitions
remain. Static components correctly have none; the modal family inherits
`MOTION.overlay` through `ModalSurface`.

**`MOTION.disclosure` ships unused on purpose.** Accordion and Collapsible unmount
their panel when closed per a recorded a11y contract, and a transition cannot
animate a non-existent element. The `grid-template-rows: 0fr -> 1fr` technique was
tried with `aria-hidden` + `inert` preserving the contract, and **measured as
broken in Chrome**: an opened panel settled at 0px against 32px of content,
because an animating `fr` row interpolates against zero free space in an
auto-height grid. Forcing `1fr` with the transition OFF resolved to 32px, which
isolates it to the animation. Reverted rather than shipped. Route out is
`calc-size()` / `interpolate-size: allow-keywords`.

## Figma-side defects — code cannot fix these

Full detail in `findings/2026-08-09-figma-side-defects.md`. Summary:

1. **`Alert / Destructive` carries an untokenised `#fdeae9`.** No
   `destructive-muted` token exists; it is the only tone missing one.
2. **16 text nodes carry no text style**, and their metrics cluster on **13/20 and
   14/22** where the ramp has 13/18 and 14/20. Code uses the ramp step, so those
   sit 2px tighter than the file. **This is the biggest open design question.**
3. **Figma contradicts itself on Switch.** Composed `Switch` = 40x22 track with an
   18x18 `primary-foreground` thumb; atomic `Switch / Root` + `Switch / Thumb` =
   36x20 with a 16x16 `card` thumb. Both internally coherent. **The atoms won**,
   because that is what `figma.map.json` binds those exports to. This was
   initially got wrong in the other direction and reverted.
4. `Alert / Warning` is half-rebound (title fixed, description not).
5. `Switch / Root` and `Radio Group / Item` bind disabled identically to default.

## Hard-won constraints — read before editing

- `tokens/globals.css` is **generated**. Never hand-edit; change
  `scripts/export-tokens.mjs`. A gate fails if it drifts.
- Never hardcode a hex or raw px where a token exists. If Figma has none, flag it
  rather than invent one.
- When Figma contradicts itself, **the set `figma.map.json` binds the export to
  wins**, and the conflict gets documented.
- **Verify by measuring computed style in the browser**, never by reading source.
  Every real finding this session came from measurement.
- Never put `{/* JSX comment */}` in a ternary or map-return position — it breaks
  the build. Use a `//` comment above. (This broke the build four times.)
- Do not "fix" a deliberate documented divergence without reading its rationale
  first — several exist and are correct.

## Where the context lives in code

- `lib/cn.ts` — the twMerge root-cause write-up
- `lib/motion.ts` — why the tokens exist, why `disclosure` is unused
- `components/accordion.tsx` — the disclosure animation investigation
- `components/switch.tsx` — the Figma self-contradiction
- Each corrected component states what the file binds vs what the record said

## Open work

See the goal command in the session that produced this document, or the five
items below:

1. ~~Commit~~ — done, this branch.
2. **Regenerate `.doc.json` from live bindings** so `docs:adopt` stops being a
   time bomb.
3. **Add a gate that checks computed output**, not names. Highest leverage.
4. **Decision memo** for the five Figma-side items (do not decide them).
5. **Split the grab-bag story files** — Skeleton and DatePicker currently sit
   under `Controls/Slider`. Coverage is 56/56 exports; preserve it exactly.

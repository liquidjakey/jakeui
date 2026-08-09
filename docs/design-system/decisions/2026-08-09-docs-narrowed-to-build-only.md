# Docs narrowed to build-only content

**Date:** 9 Aug 2026
**Status:** Done

## Decision

`docs/` contains only what an agent needs to build a component. Everything else moved
to `notes/`. The bkit-style `docs/02-design/` path became a flat `docs/`.

## Why

Two concrete hazards, not a tidiness preference.

**1. The docs taught token names that do not exist.** `props-table-format.md`'s worked
example documented `--color-surface-card`, `--color-text-muted`,
`--color-feedback-error-base`, `--color-border-default` and `--color-text-disabled`.
All five were checked against `tokens/globals.css`: **zero exist.** They were CRRT's
tokens, copied in when the format was derived from that file. An agent following that
example would emit code binding nothing.

**2. A doc carried an instruction that had already been reversed.**
`description-standard.md` said the 26 "exception tokens" keep a special note and are
*excluded from regeneration*. That instruction was reversed on 9 Aug — 24 of them carry
4,814 live bindings and `size/13` + `line-height/18` are `Label/MD` and `Body/SM`.
Following the stale doc would have re-flagged the two most-used text styles in the
library as deletable.

Secondary: the `02-design` prefix is bkit's PDCA numbering (`00-pm`/`01-plan`/`02-design`).
In a standalone published repo it reads as though docs 00 and 01 are missing.

## What moved

| To `notes/` | Why it is not build documentation |
|---|---|
| `crrt-benchmark.md` | Analysis of another design system. Its token names are not ours. |
| `audit-2026-08-08.md` | Point-in-time snapshot, drifted (178 vars / 55 pages / 74 sets vs. actual 180 / 58 / 75). Superseded by `design-system.json`. |
| `figma-cleanup-backlog.md` | Figma-side design work (450 drift nodes, 6 primitives, 29 spacer hacks). Does not block writing code. |

Kept and defended: `state-decomposition.md` (the validator checks against it),
`props-table-format.md`, `tokens/color.md`, `tokens/typography.md`, `components/input.md`.

## Consequences

- 74 Figma component descriptions referenced `docs/02-design/state-decomposition.md` and
  were repointed. Verified 0 stale references remain across component sets, components,
  variables, text styles, effect styles and paint styles.
- `validate-map.mjs`, `export-tokens.mjs` and `globals.css` all carried the old path.
  `globals.css` is generated, so it was regenerated rather than hand-edited — the
  `tokens:check` gate caught it, which is the gate working as designed.
- CRRT references in `docs/`: 28 → 0 substantive (one signpost pointing at `notes/`).

## Alternative rejected

Keeping `description-standard.md` in place and only relabelling it. Rejected because the
CRRT token names would still sit in the build path, where the failure mode is silent —
an agent emits a class that resolves to nothing and no gate catches it.

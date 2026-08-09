# Jake UI — design system

Figma is the design authority for component intent and tokens. This directory is the implementation authority: the token export, the icon map, and the Figma↔code binding.

## Why there is no Code Connect

Figma Code Connect needs a Dev or Full seat on an Org/Enterprise plan. This account has neither, so the binding cannot be automated by Figma. `figma.map.json` does the same job by hand, and `validate-map.mjs` enforces it in CI.

## Layout

```
design-system/
  tokens/globals.css        Tailwind v4 + shadcn token export (GENERATED — never hand-edit)
  tokens/annotations.json   Hand-written prose injected into globals.css
  icons/phosphor-map.ts     52 icons -> @phosphor-icons/react (generated)
  figma.map.json            The Code Connect substitute (generated, then hand-edited)
  .figma-dump.json          Raw component dump the map generator reads
  .figma-tokens-dump.json   Raw token dump the token generator reads
  scripts/figma-token-query.js  Runs in Figma -> token dump
  scripts/export-tokens.mjs     Token dump -> globals.css   (+ --check CI gate)
  scripts/generate-map.mjs      Component dump -> manifest
  scripts/validate-map.mjs      CI gate
  docs/02-design/               Format specs, per-component tables, the audit
```

## Scripts

```bash
npm run tokens:sync    # dump -> tokens/globals.css
npm run tokens:check   # fail if globals.css is hand-edited or the dump is stale
npm run map:sync       # dump -> figma.map.json
npm run map:check      # fail if the map and the docs disagree
npm run check          # both gates — this is the CI entry point
```

Two generators, same shape: query inside Figma (the Variables REST API is
Enterprise-only and this account is not), commit the dump, transform with Node,
gate in CI.

Docs live in `docs/02-design/` (moved under this directory 9 Aug 2026 so the
repo is self-contained):
- `props-table-format.md` — the four-table format every component must document
- `state-decomposition.md` — Table 2 for all 23 conflated sets
- `components/input.md` — worked example
- `design-system-audit.md` — current readiness

## Install

```bash
npm i @phosphor-icons/react   # ^2.1.10
```

Import `tokens/globals.css` once at the app root.

## Icons

Figma variant names are Phosphor component names. There is no translation layer.

```tsx
import { MagnifyingGlass, SidebarSimple } from '@phosphor-icons/react';

<Input leadingIcon={<MagnifyingGlass size={16} />} />

// Figma "SidebarSimpleRight" is a mirrored SidebarSimple
<SidebarSimple size={16} mirrored />
```

Icons inherit `currentColor`. In Figma the equivalent binding is the `foreground` variable.

`LEGACY_ALIASES` in `phosphor-map.ts` maps the pre-migration names (`Add`, `Close`, `Search`) to Phosphor names. It exists for codemods only — do not use it in application code.

## The one rule that matters

A Figma variant axis is mutually exclusive. Runtime state is not.

Twenty-three components encode co-occurring states — `disabled`, `invalid`, `readOnly`, `:hover`, `:focus-visible` — as a single `State` enum. **Never emit that enum as a prop.** A field can be disabled *and* invalid; the enum cannot say so.

`docs/02-design/state-decomposition.md` gives the split for every one. The validator fails the build if a `decompose` entry acquires a `type`.

## Workflow

Adding or changing a component:

1. Update the Figma master.
2. Refresh `.figma-dump.json` (see the header of `generate-map.mjs`).
3. `node design-system/scripts/generate-map.mjs`
4. Write the four tables in `docs/02-design/components/<slug>.md`.
5. Implement, then set `codePath` and `codeExport` in `figma.map.json`.
6. `node design-system/scripts/validate-map.mjs`

Step 6 belongs in CI.

## Changing tokens

1. Change the value in Figma.
2. Run `scripts/figma-token-query.js` through the Figma Desktop Bridge plugin.
3. Save its output to `.figma-tokens-dump.json`.
4. `node design-system/scripts/export-tokens.mjs`

To change a *comment* rather than a value, edit `tokens/annotations.json` and
re-run step 4. Never edit `tokens/globals.css` — it is overwritten every run.

`node design-system/scripts/export-tokens.mjs --check` exits non-zero if
`globals.css` has been hand-edited or the dump is stale. It belongs in CI
alongside `validate-map.mjs`.

## Half-step ramp members (formerly "exception tokens")

Twenty-six tokens were once flagged as sitting off the primary ramp — odd type
sizes, line heights, spacings and radii — and were marked *"reconcile to the
ramp, then delete."*

**That instruction was wrong and has been reversed (9 Aug 2026.)** A binding
census across all 58 pages found **4,814 live bindings across 24 of the 26**.
`size/13` (1,345) and `line-height/18` (1,359) together are 13/18 — `Label/MD`
and `Body/SM`, the two most-used text styles in the library. They were never
anomalies; the ramp was incomplete.

The 24 are first-class ramp members. Do not delete them, and do not snap them
to a coarser step without a visual review. `size/20` and `line-height/12` had
zero bindings and were deleted.

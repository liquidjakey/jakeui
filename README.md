# Jake UI — design system

Figma is the design authority for component intent and tokens. This directory is the implementation authority: the token export, the icon map, and the Figma↔code binding.

## Why there is no Code Connect

Figma Code Connect needs a Dev or Full seat on an Org/Enterprise plan. This account has neither, so the binding cannot be automated by Figma. `figma.map.json` does the same job by hand, and `validate-map.mjs` enforces it in CI.

## Layout

```
design-system/
  components/               React components. index.ts is the public barrel.
  lib/cn.ts                 Class-name joiner
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
  scripts/computed-type-check.mjs      CI gate — measures the BROWSER, not the source
  scripts/computed-type-exceptions.json  Documented off-ramp divergences, with reasons
  scripts/lib/type-ramp.mjs     Parses the 14-step ramp out of the generated CSS
  docs/                     Build documentation — start at docs/README.md
  notes/                    Historical working notes (do not build from these)
```

## Scripts

```bash
npm run tokens:sync    # dump -> tokens/globals.css
npm run tokens:check   # fail if globals.css is hand-edited or the dump is stale
npm run map:sync       # dump -> figma.map.json (preserves hand-set codePaths)
npm run map:check      # fail if the map and the docs disagree
npm run typecheck      # tsc --noEmit over components/, lib/, icons/
npm run computed-type:check    # render every story, measure what the BROWSER computes
npm run computed-type:explore  # same pass, but dump the metric distribution instead
npm run check          # every gate — this is the CI entry point
```

### The one gate that does not read source

`tokens:check`, `map:check`, `docs:check` and `props-table-check` all compare
NAMES. That is a real blind spot, and it cost a full audit to find: a
`tailwind-merge` misconfiguration classified the custom type ramp as text-COLOUR
utilities, so `cn('text-label-lg', 'text-primary-foreground')` returned only the
colour and the typography was **deleted from the DOM** in 38 components and 130
class occurrences. Every name-based gate stayed green throughout, because the
source was correct — only the rendered output was wrong.

`computed-type:check` closes that hole. It builds Storybook, renders all 91
stories in headless Chrome, and asserts that every element which renders text
computes to a font-size/line-height/font-weight triple that exists in the 14-step
ramp — parsed from the generated `tokens/globals.css`, never hardcoded. It also
asserts Inter genuinely loads at all four weights, which was the second defect
found the same day. See the header of `scripts/computed-type-check.mjs` for why it
asserts the converse of the obvious thing.

Two generators, same shape: query inside Figma (the Variables REST API is
Enterprise-only and this account is not), commit the dump, transform with Node,
gate in CI.

## Docs

`docs/` holds exactly what is needed to build a component, and nothing else.
**Start at [`docs/README.md`](./docs/README.md)** — it gives the reading order.

- `props-table-format.md` — the four-table format every component must document
- `components/input.md` — the worked example, real tokens read from the live file
- `state-decomposition.md` — Table 2 for all 23 conflated sets; the binding contract
- `tokens/color.md` — which color token to bind, plus the open contrast constraints
- `tokens/typography.md` — the 14-style ramp and its Tailwind utilities
- `figma-descriptions.md` — the format of the descriptions an agent reads via MCP

`notes/` holds historical material — the CRRT benchmark the format was derived from,
the 8 Aug audit snapshot, and the Figma-side cleanup backlog. **Its token names and
counts are not current; do not build from it.** Current project state lives in
`design-system.json`.

## Install

```bash
npm i react @phosphor-icons/react   # react ^18 || ^19 · phosphor ^2.1.10
```

Import `tokens/globals.css` once at the app root.

```tsx
import { Input } from 'jakeui';
import { MagnifyingGlass } from '@phosphor-icons/react';

<Input
  value={q}
  onChange={(e) => setQ(e.target.value)}
  placeholder="Search patients"
  leadingIcon={<MagnifyingGlass size={16} />}
/>
```

## Components

**1 of 74 implemented.** `Input` is the worked example that closes the loop from
Figma variable to typed React prop; the rest are repetition of the same four steps.

| Component | Code | Props table |
|---|---|---|
| `Input` | [`components/input.tsx`](./components/input.tsx) | [`docs/components/input.md`](./docs/components/input.md) |

`npm run map:check` reports how many are mapped, and warns for every one that
isn't.

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

`docs/state-decomposition.md` gives the split for every one. The validator fails the build if a `decompose` entry acquires a `type`.

## Workflow

Adding or changing a component:

1. Update the Figma master.
2. Refresh `.figma-dump.json` (see the header of `generate-map.mjs`).
3. `node design-system/scripts/generate-map.mjs`
4. Write the four tables in `docs/components/<slug>.md`.
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

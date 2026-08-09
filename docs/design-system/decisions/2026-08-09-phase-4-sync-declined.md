# Phase 4 (sync) declined — keep export-tokens.mjs

**Date:** 9 Aug 2026
**Phase:** retrofit `sync` (Phase 4 of 7)
**Status:** Deliberately not adopted. Useful parts ported instead.

## Decision

`token-sync-layer` is **not** being adopted. `scripts/export-tokens.mjs` stays as the
token pipeline. This is a considered decline, not an oversight.

## Why

Phase 4 would install a DTCG intermediate plus Style Dictionary v4 in
`packages/tokens/`, which requires converting this single-package repo to a monorepo.
That replaces working, CI-gated infrastructure — and it would **not** remove the
query-in-Figma step, because that exists for a reason no tooling change fixes: the
Figma Variables REST API is Enterprise-only on this plan.

Four of the skill's hard rules are already satisfied, verified rather than assumed:

| Requirement | Status |
|---|---|
| Round float32 at the export boundary (guardrail 2) | ✅ `0.05000000074505806` → `0.05` |
| Never flatten semantic→primitive references | ✅ `--primary: var(--color-blue-700)` |
| Never allow hand-edited generated files | ✅ `--check` CI gate |
| Reviewable, diffable change | ✅ committed dump + git diff |

## What Phase 4 would have given us, and what we did instead

**Rename detection** — the skill calls a silent rename "the worst failure mode," and
the exporter genuinely lacks it: a rename appears as a delete plus an add. Git shows it
in the diff, but nothing flags *"`bg-default` probably became `surface-default`."*
**Deferred, not dismissed.** With one component and no consuming application the blast
radius is near zero; at twenty components it is not. Revisit before building components
in bulk.

**Multi-platform adapters** — only web is targeted. Build the adapter layer the day iOS
or React Native is real.

**Channel-alpha for colours** — the skill says emit `rgb(var(--x) / <alpha-value>)`
rather than a baked `#ffffff1a`, so Tailwind `/opacity` survives. That rationale is
largely Tailwind v3-era; v4 applies `/50` to any colour via `color-mix`. The real
residual issue is subtler: `#ffffff1a` is *already* translucent, so `bg-white-10/50`
compounds alpha rather than setting it. Worth fixing when there is a consumer; not now.

**The opacity rule — ported immediately, because it exposed a live bug.** See below.

## The bug Phase 4's rules exposed

`opacity/*` variables were stored on a **0–1 scale** (`opacity/5 = 0.05`). Figma treats
a variable bound to a node's `opacity` field as a **0–100 percentage and divides by
100**. So every one of the **120 bindings** rendered at 1/100th of its intended value:

| Variable | Was stored | Figma rendered |
|---|---|---|
| `opacity/5` | 0.05 | 0.0005 |
| `opacity/50` | 0.5 | 0.005 |
| `opacity/100` | 1 | 0.01 |

The `↳ Interaction` page's opacity ramp was labelled 0%–100% while every swatch,
including the one marked 100%, rendered essentially invisible. Confirmed by screenshot,
not just by arithmetic.

**The CSS was accidentally correct.** `export-tokens.mjs` passed the value straight
through, so `--opacity-5: 0.05` was right for CSS. Only Figma was wrong — which makes
this a **matched pair**: fix one side alone and you break the side that worked.

### The fix, both halves together

1. **Figma** — 12 opacity variables moved to the 0–100 scale (`opacity/50` now holds
   `50`). Descriptions rewritten to state the scale and why it exists. Bindings
   preserved: 65,045 → 65,045.
2. **`export-tokens.mjs`** — now divides by 100 on emit, and **warns loudly** if it
   ever sees a 0–1 value again, naming the value it should hold. The drift that caused
   this is now detectable rather than silent.

**Verification:** the generated CSS is byte-identical before and after — same
`--opacity-5: 0.05`, `--opacity-50: 0.5`, `--opacity-100: 1` — while both sides moved.
That identity is the proof the pair is correctly matched. The Figma ramp now renders as
a real gradient.

## Consequence of keeping the pipeline

Nothing breaks today. The open items are recorded above: rename detection before
scaling component count, channel-alpha when a consumer exists, adapters when a
non-web target is real.

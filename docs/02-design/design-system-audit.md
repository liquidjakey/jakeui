# Jake UI — Build Readiness Audit

**Figma file:** `ovnLtL9xbX8SG5xDw673Un` (Jake UI)
**Against:** [props-table-format.md](./props-table-format.md)
**Audited:** 7 Aug 2026 · **Remediated:** 8 Aug 2026
**Scope:** 55 pages · 5 variable collections · **178 variables** · 74 component sets · 11 standalone components · 1 icon set (52 Phosphor icons × 3 sizes)

---

## Status

| Table | Before | Now |
|---|---|---|
| **1 — Code API** | 0 / 74 | 1 / 74 — [`Input`](./components/input.md) worked example |
| **2 — Figma → Code mapping** | 0 / 74 | **74 / 74** — `design-system/figma.map.json`, every property classified, CI-validated |
| **3 — State → token binding** | Color 100% · Spacing 96% · **Type 58%** | **Color 100% · Spacing 100% · Radius 100% · Type 99%** |
| **4 — Accessibility & keyboard** | 1 / 74 | 2 / 74 — Dropdown Menu, `Input` |

**Verdict:** the foundation is now build-ready and the Figma↔code contract exists in machine-checkable form. What remains is per-component authoring — Table 1 and Table 4 for the other 73 — plus writing the components themselves.

### In-Figma documentation

Benchmarked against the CRRT Design System and implemented — see [description-standard.md](./description-standard.md).

| | Before | Now |
|---|---|---|
| Sets whose description names exact per-state tokens | 0 | **74 / 74** |
| Sets carrying a Figma→code contract in-description | 0 | **74 / 74** (23 with an explicit decompose warning) |
| Sets with Do / Do-not | 0 | **74 / 74** |
| Variables with a description | 58 / 178 | **178 / 178** |
| Read me states the AI-extraction contract | no | **yes** |

Description length: 486 min / 1,015 median / 2,058 max. Zero HTML-escaping artifacts — the defect CRRT's own descriptions carry.

### Foundations

| | Before | Now |
|---|---|---|
| Variables with a description | 58 / 178 | **178 / 178** |
| Semantic colours with *role* guidance (which token to reach for) | 0 | **45 / 45** |
| Text styles | 0 | **14** — full semantic ramp |
| Text styles with a usage description | — | **14 / 14** |
| Text styles bound to variables | — | **14 / 14** (CRRT's are unbound) |
| Effect styles with a description | 0 / 9 | **9 / 9** |

**Typography was the worst foundation gap** — 35 distinct type combinations in use, no ramp, and a Typography page documenting styles that existed nowhere (`UI/Label/SM` at 12.8px appears in zero nodes). Full spec and the 450-node drift report: [typography.md](./typography.md).

**Color** — full contrast audit in both modes, interaction-state tokens, ramp analysis: [color.md](./color.md). Two findings that block a11y sign-off:

- `primary` on `popover` is **2.03:1 in Dark** across 52 nodes. Passes in Light (6.82), so a Light-only check would ship it.
- `muted-foreground` is calibrated to scrape 4.5:1 on white and **fails on every tinted surface** (4.34 on `accent`, 4.30 on `secondary`). It cannot be darkened because the neutral ramp has no step between 500 and 800.

Fixed in passing: 6 variant groups whose `Hover` was pixel-identical to `Default` — **Primary buttons had no hover affordance at all**. Four interaction tokens added, 14 variants rebound.

---

## Token binding — final state

Measured across 6,235 nodes in the component masters.

| Property | Bound | Raw | Coverage |
|---|---|---|---|
| Fills | 4,187 | 0 | **100%** |
| Strokes | 694 | 0 | **100%** |
| Corner radius | 6,188 | 0 | **100%** |
| Auto-layout gap | 1,643 | 0 | **100%** |
| Auto-layout padding | 4,130 | 0 | **100%** |
| Font size | 2,166 | 29 | **99%** |
| Line height | 2,347 | 29 | **99%** |

The 29 remaining are `Spacer` — empty, zero-width, 1px-font text nodes inside `Dropdown Menu / Checkbox Item` and `Dropdown Menu / Root Composition`. They are a layout hack, not typography. They sit in gapped auto-layout parents, so deleting them shifts layout; left in place deliberately. **Open item:** replace with real spacer frames, then delete.

### What was changed

**26 tokens added** at exact current values, so binding caused **zero pixel change**:

| Group | Added |
|---|---|
| Type size | `size/13` `15` `18` `20` `22` |
| Line height | `line-height/12` `17` `18` `19` `21` `22` `26` |
| Spacing | `space/0-75` `1-25` `1-75` `2-25` `3-25` `4-5` (3 / 5 / 7 / 9 / 13 / 18 px) |
| Radius | `radius/0-75` `3` `5` `7` `12` `16` `24` `32` |

Each carries `codeSyntax.WEB` and a description marking it an **exception token pending scale reconciliation**. Nothing was silently snapped to the existing ramp — that would have changed pixels across 800+ nodes without design review.

> **Resolved 9 Aug 2026 — promoted, not reconciled.** A binding census across all 58 pages found **4,814 live bindings across 24 of these 26 tokens**. `size/13` (1,345) and `line-height/18` (1,359) together are 13/18 — `Label/MD` and `Body/SM`, the two styles this document itself calls "THE default UI label" and "THE default UI body". They were never exceptions; the ramp was incomplete. They are now first-class ramp members and must not be deleted. Only `size/20` and `line-height/12` carry zero bindings and are safe to remove after re-verification. The Figma variable descriptions still say "exception token pending scale reconciliation" and need updating to match.

> The single biggest offender was **13px — 810 occurrences, the most-used text size in the library, and not a token.** Now `size/13`.

**17 orphan text styles deleted** (`Docs/*`, `UI/*`). All had zero usage inside component masters and none bound a variable, so the library ran two parallel typography systems. Variables won. Removing a style detaches nodes but preserves their values, so any documentation pages that used them are visually unchanged — they simply carry local styling now.

---

## Icons — migrated to Phosphor

The old set was 52 hand-drawn **stroke** icons with `#ffffff` frame fills and `#0a0a0a` strokes — **312 unbound raw colors** that the first audit missed, because they live on the Icon Masters page rather than Component Masters.

**Now:** all 156 variants (52 icons × 16/20/24) rebuilt from real **Phosphor regular** SVG paths, fill-based, every fill bound to `foreground`. Figma variant names match `@phosphor-icons/react` component names exactly.

| | Before | Now |
|---|---|---|
| Art | hand-drawn strokes | Phosphor regular, real paths |
| Unbound colors | 312 | **0** |
| Naming | `Add`, `Close`, `Search` | `Plus`, `X`, `MagnifyingGlass` |
| Code binding | none | `design-system/icons/phosphor-map.ts` |

One judgment call: Phosphor has no mirrored sidebar icon, so `Panel Right` became `SidebarSimpleRight` — flipped in Figma, and `<SidebarSimple mirrored />` in code via Phosphor's own `mirrored` prop.

### Text glyphs eliminated

The first audit reported 4 text-glyph icon *properties*. The real number was **49 distinct glyph-node kinds, ~250 nodes across 30 sets** — which, under your own governance rule (*"legacy text glyphs are design-only and blocked from code mapping"*), blocked nearly the whole library, not four components.

| Action | Count |
|---|---|
| `Icon` TEXT props → **INSTANCE_SWAP** slots | 4 sets (DDM Item, Checkbox Item, Radio Item, Sub Trigger) |
| Glyph nodes → Phosphor instances | 74 |
| Radio/bullet glyphs → real ellipses | 10 |
| **Remaining as text** | **8** |

The 8 survivors are genuinely typographic and correctly left alone: `⌘` (Command shortcut ×2), `*` (Label required mark ×2), `/` (Breadcrumb separator ×4).

INSTANCE_SWAP slots went from 1 (Button) to **5**. Verified visually: Dropdown Menu items, Checkbox, Dialog and Native Select all render correctly with per-state colors preserved.

---

## Code Connect — the substitute

**Code Connect requires a Dev or Full seat on an Org/Enterprise plan. This account has neither, and that cannot be fixed in Figma.** So the binding is hand-owned and CI-checked instead:

| File | Role |
|---|---|
| `design-system/figma.map.json` | The manifest. 74 components, every Figma property classified. **0 unclassified.** |
| `design-system/scripts/generate-map.mjs` | Regenerates the manifest from a Figma dump. Classification mirrors the Governance rules verbatim. |
| `design-system/scripts/validate-map.mjs` | CI gate. Exits 1 on drift. |
| `docs/02-design/state-decomposition.md` | Table 2 prose for all 23 conflated sets. |
| `design-system/icons/phosphor-map.ts` | 52 icons → Phosphor components, with Figma node ids. |
| `design-system/tokens/globals.css` | Tailwind v4 + shadcn-shaped token export, real values, Light/Dark. |

Manifest classification across 74 components:

| Kind | Count | Meaning |
|---|---|---|
| `prop` | 160 | Becomes a real code prop |
| `decompose` | **23** | Conflated `State` enum — must split, never emit as enum |
| `slot-toggle` | 8 | `Show *` boolean → nullable `ReactNode` |
| `responsive-fixture` | 6 | `Viewport` — breakpoint, not a prop |
| `story-only` | 5 | `Pattern` — Storybook story, not a prop |
| `slot` | 5 | INSTANCE_SWAP → `ReactNode` |
| `unclassified` | **0** | — |

The validator enforces six rules: nothing unclassified · no `decompose` axis emitted as an enum · every `codePath` exists and exports its symbol · every implemented component has a props table · every conflated axis is documented · no icon slot typed as a string. Verified against deliberately corrupted input — it catches all of them and exits 1.

---

## What still blocks v1.0.0

| Blocker | Status |
|---|---|
| **Table 1 for 73 components** | Open. `Input` is the worked example; the pattern is mechanical from here. |
| **Table 4 for 72 components** | Open. Governance already fixes the thresholds (4.5:1 text, 3:1 focus ring, 24×24 targets); this is filling in per-component contracts. |
| **Source parity** | 5 / 30 core, 0 / 12 primitives. Unchanged — this is design review, not tooling. |
| **Repository** | No Jake UI component code exists yet. `globals.css` is ready to seed it. |
| **Exception-token reconciliation** | **Done 9 Aug 2026.** 24 promoted to ramp members; Figma descriptions rewritten with per-token binding counts and a do-not-delete. `size/20` + `line-height/12` deleted after verifying zero references (182 → 180 variables). 65,045 bindings intact afterwards. |
| **Token export coverage** | **Done 9 Aug 2026.** `globals.css` is now generated and covers **176 of 180** variables individually, plus all 14 text styles and all 9 effect styles (shadows reached CSS for the first time). The 4 uncovered are `style/regular\|medium\|semibold\|bold`, Figma font-style names already aliased to `weight/*`. |
| **`export-tokens.mjs` does not exist** | **Done 9 Aug 2026.** Written, together with `figma-token-query.js` (dumps from inside Figma, since the Variables REST API is Enterprise-only). `--check` is a CI gate against hand-edits and stale dumps. All 181 previously-present declarations verified to resolve to identical values. |
| **29 `Spacer` text nodes** | Structural cleanup in 2 dropdown sets. |
| **Light/Dark visual QA** | Not started. Modes are wired; the render is unverified. |
| **Consumer publication test** | Not verified. |
| **Variant explosion** | `Popover / Content` (48) and `Button` (32) still breach your own 30-combination ceiling. Both shrink once `State` decomposes. |

---

## Next step

Implement `Input` from [its props table](./components/input.md), set `codePath` in the manifest, and run `node design-system/scripts/validate-map.mjs`. That closes the loop from Figma variable to typed React prop for one component and proves the whole chain — after which the other 73 are repetition.

Note the three build blockers that table already surfaced, which would otherwise have been found during implementation: the 9px exception padding, the missing placeholder colour in Figma, and the fact that **`Error + Disabled` has no Figma variant at all** because the enum cannot express it.

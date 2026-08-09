# Figma cleanup backlog — historical working notes

> **Not build documentation.** This is Figma-side design work: drift to snap,
> primitives to add, structural hacks to replace. None of it blocks writing
> component code, and an agent building a component does not need to read it.
>
> The constraints that *do* affect building are summarised in
> [`docs/tokens/color.md`](../docs/tokens/color.md) and
> [`docs/tokens/typography.md`](../docs/tokens/typography.md).

Extracted from `docs/02-design/typography.md`, `color.md` and the build-readiness
audit on 9 Aug 2026, when `docs/` was narrowed to build-relevant content only.

---

## 1. Typography drift — 450 nodes needing a decision

Nothing was auto-snapped. Every fix changes pixels, so each is a design call.

### Line-height drift on a canonical size

The same size rendered at two or three different line-heights. This is the bulk of it.

| Actual | Nodes | Canonical | Delta |
|---|---|---|---|
| Medium 13 / **19** | 98 | `Label/MD` 13/18 | +1px |
| Medium 13 / **20** | 71 | `Label/MD` 13/18 | +2px |
| Medium 11 / **17** | 60 | `Label/XS` 11/16 | +1px |
| Medium 11 / **14** | 33 | `Label/XS` 11/16 | −2px |
| Regular 13 / **20** | 29 | `Body/SM` 13/18 | +2px |
| Medium 14 / **22** | 24 | `Label/LG` 14/20 | +2px |
| Regular 11 / **17** | 12 | `Caption/XS` 11/16 | +1px |
| Regular 14 / **21** | 4 | `Body/MD` 14/20 | +1px |
| Semi Bold 16 / **22** | 4 | `Heading/MD` 16/24 | −2px |

**Recommendation:** snap all of these. The differences are invisible individually
and are almost certainly accidents of hand-setting. 335 nodes, ≤2px each.

### Weight gaps — a real ramp hole

| Actual | Nodes | Note |
|---|---|---|
| **Medium 12 / 18** | 41 | No ramp step. `Label/SM` is 12/16; `Body/XS` is 12/18 Regular. Either add `Label/SM-Relaxed`, or move these to `Body/XS`. |
| Semi Bold 12 / 18 | 10 | Same gap at Semi Bold. |
| Semi Bold 14 / 18 | 8 | `Heading/XS` is 14/20. |
| Semi Bold 13 / 16 | 7 | `Value/Strong` is 13/18. |
| Semi Bold 12 / 16 | 5 | Semi Bold at `Label/SM` metrics. |

**Recommendation:** decide whether Semi Bold needs its own steps at 12 and 14.
Right now `Value/Strong` (13/18) is the only Semi Bold body step, and five other
Semi Bold combinations exist ad hoc.

### One-offs

`Medium 15/22` ×4 · `Semi Bold 12/14` ×3 · `Semi Bold 11/14` ×2 · `Semi Bold 18/22` ×2 · `Regular 10/16` ×2 · `Regular 14/auto` ×2.

**Recommendation:** snap to the nearest step. None is load-bearing.

### Orphan primitives, blocked on the above

`--text-size-12-8`, `--leading-17`, `--leading-19`, `--leading-21` are referenced
only by drift nodes. **Once the drift is snapped they become orphans and should be
deleted.** `size/12-8` (12.8px) is referenced by nothing at all — it only ever
served the deleted fictional `UI/Label/SM` style, and can go now.

---

## 2. Primitive ramp holes

Six primitives unblock every open contrast fix plus three inert interaction tokens.

| Add | Unblocks |
|---|---|
| `neutral/300`, `neutral/600`, `neutral/700` | Darkening `muted-foreground` so it passes on tinted surfaces; a real `accent-hover` in Dark |
| `red/700` | `destructive-hover`, currently inert |
| `green/700`, `amber/700` | Feedback scale steps |
| a blue step between 700–800 | `primary-active`, which currently collides with `primary-hover` in Light |

Also planned: a `primary-readable` token (`blue/700` Light / `blue/300` Dark) so
text stops binding to `primary`, which fails at 2.03:1 in Dark.

---

## 3. Structural — 29 `Spacer` text nodes

Empty, zero-width, 1px-font text nodes inside `Dropdown Menu / Checkbox Item` and
`Dropdown Menu / Root Composition`. They are a layout hack, not typography, and
they are the only reason font-size and line-height binding coverage is 99% rather
than 100%.

They sit in gapped auto-layout parents, so deleting them shifts layout. **Replace
with real spacer frames, then delete.**

---

## 4. Variant explosion

`Popover / Content` (48 combinations) and `Button` (32) breach the 30-combination
ceiling set by the Governance page. Both shrink once `State` decomposes — see
[`docs/state-decomposition.md`](../docs/state-decomposition.md).

---

## 5. Still open on the design side

- **Source parity** — 5 / 30 core, 0 / 12 primitives. Design review, not tooling.
- **Light/Dark visual QA** — modes are wired; the render is unverified.
- **Consumer publication test** — not verified.
- **Table 4 (accessibility) for 72 components** — thresholds are fixed by Governance (4.5:1 text, 3:1 focus ring, 24×24 targets); this is filling in per-component contracts.

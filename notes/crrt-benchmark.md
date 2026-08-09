# CRRT benchmark — historical working notes

> **Not build documentation.** This is the competitive-benchmark analysis that the
> Jake UI description standard and the props-table format were derived from, kept
> for provenance. Nothing here describes Jake UI's own tokens or components.
>
> **Do not build from this file.** The token names quoted below (`cobalt/400`,
> `surface/muted`, `text/disabled`, `border/focus`) are **CRRT's**, not Jake UI's,
> and none of them exist in `tokens/globals.css`. For what to actually build
> against, see `docs/` — start at `docs/README.md`.

Reference file: [CRRT Design System](https://www.figma.com/design/vRN249HEjNvQA5Yu2pKx9B/CRRT-Design-System--Copy-)
Extracted from `docs/02-design/description-standard.md` on 9 Aug 2026, when `docs/`
was narrowed to build-relevant content only.

---

## What CRRT does well

**1. The description duplicates the visual doc in prose.** CRRT's `Input` page has a 5-block documentation frame — header, live component set, Anatomy, Properties table, Do's & don'ts. The *description field* then restates all of it as text. A designer reads the frame; an agent reads the description; neither is second-class.

**2. Descriptions name exact tokens, not adjectives.** Not "a subtle border" but:

> Focus = 2px cobalt/400 ring (border/focus) · Error = feedback/error border · Disabled = surface/muted + text/disabled

**3. Variant guidance answers "which one do I pick".**

> Primary for the single main action in a view, Secondary for supporting actions, Ghost for low-emphasis or inline actions. Size: sm (32px) for tables, toolbars and dense UI; md (36px) as the default in forms and dialogs.

**4. Do's & don'ts carry the reasoning.** Not "don't remove the focus ring" but "don't remove the focus ring — it is an accessibility requirement (border/focus, cobalt/400)". And they name the *failure*: "Don't place two Primary buttons side by side; it flattens the action hierarchy."

**5. Rules that only exist as prose get written down.** "Never use brand/accent as a button or active-state fill." Nothing in the file structure enforces that. Writing it in the description is the only way an agent learns it.

**6. The Read me states the extraction contract explicitly.**

> Every value here is a real Figma variable or style — so an engineer or an AI can pull exact specs and rebuild screens straight from the source, instead of eyeballing a mockup.

**7. Component role is stated, not just its shape.** "the base atom for all text-entry components (Input Field, Search, Date)" tells an agent about composition, which no amount of geometry inspection would reveal.

---

## Where CRRT falls short

| CRRT gap | Why it matters |
|---|---|
| **HTML-escaping corruption.** Descriptions contain `&amp;amp;#39;` and `&amp;amp;` where apostrophes and ampersands should be. | Figma HTML-escapes `&`, `<`, `>` in descriptions. Round-tripping compounds it. **Never emit those characters** — use `+`, `‹`, `›`, `→`. |
| **Properties table documents the Figma API as if it were the code API.** CRRT's `Input` table lists `State: enum (Default · Focus · Error · Disabled)` and `Leading icon: boolean`. | This is the exact failure the props-table format exists to prevent. An enum cannot express *disabled and invalid*; a boolean cannot carry an icon node. |
| **No Figma→code divergence recorded.** | Table 2 is where the value is. CRRT documents only what Figma shows. |
| **Variable descriptions are thin.** `neutral/50` = "derived". 31 of 108 variables documented. | An agent cannot tell what "derived" means or what references it. |
| **Single mode.** No Light/Dark. | Jake UI already does better here. |

---

## Where Jake UI already exceeded CRRT

Recorded so the benchmark is honest in both directions:

- **Governance page** — release policy, contribution workflow, naming rules, token policy, accessibility gate, responsive gate, deprecation, ownership, QA evidence requirements. CRRT has none of this.
- **Library Index** — a per-family maturity matrix (Draft → Technical QA → Source Parity → Published). CRRT has a flat "Done / Next" list.
- **Scale** — 75 component sets vs roughly 20.
- **Light + Dark by variable mode.**
- **100% token binding** on fills, strokes, radii, gaps and padding.

---

## Coverage comparison, as measured 8 Aug 2026

| | CRRT | Jake UI before | Jake UI at the time |
|---|---|---|---|
| Component sets with a description | ~20 | 74 | 74 |
| …with exact per-state tokens | yes | no | **74** |
| …with a Figma→code contract | no | no | **74** |
| …with Do / Do-not | yes | no | **74** |
| Variables with a description | 31 / 108 | 58 / 178 | **178 / 178** |
| Read me states the extraction contract | yes | no | **yes** |

Counts are as-of that date and have since moved — the live numbers live in
`design-system.json` under `audit`, which is the current source of truth.

---

## The remaining human gap

Generation cannot produce these, and they are what CRRT does best:

- **Which variant to pick.** "Primary for the single main action in a view" is a judgment about the design language.
- **Sizing guidance in context.** "sm (32px) for tables and toolbars; md (36px) in forms and dialogs."
- **Composition role.** "the base atom for all text-entry components."
- **Content rules.** "Labels are verb-first (Save, Add patient)."
- **Failure-mode don'ts.** "Don't place two Primary buttons side by side; it flattens the action hierarchy."

Most Jake UI authored leads describe *what the component is*. Bringing them to
CRRT's bar means adding *which variant to pick and why*. That remains genuinely
human work.

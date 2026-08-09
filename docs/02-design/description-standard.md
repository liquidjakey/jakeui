# Description Standard — benchmarked against CRRT

The Figma `description` field is the only documentation an agent reads through MCP. A screenshot is not readable; a doc frame on the canvas is barely readable; the description is structured text delivered with the component. **It is the API surface for AI.**

This standard is benchmarked against the [CRRT Design System](https://www.figma.com/design/vRN249HEjNvQA5Yu2pKx9B/CRRT-Design-System--Copy-), which is the file the [props-table format](./props-table-format.md) was derived from.

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

## Where CRRT falls short — and Jake UI should not copy it

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
- **Scale** — 74 component sets vs roughly 20.
- **Light + Dark by variable mode.**
- **100% token binding** on fills, strokes, radii, gaps and padding.

---

## The Jake UI standard

Every component set description is: **authored lead** + `———` + **generated block**. The lead is human prose. Everything below the rule is derived from the file, so it cannot drift.

```
{Authored lead — purpose, role in the system, when to use which variant,
 accessibility contract. Written by a human. Preserved across regeneration.}

———
ANATOMY / STATE TOKENS
State=Default — fill card · border 1px input · radius radius/lg · text foreground · type size/14
State=Focused — border 2px ring
State=Error — border 1px destructive
State=Disabled — fill muted · text muted-foreground

CODE API — full contract: docs/02-design/state-decomposition.md
Props — Value: string
Slots — Leading icon: ReactNode (Phosphor icon)
! Decompose — State [Default · Focused · Error · Disabled] → :focus-visible CSS-owned, dropped; invalid + disabled independent booleans
Design-only — Pattern (Storybook stories, never a prop)

DO / DO NOT
+ Reference variables for every value; never hardcode a hex or px.
+ Change state through props, never by detaching the instance.
- Do not emit State as an enum prop. It packs states that co-occur at runtime.
- Do not remove the ring border on focus. It is the only focus affordance.
```

### Rules

1. **Below the `———` is generated.** Regenerating re-reads the live bindings; it never invents. Edits there are overwritten — put authored content in the lead.
2. **Token names, never hex.** `border 2px ring`, not `#737373`.
3. **State rows are deltas.** The first variant prints in full; the rest print only what changed. Capped at 8 rows.
4. **CODE API states the divergence.** This is what CRRT is missing and what makes the description safe to hand to a codegen step.
5. **Do / Do-not rules must be true for that component.** Generated only from facts: has a `decompose` axis, has slots, uses `ring`, breaches the 30-variant ceiling. **Component-specific UX guidance is authored, never generated** — inventing it would be worse than omitting it.
6. **No `&`, `<`, `>`.** Figma escapes them.

### Variables

Every one of the 178 carries a description.

```
Semantic role token. Bind components to this, never to a primitive.
Light #737373 (neutral/500)  ·  Dark #737373 (neutral/500)
CSS var(--ring)
```

```
Primitive value: #0a0a0a.  CSS var(--color-neutral-950)
Referenced by semantic tokens: background, card-foreground, destructive-foreground,
foreground, info-foreground, popover-foreground, sidebar-foreground.
```

The reverse-reference list is the part CRRT lacks: it tells an agent the blast radius of changing a primitive.

The 26 exception tokens keep their own note and are excluded from regeneration.

---

## Coverage

| | CRRT | Jake UI before | Jake UI now |
|---|---|---|---|
| Component sets with a description | ~20 | 74 | 74 |
| …with exact per-state tokens | yes | no | **74** |
| …with a Figma→code contract | no | no | **74** |
| …with Do / Do-not | yes | no | **74** |
| Variables with a description | 31 / 108 | 58 / 178 | **178 / 178** |
| Read me states the extraction contract | yes | no | **yes** |

---

## Still authored by hand

Generation cannot produce these, and they are what CRRT does best:

- **Which variant to pick.** "Primary for the single main action in a view" is a judgment about the design language.
- **Sizing guidance in context.** "sm (32px) for tables and toolbars; md (36px) in forms and dialogs."
- **Composition role.** "the base atom for all text-entry components."
- **Content rules.** "Labels are verb-first (Save, Add patient)."
- **Failure-mode don'ts.** "Don't place two Primary buttons side by side; it flattens the action hierarchy."

Most Jake UI leads currently describe *what the component is*. Bringing them to CRRT's bar means adding *which variant to pick and why*. That is the remaining gap, and it is genuinely human work.

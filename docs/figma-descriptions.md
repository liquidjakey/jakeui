# Figma description format

**This is what an agent actually reads.** The Figma `description` field is the only
documentation reachable through MCP. A screenshot is not readable; a doc frame on
the canvas is barely readable; the description is structured text delivered with
the component. **It is the API surface for AI.**

If you are building a component, read the description on its component set first —
it carries the per-state token bindings and the Figma→code divergence inline.
Then read [`state-decomposition.md`](./state-decomposition.md) for the full contract.

---

## The shape of every description

Every component set description is: **authored lead** + `———` + **generated block**.
The lead is human prose. Everything below the rule is derived from the file, so it
cannot drift.

```
{Authored lead — purpose, role in the system, when to use which variant,
 accessibility contract. Written by a human. Preserved across regeneration.}

———
ANATOMY / STATE TOKENS
State=Default — fill card · border 1px input · radius radius/lg · text foreground · type size/14
State=Focused — border 2px ring
State=Error — border 1px destructive
State=Disabled — fill muted · text muted-foreground

CODE API — full contract: docs/state-decomposition.md
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

## Rules

1. **Below the `———` is generated.** Regenerating re-reads the live bindings; it never invents. Edits there are overwritten — put authored content in the lead.
2. **Token names, never hex.** `border 2px ring`, not `#737373`.
3. **State rows are deltas.** The first variant prints in full; the rest print only what changed. Capped at 8 rows.
4. **CODE API states the divergence.** This is what makes the description safe to hand to a codegen step — without it, an agent emits the Figma enum as a prop and produces a component that cannot represent real state.
5. **Do / Do-not rules must be true for that component.** Generated only from facts: has a `decompose` axis, has slots, uses `ring`, breaches the 30-variant ceiling. **Component-specific UX guidance is authored, never generated** — inventing it would be worse than omitting it.
6. **No `&`, `<`, `>`.** Figma HTML-escapes them and round-tripping compounds the corruption. Use `+`, `‹`, `›`, `→`.

---

## Variable descriptions

All 180 variables carry one. Two shapes, depending on tier.

Semantic token — states its role and both mode values:

```
Semantic role token. Bind components to this, never to a primitive.
Light #737373 (neutral/500)  ·  Dark #737373 (neutral/500)
CSS var(--ring)
```

Primitive — states its value and, critically, **what references it**:

```
Primitive value: #0a0a0a.  CSS var(--color-neutral-950)
Referenced by semantic tokens: background, card-foreground, destructive-foreground,
foreground, info-foreground, popover-foreground, sidebar-foreground.
```

The reverse-reference list tells an agent the blast radius of changing a primitive.
Do not drop it when regenerating.

### Half-step ramp members

Twenty-four tokens that were once labelled *"exception token pending scale
reconciliation"* are **first-class ramp members** and their descriptions now say so,
with per-token binding counts and an explicit do-not-delete. `size/13` and
`line-height/18` alone carry 2,704 bindings between them — they are `Label/MD` and
`Body/SM`, the two most-used text styles in the library.

**Do not reintroduce "exception token" language, and do not exclude them from
regeneration.** The two that genuinely carried zero bindings (`size/20`,
`line-height/12`) were deleted on 9 Aug 2026.

---

## What is still authored by hand

Generation cannot produce these, and their absence is the main remaining
documentation gap:

- **Which variant to pick** — "Primary for the single main action in a view."
- **Sizing guidance in context** — "sm for tables and toolbars; md in forms and dialogs."
- **Composition role** — "the base atom for all text-entry components."
- **Content rules** — "Labels are verb-first (Save, Add patient)."
- **Failure-mode don'ts** — "Don't place two Primary buttons side by side; it flattens the action hierarchy."

Most authored leads currently describe *what the component is* rather than *which
variant to pick and why*. When you touch a component, improving its lead is fair game.

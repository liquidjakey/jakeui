# Component Props Table Format

A documentation format for Figma design systems intended to be read by an AI or engineer and turned into code.

**The problem it solves:** a Figma variant API and a code component API are not the same shape. A props table that documents Figma variants as if they were code props produces wrong code — states that can't co-occur, conflated props, and missing behavior. This format documents both and makes the mapping explicit.

Each component page carries four tables in this order. Table 1 and 3 are mandatory. Table 2 is mandatory wherever the Figma and code APIs diverge. Table 4 is mandatory for any interactive component.

---

## Table 1 — Code API

The interface to implement. Grouped by role, always in this order: **Content → State → Behavior → Accessibility**. Grouping is what lets a reader (or model) tell a visual prop from a functional one.

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| *content props* | | | | |
| *state props* | | | | |
| *behavior props* | | | | |
| *a11y props* | | | | |

Rules:
- **One concern per prop.** If a Figma property means two things, split it.
- **Independent states are independent booleans.** Only use an enum when the values are genuinely mutually exclusive.
- **Slots are nodes, not booleans.** A Figma boolean that toggles a placeholder icon becomes a `ReactNode` prop in code.
- Use real type syntax (`boolean`, `string`, `ReactNode`, `(e) => void`, `'sm' | 'md'`), not prose.
- Mark required props explicitly — a designer's "default" is not the same as an optional prop.

---

## Table 2 — Figma → Code mapping

The bridge. Written for whoever is looking at the Figma file and needs to know what it becomes. Every row where the mapping is not 1:1 gets a note.

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|

Rules:
- List every Figma variant property, including ones that vanish in code.
- Where one Figma property splits into several code props, say so plainly.
- Where a Figma value is a *visual proxy* for runtime state (a "Filled" variant standing in for "has a value"), flag it — those must never become props.

---

## Table 3 — State → token binding

Replaces prose like *"Focus = 2px ring, Error = error border."* Tabular so it can be diffed, linted, and read mechanically.

| State | Trigger | Tokens applied |
|---|---|---|

Rules:
- One row per state, including the default.
- **Trigger** is the runtime condition, not the Figma variant name.
- Name the exact token per property. Never write a hex here.
- Flag any token that is not yet a real variable with code syntax — that's a build blocker, and it should be visible in the doc, not discovered at codegen.

---

## Table 4 — Accessibility & keyboard

| Concern | Contract |
|---|---|

Cover at minimum: semantic element/role, label source, focus visibility, keyboard interaction, and how error state is announced.

---

## Worked example

**[`components/input.md`](./components/input.md)** is the reference implementation of
this format. Every token in it is the actual bound variable read from the Figma
file, and the four tables compile directly to the `InputProps` interface — which is
the point of the format. If your tables don't compile to an interface, one of them
is underspecified.

Read it before writing your first props table.

> **A note on token names.** Jake UI uses shadcn-shaped semantic tokens — `--card`,
> `--muted-foreground`, `--ring`, `--destructive`, `--input`. If you find a props
> table quoting names like `--color-surface-card`, `text/muted`, `border/focus` or
> `--color-feedback-error-base`, it was copied from another design system and is
> wrong: none of those exist in `tokens/globals.css`. The authoritative token lists
> are [`tokens/color.md`](./tokens/color.md) and
> [`tokens/typography.md`](./tokens/typography.md).

---

## Authoring checklist

Before marking a component documented:

- [ ] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [ ] No enum in Table 1 mixes states that can co-occur at runtime
- [ ] No prop in Table 1 covers two concerns
- [ ] Icon and content slots are typed as nodes, not booleans
- [ ] Behavior props are present even though Figma has no equivalent
- [ ] Every state in Table 3 names tokens, never hex values
- [ ] Tokens lacking code syntax are flagged ⚠️
- [ ] Table 4 is filled in for anything interactive
- [ ] The tables compile to a valid interface with nothing invented and nothing missing

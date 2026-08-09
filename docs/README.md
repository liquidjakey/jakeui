# Jake UI — build documentation

Everything in this folder exists to answer one question: **what do I need to know to
build a Jake UI component correctly?** If a document doesn't serve that, it lives in
[`../notes/`](../notes/) instead.

Figma is the design authority. This folder is the contract between it and the code.

---

## Reading order

Building a component for the first time — read in this order:

| # | Read | Why |
|---|---|---|
| 1 | [`props-table-format.md`](./props-table-format.md) | The four-table format every component must document before it is implemented. |
| 2 | [`components/input.md`](./components/input.md) | The worked example. Real tokens, read from the live file. Your template. |
| 3 | [`state-decomposition.md`](./state-decomposition.md) | **The binding contract.** How a Figma `State` enum splits into code props, for all 23 conflated sets. Non-negotiable. |
| 4 | [`tokens/color.md`](./tokens/color.md) | Which color token to bind, the six rules, and the open contrast constraints. |
| 5 | [`tokens/typography.md`](./tokens/typography.md) | The 14-style ramp and its Tailwind utilities. |
| 6 | [`figma-descriptions.md`](./figma-descriptions.md) | The format of the descriptions you'll read out of Figma via MCP. |

Then read the component set's own description in Figma — it carries per-state token
bindings and the Figma→code divergence inline.

---

## The one rule that matters

**A Figma variant axis is mutually exclusive. Runtime state is not.**

Twenty-three components encode co-occurring states — `disabled`, `invalid`,
`readOnly`, `:hover`, `:focus-visible` — as a single `State` enum. **Never emit that
enum as a prop.** A field can be disabled *and* invalid; the enum cannot say so.

[`state-decomposition.md`](./state-decomposition.md) gives the split for every one,
and `scripts/validate-map.mjs` fails the build if a `decompose` entry acquires a
`type`.

---

## How the contract is enforced

Code Connect requires a Dev or Full seat on an Org/Enterprise plan, which this
account does not have. So [`../figma.map.json`](../figma.map.json) does the same job
by hand and CI checks it.

Every Figma property across the 74 mapped components is classified as one of:

| Kind | Count | Means |
|---|---|---|
| `prop` | 160 | Becomes a real code prop |
| `decompose` | **23** | Conflated `State` enum — must split, never emit as an enum |
| `slot-toggle` | 8 | `Show *` boolean → nullable `ReactNode` |
| `responsive-fixture` | 6 | `Viewport` — a breakpoint, not a prop |
| `story-only` | 5 | `Pattern` — a Storybook story, not a prop |
| `slot` | 5 | `INSTANCE_SWAP` → `ReactNode` |
| `unclassified` | **0** | — |

`npm run check` runs both gates. The map validator enforces six rules:

1. Nothing `unclassified`
2. No `decompose` axis emitted as an enum
3. Every `codePath` exists and exports its symbol
4. Every implemented component has a props table in `docs/components/`
5. Every conflated axis is documented in `state-decomposition.md`
6. No icon slot typed as a string

The token gate (`npm run tokens:check`) fails if `tokens/globals.css` has been
hand-edited or its dump is stale. **`globals.css` is generated — never edit it.**

---

## Adding a component

1. Update the Figma master.
2. Refresh `.figma-dump.json`, then `npm run map:sync`.
3. Write the four tables in `docs/components/<slug>.md`.
4. Implement it, then set `codePath` and `codeExport` in `figma.map.json`.
5. `npm run check`.

---

## Not in here, on purpose

[`../notes/`](../notes/) holds historical working notes — the CRRT benchmark the
format was derived from, the 8 Aug audit snapshot, and the Figma-side cleanup
backlog. None of it is needed to build, and its token names and counts are not
current. Don't build from it.

Current project state — what's built, what's audited — lives in
[`../design-system.json`](../design-system.json).

# Session handoff — 9 Aug 2026

Read this first in a new session. It is the state of play, the non-obvious
constraints, and the next actions. Everything is committed and pushed; `main` is in
sync with `origin/main` and the working tree is clean.

---

## 1. Where things stand

| | |
|---|---|
| Repo | `github.com/liquidjakey/jakeui`, private, **single-package on purpose** |
| Figma file | `ovnLtL9xbX8SG5xDw673Un` — actual name **"Jake's design system"** (not "Jake UI") |
| Gates | `npm run check` = tokens · map · docs · typecheck — **all passing** |
| Variables | 189 (was 180) · 65,045 bindings · 0 unresolved · 189/189 described |
| Doc records | **86 / 86** in `docs/components/*.doc.json` |
| Code components | **50 of 74** — every buildable component; all `draft` |
| Storybook | Installed, single-package. **No Chromatic** (deliberate) |
| Retrofit phase | `docs` |

**Skills completed:** `figma-environment-setup`, `design-system-audit`,
`token-builder`, `component-builder`.

---

## 2. What happened, in order

Ten commits. Each is a working revert point — every one was extracted to a temp tree
and its gates run independently.

| Commit | What |
|---|---|
| `e4e1805` | Narrowed `docs/` to build-relevant content; historical material to `notes/` |
| `72333df` | **Bug fix:** `generate-map.mjs` was silently wiping code bindings |
| `c63ec77` | Component layer scaffolded; `Input` implemented |
| `361a373` | Decision journal + the retrofit phase map |
| `2c187e5` | Refine phase — 8 primitives, `primary-readable`, 6 realignments |
| `84c7c89` | Rebind phase — 75 text bindings repointed |
| `df1f73e` | **Bug fix:** opacity rendered 100× too transparent; Phase 4 declined |
| `ff909d5` | Storybook stood up; **bug fix:** invalid border rendered grey |
| `c07413d` | Docs adoption pipeline built, validated on 6 |
| `11918a4` | All 86 adopted, enriched, digested, gated |

### Four real defects found and fixed

1. **`generate-map.mjs` hardcoded `codePath: null`.** Any `map:sync` would have
   silently unbound every implemented component — and since a null `codePath` is only
   a *warning*, `npm run check` would still have passed while the whole Figma↔code
   contract quietly emptied.
2. **`opacity/*` rendered at 1/100th.** Figma divides a variable bound to a node's
   `opacity` field by 100. Values were stored 0–1, so all 120 bindings were ~invisible.
   **Fixed as a matched pair** — Figma now stores 0–100 *and* the exporter divides by
   100 on emit. Proof it's matched: the generated CSS is byte-identical before and
   after while both sides changed.
3. **`Input`'s invalid border rendered grey, not red.** `border-input` and
   `border-destructive` both set `border-color` at equal specificity, so source order
   in the *stylesheet* wins — not order in the class attribute. Fixed by putting
   `cn()` through `tailwind-merge`. **No type check or build could catch this; only
   rendering did.**
4. **The audit's Alert contrast fix would have been a no-op.**
   `warning-muted-foreground` resolved to the same primitive as `warning`, so
   rebinding changed nothing. Their values had to change too.

---

## 3. Non-obvious constraints — read before touching anything

These cost real time to discover. A fresh session will get them wrong otherwise.

**Figma plugin sandbox has no `TextEncoder` and no `crypto.subtle`.** Any hashing
done inside Figma must be pure JS. `verify-docs-dump.mjs` uses FNV-1a over UTF-16
code units precisely so the same hash is computable on both sides.

**Synchronous document-wide getters throw.** Use `getNodeByIdAsync`,
`getLocalVariableCollectionsAsync`, `setCurrentPageAsync`. Also: `node.remove()`
works, but `getNodeByIdAsync` can return a *stale handle* for it in the same
execution — always verify a deletion by re-scanning, not by the return value.

**Angle brackets and `&` DO survive the plugin write path** (tested). House rule 6 in
`docs/figma-descriptions.md` about Figma escaping them applies to the REST/round-trip
path, not the plugin.

**Take a binding baseline in the SAME execution as the write.** A baseline taken
earlier gave a false +43 during the rebind phase — the delta was a documentation
frame created in between. Guardrail 3's tripwire only works if nothing can slip in.

**Two matched pairs exist. Break one half and you break the working half:**
- Opacity: Figma 0–100 ↔ exporter ÷100
- `globals.css` is generated. Never hand-edit it; change the dump or
  `tokens/annotations.json` and re-run `tokens:sync`.

**`docs/components/` holds two naming conventions on purpose.** `Input.doc.json`
(schema-mandated PascalCase) and `input.md` (lowercase slug, what
`validate-map.mjs` has always used). Aligning them breaks the validator contract.

**Adoption must never overwrite an `imported` or `user` block.** `docs:adopt` refuses,
by design, and that is negative-tested. A *mixed* block (`imported+framework`) is
expected to differ from a fresh adoption — only purely-`imported` blocks are held to
exact equality.

---

## 4. Deliberate declines — do not "fix" these

Each has a full decision record in `docs/design-system/decisions/`.

**Phase 4 `sync` (`token-sync-layer`) — declined.** It wants DTCG + Style Dictionary
in `packages/tokens/`, which needs a monorepo conversion to replace working CI-gated
infrastructure — and it would *not* remove the query-in-Figma step, because that
exists since the Variables REST API is Enterprise-only on this plan. Four of the
skill's hard rules are already satisfied. **Its one real gap is rename detection**,
deferred not dismissed: near-zero blast radius at 1 component, revisit before
building in bulk.

**Phase 5 `baseline` (Chromatic) — deferred.** Paid SaaS, needs CI, and a
one-component baseline carries little signal. Storybook *was* installed, but for its
own reasons: `globals.css` had never been compiled (307 declarations, no Tailwind
installed) and no component had ever been rendered.

**Phase 6 `code` — N/A as a retrofit.** No consuming application:
`scssColorVars`/`tailwindColorClasses`/`jsColorsUsages` are all 0. Guardrails 4/5/6
and two of the three verification-triad checks exist to protect a live app that does
not exist here.

**Monorepo conversion — deliberately deferred.** `repo._note`: convert only once
component packages actually exist.

**Fingerprint markers on Figma descriptions — skipped on merit.** Appending
`<!-- tl:doc <fp> -->` to 86 descriptions would invalidate the byte-verified dump,
and `docs:verify` already does that job with more information.

**Layer 4 of the doc pipeline (interview) — not done.** Brand-specific intent cannot
be inferred; inventing a voice would be worse than a visible gap.

---

## 5. Open items

### Needs your judgement (blocking nothing, but owed)

- ~~**105 doc blocks flagged for review.**~~ **Closed — now 1.** `docs/archetypes.json`
  grew from 6 archetypes / 13 vocabulary axes to 31 / 26; 70 of 86 records enriched,
  89 variant meanings filled. Decision record:
  `decisions/2026-08-09-doc-gaps-closed-via-archetypes.md`. **The one block still owed
  is `Popover / Viewport`** (`state.current`, `state.previous`, `direction.*`) — left
  open deliberately, because those describe a bespoke transition mechanism and a
  guessed meaning would be worse than a visible gap.
  Note: `docs:enrich` truncates its owed list at 8 entries, which is why the shape of
  the 105 was never visible. To see all of them, read the records rather than the
  script's output.
- ~~**`audit.percentSemantic` is internally inconsistent.**~~ **Closed — and the
  diagnosis above was wrong.** All three numbers are correct; they are three
  *denominators*, not three estimates. `100` and `99` are the same measurement (99.728
  truncated, and 30 documentation swatch frames excluded by design). `19` is the share
  of *all* bindings in the semantic collection and is **not** a quality measure —
  dimension and type bind to scale primitives by shadcn/Tailwind convention. Split into
  three denominated keys. Decision record:
  `decisions/2026-08-09-percent-semantic-denominators.md`.
- **The whole `audit` block is a stale 8 Aug snapshot** — it says 180 variables; the
  file holds **189**. The rebind phase moved 75 text fill bindings (which are colour
  bindings) *after* the measurement. Numbers deliberately not retro-edited; the block
  carries a `_supersededNote`. **A binding-level re-measure is owed** and needs the
  Desktop Bridge plugin — the dump is variable-level and has no binding counts. Do it in
  the same plugin session as the accessibility fixes below.

### 1 doc record carries pre-rebind token bindings — CORRECTED 9 Aug 2026

**This section previously claimed six records. That was wrong, and the error was
mine: the detection regex used `\b`, so `text warning\b` matched
`text warning-foreground` and `text primary\b` matched
`text primary-foreground`.** Those are the *correct* foregrounds for their fills and
were never touched by the rebind.

Re-tested with `text (primary|success|warning)(?![-a-z])`:

| Component | Reads | Verdict |
|---|---|---|
| **Alert** | `text success`, `text warning` | **genuinely stale** |
| Badge | `text warning-foreground` | fine — false positive |
| Avatar, Button, Button Group, Navigation Menu | `text primary-foreground` | fine — false positives |

**The underlying finding still stands:** the descriptions were never regenerated
after the rebind. `primary-readable`, `success-muted-foreground` and
`warning-muted-foreground` appear **nowhere** in a dump captured 1h41m after the
rebind commit. Only the blast radius was overstated — **one record, not six.**

Fix is unchanged: regenerate the Figma descriptions, then re-run `npm run docs:adopt`.
Until then **do not implement Alert** from its record — its Success and Warning text
tokens would reintroduce the 3.07:1 and 3.15:1 contrast failures the rebind fixed.

### Accessibility, still failing

- **3 `destructive`-as-text nodes on `accent` in Light = 4.37:1** (below 4.5).
- **2 `destructive`-as-text nodes on an unbound *literal* fill = 2.89:1 in Dark.** The
  hardcoded fill is itself a token violation and must be bound first.
- Neither is fixable by rebinding — `destructive-foreground` is near-white, so it is
  not a valid substitute. A `destructive-readable` token (mirroring `primary-readable`)
  is the shape of the fix.

### Known-inert / incomplete

- `Input` is `status: draft`. Promotion to `stable` needs Storybook stories reviewed —
  which now exist — and is `storybook-chromatic-builder`'s call.
- Two `Input` states are **code-only and unreviewable in Figma**: placeholder colour,
  and `Error + Disabled` (the enum cannot express it).
- `Input`'s `leadingIcon`/`trailingIcon` exist only in code; Figma owes
  `INSTANCE_SWAP` properties.
- Ramp still missing `neutral` complete-but-`blue` 700–800 step, `red/50,500,950`,
  `green/200`, `amber/200`. Cosmetic, not blocking.
- `figma.libraryPublished` is `false` = **unverified**, not "definitely not published".
  Detection is inconclusive for a self-publish; ask once and record.

---

## 6. Recommended next actions, in order

1. ~~**Resolve the 105 flagged blocks.**~~ **Done** — see §5, along with
   `audit.percentSemantic`. What is left needs a **Desktop Bridge plugin session**: the
   binding-level audit re-measure and the accessibility fixes, which should be done
   together.
2. **Write props tables for the next batch of components.** `validate-map.mjs`
   requires one before a component may declare a `codePath`. This is now
   **transcription** from `docs/components/*.doc.json` (per-state token bindings,
   decompose contract, variant meanings all present) rather than authoring — that was
   the entire point of Phase 6.5.
3. **Build components in batches**, mirroring how `Input` was done: props table →
   implement → set `codePath`/`codeExport` → `npm run check` → story → look at it.
4. **Add rename detection to `export-tokens.mjs`** before component count grows.
5. **Add Chromatic** once ~5–10 components exist, so token changes get an automatic
   visual diff. The 2,206-binding grey change in this session had none.

### Which skill for which job

| Job | Skill |
|---|---|
| More doc records / re-enrich | **None** — use the `docs:*` scripts |
| Fill doc gaps (layers 1–4) | `throughline:component-builder` (Step 4.5 only; decline its Figma-building steps) |
| Code components + stories, promote to `stable` | `throughline:storybook-chromatic-builder` (expects a monorepo — port the useful part, as was done for Storybook) |
| Resume / re-sequence the retrofit | `throughline:retrofit-planner` (reads `retrofit.phase`) |
| Figma variable changes | `throughline:token-builder` (brownfield refine branch, Step 1.5) |

**Do not** run `token-sync-layer` or `repository-builder` without revisiting the
declines above.

---

## 7. Commands

```bash
npm run check          # tokens · map · docs · typecheck — the CI entry point
npm run storybook      # dev server on :6006 — the only way to SEE a component
npm run build-storybook

npm run docs:adopt     # Figma descriptions -> doc records (refuses to clobber)
npm run docs:enrich    # archetype + framework gap-fill; lists what is owed
npm run docs:digest    # all records -> docs/DIGEST.md
npm run docs:verify    # dump <-> live Figma, byte for byte

npm run tokens:sync    # dump -> globals.css   (NEVER hand-edit globals.css)
npm run map:sync       # dump -> figma.map.json (preserves hand-set codePaths)
```

**Refreshing a Figma dump** needs the Desktop Bridge plugin running, then executing
the body of `scripts/figma-token-query.js`, `figma-docs-query.js`, or the snippet
from `verify-docs-dump.mjs --figma-snippet` through it, and saving the result. The
REST API path is not available on this plan.

---

## 8. Rollback points

- **Figma:** named version `pre-throughline-retrofit`, id `2385260588620484892`,
  created 2026-08-08T09:54:59Z. Restore point for every retrofit write.
- **Code:** ten commits, each independently gate-verified. `git log --oneline
  008b624..HEAD`.

---

## 9. Where to read more

- `docs/README.md` — build documentation, with a reading order
- `docs/DIGEST.md` — all 86 components in one file, for an agent
- `docs/design-system/decisions/` — five decision records, with the reasoning
- `docs/design-system/findings/2026-08-09-retrofit-phase-map.md` — why this system is
  brownfield in Figma but greenfield in code, and what that does to the 7 phases
- `notes/` — historical; **token names and counts there are not current**
- `design-system.json` — machine state, including `retrofit._*` progress notes

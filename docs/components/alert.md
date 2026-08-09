# Alert

Inline feedback message for informational, successful, warning, and destructive states.

- **Figma:** `Alert` — node `103:475`, 4 variants
- **Code:** not yet implemented — `codePath` is `null`
- **Maturity:** Transcribed from `docs/components/Alert.doc.json`. **Two open questions in Table 3 must be settled before implementing.**
- **Format:** [props-table-format.md](../props-table-format.md)

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `title` | `string` | — | ✓ | Heading line. Figma property `Title#103:0`. |
| `description` | `string` | `undefined` | | Body line. Figma property `Description#103:5`. |
| `icon` | `React.ReactNode` | tone default | | Leading icon. ⚠️ **Not a Figma property** — but the record's own `donts` require it: *"Do not signal severity with colour alone — pair it with an icon and text."* Without a slot the component cannot satisfy its own accessibility rule. |
| `action` | `React.ReactNode` | `undefined` | | Optional inline action. ⚠️ Not in Figma. |
| `tone` | `'info' \| 'success' \| 'warning' \| 'destructive'` | `'info'` | | Severity. Figma axis `Tone`, 1:1. |
| `onDismiss` | `() => void` | `undefined` | | When provided, renders a close control. ⚠️ Not in Figma; the record's a11y notes reference *"a dismissible alert's close control"*, so the behaviour is anticipated but undrawn. |
| `live` | `'off' \| 'polite' \| 'assertive'` | `'off'` | | Controls the announcement contract — see Table 4. **Defaults to `off` deliberately.** |

`tone` is a genuine enum: the four values are mutually exclusive, so format rule
"independent states are independent booleans" does not apply here.

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Tone` | Info · Success · Warning · Destructive | `tone` | 1:1. Genuinely exclusive values. |
| `Title#103:0` | string | `title` | 1:1. |
| `Description#103:5` | string | `description` | 1:1. |
| — | — | `icon` | **Missing in Figma.** Required by the component's own don't-rely-on-colour rule. Figma owes an `INSTANCE_SWAP` against the `Icon` set, as it does for `Input`'s icon slots. |
| — | — | `action`, `onDismiss` | **Missing in Figma.** `onDismiss` is referenced by the record's accessibility notes but has no drawn state — there is no close-control variant to review. |
| — | — | `live` | No Figma representation and never will have one: it is an announcement contract, not a visual. |

---

## 3. State → token binding

Transcribed verbatim from `Alert.doc.json` `states`. All four rows present — 4 variants,
under the 8-row cap.

| Tone | Trigger | Tokens applied |
|---|---|---|
| Info | `tone === 'info'` | fill `info-muted` · border `1px` `info` · radius `radius/lg` · text `info` · type `size/14` |
| Success | `tone === 'success'` | fill `success-muted` · border `1px` `success` · text `success` ⚠️ **see Open question 1** |
| Warning | `tone === 'warning'` | fill `warning-muted` · border `1px` `warning` · text `warning` ⚠️ **see Open question 1** |
| Destructive | `tone === 'destructive'` | fill `card` · border `1px` `destructive` · text `destructive` ⚠️ **see Open question 2** |

### ⚠️ Open question 1 — RESOLVED: the record's text tokens ARE stale post-rebind

The doc record says Success and Warning bind their **text** to `success` and `warning`.
The 9 Aug rebind phase says otherwise. `design-system.json` `retrofit._rebindProgress`
records:

> *"2 warning → warning-muted-foreground (3.07 → 4.84), 2 success → success-muted-foreground (3.15 → 4.79)"*

and the retrofit phase map attributes exactly those to Alert text. Both
`success-muted-foreground` and `warning-muted-foreground` exist as real variables and
are exported to `globals.css`.

**Settled locally on 9 Aug 2026 — no Figma query needed.** The descriptions were
**never regenerated after the rebind.** `.figma-docs-dump.json` was captured at 17:41,
1h41m *after* the rebind commit (`84c7c89`, 16:00), and contains **zero occurrences** of
`primary-readable`, `success-muted-foreground` or `warning-muted-foreground` across all
86 descriptions — the three tokens the rebind moved 75 bindings onto. Had the generator
re-run, `primary-readable` alone would appear in the 71 nodes it now covers.

`npm run docs:verify` does not catch this: it proves the description text matches live
Figma byte for byte, not that the description was regenerated after the bindings changed.
Dump and Figma carry the same stale text, so verify passes.

**Therefore these two rows are `text success-muted-foreground` and
`text warning-muted-foreground`.** Implementing from the record's `success`/`warning`
would reintroduce the 3.07:1 and 3.15:1 contrast failures the rebind fixed.

**The record is not authoritative until the Figma descriptions are regenerated and
`docs:adopt` re-run.** Alert is the ONLY record affected — an earlier claim of six was a
regex error (`text warning\b` matched `text warning-foreground`), corrected in the
handoff §5.

Related: the handoff records that this same fix was nearly a no-op —
`warning-muted-foreground` originally resolved to the *same primitive* as `warning`, so
rebinding alone changed nothing and the values had to change too.

### ⚠️ Open question 2 — `destructive-muted` does not exist

Verified against `.figma-tokens-dump.json` and `tokens/globals.css`:

| Family | `-muted` | `-muted-foreground` |
|---|---|---|
| `info` | ✓ | ✓ |
| `success` | ✓ | ✓ |
| `warning` | ✓ | ✓ |
| `destructive` | **✗** | **✗** |

`destructive` has only `destructive-foreground` and `destructive-hover`. That is why the
Destructive tone falls back to `fill card` while the other three use a tinted `*-muted`
fill — **the token it would need is missing, not a design choice.** The result is that
the most severe tone is the least visually distinct.

This is the same gap the handoff's accessibility item points at from the other side: a
`destructive`-family readable/muted token *"mirroring `primary-readable`* is the shape of
the fix." Adding `destructive-muted` + `destructive-muted-foreground` would close both
this asymmetry and part of that contrast failure.

**Until the token exists, `fill card` is correct** — do not substitute an approximate
value or a raw hex. Flagged here rather than discovered at codegen, per format rule 3.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Element | A `<div>` carrying the appropriate role — **not** unconditionally `role="alert"`. |
| Role | The record is explicit: *"Only an urgent, interrupting message should use `role="alert"`; a static one uses `role="status"` or no live region at all."* This is why `live` defaults to `off`: an Alert rendered on page load with `role="alert"` interrupts the screen-reader user for a message they have not asked for. |
| Severity | **Never colour alone** (WCAG 1.4.1). Tone must be carried by the icon and the text as well — the reason `icon` exists in Table 1 despite having no Figma property. |
| Title | Rendered as a heading at the right level for its context, or given an accessible name that includes the tone. |
| Dismiss | When `onDismiss` is set the close control needs an accessible name — e.g. `"Dismiss {title}"`, not a bare "Close". |
| Keyboard | Non-interactive by default. Any `action` or dismiss control is reachable in normal reading order; no key traps. |
| Stacking | The record's `donts`: *"Do not stack several alerts competing for attention."* Multiple live regions announcing at once is the accessibility form of the same problem. |
| Contrast | Every tone's text-on-fill pairing must clear 4.5:1 in **both** modes. ⚠️ Blocked on Open question 1 — the pairing depends on which text token is actually bound. |

---

## Compiled output

```ts
interface AlertProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  tone?: 'info' | 'success' | 'warning' | 'destructive';
  onDismiss?: () => void;
  live?: 'off' | 'polite' | 'assertive';
}
```

---

## Authoring checklist

- [x] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [x] No enum in Table 1 mixes states that can co-occur at runtime — `tone` values are genuinely exclusive
- [x] No prop in Table 1 covers two concerns
- [x] Icon and content slots are typed as nodes, not booleans
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged ⚠️ — two open questions, both blocking
- [x] Table 4 is filled in for anything interactive
- [ ] **The tables compile to a valid interface with nothing invented and nothing missing** — the interface compiles, but Table 3 is not settled. Resolve both open questions before implementing.

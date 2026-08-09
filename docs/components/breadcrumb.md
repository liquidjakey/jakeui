# Breadcrumb

Hierarchical location trail.

- **Figma:** `Breadcrumb` — node `88:...`, 2 variants
- **Code:** [`components/breadcrumb.tsx`](../../components/breadcrumb.tsx) — implemented 9 Aug 2026, exports `Breadcrumb`
- **Maturity:** `draft`. Transcribed from `docs/components/Breadcrumb.doc.json`, implemented, built in Storybook — **not yet visually reviewed**
- **Format:** [props-table-format.md](../props-table-format.md)

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `items` | `BreadcrumbItem[]` | — | ✓ | The trail, root first. ⚠️ **Not a Figma property** — see Table 2. |
| `collapsed` | `boolean` | `false` | | Folds the middle behind an overflow affordance. Figma axis `Collapsed`. |
| `label` | `string` | `'Breadcrumb'` | | Accessible name for the `<nav>`. |

Where `BreadcrumbItem` is `{ label: string; href?: string }`. **The last item is the
current page** and is rendered as text, never a link.

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Home label#88:0` · `Parent label#88:3` · `Current label#88:6` | string | `items[]` | **Yes, and this is the significant one.** Figma models a **fixed three-level trail** with one property per level, because a design file cannot express a variable-length list. Code takes an array — a real trail is 2, 4 or 6 levels deep. The three Figma properties are one *example* of the array, not the API. |
| `Collapsed` | False · True | `collapsed` boolean | **Yes.** The map's `'false' \| 'true'` string union is a Figma artefact; emitted as a real boolean. |
| — | — | `label` | **Missing in Figma.** The `<nav>`'s accessible name has no visual representation, and the record requires it. |

---

## 3. State → token binding

Transcribed from `Breadcrumb.doc.json`. One row for two variants — `Collapsed=True`
carries no token delta, only a structural change.

| State | Trigger | Tokens applied |
|---|---|---|
| Base | all | fill `card` · border `1px` `border` · radius `radius/lg` · text `muted-foreground` · type `size/13` |

⚠️ **The current page has no distinct token.** `tokensUsed` lists five and everything
resolves to `muted-foreground`, so the current page would look identical to its ancestors.
Code renders it in `foreground` so the user can see where they are — asserted, not
transcribed. **Figma owes a binding for the current item.**

⚠️ **The separator has no token**, and no link/hover treatment is recorded either.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Element | The record: *"Wrap in a `nav` with an accessible name such as 'Breadcrumb'."* An ordered list inside, because the trail has a meaningful order. |
| Current page | The record: *"Mark the current page with `aria-current="page"`."* It is plain text, not a link — you do not link to where you already are. |
| Separators | The record: *"Separators are decorative and hidden from assistive technology."* `aria-hidden`, and produced by CSS rather than as text nodes. |
| Collapsed | The overflow affordance is a real button with an accessible name, not an inert ellipsis glyph. Collapsing must never hide levels from assistive technology that a sighted user could reach. |
| Keyboard | Standard link navigation. No custom key handling. |


---

## Authoring checklist

- [x] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [x] No enum in Table 1 mixes states that can co-occur at runtime
- [x] No prop in Table 1 covers two concerns
- [x] Icon and content slots are typed as nodes, not booleans
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged ⚠️ — current item, separator, link states
- [x] Table 4 is filled in for anything interactive
- [x] The tables compile to a valid interface with nothing invented and nothing missing

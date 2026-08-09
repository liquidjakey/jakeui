# Hover Card

Contextual preview surface revealed on pointer hover or keyboard focus.

- **Figma:** `Hover Card` — node `69:...`, 2 variants
- **Code:** [`components/hover-card.tsx`](../../components/hover-card.tsx) — implemented 9 Aug 2026, exports `HoverCard`
- **Maturity:** `draft`. Transcribed from `docs/components/Hover-Card.doc.json`.
- **Format:** [props-table-format.md](../props-table-format.md)

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `title` | `string` | — | ✓ | Figma property `Title#69:0`. |
| `description` | `string` | `undefined` | | Figma property `Description#69:3`. |
| `children` | `ReactElement` | — | ✓ | The trigger. Must be focusable. |
| `meta` | `ReactNode` | `undefined` | | Supporting metadata. Only meaningful at `detailed` density — see Table 2. |
| `density` | `'compact' \| 'detailed'` | `'compact'` | | Figma axis `Density`. |
| `openDelay` | `number` | `500` | | ⚠️ Not a Figma property. |
| `closeDelay` | `number` | `200` | | ⚠️ Not a Figma property. See Table 4. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Title#69:0` · `Description#69:3` | string | `title` · `description` | 1:1. |
| `Density` | Compact · Detailed | `density` **and** `meta` | **Yes.** The record: *"use compact density for brief descriptions and detailed density when supporting metadata is needed."* Density is not just spacing here — it is the presence of extra content. `density` sets the spacing; `meta` is the content it makes room for. Passing `meta` without `detailed` renders nothing, which is the honest reading of a variant that means "has more in it". |
| — | — | `children`, `openDelay`, `closeDelay` | **Missing in Figma.** |

---

## 3. State → token binding

| State | Trigger | Tokens applied |
|---|---|---|
| Base | both densities | fill `popover` · border `1px` `border` · radius `radius/lg` · text `popover-foreground` · type `size/14` |

✅ Correct surface pairing — `popover` with `popover-foreground`, matching `Popover`.

⚠️ **`Density` carries no token delta**, so spacing is raw. There is no spacing token in
this record, the same gap as Tabs' density and Table's density.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Reachability | The record is explicit and is the whole risk with this pattern: *"Reachable on keyboard focus, or its content must exist elsewhere."* Hover alone excludes keyboard and touch users entirely. |
| Escape | The record: *"Escape dismisses it."* |
| Close delay | `closeDelay` exists so the pointer can travel from trigger into the card without it vanishing. A hover surface that closes the instant the pointer leaves the trigger is unusable if it contains anything. |
| Content | Everything in it must be an enhancement of the trigger's own destination. Never the only copy of an action — that is a `Popover`. |
| Announcement | Not a live region. It appears on an intentional interaction, so it does not interrupt. |


---

## Authoring checklist

- [x] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [x] No enum in Table 1 mixes states that can co-occur at runtime
- [x] No prop in Table 1 covers two concerns
- [x] Icon and content slots are typed as nodes, not booleans
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged ⚠️ — density spacing
- [x] Table 4 is filled in for anything interactive
- [x] The tables compile to a valid interface with nothing invented and nothing missing

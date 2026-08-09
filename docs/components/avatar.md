# Avatar

Compact identity representation using initials and optional presence status.

- **Figma:** `Avatar` — node `111:25`, 6 variants
- **Code:** [`components/avatar.tsx`](../../components/avatar.tsx) — implemented 9 Aug 2026, exports `Avatar`
- **Maturity:** `draft`. Transcribed from `docs/components/Avatar.doc.json`.
- **Format:** [props-table-format.md](../props-table-format.md)

> **Unblocked 9 Aug 2026 by a correction, not by new information.** Avatar was listed as
> carrying pre-rebind stale tokens. It does not — the detection regex matched
> `text primary-foreground` when looking for `text primary`. See the handoff §5.

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `initials` | `string` | — | ✓ | Figma property `Initials#111:25`. |
| `name` | `string` | — | ✓ | Full name. The accessible name — see Table 4. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | | Figma axis `Size`. |
| `status` | `'online' \| 'offline' \| 'busy'` | `undefined` | | Presence dot. Its presence is Figma's `Type=Status` — see Table 2. |
| `src` | `string` | `undefined` | | Image, falling back to initials. ⚠️ Not a Figma property. |
| `decorative` | `boolean` | `false` | | Set when a visible name sits beside it — avoids announcing the name twice. ⚠️ Not a Figma property. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Initials#111:25` | string | `initials` | 1:1. |
| `Size` | Small · Medium · Large | `size` | 1:1, and it carries **real** deltas — radius and type size both change. |
| `Type` | Initials · Status | `status` | **Yes.** Not a mode a caller picks: an avatar has a status dot when it has a status. Passing `status` is what shows it — the same move as `Card`'s `media` slot. |
| — | — | `name`, `src` | **Missing in Figma.** The archetype requires the fallback chain: image → initials → placeholder. |

---

## 3. State → token binding

Five rows for six variants — `Size=Small, Type=Status` carries no delta.

| State | Trigger | Tokens applied |
|---|---|---|
| Small | base | fill `primary` · radius `radius/16` · text `primary-foreground` · type `size/11` |
| Medium | `size="medium"` | radius `radius/24` · type `size/14` |
| Large | `size="large"` | radius `radius/32` · type `size/18` |

✅ **The fill and text are correctly paired** — `primary` with `primary-foreground`. Worth
saying, because `Navigation Menu` binds that same `primary-foreground` on a `card` fill,
where it is invisible. The token is right; that other usage is wrong.

✅ **Size is fully tokenised** — `radius/16`, `radius/24`, `radius/32` are real variables,
one of the few places a dimension is bound rather than raw.

⚠️ **The status dot has no token.** `tokensUsed` is eight entries and none is a presence
colour. The record notes *"Avatar status dots are intent[ional]"*, so the dot is expected
— its colours are asserted from the semantic families (`success`/`muted-foreground`/
`destructive`). **Figma owes presence bindings.**

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Name | `name` is the accessible name, not `initials` — "AL" read aloud is meaningless. When the avatar sits beside a visible name it is `aria-hidden` instead, to avoid saying it twice. |
| Status | Never colour alone: the dot carries a text equivalent, so "online" is announced rather than inferred from green. |
| Image | `alt=""` when decorative beside a name; otherwise the name is the alt. |
| Keyboard | None. Not interactive unless a caller wraps it. |


---

## Authoring checklist

- [x] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [x] No enum in Table 1 mixes states that can co-occur at runtime
- [x] No prop in Table 1 covers two concerns
- [x] Icon and content slots are typed as nodes, not booleans
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged ⚠️ — the status dot
- [x] Table 4 is filled in for anything interactive
- [x] The tables compile to a valid interface with nothing invented and nothing missing

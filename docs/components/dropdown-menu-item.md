# Dropdown Menu / Item

Standard menu item with default and destructive tones.

- **Figma:** `Dropdown Menu / Item` — node `144:0`, 12 variants
- **Code:** [`components/dropdown-menu.tsx`](../../components/dropdown-menu.tsx) — implemented 9 Aug 2026, exports `DropdownMenuItem`
- **Maturity:** `draft`. **Recovered from the 8-row cap** — see below.
- **Format:** [props-table-format.md](../props-table-format.md)

---

## Recovered from the cap

12 variants = `Tone`(2) × `State`(3) × `Inset`(2). 8 rows present; 4 missing:
Default/Default/Inset, Default/Disabled/×2, Destructive/Disabled/Inset.

**`Inset` is provably inert** — every pair present binds identical tokens:

| Pair | Tokens |
|---|---|
| Destructive/Default × F,T | `text destructive` — identical |
| Destructive/Highlighted × F,T | `fill accent · text destructive` — identical |
| Default/Highlighted × F,T | `fill accent · text accent-foreground` — identical |

Three pairs, three matches. So the two Inset-only gaps carry nothing new.

⚠️ **The two `Default/Disabled` gaps rest on a weaker inference** — a single observation.
`Destructive/Disabled` binds `text destructive`, identical to `Destructive/Default`, so
Disabled contributes no delta there. Extending that across the Tone axis is one data
point, not three. It is consistent with this whole family recording no disabled tokens
anywhere, and the shared muted convention is asserted regardless — but it is weaker than
the Inset proof and is flagged as such.

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `children` | `ReactNode` | — | ✓ | Label. Figma property `Label#144:0`. |
| `onSelect` | `() => void` | — | ✓ | |
| `tone` | `'default' \| 'destructive'` | `'default'` | | Figma axis `Tone`. |
| `icon` | `ReactNode` | `undefined` | | Leading slot — the `Show icon` boolean collapses into it. |
| `shortcut` | `string` | `undefined` | | Figma property `Shortcut#144:26`; `Show shortcut` likewise collapses. |
| `inset` | `boolean` | `false` | | Figma axis `Inset`. |
| `disabled` | `boolean` | `false` | | From the decomposed `State` axis. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Label#144:0` | string | `children` | Widened. |
| `Show icon#144:13` + `Icon#259:0` | boolean + instance | `icon` | **Yes.** `kind: slot-toggle` — the boolean disappears, the nullable slot is the API. |
| `Show shortcut#144:39` + `Shortcut#144:26` | boolean + string | `shortcut` | **Yes.** Same collapse. |
| `Tone` | Default · Destructive | `tone` | 1:1. |
| `State` | Default · Highlighted · Disabled | `disabled` | **Yes.** `cssOwned: ["Highlighted"]` — the active-descendant state is CSS, never a prop. |
| `Inset` | False · True | `inset` boolean | String union → real boolean. |

---

## 3. State → token binding

| State | Trigger | Tokens applied |
|---|---|---|
| Default | base | fill `popover` · radius `radius/4` · text `popover-foreground` · type `size/13` |
| Highlighted | active descendant | fill `accent` · text `accent-foreground` |
| Destructive | `tone="destructive"` | text `destructive` |
| Destructive + highlighted | | fill `accent` · text `destructive` |
| Disabled | `disabled` | ⚠️ No delta recorded — see the weaker inference above. Muted convention asserted. |

⚠️ **Destructive highlighted keeps `destructive` text on an `accent` fill.** That is
deliberate in the record — the destructive tone survives highlighting rather than being
overridden by `accent-foreground` — but the pairing is not one the token system defines,
so its contrast is unverified.

---

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Role | `role="menuitem"`. |
| Keyboard | Arrow keys move, Enter activates, Escape closes. Owned by the menu. |
| Shortcut | `aria-hidden` — the glyphs would be read as punctuation. The shortcut must also work as a real key binding elsewhere; showing it here does not create it. |
| Destructive | Tone is not a warning on its own. A destructive item that cannot be undone needs a confirmation step. |
| Disabled | Skipped by arrow-key navigation, not merely dimmed. |

---

## Compiled output

```ts
interface DropdownMenuItemProps {
  children: React.ReactNode;
  onSelect: () => void;
  tone?: 'default' | 'destructive';
  icon?: React.ReactNode;
  shortcut?: string;
  inset?: boolean;
  disabled?: boolean;
}
```

---

## Authoring checklist

- [x] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [x] No enum in Table 1 mixes states that can co-occur at runtime
- [x] No prop in Table 1 covers two concerns
- [x] Icon and content slots are typed as nodes, not booleans — two `Show *` booleans collapsed
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged ⚠️ — disabled, destructive-on-accent contrast
- [x] Table 4 is filled in for anything interactive
- [ ] **The tables compile to a valid interface with nothing invented and nothing missing** — Inset is proven inert, but the two Disabled gaps rest on a single observation.

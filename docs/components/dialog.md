# Dialog

General-purpose modal surface for focused tasks and forms.

- **Figma:** `Dialog` — node `105:...`, 4 variants
- **Code:** [`components/dialog.tsx`](../../components/dialog.tsx) — implemented 9 Aug 2026, exports `Dialog`
- **Maturity:** `draft`. Transcribed from `docs/components/Dialog.doc.json`, implemented, built in Storybook — **not yet visually reviewed**
- **Format:** [props-table-format.md](../props-table-format.md)

> **Built on the native `<dialog>` element.** `showModal()` supplies the focus trap,
> Escape-to-close, the top layer and `::backdrop` — every keyboard and focus item in
> Table 4 — from the platform. This follows the precedent set by
> [`native-select.md`](./native-select.md): prefer the platform's own behaviour over a
> re-implementation. The shared surface lives in
> [`components/modal-surface.tsx`](../../components/modal-surface.tsx) and is used by
> `AlertDialog`, `Drawer` and `Sheet` too, so the four cannot drift apart.

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `open` | `boolean` | — | ✓ | Controlled visibility. |
| `onClose` | `() => void` | — | ✓ | Called on Escape, backdrop click, or the close control. |
| `title` | `string` | — | ✓ | Names the dialog via `aria-labelledby`. Figma property `Title#105:0`. |
| `description` | `string` | `undefined` | | Supporting line. Figma property `Description#105:5`. |
| `children` | `ReactNode` | `undefined` | | Body content. |
| `footer` | `ReactNode` | `undefined` | | Action row. ⚠️ Not a Figma property — see Table 2. |
| `type` | `'standard' \| 'form'` | `'standard'` | | Figma axis `Type`. Changes the title type size — see Table 3. |
| `size` | `'small' \| 'large'` | `'small'` | | Figma axis `Size`. Content width. ⚠️ **No token backing** — see Table 3. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Title#105:0` | string | `title` | 1:1. |
| `Description#105:5` | string | `description` | 1:1. |
| `Type` | Standard · Form | `type` | 1:1 as an enum — the values are genuinely exclusive. |
| `Size` | Small · Large | `size` | 1:1 in name, **not** in backing. See ⚠️ in Table 3. |
| — | — | `open`, `onClose` | **Missing in Figma.** A design file has no notion of controlled visibility. |
| — | — | `children`, `footer` | **Missing in Figma, and constrained.** The record is explicit: *"only the component properties defined on this set are configurable public inputs. Other embedded copy is illustrative composition content and must not be generated as a public code prop until engineering API review."* The body and action row are visible in the Figma frame but are **not** properties. They are exposed as slots, not as typed content props, which respects that instruction: a slot passes composition through without inventing an API for it. |

---

## 3. State → token binding

Transcribed from `Dialog.doc.json`. Three rows for four variants — `Type=Standard,
Size=Large` carries no delta, so nothing is truncated.

| State | Trigger | Tokens applied |
|---|---|---|
| Standard | base | fill `card` · border `1px` `border` · radius `radius/lg` · text `foreground` · type `size/18` |
| Form | `type === 'form'` | type `size/13` |

⚠️ **`Size` has no token backing.** The record says `Size` *"controls available content
width"*, but there are **no width or container tokens in the file at all** — every
`size/*` variable is a type size (10–22). The two widths are therefore raw values in
code. Flagged here rather than discovered at codegen, per format rule 3. **Figma owes
width tokens** if these are to be themable.

⚠️ **`text foreground` on a `card` fill is a semantic mismatch.** `AlertDialog` — the
same surface, same fill — binds `card-foreground` instead. Verified against
`.figma-tokens-dump.json`: both currently resolve to `neutral/950` in Light and
`neutral/50` in Dark, so **today this is invisible**. It is still worth fixing, because
the handoff already records this exact failure mode biting once: the audit's Alert
contrast fix was a no-op because `warning-muted-foreground` resolved to the same
primitive as `warning`. If `card-foreground` is ever given its own value, `Dialog`,
`Drawer` and `Sheet` break together and `AlertDialog` does not. **`card-foreground` is
the correct pairing for a `card` fill.**

⚠️ **The backdrop has no token.** `tokensUsed` lists five and none is an overlay or
scrim colour. `::backdrop` uses a neutral black at low alpha until Figma binds one.

---

## 4. Accessibility & keyboard

Everything below marked *platform* is supplied by `<dialog>.showModal()` rather than
re-implemented.

| Concern | Contract |
|---|---|
| Element | Native `<dialog>`. |
| Role | `role="dialog"` and `aria-modal="true"` are implicit to a modal `<dialog>` — *platform*. |
| Name | `aria-labelledby` points at the rendered `title`. Always present, because `title` is required. |
| Description | `aria-describedby` points at `description` when given. |
| Focus trap | Tab cycles within the dialog only — *platform*. |
| Escape | Closes — *platform*. Wired to `onClose` through the `cancel` event so controlled state stays in sync. |
| Focus return | Focus returns to the trigger on close — *platform*. |
| Backdrop click | Closes. **Not** platform: `<dialog>` has no backdrop-click behaviour, so it is implemented by comparing the click target to the dialog element. |
| Scroll lock | The top layer prevents interaction behind, but the page can still scroll — locked explicitly while open. |

---

## Compiled output

```ts
interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  type?: 'standard' | 'form';
  size?: 'small' | 'large';
}
```

---

## Authoring checklist

- [x] Every Figma variant property appears in Table 2, including ones that don't survive into code
- [x] No enum in Table 1 mixes states that can co-occur at runtime
- [x] No prop in Table 1 covers two concerns
- [x] Icon and content slots are typed as nodes, not booleans
- [x] Behavior props are present even though Figma has no equivalent
- [x] Every state in Table 3 names tokens, never hex values
- [x] Tokens lacking code syntax are flagged ⚠️ — width, the `foreground` mismatch, the backdrop
- [x] Table 4 is filled in for anything interactive
- [x] The tables compile to a valid interface with nothing invented and nothing missing

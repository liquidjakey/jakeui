# Collapsible

Single disclosure region for optional controls or secondary information.

- **Figma:** `Collapsible` — node `89:...`, 4 variants
- **Code:** [`components/collapsible.tsx`](../../components/collapsible.tsx) — implemented 9 Aug 2026, exports `Collapsible`
- **Maturity:** `draft`. Transcribed from `docs/components/Collapsible.doc.json`, implemented, built in Storybook — **not yet visually reviewed**
- **Format:** [props-table-format.md](../props-table-format.md)

> **Token-identical to [`accordion.md`](./accordion.md)** — same `tokensUsed`, same three
> state rows, same variants, same accessibility, differing only in the trigger property's
> name (`Trigger label` here, `Title` there).
>
> Unlike the Drawer/Sheet pair this is defensible. The Figma master models a **single
> disclosure item**, which is exactly what a Collapsible is; an Accordion is a *group* of
> the same item. The records match because the design file draws one thing. The record's
> own description makes the distinction: *"Use Accordion instead when multiple related
> items are grouped together."* The difference is real in code — `Accordion` takes
> `items[]` and `openIds[]`, this takes one `open` boolean.

---

## 1. Code API

| Prop | Type | Default | Req | Description |
|---|---|---|---|---|
| `triggerLabel` | `string` | — | ✓ | Figma property `Trigger label#89:0`. |
| `children` | `ReactNode` | — | ✓ | Panel content. Figma property `Content#89:5`, widened to a node. |
| `open` | `boolean` | — | ✓ | Controlled. **One boolean, not an array** — the difference from `Accordion`. |
| `onOpenChange` | `(open: boolean) => void` | — | ✓ | Fired when the trigger is activated. |
| `disabled` | `boolean` | `false` | | Disables the trigger. |

---

## 2. Figma → Code mapping

| Figma property | Figma values | Code equivalent | Not 1:1? |
|---|---|---|---|
| `Trigger label#89:0` | string | `triggerLabel` | 1:1. |
| `Content#89:5` | string | `children` | **Yes.** A `ReactNode` slot, not a string, so the panel can hold real markup. |
| `State` | Closed · Open | `open` boolean | **Yes.** The map types it `'closed' \| 'open'`. A two-value enum describing a binary is a boolean in code, and the record confirms it is persistent state: *"open/closed and disabled are persistent disclosure states."* |
| `Disabled` | False · True | `disabled` boolean | **Yes.** The map's `'false' \| 'true'` string union is a Figma artefact, not an API. |
| — | — | `onOpenChange` | **Missing in Figma.** |

---

## 3. State → token binding

Identical to [`accordion.md`](./accordion.md) Table 3 — transcribed from
`Collapsible.doc.json`, which carries the same three rows and the same seven tokens.

| State | Trigger | Tokens applied |
|---|---|---|
| Closed | base | fill `card` · border `1px` `border` · radius `radius/lg` · text `foreground` · type `size/14` |
| Open | `open === true` | No token delta — only the panel's presence changes |
| Disabled | `disabled === true` | fill `muted` · text `muted-foreground` |

⚠️ **No focus token is recorded**, same gap as Accordion.

---

## 4. Accessibility & keyboard

As [`accordion.md`](./accordion.md) Table 4, with one difference:

| Concern | Contract |
|---|---|
| Heading | **The trigger is not wrapped in a heading here.** An Accordion's items are peers in a list and benefit from heading navigation; a lone Collapsible usually sits inside content that already has its own heading, and adding another would pollute the document outline. |

---

## Compiled output

```ts
interface CollapsibleProps {
  triggerLabel: string;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean;
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
- [x] Tokens lacking code syntax are flagged ⚠️
- [x] Table 4 is filled in for anything interactive
- [x] The tables compile to a valid interface with nothing invented and nothing missing

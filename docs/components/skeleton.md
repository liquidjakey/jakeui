# Skeleton

Loading placeholder.

- **Figma:** `Skeleton` — 4 variants
- **Code:** [`components/skeleton.tsx`](../../components/skeleton.tsx) — implemented 9 Aug 2026, exports `Skeleton`
- **Maturity:** `draft`. **Read from live bindings via the Desktop Bridge**, not from the description — see `.figma-blocked-variants.json`.
- **Format:** [props-table-format.md](../props-table-format.md)

> Another **"no root-level bindings"** record.

## 1. Code API

| Prop | Type | Default | Req |
|---|---|---|---|
| `type` | `'text' \| 'avatar' \| 'card' \| 'tableRow'` | `'text'` | |
| `label` | `string` | `'Loading'` | |

## 2. Figma → Code mapping

| Figma property | Code | Not 1:1? |
|---|---|---|
| `Type` | `type` | 1:1. Changes which shapes are present, nothing else. |
| — | `label` | **Missing in Figma.** Required so the loading state is announced once. |

## 3. State → token binding

**Every shape in every variant binds `muted`.** The four types differ only in shape:

| Type | Shapes |
|---|---|
| text | 3 lines |
| avatar | circle + 2 lines |
| card | media, title, 2 description lines, meta, action |
| tableRow | 5 cells |

⚠️ No shimmer or highlight token — the pulse is opacity only, which is the safer
default anyway and respects `prefers-reduced-motion`.

## 4. Accessibility & keyboard

| Concern | Contract |
|---|---|
| Announcement | `role="status"` with `aria-busy`, announced **once**. The shapes are `aria-hidden` — announcing each placeholder would be noise. |
| Motion | Pulse only under `motion-safe`. |
| Duration | Not for waits short enough to flash, and never left up when a request fails. |

## Compiled output

```ts
interface SkeletonProps {
  type?: 'text' | 'avatar' | 'card' | 'tableRow';
  label?: string;
}
```

## Authoring checklist

- [x] Every Figma variant property appears in Table 2
- [x] No enum mixes co-occurring states
- [x] One concern per prop
- [x] Slots are nodes — *n/a*
- [x] Behavior props present
- [x] Tokens named, never hex
- [x] Missing tokens flagged ⚠️ — shimmer
- [x] Table 4 filled in
- [x] Compiles with nothing invented — *read from live bindings*

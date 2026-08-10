# Jake UI — component usage digest

**GENERATED — do not hand-edit.** Source of truth is one
`docs/components/<Name>.doc.json` record per component. Change those (or
`docs/archetypes.json`) and re-run `npm run docs:digest`.

This is the single-file surface for an agent building against Jake UI: every
component's purpose, variant meanings, state→token bindings, do/do-not rules,
accessibility contract, and the tokens it consumes.

**86 component(s) documented.**

---

## Contents

- [Accordion](#accordion)
- [Alert](#alert)
- [Alert Dialog](#alert-dialog)
- [Avatar](#avatar)
- [Badge](#badge)
- [Breadcrumb](#breadcrumb)
- [Button](#button)
- [Button Group](#button-group)
- [Calendar](#calendar)
- [Card](#card)
- [Chart](#chart)
- [Checkbox](#checkbox)
- [Collapsible](#collapsible)
- [Command](#command)
- [Command Panel](#command-panel)
- [Data Table](#data-table)
- [Date Picker](#date-picker)
- [Dialog](#dialog)
- [Drawer](#drawer)
- [Dropdown Menu](#dropdown-menu)
- [Dropdown Menu / Checkbox Item](#dropdown-menu-checkbox-item)
- [Dropdown Menu / Content](#dropdown-menu-content)
- [Dropdown Menu / Group](#dropdown-menu-group)
- [Dropdown Menu / Item](#dropdown-menu-item)
- [Dropdown Menu / Label](#dropdown-menu-label)
- [Dropdown Menu / Radio Group](#dropdown-menu-radio-group)
- [Dropdown Menu / Radio Item](#dropdown-menu-radio-item)
- [Dropdown Menu / Root Composition](#dropdown-menu-root-composition)
- [Dropdown Menu / Separator](#dropdown-menu-separator)
- [Dropdown Menu / Shortcut](#dropdown-menu-shortcut)
- [Dropdown Menu / Sub Content](#dropdown-menu-sub-content)
- [Dropdown Menu / Sub Trigger](#dropdown-menu-sub-trigger)
- [Dropdown Menu / Trigger](#dropdown-menu-trigger)
- [Field](#field)
- [Hover Card](#hover-card)
- [Icon](#icon)
- [Input](#input)
- [Label](#label)
- [Native Select](#native-select)
- [Navigation Menu](#navigation-menu)
- [Pagination](#pagination)
- [Popover](#popover)
- [Popover / Arrow](#popover-arrow)
- [Popover / Backdrop](#popover-backdrop)
- [Popover / Close](#popover-close)
- [Popover / Content](#popover-content)
- [Popover / Form Content](#popover-form-content)
- [Popover / Header](#popover-header)
- [Popover / Root Composition](#popover-root-composition)
- [Popover / RTL Content](#popover-rtl-content)
- [Popover / Trigger](#popover-trigger)
- [Popover / Viewport](#popover-viewport)
- [Progress](#progress)
- [Radio Group](#radio-group)
- [Radio Group / Field Composition](#radio-group-field-composition)
- [Radio Group / Indicator](#radio-group-indicator)
- [Radio Group / Item](#radio-group-item)
- [Radio Group / Root](#radio-group-root)
- [Scroll Area](#scroll-area)
- [Segmented Tab](#segmented-tab)
- [Separator](#separator)
- [Sheet](#sheet)
- [Sidebar](#sidebar)
- [Sidebar Navigation Item](#sidebar-navigation-item)
- [Skeleton](#skeleton)
- [Slider](#slider)
- [Switch](#switch)
- [Switch / Field Composition](#switch-field-composition)
- [Switch / Root](#switch-root)
- [Switch / Thumb](#switch-thumb)
- [Table](#table)
- [Table / Action Trigger](#table-action-trigger)
- [Table / Body](#table-body)
- [Table / Caption](#table-caption)
- [Table / Cell](#table-cell)
- [Table / Container](#table-container)
- [Table / Footer](#table-footer)
- [Table / Head](#table-head)
- [Table / Header](#table-header)
- [Table / Root Composition](#table-root-composition)
- [Table / Row](#table-row)
- [Tabs](#tabs)
- [Textarea](#textarea)
- [Toggle](#toggle)
- [Toggle Group](#toggle-group)
- [Tooltip](#tooltip)

---
## Accordion

**Disclosure component for vertically stacked question-and-answer or settings sections.**

Disclosure component for vertically stacked question-and-answer or settings sections. Use State=Open to reveal content and Disabled=True for unavailable sections. Sizing policy: fixed/default width with Hug Contents height.

Interaction contract: open/closed and disabled are persistent disclosure states. Hover, pressed, and focus-visible belong to the disclosure trigger at runtime and are not separate root variants.

**When to use**
- Let the reader collapse secondary content so the page stays scannable.

**When not to use**
- Content the reader almost always needs — show it instead of hiding it.
- Switching between peer views — use Tabs.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `state` | `closed` | Collapsed — the content is hidden. |
| `state` | `open` | Expanded — the content is revealed. |
| `disabled` | `false` | Available and interactive. |
| `disabled` | `true` | Not available; not focusable and does not respond to input. |

**State → tokens**

| State | Tokens |
|---|---|
| State=Closed, Disabled=False | fill card · border stroke/1 border · radius radius/lg · padding y space/3-5 x space/4 · gap space/3 · text foreground · type Label/LG · text muted-foreground · type Body/SM · (+1 variant share these) |
| State=Closed, Disabled=True | fill muted · border stroke/1 border · radius radius/lg · padding y space/3-5 x space/4 · gap space/3 · text muted-foreground · type Label/LG · type Body/SM · (+1 variant share these) |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Make the trigger the whole header row, not just the chevron.
- Write triggers that say what is inside.

**Do not**
- Do not hide validation errors or required form fields behind a collapsed section.
- Do not animate so slowly that opening feels unresponsive.

**Accessibility**
- Keyboard: Enter and Space toggle the section.
- Keyboard: Tab moves between triggers.
- The trigger is a button carrying aria-expanded and aria-controls.
- The panel stays in the accessibility tree only while open.

**Tokens used** — `Body/SM` · `Label/LG` · `border` · `card` · `foreground` · `muted` · `muted-foreground` · `radius/lg` · `space/3` · `space/3-5` · `space/4` · `stroke/1`

<sub>status `draft` · updated 2026-08-10 · fingerprint `e25e3044ab1d9de9` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Alert

**Inline feedback message for informational, successful, warning, and destructive states.**

Inline feedback message for informational, successful, warning, and destructive states. Use semantic feedback variables; reserve destructive tone for errors that block progress. Sizing policy: fixed/default width with Hug Contents height.

**When to use**
- Deliver an in-page message about the state of the view or a task.

**When not to use**
- A decision that must block the flow — use a Dialog.
- Transient confirmation of a completed action — use a toast.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `tone` | `info` | Informational, no action required. |
| `tone` | `success` | A completed or healthy state. |
| `tone` | `warning` | Needs attention but is not blocking. |
| `tone` | `destructive` | An error that blocks progress. |

**State → tokens**

| State | Tokens |
|---|---|
| Tone=Info | fill info-muted · border stroke/1 info · radius radius/lg · padding space/4 · gap space/3 · fill info · radius radius/12 · text card · type Value/Strong · gap space/1 · text info · type Label/LG · type Body/SM |
| Tone=Success | fill success-muted · border stroke/1 success · radius radius/lg · padding space/4 · gap space/3 · fill success · radius radius/12 · gap space/1 · text success-muted-foreground · type Label/LG · type Body/SM |
| Tone=Warning | fill warning-muted · border stroke/1 warning · radius radius/lg · padding space/4 · gap space/3 · fill warning · radius radius/12 · gap space/1 · text warning-muted-foreground · type Label/LG · type Body/SM |
| Tone=Destructive | fill destructive-muted · border stroke/1 destructive · radius radius/lg · padding space/4 · gap space/3 · fill destructive · radius radius/12 · gap space/1 · text destructive · type Label/LG · type Body/SM |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Say what happened and what to do next.
- Place it next to what it refers to.

**Do not**
- Do not stack several alerts competing for attention.
- Do not signal severity with colour alone — pair it with an icon and text.

**Accessibility**
- Role: `alert`
- Only an urgent, interrupting message should use role="alert"; a static one uses role="status" or no live region at all.
- A dismissible alert's close control needs an accessible name.

**Tokens used** — `Body/SM` · `Label/LG` · `Value/Strong` · `card` · `destructive` · `destructive-muted` · `info` · `info-muted` · `radius/12` · `radius/lg` · `space/1` · `space/3` · `space/4` · `stroke/1` · `success` · `success-muted` · `success-muted-foreground` · `warning` · `warning-muted` · `warning-muted-foreground`

<sub>status `draft` · updated 2026-08-10 · fingerprint `91f1e558c08b2705` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Alert Dialog

**Modal confirmation surface for consequential actions.**

Modal confirmation surface for consequential actions. Use Tone=Destructive only when the primary action causes irreversible loss.

**When to use**
- Interrupt for a focused task, or a decision that blocks the flow.

**When not to use**
- Non-critical messages — use an inline alert or a toast.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `tone` | `default` | Standard treatment with no semantic weight. |
| `tone` | `destructive` | An error that blocks progress. |

**State → tokens**

| State | Tokens |
|---|---|
| Tone=Default | fill card · border stroke/1 border · radius radius/lg · padding space/6 · gap space/5 · gap space/2 · text card-foreground · type Heading/LG · text muted-foreground · type Body/MD · padding y space/2 x space/3-5 · text foreground · type Label/LG · fill primary · text primary-foreground |
| Tone=Destructive | fill card · border stroke/1 border · radius radius/lg · padding space/6 · gap space/5 · gap space/2 · text card-foreground · type Heading/LG · text muted-foreground · type Body/MD · padding y space/2 x space/3-5 · text foreground · type Label/LG · fill destructive · text destructive-foreground |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Trap focus while open.
- Return focus to the trigger on close.
- Provide an explicit close affordance.

**Do not**
- Do not stack dialogs.
- Do not put long scrolling forms in a small dialog.

**Accessibility**
- Role: `dialog`
- Keyboard: Escape closes.
- Keyboard: Tab cycles within the dialog only.
- aria-modal="true", labelled by its title via aria-labelledby.
- Focus is trapped within while open.

**Tokens used** — `Body/MD` · `Heading/LG` · `Label/LG` · `border` · `card` · `card-foreground` · `destructive` · `destructive-foreground` · `foreground` · `muted-foreground` · `primary` · `primary-foreground` · `radius/lg` · `space/2` · `space/3-5` · `space/5` · `space/6` · `stroke/1`

<sub>status `draft` · updated 2026-08-10 · fingerprint `131b56a8cc88c730` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Avatar

**Compact identity representation using initials and optional presence status.**

Compact identity representation using initials and optional presence status. Use the smallest size that remains legible in context.

Layout exception: Avatar status dots are intentionally absolute-positioned to the avatar edge. This anchored overlay is not a structural layout dependency.

**When to use**
- Represent a person, account, or organisation compactly.

**When not to use**
- Decorative imagery, or a general-purpose image container.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `size` | `small` | Dense contexts — tables, toolbars, compact rows. |
| `size` | `medium` | The default in forms and dialogs. |
| `size` | `large` | Prominent or touch-first contexts. |
| `type` | `initials` | Falls back to initials when no image is available. |
| `type` | `status` | Carries a presence or status indicator. |

**State → tokens**

| State | Tokens |
|---|---|
| Size=Small, Type=Initials | fill primary · radius radius/16 · text primary-foreground · type UNBOUND 11/14 Semi Bold |
| Size=Small, Type=Status | fill primary · radius radius/16 · text primary-foreground · type UNBOUND 11/14 Semi Bold · fill success · border stroke/2 card |
| Size=Medium, Type=Initials | fill primary · radius radius/24 · text primary-foreground · type Heading/XS |
| Size=Medium, Type=Status | fill primary · radius radius/24 · text primary-foreground · type Heading/XS · fill success · border stroke/2 card |
| Size=Large, Type=Initials | fill primary · radius radius/32 · text primary-foreground · type Heading/LG |
| Size=Large, Type=Status | fill primary · radius radius/32 · text primary-foreground · type Heading/LG · fill success · border stroke/2 card |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Fall back to initials, then to a generic placeholder, when no image loads.
- Keep the shape consistent across the product.

**Do not**
- Do not put meaning in the avatar alone — pair it with a name where identity matters.

**Accessibility**
- A decorative avatar beside a visible name is alt=""; a standalone one needs the name as its accessible name.
- A status dot needs a text equivalent, not colour alone.

**Tokens used** — `Heading/LG` · `Heading/XS` · `card` · `primary` · `primary-foreground` · `radius/16` · `radius/24` · `radius/32` · `stroke/2` · `success`

<sub>status `draft` · updated 2026-08-10 · fingerprint `cc7c0d09661ecfbc` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Badge

**Compact status label.**

Compact status label. Tone communicates semantic state; size adapts to dense or standard layouts.

**When to use**
- A short status, count, or category label.

**When not to use**
- Interactive primary actions — use a Button.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `tone` | `neutral` | No semantic weight — a plain label or count. |
| `tone` | `info` | Informational, no action required. |
| `tone` | `success` | A completed or healthy state. |
| `tone` | `warning` | Needs attention but is not blocking. |
| `tone` | `destructive` | An error that blocks progress. |
| `size` | `small` | Dense contexts — tables, toolbars, compact rows. |
| `size` | `medium` | The default in forms and dialogs. |

**State → tokens**

| State | Tokens |
|---|---|
| Tone=Neutral, Size=Small | fill secondary · radius radius/lg · padding y space/0-75 x space/2 · text secondary-foreground · type Label/XS |
| Tone=Neutral, Size=Medium | fill secondary · radius radius/lg · padding y space/1-25 x space/2-5 · text secondary-foreground · type Label/SM |
| Tone=Info, Size=Small | fill info · radius radius/lg · padding y space/0-75 x space/2 · text info-foreground · type Label/XS |
| Tone=Info, Size=Medium | fill info · radius radius/lg · padding y space/1-25 x space/2-5 · text info-foreground · type Label/SM |
| Tone=Success, Size=Small | fill success · radius radius/lg · padding y space/0-75 x space/2 · text success-foreground · type Label/XS |
| Tone=Success, Size=Medium | fill success · radius radius/lg · padding y space/1-25 x space/2-5 · text success-foreground · type Label/SM |
| Tone=Warning, Size=Small | fill warning · radius radius/lg · padding y space/0-75 x space/2 · text warning-foreground · type Label/XS |
| Tone=Warning, Size=Medium | fill warning · radius radius/lg · padding y space/1-25 x space/2-5 · text warning-foreground · type Label/SM |
| Tone=Destructive, Size=Small | fill destructive · radius radius/lg · padding y space/0-75 x space/2 · text card · type Label/XS |
| Tone=Destructive, Size=Medium | fill destructive · radius radius/lg · padding y space/1-25 x space/2-5 · text card · type Label/SM |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Keep text to a word or two.
- Bind colour to a semantic tone token.

**Do not**
- Do not rely on colour alone to convey status — include text or an icon.

**Accessibility**
- Status is conveyed with text, not colour only (WCAG 1.4.1).
- A removable chip's remove control needs an accessible name, e.g. "Remove <label>".

**Tokens used** — `Label/SM` · `Label/XS` · `card` · `destructive` · `info` · `info-foreground` · `radius/lg` · `secondary` · `secondary-foreground` · `space/0-75` · `space/1-25` · `space/2` · `space/2-5` · `success` · `success-foreground` · `warning` · `warning-foreground`

<sub>status `draft` · updated 2026-08-10 · fingerprint `47d5216e186fa303` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Breadcrumb

**Hierarchical location trail.**

Hierarchical location trail. Use Collapsed=True when intermediate levels must be condensed at narrower widths. Sizing policy: Hug Contents width with fixed standard control height.

**When to use**
- Show where the current page sits in a hierarchy, and offer a way back up.

**When not to use**
- Flat sites with no hierarchy.
- Step-by-step progress through a flow — use a stepper.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `collapsed` | `false` | Every item is shown in full. |
| `collapsed` | `true` | Middle items are folded behind an overflow affordance. |

**State → tokens**

| State | Tokens |
|---|---|
| Collapsed=False | fill card · border stroke/1 border · radius radius/lg · padding y space/2-5 x space/3 · gap space/2 · text muted-foreground · type Body/SM · text foreground · type Label/MD · (+1 variant share these) |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Render the current page as plain text, not a link.
- Collapse the middle rather than wrapping to a second line.

**Do not**
- Do not use it to record visit history — it reflects hierarchy, not the back button.

**Accessibility**
- Wrap in a nav with an accessible name such as "Breadcrumb".
- Mark the current page with aria-current="page".
- Separators are decorative and hidden from assistive technology.

**Tokens used** — `Body/SM` · `Label/MD` · `border` · `card` · `foreground` · `muted-foreground` · `radius/lg` · `space/2` · `space/2-5` · `space/3` · `stroke/1`

<sub>status `draft` · updated 2026-08-10 · fingerprint `1d3c05c685985979` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Button

**Jake UI action button based on Watermelon/shadcn interaction patterns.**

Jake UI action button based on Watermelon/shadcn interaction patterns. Use semantic styles rather than hardcoded colors. Size and state are variant axes; label and leading icon are component properties.

Pipeline property contract: Leading icon is an INSTANCE_SWAP constrained to the local Icon component set; Show leading icon controls visibility. State=Focused documents focus-visible using the semantic ring token at 2px. Pointer-active/pressed behavior is runtime-only unless the code API later defines a distinct visual state.

**When to use**
- Trigger an action or event — submit, confirm, open a dialog.

**When not to use**
- Navigating between pages or URLs — use a Link.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `style` | `primary` | Highest-emphasis action. One per view. |
| `style` | `secondary` | Supporting action alongside a primary. |
| `style` | `outline` | Medium emphasis; a bordered alternative to secondary. |
| `style` | `ghost` | Lowest emphasis, for inline or toolbar actions. |
| `size` | `small` | Dense contexts — tables, toolbars, compact rows. |
| `size` | `medium` | The default in forms and dialogs. |

**State → tokens**

| State | Tokens |
|---|---|
| Style=Primary, Size=Small, State=Default | fill primary · radius radius/lg · padding y space/1-5 x space/3 · gap space/2 · text primary-foreground · type Label/MD |
| Style=Primary, Size=Small, State=Hover | fill primary-hover · radius radius/lg · padding y space/1-5 x space/3 · gap space/2 · text primary-foreground · type Label/MD |
| Style=Primary, Size=Small, State=Disabled | fill muted · radius radius/lg · padding y space/1-5 x space/3 · gap space/2 · text muted-foreground · type Label/MD · (+3 variants share these) |
| Style=Primary, Size=Medium, State=Default | fill primary · radius radius/lg · padding y space/2-25 x space/4 · gap space/2 · text primary-foreground · type Label/LG |
| Style=Primary, Size=Medium, State=Hover | fill primary-hover · radius radius/lg · padding y space/2-25 x space/4 · gap space/2 · text primary-foreground · type Label/LG |
| Style=Primary, Size=Medium, State=Disabled | fill muted · radius radius/lg · padding y space/2-25 x space/4 · gap space/2 · text muted-foreground · type Label/LG · (+3 variants share these) |
| Style=Secondary, Size=Small, State=Default | fill secondary · radius radius/lg · padding y space/1-5 x space/3 · gap space/2 · text secondary-foreground · type Label/MD |
| Style=Secondary, Size=Small, State=Hover | fill accent-hover · radius radius/lg · padding y space/1-5 x space/3 · gap space/2 · text secondary-foreground · type Label/MD |
| Style=Secondary, Size=Medium, State=Default | fill secondary · radius radius/lg · padding y space/2-25 x space/4 · gap space/2 · text secondary-foreground · type Label/LG |
| Style=Secondary, Size=Medium, State=Hover | fill accent-hover · radius radius/lg · padding y space/2-25 x space/4 · gap space/2 · text secondary-foreground · type Label/LG |
| Style=Outline, Size=Small, State=Default | border stroke/1 border · radius radius/lg · padding y space/1-5 x space/3 · gap space/2 · text foreground · type Label/MD |
| Style=Outline, Size=Small, State=Hover | fill accent-hover · border stroke/1 border · radius radius/lg · padding y space/1-5 x space/3 · gap space/2 · text accent-foreground · type Label/MD |
| Style=Outline, Size=Medium, State=Default | border stroke/1 border · radius radius/lg · padding y space/2-25 x space/4 · gap space/2 · text foreground · type Label/LG |
| Style=Outline, Size=Medium, State=Hover | fill accent-hover · border stroke/1 border · radius radius/lg · padding y space/2-25 x space/4 · gap space/2 · text accent-foreground · type Label/LG |
| Style=Ghost, Size=Small, State=Default | radius radius/lg · padding y space/1-5 x space/3 · gap space/2 · text foreground · type Label/MD |
| Style=Ghost, Size=Small, State=Hover | fill accent-hover · radius radius/lg · padding y space/1-5 x space/3 · gap space/2 · text accent-foreground · type Label/MD |
| Style=Ghost, Size=Medium, State=Default | radius radius/lg · padding y space/2-25 x space/4 · gap space/2 · text foreground · type Label/LG |
| Style=Ghost, Size=Medium, State=Hover | fill accent-hover · radius radius/lg · padding y space/2-25 x space/4 · gap space/2 · text accent-foreground · type Label/LG |
| Style=Primary, Size=Small, State=Focused | fill primary · border stroke/2 ring · radius radius/lg · padding y space/1-5 x space/3 · gap space/2 · text primary-foreground · type Label/MD |
| Style=Primary, Size=Medium, State=Focused | fill primary · border stroke/2 ring · radius radius/lg · padding y space/2-25 x space/4 · gap space/2 · text primary-foreground · type Label/LG |
| Style=Secondary, Size=Small, State=Focused | fill secondary · border stroke/2 ring · radius radius/lg · padding y space/1-5 x space/3 · gap space/2 · text secondary-foreground · type Label/MD |
| Style=Secondary, Size=Medium, State=Focused | fill secondary · border stroke/2 ring · radius radius/lg · padding y space/2-25 x space/4 · gap space/2 · text secondary-foreground · type Label/LG |
| Style=Outline, Size=Small, State=Focused | border stroke/2 ring · radius radius/lg · padding y space/1-5 x space/3 · gap space/2 · text foreground · type Label/MD · (+1 variant share these) |
| Style=Outline, Size=Medium, State=Focused | border stroke/2 ring · radius radius/lg · padding y space/2-25 x space/4 · gap space/2 · text foreground · type Label/LG · (+1 variant share these) |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Pass icons as @phosphor-icons/react components through the slot, never as text glyphs.
- Lead the label with a verb.
- Keep one primary (highest-emphasis) button per view.
- Keep labels short — around three words or fewer.

**Do not**
- Do not emit State as an enum prop. It packs states that co-occur at runtime.
- Variant count (32) exceeds the 30-combination governance ceiling. Needs a documented exception.
- Do not use a button for navigation.
- Do not stack multiple primary buttons.
- Do not disable a button without telling the user why.

**Accessibility**
- Role: `button`
- Keyboard: Enter and Space activate.
- State decomposition applies — see docs/state-decomposition.md. State [Default · Hover · Disabled · Focused] → :hover + :focus-visible CSS-owned, dropped; disabled independent boolean
- An icon-only button needs an aria-label.
- Disabled buttons are not focusable.

**Tokens used** — `Label/LG` · `Label/MD` · `accent-foreground` · `accent-hover` · `border` · `foreground` · `muted` · `muted-foreground` · `primary` · `primary-foreground` · `primary-hover` · `radius/lg` · `ring` · `secondary` · `secondary-foreground` · `space/1-5` · `space/2` · `space/2-25` · `space/3` · `space/4` · `stroke/1` · `stroke/2`

<sub>status `draft` · updated 2026-08-10 · fingerprint `3aabd366262eaf70` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:imported+best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:imported+w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Button Group

**Group related Jake UI actions using nested Button instances.**

Group related Jake UI actions using nested Button instances. Attached variants remove gaps for segmented action patterns; detached variants preserve standard spacing.

**When to use**
- Trigger an action or event — submit, confirm, open a dialog.

**When not to use**
- Navigating between pages or URLs — use a Link.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `orientation` | `horizontal` | Lays out along the inline axis. |
| `orientation` | `vertical` | Lays out along the block axis. |
| `attached` | `false` | Members keep their own borders and are separated by a gap. |
| `attached` | `true` | Members are joined into one continuous control, sharing inner borders. |

**State → tokens**

| State | Tokens |
|---|---|
| Orientation=Horizontal, Attached=False | gap space/2 · (+1 variant share these) |
| Orientation=Horizontal, Attached=True |  · (+1 variant share these) |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Lead the label with a verb.
- Keep one primary (highest-emphasis) button per view.
- Keep labels short — around three words or fewer.

**Do not**
- Do not use a button for navigation.
- Do not stack multiple primary buttons.
- Do not disable a button without telling the user why.

**Accessibility**
- Role: `button`
- Keyboard: Enter and Space activate.
- An icon-only button needs an aria-label.
- Disabled buttons are not focusable.

**Tokens used** — `space/2`

<sub>status `draft` · updated 2026-08-10 · fingerprint `e6dace531adb6e54` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Calendar

**Month calendar supporting single-date and date-range selection in compact and comfortable densities.**

Month calendar supporting single-date and date-range selection in compact and comfortable densities. Includes today, selected, range, disabled, and outside-month states. Fixed default width with Hug Contents height.

Pipeline property contract: only the component properties defined on this set are configurable public inputs. Other embedded copy is illustrative composition content and must not be generated as a public code prop until engineering API review.

Accessibility contract: month navigation controls require programmatic names such as Previous month and Next month; selected/today/range states require programmatic equivalents and must not rely on color alone.

**When to use**
- Pick a date, or a start and end pair, where the calendar context matters.

**When not to use**
- A date the user knows by heart, such as a birthdate — a plain text field is faster.
- Coarse periods like a month or quarter — offer a Select.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `mode` | `single` | Selects one value. |
| `mode` | `range` | Selects a start and end pair. |
| `density` | `compact` | Tighter spacing for information-dense screens. |
| `density` | `comfortable` | Default spacing, easier to scan and tap. |

**State → tokens**

| State | Tokens |
|---|---|
| Mode=Single, Density=Compact | fill card · border stroke/1 border · radius radius/lg · padding space/4 · gap space/3 · text foreground · type Heading/XS · gap space/1 · text muted-foreground · type Label/XS · radius radius/md · type Label/SM · border stroke/1 primary · fill primary · radius radius/16 · text primary-foreground · opacity opacity/50 |
| Mode=Single, Density=Comfortable | fill card · border stroke/1 border · radius radius/lg · padding space/4 · gap space/3 · text foreground · type Heading/XS · gap space/1-5 · text muted-foreground · type Label/XS · radius radius/md · type Label/SM · border stroke/1 primary · fill primary · radius radius/2xl · text primary-foreground · opacity opacity/50 |
| Mode=Range, Density=Compact | fill card · border stroke/1 border · radius radius/lg · padding space/4 · gap space/3 · text foreground · type Heading/XS · gap space/1 · text muted-foreground · type Label/XS · radius radius/md · type Label/SM · border stroke/1 primary · fill primary · radius radius/16 · text primary-foreground · fill accent · text accent-foreground · opacity opacity/50 |
| Mode=Range, Density=Comfortable | fill card · border stroke/1 border · radius radius/lg · padding space/4 · gap space/3 · text foreground · type Heading/XS · gap space/1-5 · text muted-foreground · type Label/XS · radius radius/md · type Label/SM · border stroke/1 primary · fill primary · radius radius/2xl · text primary-foreground · fill accent · text accent-foreground · opacity opacity/50 |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Allow typing the date as well as picking it.
- State the expected format next to the field.
- Disable out-of-range dates rather than rejecting them after submit.

**Do not**
- Do not force calendar navigation for dates far from today.
- Do not assume a locale's week start or date order.

**Accessibility**
- Keyboard: Arrow keys move by day, PageUp and PageDown by month.
- Keyboard: Escape closes the calendar and returns focus to the field.
- month navigation controls require programmatic names such as Previous month and Next month; selected/today/range states require programmatic equivalents and must not rely on color alone.
- The grid is a table with aria-selected on the chosen day.
- Announce the focused date in full, not just the day number.

**Tokens used** — `Heading/XS` · `Label/SM` · `Label/XS` · `accent` · `accent-foreground` · `border` · `card` · `foreground` · `muted-foreground` · `opacity/50` · `primary` · `primary-foreground` · `radius/16` · `radius/2xl` · `radius/lg` · `radius/md` · `space/1` · `space/1-5` · `space/3` · `space/4` · `stroke/1`

<sub>status `draft` · updated 2026-08-10 · fingerprint `55319792342f7720` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:imported+w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Card

**Content container for related information and actions.**

Content container for related information and actions. Uses a fixed default width with Hug Contents height. Content and Media structures support default and interactive states.

Pipeline API classification: apply the Governance property-classification rule before code mapping. Visual State axes are QA/story states unless engineering explicitly approves a controlled runtime prop; Viewport is responsive test data; Pattern is composition/story data.

**When to use**
- Group related content and actions about a single subject.

**When not to use**
- Primary page layout scaffolding.
- A bare list of text.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `type` | `content` | Text and actions only. |
| `type` | `media` | Leads with an image or media block. |
| `state` | `default` | Resting state. |
| `state` | `interactive` | The whole surface responds to pointer and keyboard. |

**State → tokens**

| State | Tokens |
|---|---|
| Type=Content, State=Default | fill card · border stroke/1 border · radius radius/lg · padding space/5 · gap space/4 · gap space/3 · gap space/2-5 · gap space/0-5 · text foreground · type Heading/MD · text muted-foreground · type Body/XS · type Body/MD |
| Type=Content, State=Interactive | fill card · border stroke/2 primary · radius radius/lg · padding space/5 · gap space/4 · gap space/3 · gap space/2-5 · gap space/0-5 · text foreground · type Heading/MD · text muted-foreground · type Body/XS · type Body/MD |
| Type=Media, State=Default | fill card · border stroke/1 border · radius radius/lg · padding space/5 · gap space/4 · fill muted · fill chart-1 · radius radius/sm · gap space/3 · gap space/2-5 · gap space/0-5 · text foreground · type Heading/MD · text muted-foreground · type Body/XS · type Body/MD |
| Type=Media, State=Interactive | fill card · border stroke/2 primary · radius radius/lg · padding space/5 · gap space/4 · fill muted · fill chart-1 · radius radius/sm · gap space/3 · gap space/2-5 · gap space/0-5 · text foreground · type Heading/MD · text muted-foreground · type Body/XS · type Body/MD |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Make the primary action obvious.
- Keep one main call-to-action per card.

**Do not**
- Do not nest cards more than one level.
- Do not make the whole card and an inner button separately clickable in conflicting ways.

**Accessibility**
- If the whole card is a link or button it needs an accessible name.
- Do not bury interactive controls where keyboard users reach them out of order.

**Tokens used** — `Body/MD` · `Body/XS` · `Heading/MD` · `border` · `card` · `chart-1` · `foreground` · `muted` · `muted-foreground` · `primary` · `radius/lg` · `radius/sm` · `space/0-5` · `space/2-5` · `space/3` · `space/4` · `space/5` · `stroke/1` · `stroke/2`

<sub>status `draft` · updated 2026-08-10 · fingerprint `3fe23a527ffd57d7` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Chart

**Token-bound chart container for compact documentation and dashboard examples.**

Token-bound chart container for compact documentation and dashboard examples. Use Type to switch between bar and line representations.

Layout exception: chart plot geometry is intentionally coordinate-based because bars and line points represent data positions. Surrounding chart content may use auto layout, but plot marks are excluded from structural auto-layout linting.

**When to use**
- Reveal a pattern, comparison, or trend that a table would bury.

**When not to use**
- Precise values the reader needs to read off exactly — use a table.
- A single number — use a stat or a Badge.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `type` | `bar` | Categorical comparison. |
| `type` | `line` | Change over a continuous axis. |

**State → tokens**

| State | Tokens |
|---|---|
| Type=Bar | fill card · border stroke/1 border · radius radius/lg · padding space/5 · gap space/5 · text foreground · type Heading/MD · fill chart-1 · radius radius/sm · fill chart-2 · fill chart-3 · fill chart-4 · fill chart-5 |
| Type=Line | fill card · border stroke/1 border · radius radius/lg · padding space/5 · gap space/5 · text foreground · type Heading/MD · border chart-2 · fill chart-2 |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Label axes and units directly.
- Order categories meaningfully, not alphabetically by accident.
- Bind series colour to semantic tokens so themes carry through.

**Do not**
- Do not distinguish series by colour alone — vary shape, pattern, or direct labels.
- Do not truncate a bar chart's value axis away from zero.

**Accessibility**
- Role: `img`
- Give the chart a text alternative that states the takeaway, not just the chart type.
- Offer the underlying data as a table for screen-reader and keyboard users.

**Tokens used** — `Heading/MD` · `border` · `card` · `chart-1` · `chart-2` · `chart-3` · `chart-4` · `chart-5` · `foreground` · `radius/lg` · `radius/sm` · `space/5` · `stroke/1`

<sub>status `draft` · updated 2026-08-10 · fingerprint `f93efa023de4c4c7` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Checkbox

**Jake UI checkbox based on Watermelon/shadcn patterns.**

Jake UI checkbox based on Watermelon/shadcn patterns. Value supports unchecked, checked, and indeterminate; state documents focus and disabled behavior. Sizing policy: Hug Contents width with fixed standard control height.

Pipeline API classification: apply the Governance property-classification rule before code mapping. Visual State axes are QA/story states unless engineering explicitly approves a controlled runtime prop; Viewport is responsive test data; Pattern is composition/story data.

**When to use**
- Checkbox or toggle for an independent on/off value.
- Radio for one-of-many within a group.

**When not to use**
- A single either/or action that takes effect immediately with no save — prefer a toggle over a checkbox.
- A choice that only applies after a separate Save — prefer radio or checkbox over a toggle.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `value` | `unchecked` | Not selected. |
| `value` | `checked` | Selected. |
| `value` | `indeterminate` | Partially selected — some children selected, some not. |

**State → tokens**

| State | Tokens |
|---|---|
| Value=Unchecked, State=Default | gap space/2-5 · fill card · border stroke/1 input · radius radius/4 · text primary-readable · type UNBOUND 12/14 Semi Bold · text foreground · type Label/LG |
| Value=Unchecked, State=Focused | gap space/2-5 · fill card · border stroke/2 ring · radius radius/4 · text primary-readable · type UNBOUND 12/14 Semi Bold · text foreground · type Label/LG |
| Value=Unchecked, State=Disabled | gap space/2-5 · fill muted · border stroke/1 input · radius radius/4 · text muted-foreground · type UNBOUND 12/14 Semi Bold · type Label/LG |
| Value=Checked, State=Default | gap space/2-5 · fill primary · border stroke/1 primary · radius radius/4 · text foreground · type Label/LG · (+1 variant share these) |
| Value=Checked, State=Focused | gap space/2-5 · fill primary · border stroke/2 ring · radius radius/4 · text foreground · type Label/LG · (+1 variant share these) |
| Value=Checked, State=Disabled | gap space/2-5 · fill muted · border stroke/1 primary · radius radius/4 · text muted-foreground · type Label/LG · (+1 variant share these) |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Label the control itself, not only the group.
- Make the label clickable.

**Do not**
- Do not emit State as an enum prop. It packs states that co-occur at runtime.
- Do not use a radio group for multi-select.
- Do not use a toggle for choices that only apply after a separate Save.

**Accessibility**
- Keyboard: Space toggles.
- Keyboard: Radio groups move between options with arrow keys.
- State decomposition applies — see docs/state-decomposition.md. State [Default · Focused · Disabled] → :focus-visible CSS-owned, dropped; disabled independent boolean
- State is exposed via aria-checked, never by colour alone.

**Tokens used** — `Label/LG` · `card` · `foreground` · `input` · `muted` · `muted-foreground` · `primary` · `primary-readable` · `radius/4` · `ring` · `space/2-5` · `stroke/1` · `stroke/2`

<sub>status `draft` · updated 2026-08-10 · fingerprint `8f3a6686cca614a6` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:imported+best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:imported+w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Collapsible

**Single disclosure region for optional controls or secondary information.**

Single disclosure region for optional controls or secondary information. Use Accordion instead when multiple related items are grouped together. Sizing policy: fixed/default width with Hug Contents height.

Interaction contract: open/closed and disabled are persistent disclosure states. Hover, pressed, and focus-visible belong to the disclosure trigger at runtime and are not separate root variants.

**When to use**
- Let the reader collapse secondary content so the page stays scannable.

**When not to use**
- Content the reader almost always needs — show it instead of hiding it.
- Switching between peer views — use Tabs.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `state` | `closed` | Collapsed — the content is hidden. |
| `state` | `open` | Expanded — the content is revealed. |
| `disabled` | `false` | Available and interactive. |
| `disabled` | `true` | Not available; not focusable and does not respond to input. |

**State → tokens**

| State | Tokens |
|---|---|
| State=Closed, Disabled=False | fill card · border stroke/1 border · radius radius/lg · padding y space/3 x space/3-5 · gap space/2-5 · text foreground · type Label/LG · text muted-foreground · type Body/SM · (+1 variant share these) |
| State=Closed, Disabled=True | fill muted · border stroke/1 border · radius radius/lg · padding y space/3 x space/3-5 · gap space/2-5 · text muted-foreground · type Label/LG · type Body/SM · (+1 variant share these) |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Make the trigger the whole header row, not just the chevron.
- Write triggers that say what is inside.

**Do not**
- Do not hide validation errors or required form fields behind a collapsed section.
- Do not animate so slowly that opening feels unresponsive.

**Accessibility**
- Keyboard: Enter and Space toggle the section.
- Keyboard: Tab moves between triggers.
- The trigger is a button carrying aria-expanded and aria-controls.
- The panel stays in the accessibility tree only while open.

**Tokens used** — `Body/SM` · `Label/LG` · `border` · `card` · `foreground` · `muted` · `muted-foreground` · `radius/lg` · `space/2-5` · `space/3` · `space/3-5` · `stroke/1`

<sub>status `draft` · updated 2026-08-10 · fingerprint `b4d6d01d95a5686d` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Command

**Command menu item primitive.**

Command menu item primitive. Use Selected=True for the currently highlighted result.

Interaction contract: Selected=True is the highlighted command option used for pointer or keyboard roving selection. DOM focus remains on the command input/list controller, so a separate item focus variant is not required.

**When to use**
- Give keyboard-first users a fast path to any command or destination.

**When not to use**
- The primary means of discovering features — it supplements navigation, it does not replace it.
- A small fixed set of options — use a Select or a menu.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `selected` | `false` | Not selected. |
| `selected` | `true` | Selected — the active choice in its group. |

**State → tokens**

| State | Tokens |
|---|---|
| Selected=False | radius radius/lg · padding y space/2-5 x space/3 · gap space/3 · text muted-foreground · type Body/MD · text foreground · type Label/LG · type Caption/SM |
| Selected=True | fill accent · radius radius/lg · padding y space/2-5 x space/3 · gap space/3 · text accent-foreground · type Body/MD · type Label/LG · text muted-foreground · type Caption/SM |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Show recent or suggested items before the user types.
- Group results and label the groups.
- Show the keyboard shortcut that opens it somewhere discoverable.

**Do not**
- Do not hide destructive commands in it without a confirmation step.
- Do not leave an empty result set unexplained.

**Accessibility**
- Keyboard: Arrow keys move through results, Enter runs the highlighted one.
- Keyboard: Escape closes and returns focus to the trigger.
- The input owns focus and points at the list via aria-controls and aria-activedescendant.
- Announce the result count as it changes.

**Tokens used** — `Body/MD` · `Caption/SM` · `Label/LG` · `accent` · `accent-foreground` · `foreground` · `muted-foreground` · `radius/lg` · `space/2-5` · `space/3`

<sub>status `draft` · updated 2026-08-10 · fingerprint `a0e183752c2224c4` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Command Panel

**Watermelon package-manager command panel with editable Command text.**

**When to use**
- Give keyboard-first users a fast path to any command or destination.

**When not to use**
- The primary means of discovering features — it supplements navigation, it does not replace it.
- A small fixed set of options — use a Select or a menu.

**State → tokens**

| State | Tokens |
|---|---|
| Default | fill background · border border · radius radius · shadow Effect/Code Inset · fill card · fill primary · text primary-foreground · type UNBOUND 12/auto Medium · text muted-foreground · border muted-foreground · type UNBOUND 13/20 Regular · text foreground |

**Do**
- Show recent or suggested items before the user types.
- Group results and label the groups.
- Show the keyboard shortcut that opens it somewhere discoverable.

**Do not**
- Do not hide destructive commands in it without a confirmation step.
- Do not leave an empty result set unexplained.

**Accessibility**
- Keyboard: Arrow keys move through results, Enter runs the highlighted one.
- Keyboard: Escape closes and returns focus to the trigger.
- The input owns focus and points at the list via aria-controls and aria-activedescendant.
- Announce the result count as it changes.

**Tokens used** — `Effect/Code Inset` · `background` · `border` · `card` · `foreground` · `muted-foreground` · `primary` · `primary-foreground` · `radius`

<sub>status `draft` · updated 2026-08-10 · fingerprint `17c10b595b560e7d` · provenance description:imported · dos:best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Data Table

**Data-management composition built from Input, Button, Table, and Pagination.**

Data-management composition built from Input, Button, Table, and Pagination. Supports desktop and compact viewports with populated and empty states. Fixed default width with Hug Contents height.

Pipeline property contract: only the component properties defined on this set are configurable public inputs. Other embedded copy is illustrative composition content and must not be generated as a public code prop until engineering API review.

**When to use**
- Present records across shared columns, for comparison, scanning, or exact reading.

**When not to use**
- Page layout — use a grid.
- A handful of key-value pairs — use a description list.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `state` | `populated` | Has content to show. |
| `state` | `empty` | No content — show an empty state, not a blank area. |

**State → tokens**

| State | Tokens |
|---|---|
| Viewport=Desktop, State=Populated | fill card · border stroke/1 border · radius radius/lg · padding space/5 · gap space/5 · gap space/4 · gap space/1 · text foreground · type Heading/LG · text muted-foreground · type Body/SM · gap space/3 · gap space/2 |
| Viewport=Desktop, State=Empty | fill card · border stroke/1 border · radius radius/lg · padding space/5 · gap space/5 · gap space/4 · gap space/1 · text foreground · type Heading/LG · text muted-foreground · type Body/SM · gap space/3 · gap space/2 · fill muted · padding y space/10 x space/6 · fill accent · radius radius/24 · type Heading/SM |
| Viewport=Compact, State=Populated | fill card · border stroke/1 border · radius radius/lg · padding space/5 · gap space/5 · gap space/1-5 · gap space/1 · text foreground · type Heading/LG · text muted-foreground · type Body/SM · gap space/3 · gap space/2 |
| Viewport=Compact, State=Empty | fill card · border stroke/1 border · radius radius/lg · padding space/5 · gap space/5 · gap space/1-5 · gap space/1 · text foreground · type Heading/LG · text muted-foreground · type Body/SM · gap space/3 · gap space/2 · fill muted · padding y space/10 x space/6 · fill accent · radius radius/24 · type Heading/SM |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Right-align numbers so digits line up.
- Keep the header visible while the body scrolls.
- Give empty, loading, and error states real treatments.

**Do not**
- Do not turn Viewport into a code prop.
- Do not hide the only route to an action behind row hover.
- Do not let a wide table break the page — let the table itself scroll.

**Accessibility**
- Role: `table`
- Keyboard: Interactive cells are reachable in reading order.
- Header cells are th with the right scope; a caption names the table.
- Sortable headers carry aria-sort, and the control is a button inside the th.

**Tokens used** — `Body/SM` · `Heading/LG` · `Heading/SM` · `accent` · `border` · `card` · `foreground` · `muted` · `muted-foreground` · `radius/24` · `radius/lg` · `space/1` · `space/1-5` · `space/10` · `space/2` · `space/3` · `space/4` · `space/5` · `space/6` · `stroke/1`

<sub>status `draft` · updated 2026-08-10 · fingerprint `7ab1e4cb7f533b3f` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:imported+best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Date Picker

**Date-selection composition built from Input and Calendar.**

Date-selection composition built from Input and Calendar. Supports single and range modes, open and closed states, and default, focused, error, and disabled trigger states. Fixed default width with Hug Contents height.

Pipeline property contract: only the component properties defined on this set are configurable public inputs. Other embedded copy is illustrative composition content and must not be generated as a public code prop until engineering API review.

Layout exception: Date Picker Trigger overlays a fixed semantic Calendar icon on the nested Input. The trigger frame intentionally uses coordinate positioning for this adornment; the icon is a canonical Icon instance, not a text glyph.

**When to use**
- Pick a date, or a start and end pair, where the calendar context matters.

**When not to use**
- A date the user knows by heart, such as a birthdate — a plain text field is faster.
- Coarse periods like a month or quarter — offer a Select.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `mode` | `single` | Selects one value. |
| `mode` | `range` | Selects a start and end pair. |
| `open` | `false` | Closed — the content is hidden. |
| `open` | `true` | Open — the content is revealed. |

**State → tokens**

| State | Tokens |
|---|---|
| Mode=Single, State=Default, Open=False | gap space/2 · (+9 variants share these) |
| Mode=Single, State=Error, Open=False | gap space/2 · text destructive · type Body/XS · (+3 variants share these) |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Allow typing the date as well as picking it.
- State the expected format next to the field.
- Disable out-of-range dates rather than rejecting them after submit.

**Do not**
- Do not emit State as an enum prop. It packs states that co-occur at runtime.
- Do not force calendar navigation for dates far from today.
- Do not assume a locale's week start or date order.

**Accessibility**
- Keyboard: Arrow keys move by day, PageUp and PageDown by month.
- Keyboard: Escape closes the calendar and returns focus to the field.
- State decomposition applies — see docs/state-decomposition.md. State [Default · Focused · Error · Disabled] → :focus-visible CSS-owned, dropped; invalid + disabled independent booleans
- The grid is a table with aria-selected on the chosen day.
- Announce the focused date in full, not just the day number.

**Tokens used** — `Body/XS` · `destructive` · `space/2`

<sub>status `draft` · updated 2026-08-10 · fingerprint `090bb29f59e7a98a` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:imported+best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:imported+w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Dialog

**General-purpose modal surface for focused tasks and forms.**

General-purpose modal surface for focused tasks and forms. Use Type=Standard for concise decisions and Type=Form for editable content; Size controls available content width. Sizing policy: fixed/default width with Hug Contents height.

Pipeline property contract: only the component properties defined on this set are configurable public inputs. Other embedded copy is illustrative composition content and must not be generated as a public code prop until engineering API review.

**When to use**
- Interrupt for a focused task, or a decision that blocks the flow.

**When not to use**
- Non-critical messages — use an inline alert or a toast.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `type` | `standard` | Default composition. |
| `type` | `form` | Contains editable fields; needs submit and cancel affordances. |
| `size` | `small` | Dense contexts — tables, toolbars, compact rows. |
| `size` | `large` | Prominent or touch-first contexts. |

**State → tokens**

| State | Tokens |
|---|---|
| Type=Standard, Size=Small | fill card · border stroke/1 border · radius radius/lg · padding space/6 · gap space/5 · gap space/3 · gap space/2 · text foreground · type Heading/LG · text muted-foreground · type Body/MD · padding y space/2-25 x space/3-5 · type Label/LG · fill primary · text primary-foreground · (+1 variant share these) |
| Type=Form, Size=Small | fill card · border stroke/1 border · radius radius/lg · padding space/6 · gap space/5 · gap space/3 · gap space/2 · text foreground · type Heading/LG · text muted-foreground · type Body/MD · gap space/1-5 · type Label/MD · padding y space/2-5 x space/3 · padding y space/2-25 x space/3-5 · type Label/LG · fill primary · text primary-foreground · (+1 variant share these) |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Trap focus while open.
- Return focus to the trigger on close.
- Provide an explicit close affordance.

**Do not**
- Do not stack dialogs.
- Do not put long scrolling forms in a small dialog.

**Accessibility**
- Role: `dialog`
- Keyboard: Escape closes.
- Keyboard: Tab cycles within the dialog only.
- aria-modal="true", labelled by its title via aria-labelledby.
- Focus is trapped within while open.

**Tokens used** — `Body/MD` · `Heading/LG` · `Label/LG` · `Label/MD` · `border` · `card` · `foreground` · `muted-foreground` · `primary` · `primary-foreground` · `radius/lg` · `space/1-5` · `space/2` · `space/2-25` · `space/2-5` · `space/3` · `space/3-5` · `space/5` · `space/6` · `stroke/1`

<sub>status `draft` · updated 2026-08-10 · fingerprint `de4c994e7d274d2d` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Drawer

**Edge-aligned overlay panel for filters, supplemental tasks, and contextual controls.**

Edge-aligned overlay panel for filters, supplemental tasks, and contextual controls. Placement selects the opening edge; Width controls information density.

Pipeline property contract: only the component properties defined on this set are configurable public inputs. Other embedded copy is illustrative composition content and must not be generated as a public code prop until engineering API review.

**When to use**
- Interrupt for a focused task, or a decision that blocks the flow.

**When not to use**
- Non-critical messages — use an inline alert or a toast.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `placement` | `left` | Opens from the left edge. |
| `placement` | `right` | Opens from the right edge. |
| `width` | `compact` | Narrow — for filters and short forms. |
| `width` | `wide` | Roomier — for tables and dense content. |

**State → tokens**

| State | Tokens |
|---|---|
| Placement=Left, Width=Compact | fill card · border stroke/1 border · radius radius/lg · padding space/6 · gap space/5 · gap space/3 · text foreground · type Heading/LG · text muted-foreground · type Body/MD · fill muted · padding y space/2-5 x space/3 · gap space/2 · type Label/LG · type Body/SM · fill primary · padding y space/2-25 x space/3-5 · text primary-foreground · (+3 variants share these) |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Trap focus while open.
- Return focus to the trigger on close.
- Provide an explicit close affordance.

**Do not**
- Do not stack dialogs.
- Do not put long scrolling forms in a small dialog.

**Accessibility**
- Role: `dialog`
- Keyboard: Escape closes.
- Keyboard: Tab cycles within the dialog only.
- aria-modal="true", labelled by its title via aria-labelledby.
- Focus is trapped within while open.

**Tokens used** — `Body/MD` · `Body/SM` · `Heading/LG` · `Label/LG` · `border` · `card` · `foreground` · `muted` · `muted-foreground` · `primary` · `primary-foreground` · `radius/lg` · `space/2` · `space/2-25` · `space/2-5` · `space/3` · `space/3-5` · `space/5` · `space/6` · `stroke/1`

<sub>status `draft` · updated 2026-08-10 · fingerprint `be85794451f6dd97` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Dropdown Menu

**Basic Dropdown Menu content configurations preserved from the original core build.**

Basic Dropdown Menu content configurations preserved from the original core build. This set is now the basic content-pattern layer within the full source-parity architecture; use the dedicated Trigger, Item, Checkbox Item, Radio Item, Label, Separator, Shortcut, Sub Trigger, Content, Sub Content, and Root Composition assets for complete implementation coverage. Source parity baseline: Watermelon Dropdown Menu route, Watermelon shadcn foundation, and current official shadcn/Radix Dropdown Menu anatomy and API.

Pipeline property contract: only the component properties defined on this set are configurable public inputs. Other embedded copy is illustrative composition content and must not be generated as a public code prop until engineering API review.

**When to use**
- Offer a list of actions from a trigger, when showing them all would crowd the view.

**When not to use**
- Choosing a form value — use a Select; a menu fires actions, it does not hold state.
- Primary navigation — use a navigation menu.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `type` | `standard` | Default composition. |
| `type` | `checkbox` | Items are multi-selectable. |
| `density` | `compact` | Tighter spacing for information-dense screens. |
| `density` | `comfortable` | Default spacing, easier to scan and tap. |

**State → tokens**

| State | Tokens |
|---|---|
| Type=Standard, Density=Compact | fill popover · border stroke/1 border · radius radius/lg · padding space/2 · gap space/1 · padding y space/1-75 x space/2-5 · gap space/2 · fill muted-foreground · text popover-foreground · type Label/MD · text muted-foreground · type Caption/SM · fill accent · text accent-foreground · text destructive |
| Type=Standard, Density=Comfortable | fill popover · border stroke/1 border · radius radius/lg · padding space/2 · gap space/1 · padding y space/2-25 x space/2-5 · gap space/2 · fill muted-foreground · text popover-foreground · type Label/MD · text muted-foreground · type Caption/SM · fill accent · text accent-foreground · text destructive |
| Type=Checkbox, Density=Compact | fill popover · border stroke/1 border · radius radius/lg · padding space/2 · gap space/1 · padding y space/1-75 x space/2-5 · gap space/2 · text popover-foreground · type Label/MD · text muted-foreground · type Caption/SM · fill accent · text accent-foreground · border muted-foreground |
| Type=Checkbox, Density=Comfortable | fill popover · border stroke/1 border · radius radius/lg · padding space/2 · gap space/1 · padding y space/2-25 x space/2-5 · gap space/2 · text popover-foreground · type Label/MD · text muted-foreground · type Caption/SM · fill accent · text accent-foreground · border muted-foreground |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Group related items and separate the groups.
- Put destructive items last and mark them.
- Show shortcuts alongside the items that have them.

**Do not**
- Do not nest submenus more than one level deep.
- Do not hide the only route to a critical action inside a menu.

**Accessibility**
- Role: `menu`
- Keyboard: Arrow keys move between items, Enter activates.
- Keyboard: Escape closes and returns focus to the trigger.
- Keyboard: Typing a letter jumps to the next item starting with it.
- The trigger carries aria-haspopup and aria-expanded.
- Focus moves into the menu on open and back to the trigger on close.

**Tokens used** — `Caption/SM` · `Label/MD` · `accent` · `accent-foreground` · `border` · `destructive` · `muted-foreground` · `popover` · `popover-foreground` · `radius/lg` · `space/1` · `space/1-75` · `space/2` · `space/2-25` · `space/2-5` · `stroke/1`

<sub>status `draft` · updated 2026-08-10 · fingerprint `0636e70ab8a3d393` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Dropdown Menu / Checkbox Item

**Checkable menu item with unchecked, checked, and indeterminate values plus default, highlighted, and disabled states.**

Checkable menu item with unchecked, checked, and indeterminate values plus default, highlighted, and disabled states. Source parity baseline: Watermelon Dropdown Menu route, Watermelon shadcn foundation, and current official shadcn/Radix Dropdown Menu anatomy and API.

Pipeline exception: Icon is a legacy design-only text-glyph control with existing overrides. Do not map it to a production code prop. Migration to an Icon INSTANCE_SWAP requires an approved glyph-to-icon map and consumer update test.

**When to use**
- Only inside its parent component's composition — this is a part, not a standalone component.

**When not to use**
- On its own, outside the parent that owns its behaviour and accessibility wiring.
- As a general-purpose layout or text primitive.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `value` | `unchecked` | Not selected. |
| `value` | `checked` | Selected. |
| `value` | `indeterminate` | Partially selected — some children selected, some not. |

**State → tokens**

| State | Tokens |
|---|---|
| Value=Unchecked, State=Default | fill popover · radius radius/4 · padding y space/1-5 x space/2 · gap space/2 · border stroke/1 border · radius radius/3 · text popover-foreground · type Label/MD · type UNBOUND 1/1 Regular |
| Value=Unchecked, State=Highlighted | fill accent · radius radius/4 · padding y space/1-5 x space/2 · gap space/2 · border stroke/1 border · radius radius/3 · text accent-foreground · type Label/MD · text popover-foreground · type UNBOUND 1/1 Regular |
| Value=Unchecked, State=Disabled | fill popover · radius radius/4 · padding y space/1-5 x space/2 · gap space/2 · opacity opacity/50 · border stroke/1 border · radius radius/3 · text popover-foreground · type Label/MD · type UNBOUND 1/1 Regular |
| Value=Checked, State=Default | fill popover · radius radius/4 · padding y space/1-5 x space/2 · gap space/2 · border stroke/1 primary · radius radius/3 · text popover-foreground · type Label/MD · type UNBOUND 1/1 Regular · (+1 variant share these) |
| Value=Checked, State=Highlighted | fill accent · radius radius/4 · padding y space/1-5 x space/2 · gap space/2 · border stroke/1 primary · radius radius/3 · text accent-foreground · type Label/MD · text popover-foreground · type UNBOUND 1/1 Regular · (+1 variant share these) |
| Value=Checked, State=Disabled | fill popover · radius radius/4 · padding y space/1-5 x space/2 · gap space/2 · opacity opacity/50 · border stroke/1 primary · radius radius/3 · text popover-foreground · type Label/MD · type UNBOUND 1/1 Regular · (+1 variant share these) |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Pass icons as @phosphor-icons/react components through the slot, never as text glyphs.
- Compose it through the parent rather than reaching for it directly.

**Do not**
- Do not emit State as an enum prop. It packs states that co-occur at runtime.
- Do not re-implement the parent's keyboard or focus behaviour on the part.

**Accessibility**
- State decomposition applies — see docs/state-decomposition.md. State [Default · Highlighted · Disabled] → :highlighted CSS-owned, dropped; disabled independent boolean

**Tokens used** — `Label/MD` · `accent` · `accent-foreground` · `border` · `opacity/50` · `popover` · `popover-foreground` · `primary` · `radius/3` · `radius/4` · `space/1-5` · `space/2` · `stroke/1`

<sub>status `draft` · updated 2026-08-10 · fingerprint `39df2d6bfa7be1b9` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:imported+best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:imported · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Dropdown Menu / Content

**Positioned menu content.**

Positioned menu content. Complete placement matrix: Side=Top/Right/Bottom/Left, Align=Start/Center/End, and optional Arrow. Content itself is open-only; closed behavior is represented at the Root Composition level. Source parity baseline: Watermelon Dropdown Menu route, Watermelon shadcn foundation, and current official shadcn/Radix Dropdown Menu anatomy and API.

Pipeline property contract: only the component properties defined on this set are configurable public inputs. Other embedded copy is illustrative composition content and must not be generated as a public code prop until engineering API review.

**When to use**
- Only inside its parent component's composition — this is a part, not a standalone component.

**When not to use**
- On its own, outside the parent that owns its behaviour and accessibility wiring.
- As a general-purpose layout or text primitive.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `side` | `top` | Opens above the trigger. |
| `side` | `right` | Opens to the right of the trigger. |
| `side` | `bottom` | Opens below the trigger. |
| `side` | `left` | Opens to the left of the trigger. |
| `align` | `start` | Aligns to the trigger's start edge. |
| `align` | `center` | Centres on the trigger. |
| `align` | `end` | Aligns to the trigger's end edge. |
| `arrow` | `false` | No pointer — the surface floats free of its trigger. |
| `arrow` | `true` | Shows a pointer aimed at the trigger. |

**State → tokens**

| State | Tokens |
|---|---|
| Side=Top, Align=Start, Arrow=False |  · (+11 variants share these) |
| Side=Top, Align=Start, Arrow=True | fill popover · border stroke/1 border · (+11 variants share these) |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Compose it through the parent rather than reaching for it directly.

**Do not**
- Do not re-implement the parent's keyboard or focus behaviour on the part.

**Tokens used** — `border` · `popover` · `stroke/1`

<sub>status `draft` · updated 2026-08-10 · fingerprint `d1f093480fc78643` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Dropdown Menu / Group

**Structural grouping wrapper for labels and related menu items.**

Structural grouping wrapper for labels and related menu items. It carries no visual treatment of its own. Source parity baseline: Watermelon Dropdown Menu route, Watermelon shadcn foundation, and current official shadcn/Radix Dropdown Menu anatomy and API.

**When to use**
- Only inside its parent component's composition — this is a part, not a standalone component.

**When not to use**
- On its own, outside the parent that owns its behaviour and accessibility wiring.
- As a general-purpose layout or text primitive.

**State → tokens**

| State | Tokens |
|---|---|
| Default |  |

**Do**
- Compose it through the parent rather than reaching for it directly.

**Do not**
- Do not re-implement the parent's keyboard or focus behaviour on the part.

<sub>status `draft` · updated 2026-08-10 · fingerprint `042718305b859e56` · provenance description:imported · dos:best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · states:live-bindings</sub>

---

## Dropdown Menu / Item

**Standard command item.**

Standard command item. Supports default and destructive tones, default/highlighted/disabled interaction states, inset alignment, optional leading icon, and keyboard shortcut. Source parity baseline: Watermelon Dropdown Menu route, Watermelon shadcn foundation, and current official shadcn/Radix Dropdown Menu anatomy and API.

Pipeline exception: Icon is a legacy design-only text-glyph control with existing overrides. Do not map it to a production code prop. Migration to an Icon INSTANCE_SWAP requires an approved glyph-to-icon map and consumer update test.

**When to use**
- Only inside its parent component's composition — this is a part, not a standalone component.

**When not to use**
- On its own, outside the parent that owns its behaviour and accessibility wiring.
- As a general-purpose layout or text primitive.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `tone` | `default` | Standard treatment with no semantic weight. |
| `tone` | `destructive` | An error that blocks progress. |
| `inset` | `false` | Aligned to the container's leading edge. |
| `inset` | `true` | Indented to line up with items that have a leading icon. |

**State → tokens**

| State | Tokens |
|---|---|
| Tone=Default, State=Default, Inset=False | fill popover · radius radius/4 · padding y space/1-5 x space/2 · gap space/2 · text popover-foreground · type Label/MD · text muted-foreground · type Caption/XS |
| Tone=Default, State=Default, Inset=True | fill popover · radius radius/4 · padding t space/1-5 r space/2 b space/1-5 l space/8 · gap space/2 · text popover-foreground · type Label/MD · text muted-foreground · type Caption/XS |
| Tone=Default, State=Highlighted, Inset=False | fill accent · radius radius/4 · padding y space/1-5 x space/2 · gap space/2 · text accent-foreground · type Label/MD · text muted-foreground · type Caption/XS |
| Tone=Default, State=Highlighted, Inset=True | fill accent · radius radius/4 · padding t space/1-5 r space/2 b space/1-5 l space/8 · gap space/2 · text accent-foreground · type Label/MD · text muted-foreground · type Caption/XS |
| Tone=Default, State=Disabled, Inset=False | fill popover · radius radius/4 · padding y space/1-5 x space/2 · gap space/2 · opacity opacity/50 · text popover-foreground · type Label/MD · text muted-foreground · type Caption/XS |
| Tone=Default, State=Disabled, Inset=True | fill popover · radius radius/4 · padding t space/1-5 r space/2 b space/1-5 l space/8 · gap space/2 · opacity opacity/50 · text popover-foreground · type Label/MD · text muted-foreground · type Caption/XS |
| Tone=Destructive, State=Default, Inset=False | fill popover · radius radius/4 · padding y space/1-5 x space/2 · gap space/2 · text destructive · type Label/MD · text muted-foreground · type Caption/XS |
| Tone=Destructive, State=Default, Inset=True | fill popover · radius radius/4 · padding t space/1-5 r space/2 b space/1-5 l space/8 · gap space/2 · text destructive · type Label/MD · text muted-foreground · type Caption/XS |
| Tone=Destructive, State=Highlighted, Inset=False | fill accent · radius radius/4 · padding y space/1-5 x space/2 · gap space/2 · text destructive · type Label/MD · text muted-foreground · type Caption/XS |
| Tone=Destructive, State=Highlighted, Inset=True | fill accent · radius radius/4 · padding t space/1-5 r space/2 b space/1-5 l space/8 · gap space/2 · text destructive · type Label/MD · text muted-foreground · type Caption/XS |
| Tone=Destructive, State=Disabled, Inset=False | fill popover · radius radius/4 · padding y space/1-5 x space/2 · gap space/2 · opacity opacity/50 · text destructive · type Label/MD · text muted-foreground · type Caption/XS |
| Tone=Destructive, State=Disabled, Inset=True | fill popover · radius radius/4 · padding t space/1-5 r space/2 b space/1-5 l space/8 · gap space/2 · opacity opacity/50 · text destructive · type Label/MD · text muted-foreground · type Caption/XS |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Pass icons as @phosphor-icons/react components through the slot, never as text glyphs.
- Compose it through the parent rather than reaching for it directly.

**Do not**
- Do not emit State as an enum prop. It packs states that co-occur at runtime.
- Do not re-implement the parent's keyboard or focus behaviour on the part.

**Accessibility**
- State decomposition applies — see docs/state-decomposition.md. State [Default · Highlighted · Disabled] → :highlighted CSS-owned, dropped; disabled independent boolean

**Tokens used** — `Caption/XS` · `Label/MD` · `accent` · `accent-foreground` · `destructive` · `muted-foreground` · `opacity/50` · `popover` · `popover-foreground` · `radius/4` · `space/1-5` · `space/2` · `space/8`

<sub>status `draft` · updated 2026-08-10 · fingerprint `b318f96b39186a49` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:imported+best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:imported · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Dropdown Menu / Label

**Non-focusable group label with standard or inset alignment.**

Non-focusable group label with standard or inset alignment. Source parity baseline: Watermelon Dropdown Menu route, Watermelon shadcn foundation, and current official shadcn/Radix Dropdown Menu anatomy and API.

**When to use**
- Only inside its parent component's composition — this is a part, not a standalone component.

**When not to use**
- On its own, outside the parent that owns its behaviour and accessibility wiring.
- As a general-purpose layout or text primitive.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `inset` | `false` | Aligned to the container's leading edge. |
| `inset` | `true` | Indented to line up with items that have a leading icon. |

**State → tokens**

| State | Tokens |
|---|---|
| Inset=False | fill popover · padding y space/1-25 x space/2 · text popover-foreground · type UNBOUND 12/18 Semi Bold |
| Inset=True | fill popover · padding t space/1-25 r space/2 b space/1-25 l space/8 · text popover-foreground · type UNBOUND 12/18 Semi Bold |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Compose it through the parent rather than reaching for it directly.

**Do not**
- Do not re-implement the parent's keyboard or focus behaviour on the part.

**Tokens used** — `popover` · `popover-foreground` · `space/1-25` · `space/2` · `space/8`

<sub>status `draft` · updated 2026-08-10 · fingerprint `aac63ec9a32be84e` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Dropdown Menu / Radio Group

**Structural single-selection wrapper for Radio Item instances.**

Structural single-selection wrapper for Radio Item instances. Source parity baseline: Watermelon Dropdown Menu route, Watermelon shadcn foundation, and current official shadcn/Radix Dropdown Menu anatomy and API.

**When to use**
- Only inside its parent component's composition — this is a part, not a standalone component.

**When not to use**
- On its own, outside the parent that owns its behaviour and accessibility wiring.
- As a general-purpose layout or text primitive.

**State → tokens**

| State | Tokens |
|---|---|
| Default |  |

**Do**
- Compose it through the parent rather than reaching for it directly.

**Do not**
- Do not re-implement the parent's keyboard or focus behaviour on the part.

<sub>status `draft` · updated 2026-08-10 · fingerprint `d29bbbd0a565ebc9` · provenance description:imported · dos:best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · states:live-bindings</sub>

---

## Dropdown Menu / Radio Item

**Exclusive-choice menu item used inside a Radio Group.**

Exclusive-choice menu item used inside a Radio Group. Supports checked/unchecked plus default, highlighted, and disabled states. Source parity baseline: Watermelon Dropdown Menu route, Watermelon shadcn foundation, and current official shadcn/Radix Dropdown Menu anatomy and API.

Pipeline exception: Icon is a legacy design-only text-glyph control with existing overrides. Do not map it to a production code prop. Migration to an Icon INSTANCE_SWAP requires an approved glyph-to-icon map and consumer update test.

**When to use**
- Only inside its parent component's composition — this is a part, not a standalone component.

**When not to use**
- On its own, outside the parent that owns its behaviour and accessibility wiring.
- As a general-purpose layout or text primitive.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `value` | `unchecked` | Not selected. |
| `value` | `checked` | Selected. |

**State → tokens**

| State | Tokens |
|---|---|
| Value=Unchecked, State=Default | fill popover · radius radius/4 · padding y space/1-5 x space/2 · gap space/2 · border stroke/1 border · radius radius/md · text popover-foreground · type Label/MD · type UNBOUND 1/1 Regular |
| Value=Unchecked, State=Highlighted | fill accent · radius radius/4 · padding y space/1-5 x space/2 · gap space/2 · border stroke/1 border · radius radius/md · text accent-foreground · type Label/MD · text popover-foreground · type UNBOUND 1/1 Regular |
| Value=Unchecked, State=Disabled | fill popover · radius radius/4 · padding y space/1-5 x space/2 · gap space/2 · opacity opacity/50 · border stroke/1 border · radius radius/md · text popover-foreground · type Label/MD · type UNBOUND 1/1 Regular |
| Value=Checked, State=Default | fill popover · radius radius/4 · padding y space/1-5 x space/2 · gap space/2 · border stroke/1 primary · radius radius/md · fill primary · text popover-foreground · type Label/MD · type UNBOUND 1/1 Regular |
| Value=Checked, State=Highlighted | fill accent · radius radius/4 · padding y space/1-5 x space/2 · gap space/2 · border stroke/1 primary · radius radius/md · fill primary · text accent-foreground · type Label/MD · text popover-foreground · type UNBOUND 1/1 Regular |
| Value=Checked, State=Disabled | fill popover · radius radius/4 · padding y space/1-5 x space/2 · gap space/2 · opacity opacity/50 · border stroke/1 primary · radius radius/md · fill primary · text popover-foreground · type Label/MD · type UNBOUND 1/1 Regular |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Pass icons as @phosphor-icons/react components through the slot, never as text glyphs.
- Compose it through the parent rather than reaching for it directly.

**Do not**
- Do not emit State as an enum prop. It packs states that co-occur at runtime.
- Do not re-implement the parent's keyboard or focus behaviour on the part.

**Accessibility**
- State decomposition applies — see docs/state-decomposition.md. State [Default · Highlighted · Disabled] → :highlighted CSS-owned, dropped; disabled independent boolean

**Tokens used** — `Label/MD` · `accent` · `accent-foreground` · `border` · `opacity/50` · `popover` · `popover-foreground` · `primary` · `radius/4` · `radius/md` · `space/1-5` · `space/2` · `stroke/1`

<sub>status `draft` · updated 2026-08-10 · fingerprint `55f6303422dcfbee` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:imported+best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:imported · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Dropdown Menu / Root Composition

**Complete source-parity compositions.**

Complete source-parity compositions. Patterns: Basic, Submenu, Shortcuts, Icons, Checkboxes, Checkbox Icons, Radio Group, Radio Icons, Destructive, Avatar, Complex, and RTL. Each pattern has Closed and Open states. Placement is controlled by Dropdown Menu / Content. Source parity baseline: Watermelon Dropdown Menu route, Watermelon shadcn foundation, and current official shadcn/Radix Dropdown Menu anatomy and API.

Pipeline property contract: only the component properties defined on this set are configurable public inputs. Other embedded copy is illustrative composition content and must not be generated as a public code prop until engineering API review.

**When to use**
- Offer a list of actions from a trigger, when showing them all would crowd the view.

**When not to use**
- Choosing a form value — use a Select; a menu fires actions, it does not hold state.
- Primary navigation — use a navigation menu.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `state` | `closed` | Collapsed — the content is hidden. |
| `state` | `open` | Expanded — the content is revealed. |

**State → tokens**

| State | Tokens |
|---|---|
| Pattern=Basic, State=Closed | gap space/2 · (+11 variants share these) |
| Pattern=Basic, State=Open | gap space/2 · gap space/1 · fill popover · border stroke/1 border · radius radius/lg · padding space/1 · (+10 variants share these) |
| Pattern=RTL, State=Open | gap space/2 · gap space/1 · fill popover · border stroke/1 border · radius radius/lg · padding space/1 · padding y space/1-75 x space/2 · text popover-foreground · type Label/MD |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Group related items and separate the groups.
- Put destructive items last and mark them.
- Show shortcuts alongside the items that have them.

**Do not**
- Do not turn Pattern into a code prop.
- Do not nest submenus more than one level deep.
- Do not hide the only route to a critical action inside a menu.

**Accessibility**
- Role: `menu`
- Keyboard: Arrow keys move between items, Enter activates.
- Keyboard: Escape closes and returns focus to the trigger.
- Keyboard: Typing a letter jumps to the next item starting with it.
- The trigger carries aria-haspopup and aria-expanded.
- Focus moves into the menu on open and back to the trigger on close.

**Tokens used** — `Label/MD` · `border` · `popover` · `popover-foreground` · `radius/lg` · `space/1` · `space/1-75` · `space/2` · `stroke/1`

<sub>status `draft` · updated 2026-08-10 · fingerprint `0c55d3bb9f4d4e91` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:imported+best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Dropdown Menu / Separator

**Visual separator between groups of menu items.**

Visual separator between groups of menu items. Source parity baseline: Watermelon Dropdown Menu route, Watermelon shadcn foundation, and current official shadcn/Radix Dropdown Menu anatomy and API.

**When to use**
- Only inside its parent component's composition — this is a part, not a standalone component.

**When not to use**
- On its own, outside the parent that owns its behaviour and accessibility wiring.
- As a general-purpose layout or text primitive.

**State → tokens**

| State | Tokens |
|---|---|
| Default | fill border |

**Do**
- Compose it through the parent rather than reaching for it directly.

**Do not**
- Do not re-implement the parent's keyboard or focus behaviour on the part.

**Tokens used** — `border`

<sub>status `draft` · updated 2026-08-10 · fingerprint `8a4f9e93e1c0c2f3` · provenance description:imported · dos:best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Dropdown Menu / Shortcut

**Right-aligned keyboard shortcut hint for menu commands.**

Right-aligned keyboard shortcut hint for menu commands. Source parity baseline: Watermelon Dropdown Menu route, Watermelon shadcn foundation, and current official shadcn/Radix Dropdown Menu anatomy and API.

**When to use**
- Only inside its parent component's composition — this is a part, not a standalone component.

**When not to use**
- On its own, outside the parent that owns its behaviour and accessibility wiring.
- As a general-purpose layout or text primitive.

**State → tokens**

| State | Tokens |
|---|---|
| Default | text muted-foreground · type UNBOUND 11/16 Regular |

**Do**
- Compose it through the parent rather than reaching for it directly.

**Do not**
- Do not re-implement the parent's keyboard or focus behaviour on the part.

**Tokens used** — `muted-foreground`

<sub>status `draft` · updated 2026-08-10 · fingerprint `d207774f263ce306` · provenance description:imported · dos:best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Dropdown Menu / Sub Content

**Nested submenu content with Side=Left/Right and Align=Start/Center/End.**

Nested submenu content with Side=Left/Right and Align=Start/Center/End. The anchor marker indicates the edge and alignment relative to the Sub Trigger. Source parity baseline: Watermelon Dropdown Menu route, Watermelon shadcn foundation, and current official shadcn/Radix Dropdown Menu anatomy and API.

Layout exception: Anchor marker is an absolute-positioned documentation/placement reference for submenu alignment. It is not a runtime content layer and is excluded from structural auto-layout linting.

**When to use**
- Only inside its parent component's composition — this is a part, not a standalone component.

**When not to use**
- On its own, outside the parent that owns its behaviour and accessibility wiring.
- As a general-purpose layout or text primitive.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `side` | `left` | Opens to the left of the trigger. |
| `side` | `right` | Opens to the right of the trigger. |
| `align` | `start` | Aligns to the trigger's start edge. |
| `align` | `center` | Centres on the trigger. |
| `align` | `end` | Aligns to the trigger's end edge. |

**State → tokens**

| State | Tokens |
|---|---|
| Side=Left, Align=Start | fill popover · border stroke/1 border · radius radius/lg · padding space/1 · fill accent · (+5 variants share these) |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Compose it through the parent rather than reaching for it directly.

**Do not**
- Do not re-implement the parent's keyboard or focus behaviour on the part.

**Tokens used** — `accent` · `border` · `popover` · `radius/lg` · `space/1` · `stroke/1`

<sub>status `draft` · updated 2026-08-10 · fingerprint `c1f3da80cc298902` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Dropdown Menu / Sub Trigger

**Submenu trigger with closed, open, highlighted, and disabled states plus optional inset alignment.**

Submenu trigger with closed, open, highlighted, and disabled states plus optional inset alignment. Source parity baseline: Watermelon Dropdown Menu route, Watermelon shadcn foundation, and current official shadcn/Radix Dropdown Menu anatomy and API.

Pipeline exception: Icon is a legacy design-only text-glyph control with existing overrides. Do not map it to a production code prop. Migration to an Icon INSTANCE_SWAP requires an approved glyph-to-icon map and consumer update test.

**When to use**
- Only inside its parent component's composition — this is a part, not a standalone component.

**When not to use**
- On its own, outside the parent that owns its behaviour and accessibility wiring.
- As a general-purpose layout or text primitive.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `inset` | `false` | Aligned to the container's leading edge. |
| `inset` | `true` | Indented to line up with items that have a leading icon. |

**State → tokens**

| State | Tokens |
|---|---|
| State=Closed, Inset=False | fill popover · radius radius/4 · padding y space/1-5 x space/2 · gap space/2 · text popover-foreground · type Label/MD |
| State=Closed, Inset=True | fill popover · radius radius/4 · padding t space/1-5 r space/2 b space/1-5 l space/8 · gap space/2 · text popover-foreground · type Label/MD |
| State=Open, Inset=False | fill accent · radius radius/4 · padding y space/1-5 x space/2 · gap space/2 · text accent-foreground · type Label/MD · (+1 variant share these) |
| State=Open, Inset=True | fill accent · radius radius/4 · padding t space/1-5 r space/2 b space/1-5 l space/8 · gap space/2 · text accent-foreground · type Label/MD · (+1 variant share these) |
| State=Disabled, Inset=False | fill popover · radius radius/4 · padding y space/1-5 x space/2 · gap space/2 · opacity opacity/50 · text popover-foreground · type Label/MD |
| State=Disabled, Inset=True | fill popover · radius radius/4 · padding t space/1-5 r space/2 b space/1-5 l space/8 · gap space/2 · opacity opacity/50 · text popover-foreground · type Label/MD |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Pass icons as @phosphor-icons/react components through the slot, never as text glyphs.
- Compose it through the parent rather than reaching for it directly.

**Do not**
- Do not emit State as an enum prop. It packs states that co-occur at runtime.
- Do not re-implement the parent's keyboard or focus behaviour on the part.

**Accessibility**
- State decomposition applies — see docs/state-decomposition.md. State [Closed · Open · Highlighted · Disabled] → :highlighted CSS-owned, dropped; disabled independent boolean; closed/open controlled state

**Tokens used** — `Label/MD` · `accent` · `accent-foreground` · `opacity/50` · `popover` · `popover-foreground` · `radius/4` · `space/1-5` · `space/2` · `space/8`

<sub>status `draft` · updated 2026-08-10 · fingerprint `edbda218032fb805` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:imported+best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:imported · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Dropdown Menu / Trigger

**Visual trigger patterns for the Dropdown Menu root.**

Visual trigger patterns for the Dropdown Menu root. Covers button and avatar triggers plus closed, open, focused, and disabled states where applicable. Source parity baseline: Watermelon Dropdown Menu route, Watermelon shadcn foundation, and current official shadcn/Radix Dropdown Menu anatomy and API.

Pipeline property contract: only the component properties defined on this set are configurable public inputs. Other embedded copy is illustrative composition content and must not be generated as a public code prop until engineering API review.

Accessibility contract: avatar-only menu triggers require a programmatic accessible name that communicates the menu action. Decorative trigger icons/avatars must not become the accessible name by themselves.

**When to use**
- Only inside its parent component's composition — this is a part, not a standalone component.

**When not to use**
- On its own, outside the parent that owns its behaviour and accessibility wiring.
- As a general-purpose layout or text primitive.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `type` | `button` | A conventional button triggers it. |
| `type` | `avatar` | Avatar shape — a circular image, or initials when no image is available. |

**State → tokens**

| State | Tokens |
|---|---|
| Type=Button, State=Closed | fill card · border stroke/1 border · radius radius/lg · padding y space/1-75 x space/3 · gap space/2 · text foreground · type Label/MD |
| Type=Button, State=Open | fill accent · border stroke/1 border · radius radius/lg · padding y space/1-75 x space/3 · gap space/2 · text accent-foreground · type Label/MD |
| Type=Button, State=Focused | fill card · border stroke/2 ring · radius radius/lg · padding y space/1-75 x space/3 · gap space/2 · text foreground · type Label/MD |
| Type=Button, State=Disabled | fill card · border stroke/1 border · radius radius/lg · padding y space/1-75 x space/3 · gap space/2 · opacity opacity/50 · text muted-foreground · type Label/MD |
| Type=Avatar, State=Closed | fill card · border stroke/1 border · radius radius/lg · padding y space/1 x space/1-5 · gap space/2 · fill accent · radius radius/2xl · text accent-foreground · type UNBOUND 12/16 Semi Bold |
| Type=Avatar, State=Open | fill accent · border stroke/1 border · radius radius/lg · padding y space/1 x space/1-5 · gap space/2 · radius radius/2xl · text accent-foreground · type UNBOUND 12/16 Semi Bold |
| Type=Avatar, State=Focused | fill card · border stroke/2 ring · radius radius/lg · padding y space/1 x space/1-5 · gap space/2 · fill accent · radius radius/2xl · text accent-foreground · type UNBOUND 12/16 Semi Bold |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Compose it through the parent rather than reaching for it directly.

**Do not**
- Do not emit State as an enum prop. It packs states that co-occur at runtime.
- Do not remove the ring border on focus. It is the only focus affordance.
- Do not re-implement the parent's keyboard or focus behaviour on the part.

**Accessibility**
- avatar-only menu triggers require a programmatic accessible name that communicates the menu action. Decorative trigger icons/avatars must not become the accessible name by themselves.
- State decomposition applies — see docs/state-decomposition.md. State [Closed · Open · Focused · Disabled] → :focus-visible CSS-owned, dropped; disabled independent boolean; closed/open controlled state

**Tokens used** — `Label/MD` · `accent` · `accent-foreground` · `border` · `card` · `foreground` · `muted-foreground` · `opacity/50` · `radius/2xl` · `radius/lg` · `ring` · `space/1` · `space/1-5` · `space/1-75` · `space/2` · `space/3` · `stroke/1` · `stroke/2`

<sub>status `draft` · updated 2026-08-10 · fingerprint `30d5b980f432224b` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:imported+best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:imported · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Field

**Composed form field with label, control value, and helper or error message.**

Composed form field with label, control value, and helper or error message. State documents focus, validation, and disabled behavior. Sizing policy: fixed/default width with Hug Contents height.

Accessibility contract: Error must not rely on color alone. The composed field must display a specific visible error message and runtime must expose invalid state plus the message relationship to assistive technology.

**When to use**
- Wrap a form control with its label, helper text, and error message as one unit.

**When not to use**
- A bare control that is already labelled by its surroundings.
- Page layout — it composes one field, not a form.

**State → tokens**

| State | Tokens |
|---|---|
| State=Default | gap space/1-5 · text foreground · type Label/LG · fill card · border stroke/1 input · radius radius/lg · padding y space/2-25 x space/3 · type Body/MD · text muted-foreground · type Caption/SM |
| State=Focused | gap space/1-5 · text foreground · type Label/LG · fill card · border stroke/2 ring · radius radius/lg · padding y space/2-25 x space/3 · type Body/MD · text muted-foreground · type Caption/SM |
| State=Error | gap space/1-5 · text foreground · type Label/LG · fill card · border stroke/1 destructive · radius radius/lg · padding y space/2-25 x space/3 · type Body/MD · text destructive · type Caption/SM |
| State=Disabled | gap space/1-5 · text muted-foreground · type Label/LG · fill muted · border stroke/1 input · radius radius/lg · padding y space/2-25 x space/3 · type Body/MD · type Caption/SM |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Own the label-to-control association here, so no control has to do it itself.
- Reserve space for the error message so validation does not shift the layout.
- Keep helper text and error text in the same position.

**Do not**
- Do not emit State as an enum prop. It packs states that co-occur at runtime.
- Do not let the wrapped control render its own second label.
- Do not replace helper text with the error — a user often needs both.

**Accessibility**
- Error must not rely on color alone. The composed field must display a specific visible error message and runtime must expose invalid state plus the message relationship to assistive technology.
- State decomposition applies — see docs/state-decomposition.md. State [Default · Focused · Error · Disabled] → :focus-visible CSS-owned, dropped; invalid + disabled independent booleans
- Generates the id and binds label-for, aria-describedby, and aria-invalid onto the control it wraps.
- The error message is announced politely; it is not a role="alert" per keystroke.

**Tokens used** — `Body/MD` · `Caption/SM` · `Label/LG` · `card` · `destructive` · `foreground` · `input` · `muted` · `muted-foreground` · `radius/lg` · `ring` · `space/1-5` · `space/2-25` · `space/3` · `stroke/1` · `stroke/2`

<sub>status `draft` · updated 2026-08-10 · fingerprint `7a4c2a35ce3f0008` · provenance description:imported · dos:imported+best-practice · donts:imported+best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:imported+w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Hover Card

**Contextual preview surface revealed on pointer hover or keyboard focus.**

Contextual preview surface revealed on pointer hover or keyboard focus. Use compact density for brief descriptions and detailed density when supporting metadata is needed. Sizing policy: fixed/default width with Hug Contents height.

**When to use**
- Preview the thing behind a link on hover, without making the reader navigate.

**When not to use**
- Content the user needs — hover is unavailable on touch and to many keyboard users.
- Anything required to complete a task.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `density` | `compact` | Tighter spacing for information-dense screens. |
| `density` | `detailed` | Roomier, for richer content than the default carries. |

**State → tokens**

| State | Tokens |
|---|---|
| Density=Compact | fill popover · border stroke/1 border · radius radius/lg · padding space/4 · gap space/2 · text popover-foreground · type Heading/XS · text muted-foreground · type Body/SM |
| Density=Detailed | fill popover · border stroke/1 border · radius radius/lg · padding space/4 · gap space/2 · text popover-foreground · type Heading/XS · text muted-foreground · type Body/SM · type Label/SM |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Open and close on a delay, so passing the pointer over does not trigger it.
- Keep it open while the pointer travels into it.
- Treat everything in it as an enhancement of the link's own destination.

**Do not**
- Do not place the only copy of an action inside one.
- Do not open it on click — that is a Popover.

**Accessibility**
- Reachable on keyboard focus, or its content must exist elsewhere.
- Escape dismisses it.

**Tokens used** — `Body/SM` · `Heading/XS` · `Label/SM` · `border` · `muted-foreground` · `popover` · `popover-foreground` · `radius/lg` · `space/2` · `space/4` · `stroke/1`

<sub>status `draft` · updated 2026-08-10 · fingerprint `b07eb07a2da6f00a` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Icon

**Jake UI production icons — Phosphor Icons (regular weight, @phosphor-icons/react v2).**

Jake UI production icons — Phosphor Icons (regular weight, @phosphor-icons/react v2). Variant axes: Name and Size (16/20/24). Fill binds to the foreground variable; in code the icon inherits currentColor. Name values match Phosphor React component names exactly, except SidebarSimpleRight which renders as <SidebarSimple mirrored />. Swap Name rather than copying vectors.

**When to use**
- Reinforce a label, or stand in for one where the metaphor is unambiguous and repeated.

**When not to use**
- Carrying meaning that has no text anywhere near it.
- Illustration — use an image.

**State → tokens**

| State | Tokens |
|---|---|
| Name=Plus, Size=16 | fill foreground · (+155 variants share these) |

**Do**
- Take icons from the mapped set rather than pasting one-off SVG.
- Size and colour them from tokens so they track the text they sit beside.
- Keep one metaphor for one meaning across the product.

**Do not**
- Do not use an icon alone for a destructive or unusual action.
- Do not rotate or recolour an icon to mean something new.

**Accessibility**
- A decorative icon beside text is aria-hidden="true".
- A meaningful standalone icon needs a text alternative on it or on its control.

**Tokens used** — `foreground`

<sub>status `draft` · updated 2026-08-10 · fingerprint `28e90afe2f7ba9ab` · provenance description:imported · dos:best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Input

**Single-line text input primitive.**

Single-line text input primitive. Use State variants to document focus, validation, and disabled behavior.

Accessibility contract: State=Error is only the control visual. A consuming Field or equivalent must add specific visible error text and expose invalid state plus the error-description relationship; a red border alone is insufficient.

Pipeline API classification: apply the Governance property-classification rule before code mapping. Visual State axes are QA/story states unless engineering explicitly approves a controlled runtime prop; Viewport is responsive test data; Pattern is composition/story data.

**When to use**
- Collect a single line of free-form text.

**When not to use**
- Choosing from a fixed set — use Select or Radio Group.
- Long multi-line text — use Textarea.

**State → tokens**

| State | Tokens |
|---|---|
| State=Default | fill card · border stroke/1 input · radius radius/lg · padding y space/2-25 x space/3 · text foreground · type Body/MD |
| State=Focused | fill card · border stroke/2 ring · radius radius/lg · padding y space/2-25 x space/3 · text foreground · type Body/MD |
| State=Error | fill card · border stroke/1 destructive · radius radius/lg · padding y space/2-25 x space/3 · text foreground · type Body/MD |
| State=Disabled | fill muted · border stroke/1 input · radius radius/lg · padding y space/2-25 x space/3 · text muted-foreground · type Body/MD |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Always pair with a visible label.
- Show format hints as helper text.
- Reserve space for error text so validation does not shift the layout.

**Do not**
- Do not emit State as an enum prop. It packs states that co-occur at runtime.
- Do not remove the ring border on focus. It is the only focus affordance.
- Do not use placeholder text as the only label.
- Do not validate on every keystroke before the first blur.

**Accessibility**
- Keyboard: Standard text-editing keys.
- State=Error is only the control visual. A consuming Field or equivalent must add specific visible error text and expose invalid state plus the error-description relationship; a red border alone is insufficient.
- State decomposition applies — see docs/state-decomposition.md. State [Default · Focused · Error · Disabled] → :focus-visible CSS-owned, dropped; invalid + disabled independent booleans
- Every input has a programmatically associated label.
- The error state sets aria-invalid and links its message via aria-describedby.

**Tokens used** — `Body/MD` · `card` · `destructive` · `foreground` · `input` · `muted` · `muted-foreground` · `radius/lg` · `ring` · `space/2-25` · `space/3` · `stroke/1` · `stroke/2`

<sub>status `draft` · updated 2026-08-10 · fingerprint `9b7d11054297fc8a` · provenance description:imported · dos:imported+best-practice · donts:imported+best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:imported+w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Label

**Form control label primitive.**

Form control label primitive. Required variants expose a semantic required mark; optional variants append a secondary marker.

Pipeline API classification: apply the Governance property-classification rule before code mapping. Visual State axes are QA/story states unless engineering explicitly approves a controlled runtime prop; Viewport is responsive test data; Pattern is composition/story data.

**When to use**
- Name a form control, so it is identifiable before and after it is filled.

**When not to use**
- Helper text, format hints, or validation messages — those are separate elements.
- A section heading — use a heading.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `type` | `required` | Marks a field that must be filled before submit. |
| `type` | `optional` | Marks a field that may be left empty. |
| `state` | `default` | Resting state. |
| `state` | `disabled` | Not available; not focusable and does not respond to input. |

**State → tokens**

| State | Tokens |
|---|---|
| Type=Required, State=Default | gap space/1 · text foreground · type Label/LG · text destructive |
| Type=Optional, State=Default | gap space/1 · text foreground · type Label/LG · text muted-foreground · type Caption/SM |
| Type=Required, State=Disabled | gap space/1 · text muted-foreground · type Label/LG |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Keep the label visible; do not swap it for a placeholder.
- Mark required fields consistently, and say what the marker means once.
- Write it as a noun phrase, in sentence case.

**Do not**
- Do not mark both required and optional fields — pick whichever is rarer.
- Do not truncate a label; shorten the wording instead.

**Accessibility**
- Bound to its control by for/id, so clicking the label focuses the control.
- Its text is the control's accessible name — keep it stable.

**Tokens used** — `Caption/SM` · `Label/LG` · `destructive` · `foreground` · `muted-foreground` · `space/1`

<sub>status `draft` · updated 2026-08-10 · fingerprint `ed45bf6a57ff0119` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Native Select

**Native select control styled with Jake UI semantics.**

Native select control styled with Jake UI semantics. State=Open represents keyboard or pointer interaction before the platform option menu is shown. State=Focused represents a closed select with focus-visible using the semantic ring token at 2px; State=Open represents the expanded interaction state.

Accessibility contract: State=Error is only the control visual. A consuming Field or equivalent must add specific visible error text and expose invalid state plus the error-description relationship; a red border alone is insufficient.

Pipeline API classification: apply the Governance property-classification rule before code mapping. Visual State axes are QA/story states unless engineering explicitly approves a controlled runtime prop; Viewport is responsive test data; Pattern is composition/story data.

**When to use**
- Choose one option from a fixed, known list.
- Prefer it over a custom control when the platform's own menu is acceptable — it is accessible for free and behaves correctly on mobile.

**When not to use**
- Free-form input — use Input.
- Two or three options that fit on screen — use Radio Group; the choices stay visible.
- Multi-select, option search, or rich option content — the native control cannot do these.

**State → tokens**

| State | Tokens |
|---|---|
| State=Default | fill card · border stroke/1 input · radius radius/lg · padding y space/2-25 x space/3 · gap space/2 · text foreground · type Body/MD |
| State=Open | fill card · border stroke/2 ring · radius radius/lg · padding y space/2-25 x space/3 · gap space/2 · text foreground · type Body/MD · (+1 variant share these) |
| State=Error | fill card · border stroke/1 destructive · radius radius/lg · padding y space/2-25 x space/3 · gap space/2 · text foreground · type Body/MD |
| State=Disabled | fill muted · border stroke/1 input · radius radius/lg · padding y space/2-25 x space/3 · gap space/2 · text muted-foreground · type Body/MD |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Always pair with a visible label.
- Order options meaningfully — frequency or alphabetically — not by database order.
- Make the default either a real default or an explicit unselected prompt.

**Do not**
- Do not emit State as an enum prop. It packs states that co-occur at runtime.
- Do not remove the ring border on focus. It is the only focus affordance.
- Do not use the first option as a de facto label.
- Do not restyle the platform option menu — only the closed control is yours to style.
- Do not use one for a boolean — that is a Checkbox or a Switch.

**Accessibility**
- Keyboard: Arrow keys move through options; Enter or Space opens the menu.
- Keyboard: Typing letters jumps to matching options.
- Keyboard: Escape closes the menu without changing the value.
- State=Error is only the control visual. A consuming Field or equivalent must add specific visible error text and expose invalid state plus the error-description relationship; a red border alone is insufficient.
- State decomposition applies — see docs/state-decomposition.md. State [Default · Open · Error · Disabled · Focused] → :focus-visible CSS-owned, dropped; invalid + disabled independent booleans; open controlled state
- It is a native select element, so platform semantics come for free — do not re-implement them.
- Programmatically associated label; the error state sets aria-invalid and links its message via aria-describedby.

**Tokens used** — `Body/MD` · `card` · `destructive` · `foreground` · `input` · `muted` · `muted-foreground` · `radius/lg` · `ring` · `space/2` · `space/2-25` · `space/3` · `stroke/1` · `stroke/2`

<sub>status `draft` · updated 2026-08-10 · fingerprint `1dac547ba589403e` · provenance description:imported · dos:imported+best-practice · donts:imported+best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:imported+w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Navigation Menu

**Primary product navigation with desktop and compact structures.**

Primary product navigation with desktop and compact structures. Open=True reveals the navigation panel; compact mode replaces the link row with a menu trigger. Sizing policy: open states use fixed width plus Hug height; closed states intentionally preserve the standard 56px navigation-bar height.

Pipeline property contract: only the component properties defined on this set are configurable public inputs. Other embedded copy is illustrative composition content and must not be generated as a public code prop until engineering API review.

**When to use**
- Present the product's top-level destinations, with room for grouped sub-items.

**When not to use**
- Firing actions — use a menu.
- A single flat list of two or three links — plain links are enough.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `open` | `false` | Closed — the content is hidden. |
| `open` | `true` | Open — the content is revealed. |

**State → tokens**

| State | Tokens |
|---|---|
| Viewport=Desktop, Open=False | fill card · border stroke/1 border · radius radius/lg · padding y space/2 x space/3 · gap space/3 · text foreground · type Heading/SM · gap space/1-5 · fill accent · padding y space/2 x space/2-5 · type Label/MD · fill primary · text primary-foreground |
| Viewport=Desktop, Open=True | fill card · border stroke/1 border · radius radius/lg · padding y space/2 x space/3 · gap space/3 · text foreground · type Heading/SM · gap space/1-5 · fill accent · padding y space/2 x space/2-5 · text accent-foreground · type Label/MD · fill primary · text primary-foreground · fill muted · padding space/4 · padding space/2-5 · gap space/1 · text muted-foreground · type Body/XS |
| Viewport=Compact, Open=False | fill card · border stroke/1 border · radius radius/lg · padding y space/2 x space/3 · gap space/3 · text foreground · type Heading/SM · fill muted · padding y space/2 x space/2-5 · gap space/1-5 · type Label/MD |
| Viewport=Compact, Open=True | fill card · border stroke/1 border · radius radius/lg · padding y space/2 x space/3 · gap space/3 · text foreground · type Heading/SM · fill accent · padding y space/2 x space/2-5 · gap space/1-5 · text accent-foreground · type Label/MD · fill muted · padding space/4 · padding space/2-5 · gap space/1 · text muted-foreground · type Body/XS |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Mark the current destination.
- Keep the order stable between sessions and roles.

**Do not**
- Do not turn Viewport into a code prop.
- Do not hide a whole section behind hover alone.
- Do not nest destinations deeper than two levels.

**Accessibility**
- Role: `navigation`
- Keyboard: Arrow keys move within a group; Tab moves between groups.
- Wrapped in a nav with an accessible name.
- The current destination carries aria-current="page".

**Tokens used** — `Body/XS` · `Heading/SM` · `Label/MD` · `accent` · `accent-foreground` · `border` · `card` · `foreground` · `muted` · `muted-foreground` · `primary` · `primary-foreground` · `radius/lg` · `space/1` · `space/1-5` · `space/2` · `space/2-5` · `space/3` · `space/4` · `stroke/1`

<sub>status `draft` · updated 2026-08-10 · fingerprint `8410c1e3ff320d61` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:imported+best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Pagination

**Navigate paged datasets or long collections.**

Navigate paged datasets or long collections. Desktop exposes page numbers; Compact uses a concise page summary. Sizing policy: Hug Contents width with fixed standard control height.

Pipeline property contract: only the component properties defined on this set are configurable public inputs. Other embedded copy is illustrative composition content and must not be generated as a public code prop until engineering API review.

**When to use**
- Break a long result set into pages the reader can move through and return to.

**When not to use**
- A feed meant to be browsed continuously — use infinite scroll or a load-more control.
- Result sets short enough to show at once.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `state` | `default` | Resting state. |
| `state` | `disabled` | Not available; not focusable and does not respond to input. |

**State → tokens**

| State | Tokens |
|---|---|
| Viewport=Desktop, State=Default | fill card · padding y space/1-5 x space/2 · gap space/2 · border stroke/1 border · radius radius/lg · padding y space/2 x space/2-5 · gap space/1 · text foreground · type Label/MD · fill primary · text primary-foreground |
| Viewport=Desktop, State=Disabled | fill card · padding y space/1-5 x space/2 · gap space/2 · border stroke/1 border · radius radius/lg · padding y space/2 x space/2-5 · gap space/1 · opacity UNTOKENISED 0.45 · text foreground · type Label/MD · fill primary · text primary-foreground |
| Viewport=Compact, State=Default | fill card · padding y space/1-5 x space/2 · gap space/2 · border stroke/1 border · radius radius/lg · padding y space/2 x space/2-5 · gap space/1 · text foreground · type Label/MD |
| Viewport=Compact, State=Disabled | fill card · padding y space/1-5 x space/2 · gap space/2 · border stroke/1 border · radius radius/lg · padding y space/2 x space/2-5 · gap space/1 · opacity UNTOKENISED 0.45 · text foreground · type Label/MD · text muted-foreground |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Show the current page and the total.
- Keep previous and next in the same place as the page count changes.
- Disable rather than hide the controls at the first and last page.

**Do not**
- Do not turn Viewport into a code prop.
- Do not reset filters or sort when the page changes.
- Do not make the hit targets smaller than the surrounding controls.

**Accessibility**
- Role: `navigation`
- Keyboard: Every control is reachable in reading order.
- Wrapped in a nav named e.g. "Pagination".
- The current page carries aria-current="page"; disabled controls stay announced.

**Tokens used** — `Label/MD` · `border` · `card` · `foreground` · `muted-foreground` · `primary` · `primary-foreground` · `radius/lg` · `space/1` · `space/1-5` · `space/2` · `space/2-5` · `stroke/1`

<sub>status `draft` · updated 2026-08-10 · fingerprint `e91a6b2e7d25e70d` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:imported+best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Popover

**Jake UI Popover content extension with Small/Large size and optional arrow.**

Jake UI Popover content extension with Small/Large size and optional arrow. Exact source anatomy, placement, behaviors, and examples are implemented by the Popover / * parity assets.

Pipeline property contract: only the component properties defined on this set are configurable public inputs. Other embedded copy is illustrative composition content and must not be generated as a public code prop until engineering API review.

**When to use**
- Show secondary content or a small task in context, anchored to its trigger.

**When not to use**
- A decision that must block the flow — use a Dialog.
- A plain text hint — use a Tooltip.
- A list of actions — use a menu.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `size` | `small` | Dense contexts — tables, toolbars, compact rows. |
| `size` | `large` | Prominent or touch-first contexts. |
| `arrow` | `false` | No pointer — the surface floats free of its trigger. |
| `arrow` | `true` | Shows a pointer aimed at the trigger. |

**State → tokens**

| State | Tokens |
|---|---|
| Size=Small, Arrow=False | fill popover · border stroke/1 border · radius radius/lg · padding space/4 · gap space/2-5 · text popover-foreground · type UNBOUND 15/22 Medium · text muted-foreground · type Body/SM · fill primary · padding y space/2 x space/3 · gap space/2 · text primary-foreground · type Label/MD · (+3 variants share these) |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Anchor it to the trigger and flip it when it would overflow the viewport.
- Give it an explicit close affordance.
- Return focus to the trigger on close.

**Do not**
- Do not open one from inside another.
- Do not put a long scrolling form in one.

**Accessibility**
- Role: `dialog`
- Keyboard: Escape closes.
- Keyboard: Tab moves through the content, then out.
- The trigger carries aria-expanded and aria-controls.
- A popover holding a form should trap focus; a non-modal one should not.

**Tokens used** — `Body/SM` · `Label/MD` · `border` · `muted-foreground` · `popover` · `popover-foreground` · `primary` · `primary-foreground` · `radius/lg` · `space/2` · `space/2-5` · `space/3` · `space/4` · `stroke/1`

<sub>status `draft` · updated 2026-08-10 · fingerprint `5eb84aa6385d0d9c` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Popover / Arrow

**Pointing Arrow for all four popup sides.**

Pointing Arrow for all four popup sides. The arrow inherits Popover surface and border variables and aligns through the Content placement matrix.

**When to use**
- Only inside its parent component's composition — this is a part, not a standalone component.

**When not to use**
- On its own, outside the parent that owns its behaviour and accessibility wiring.
- As a general-purpose layout or text primitive.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `side` | `top` | Opens above the trigger. |
| `side` | `right` | Opens to the right of the trigger. |
| `side` | `bottom` | Opens below the trigger. |
| `side` | `left` | Opens to the left of the trigger. |

**State → tokens**

| State | Tokens |
|---|---|
| Side=Top | fill popover · border border · (+3 variants share these) |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Compose it through the parent rather than reaching for it directly.

**Do not**
- Do not re-implement the parent's keyboard or focus behaviour on the part.

**Tokens used** — `border` · `popover`

<sub>status `draft` · updated 2026-08-10 · fingerprint `82eaea81dfd8fc2c` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Popover / Backdrop

**Backdrop states for modal and trap-focus Popover modes.**

Backdrop states for modal and trap-focus Popover modes. Non-modal mode intentionally has no backdrop. Starting and ending animation states are documented rather than multiplied as static variants.

Pipeline API classification: apply the Governance property-classification rule before code mapping. Visual State axes are QA/story states unless engineering explicitly approves a controlled runtime prop; Viewport is responsive test data; Pattern is composition/story data.

**When to use**
- Only inside its parent component's composition — this is a part, not a standalone component.

**When not to use**
- On its own, outside the parent that owns its behaviour and accessibility wiring.
- As a general-purpose layout or text primitive.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `mode` | `modal` | Blocks the page behind it until dismissed. |
| `mode` | `trapFocus` | Keeps keyboard focus inside while open. |
| `state` | `closed` | Collapsed — the content is hidden. |
| `state` | `open` | Expanded — the content is revealed. |

**State → tokens**

| State | Tokens |
|---|---|
| Mode=Modal, State=Closed | fill foreground · opacity opacity/0 · (+1 variant share these) |
| Mode=Modal, State=Open | fill foreground · opacity UNTOKENISED 0.32 |
| Mode=Trap Focus, State=Open | fill foreground · opacity UNTOKENISED 0.16 |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Compose it through the parent rather than reaching for it directly.

**Do not**
- Do not re-implement the parent's keyboard or focus behaviour on the part.

**Tokens used** — `foreground` · `opacity/0`

<sub>status `draft` · updated 2026-08-10 · fingerprint `9b21462cf1b84e70` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Popover / Close

**Explicit close control for Popover content.**

Explicit close control for Popover content. States cover default, hover, focus-visible, and disabled. Runtime requires an accessible name.

Accessibility contract: icon-only close control requires a programmatic accessible name such as “Close” and a visible focus indicator; the icon itself is decorative to assistive technology.

**When to use**
- Only inside its parent component's composition — this is a part, not a standalone component.

**When not to use**
- On its own, outside the parent that owns its behaviour and accessibility wiring.
- As a general-purpose layout or text primitive.

**State → tokens**

| State | Tokens |
|---|---|
| State=Default | fill popover · radius radius/7 |
| State=Hover | fill accent · radius radius/7 |
| State=Focused | fill accent · border stroke/2 ring · radius radius/7 |
| State=Disabled | fill popover · radius radius/7 · opacity opacity/50 |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Compose it through the parent rather than reaching for it directly.

**Do not**
- Do not emit State as an enum prop. It packs states that co-occur at runtime.
- Do not remove the ring border on focus. It is the only focus affordance.
- Do not re-implement the parent's keyboard or focus behaviour on the part.

**Accessibility**
- icon-only close control requires a programmatic accessible name such as “Close” and a visible focus indicator; the icon itself is decorative to assistive technology.
- State decomposition applies — see docs/state-decomposition.md. State [Default · Hover · Focused · Disabled] → :hover + :focus-visible CSS-owned, dropped; disabled independent boolean

**Tokens used** — `accent` · `opacity/50` · `popover` · `radius/7` · `ring` · `stroke/2`

<sub>status `draft` · updated 2026-08-10 · fingerprint `ece7ae5a70bc6ff8` · provenance description:imported · dos:imported+best-practice · donts:imported+best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:imported · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Popover / Content

**Complete Popover Content matrix: Size × Side × Align × Arrow.**

Complete Popover Content matrix: Size × Side × Align × Arrow. Uses nested Header, Close, and Arrow assets. Positioner, collision, offset, focus, outside-interaction, and portal behavior are documented in the specification.

Variant-matrix exception: the 48-variant Arrow axis is retained for current consumer compatibility. Refactoring Arrow to a boolean property is a breaking migration and requires consumer-file validation.

**When to use**
- Only inside its parent component's composition — this is a part, not a standalone component.

**When not to use**
- On its own, outside the parent that owns its behaviour and accessibility wiring.
- As a general-purpose layout or text primitive.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `size` | `small` | Dense contexts — tables, toolbars, compact rows. |
| `size` | `large` | Prominent or touch-first contexts. |
| `side` | `top` | Opens above the trigger. |
| `side` | `right` | Opens to the right of the trigger. |
| `side` | `bottom` | Opens below the trigger. |
| `side` | `left` | Opens to the left of the trigger. |
| `align` | `start` | Aligns to the trigger's start edge. |
| `align` | `center` | Centres on the trigger. |
| `align` | `end` | Aligns to the trigger's end edge. |
| `arrow` | `false` | No pointer — the surface floats free of its trigger. |
| `arrow` | `true` | Shows a pointer aimed at the trigger. |

**State → tokens**

| State | Tokens |
|---|---|
| Size=Small, Side=Top, Align=Start, Arrow=False | fill popover · border stroke/1 border · radius radius/lg · padding space/4 · gap space/3 · gap space/1-5 · text muted-foreground · type Body/XS · gap space/2 · text primary-readable · type Label/XS · (+47 variants share these) |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Pass icons as @phosphor-icons/react components through the slot, never as text glyphs.
- Compose it through the parent rather than reaching for it directly.

**Do not**
- Variant count (48) exceeds the 30-combination governance ceiling. Needs a documented exception.
- Do not re-implement the parent's keyboard or focus behaviour on the part.

**Tokens used** — `Body/XS` · `Label/XS` · `border` · `muted-foreground` · `popover` · `primary-readable` · `radius/lg` · `space/1-5` · `space/2` · `space/3` · `space/4` · `stroke/1`

<sub>status `draft` · updated 2026-08-10 · fingerprint `b5b1b1e76cf4d80d` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:imported+best-practice · whenToUse:best-practice · whenNotToUse:best-practice · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Popover / Form Content

**Source form-content composition using Header, Close, Arrow, and two linked Field instances.**

Source form-content composition using Header, Close, Arrow, and two linked Field instances. Represents the “With Form” example.

**When to use**
- Only inside its parent component's composition — this is a part, not a standalone component.

**When not to use**
- On its own, outside the parent that owns its behaviour and accessibility wiring.
- As a general-purpose layout or text primitive.

**State → tokens**

| State | Tokens |
|---|---|
| Default | fill popover · border border |

**Do**
- Compose it through the parent rather than reaching for it directly.

**Do not**
- Do not re-implement the parent's keyboard or focus behaviour on the part.

**Tokens used** — `border` · `popover`

<sub>status `draft` · updated 2026-08-10 · fingerprint `bd1fd049b543579c` · provenance description:imported · dos:best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Popover / Header

**Popover heading group containing Title and Description.**

Popover heading group containing Title and Description. Both text nodes are editable component properties and should be associated with the popup for accessible naming and description.

**When to use**
- Only inside its parent component's composition — this is a part, not a standalone component.

**When not to use**
- On its own, outside the parent that owns its behaviour and accessibility wiring.
- As a general-purpose layout or text primitive.

**State → tokens**

| State | Tokens |
|---|---|
| Default | text popover-foreground · type UNBOUND 14/20 Semi Bold · text muted-foreground · type UNBOUND 12/18 Regular |

**Do**
- Compose it through the parent rather than reaching for it directly.

**Do not**
- Do not re-implement the parent's keyboard or focus behaviour on the part.

**Tokens used** — `muted-foreground` · `popover-foreground`

<sub>status `draft` · updated 2026-08-10 · fingerprint `726b7590af9b7d0a` · provenance description:imported · dos:best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Popover / Root Composition

**Source usage patterns with open and closed states: Basic, Align, With Form, and RTL.**

Source usage patterns with open and closed states: Basic, Align, With Form, and RTL. Content placement details are delegated to the complete Popover / Content matrix.

Pipeline API classification: apply the Governance property-classification rule before code mapping. Visual State axes are QA/story states unless engineering explicitly approves a controlled runtime prop; Viewport is responsive test data; Pattern is composition/story data.

**When to use**
- Show secondary content or a small task in context, anchored to its trigger.

**When not to use**
- A decision that must block the flow — use a Dialog.
- A plain text hint — use a Tooltip.
- A list of actions — use a menu.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `state` | `closed` | Collapsed — the content is hidden. |
| `state` | `open` | Expanded — the content is revealed. |

**State → tokens**

| State | Tokens |
|---|---|
| Pattern=Basic, State=Closed | gap space/2 · (+5 variants share these) |
| Pattern=Align, State=Closed | gap space/5 · gap space/2 · (+1 variant share these) |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Anchor it to the trigger and flip it when it would overflow the viewport.
- Give it an explicit close affordance.
- Return focus to the trigger on close.

**Do not**
- Do not turn Pattern into a code prop.
- Do not open one from inside another.
- Do not put a long scrolling form in one.

**Accessibility**
- Role: `dialog`
- Keyboard: Escape closes.
- Keyboard: Tab moves through the content, then out.
- The trigger carries aria-expanded and aria-controls.
- A popover holding a form should trap focus; a non-modal one should not.

**Tokens used** — `space/2` · `space/5`

<sub>status `draft` · updated 2026-08-10 · fingerprint `8f3f17b2db637dc7` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:imported+best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Popover / RTL Content

**RTL Popover content with Arabic Title and Description, linked Close and Arrow controls, right-aligned typography, and Bottom/Start placement.**

**When to use**
- Only inside its parent component's composition — this is a part, not a standalone component.

**When not to use**
- On its own, outside the parent that owns its behaviour and accessibility wiring.
- As a general-purpose layout or text primitive.

**State → tokens**

| State | Tokens |
|---|---|
| Default | fill popover · border border · text popover-foreground · type UNBOUND 14/20 SemiBold · text muted-foreground · type UNBOUND 12/18 Regular |

**Do**
- Compose it through the parent rather than reaching for it directly.

**Do not**
- Do not re-implement the parent's keyboard or focus behaviour on the part.

**Tokens used** — `border` · `muted-foreground` · `popover` · `popover-foreground`

<sub>status `draft` · updated 2026-08-10 · fingerprint `96f1726b497479ad` · provenance description:imported · dos:best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Popover / Trigger

**Popover trigger visual states for standard Button and RTL presentation.**

Popover trigger visual states for standard Button and RTL presentation. Covers closed, open, hover, focus-visible, and disabled states; hover/detached/multiple-trigger behavior is documented at the Root API level.

Pipeline property contract: only the component properties defined on this set are configurable public inputs. Other embedded copy is illustrative composition content and must not be generated as a public code prop until engineering API review.

**When to use**
- Only inside its parent component's composition — this is a part, not a standalone component.

**When not to use**
- On its own, outside the parent that owns its behaviour and accessibility wiring.
- As a general-purpose layout or text primitive.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `type` | `button` | A conventional button triggers it. |
| `type` | `rTL` | Right-to-left layout — mirrored for RTL locales. |

**State → tokens**

| State | Tokens |
|---|---|
| Type=Button, State=Closed |  · (+2 variants share these) |
| Type=Button, State=Focused | border stroke/2 ring · radius radius/lg |
| Type=Button, State=Disabled | opacity opacity/50 |
| Type=RTL, State=Closed | fill card · border stroke/1 border · radius radius/md · padding y space/2 x space/2-5 · text foreground · type Label/SM |
| Type=RTL, State=Open | fill accent · border stroke/1 border · radius radius/md · padding y space/2 x space/2-5 · text foreground · type Label/SM · (+1 variant share these) |
| Type=RTL, State=Focused | border stroke/2 ring · radius radius/lg · fill card · border stroke/1 border · radius radius/md · padding y space/2 x space/2-5 · text foreground · type Label/SM |
| Type=RTL, State=Disabled | opacity opacity/50 · fill card · border stroke/1 border · radius radius/md · padding y space/2 x space/2-5 · text foreground · type Label/SM |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Compose it through the parent rather than reaching for it directly.

**Do not**
- Do not emit State as an enum prop. It packs states that co-occur at runtime.
- Do not remove the ring border on focus. It is the only focus affordance.
- Do not re-implement the parent's keyboard or focus behaviour on the part.

**Accessibility**
- State decomposition applies — see docs/state-decomposition.md. State [Closed · Open · Hover · Focused · Disabled] → :hover + :focus-visible CSS-owned, dropped; disabled independent boolean; closed/open controlled state

**Tokens used** — `Label/SM` · `accent` · `border` · `card` · `foreground` · `opacity/50` · `radius/lg` · `radius/md` · `ring` · `space/2` · `space/2-5` · `stroke/1` · `stroke/2`

<sub>status `draft` · updated 2026-08-10 · fingerprint `7bdf9f8d8c166b38` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:imported+best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:imported · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Popover / Viewport

**Transition Viewport documenting current and previous content for four activation directions.**

Transition Viewport documenting current and previous content for four activation directions. This asset represents data-activation-direction and data-previous states without prescribing runtime animation duration.

**When to use**
- Only inside its parent component's composition — this is a part, not a standalone component.

**When not to use**
- On its own, outside the parent that owns its behaviour and accessibility wiring.
- As a general-purpose layout or text primitive.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `state` | `current` | The content on screen now — the incoming half of a transition. |
| `state` | `previous` | The outgoing content, still rendered while the transition runs. |
| `direction` | `top` | Activated from the top — content travels along that axis. |
| `direction` | `right` | Activated from the right — content travels along that axis. |
| `direction` | `bottom` | Activated from the bottom — content travels along that axis. |
| `direction` | `left` | Activated from the left — content travels along that axis. |

**State → tokens**

| State | Tokens |
|---|---|
| State=Current, Direction=Top | fill popover · border stroke/1 border · radius radius/lg · padding space/3-5 · gap space/1-5 · text popover-foreground · type Label/XS · text muted-foreground · type Caption/XS · (+3 variants share these) |
| State=Previous, Direction=Top | fill popover · border stroke/1 border · radius radius/lg · padding space/3-5 · gap space/1-5 · opacity UNTOKENISED 0.55 · text popover-foreground · type Label/XS · text muted-foreground · type Caption/XS · (+3 variants share these) |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Compose it through the parent rather than reaching for it directly.

**Do not**
- Do not re-implement the parent's keyboard or focus behaviour on the part.

**Tokens used** — `Caption/XS` · `Label/XS` · `border` · `muted-foreground` · `popover` · `popover-foreground` · `radius/lg` · `space/1-5` · `space/3-5` · `stroke/1`

<sub>status `draft` · updated 2026-08-10 · fingerprint `d7906d1704554fa0` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Progress

**Linear progress primitive.**

Linear progress primitive. Determinate indicates known completion; indeterminate communicates ongoing work without a measurable endpoint.

**When to use**
- Show that work is underway, and how far along it is when that is known.

**When not to use**
- Waits short enough that the indicator flashes — show nothing.
- Content-shaped placeholders while a view loads — use Skeleton.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `type` | `determinate` | Progress is known and reported as a proportion of a total. |
| `type` | `indeterminate` | Progress is unknown — show activity, not a percentage. |

**State → tokens**

| State | Tokens |
|---|---|
| Type=Determinate | fill muted · radius radius/lg · fill primary · (+1 variant share these) |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Use the determinate form whenever a total is known.
- Say what is happening in text beside the bar.
- Keep it in place until the work actually finishes.

**Do not**
- Do not fake determinate progress.
- Do not let a bar sit at 100% without resolving.

**Accessibility**
- Role: `progressbar`
- Determinate sets aria-valuenow, aria-valuemin, and aria-valuemax.
- Indeterminate omits aria-valuenow.
- Named by aria-labelledby, or aria-label when no visible label exists.

**Tokens used** — `muted` · `primary` · `radius/lg`

<sub>status `draft` · updated 2026-08-10 · fingerprint `b5a4176369143dde` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Radio Group

**Jake UI labeled radio-option extension with selected/unselected and default/focused/disabled states.**

Jake UI labeled radio-option extension with selected/unselected and default/focused/disabled states. Exact source anatomy and examples are implemented by Radio Group / Indicator, Item, Root, and Field Composition.

Layout exception: the selected Radio Control overlays the inner selection dot within the outer control. This coordinate-based micro-geometry is intentional and excluded from structural auto-layout linting.

Pipeline API classification: apply the Governance property-classification rule before code mapping. Visual State axes are QA/story states unless engineering explicitly approves a controlled runtime prop; Viewport is responsive test data; Pattern is composition/story data.

**When to use**
- Checkbox or toggle for an independent on/off value.
- Radio for one-of-many within a group.

**When not to use**
- A single either/or action that takes effect immediately with no save — prefer a toggle over a checkbox.
- A choice that only applies after a separate Save — prefer radio or checkbox over a toggle.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `value` | `unselected` | Not selected. |
| `value` | `selected` | Selected. |

**State → tokens**

| State | Tokens |
|---|---|
| Value=Unselected, State=Default | gap space/2-5 · fill card · border stroke/1 input · text foreground · type Label/LG |
| Value=Unselected, State=Focused | gap space/2-5 · fill card · border stroke/2 ring · text foreground · type Label/LG |
| Value=Unselected, State=Disabled | gap space/2-5 · fill muted · border stroke/1 input · text muted-foreground · type Label/LG |
| Value=Selected, State=Default | gap space/2-5 · fill card · border stroke/1 primary · fill primary · text foreground · type Label/LG |
| Value=Selected, State=Focused | gap space/2-5 · fill card · border stroke/2 ring · fill primary · text foreground · type Label/LG |
| Value=Selected, State=Disabled | gap space/2-5 · fill muted · border stroke/1 primary · fill muted-foreground · text muted-foreground · type Label/LG |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Label the control itself, not only the group.
- Make the label clickable.

**Do not**
- Do not emit State as an enum prop. It packs states that co-occur at runtime.
- Do not use a radio group for multi-select.
- Do not use a toggle for choices that only apply after a separate Save.

**Accessibility**
- Keyboard: Space toggles.
- Keyboard: Radio groups move between options with arrow keys.
- State decomposition applies — see docs/state-decomposition.md. State [Default · Focused · Disabled] → :focus-visible CSS-owned, dropped; disabled independent boolean
- State is exposed via aria-checked, never by colour alone.

**Tokens used** — `Label/LG` · `card` · `foreground` · `input` · `muted` · `muted-foreground` · `primary` · `ring` · `space/2-5` · `stroke/1` · `stroke/2`

<sub>status `draft` · updated 2026-08-10 · fingerprint `4a1c6fc5cef3d485` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:imported+best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:imported+w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Radio Group / Field Composition

**Source usage patterns built from Radio Group / Root and Item: Basic, Description, Choice Card, Fieldset, Disabled, Invalid, and RTL.**

Source usage patterns built from Radio Group / Root and Item: Basic, Description, Choice Card, Fieldset, Disabled, Invalid, and RTL.

Pipeline property contract: only the component properties defined on this set are configurable public inputs. Other embedded copy is illustrative composition content and must not be generated as a public code prop until engineering API review.

**When to use**
- Checkbox or toggle for an independent on/off value.
- Radio for one-of-many within a group.

**When not to use**
- A single either/or action that takes effect immediately with no save — prefer a toggle over a checkbox.
- A choice that only applies after a separate Save — prefer radio or checkbox over a toggle.

**State → tokens**

| State | Tokens |
|---|---|
| Pattern=Basic | gap space/3 · (+1 variant share these) |
| Pattern=Description | gap space/3 · gap space/2-5 · gap space/1 · text foreground · type Label/MD · text muted-foreground · type Body/XS |
| Pattern=Choice Card | gap space/3 · fill card · border stroke/1 border · radius radius/lg · padding space/4 · gap space/1 · text foreground · type Label/MD · text muted-foreground · type Body/XS · border stroke/2 primary |
| Pattern=Fieldset | gap space/3 · text foreground · type Heading/SM · text muted-foreground · type Body/XS |
| Pattern=Invalid | gap space/3 · text foreground · type Heading/SM · text muted-foreground · type Body/XS · gap space/1 · type Label/MD · text destructive |
| Pattern=RTL | gap space/3 · text foreground · type Heading/SM · gap space/1 · type Label/MD · text muted-foreground · type Body/XS |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Label the control itself, not only the group.
- Make the label clickable.

**Do not**
- Do not turn Pattern into a code prop.
- Do not use a radio group for multi-select.
- Do not use a toggle for choices that only apply after a separate Save.

**Accessibility**
- Keyboard: Space toggles.
- Keyboard: Radio groups move between options with arrow keys.
- State is exposed via aria-checked, never by colour alone.

**Tokens used** — `Body/XS` · `Heading/SM` · `Label/MD` · `border` · `card` · `destructive` · `foreground` · `muted-foreground` · `primary` · `radius/lg` · `space/1` · `space/2-5` · `space/3` · `space/4` · `stroke/1` · `stroke/2`

<sub>status `draft` · updated 2026-08-10 · fingerprint `1a769ed9f0913cac` · provenance description:imported · dos:imported+best-practice · donts:imported+best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Radio Group / Indicator

**Checked-state indicator nested inside Radio Group / Item.**

Checked-state indicator nested inside Radio Group / Item. Runtime may force-mount the indicator for animation or measurement.

**When to use**
- Only inside its parent component's composition — this is a part, not a standalone component.

**When not to use**
- On its own, outside the parent that owns its behaviour and accessibility wiring.
- As a general-purpose layout or text primitive.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `state` | `default` | Resting state. |
| `state` | `disabled` | Not available; not focusable and does not respond to input. |

**State → tokens**

| State | Tokens |
|---|---|
| State=Default | fill primary · radius radius/full |
| State=Disabled | fill primary · radius radius/full · opacity opacity/50 |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Compose it through the parent rather than reaching for it directly.

**Do not**
- Do not re-implement the parent's keyboard or focus behaviour on the part.

**Tokens used** — `opacity/50` · `primary` · `radius/full`

<sub>status `draft` · updated 2026-08-10 · fingerprint `6d71b531c87311dd` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Radio Group / Item

**Pure Radio Group item with Value and State axes.**

Pure Radio Group item with Value and State axes. Supports unchecked/checked plus default, hover, focus-visible, disabled, read-only, and invalid states; checked items nest the Indicator.

Accessibility contract: the 20×20 radio visual is not the runtime target box. Runtime must provide at least a 24×24 CSS px target or satisfy the permitted spacing exception, typically through the associated label/hit wrapper. Invalid state must be paired with visible field/group error text and programmatic invalid/error description.

**When to use**
- Checkbox or toggle for an independent on/off value.
- Radio for one-of-many within a group.

**When not to use**
- A single either/or action that takes effect immediately with no save — prefer a toggle over a checkbox.
- A choice that only applies after a separate Save — prefer radio or checkbox over a toggle.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `value` | `unchecked` | Not selected. |
| `value` | `checked` | Selected. |

**State → tokens**

| State | Tokens |
|---|---|
| Value=Unchecked, State=Default | fill card · border stroke/1 input · radius radius/full |
| Value=Unchecked, State=Hover | fill accent · border stroke/1 input · radius radius/full |
| Value=Unchecked, State=Focused | fill card · border stroke/2 ring · radius radius/full · (+1 variant share these) |
| Value=Unchecked, State=Disabled | fill card · border stroke/1 input · radius radius/full · opacity opacity/50 |
| Value=Unchecked, State=ReadOnly | fill card · border stroke/1 input · radius radius/full · opacity opacity/80 |
| Value=Unchecked, State=Invalid | fill card · border stroke/2 destructive · radius radius/full · (+1 variant share these) |
| Value=Checked, State=Default | fill card · border stroke/1 primary · radius radius/full |
| Value=Checked, State=Hover | fill accent · border stroke/1 primary · radius radius/full |
| Value=Checked, State=Disabled | fill card · border stroke/1 primary · radius radius/full · opacity opacity/50 |
| Value=Checked, State=ReadOnly | fill card · border stroke/1 primary · radius radius/full · opacity opacity/80 |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Label the control itself, not only the group.
- Make the label clickable.

**Do not**
- Do not emit State as an enum prop. It packs states that co-occur at runtime.
- Do not remove the ring border on focus. It is the only focus affordance.
- Do not use a radio group for multi-select.
- Do not use a toggle for choices that only apply after a separate Save.

**Accessibility**
- Keyboard: Space toggles.
- Keyboard: Radio groups move between options with arrow keys.
- the 20×20 radio visual is not the runtime target box. Runtime must provide at least a 24×24 CSS px target or satisfy the permitted spacing exception, typically through the associated label/hit wrapper. Invalid state must be paired with visible field/group error text and programmatic invalid/error description.
- State decomposition applies — see docs/state-decomposition.md. State [Default · Hover · Focused · Disabled · ReadOnly · Invalid] → :hover + :focus-visible CSS-owned, dropped; disabled + readOnly + invalid independent booleans
- State is exposed via aria-checked, never by colour alone.

**Tokens used** — `accent` · `card` · `destructive` · `input` · `opacity/50` · `opacity/80` · `primary` · `radius/full` · `ring` · `stroke/1` · `stroke/2`

<sub>status `draft` · updated 2026-08-10 · fingerprint `df4c0e609dfbfdde` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:imported+best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:imported+w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Radio Group / Root

**Radio Group composition with Orientation, Selection, and State axes.**

Radio Group composition with Orientation, Selection, and State axes. Contains three linked Radio Group / Item instances and editable option labels. Runtime uses roving tabindex and form-associated hidden inputs.

Accessibility contract: State=Invalid is a group visual state; the consuming fieldset/group must provide a visible error message and programmatic group-level invalid/error description. Roving keyboard focus remains a runtime behavior.

**When to use**
- Checkbox or toggle for an independent on/off value.
- Radio for one-of-many within a group.

**When not to use**
- A single either/or action that takes effect immediately with no save — prefer a toggle over a checkbox.
- A choice that only applies after a separate Save — prefer radio or checkbox over a toggle.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `orientation` | `vertical` | Lays out along the block axis. |
| `orientation` | `horizontal` | Lays out along the inline axis. |
| `selection` | `first` | The first option in the group is selected. |
| `selection` | `second` | The second option in the group is selected. |
| `selection` | `none` | Nothing is currently selected. |

**State → tokens**

| State | Tokens |
|---|---|
| Orientation=Vertical, Selection=First, State=Default | gap space/2-5 · text foreground · type Label/MD · (+8 variants share these) |
| Orientation=Vertical, Selection=First, State=Disabled | gap space/2-5 · text muted-foreground · type Label/MD · (+2 variants share these) |
| Orientation=Horizontal, Selection=First, State=Default | gap space/6 · gap space/2-5 · text foreground · type Label/MD · (+8 variants share these) |
| Orientation=Horizontal, Selection=First, State=Disabled | gap space/6 · gap space/2-5 · text muted-foreground · type Label/MD · (+2 variants share these) |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Label the control itself, not only the group.
- Make the label clickable.

**Do not**
- Do not emit State as an enum prop. It packs states that co-occur at runtime.
- Do not use a radio group for multi-select.
- Do not use a toggle for choices that only apply after a separate Save.

**Accessibility**
- Keyboard: Space toggles.
- Keyboard: Radio groups move between options with arrow keys.
- State=Invalid is a group visual state; the consuming fieldset/group must provide a visible error message and programmatic group-level invalid/error description. Roving keyboard focus remains a runtime behavior.
- State decomposition applies — see docs/state-decomposition.md. State [Default · Disabled · ReadOnly · Invalid] → disabled + readOnly + invalid independent booleans
- State is exposed via aria-checked, never by colour alone.

**Tokens used** — `Label/MD` · `foreground` · `muted-foreground` · `space/2-5` · `space/6`

<sub>status `draft` · updated 2026-08-10 · fingerprint `8eb03de8676d995f` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:imported+best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:imported+w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Scroll Area

**Scrollable viewport primitive with visible track and thumb anatomy.**

Scrollable viewport primitive with visible track and thumb anatomy. Choose axis according to overflow direction.

Pipeline property contract: only the component properties defined on this set are configurable public inputs. Other embedded copy is illustrative composition content and must not be generated as a public code prop until engineering API review.

Layout exception: Scroll Area uses coordinate-based viewport, track, and thumb geometry rather than root auto layout. Runtime overflow determines scroll position; the Figma axis variants document anatomy and default dimensions.

**When to use**
- Confine overflow to one region so the page itself does not scroll.

**When not to use**
- The main page scroll — leave that to the browser.
- Hiding content the reader is unlikely to look for.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `axis` | `vertical` | Scrolls along the block axis. |
| `axis` | `horizontal` | Scrolls along the inline axis. |

**State → tokens**

| State | Tokens |
|---|---|
| Axis=Vertical | fill card · border stroke/1 border · radius radius/lg · text foreground · type Body/MD · fill muted · fill muted-foreground · (+1 variant share these) |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Leave a visible cue that there is more to see.
- Keep native keyboard and wheel scrolling working.

**Do not**
- Do not nest scroll areas along the same axis.
- Do not hide the scrollbar so thoroughly that the overflow is invisible.

**Accessibility**
- Keyboard: The region is focusable so it can be scrolled by keyboard.
- A scrollable region needs a tabindex and an accessible name.
- Do not suppress the native scrollbar on platforms that always show one.

**Tokens used** — `Body/MD` · `border` · `card` · `foreground` · `muted` · `muted-foreground` · `radius/lg` · `stroke/1`

<sub>status `draft` · updated 2026-08-10 · fingerprint `f02411b0d8cc0a06` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Segmented Tab

**Compact Watermelon option tab.**

Compact Watermelon option tab. Place instances inside a secondary-colored segmented-control container. Sizing policy: Hug Contents width with fixed standard control height.

Interaction contract: Selected is the persistent tab selection state. Hover and focus-visible are transient runtime states; focus remains visually distinguishable using the shared ring treatment.

**When to use**
- Switch between peer views of the same subject, within one context.

**When not to use**
- Steps in a sequence — use a stepper.
- Content the reader needs to compare side by side, or to find with the browser's search.
- Navigating to a different page — use links.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `selected` | `false` | Not selected. |
| `selected` | `true` | Selected — the active choice in its group. |

**State → tokens**

| State | Tokens |
|---|---|
| Selected=False | radius radius/lg · padding y space/1-75 x space/3 · text muted-foreground · type Label/SM |
| Selected=True | fill card · radius radius/lg · padding y space/1-75 x space/3 · shadow Effect/Selected Tab · text foreground · type Label/SM |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Keep one tab selected at all times.
- Keep labels short enough to fit on one line without wrapping.
- Preserve each panel's state when switching away and back.

**Do not**
- Do not scroll or wrap tabs into a second row — reconsider the grouping.
- Do not hide required form fields in an unselected tab.

**Accessibility**
- Role: `tablist`
- Keyboard: Arrow keys move between tabs; Home and End jump to the first and last.
- Keyboard: Tab moves from the tab list into the active panel.
- Each tab carries aria-selected and aria-controls; each panel is labelled by its tab.
- Only the selected tab is in the tab order.

**Tokens used** — `Effect/Selected Tab` · `Label/SM` · `card` · `foreground` · `muted-foreground` · `radius/lg` · `space/1-75` · `space/3`

<sub>status `draft` · updated 2026-08-10 · fingerprint `c5c3b649fb559cf3` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Separator

**Visual separator for grouping adjacent content.**

Visual separator for grouping adjacent content. Horizontal is the default for stacked regions; vertical is used between inline groups.

**When to use**
- Mark a boundary between groups that spacing alone does not make clear.

**When not to use**
- Where whitespace already separates the groups.
- Decoration, or as a border around a region.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `orientation` | `horizontal` | Lays out along the inline axis. |
| `orientation` | `vertical` | Lays out along the block axis. |

**State → tokens**

| State | Tokens |
|---|---|
| Orientation=Horizontal | fill border · (+1 variant share these) |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Bind it to a border token so it tracks the theme.

**Do not**
- Do not use a run of separators to create rhythm.

**Accessibility**
- Role: `separator`
- Purely visual separators are aria-hidden="true".
- One that genuinely divides groups keeps role="separator" and its orientation.

**Tokens used** — `border`

<sub>status `draft` · updated 2026-08-10 · fingerprint `a880e3f962a55d06` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Sheet

**Edge-attached overlay for secondary workflows.**

Edge-attached overlay for secondary workflows. Use Sheet for persistent side tasks; use Drawer for transient filtering and supplemental controls.

Pipeline property contract: only the component properties defined on this set are configurable public inputs. Other embedded copy is illustrative composition content and must not be generated as a public code prop until engineering API review.

**When to use**
- Interrupt for a focused task, or a decision that blocks the flow.

**When not to use**
- Non-critical messages — use an inline alert or a toast.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `side` | `left` | Opens to the left of the trigger. |
| `side` | `right` | Opens to the right of the trigger. |
| `width` | `compact` | Narrow — for filters and short forms. |
| `width` | `wide` | Roomier — for tables and dense content. |

**State → tokens**

| State | Tokens |
|---|---|
| Side=Left, Width=Compact | fill card · border stroke/1 border · radius radius/lg · padding space/6 · gap space/4-5 · gap space/3 · text foreground · type Heading/LG · text muted-foreground · type Body/SM · fill accent · padding space/3 · gap space/2 · text accent-foreground · type Label/LG · (+3 variants share these) |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Trap focus while open.
- Return focus to the trigger on close.
- Provide an explicit close affordance.

**Do not**
- Do not stack dialogs.
- Do not put long scrolling forms in a small dialog.

**Accessibility**
- Role: `dialog`
- Keyboard: Escape closes.
- Keyboard: Tab cycles within the dialog only.
- aria-modal="true", labelled by its title via aria-labelledby.
- Focus is trapped within while open.

**Tokens used** — `Body/SM` · `Heading/LG` · `Label/LG` · `accent` · `accent-foreground` · `border` · `card` · `foreground` · `muted-foreground` · `radius/lg` · `space/2` · `space/3` · `space/4-5` · `space/6` · `stroke/1`

<sub>status `draft` · updated 2026-08-10 · fingerprint `d4a9ccad25cc57c2` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Sidebar

**Application sidebar with desktop and compact structures.**

Application sidebar with desktop and compact structures. Expanded variants use nested Sidebar Navigation Item instances; collapsed variants reduce navigation to an icon rail or compact menu trigger.

Pipeline property contract: only the component properties defined on this set are configurable public inputs. Other embedded copy is illustrative composition content and must not be generated as a public code prop until engineering API review.

**When to use**
- Keep navigation persistently in view alongside the main content.

**When not to use**
- Fewer than about five destinations — a horizontal bar reads faster.
- Page content or filters that belong in the main column.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `state` | `expanded` | Shown at full width, with labels visible. |
| `state` | `collapsed` | Reduced to a minimal rail. |

**State → tokens**

| State | Tokens |
|---|---|
| Viewport=Desktop, State=Expanded | fill sidebar · border stroke/1 sidebar-border · radius radius/lg · padding y space/5 x space/4 · gap space/4 · gap space/2-5 · fill sidebar-primary · padding space/2 · text sidebar-primary-foreground · type Heading/XS · text sidebar-foreground · type Heading/SM · gap space/1-5 · fill sidebar-accent · padding space/2-5 · gap space/0-5 · text sidebar-accent-foreground · type Label/MD · text muted-foreground · type Caption/XS |
| Viewport=Desktop, State=Collapsed | fill sidebar · border stroke/1 sidebar-border · radius radius/lg · padding y space/5 x space/4 · gap space/4 · fill sidebar-accent · padding space/2-5 · text sidebar-accent-foreground · type Value/Strong · text sidebar-foreground |
| Viewport=Compact, State=Expanded | fill sidebar · border stroke/1 sidebar-border · radius radius/lg · padding y space/4 x space/3-5 · gap space/4 · gap space/2-5 · fill sidebar-primary · padding space/2 · text sidebar-primary-foreground · type Heading/XS · text sidebar-foreground · type Heading/SM · gap space/1-5 · fill sidebar-accent · padding space/2-5 · gap space/0-5 · text sidebar-accent-foreground · type Label/MD · text muted-foreground · type Caption/XS |
| Viewport=Compact, State=Collapsed | fill sidebar · border stroke/1 sidebar-border · radius radius/lg · padding y space/4 x space/3-5 · gap space/4 · padding space/2-5 · text sidebar-foreground · type Value/Strong |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Remember the expanded or collapsed choice across sessions.
- Keep icons meaningful when collapsed, and add tooltips for their labels.
- Move to an overlay drawer at narrow widths.

**Do not**
- Do not turn Viewport into a code prop.
- Do not collapse to icons alone where the metaphors are ambiguous.
- Do not let the sidebar scroll the whole page.

**Accessibility**
- Role: `navigation`
- Keyboard: The collapse control is focusable and labelled.
- The collapse toggle carries aria-expanded.
- When collapsed, each item still needs an accessible name.

**Tokens used** — `Caption/XS` · `Heading/SM` · `Heading/XS` · `Label/MD` · `Value/Strong` · `muted-foreground` · `radius/lg` · `sidebar` · `sidebar-accent` · `sidebar-accent-foreground` · `sidebar-border` · `sidebar-foreground` · `sidebar-primary` · `sidebar-primary-foreground` · `space/0-5` · `space/1-5` · `space/2` · `space/2-5` · `space/3-5` · `space/4` · `space/5` · `stroke/1`

<sub>status `draft` · updated 2026-08-10 · fingerprint `11310b5f50427d3c` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:imported+best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Sidebar Navigation Item

**Watermelon docs sidebar route item.**

Watermelon docs sidebar route item. Use State=Active for the current route. Sizing exception: fixed width and fixed height are intentional so each item aligns to the sidebar column and preserves a 36px target.

Interaction contract: State=Active is the persistent current-route state. Hover and focus-visible are transient runtime link states rather than additional persistent variants; runtime focus must use the shared ring treatment.

**When to use**
- A single destination within sidebar navigation.

**When not to use**
- Firing an action rather than navigating — use a Button.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `state` | `default` | Resting state. |
| `state` | `active` | The currently selected item in its group. |

**State → tokens**

| State | Tokens |
|---|---|
| State=Default | radius radius/lg · padding y space/2 x space/3 · gap space/2-5 · fill sidebar-foreground · radius radius/0-75 · text sidebar-foreground · type Label/LG |
| State=Active | fill sidebar-accent · radius radius/lg · padding y space/2 x space/3 · gap space/2-5 · fill sidebar-accent-foreground · radius radius/0-75 · text sidebar-accent-foreground · type Label/LG |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Make the whole row the hit target, not just the text.
- Show the active state from the route, not from click state.

**Do not**
- Do not signal the active item by colour alone.

**Accessibility**
- It is a link; the active one carries aria-current="page".
- Its icon is decorative when the label is visible.

**Tokens used** — `Label/LG` · `radius/0-75` · `radius/lg` · `sidebar-accent` · `sidebar-accent-foreground` · `sidebar-foreground` · `space/2` · `space/2-5` · `space/3`

<sub>status `draft` · updated 2026-08-10 · fingerprint `95f2296afc187ad5` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Skeleton

**Loading placeholders for text, avatar rows, cards, and table rows.**

Loading placeholders for text, avatar rows, cards, and table rows. Dimensions are intentionally fixed to reserve layout space and prevent content shift.

**When to use**
- Hold the shape of content that is loading, so the layout does not jump when it arrives.

**When not to use**
- Waits short enough that it flashes.
- Work with a known duration or total — use Progress.
- An error or an empty result — those need their own states.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `type` | `text` | Placeholder for a line or block of text. |
| `type` | `avatar` | Avatar shape — a circular image, or initials when no image is available. |
| `type` | `card` | Placeholder shaped like a card. |
| `type` | `tableRow` | Placeholder shaped like a table row. |

**State → tokens**

| State | Tokens |
|---|---|
| Type=Text | padding space/3 · gap space/2-5 · fill muted · radius radius/sm |
| Type=Avatar | padding space/3 · gap space/3 · fill muted · radius radius/16 · gap space/2 · radius radius/sm |
| Type=Card | padding space/3 · gap space/3 · fill muted · radius radius/sm · gap space/2-5 · radius radius/md |
| Type=Table Row | padding y space/2-5 x space/3 · gap space/3 · fill muted · radius radius/4 · radius radius/5 |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Match the real content's dimensions closely.
- Show a small representative number of placeholders, not a full page of them.

**Do not**
- Do not leave skeletons up indefinitely when a request fails.
- Do not animate so strongly that the page appears to be moving.

**Accessibility**
- Hidden from assistive technology with aria-hidden="true"; announce loading once, in a live region.
- Respects prefers-reduced-motion by dropping the shimmer.

**Tokens used** — `muted` · `radius/16` · `radius/4` · `radius/5` · `radius/md` · `radius/sm` · `space/2` · `space/2-5` · `space/3`

<sub>status `draft` · updated 2026-08-10 · fingerprint `9537623f13cd0257` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Slider

**Continuous value selection primitive.**

Continuous value selection primitive. State variants document default, keyboard focus, and disabled behavior.

Layout exception: Slider uses coordinate-based track, fill, and thumb geometry so the control can represent a continuous value. Do not infer absolute pixel positions as code API values; runtime width and value positioning are behavioral.

**When to use**
- Pick from a continuous or coarsely stepped range where the relative position matters more than the exact figure.

**When not to use**
- A precise value the user knows — use a number input.
- Ranges so wide that a pixel is worth many units.
- Fewer than about five discrete options — use radios or a segmented control.

**State → tokens**

| State | Tokens |
|---|---|
| State=Default | fill muted · radius radius/lg · fill primary · fill card · border stroke/2 primary |
| State=Focused | fill muted · radius radius/lg · fill primary · fill card · border stroke/3 ring |
| State=Disabled | fill muted · radius radius/lg · fill muted-foreground · fill card · border stroke/2 muted-foreground |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Show the current value as text next to the track.
- Make the thumb large enough to hit on touch.
- Pair it with a number input when precision matters.

**Do not**
- Do not emit State as an enum prop. It packs states that co-occur at runtime.
- Do not use one for a value with a required exact entry.
- Do not hide the minimum and maximum.

**Accessibility**
- Role: `slider`
- Keyboard: Arrow keys move by one step; PageUp and PageDown by a larger one.
- Keyboard: Home and End jump to the minimum and maximum.
- State decomposition applies — see docs/state-decomposition.md. State [Default · Focused · Disabled] → :focus-visible CSS-owned, dropped; disabled independent boolean
- Carries aria-valuenow, aria-valuemin, aria-valuemax, and aria-valuetext where a raw number would not read well.
- The thumb is the focusable element and carries the accessible name.

**Tokens used** — `card` · `muted` · `muted-foreground` · `primary` · `radius/lg` · `ring` · `stroke/2` · `stroke/3`

<sub>status `draft` · updated 2026-08-10 · fingerprint `69dda23def7eb04f` · provenance description:imported · dos:imported+best-practice · donts:imported+best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:imported+w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Switch

**Jake UI labeled Switch extension with checked/unchecked and default/focused/disabled states.**

Jake UI labeled Switch extension with checked/unchecked and default/focused/disabled states. Exact source anatomy and examples are implemented by Switch / Thumb, Switch / Root, and Switch / Field Composition.

Accessibility contract: visual height is 22px. Runtime target area must be at least 24×24 CSS px or satisfy the permitted spacing exception; do not shrink the clickable label/target to the visual track height.

**When to use**
- Checkbox or toggle for an independent on/off value.
- Radio for one-of-many within a group.

**When not to use**
- A single either/or action that takes effect immediately with no save — prefer a toggle over a checkbox.
- A choice that only applies after a separate Save — prefer radio or checkbox over a toggle.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `value` | `unchecked` | Not selected. |
| `value` | `checked` | Selected. |

**State → tokens**

| State | Tokens |
|---|---|
| Value=Unchecked, State=Default | gap space/2-5 · fill input · radius radius/full · fill card · text foreground · type Label/LG |
| Value=Unchecked, State=Focused | gap space/2-5 · fill input · border stroke/2 ring · radius radius/full · fill card · text foreground · type Label/LG |
| Value=Unchecked, State=Disabled | gap space/2-5 · fill muted · radius radius/full · fill card · text muted-foreground · type Label/LG · (+1 variant share these) |
| Value=Checked, State=Default | gap space/2-5 · fill primary · radius radius/full · fill card · text foreground · type Label/LG |
| Value=Checked, State=Focused | gap space/2-5 · fill primary · border stroke/2 ring · radius radius/full · fill card · text foreground · type Label/LG |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Label the control itself, not only the group.
- Make the label clickable.

**Do not**
- Do not emit State as an enum prop. It packs states that co-occur at runtime.
- Do not use a radio group for multi-select.
- Do not use a toggle for choices that only apply after a separate Save.

**Accessibility**
- Keyboard: Space toggles.
- Keyboard: Radio groups move between options with arrow keys.
- visual height is 22px. Runtime target area must be at least 24×24 CSS px or satisfy the permitted spacing exception; do not shrink the clickable label/target to the visual track height.
- State decomposition applies — see docs/state-decomposition.md. State [Default · Focused · Disabled] → :focus-visible CSS-owned, dropped; disabled independent boolean
- State is exposed via aria-checked, never by colour alone.

**Tokens used** — `Label/LG` · `card` · `foreground` · `input` · `muted` · `muted-foreground` · `primary` · `radius/full` · `ring` · `space/2-5` · `stroke/2`

<sub>status `draft` · updated 2026-08-10 · fingerprint `175ba28b42e34070` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:imported+best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:imported+w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Switch / Field Composition

**Source usage patterns built from Switch / Root: Basic, Description, Choice Card, Disabled, Invalid, Size, and RTL.**

Source usage patterns built from Switch / Root: Basic, Description, Choice Card, Disabled, Invalid, Size, and RTL.

Pipeline property contract: only the component properties defined on this set are configurable public inputs. Other embedded copy is illustrative composition content and must not be generated as a public code prop until engineering API review.

**When to use**
- Checkbox or toggle for an independent on/off value.
- Radio for one-of-many within a group.

**When not to use**
- A single either/or action that takes effect immediately with no save — prefer a toggle over a checkbox.
- A choice that only applies after a separate Save — prefer radio or checkbox over a toggle.

**State → tokens**

| State | Tokens |
|---|---|
| Pattern=Basic | gap space/3 · gap space/4 · gap space/1 · text foreground · type Label/MD · (+1 variant share these) |
| Pattern=Description | gap space/3 · gap space/4 · gap space/1 · text foreground · type Label/MD · text muted-foreground · type Body/XS · (+1 variant share these) |
| Pattern=Choice Card | gap space/3 · fill card · border stroke/1 border · radius radius/lg · padding space/4 · gap space/4 · gap space/1 · text foreground · type Label/MD · text muted-foreground · type Body/XS |
| Pattern=Disabled | gap space/3 · gap space/4 · gap space/1 · text muted-foreground · type Label/MD |
| Pattern=Invalid | gap space/3 · gap space/4 · gap space/1 · text foreground · type Label/MD · text destructive · type Body/XS |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Label the control itself, not only the group.
- Make the label clickable.

**Do not**
- Do not turn Pattern into a code prop.
- Do not use a radio group for multi-select.
- Do not use a toggle for choices that only apply after a separate Save.

**Accessibility**
- Keyboard: Space toggles.
- Keyboard: Radio groups move between options with arrow keys.
- State is exposed via aria-checked, never by colour alone.

**Tokens used** — `Body/XS` · `Label/MD` · `border` · `card` · `destructive` · `foreground` · `muted-foreground` · `radius/lg` · `space/1` · `space/3` · `space/4` · `stroke/1`

<sub>status `draft` · updated 2026-08-10 · fingerprint `3be952558d2bea70` · provenance description:imported · dos:imported+best-practice · donts:imported+best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Switch / Root

**Pure Switch control with Size, Value, and State axes.**

Pure Switch control with Size, Value, and State axes. States cover default, hover, focus-visible, disabled, readOnly, and invalid. Anatomy: Root + nested Thumb; hidden form input remains a documented nonvisual runtime part.

Accessibility contract: the switch track is intentionally smaller than a 24px pointer target. Runtime must provide a target of at least 24×24 CSS px or satisfy the permitted spacing exception. State=Invalid must be paired with visible field/group error text and programmatic invalid/error description.

**When to use**
- Checkbox or toggle for an independent on/off value.
- Radio for one-of-many within a group.

**When not to use**
- A single either/or action that takes effect immediately with no save — prefer a toggle over a checkbox.
- A choice that only applies after a separate Save — prefer radio or checkbox over a toggle.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `size` | `small` | Dense contexts — tables, toolbars, compact rows. |
| `size` | `default` | The standard size — use unless there is a reason not to. |
| `value` | `unchecked` | Not selected. |
| `value` | `checked` | Selected. |

**State → tokens**

| State | Tokens |
|---|---|
| Size=Small, Value=Unchecked, State=Default | fill input · radius radius/full · padding space/0-5 · (+1 variant share these) |
| Size=Small, Value=Unchecked, State=Hover | fill accent-hover · radius radius/full · padding space/0-5 · (+1 variant share these) |
| Size=Small, Value=Unchecked, State=Focused | fill input · border stroke/2 ring · radius radius/full · padding space/0-5 · (+1 variant share these) |
| Size=Small, Value=Unchecked, State=Disabled | fill input · radius radius/full · padding space/0-5 · opacity opacity/50 · (+1 variant share these) |
| Size=Small, Value=Unchecked, State=ReadOnly | fill input · radius radius/full · padding space/0-5 · opacity opacity/80 · (+1 variant share these) |
| Size=Small, Value=Unchecked, State=Invalid | fill input · border stroke/2 destructive · radius radius/full · padding space/0-5 · (+1 variant share these) |
| Size=Small, Value=Checked, State=Default | fill primary · radius radius/full · padding space/0-5 · (+1 variant share these) |
| Size=Small, Value=Checked, State=Hover | fill primary-hover · radius radius/full · padding space/0-5 · (+1 variant share these) |
| Size=Small, Value=Checked, State=Focused | fill primary · border stroke/2 ring · radius radius/full · padding space/0-5 · (+1 variant share these) |
| Size=Small, Value=Checked, State=Disabled | fill primary · radius radius/full · padding space/0-5 · opacity opacity/50 · (+1 variant share these) |
| Size=Small, Value=Checked, State=ReadOnly | fill primary · radius radius/full · padding space/0-5 · opacity opacity/80 · (+1 variant share these) |
| Size=Small, Value=Checked, State=Invalid | fill primary · border stroke/2 destructive · radius radius/full · padding space/0-5 · (+1 variant share these) |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Label the control itself, not only the group.
- Make the label clickable.

**Do not**
- Do not emit State as an enum prop. It packs states that co-occur at runtime.
- Do not remove the ring border on focus. It is the only focus affordance.
- Do not use a radio group for multi-select.
- Do not use a toggle for choices that only apply after a separate Save.

**Accessibility**
- Keyboard: Space toggles.
- Keyboard: Radio groups move between options with arrow keys.
- the switch track is intentionally smaller than a 24px pointer target. Runtime must provide a target of at least 24×24 CSS px or satisfy the permitted spacing exception. State=Invalid must be paired with visible field/group error text and programmatic invalid/error description.
- State decomposition applies — see docs/state-decomposition.md. State [Default · Hover · Focused · Disabled · ReadOnly · Invalid] → :hover + :focus-visible CSS-owned, dropped; disabled + readOnly + invalid independent booleans
- State is exposed via aria-checked, never by colour alone.

**Tokens used** — `accent-hover` · `destructive` · `input` · `opacity/50` · `opacity/80` · `primary` · `primary-hover` · `radius/full` · `ring` · `space/0-5` · `stroke/2`

<sub>status `draft` · updated 2026-08-10 · fingerprint `ff9d04e1e1ecf340` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:imported+best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:imported+w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Switch / Thumb

**Movable Switch thumb.**

Movable Switch thumb. Size follows the Root size; disabled styling is inherited from the Root state.

Pipeline API classification: apply the Governance property-classification rule before code mapping. Visual State axes are QA/story states unless engineering explicitly approves a controlled runtime prop; Viewport is responsive test data; Pattern is composition/story data.

**When to use**
- Only inside its parent component's composition — this is a part, not a standalone component.

**When not to use**
- On its own, outside the parent that owns its behaviour and accessibility wiring.
- As a general-purpose layout or text primitive.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `size` | `small` | Dense contexts — tables, toolbars, compact rows. |
| `size` | `default` | The standard size — use unless there is a reason not to. |
| `state` | `default` | Resting state. |
| `state` | `disabled` | Not available; not focusable and does not respond to input. |

**State → tokens**

| State | Tokens |
|---|---|
| Size=Small, State=Default | fill card · radius radius/full · (+1 variant share these) |
| Size=Small, State=Disabled | fill card · radius radius/full · opacity opacity/75 · (+1 variant share these) |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Compose it through the parent rather than reaching for it directly.

**Do not**
- Do not re-implement the parent's keyboard or focus behaviour on the part.

**Tokens used** — `card` · `opacity/75` · `radius/full`

<sub>status `draft` · updated 2026-08-10 · fingerprint `cd1c9521ed38a959` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Table

**Jake UI extension for structured tabular data with compact and comfortable density variants plus optional selected-row treatment.**

Jake UI extension for structured tabular data with compact and comfortable density variants plus optional selected-row treatment. Source-parity anatomy and examples are implemented by the Table / * assets and Table / Root Composition.

Pipeline property contract: only the component properties defined on this set are configurable public inputs. Other embedded copy is illustrative composition content and must not be generated as a public code prop until engineering API review.

**When to use**
- Present records across shared columns, for comparison, scanning, or exact reading.

**When not to use**
- Page layout — use a grid.
- A handful of key-value pairs — use a description list.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `density` | `compact` | Tighter spacing for information-dense screens. |
| `density` | `comfortable` | Default spacing, easier to scan and tap. |
| `selection` | `none` | Nothing is currently selected. |
| `selection` | `selected` | At least one item is selected. |

**State → tokens**

| State | Tokens |
|---|---|
| Density=Compact, Selection=None | fill card · border stroke/1 border · radius radius/lg · fill muted · padding t — r space/2-5 b — l space/2-5 · gap space/2 · text muted-foreground · type Caption/SM · padding t — r space/3 b — l space/3 · type Label/SM · border border · padding t — r space/3-25 b — l space/3-25 · radius radius/4 · text foreground · type Label/MD · type Body/SM · (+1 variant share these) |
| Density=Compact, Selection=Selected | fill card · border stroke/1 border · radius radius/lg · fill muted · padding t — r space/2-5 b — l space/2-5 · gap space/2 · text muted-foreground · type Caption/SM · padding t — r space/3 b — l space/3 · type Label/SM · border border · padding t — r space/3-25 b — l space/3-25 · radius radius/4 · text foreground · type Label/MD · type Body/SM · fill accent · fill primary · border stroke/1 primary · (+1 variant share these) |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Right-align numbers so digits line up.
- Keep the header visible while the body scrolls.
- Give empty, loading, and error states real treatments.

**Do not**
- Do not hide the only route to an action behind row hover.
- Do not let a wide table break the page — let the table itself scroll.

**Accessibility**
- Role: `table`
- Keyboard: Interactive cells are reachable in reading order.
- Header cells are th with the right scope; a caption names the table.
- Sortable headers carry aria-sort, and the control is a button inside the th.

**Tokens used** — `Body/SM` · `Caption/SM` · `Label/MD` · `Label/SM` · `accent` · `border` · `card` · `foreground` · `muted` · `muted-foreground` · `primary` · `radius/4` · `radius/lg` · `space/2` · `space/2-5` · `space/3` · `space/3-25` · `stroke/1`

<sub>status `draft` · updated 2026-08-10 · fingerprint `9f8012dfd623156f` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Table / Action Trigger

**Icon-only row-action trigger used with Dropdown Menu.**

Icon-only row-action trigger used with Dropdown Menu. States cover default, hover, focus-visible, and disabled. Runtime implementation requires an accessible name and menu focus management.

Accessibility contract: icon-only row action trigger requires a programmatic accessible name that identifies the action context (for example, “Open row actions”) and a visible focus indicator.

**When to use**
- Only inside its parent component's composition — this is a part, not a standalone component.

**When not to use**
- On its own, outside the parent that owns its behaviour and accessibility wiring.
- As a general-purpose layout or text primitive.

**State → tokens**

| State | Tokens |
|---|---|
| State=Default | fill card · radius radius/lg |
| State=Hover | fill accent · radius radius/lg |
| State=Focused | fill accent · border stroke/2 ring · radius radius/lg |
| State=Disabled | fill card · radius radius/lg · opacity opacity/50 |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Compose it through the parent rather than reaching for it directly.

**Do not**
- Do not emit State as an enum prop. It packs states that co-occur at runtime.
- Do not remove the ring border on focus. It is the only focus affordance.
- Do not re-implement the parent's keyboard or focus behaviour on the part.

**Accessibility**
- icon-only row action trigger requires a programmatic accessible name that identifies the action context (for example, “Open row actions”) and a visible focus indicator.
- State decomposition applies — see docs/state-decomposition.md. State [Default · Hover · Focused · Disabled] → :hover + :focus-visible CSS-owned, dropped; disabled independent boolean

**Tokens used** — `accent` · `card` · `opacity/50` · `radius/lg` · `ring` · `stroke/2`

<sub>status `draft` · updated 2026-08-10 · fingerprint `bcfaf3681178deff` · provenance description:imported · dos:imported+best-practice · donts:imported+best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:imported · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Table / Body

**Table body section containing data rows.**

Table body section containing data rows. Use the Row component states for hover and selection.

**When to use**
- Only inside its parent component's composition — this is a part, not a standalone component.

**When not to use**
- On its own, outside the parent that owns its behaviour and accessibility wiring.
- As a general-purpose layout or text primitive.

**State → tokens**

| State | Tokens |
|---|---|
| Default |  |

**Do**
- Compose it through the parent rather than reaching for it directly.

**Do not**
- Do not re-implement the parent's keyboard or focus behaviour on the part.

<sub>status `draft` · updated 2026-08-10 · fingerprint `cf913a3c8efd2380` · provenance description:imported · dos:best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · states:live-bindings</sub>

---

## Table / Caption

**Accessible descriptive caption for a table.**

Accessible descriptive caption for a table. Position is visual; code should preserve caption semantics and reading order.

**When to use**
- Only inside its parent component's composition — this is a part, not a standalone component.

**When not to use**
- On its own, outside the parent that owns its behaviour and accessibility wiring.
- As a general-purpose layout or text primitive.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `position` | `top` | Placed above the content. |
| `position` | `bottom` | Placed below the content. |

**State → tokens**

| State | Tokens |
|---|---|
| Position=Top | padding y space/1-5 x space/2 · text muted-foreground · type Body/XS · (+1 variant share these) |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Compose it through the parent rather than reaching for it directly.

**Do not**
- Do not re-implement the parent's keyboard or focus behaviour on the part.

**Tokens used** — `Body/XS` · `muted-foreground` · `space/1-5` · `space/2`

<sub>status `draft` · updated 2026-08-10 · fingerprint `15b8271af34ef31b` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Table / Cell

**Semantic table data cell with alignment and text-emphasis options.**

Semantic table data cell with alignment and text-emphasis options. Width is controlled by the containing column or row composition.

**When to use**
- Only inside its parent component's composition — this is a part, not a standalone component.

**When not to use**
- On its own, outside the parent that owns its behaviour and accessibility wiring.
- As a general-purpose layout or text primitive.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `alignment` | `left` | Text aligned to the leading edge — the default for labels and prose. |
| `alignment` | `center` | Text centred in the cell. |
| `alignment` | `right` | Text aligned to the trailing edge — use for numbers, so digits line up. |
| `emphasis` | `default` | Normal weight — the standard treatment. |
| `emphasis` | `strong` | Heavier weight, to mark the row's key value. |

**State → tokens**

| State | Tokens |
|---|---|
| Alignment=Left, Emphasis=Default | padding t — r space/4 b — l space/4 · text muted-foreground · type Body/SM · (+2 variants share these) |
| Alignment=Left, Emphasis=Strong | padding t — r space/4 b — l space/4 · text foreground · type Value/Strong · (+2 variants share these) |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Compose it through the parent rather than reaching for it directly.

**Do not**
- Do not re-implement the parent's keyboard or focus behaviour on the part.

**Tokens used** — `Body/SM` · `Value/Strong` · `foreground` · `muted-foreground` · `space/4`

<sub>status `draft` · updated 2026-08-10 · fingerprint `aadfde84ec35a82d` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Table / Container

**Responsive overflow wrapper used by the Table root.**

Responsive overflow wrapper used by the Table root. Viewport variants document desktop fit and compact horizontal scrolling. Runtime implementation should expose the scroll region without collapsing column readability.

**When to use**
- Only inside its parent component's composition — this is a part, not a standalone component.

**When not to use**
- On its own, outside the parent that owns its behaviour and accessibility wiring.
- As a general-purpose layout or text primitive.

**State → tokens**

| State | Tokens |
|---|---|
| Viewport=Desktop | fill card · border stroke/1 border · radius radius/lg · padding space/2 · gap space/2 · fill muted · fill accent · gap space/1-5 · text muted-foreground · type UNBOUND 10/16 Regular · (+1 variant share these) |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Compose it through the parent rather than reaching for it directly.

**Do not**
- Do not turn Viewport into a code prop.
- Do not re-implement the parent's keyboard or focus behaviour on the part.

**Tokens used** — `accent` · `border` · `card` · `muted` · `muted-foreground` · `radius/lg` · `space/1-5` · `space/2` · `stroke/1`

<sub>status `draft` · updated 2026-08-10 · fingerprint `2ed6321e4906784e` · provenance description:imported · dos:imported+best-practice · donts:imported+best-practice · whenToUse:best-practice · whenNotToUse:best-practice · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Table / Footer

**Table footer section for totals, summaries, or aggregate content.**

**When to use**
- Only inside its parent component's composition — this is a part, not a standalone component.

**When not to use**
- On its own, outside the parent that owns its behaviour and accessibility wiring.
- As a general-purpose layout or text primitive.

**State → tokens**

| State | Tokens |
|---|---|
| Default |  |

**Do**
- Compose it through the parent rather than reaching for it directly.

**Do not**
- Do not re-implement the parent's keyboard or focus behaviour on the part.

<sub>status `draft` · updated 2026-08-10 · fingerprint `983056e63b6659ae` · provenance description:imported · dos:best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · states:live-bindings</sub>

---

## Table / Head

**Semantic table column header.**

Semantic table column header. Alignment controls presentation only; use scope/row-header semantics in code where applicable.

**When to use**
- Only inside its parent component's composition — this is a part, not a standalone component.

**When not to use**
- On its own, outside the parent that owns its behaviour and accessibility wiring.
- As a general-purpose layout or text primitive.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `alignment` | `left` | Text aligned to the leading edge — the default for labels and prose. |
| `alignment` | `center` | Text centred in the cell. |
| `alignment` | `right` | Text aligned to the trailing edge — use for numbers, so digits line up. |

**State → tokens**

| State | Tokens |
|---|---|
| Alignment=Left | padding t — r space/4 b — l space/4 · text muted-foreground · type Label/SM · (+2 variants share these) |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Compose it through the parent rather than reaching for it directly.

**Do not**
- Do not re-implement the parent's keyboard or focus behaviour on the part.

**Tokens used** — `Label/SM` · `muted-foreground` · `space/4`

<sub>status `draft` · updated 2026-08-10 · fingerprint `4215afc070ea978b` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Table / Header

**Table header section containing semantic column headers.**

Table header section containing semantic column headers. This wrapper has no independent visual fill beyond its rows.

**When to use**
- Only inside its parent component's composition — this is a part, not a standalone component.

**When not to use**
- On its own, outside the parent that owns its behaviour and accessibility wiring.
- As a general-purpose layout or text primitive.

**State → tokens**

| State | Tokens |
|---|---|
| Default |  |

**Do**
- Compose it through the parent rather than reaching for it directly.

**Do not**
- Do not re-implement the parent's keyboard or focus behaviour on the part.

<sub>status `draft` · updated 2026-08-10 · fingerprint `d26449937af46ff3` · provenance description:imported · dos:best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · states:live-bindings</sub>

---

## Table / Root Composition

**Source-parity Table compositions covering the basic invoice example, explicit footer example, row actions with a Dropdown Menu trigger, RTL content, desktop fit, and compact horizontal overflow.**

Source-parity Table compositions covering the basic invoice example, explicit footer example, row actions with a Dropdown Menu trigger, RTL content, desktop fit, and compact horizontal overflow. The original Table set remains the Jake UI density and selection extension.

Pipeline property contract: only the component properties defined on this set are configurable public inputs. Other embedded copy is illustrative composition content and must not be generated as a public code prop until engineering API review.

**When to use**
- Present records across shared columns, for comparison, scanning, or exact reading.

**When not to use**
- Page layout — use a grid.
- A handful of key-value pairs — use a description list.

**State → tokens**

| State | Tokens |
|---|---|
| Pattern=Basic, Viewport=Desktop | gap space/2 · fill card · fill muted · border border · (+3 variants share these) |
| Pattern=Basic, Viewport=Compact | gap space/2 · fill card · fill muted · border border · radius radius/lg · padding y space/1 x space/2 · text muted-foreground · type Caption/XS · (+3 variants share these) |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Right-align numbers so digits line up.
- Keep the header visible while the body scrolls.
- Give empty, loading, and error states real treatments.

**Do not**
- Do not turn Pattern/Viewport into a code prop.
- Do not hide the only route to an action behind row hover.
- Do not let a wide table break the page — let the table itself scroll.

**Accessibility**
- Role: `table`
- Keyboard: Interactive cells are reachable in reading order.
- Header cells are th with the right scope; a caption names the table.
- Sortable headers carry aria-sort, and the control is a button inside the th.

**Tokens used** — `Caption/XS` · `border` · `card` · `muted` · `muted-foreground` · `radius/lg` · `space/1` · `space/2`

<sub>status `draft` · updated 2026-08-10 · fingerprint `9e0f5a5950057c8b` · provenance description:imported · dos:imported+best-practice · donts:imported+best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Table / Row

**Table row patterns for header, body, and footer sections.**

Table row patterns for header, body, and footer sections. Body rows include default, hover, and selected states. Density controls row height without changing semantic structure.

Pipeline API classification: apply the Governance property-classification rule before code mapping. Visual State axes are QA/story states unless engineering explicitly approves a controlled runtime prop; Viewport is responsive test data; Pattern is composition/story data.

**When to use**
- Only inside its parent component's composition — this is a part, not a standalone component.

**When not to use**
- On its own, outside the parent that owns its behaviour and accessibility wiring.
- As a general-purpose layout or text primitive.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `type` | `header` | The heading region, above the body. |
| `type` | `body` | The main content region. |
| `type` | `footer` | The summary or totals region, below the body. |
| `density` | `compact` | Tighter spacing for information-dense screens. |
| `density` | `comfortable` | Default spacing, easier to scan and tap. |

**State → tokens**

| State | Tokens |
|---|---|
| Type=Header, State=Default, Density=Compact | fill muted · border border · (+5 variants share these) |
| Type=Body, State=Default, Density=Compact | fill card · border border · (+1 variant share these) |
| Type=Body, State=Selected, Density=Compact | fill accent · border border · (+1 variant share these) |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Compose it through the parent rather than reaching for it directly.

**Do not**
- Do not emit State as an enum prop. It packs states that co-occur at runtime.
- Do not re-implement the parent's keyboard or focus behaviour on the part.

**Accessibility**
- State decomposition applies — see docs/state-decomposition.md. State [Default · Hover · Selected] → :hover CSS-owned, dropped; selected controlled state

**Tokens used** — `accent` · `border` · `card` · `muted`

<sub>status `draft` · updated 2026-08-10 · fingerprint `55000039196f6f01` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:imported+best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:imported · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Tabs

**Grouped navigation for switching between peer views without leaving the current context.**

Grouped navigation for switching between peer views without leaving the current context. Orientation controls horizontal or vertical layout; Density supports default and compact applications.

**When to use**
- Switch between peer views of the same subject, within one context.

**When not to use**
- Steps in a sequence — use a stepper.
- Content the reader needs to compare side by side, or to find with the browser's search.
- Navigating to a different page — use links.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `orientation` | `horizontal` | Lays out along the inline axis. |
| `orientation` | `vertical` | Lays out along the block axis. |
| `density` | `default` | Standard spacing. |
| `density` | `compact` | Tighter spacing for information-dense screens. |

**State → tokens**

| State | Tokens |
|---|---|
| Orientation=Horizontal, Density=Default | fill muted · radius radius/lg · padding space/1 · gap space/1 · (+1 variant share these) |
| Orientation=Horizontal, Density=Compact | fill muted · radius radius/lg · padding space/0-75 · gap space/0-5 · (+1 variant share these) |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Keep one tab selected at all times.
- Keep labels short enough to fit on one line without wrapping.
- Preserve each panel's state when switching away and back.

**Do not**
- Do not scroll or wrap tabs into a second row — reconsider the grouping.
- Do not hide required form fields in an unselected tab.

**Accessibility**
- Role: `tablist`
- Keyboard: Arrow keys move between tabs; Home and End jump to the first and last.
- Keyboard: Tab moves from the tab list into the active panel.
- Each tab carries aria-selected and aria-controls; each panel is labelled by its tab.
- Only the selected tab is in the tab order.

**Tokens used** — `muted` · `radius/lg` · `space/0-5` · `space/0-75` · `space/1`

<sub>status `draft` · updated 2026-08-10 · fingerprint `fd7ace0b2381ab3b` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Textarea

**Multiline text input for longer freeform content.**

Multiline text input for longer freeform content. Error state communicates validation failure; disabled state prevents editing.

Sizing exception: Textarea intentionally uses a fixed editing viewport height. Long input scrolls or expands according to the runtime textarea contract; do not convert the Figma value region to automatic component height without a product-level behavior change.

Accessibility contract: State=Error requires specific visible error text outside or below the editing surface and an assistive-technology error relationship; color alone is insufficient.

**When to use**
- Collect free-form text long enough to need more than one line.

**When not to use**
- A single short value — use Input.
- Rich or formatted content — use a rich-text editor, not a plain textarea.

**State → tokens**

| State | Tokens |
|---|---|
| State=Default | fill card · border stroke/1 input · radius radius/lg · padding space/3 · gap space/2 · text foreground · type Body/MD · text muted-foreground · type Caption/SM |
| State=Focused | fill card · border stroke/2 ring · radius radius/lg · padding space/3 · gap space/2 · text foreground · type Body/MD · text muted-foreground · type Caption/SM |
| State=Error | fill card · border stroke/1 destructive · radius radius/lg · padding space/3 · gap space/2 · text foreground · type Body/MD · text destructive · type Caption/SM |
| State=Disabled | fill muted · border stroke/1 input · radius radius/lg · padding space/3 · gap space/2 · text muted-foreground · type Body/MD · type Caption/SM |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Always pair with a visible label.
- Size the default height to the expected answer, so the field itself sets the expectation.
- Reserve space for error text so validation does not shift the layout.
- Show a character counter whenever a limit is enforced.

**Do not**
- Do not emit State as an enum prop. It packs states that co-occur at runtime.
- Do not remove the ring border on focus. It is the only focus affordance.
- Do not use placeholder text as the only label.
- Do not silently truncate at a limit — say the limit before it is hit.
- Do not make it so short that the user edits through a keyhole.

**Accessibility**
- Keyboard: Standard text-editing keys.
- Keyboard: Enter inserts a newline; it must not submit the form.
- State=Error requires specific visible error text outside or below the editing surface and an assistive-technology error relationship; color alone is insufficient.
- State decomposition applies — see docs/state-decomposition.md. State [Default · Focused · Error · Disabled] → :focus-visible CSS-owned, dropped; invalid + disabled independent booleans
- Every textarea has a programmatically associated label.
- The error state sets aria-invalid and links its message via aria-describedby.
- A character counter is announced politely, not on every keystroke.

**Tokens used** — `Body/MD` · `Caption/SM` · `card` · `destructive` · `foreground` · `input` · `muted` · `muted-foreground` · `radius/lg` · `ring` · `space/2` · `space/3` · `stroke/1` · `stroke/2`

<sub>status `draft` · updated 2026-08-10 · fingerprint `ec9f2c16ee0f5d56` · provenance description:imported · dos:imported+best-practice · donts:imported+best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:imported+w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Toggle

**Two-state action button for formatting, view controls, or other reversible selections.**

Two-state action button for formatting, view controls, or other reversible selections. Pressed state indicates the active selection.

Pipeline API classification: apply the Governance property-classification rule before code mapping. Visual State axes are QA/story states unless engineering explicitly approves a controlled runtime prop; Viewport is responsive test data; Pattern is composition/story data.

**When to use**
- A reversible on/off action that takes effect immediately — bold, mute, pin, show grid.
- Use the group form when several such actions belong together in a toolbar.

**When not to use**
- A form value that is only applied on Save — use Checkbox or Switch.
- One-of-many where the options are the data, not actions — use Radio Group.
- A one-way action that cannot be un-done — use a Button.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `pressed` | `false` | Off — the toggle is not engaged. |
| `pressed` | `true` | On — the toggle is engaged. |

**State → tokens**

| State | Tokens |
|---|---|
| Pressed=False, State=Default | fill card · border stroke/1 border · radius radius/md · padding y space/2 x space/3 · gap space/2 · text foreground · type Heading/XS · type Label/LG |
| Pressed=False, State=Hover | fill accent · border stroke/1 border · radius radius/md · padding y space/2 x space/3 · gap space/2 · text foreground · type Heading/XS · type Label/LG |
| Pressed=False, State=Focused | fill card · border stroke/2 ring · radius radius/md · padding y space/2 x space/3 · gap space/2 · text foreground · type Heading/XS · type Label/LG |
| Pressed=False, State=Disabled | fill muted · radius radius/md · padding y space/2 x space/3 · gap space/2 · text muted-foreground · type Heading/XS · type Label/LG · (+1 variant share these) |
| Pressed=True, State=Default | fill accent · radius radius/md · padding y space/2 x space/3 · gap space/2 · text accent-foreground · type Heading/XS · type Label/LG |
| Pressed=True, State=Hover | fill accent-hover · radius radius/md · padding y space/2 x space/3 · gap space/2 · text accent-foreground · type Heading/XS · type Label/LG |
| Pressed=True, State=Focused | fill accent · border stroke/2 ring · radius radius/md · padding y space/2 x space/3 · gap space/2 · text accent-foreground · type Heading/XS · type Label/LG |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Keep the label constant and let the pressed state carry the change — a label that flips between 'Mute' and 'Unmute' is ambiguous when read alongside its own state.
- Give an icon-only toggle an accessible name.
- Apply the effect immediately; there is no Save step.

**Do not**
- Do not emit State as an enum prop. It packs states that co-occur at runtime.
- Do not remove the ring border on focus. It is the only focus affordance.
- Do not use aria-checked — that is the checkbox and radio pattern.
- Do not rely on colour alone to show pressed; the state must be in the accessibility tree.
- Do not put a toggle in a group where only one may be active and call it single-select without also making it behave that way.

**Accessibility**
- Role: `button`
- Keyboard: Space and Enter both toggle — it is a button, so both must work.
- Keyboard: Tab moves between toggles; arrow keys are not used.
- State decomposition applies — see docs/state-decomposition.md. State [Default · Hover · Focused · Disabled] → :hover + :focus-visible CSS-owned, dropped; disabled independent boolean
- Pressed state is exposed via aria-pressed, never aria-checked.
- An icon-only toggle needs an aria-label that names the action, not the state.
- A disabled toggle is not focusable.

**Tokens used** — `Heading/XS` · `Label/LG` · `accent` · `accent-foreground` · `accent-hover` · `border` · `card` · `foreground` · `muted` · `muted-foreground` · `radius/md` · `ring` · `space/2` · `space/3` · `stroke/1` · `stroke/2`

<sub>status `draft` · updated 2026-08-10 · fingerprint `9bf27f663428a017` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:imported+best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:imported+w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Toggle Group

**Grouped toggle controls for choosing one or multiple persistent options.**

Grouped toggle controls for choosing one or multiple persistent options. Use single selection when options are mutually exclusive.

**When to use**
- A reversible on/off action that takes effect immediately — bold, mute, pin, show grid.
- Use the group form when several such actions belong together in a toolbar.

**When not to use**
- A form value that is only applied on Save — use Checkbox or Switch.
- One-of-many where the options are the data, not actions — use Radio Group.
- A one-way action that cannot be un-done — use a Button.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `selection` | `single` | One item at a time may be selected. |
| `selection` | `multiple` | Several items may be selected at once. |
| `orientation` | `horizontal` | Lays out along the inline axis. |
| `orientation` | `vertical` | Lays out along the block axis. |

**State → tokens**

| State | Tokens |
|---|---|
| Selection=Single, Orientation=Horizontal | gap space/2 · (+3 variants share these) |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Keep the label constant and let the pressed state carry the change — a label that flips between 'Mute' and 'Unmute' is ambiguous when read alongside its own state.
- Give an icon-only toggle an accessible name.
- Apply the effect immediately; there is no Save step.

**Do not**
- Do not use aria-checked — that is the checkbox and radio pattern.
- Do not rely on colour alone to show pressed; the state must be in the accessibility tree.
- Do not put a toggle in a group where only one may be active and call it single-select without also making it behave that way.

**Accessibility**
- Role: `button`
- Keyboard: Space and Enter both toggle — it is a button, so both must work.
- Keyboard: Tab moves between toggles; arrow keys are not used.
- Pressed state is exposed via aria-pressed, never aria-checked.
- An icon-only toggle needs an aria-label that names the action, not the state.
- A disabled toggle is not focusable.

**Tokens used** — `space/2`

<sub>status `draft` · updated 2026-08-10 · fingerprint `62b63da2e36e689f` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

---

## Tooltip

**Brief non-interactive label revealed on hover or focus.**

Brief non-interactive label revealed on hover or focus. Side controls preferred placement relative to the trigger.

**When to use**
- Name or clarify a control whose purpose is not obvious from its label alone.

**When not to use**
- Content the user must read to proceed — a tooltip is unreachable on touch and easy to miss.
- Anything interactive: links, buttons, or text to copy — use a Popover.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `side` | `top` | Opens above the trigger. |
| `side` | `bottom` | Opens below the trigger. |
| `side` | `left` | Opens to the left of the trigger. |
| `side` | `right` | Opens to the right of the trigger. |

**State → tokens**

| State | Tokens |
|---|---|
| Side=Top | fill foreground · radius radius/lg · padding y space/2-5 x space/3 · text card · type Label/SM · (+3 variants share these) |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Keep it to a short phrase.
- Attach it to the control itself, so it is reachable by keyboard focus.

**Do not**
- Do not put a tooltip on a non-focusable element.
- Do not repeat the visible label verbatim.
- Do not place essential or interactive content inside one.

**Accessibility**
- Role: `tooltip`
- Keyboard: Shows on focus as well as hover.
- Keyboard: Escape dismisses it.
- Referenced by the control via aria-describedby.
- Stays visible long enough to read, and while the pointer is over it.

**Tokens used** — `Label/SM` · `card` · `foreground` · `radius/lg` · `space/2-5` · `space/3`

<sub>status `draft` · updated 2026-08-10 · fingerprint `a21d6200357d1451` · provenance description:imported · variants:imported+framework · dos:imported+best-practice · donts:best-practice · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:w3c-apg · states:live-bindings · tokensUsed:live-bindings</sub>

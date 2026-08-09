# Jake UI — component usage digest

**GENERATED — do not hand-edit.** Source of truth is one
`docs/components/<Name>.doc.json` record per component. Change those (or
`docs/archetypes.json`) and re-run `npm run docs:digest`.

This is the single-file surface for an agent building against Jake UI: every
component's purpose, variant meanings, state→token bindings, do/do-not rules,
accessibility contract, and the tokens it consumes.

**86 component(s) documented.**

⚠️ **70 record(s) carry blocks still owed to human review** — a missing
`When to use`, or a variant meaning marked _needs review_. Those gaps are
deliberate: they cannot be inferred from Figma or from an archetype, and
inventing them would be worse than leaving them visible.

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

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `state` | `closed` | _needs review_ |
| `state` | `open` | _needs review_ |
| `disabled` | `false` | _needs review_ |
| `disabled` | `true` | _needs review_ |

**State → tokens**

| State | Tokens |
|---|---|
| State=Closed, Disabled=False | fill card · border 1px border · radius radius/lg · text foreground · type size/14 |
| State=Closed, Disabled=True | fill muted · text muted-foreground |
| State=Open, Disabled=True | fill muted · text muted-foreground |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Tokens used** — `border` · `card` · `foreground` · `muted` · `muted-foreground` · `radius/lg` · `size/14`

<sub>status `draft` · updated 2026-08-09 · fingerprint `07cd5431c6e43415` · provenance description:imported · variants:imported · states:imported · dos:imported · tokensUsed:imported</sub>

---

## Alert

**Inline feedback message for informational, successful, warning, and destructive states.**

Inline feedback message for informational, successful, warning, and destructive states. Use semantic feedback variables; reserve destructive tone for errors that block progress. Sizing policy: fixed/default width with Hug Contents height.

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
| Tone=Info | fill info-muted · border 1px info · radius radius/lg · text info · type size/14 |
| Tone=Success | fill success-muted · border 1px success · text success |
| Tone=Warning | fill warning-muted · border 1px warning · text warning |
| Tone=Destructive | fill card · border 1px destructive · text destructive |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Tokens used** — `card` · `destructive` · `info` · `info-muted` · `radius/lg` · `size/14` · `success` · `success-muted` · `warning` · `warning-muted`

<sub>status `draft` · updated 2026-08-09 · fingerprint `ed414a88baefb901` · provenance description:imported · variants:imported+framework · states:imported · dos:imported · tokensUsed:imported</sub>

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
| Tone=Default | fill card · border 1px border · radius radius/lg · text card-foreground · type size/18 |

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

**Tokens used** — `border` · `card` · `card-foreground` · `radius/lg` · `size/18`

<sub>status `draft` · updated 2026-08-09 · fingerprint `1207477704891b2c` · provenance description:imported · variants:imported+framework · states:imported · dos:imported+best-practice · tokensUsed:imported · whenToUse:best-practice · whenNotToUse:best-practice · donts:best-practice · accessibility:w3c-apg</sub>

---

## Avatar

**Compact identity representation using initials and optional presence status.**

Compact identity representation using initials and optional presence status. Use the smallest size that remains legible in context.

Layout exception: Avatar status dots are intentionally absolute-positioned to the avatar edge. This anchored overlay is not a structural layout dependency.

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
| Size=Small, Type=Initials | fill primary · radius radius/16 · text primary-foreground · type size/11 |
| Size=Medium, Type=Initials | radius radius/24 · type size/14 |
| Size=Medium, Type=Status | radius radius/24 · type size/14 |
| Size=Large, Type=Initials | radius radius/32 · type size/18 |
| Size=Large, Type=Status | radius radius/32 · type size/18 |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Tokens used** — `primary` · `primary-foreground` · `radius/16` · `radius/24` · `radius/32` · `size/11` · `size/14` · `size/18`

<sub>status `draft` · updated 2026-08-09 · fingerprint `084005172b71856a` · provenance description:imported · variants:imported+framework · states:imported · dos:imported · tokensUsed:imported</sub>

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
| Tone=Neutral, Size=Small | fill secondary · radius radius/lg · text secondary-foreground · type size/11 |
| Tone=Neutral, Size=Medium | type size/12 |
| Tone=Info, Size=Small | fill info · text info-foreground |
| Tone=Info, Size=Medium | fill info · text info-foreground · type size/12 |
| Tone=Success, Size=Small | fill success · text info-foreground |
| Tone=Success, Size=Medium | fill success · text info-foreground · type size/12 |
| Tone=Warning, Size=Small | fill warning · text warning-foreground |
| Tone=Warning, Size=Medium | fill warning · text warning-foreground · type size/12 |

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

**Tokens used** — `info` · `info-foreground` · `radius/lg` · `secondary` · `secondary-foreground` · `size/11` · `size/12` · `success` · `warning` · `warning-foreground`

<sub>status `draft` · updated 2026-08-09 · fingerprint `136f6dc031fa1df3` · provenance description:imported · variants:imported+framework · states:imported · dos:imported+best-practice · tokensUsed:imported · whenToUse:best-practice · whenNotToUse:best-practice · donts:best-practice · accessibility:w3c-apg</sub>

---

## Breadcrumb

**Hierarchical location trail.**

Hierarchical location trail. Use Collapsed=True when intermediate levels must be condensed at narrower widths. Sizing policy: Hug Contents width with fixed standard control height.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `collapsed` | `false` | _needs review_ |
| `collapsed` | `true` | _needs review_ |

**State → tokens**

| State | Tokens |
|---|---|
| Collapsed=False | fill card · border 1px border · radius radius/lg · text muted-foreground · type size/13 |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Tokens used** — `border` · `card` · `muted-foreground` · `radius/lg` · `size/13`

<sub>status `draft` · updated 2026-08-09 · fingerprint `0a5ce504c04d54ba` · provenance description:imported · variants:imported · states:imported · dos:imported · tokensUsed:imported</sub>

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
| Style=Primary, Size=Small, State=Default | fill primary · radius radius/lg · text primary-foreground · type size/13 |
| Style=Primary, Size=Small, State=Disabled | fill muted · text muted-foreground |
| Style=Primary, Size=Medium, State=Default | type size/14 |
| Style=Primary, Size=Medium, State=Hover | type size/14 |
| Style=Primary, Size=Medium, State=Disabled | fill muted · text muted-foreground · type size/14 |
| Style=Secondary, Size=Small, State=Default | fill secondary · text secondary-foreground |
| Style=Secondary, Size=Small, State=Hover | fill accent · text secondary-foreground |
| Style=Secondary, Size=Small, State=Disabled | fill muted · text muted-foreground |

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

**Tokens used** — `accent` · `muted` · `muted-foreground` · `primary` · `primary-foreground` · `radius/lg` · `secondary` · `secondary-foreground` · `size/13` · `size/14`

<sub>status `draft` · updated 2026-08-09 · fingerprint `b312af55ad9bad9b` · provenance description:imported · variants:imported+framework · states:imported · dos:imported+best-practice · donts:imported+best-practice · accessibility:imported+w3c-apg · tokensUsed:imported · whenToUse:best-practice · whenNotToUse:best-practice</sub>

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
| `attached` | `false` | _needs review_ |
| `attached` | `true` | _needs review_ |

**State → tokens**

| State | Tokens |
|---|---|
| Orientation=Horizontal, Attached=False | text primary-foreground · type size/14 |

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

**Tokens used** — `primary-foreground` · `size/14`

<sub>status `draft` · updated 2026-08-09 · fingerprint `4ca12e3bcd866fdc` · provenance description:imported · variants:imported+framework · states:imported · dos:imported+best-practice · tokensUsed:imported · whenToUse:best-practice · whenNotToUse:best-practice · donts:best-practice · accessibility:w3c-apg</sub>

---

## Calendar

**Month calendar supporting single-date and date-range selection in compact and comfortable densities.**

Month calendar supporting single-date and date-range selection in compact and comfortable densities. Includes today, selected, range, disabled, and outside-month states. Fixed default width with Hug Contents height.

Pipeline property contract: only the component properties defined on this set are configurable public inputs. Other embedded copy is illustrative composition content and must not be generated as a public code prop until engineering API review.

Accessibility contract: month navigation controls require programmatic names such as Previous month and Next month; selected/today/range states require programmatic equivalents and must not rely on color alone.

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
| Mode=Single, Density=Compact | fill card · border 1px border · radius radius/lg · text foreground · type size/13 |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Accessibility**
- month navigation controls require programmatic names such as Previous month and Next month; selected/today/range states require programmatic equivalents and must not rely on color alone.

**Tokens used** — `border` · `card` · `foreground` · `radius/lg` · `size/13`

<sub>status `draft` · updated 2026-08-09 · fingerprint `ed271d9472925285` · provenance description:imported · variants:imported+framework · states:imported · dos:imported · accessibility:imported · tokensUsed:imported</sub>

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
| Type=Content, State=Default | fill card · border 1px border · radius radius/lg · text info-foreground · type size/11 |
| Type=Content, State=Interactive | border 2px primary |
| Type=Media, State=Interactive | border 2px primary |

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

**Tokens used** — `border` · `card` · `info-foreground` · `primary` · `radius/lg` · `size/11`

<sub>status `draft` · updated 2026-08-09 · fingerprint `9fe82e7c0bdc0914` · provenance description:imported · variants:imported+framework · states:imported · dos:imported+best-practice · tokensUsed:imported · whenToUse:best-practice · whenNotToUse:best-practice · donts:best-practice · accessibility:w3c-apg</sub>

---

## Chart

**Token-bound chart container for compact documentation and dashboard examples.**

Token-bound chart container for compact documentation and dashboard examples. Use Type to switch between bar and line representations.

Layout exception: chart plot geometry is intentionally coordinate-based because bars and line points represent data positions. Surrounding chart content may use auto layout, but plot marks are excluded from structural auto-layout linting.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `type` | `bar` | Categorical comparison. |
| `type` | `line` | Change over a continuous axis. |

**State → tokens**

| State | Tokens |
|---|---|
| Type=Bar | fill card · border 1px border · radius radius/lg · text foreground · type size/16 |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Tokens used** — `border` · `card` · `foreground` · `radius/lg` · `size/16`

<sub>status `draft` · updated 2026-08-09 · fingerprint `60a16c7b14bcb5e5` · provenance description:imported · variants:imported+framework · states:imported · dos:imported · tokensUsed:imported</sub>

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
| Value=Unchecked, State=Default | text foreground · type size/14 |
| Value=Unchecked, State=Disabled | text muted-foreground |
| Value=Checked, State=Disabled | text muted-foreground |
| Value=Indeterminate, State=Disabled | text muted-foreground |

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

**Tokens used** — `foreground` · `muted-foreground` · `size/14`

<sub>status `draft` · updated 2026-08-09 · fingerprint `0d1f6fdeda171066` · provenance description:imported · variants:imported+framework · states:imported · dos:imported+best-practice · donts:imported+best-practice · accessibility:imported+w3c-apg · tokensUsed:imported · whenToUse:best-practice · whenNotToUse:best-practice</sub>

---

## Collapsible

**Single disclosure region for optional controls or secondary information.**

Single disclosure region for optional controls or secondary information. Use Accordion instead when multiple related items are grouped together. Sizing policy: fixed/default width with Hug Contents height.

Interaction contract: open/closed and disabled are persistent disclosure states. Hover, pressed, and focus-visible belong to the disclosure trigger at runtime and are not separate root variants.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `state` | `closed` | _needs review_ |
| `state` | `open` | _needs review_ |
| `disabled` | `false` | _needs review_ |
| `disabled` | `true` | _needs review_ |

**State → tokens**

| State | Tokens |
|---|---|
| State=Closed, Disabled=False | fill card · border 1px border · radius radius/lg · text foreground · type size/14 |
| State=Closed, Disabled=True | fill muted · text muted-foreground |
| State=Open, Disabled=True | fill muted · text muted-foreground |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Tokens used** — `border` · `card` · `foreground` · `muted` · `muted-foreground` · `radius/lg` · `size/14`

<sub>status `draft` · updated 2026-08-09 · fingerprint `2ebcc305068dc984` · provenance description:imported · variants:imported · states:imported · dos:imported · tokensUsed:imported</sub>

---

## Command

**Command menu item primitive.**

Command menu item primitive. Use Selected=True for the currently highlighted result.

Interaction contract: Selected=True is the highlighted command option used for pointer or keyboard roving selection. DOM focus remains on the command input/list controller, so a separate item focus variant is not required.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `selected` | `false` | _needs review_ |
| `selected` | `true` | _needs review_ |

**State → tokens**

| State | Tokens |
|---|---|
| Selected=False | radius radius/lg · text foreground · type size/14 |
| Selected=True | fill accent · text accent-foreground |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Tokens used** — `accent` · `accent-foreground` · `foreground` · `radius/lg` · `size/14`

<sub>status `draft` · updated 2026-08-09 · fingerprint `ca4707ccd4bf32f5` · provenance description:imported · variants:imported · states:imported · dos:imported · tokensUsed:imported</sub>

---

## Command Panel

**Watermelon package-manager command panel with editable Command text.**

<sub>status `draft` · updated 2026-08-09 · fingerprint `d10ca0fb5e0922ca` · provenance description:imported</sub>

---

## Data Table

**Data-management composition built from Input, Button, Table, and Pagination.**

Data-management composition built from Input, Button, Table, and Pagination. Supports desktop and compact viewports with populated and empty states. Fixed default width with Hug Contents height.

Pipeline property contract: only the component properties defined on this set are configurable public inputs. Other embedded copy is illustrative composition content and must not be generated as a public code prop until engineering API review.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `state` | `populated` | Has content to show. |
| `state` | `empty` | No content — show an empty state, not a blank area. |

**State → tokens**

| State | Tokens |
|---|---|
| Viewport=Desktop, State=Populated | fill card · border 1px border · radius radius/lg · text foreground · type size/18 |
| Viewport=Desktop, State=Empty | type size/15 |
| Viewport=Compact, State=Empty | type size/15 |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Do not**
- Do not turn Viewport into a code prop.

**Tokens used** — `border` · `card` · `foreground` · `radius/lg` · `size/15` · `size/18`

<sub>status `draft` · updated 2026-08-09 · fingerprint `23167dae8852b907` · provenance description:imported · variants:imported+framework · states:imported · dos:imported · donts:imported · tokensUsed:imported</sub>

---

## Date Picker

**Date-selection composition built from Input and Calendar.**

Date-selection composition built from Input and Calendar. Supports single and range modes, open and closed states, and default, focused, error, and disabled trigger states. Fixed default width with Hug Contents height.

Pipeline property contract: only the component properties defined on this set are configurable public inputs. Other embedded copy is illustrative composition content and must not be generated as a public code prop until engineering API review.

Layout exception: Date Picker Trigger overlays a fixed semantic Calendar icon on the nested Input. The trigger frame intentionally uses coordinate positioning for this adornment; the icon is a canonical Icon instance, not a text glyph.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `mode` | `single` | Selects one value. |
| `mode` | `range` | Selects a start and end pair. |
| `open` | `false` | _needs review_ |
| `open` | `true` | _needs review_ |

**State → tokens**

| State | Tokens |
|---|---|
| Mode=Single, State=Default, Open=False | text foreground · type size/14 |
| Mode=Single, State=Disabled, Open=False | text muted-foreground |
| Mode=Range, State=Disabled, Open=False | text muted-foreground |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Do not**
- Do not emit State as an enum prop. It packs states that co-occur at runtime.

**Accessibility**
- State decomposition applies — see docs/state-decomposition.md. State [Default · Focused · Error · Disabled] → :focus-visible CSS-owned, dropped; invalid + disabled independent booleans

**Tokens used** — `foreground` · `muted-foreground` · `size/14`

<sub>status `draft` · updated 2026-08-09 · fingerprint `316c9879cf57f7bf` · provenance description:imported · variants:imported+framework · states:imported · dos:imported · donts:imported · accessibility:imported · tokensUsed:imported</sub>

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
| Type=Standard, Size=Small | fill card · border 1px border · radius radius/lg · text foreground · type size/18 |
| Type=Form, Size=Small | type size/13 |
| Type=Form, Size=Large | type size/13 |

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

**Tokens used** — `border` · `card` · `foreground` · `radius/lg` · `size/13` · `size/18`

<sub>status `draft` · updated 2026-08-09 · fingerprint `d9717bb83f70289a` · provenance description:imported · variants:imported+framework · states:imported · dos:imported+best-practice · tokensUsed:imported · whenToUse:best-practice · whenNotToUse:best-practice · donts:best-practice · accessibility:w3c-apg</sub>

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
| Placement=Left, Width=Compact | fill card · border 1px border · radius radius/lg · text foreground · type size/18 |

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

**Tokens used** — `border` · `card` · `foreground` · `radius/lg` · `size/18`

<sub>status `draft` · updated 2026-08-09 · fingerprint `4e1c3500a010bb6a` · provenance description:imported · variants:imported+framework · states:imported · dos:imported+best-practice · tokensUsed:imported · whenToUse:best-practice · whenNotToUse:best-practice · donts:best-practice · accessibility:w3c-apg</sub>

---

## Dropdown Menu

**Basic Dropdown Menu content configurations preserved from the original core build.**

Basic Dropdown Menu content configurations preserved from the original core build. This set is now the basic content-pattern layer within the full source-parity architecture; use the dedicated Trigger, Item, Checkbox Item, Radio Item, Label, Separator, Shortcut, Sub Trigger, Content, Sub Content, and Root Composition assets for complete implementation coverage. Source parity baseline: Watermelon Dropdown Menu route, Watermelon shadcn foundation, and current official shadcn/Radix Dropdown Menu anatomy and API.

Pipeline property contract: only the component properties defined on this set are configurable public inputs. Other embedded copy is illustrative composition content and must not be generated as a public code prop until engineering API review.

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
| Type=Standard, Density=Compact | fill popover · border 1px border · radius radius/lg · text popover-foreground · type size/13 |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Tokens used** — `border` · `popover` · `popover-foreground` · `radius/lg` · `size/13`

<sub>status `draft` · updated 2026-08-09 · fingerprint `650f6fffa37a5444` · provenance description:imported · variants:imported+framework · states:imported · dos:imported · tokensUsed:imported</sub>

---

## Dropdown Menu / Checkbox Item

**Checkable menu item with unchecked, checked, and indeterminate values plus default, highlighted, and disabled states.**

Checkable menu item with unchecked, checked, and indeterminate values plus default, highlighted, and disabled states. Source parity baseline: Watermelon Dropdown Menu route, Watermelon shadcn foundation, and current official shadcn/Radix Dropdown Menu anatomy and API.

Pipeline exception: Icon is a legacy design-only text-glyph control with existing overrides. Do not map it to a production code prop. Migration to an Icon INSTANCE_SWAP requires an approved glyph-to-icon map and consumer update test.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `value` | `unchecked` | Not selected. |
| `value` | `checked` | Selected. |
| `value` | `indeterminate` | Partially selected — some children selected, some not. |

**State → tokens**

| State | Tokens |
|---|---|
| Value=Unchecked, State=Default | fill popover · radius radius/4 · text popover-foreground · type size/13 |
| Value=Unchecked, State=Highlighted | fill accent · text accent-foreground |
| Value=Checked, State=Highlighted | fill accent · text accent-foreground |
| Value=Indeterminate, State=Highlighted | fill accent · text accent-foreground |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Pass icons as @phosphor-icons/react components through the slot, never as text glyphs.

**Do not**
- Do not emit State as an enum prop. It packs states that co-occur at runtime.

**Accessibility**
- State decomposition applies — see docs/state-decomposition.md. State [Default · Highlighted · Disabled] → :highlighted CSS-owned, dropped; disabled independent boolean

**Tokens used** — `accent` · `accent-foreground` · `popover` · `popover-foreground` · `radius/4` · `size/13`

<sub>status `draft` · updated 2026-08-09 · fingerprint `b8d0a4ee2868e274` · provenance description:imported · variants:imported+framework · states:imported · dos:imported · donts:imported · accessibility:imported · tokensUsed:imported</sub>

---

## Dropdown Menu / Content

**Positioned menu content.**

Positioned menu content. Complete placement matrix: Side=Top/Right/Bottom/Left, Align=Start/Center/End, and optional Arrow. Content itself is open-only; closed behavior is represented at the Root Composition level. Source parity baseline: Watermelon Dropdown Menu route, Watermelon shadcn foundation, and current official shadcn/Radix Dropdown Menu anatomy and API.

Pipeline property contract: only the component properties defined on this set are configurable public inputs. Other embedded copy is illustrative composition content and must not be generated as a public code prop until engineering API review.

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
| `arrow` | `false` | _needs review_ |
| `arrow` | `true` | _needs review_ |

**State → tokens**

| State | Tokens |
|---|---|
| Side=Top, Align=Start, Arrow=False | text popover-foreground · type size/13 |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Tokens used** — `popover-foreground` · `size/13`

<sub>status `draft` · updated 2026-08-09 · fingerprint `ef8bc6cb467d2642` · provenance description:imported · variants:imported+framework · states:imported · dos:imported · tokensUsed:imported</sub>

---

## Dropdown Menu / Group

**Structural grouping wrapper for labels and related menu items.**

Structural grouping wrapper for labels and related menu items. It carries no visual treatment of its own. Source parity baseline: Watermelon Dropdown Menu route, Watermelon shadcn foundation, and current official shadcn/Radix Dropdown Menu anatomy and API.

<sub>status `draft` · updated 2026-08-09 · fingerprint `e0e6a55dae667040` · provenance description:imported</sub>

---

## Dropdown Menu / Item

**Standard command item.**

Standard command item. Supports default and destructive tones, default/highlighted/disabled interaction states, inset alignment, optional leading icon, and keyboard shortcut. Source parity baseline: Watermelon Dropdown Menu route, Watermelon shadcn foundation, and current official shadcn/Radix Dropdown Menu anatomy and API.

Pipeline exception: Icon is a legacy design-only text-glyph control with existing overrides. Do not map it to a production code prop. Migration to an Icon INSTANCE_SWAP requires an approved glyph-to-icon map and consumer update test.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `tone` | `default` | Standard treatment with no semantic weight. |
| `tone` | `destructive` | An error that blocks progress. |
| `inset` | `false` | _needs review_ |
| `inset` | `true` | _needs review_ |

**State → tokens**

| State | Tokens |
|---|---|
| Tone=Default, State=Default, Inset=False | fill popover · radius radius/4 · text popover-foreground · type size/13 |
| Tone=Default, State=Highlighted, Inset=False | fill accent · text accent-foreground |
| Tone=Default, State=Highlighted, Inset=True | fill accent · text accent-foreground |
| Tone=Destructive, State=Default, Inset=False | text destructive |
| Tone=Destructive, State=Default, Inset=True | text destructive |
| Tone=Destructive, State=Highlighted, Inset=False | fill accent · text destructive |
| Tone=Destructive, State=Highlighted, Inset=True | fill accent · text destructive |
| Tone=Destructive, State=Disabled, Inset=False | text destructive |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Pass icons as @phosphor-icons/react components through the slot, never as text glyphs.

**Do not**
- Do not emit State as an enum prop. It packs states that co-occur at runtime.

**Accessibility**
- State decomposition applies — see docs/state-decomposition.md. State [Default · Highlighted · Disabled] → :highlighted CSS-owned, dropped; disabled independent boolean

**Tokens used** — `accent` · `accent-foreground` · `destructive` · `popover` · `popover-foreground` · `radius/4` · `size/13`

<sub>status `draft` · updated 2026-08-09 · fingerprint `4c705648eecfd6a7` · provenance description:imported · variants:imported+framework · states:imported · dos:imported · donts:imported · accessibility:imported · tokensUsed:imported</sub>

---

## Dropdown Menu / Label

**Non-focusable group label with standard or inset alignment.**

Non-focusable group label with standard or inset alignment. Source parity baseline: Watermelon Dropdown Menu route, Watermelon shadcn foundation, and current official shadcn/Radix Dropdown Menu anatomy and API.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `inset` | `false` | _needs review_ |
| `inset` | `true` | _needs review_ |

**State → tokens**

| State | Tokens |
|---|---|
| Inset=False | fill popover · text popover-foreground · type size/12 |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Tokens used** — `popover` · `popover-foreground` · `size/12`

<sub>status `draft` · updated 2026-08-09 · fingerprint `7f96fbc7beb86287` · provenance description:imported · variants:imported · states:imported · dos:imported · tokensUsed:imported</sub>

---

## Dropdown Menu / Radio Group

**Structural single-selection wrapper for Radio Item instances.**

Structural single-selection wrapper for Radio Item instances. Source parity baseline: Watermelon Dropdown Menu route, Watermelon shadcn foundation, and current official shadcn/Radix Dropdown Menu anatomy and API.

<sub>status `draft` · updated 2026-08-09 · fingerprint `76d83f0bdbe6071b` · provenance description:imported</sub>

---

## Dropdown Menu / Radio Item

**Exclusive-choice menu item used inside a Radio Group.**

Exclusive-choice menu item used inside a Radio Group. Supports checked/unchecked plus default, highlighted, and disabled states. Source parity baseline: Watermelon Dropdown Menu route, Watermelon shadcn foundation, and current official shadcn/Radix Dropdown Menu anatomy and API.

Pipeline exception: Icon is a legacy design-only text-glyph control with existing overrides. Do not map it to a production code prop. Migration to an Icon INSTANCE_SWAP requires an approved glyph-to-icon map and consumer update test.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `value` | `unchecked` | Not selected. |
| `value` | `checked` | Selected. |

**State → tokens**

| State | Tokens |
|---|---|
| Value=Unchecked, State=Default | fill popover · radius radius/4 · text popover-foreground · type size/13 |
| Value=Unchecked, State=Highlighted | fill accent · text accent-foreground |
| Value=Checked, State=Highlighted | fill accent · text accent-foreground |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Pass icons as @phosphor-icons/react components through the slot, never as text glyphs.

**Do not**
- Do not emit State as an enum prop. It packs states that co-occur at runtime.

**Accessibility**
- State decomposition applies — see docs/state-decomposition.md. State [Default · Highlighted · Disabled] → :highlighted CSS-owned, dropped; disabled independent boolean

**Tokens used** — `accent` · `accent-foreground` · `popover` · `popover-foreground` · `radius/4` · `size/13`

<sub>status `draft` · updated 2026-08-09 · fingerprint `a18512acb77a7b43` · provenance description:imported · variants:imported+framework · states:imported · dos:imported · donts:imported · accessibility:imported · tokensUsed:imported</sub>

---

## Dropdown Menu / Root Composition

**Complete source-parity compositions.**

Complete source-parity compositions. Patterns: Basic, Submenu, Shortcuts, Icons, Checkboxes, Checkbox Icons, Radio Group, Radio Icons, Destructive, Avatar, Complex, and RTL. Each pattern has Closed and Open states. Placement is controlled by Dropdown Menu / Content. Source parity baseline: Watermelon Dropdown Menu route, Watermelon shadcn foundation, and current official shadcn/Radix Dropdown Menu anatomy and API.

Pipeline property contract: only the component properties defined on this set are configurable public inputs. Other embedded copy is illustrative composition content and must not be generated as a public code prop until engineering API review.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `state` | `closed` | _needs review_ |
| `state` | `open` | _needs review_ |

**State → tokens**

| State | Tokens |
|---|---|
| Pattern=Basic, State=Closed | text foreground · type size/13 |
| Pattern=Basic, State=Open | text accent-foreground |
| Pattern=Submenu, State=Open | text accent-foreground |
| Pattern=Shortcuts, State=Open | text accent-foreground |
| Pattern=Icons, State=Open | text accent-foreground |
| Pattern=Checkboxes, State=Open | text accent-foreground |
| Pattern=Checkbox Icons, State=Open | text accent-foreground |
| Pattern=Radio Group, State=Open | text accent-foreground |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Do not**
- Do not turn Pattern into a code prop.

**Tokens used** — `accent-foreground` · `foreground` · `size/13`

<sub>status `draft` · updated 2026-08-09 · fingerprint `d6a866d412cbefb8` · provenance description:imported · variants:imported · states:imported · dos:imported · donts:imported · tokensUsed:imported</sub>

---

## Dropdown Menu / Separator

**Visual separator between groups of menu items.**

Visual separator between groups of menu items. Source parity baseline: Watermelon Dropdown Menu route, Watermelon shadcn foundation, and current official shadcn/Radix Dropdown Menu anatomy and API.

<sub>status `draft` · updated 2026-08-09 · fingerprint `5f0128077732ec5f` · provenance description:imported</sub>

---

## Dropdown Menu / Shortcut

**Right-aligned keyboard shortcut hint for menu commands.**

Right-aligned keyboard shortcut hint for menu commands. Source parity baseline: Watermelon Dropdown Menu route, Watermelon shadcn foundation, and current official shadcn/Radix Dropdown Menu anatomy and API.

<sub>status `draft` · updated 2026-08-09 · fingerprint `53639eda45a2b486` · provenance description:imported</sub>

---

## Dropdown Menu / Sub Content

**Nested submenu content with Side=Left/Right and Align=Start/Center/End.**

Nested submenu content with Side=Left/Right and Align=Start/Center/End. The anchor marker indicates the edge and alignment relative to the Sub Trigger. Source parity baseline: Watermelon Dropdown Menu route, Watermelon shadcn foundation, and current official shadcn/Radix Dropdown Menu anatomy and API.

Layout exception: Anchor marker is an absolute-positioned documentation/placement reference for submenu alignment. It is not a runtime content layer and is excluded from structural auto-layout linting.

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
| Side=Left, Align=Start | fill popover · border 1px border · radius radius/lg · text popover-foreground · type size/13 |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Tokens used** — `border` · `popover` · `popover-foreground` · `radius/lg` · `size/13`

<sub>status `draft` · updated 2026-08-09 · fingerprint `1a0c2ae558ce1564` · provenance description:imported · variants:imported+framework · states:imported · dos:imported · tokensUsed:imported</sub>

---

## Dropdown Menu / Sub Trigger

**Submenu trigger with closed, open, highlighted, and disabled states plus optional inset alignment.**

Submenu trigger with closed, open, highlighted, and disabled states plus optional inset alignment. Source parity baseline: Watermelon Dropdown Menu route, Watermelon shadcn foundation, and current official shadcn/Radix Dropdown Menu anatomy and API.

Pipeline exception: Icon is a legacy design-only text-glyph control with existing overrides. Do not map it to a production code prop. Migration to an Icon INSTANCE_SWAP requires an approved glyph-to-icon map and consumer update test.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `inset` | `false` | _needs review_ |
| `inset` | `true` | _needs review_ |

**State → tokens**

| State | Tokens |
|---|---|
| State=Closed, Inset=False | fill popover · radius radius/4 · text popover-foreground · type size/13 |
| State=Open, Inset=False | fill accent · text accent-foreground |
| State=Open, Inset=True | fill accent · text accent-foreground |
| State=Highlighted, Inset=False | fill accent · text accent-foreground |
| State=Highlighted, Inset=True | fill accent · text accent-foreground |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Pass icons as @phosphor-icons/react components through the slot, never as text glyphs.

**Do not**
- Do not emit State as an enum prop. It packs states that co-occur at runtime.

**Accessibility**
- State decomposition applies — see docs/state-decomposition.md. State [Closed · Open · Highlighted · Disabled] → :highlighted CSS-owned, dropped; disabled independent boolean; closed/open controlled state

**Tokens used** — `accent` · `accent-foreground` · `popover` · `popover-foreground` · `radius/4` · `size/13`

<sub>status `draft` · updated 2026-08-09 · fingerprint `3000d7e5a566a847` · provenance description:imported · variants:imported · states:imported · dos:imported · donts:imported · accessibility:imported · tokensUsed:imported</sub>

---

## Dropdown Menu / Trigger

**Visual trigger patterns for the Dropdown Menu root.**

Visual trigger patterns for the Dropdown Menu root. Covers button and avatar triggers plus closed, open, focused, and disabled states where applicable. Source parity baseline: Watermelon Dropdown Menu route, Watermelon shadcn foundation, and current official shadcn/Radix Dropdown Menu anatomy and API.

Pipeline property contract: only the component properties defined on this set are configurable public inputs. Other embedded copy is illustrative composition content and must not be generated as a public code prop until engineering API review.

Accessibility contract: avatar-only menu triggers require a programmatic accessible name that communicates the menu action. Decorative trigger icons/avatars must not become the accessible name by themselves.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `type` | `button` | _needs review_ |
| `type` | `avatar` | _needs review_ |

**State → tokens**

| State | Tokens |
|---|---|
| Type=Button, State=Closed | fill card · border 1px border · radius radius/lg · text foreground · type size/13 |
| Type=Button, State=Open | fill accent · text accent-foreground |
| Type=Button, State=Focused | border 2px ring |
| Type=Button, State=Disabled | text muted-foreground |
| Type=Avatar, State=Closed | text accent-foreground · type size/12 |
| Type=Avatar, State=Open | fill accent · text accent-foreground · type size/12 |
| Type=Avatar, State=Focused | border 2px ring · text accent-foreground · type size/12 |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Do not**
- Do not emit State as an enum prop. It packs states that co-occur at runtime.
- Do not remove the ring border on focus. It is the only focus affordance.

**Accessibility**
- avatar-only menu triggers require a programmatic accessible name that communicates the menu action. Decorative trigger icons/avatars must not become the accessible name by themselves.
- State decomposition applies — see docs/state-decomposition.md. State [Closed · Open · Focused · Disabled] → :focus-visible CSS-owned, dropped; disabled independent boolean; closed/open controlled state

**Tokens used** — `accent` · `accent-foreground` · `border` · `card` · `foreground` · `muted-foreground` · `radius/lg` · `ring` · `size/12` · `size/13`

<sub>status `draft` · updated 2026-08-09 · fingerprint `9e163642a5e6b483` · provenance description:imported · variants:imported · states:imported · dos:imported · donts:imported · accessibility:imported · tokensUsed:imported</sub>

---

## Field

**Composed form field with label, control value, and helper or error message.**

Composed form field with label, control value, and helper or error message. State documents focus, validation, and disabled behavior. Sizing policy: fixed/default width with Hug Contents height.

Accessibility contract: Error must not rely on color alone. The composed field must display a specific visible error message and runtime must expose invalid state plus the message relationship to assistive technology.

**When to use**
- Collect a single line of free-form text.

**When not to use**
- Choosing from a fixed set — use Select or Radio Group.
- Long multi-line text — use Textarea.

**State → tokens**

| State | Tokens |
|---|---|
| State=Default | text foreground · type size/14 |
| State=Disabled | text muted-foreground |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Always pair with a visible label.
- Show format hints as helper text.
- Reserve space for error text so validation does not shift the layout.

**Do not**
- Do not emit State as an enum prop. It packs states that co-occur at runtime.
- Do not use placeholder text as the only label.
- Do not validate on every keystroke before the first blur.

**Accessibility**
- Keyboard: Standard text-editing keys.
- Error must not rely on color alone. The composed field must display a specific visible error message and runtime must expose invalid state plus the message relationship to assistive technology.
- State decomposition applies — see docs/state-decomposition.md. State [Default · Focused · Error · Disabled] → :focus-visible CSS-owned, dropped; invalid + disabled independent booleans
- Every input has a programmatically associated label.
- The error state sets aria-invalid and links its message via aria-describedby.

**Tokens used** — `foreground` · `muted-foreground` · `size/14`

<sub>status `draft` · updated 2026-08-09 · fingerprint `0f9ab36380da3e06` · provenance description:imported · states:imported · dos:imported+best-practice · donts:imported+best-practice · accessibility:imported+w3c-apg · tokensUsed:imported · whenToUse:best-practice · whenNotToUse:best-practice</sub>

---

## Hover Card

**Contextual preview surface revealed on pointer hover or keyboard focus.**

Contextual preview surface revealed on pointer hover or keyboard focus. Use compact density for brief descriptions and detailed density when supporting metadata is needed. Sizing policy: fixed/default width with Hug Contents height.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `density` | `compact` | Tighter spacing for information-dense screens. |
| `density` | `detailed` | _needs review_ |

**State → tokens**

| State | Tokens |
|---|---|
| Density=Compact | fill popover · border 1px border · radius radius/lg · text popover-foreground · type size/14 |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Tokens used** — `border` · `popover` · `popover-foreground` · `radius/lg` · `size/14`

<sub>status `draft` · updated 2026-08-09 · fingerprint `506fb4f07842e5e4` · provenance description:imported · variants:imported+framework · states:imported · dos:imported · tokensUsed:imported</sub>

---

## Icon

**Jake UI production icons — Phosphor Icons (regular weight, @phosphor-icons/react v2).**

Jake UI production icons — Phosphor Icons (regular weight, @phosphor-icons/react v2). Variant axes: Name and Size (16/20/24). Fill binds to the foreground variable; in code the icon inherits currentColor. Name values match Phosphor React component names exactly, except SidebarSimpleRight which renders as <SidebarSimple mirrored />. Swap Name rather than copying vectors.

<sub>status `draft` · updated 2026-08-09 · fingerprint `2cd75e24451d6944` · provenance description:imported</sub>

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
| State=Default | fill card · border 1px input · radius radius/lg · text foreground · type size/14 |
| State=Focused | border 2px ring |
| State=Error | border 1px destructive |
| State=Disabled | fill muted · text muted-foreground |

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

**Tokens used** — `card` · `destructive` · `foreground` · `input` · `muted` · `muted-foreground` · `radius/lg` · `ring` · `size/14`

<sub>status `draft` · updated 2026-08-09 · fingerprint `c04354397c92cbfb` · provenance description:imported · states:imported · dos:imported+best-practice · donts:imported+best-practice · accessibility:imported+w3c-apg · tokensUsed:imported · whenToUse:best-practice · whenNotToUse:best-practice</sub>

---

## Label

**Form control label primitive.**

Form control label primitive. Required variants expose a semantic required mark; optional variants append a secondary marker.

Pipeline API classification: apply the Governance property-classification rule before code mapping. Visual State axes are QA/story states unless engineering explicitly approves a controlled runtime prop; Viewport is responsive test data; Pattern is composition/story data.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `type` | `required` | _needs review_ |
| `type` | `optional` | _needs review_ |
| `state` | `default` | Resting state. |
| `state` | `disabled` | _needs review_ |

**State → tokens**

| State | Tokens |
|---|---|
| Type=Required, State=Default | text foreground · type size/14 |
| Type=Required, State=Disabled | text muted-foreground |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Tokens used** — `foreground` · `muted-foreground` · `size/14`

<sub>status `draft` · updated 2026-08-09 · fingerprint `b29a26aa771ce8c7` · provenance description:imported · variants:imported+framework · states:imported · dos:imported · tokensUsed:imported</sub>

---

## Native Select

**Native select control styled with Jake UI semantics.**

Native select control styled with Jake UI semantics. State=Open represents keyboard or pointer interaction before the platform option menu is shown. State=Focused represents a closed select with focus-visible using the semantic ring token at 2px; State=Open represents the expanded interaction state.

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
| State=Default | fill card · border 1px input · radius radius/lg · text foreground · type size/14 |
| State=Open | border 2px ring |
| State=Error | border 1px destructive |
| State=Disabled | fill muted · text muted-foreground |
| State=Focused | border 2px ring |

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
- State decomposition applies — see docs/state-decomposition.md. State [Default · Open · Error · Disabled · Focused] → :focus-visible CSS-owned, dropped; invalid + disabled independent booleans; open controlled state
- Every input has a programmatically associated label.
- The error state sets aria-invalid and links its message via aria-describedby.

**Tokens used** — `card` · `destructive` · `foreground` · `input` · `muted` · `muted-foreground` · `radius/lg` · `ring` · `size/14`

<sub>status `draft` · updated 2026-08-09 · fingerprint `ed3b8ce018f6b225` · provenance description:imported · states:imported · dos:imported+best-practice · donts:imported+best-practice · accessibility:imported+w3c-apg · tokensUsed:imported · whenToUse:best-practice · whenNotToUse:best-practice</sub>

---

## Navigation Menu

**Primary product navigation with desktop and compact structures.**

Primary product navigation with desktop and compact structures. Open=True reveals the navigation panel; compact mode replaces the link row with a menu trigger. Sizing policy: open states use fixed width plus Hug height; closed states intentionally preserve the standard 56px navigation-bar height.

Pipeline property contract: only the component properties defined on this set are configurable public inputs. Other embedded copy is illustrative composition content and must not be generated as a public code prop until engineering API review.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `open` | `false` | _needs review_ |
| `open` | `true` | _needs review_ |

**State → tokens**

| State | Tokens |
|---|---|
| Viewport=Desktop, Open=False | fill card · border 1px border · radius radius/lg · text primary-foreground · type size/13 |
| Viewport=Compact, Open=False | text foreground |
| Viewport=Compact, Open=True | text accent-foreground |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Do not**
- Do not turn Viewport into a code prop.

**Tokens used** — `accent-foreground` · `border` · `card` · `foreground` · `primary-foreground` · `radius/lg` · `size/13`

<sub>status `draft` · updated 2026-08-09 · fingerprint `825f5301138cd976` · provenance description:imported · variants:imported · states:imported · dos:imported · donts:imported · tokensUsed:imported</sub>

---

## Pagination

**Navigate paged datasets or long collections.**

Navigate paged datasets or long collections. Desktop exposes page numbers; Compact uses a concise page summary. Sizing policy: Hug Contents width with fixed standard control height.

Pipeline property contract: only the component properties defined on this set are configurable public inputs. Other embedded copy is illustrative composition content and must not be generated as a public code prop until engineering API review.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `state` | `default` | Resting state. |
| `state` | `disabled` | _needs review_ |

**State → tokens**

| State | Tokens |
|---|---|
| Viewport=Desktop, State=Default | fill card · text foreground · type size/13 |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Do not**
- Do not turn Viewport into a code prop.

**Tokens used** — `card` · `foreground` · `size/13`

<sub>status `draft` · updated 2026-08-09 · fingerprint `c5a1c6598c066684` · provenance description:imported · variants:imported+framework · states:imported · dos:imported · donts:imported · tokensUsed:imported</sub>

---

## Popover

**Jake UI Popover content extension with Small/Large size and optional arrow.**

Jake UI Popover content extension with Small/Large size and optional arrow. Exact source anatomy, placement, behaviors, and examples are implemented by the Popover / * parity assets.

Pipeline property contract: only the component properties defined on this set are configurable public inputs. Other embedded copy is illustrative composition content and must not be generated as a public code prop until engineering API review.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `size` | `small` | Dense contexts — tables, toolbars, compact rows. |
| `size` | `large` | Prominent or touch-first contexts. |
| `arrow` | `false` | _needs review_ |
| `arrow` | `true` | _needs review_ |

**State → tokens**

| State | Tokens |
|---|---|
| Size=Small, Arrow=False | fill popover · border 1px border · radius radius/lg · text popover-foreground · type size/15 |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Tokens used** — `border` · `popover` · `popover-foreground` · `radius/lg` · `size/15`

<sub>status `draft` · updated 2026-08-09 · fingerprint `a151efad94f64ed1` · provenance description:imported · variants:imported+framework · states:imported · dos:imported · tokensUsed:imported</sub>

---

## Popover / Arrow

**Pointing Arrow for all four popup sides.**

Pointing Arrow for all four popup sides. The arrow inherits Popover surface and border variables and aligns through the Content placement matrix.

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
| Side=Top | no root-level bindings |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

<sub>status `draft` · updated 2026-08-09 · fingerprint `860e05913ae3b071` · provenance description:imported · variants:imported+framework · states:imported · dos:imported</sub>

---

## Popover / Backdrop

**Backdrop states for modal and trap-focus Popover modes.**

Backdrop states for modal and trap-focus Popover modes. Non-modal mode intentionally has no backdrop. Starting and ending animation states are documented rather than multiplied as static variants.

Pipeline API classification: apply the Governance property-classification rule before code mapping. Visual State axes are QA/story states unless engineering explicitly approves a controlled runtime prop; Viewport is responsive test data; Pattern is composition/story data.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `mode` | `modal` | _needs review_ |
| `mode` | `trapFocus` | _needs review_ |
| `state` | `closed` | _needs review_ |
| `state` | `open` | _needs review_ |

**State → tokens**

| State | Tokens |
|---|---|
| Mode=Modal, State=Closed | fill foreground |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Tokens used** — `foreground`

<sub>status `draft` · updated 2026-08-09 · fingerprint `5fd2238afd637f42` · provenance description:imported · variants:imported · states:imported · dos:imported · tokensUsed:imported</sub>

---

## Popover / Close

**Explicit close control for Popover content.**

Explicit close control for Popover content. States cover default, hover, focus-visible, and disabled. Runtime requires an accessible name.

Accessibility contract: icon-only close control requires a programmatic accessible name such as “Close” and a visible focus indicator; the icon itself is decorative to assistive technology.

**State → tokens**

| State | Tokens |
|---|---|
| State=Default | fill popover · radius radius/7 |
| State=Hover | fill accent |
| State=Focused | fill accent · border 2px ring |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Do not**
- Do not emit State as an enum prop. It packs states that co-occur at runtime.
- Do not remove the ring border on focus. It is the only focus affordance.

**Accessibility**
- icon-only close control requires a programmatic accessible name such as “Close” and a visible focus indicator; the icon itself is decorative to assistive technology.
- State decomposition applies — see docs/state-decomposition.md. State [Default · Hover · Focused · Disabled] → :hover + :focus-visible CSS-owned, dropped; disabled independent boolean

**Tokens used** — `accent` · `popover` · `radius/7` · `ring`

<sub>status `draft` · updated 2026-08-09 · fingerprint `426521796f6bd687` · provenance description:imported · states:imported · dos:imported · donts:imported · accessibility:imported · tokensUsed:imported</sub>

---

## Popover / Content

**Complete Popover Content matrix: Size × Side × Align × Arrow.**

Complete Popover Content matrix: Size × Side × Align × Arrow. Uses nested Header, Close, and Arrow assets. Positioner, collision, offset, focus, outside-interaction, and portal behavior are documented in the specification.

Variant-matrix exception: the 48-variant Arrow axis is retained for current consumer compatibility. Refactoring Arrow to a boolean property is a breaking migration and requires consumer-file validation.

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
| `arrow` | `false` | _needs review_ |
| `arrow` | `true` | _needs review_ |

**State → tokens**

| State | Tokens |
|---|---|
| Size=Small, Side=Top, Align=Start, Arrow=False | text popover-foreground · type size/14 |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Pass icons as @phosphor-icons/react components through the slot, never as text glyphs.

**Do not**
- Variant count (48) exceeds the 30-combination governance ceiling. Needs a documented exception.

**Tokens used** — `popover-foreground` · `size/14`

<sub>status `draft` · updated 2026-08-09 · fingerprint `fef340aa8a4673c1` · provenance description:imported · variants:imported+framework · states:imported · dos:imported · donts:imported · tokensUsed:imported</sub>

---

## Popover / Form Content

**Source form-content composition using Header, Close, Arrow, and two linked Field instances.**

Source form-content composition using Header, Close, Arrow, and two linked Field instances. Represents the “With Form” example.

<sub>status `draft` · updated 2026-08-09 · fingerprint `098e70d278a10050` · provenance description:imported</sub>

---

## Popover / Header

**Popover heading group containing Title and Description.**

Popover heading group containing Title and Description. Both text nodes are editable component properties and should be associated with the popup for accessible naming and description.

<sub>status `draft` · updated 2026-08-09 · fingerprint `57369100f883ec80` · provenance description:imported</sub>

---

## Popover / Root Composition

**Source usage patterns with open and closed states: Basic, Align, With Form, and RTL.**

Source usage patterns with open and closed states: Basic, Align, With Form, and RTL. Content placement details are delegated to the complete Popover / Content matrix.

Pipeline API classification: apply the Governance property-classification rule before code mapping. Visual State axes are QA/story states unless engineering explicitly approves a controlled runtime prop; Viewport is responsive test data; Pattern is composition/story data.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `state` | `closed` | _needs review_ |
| `state` | `open` | _needs review_ |

**State → tokens**

| State | Tokens |
|---|---|
| Pattern=Basic, State=Closed | text foreground · type size/13 |
| Pattern=Basic, State=Open | text accent-foreground |
| Pattern=Align, State=Open | text accent-foreground |
| Pattern=Form, State=Open | text accent-foreground |
| Pattern=RTL, State=Closed | type size/12 |
| Pattern=RTL, State=Open | type size/12 |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Do not**
- Do not turn Pattern into a code prop.

**Tokens used** — `accent-foreground` · `foreground` · `size/12` · `size/13`

<sub>status `draft` · updated 2026-08-09 · fingerprint `d4da77934d9e2527` · provenance description:imported · variants:imported · states:imported · dos:imported · donts:imported · tokensUsed:imported</sub>

---

## Popover / RTL Content

**RTL Popover content with Arabic Title and Description, linked Close and Arrow controls, right-aligned typography, and Bottom/Start placement.**

<sub>status `draft` · updated 2026-08-09 · fingerprint `2964a3754defb082` · provenance description:imported</sub>

---

## Popover / Trigger

**Popover trigger visual states for standard Button and RTL presentation.**

Popover trigger visual states for standard Button and RTL presentation. Covers closed, open, hover, focus-visible, and disabled states; hover/detached/multiple-trigger behavior is documented at the Root API level.

Pipeline property contract: only the component properties defined on this set are configurable public inputs. Other embedded copy is illustrative composition content and must not be generated as a public code prop until engineering API review.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `type` | `button` | _needs review_ |
| `type` | `rTL` | _needs review_ |

**State → tokens**

| State | Tokens |
|---|---|
| Type=Button, State=Closed | text foreground · type size/13 |
| Type=Button, State=Open | text accent-foreground |
| Type=Button, State=Hover | text accent-foreground |
| Type=Button, State=Focused | border 2px ring · radius radius/lg |
| Type=Button, State=Disabled | text muted-foreground |
| Type=RTL, State=Closed | type size/12 |
| Type=RTL, State=Open | type size/12 |
| Type=RTL, State=Hover | type size/12 |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Do not**
- Do not emit State as an enum prop. It packs states that co-occur at runtime.
- Do not remove the ring border on focus. It is the only focus affordance.

**Accessibility**
- State decomposition applies — see docs/state-decomposition.md. State [Closed · Open · Hover · Focused · Disabled] → :hover + :focus-visible CSS-owned, dropped; disabled independent boolean; closed/open controlled state

**Tokens used** — `accent-foreground` · `foreground` · `muted-foreground` · `radius/lg` · `ring` · `size/12` · `size/13`

<sub>status `draft` · updated 2026-08-09 · fingerprint `5d2e08da34bf0718` · provenance description:imported · variants:imported · states:imported · dos:imported · donts:imported · accessibility:imported · tokensUsed:imported</sub>

---

## Popover / Viewport

**Transition Viewport documenting current and previous content for four activation directions.**

Transition Viewport documenting current and previous content for four activation directions. This asset represents data-activation-direction and data-previous states without prescribing runtime animation duration.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `state` | `current` | _needs review_ |
| `state` | `previous` | _needs review_ |
| `direction` | `top` | _needs review_ |
| `direction` | `right` | _needs review_ |
| `direction` | `bottom` | _needs review_ |
| `direction` | `left` | _needs review_ |

**State → tokens**

| State | Tokens |
|---|---|
| State=Current, Direction=Top | fill popover · border 1px border · radius radius/lg · text popover-foreground · type size/11 |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Tokens used** — `border` · `popover` · `popover-foreground` · `radius/lg` · `size/11`

<sub>status `draft` · updated 2026-08-09 · fingerprint `dcb106ae899a1e5b` · provenance description:imported · variants:imported · states:imported · dos:imported · tokensUsed:imported</sub>

---

## Progress

**Linear progress primitive.**

Linear progress primitive. Determinate indicates known completion; indeterminate communicates ongoing work without a measurable endpoint.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `type` | `determinate` | _needs review_ |
| `type` | `indeterminate` | _needs review_ |

**State → tokens**

| State | Tokens |
|---|---|
| Type=Determinate | fill muted · radius radius/lg |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Tokens used** — `muted` · `radius/lg`

<sub>status `draft` · updated 2026-08-09 · fingerprint `cab249f5c37e56f6` · provenance description:imported · variants:imported · states:imported · dos:imported · tokensUsed:imported</sub>

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
| `value` | `unselected` | _needs review_ |
| `value` | `selected` | _needs review_ |

**State → tokens**

| State | Tokens |
|---|---|
| Value=Unselected, State=Default | text foreground · type size/14 |
| Value=Unselected, State=Disabled | text muted-foreground |
| Value=Selected, State=Disabled | text muted-foreground |

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

**Tokens used** — `foreground` · `muted-foreground` · `size/14`

<sub>status `draft` · updated 2026-08-09 · fingerprint `567b9fdbe3063c91` · provenance description:imported · variants:imported · states:imported · dos:imported+best-practice · donts:imported+best-practice · accessibility:imported+w3c-apg · tokensUsed:imported · whenToUse:best-practice · whenNotToUse:best-practice</sub>

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
| Pattern=Basic | text foreground · type size/13 |
| Pattern=Disabled | text muted-foreground |

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

**Tokens used** — `foreground` · `muted-foreground` · `size/13`

<sub>status `draft` · updated 2026-08-09 · fingerprint `c37f618eacb512ea` · provenance description:imported · states:imported · dos:imported+best-practice · donts:imported+best-practice · tokensUsed:imported · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:w3c-apg</sub>

---

## Radio Group / Indicator

**Checked-state indicator nested inside Radio Group / Item.**

Checked-state indicator nested inside Radio Group / Item. Runtime may force-mount the indicator for animation or measurement.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `state` | `default` | Resting state. |
| `state` | `disabled` | _needs review_ |

**State → tokens**

| State | Tokens |
|---|---|
| State=Default | fill primary · radius radius/full |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Tokens used** — `primary` · `radius/full`

<sub>status `draft` · updated 2026-08-09 · fingerprint `d56f2d23552b3fcf` · provenance description:imported · variants:imported+framework · states:imported · dos:imported · tokensUsed:imported</sub>

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
| Value=Unchecked, State=Default | fill card · border 1px input · radius radius/full |
| Value=Unchecked, State=Hover | fill accent |
| Value=Unchecked, State=Focused | border 2px ring |
| Value=Unchecked, State=Invalid | border 2px destructive |
| Value=Checked, State=Default | border 1px primary |
| Value=Checked, State=Hover | fill accent · border 1px primary |
| Value=Checked, State=Focused | border 2px ring |
| Value=Checked, State=Disabled | border 1px primary |

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

**Tokens used** — `accent` · `card` · `destructive` · `input` · `primary` · `radius/full` · `ring`

<sub>status `draft` · updated 2026-08-09 · fingerprint `9bc517eabe244a9b` · provenance description:imported · variants:imported+framework · states:imported · dos:imported+best-practice · donts:imported+best-practice · accessibility:imported+w3c-apg · tokensUsed:imported · whenToUse:best-practice · whenNotToUse:best-practice</sub>

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
| `selection` | `first` | _needs review_ |
| `selection` | `second` | _needs review_ |
| `selection` | `none` | _needs review_ |

**State → tokens**

| State | Tokens |
|---|---|
| Orientation=Vertical, Selection=First, State=Default | text foreground · type size/13 |
| Orientation=Vertical, Selection=First, State=Disabled | text muted-foreground |
| Orientation=Vertical, Selection=Second, State=Disabled | text muted-foreground |
| Orientation=Vertical, Selection=None, State=Disabled | text muted-foreground |
| Orientation=Horizontal, Selection=First, State=Disabled | text muted-foreground |
| Orientation=Horizontal, Selection=Second, State=Disabled | text muted-foreground |
| Orientation=Horizontal, Selection=None, State=Disabled | text muted-foreground |

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

**Tokens used** — `foreground` · `muted-foreground` · `size/13`

<sub>status `draft` · updated 2026-08-09 · fingerprint `8f2b507cbc129484` · provenance description:imported · variants:imported+framework · states:imported · dos:imported+best-practice · donts:imported+best-practice · accessibility:imported+w3c-apg · tokensUsed:imported · whenToUse:best-practice · whenNotToUse:best-practice</sub>

---

## Scroll Area

**Scrollable viewport primitive with visible track and thumb anatomy.**

Scrollable viewport primitive with visible track and thumb anatomy. Choose axis according to overflow direction.

Pipeline property contract: only the component properties defined on this set are configurable public inputs. Other embedded copy is illustrative composition content and must not be generated as a public code prop until engineering API review.

Layout exception: Scroll Area uses coordinate-based viewport, track, and thumb geometry rather than root auto layout. Runtime overflow determines scroll position; the Figma axis variants document anatomy and default dimensions.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `axis` | `vertical` | _needs review_ |
| `axis` | `horizontal` | _needs review_ |

**State → tokens**

| State | Tokens |
|---|---|
| Axis=Vertical | fill card · border 1px border · radius radius/lg · text foreground · type size/14 |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Tokens used** — `border` · `card` · `foreground` · `radius/lg` · `size/14`

<sub>status `draft` · updated 2026-08-09 · fingerprint `1b51b3cf949ad08b` · provenance description:imported · variants:imported · states:imported · dos:imported · tokensUsed:imported</sub>

---

## Segmented Tab

**Compact Watermelon option tab.**

Compact Watermelon option tab. Place instances inside a secondary-colored segmented-control container. Sizing policy: Hug Contents width with fixed standard control height.

Interaction contract: Selected is the persistent tab selection state. Hover and focus-visible are transient runtime states; focus remains visually distinguishable using the shared ring treatment.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `selected` | `false` | _needs review_ |
| `selected` | `true` | _needs review_ |

**State → tokens**

| State | Tokens |
|---|---|
| Selected=False | radius radius/lg · text muted-foreground · type size/12 |
| Selected=True | fill card · text foreground |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Tokens used** — `card` · `foreground` · `muted-foreground` · `radius/lg` · `size/12`

<sub>status `draft` · updated 2026-08-09 · fingerprint `0df17400dc598663` · provenance description:imported · variants:imported · states:imported · dos:imported · tokensUsed:imported</sub>

---

## Separator

**Visual separator for grouping adjacent content.**

Visual separator for grouping adjacent content. Horizontal is the default for stacked regions; vertical is used between inline groups.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `orientation` | `horizontal` | Lays out along the inline axis. |
| `orientation` | `vertical` | Lays out along the block axis. |

**State → tokens**

| State | Tokens |
|---|---|
| Orientation=Horizontal | fill border |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Tokens used** — `border`

<sub>status `draft` · updated 2026-08-09 · fingerprint `53f7b8f62699fcc0` · provenance description:imported · variants:imported+framework · states:imported · dos:imported · tokensUsed:imported</sub>

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
| Side=Left, Width=Compact | fill card · border 1px border · radius radius/lg · text foreground · type size/18 |

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

**Tokens used** — `border` · `card` · `foreground` · `radius/lg` · `size/18`

<sub>status `draft` · updated 2026-08-09 · fingerprint `91bcc9a95fed6e57` · provenance description:imported · variants:imported+framework · states:imported · dos:imported+best-practice · tokensUsed:imported · whenToUse:best-practice · whenNotToUse:best-practice · donts:best-practice · accessibility:w3c-apg</sub>

---

## Sidebar

**Application sidebar with desktop and compact structures.**

Application sidebar with desktop and compact structures. Expanded variants use nested Sidebar Navigation Item instances; collapsed variants reduce navigation to an icon rail or compact menu trigger.

Pipeline property contract: only the component properties defined on this set are configurable public inputs. Other embedded copy is illustrative composition content and must not be generated as a public code prop until engineering API review.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `state` | `expanded` | _needs review_ |
| `state` | `collapsed` | _needs review_ |

**State → tokens**

| State | Tokens |
|---|---|
| Viewport=Desktop, State=Expanded | fill sidebar · border 1px sidebar-border · radius radius/lg · text sidebar-foreground · type size/15 |
| Viewport=Desktop, State=Collapsed | text sidebar-accent-foreground · type size/13 |
| Viewport=Compact, State=Collapsed | type size/13 |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Do not**
- Do not turn Viewport into a code prop.

**Tokens used** — `radius/lg` · `sidebar` · `sidebar-accent-foreground` · `sidebar-border` · `sidebar-foreground` · `size/13` · `size/15`

<sub>status `draft` · updated 2026-08-09 · fingerprint `05c7760825c38979` · provenance description:imported · variants:imported · states:imported · dos:imported · donts:imported · tokensUsed:imported</sub>

---

## Sidebar Navigation Item

**Watermelon docs sidebar route item.**

Watermelon docs sidebar route item. Use State=Active for the current route. Sizing exception: fixed width and fixed height are intentional so each item aligns to the sidebar column and preserves a 36px target.

Interaction contract: State=Active is the persistent current-route state. Hover and focus-visible are transient runtime link states rather than additional persistent variants; runtime focus must use the shared ring treatment.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `state` | `default` | Resting state. |
| `state` | `active` | _needs review_ |

**State → tokens**

| State | Tokens |
|---|---|
| State=Default | radius radius/lg · text sidebar-foreground · type size/14 |
| State=Active | fill sidebar-accent · text sidebar-accent-foreground |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Tokens used** — `radius/lg` · `sidebar-accent` · `sidebar-accent-foreground` · `sidebar-foreground` · `size/14`

<sub>status `draft` · updated 2026-08-09 · fingerprint `885c4ef7f08f23af` · provenance description:imported · variants:imported+framework · states:imported · dos:imported · tokensUsed:imported</sub>

---

## Skeleton

**Loading placeholders for text, avatar rows, cards, and table rows.**

Loading placeholders for text, avatar rows, cards, and table rows. Dimensions are intentionally fixed to reserve layout space and prevent content shift.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `type` | `text` | _needs review_ |
| `type` | `avatar` | _needs review_ |
| `type` | `card` | _needs review_ |
| `type` | `tableRow` | _needs review_ |

**State → tokens**

| State | Tokens |
|---|---|
| Type=Text | no root-level bindings |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

<sub>status `draft` · updated 2026-08-09 · fingerprint `b50699a07aaec9d0` · provenance description:imported · variants:imported · states:imported · dos:imported</sub>

---

## Slider

**Continuous value selection primitive.**

Continuous value selection primitive. State variants document default, keyboard focus, and disabled behavior.

Layout exception: Slider uses coordinate-based track, fill, and thumb geometry so the control can represent a continuous value. Do not infer absolute pixel positions as code API values; runtime width and value positioning are behavioral.

**State → tokens**

| State | Tokens |
|---|---|
| State=Default | no root-level bindings |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Do not**
- Do not emit State as an enum prop. It packs states that co-occur at runtime.

**Accessibility**
- State decomposition applies — see docs/state-decomposition.md. State [Default · Focused · Disabled] → :focus-visible CSS-owned, dropped; disabled independent boolean

<sub>status `draft` · updated 2026-08-09 · fingerprint `7fc42199fc479671` · provenance description:imported · states:imported · dos:imported · donts:imported · accessibility:imported</sub>

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
| Value=Unchecked, State=Default | text foreground · type size/14 |
| Value=Unchecked, State=Disabled | text muted-foreground |
| Value=Checked, State=Disabled | text muted-foreground |

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

**Tokens used** — `foreground` · `muted-foreground` · `size/14`

<sub>status `draft` · updated 2026-08-09 · fingerprint `e861d034e760a004` · provenance description:imported · variants:imported+framework · states:imported · dos:imported+best-practice · donts:imported+best-practice · accessibility:imported+w3c-apg · tokensUsed:imported · whenToUse:best-practice · whenNotToUse:best-practice</sub>

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
| Pattern=Basic | text foreground · type size/13 |
| Pattern=Disabled | text muted-foreground |

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

**Tokens used** — `foreground` · `muted-foreground` · `size/13`

<sub>status `draft` · updated 2026-08-09 · fingerprint `0d9a6bfa1702d1c5` · provenance description:imported · states:imported · dos:imported+best-practice · donts:imported+best-practice · tokensUsed:imported · whenToUse:best-practice · whenNotToUse:best-practice · accessibility:w3c-apg</sub>

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
| `size` | `default` | _needs review_ |
| `value` | `unchecked` | Not selected. |
| `value` | `checked` | Selected. |

**State → tokens**

| State | Tokens |
|---|---|
| Size=Small, Value=Unchecked, State=Default | fill input · radius radius/full |
| Size=Small, Value=Unchecked, State=Hover | fill accent |
| Size=Small, Value=Unchecked, State=Focused | border 2px ring |
| Size=Small, Value=Unchecked, State=Invalid | border 2px destructive |
| Size=Small, Value=Checked, State=Default | fill primary |
| Size=Small, Value=Checked, State=Hover | fill primary |
| Size=Small, Value=Checked, State=Focused | fill primary · border 2px ring |
| Size=Small, Value=Checked, State=Disabled | fill primary |

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

**Tokens used** — `accent` · `destructive` · `input` · `primary` · `radius/full` · `ring`

<sub>status `draft` · updated 2026-08-09 · fingerprint `1463c44c74fa0e88` · provenance description:imported · variants:imported+framework · states:imported · dos:imported+best-practice · donts:imported+best-practice · accessibility:imported+w3c-apg · tokensUsed:imported · whenToUse:best-practice · whenNotToUse:best-practice</sub>

---

## Switch / Thumb

**Movable Switch thumb.**

Movable Switch thumb. Size follows the Root size; disabled styling is inherited from the Root state.

Pipeline API classification: apply the Governance property-classification rule before code mapping. Visual State axes are QA/story states unless engineering explicitly approves a controlled runtime prop; Viewport is responsive test data; Pattern is composition/story data.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `size` | `small` | Dense contexts — tables, toolbars, compact rows. |
| `size` | `default` | _needs review_ |
| `state` | `default` | Resting state. |
| `state` | `disabled` | _needs review_ |

**State → tokens**

| State | Tokens |
|---|---|
| Size=Small, State=Default | fill card · radius radius/full |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Tokens used** — `card` · `radius/full`

<sub>status `draft` · updated 2026-08-09 · fingerprint `8839b7facf9f9bc8` · provenance description:imported · variants:imported+framework · states:imported · dos:imported · tokensUsed:imported</sub>

---

## Table

**Jake UI extension for structured tabular data with compact and comfortable density variants plus optional selected-row treatment.**

Jake UI extension for structured tabular data with compact and comfortable density variants plus optional selected-row treatment. Source-parity anatomy and examples are implemented by the Table / * assets and Table / Root Composition.

Pipeline property contract: only the component properties defined on this set are configurable public inputs. Other embedded copy is illustrative composition content and must not be generated as a public code prop until engineering API review.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `density` | `compact` | Tighter spacing for information-dense screens. |
| `density` | `comfortable` | Default spacing, easier to scan and tap. |
| `selection` | `none` | _needs review_ |
| `selection` | `selected` | _needs review_ |

**State → tokens**

| State | Tokens |
|---|---|
| Density=Compact, Selection=None | fill card · border 1px border · radius radius/lg · text muted-foreground · type size/12 |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Tokens used** — `border` · `card` · `muted-foreground` · `radius/lg` · `size/12`

<sub>status `draft` · updated 2026-08-09 · fingerprint `67ef76ce48707fff` · provenance description:imported · variants:imported+framework · states:imported · dos:imported · tokensUsed:imported</sub>

---

## Table / Action Trigger

**Icon-only row-action trigger used with Dropdown Menu.**

Icon-only row-action trigger used with Dropdown Menu. States cover default, hover, focus-visible, and disabled. Runtime implementation requires an accessible name and menu focus management.

Accessibility contract: icon-only row action trigger requires a programmatic accessible name that identifies the action context (for example, “Open row actions”) and a visible focus indicator.

**State → tokens**

| State | Tokens |
|---|---|
| State=Default | fill card · radius radius/lg |
| State=Hover | fill accent |
| State=Focused | fill accent · border 2px ring |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Do not**
- Do not emit State as an enum prop. It packs states that co-occur at runtime.
- Do not remove the ring border on focus. It is the only focus affordance.

**Accessibility**
- icon-only row action trigger requires a programmatic accessible name that identifies the action context (for example, “Open row actions”) and a visible focus indicator.
- State decomposition applies — see docs/state-decomposition.md. State [Default · Hover · Focused · Disabled] → :hover + :focus-visible CSS-owned, dropped; disabled independent boolean

**Tokens used** — `accent` · `card` · `radius/lg` · `ring`

<sub>status `draft` · updated 2026-08-09 · fingerprint `523ee0949e226990` · provenance description:imported · states:imported · dos:imported · donts:imported · accessibility:imported · tokensUsed:imported</sub>

---

## Table / Body

**Table body section containing data rows.**

Table body section containing data rows. Use the Row component states for hover and selection.

<sub>status `draft` · updated 2026-08-09 · fingerprint `c1c350933c9fcee4` · provenance description:imported</sub>

---

## Table / Caption

**Accessible descriptive caption for a table.**

Accessible descriptive caption for a table. Position is visual; code should preserve caption semantics and reading order.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `position` | `top` | _needs review_ |
| `position` | `bottom` | _needs review_ |

**State → tokens**

| State | Tokens |
|---|---|
| Position=Top | text muted-foreground · type size/12 |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Tokens used** — `muted-foreground` · `size/12`

<sub>status `draft` · updated 2026-08-09 · fingerprint `0fce061a561961d0` · provenance description:imported · variants:imported · states:imported · dos:imported · tokensUsed:imported</sub>

---

## Table / Cell

**Semantic table data cell with alignment and text-emphasis options.**

Semantic table data cell with alignment and text-emphasis options. Width is controlled by the containing column or row composition.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `alignment` | `left` | _needs review_ |
| `alignment` | `center` | _needs review_ |
| `alignment` | `right` | _needs review_ |
| `emphasis` | `default` | _needs review_ |
| `emphasis` | `strong` | _needs review_ |

**State → tokens**

| State | Tokens |
|---|---|
| Alignment=Left, Emphasis=Default | text muted-foreground · type size/13 |
| Alignment=Left, Emphasis=Strong | text foreground |
| Alignment=Center, Emphasis=Strong | text foreground |
| Alignment=Right, Emphasis=Strong | text foreground |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Tokens used** — `foreground` · `muted-foreground` · `size/13`

<sub>status `draft` · updated 2026-08-09 · fingerprint `11f8f26c97a6c467` · provenance description:imported · variants:imported · states:imported · dos:imported · tokensUsed:imported</sub>

---

## Table / Container

**Responsive overflow wrapper used by the Table root.**

Responsive overflow wrapper used by the Table root. Viewport variants document desktop fit and compact horizontal scrolling. Runtime implementation should expose the scroll region without collapsing column readability.

**State → tokens**

| State | Tokens |
|---|---|
| Viewport=Desktop | fill card · border 1px border · radius radius/lg · text muted-foreground · type size/10 |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Do not**
- Do not turn Viewport into a code prop.

**Tokens used** — `border` · `card` · `muted-foreground` · `radius/lg` · `size/10`

<sub>status `draft` · updated 2026-08-09 · fingerprint `c303b7583edc240b` · provenance description:imported · states:imported · dos:imported · donts:imported · tokensUsed:imported</sub>

---

## Table / Footer

**Table footer section for totals, summaries, or aggregate content.**

<sub>status `draft` · updated 2026-08-09 · fingerprint `d51b2461aa40f7a2` · provenance description:imported</sub>

---

## Table / Head

**Semantic table column header.**

Semantic table column header. Alignment controls presentation only; use scope/row-header semantics in code where applicable.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `alignment` | `left` | _needs review_ |
| `alignment` | `center` | _needs review_ |
| `alignment` | `right` | _needs review_ |

**State → tokens**

| State | Tokens |
|---|---|
| Alignment=Left | text muted-foreground · type size/12 |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Tokens used** — `muted-foreground` · `size/12`

<sub>status `draft` · updated 2026-08-09 · fingerprint `e273bdb28c89623c` · provenance description:imported · variants:imported · states:imported · dos:imported · tokensUsed:imported</sub>

---

## Table / Header

**Table header section containing semantic column headers.**

Table header section containing semantic column headers. This wrapper has no independent visual fill beyond its rows.

<sub>status `draft` · updated 2026-08-09 · fingerprint `edcc9f4c27fa2316` · provenance description:imported</sub>

---

## Table / Root Composition

**Source-parity Table compositions covering the basic invoice example, explicit footer example, row actions with a Dropdown Menu trigger, RTL content, desktop fit, and compact horizontal overflow.**

Source-parity Table compositions covering the basic invoice example, explicit footer example, row actions with a Dropdown Menu trigger, RTL content, desktop fit, and compact horizontal overflow. The original Table set remains the Jake UI density and selection extension.

Pipeline property contract: only the component properties defined on this set are configurable public inputs. Other embedded copy is illustrative composition content and must not be generated as a public code prop until engineering API review.

**State → tokens**

| State | Tokens |
|---|---|
| Pattern=Basic, Viewport=Desktop | text muted-foreground · type size/12 |
| Pattern=Basic, Viewport=Compact | type size/11 |
| Pattern=Footer, Viewport=Compact | type size/11 |
| Pattern=Actions, Viewport=Compact | type size/11 |
| Pattern=RTL, Viewport=Compact | type size/11 |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Do not**
- Do not turn Pattern/Viewport into a code prop.

**Tokens used** — `muted-foreground` · `size/11` · `size/12`

<sub>status `draft` · updated 2026-08-09 · fingerprint `3efdf2ea191b60dc` · provenance description:imported · states:imported · dos:imported · donts:imported · tokensUsed:imported</sub>

---

## Table / Row

**Table row patterns for header, body, and footer sections.**

Table row patterns for header, body, and footer sections. Body rows include default, hover, and selected states. Density controls row height without changing semantic structure.

Pipeline API classification: apply the Governance property-classification rule before code mapping. Visual State axes are QA/story states unless engineering explicitly approves a controlled runtime prop; Viewport is responsive test data; Pattern is composition/story data.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `type` | `header` | _needs review_ |
| `type` | `body` | _needs review_ |
| `type` | `footer` | _needs review_ |
| `density` | `compact` | Tighter spacing for information-dense screens. |
| `density` | `comfortable` | Default spacing, easier to scan and tap. |

**State → tokens**

| State | Tokens |
|---|---|
| Type=Header, State=Default, Density=Compact | fill muted · border border · text muted-foreground · type size/12 |
| Type=Body, State=Default, Density=Compact | fill card · text foreground · type size/13 |
| Type=Body, State=Hover, Density=Compact | text foreground · type size/13 |
| Type=Body, State=Selected, Density=Compact | fill accent · text foreground · type size/13 |
| Type=Footer, State=Default, Density=Compact | text foreground · type size/13 |
| Type=Body, State=Default, Density=Comfortable | fill card · text foreground · type size/13 |
| Type=Body, State=Hover, Density=Comfortable | text foreground · type size/13 |
| Type=Body, State=Selected, Density=Comfortable | fill accent · text foreground · type size/13 |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Do not**
- Do not emit State as an enum prop. It packs states that co-occur at runtime.

**Accessibility**
- State decomposition applies — see docs/state-decomposition.md. State [Default · Hover · Selected] → :hover CSS-owned, dropped; selected controlled state

**Tokens used** — `accent` · `border` · `card` · `foreground` · `muted` · `muted-foreground` · `size/12` · `size/13`

<sub>status `draft` · updated 2026-08-09 · fingerprint `5c64312cd8eaf10b` · provenance description:imported · variants:imported+framework · states:imported · dos:imported · donts:imported · accessibility:imported · tokensUsed:imported</sub>

---

## Tabs

**Grouped navigation for switching between peer views without leaving the current context.**

Grouped navigation for switching between peer views without leaving the current context. Orientation controls horizontal or vertical layout; Density supports default and compact applications.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `orientation` | `horizontal` | Lays out along the inline axis. |
| `orientation` | `vertical` | Lays out along the block axis. |
| `density` | `default` | _needs review_ |
| `density` | `compact` | Tighter spacing for information-dense screens. |

**State → tokens**

| State | Tokens |
|---|---|
| Orientation=Horizontal, Density=Default | fill muted · radius radius/lg · text foreground · type size/12 |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Tokens used** — `foreground` · `muted` · `radius/lg` · `size/12`

<sub>status `draft` · updated 2026-08-09 · fingerprint `b36246c0029c440d` · provenance description:imported · variants:imported+framework · states:imported · dos:imported · tokensUsed:imported</sub>

---

## Textarea

**Multiline text input for longer freeform content.**

Multiline text input for longer freeform content. Error state communicates validation failure; disabled state prevents editing.

Sizing exception: Textarea intentionally uses a fixed editing viewport height. Long input scrolls or expands according to the runtime textarea contract; do not convert the Figma value region to automatic component height without a product-level behavior change.

Accessibility contract: State=Error requires specific visible error text outside or below the editing surface and an assistive-technology error relationship; color alone is insufficient.

**When to use**
- Collect a single line of free-form text.

**When not to use**
- Choosing from a fixed set — use Select or Radio Group.
- Long multi-line text — use Textarea.

**State → tokens**

| State | Tokens |
|---|---|
| State=Default | fill card · border 1px input · radius radius/lg · text foreground · type size/14 |
| State=Focused | border 2px ring |
| State=Error | border 1px destructive |
| State=Disabled | fill muted · text muted-foreground |

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
- State=Error requires specific visible error text outside or below the editing surface and an assistive-technology error relationship; color alone is insufficient.
- State decomposition applies — see docs/state-decomposition.md. State [Default · Focused · Error · Disabled] → :focus-visible CSS-owned, dropped; invalid + disabled independent booleans
- Every input has a programmatically associated label.
- The error state sets aria-invalid and links its message via aria-describedby.

**Tokens used** — `card` · `destructive` · `foreground` · `input` · `muted` · `muted-foreground` · `radius/lg` · `ring` · `size/14`

<sub>status `draft` · updated 2026-08-09 · fingerprint `652cff63476a5ccf` · provenance description:imported · states:imported · dos:imported+best-practice · donts:imported+best-practice · accessibility:imported+w3c-apg · tokensUsed:imported · whenToUse:best-practice · whenNotToUse:best-practice</sub>

---

## Toggle

**Two-state action button for formatting, view controls, or other reversible selections.**

Two-state action button for formatting, view controls, or other reversible selections. Pressed state indicates the active selection.

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
| `pressed` | `false` | _needs review_ |
| `pressed` | `true` | _needs review_ |

**State → tokens**

| State | Tokens |
|---|---|
| Pressed=False, State=Default | fill card · border 1px border · radius radius/md · text foreground · type size/14 |
| Pressed=False, State=Focused | border 2px ring |
| Pressed=False, State=Disabled | fill muted · text muted-foreground |
| Pressed=True, State=Default | fill accent · text accent-foreground |
| Pressed=True, State=Hover | fill accent · text accent-foreground |
| Pressed=True, State=Focused | fill accent · border 2px ring · text accent-foreground |
| Pressed=True, State=Disabled | fill muted · text muted-foreground |

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
- State decomposition applies — see docs/state-decomposition.md. State [Default · Hover · Focused · Disabled] → :hover + :focus-visible CSS-owned, dropped; disabled independent boolean
- State is exposed via aria-checked, never by colour alone.

**Tokens used** — `accent` · `accent-foreground` · `border` · `card` · `foreground` · `muted` · `muted-foreground` · `radius/md` · `ring` · `size/14`

<sub>status `draft` · updated 2026-08-09 · fingerprint `7688d749d59b616a` · provenance description:imported · variants:imported · states:imported · dos:imported+best-practice · donts:imported+best-practice · accessibility:imported+w3c-apg · tokensUsed:imported · whenToUse:best-practice · whenNotToUse:best-practice</sub>

---

## Toggle Group

**Grouped toggle controls for choosing one or multiple persistent options.**

Grouped toggle controls for choosing one or multiple persistent options. Use single selection when options are mutually exclusive.

**When to use**
- Checkbox or toggle for an independent on/off value.
- Radio for one-of-many within a group.

**When not to use**
- A single either/or action that takes effect immediately with no save — prefer a toggle over a checkbox.
- A choice that only applies after a separate Save — prefer radio or checkbox over a toggle.

**Variants**

| Axis | Value | Meaning |
|---|---|---|
| `selection` | `single` | _needs review_ |
| `selection` | `multiple` | _needs review_ |
| `orientation` | `horizontal` | Lays out along the inline axis. |
| `orientation` | `vertical` | Lays out along the block axis. |

**State → tokens**

| State | Tokens |
|---|---|
| Selection=Single, Orientation=Horizontal | text accent-foreground · type size/14 |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.
- Label the control itself, not only the group.
- Make the label clickable.

**Do not**
- Do not use a radio group for multi-select.
- Do not use a toggle for choices that only apply after a separate Save.

**Accessibility**
- Keyboard: Space toggles.
- Keyboard: Radio groups move between options with arrow keys.
- State is exposed via aria-checked, never by colour alone.

**Tokens used** — `accent-foreground` · `size/14`

<sub>status `draft` · updated 2026-08-09 · fingerprint `561f34b8578477ce` · provenance description:imported · variants:imported+framework · states:imported · dos:imported+best-practice · tokensUsed:imported · whenToUse:best-practice · whenNotToUse:best-practice · donts:best-practice · accessibility:w3c-apg</sub>

---

## Tooltip

**Brief non-interactive label revealed on hover or focus.**

Brief non-interactive label revealed on hover or focus. Side controls preferred placement relative to the trigger.

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
| Side=Top | fill foreground · radius radius/lg · text card · type size/12 |

**Do**
- Reference variables for every value; never hardcode a hex or px.
- Change state through props, never by detaching the instance.

**Tokens used** — `card` · `foreground` · `radius/lg` · `size/12`

<sub>status `draft` · updated 2026-08-09 · fingerprint `91a04caa95840f0b` · provenance description:imported · variants:imported+framework · states:imported · dos:imported · tokensUsed:imported</sub>

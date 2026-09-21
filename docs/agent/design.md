# Jake UI design rules for frontend work

## Identity and scope

Jake UI is a compact product-interface system: quiet semantic surfaces, Inter typography, clear controls, information-dense forms and tables, and paired light/dark themes. Its examples include patient records, but it is not a medical domain model. Product copy, business rules, routes and data ownership come from the application brief.

Use the existing system for product UI. A marketing site, editorial display scale or distinct brand direction is an explicit extension, not an invitation to silently enlarge the type ramp or recolor primitives. shadcn-shaped token names do not imply shadcn component interfaces.

## Color and theme

Import `jakeui/tokens.css`. Use semantic utilities: `bg-background text-foreground`, `bg-card text-card-foreground`, `bg-popover text-popover-foreground`, `bg-muted text-muted-foreground`, `bg-primary text-primary-foreground`. Preserve each component's pairing.

Action-colored text uses `text-primary-readable`. Destructive text on tinted surfaces uses `text-destructive-readable`; solid destructive surfaces use their matching foreground. `bg-scrim` is the dark overlay in both themes. These last two roles are approved runtime aliases awaiting Figma adoption, not missing tokens to delete.

The `.dark` ancestor selects dark mode and native control color scheme. Set it at the application theme boundary. Verify both themes. Primitive color utilities, hex/RGB literals and per-screen palette overrides are outside the consumer contract.

## Typography

Load Inter through `jakeui/fonts.css`. Use the [semantic ramp](../tokens/typography.md): `text-label-md` with `text-body-sm` for compact UI, `text-label-lg` with `text-body-md` for comfortable forms, `text-heading-xs` for small section titles, and `text-heading-lg` for dialogs/page-level headings within this compact system.

Each ramp utility includes size, weight and line height. Use one whole step. The inherited root body should be `text-body-md`; labels and headings choose their own role. Avoid Tailwind's generic `text-sm/text-base/text-xl`, standalone font weights/line heights, decorative tracking and arbitrary type sizes. Existing internal typography exceptions are not examples for new application code.

## Layout, spacing and density

Components own their internal padding, radius, focus ring and state colors. Applications own page grids and wrappers. Prefer `gap-*`, `p-*` and responsive layout classes on wrappers instead of overriding component internals.

Use the system's 4px spacing unit and existing half-steps: 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 12, 16. Typical control grouping is gap-2/3, form grouping gap-4/5, page padding p-4 with sm:p-6, and section separation gap-6/8. These are consumer composition defaults, not new claims about Figma bindings.

Use intrinsic widths, flex/grid, `min-w-0`, `w-full` and standard max-width containers; center a readable form with `max-w-xl`, and constrain a data workspace with `max-w-6xl` when appropriate. Wrap long copy. Avoid global horizontal overflow; tables may scroll inside their named TableContainer. Radius/elevation use component defaults; add `rounded-lg` or `shadow-sm/md` only to a real new surface, not every wrapper. No nested card wrappers merely to create spacing.

Compact and comfortable describe information density, not device detection. Let Table density propagate. At narrow widths reflow the application shell, stack form columns, and retain essential actions. Do not squeeze desktop columns into unreadable text. Check 375px and 1280px, plus an intermediate width when layout changes. The breakpoints are CSS layout decisions, not component props inferred from Figma Viewport variants.

## Motion, icons and states

Use Phosphor icons, inherit currentColor, and use 16px inline icons, 20px icons in medium Button and SidebarNavigationItem slots, unless the selected component specifies another size. Decorative icons are aria-hidden; icon-only actions need a context-specific accessible name. Icons do not replace explicit destructive labels.

Use shared `MOTION` from `jakeui/utils` for state transitions; it respects reduced motion. Avoid animation for its own sake, layout-property transitions, and motion that obscures focus. The system does not supply a general page-transition engine.

Every feature accounts for loading, empty, error, success and unavailable states where applicable. Color is supplementary to text/state semantics. Reuse Field, Alert, Skeleton, DataTable and Dialog rather than redrawing controls. A button's disabled state needs an understandable reason; loading must not permit duplicate submission.

## Customization and exceptions

Choose a supported prop first; compose a wrapper second. Native elements are appropriate for document structure (`main`, `section`, `form`, headings, lists), links, and table sections. Existing Jake UI controls should handle buttons/inputs/selects/textareas/dialogs. A custom interactive primitive requires an explicit unmet-capability decision and its own accessibility verification.

Use `cn` from `jakeui/utils`: stock tailwind-merge can erase the custom type ramp. No deep imports from library internals. Respect [the scoped exception registry](../../agent/exceptions.json). When a task needs a new visual role or interaction, follow [the extension workflow](workflow.md); do not approximate another library's API.

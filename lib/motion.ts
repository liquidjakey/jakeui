/**
 * Motion, bound to the Figma `Interaction` collection.
 *
 * WHY THIS EXISTS
 * The Interaction collection has always carried duration and easing variables,
 * and `scripts/export-tokens.mjs` has always exported them — `--duration-100`
 * through `--duration-1000`, the semantic `--duration-fast|default|slow`
 * aliases, `--ease-linear` and `--ease-in-out`. They were emitted into
 * tokens/globals.css and then used by NOTHING. An audit on 9 Aug 2026 found
 * zero components referencing a single one of them, and 37 of 45 components
 * with no transition at all: overlays appeared and disappeared on one frame,
 * and disclosure components snapped open.
 *
 * Tailwind's own `duration-150` and `ease-in-out` happen to resolve to the same
 * values as `duration/150` and `easing/in-out`. They are NOT used here, because
 * matching by coincidence is exactly the kind of silent drift the token layer
 * exists to prevent — if Figma retimes the system, a hardcoded `duration-150`
 * would not follow. These reference the variables.
 *
 * Every entry is `motion-safe:`, so all of it is dropped under
 * `prefers-reduced-motion: reduce`.
 */

const DEFAULT = 'motion-safe:duration-[var(--duration-default)]';
const FAST = 'motion-safe:duration-[var(--duration-fast)]';
const EASE = 'motion-safe:ease-[var(--ease-in-out)]';

export const MOTION = {
  /** Hover and focus colour changes on controls. */
  colors: `motion-safe:transition-colors ${DEFAULT} ${EASE}`,

  /** Overlay enter/exit — popovers, menus, tooltips, hover cards. */
  overlay: `motion-safe:transition-[opacity,transform] ${FAST} ${EASE}`,

  /**
   * Disclosure open/close — accordion, collapsible.
   *
   * ⚠️ CURRENTLY UNUSED, on purpose. Both disclosure components unmount their
   * panel when closed to satisfy a recorded accessibility contract, and a
   * transition cannot animate an element that does not exist. Keeping them
   * mounted and animating `grid-template-rows: 0fr -> 1fr` was tried and
   * measured as broken in Chrome: the opened panel settled at 0px against 32px
   * of content, because an animating `fr` row interpolates against zero free
   * space in an auto-height grid. Kept here so the next attempt starts from the
   * token rather than a hardcoded duration — see accordion.tsx for the full
   * write-up and the `calc-size()` route out.
   */
  disclosure: `motion-safe:transition-[grid-template-rows,opacity] ${DEFAULT} ${EASE}`,

  /** Transform-only movement — switch thumbs, chevrons. */
  transform: `motion-safe:transition-transform ${DEFAULT} ${EASE}`,
} as const;

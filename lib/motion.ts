/**
 * Token-bound motion. Variable references follow token updates; all transitions
 * respect prefers-reduced-motion through motion-safe.
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
   * Disclosure transition vocabulary only. Accordion and Collapsible unmount
   * closed panels, so they do not use this transition. A mounted animation needs
   * explicit hidden/focus semantics and measured expanded height.
   */
  disclosure: `motion-safe:transition-[grid-template-rows,opacity] ${DEFAULT} ${EASE}`,

  /** Transform-only movement — switch thumbs, chevrons. */
  transform: `motion-safe:transition-transform ${DEFAULT} ${EASE}`,
} as const;

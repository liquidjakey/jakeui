/**
 * Token-bound state opacity. Disabled and read-only are distinct states;
 * do not interchange them or apply read-only dimming to unrelated components.
 */

/** Disabled opacity for components using the system's opacity/50 role. */
export const OPACITY_DISABLED = 'opacity-[var(--opacity-50)]';

/** Read-only opacity, distinct from disabled. */
export const OPACITY_READONLY = 'opacity-[var(--opacity-80)]';

/**
 * Switch thumb's own disabled opacity. It compounds with the track's
 * opacity/50 because the thumb is nested; do not remove either layer.
 */
export const OPACITY_THUMB_DISABLED = 'opacity-[var(--opacity-75)]';

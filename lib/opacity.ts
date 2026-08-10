/**
 * State opacity, bound to the Figma `Interaction` collection.
 *
 * WHY THIS EXISTS
 * A live read on 10 Aug 2026 found the file distinguishes two dimmed states that
 * the code had collapsed into one:
 *
 *   State=Disabled  -> opacity/50   on Switch / Root and Radio Group / Item
 *   State=ReadOnly  -> opacity/80   on the same two sets, and Radio Group / Root
 *
 * `switch.tsx` and `radio-group.tsx` both wrote
 * `(state === 'disabled' || state === 'readOnly') && 'opacity-50'`, so a
 * read-only control rendered at 50% where the file draws 80% — noticeably more
 * dimmed than intended, and indistinguishable from disabled. Splitting the
 * branch is the fix; these constants are where the two values now live.
 *
 * WHY NOT TAILWIND'S `opacity-50` / `opacity-80`
 * They resolve to the same 0.5 and 0.8 today, and that is exactly the trap.
 * `lib/motion.ts` records the same reasoning for duration and easing: matching by
 * coincidence is the kind of silent drift the token layer exists to prevent. If
 * Figma retunes `opacity/80`, a hardcoded `opacity-80` would not follow, and
 * nothing would fail. These reference the variables, so a retune propagates
 * through `npm run tokens:sync` on its own.
 *
 * SCOPE — read this before reusing these elsewhere.
 * `opacity/50` for disabled is a real system-wide convention: the live read found
 * it bound on 13 sets (both disclosure menus' items, Popover / Trigger and
 * / Close, Table / Action Trigger, Calendar and Date Picker dates, and the two
 * here). `opacity/80` for read-only is bound on 3, and read-only exists as a
 * state on very few components.
 *
 * `Checkbox` and `Segmented Tab` also dim when disabled in CODE, but their Figma
 * variants carry NO opacity change at all — that dimming is asserted, and
 * recorded as such in their source. They deliberately do not use these constants,
 * because doing so would dress an assertion up as a binding.
 */

/** `State=Disabled` — the file binds `opacity/50` on 13 component sets. */
export const OPACITY_DISABLED = 'opacity-[var(--opacity-50)]';

/** `State=ReadOnly` — the file binds `opacity/80`. Distinct from disabled. */
export const OPACITY_READONLY = 'opacity-[var(--opacity-80)]';

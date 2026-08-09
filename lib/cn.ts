import { twMerge } from 'tailwind-merge';

/**
 * Join class names, resolving Tailwind conflicts so the **last** one wins.
 *
 * This started as a plain `filter(Boolean).join(' ')` on the assumption that
 * Jake UI components compose classes in one ordered expression and would never
 * need conflict resolution. That assumption was wrong, and the very first
 * component disproved it.
 *
 * `Input` sets `border-input` in its base and `border-destructive` when invalid.
 * Both set `border-color` at equal specificity, so the winner is decided by
 * **source order in the generated stylesheet, not by order in the class
 * attribute** — and Tailwind happens to emit `.border-input` after
 * `.border-destructive`. The invalid border silently rendered grey instead of
 * red. Caught only by rendering it in Storybook; no type check or build could
 * have found it.
 *
 * `twMerge` makes the intent hold: later class wins, which is what the ordered
 * expression already reads as. This also matches the shadcn convention the
 * project targets (`project.uiFramework`).
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return twMerge(parts.filter(Boolean).join(' '));
}

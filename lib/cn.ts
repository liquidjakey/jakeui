import { extendTailwindMerge } from 'tailwind-merge';

/**
 * The 14 semantic type-ramp steps, mirroring the Figma text styles 1:1.
 *
 * This list MUST stay in sync with the `--text-*` ramp in tokens/globals.css,
 * which is itself generated from the Figma text styles. If a step is added in
 * Figma and not added here, twMerge will silently delete it — see below.
 */
const TYPE_RAMP = [
  'heading-lg',
  'heading-md',
  'heading-sm',
  'heading-xs',
  'label-lg',
  'label-md',
  'label-sm',
  'label-xs',
  'body-md',
  'body-sm',
  'body-xs',
  'caption-sm',
  'caption-xs',
  'value-strong',
] as const;

/**
 * twMerge, taught this project's custom font-size scale.
 *
 * WHY THIS IS NOT THE STOCK `twMerge`
 * Stock tailwind-merge only knows Tailwind's own `text-*` sizes (`text-base`,
 * `text-lg`, …). Every other `text-*` it sees is classified as a **text-colour**
 * utility. The ramp steps are custom, so `text-body-md` was read as a colour.
 *
 * That put the type step and the colour in the SAME conflict group, and twMerge
 * resolves a conflict by keeping only the last class. So in every component that
 * composes typography and colour in one `cn()` call — which is nearly all of
 * them — the typography was deleted at runtime:
 *
 *   text-body-md    + text-primary-foreground -> text-primary-foreground
 *   text-heading-md + text-foreground         -> text-foreground
 *   text-label-md   + text-destructive        -> text-destructive
 *
 * The text then fell back to the browser default of 16px/24px. Button rendered
 * 16/24 where Figma's `Label/LG` binds 14/20, and it was wrong in this exact way
 * across 38 components and 130 class occurrences. Nothing caught it: the classes
 * are correct in the source, the tokens are correct in globals.css, and both
 * `npm run check` and the props-table gate look at names, never at what the
 * browser finally computes.
 *
 * Registering the ramp under `font-size` puts each step back in the size group,
 * where it no longer conflicts with a colour and both survive the merge.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: [...TYPE_RAMP] }],
    },
  },
});

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

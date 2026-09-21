import { extendTailwindMerge } from 'tailwind-merge';

/** Semantic font-size classes. Keep in sync with the generated token ramp. */
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
 * Register semantic text sizes separately from text colors so class merging
 * preserves both. Computed-typography checks verify the rendered result.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: [...TYPE_RAMP] }],
    },
  },
});

/**
 * Join classes and resolve Tailwind conflicts with the last conflicting class
 * winning. Plain string joining cannot control generated stylesheet precedence.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return twMerge(parts.filter(Boolean).join(' '));
}

/**
 * Minimal class-name joiner.
 *
 * Deliberately not `clsx` + `tailwind-merge`: Jake UI components compose their
 * classes in a single ordered expression and never need conflict resolution
 * between a base and an override. If a component ever does, reach for
 * `tailwind-merge` then — not before.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

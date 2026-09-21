import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { MOTION } from '../lib/motion.js';

/**
 * Two-state action button using aria-pressed. Native Space and Enter activate it.
 * Keep the accessible action label stable as pressed changes.
 * Consumer contract: docs/agent/components/toggle.md.
 */
export interface ToggleProps {
  label: string;
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
  disabled?: boolean;
  /** When set and label is used as the name only, this renders icon-only. */
  icon?: ReactNode;
  iconOnly?: boolean;
}

export function Toggle({
  label,
  pressed,
  onPressedChange,
  disabled = false,
  icon,
  iconOnly = false,
}: ToggleProps) {
  return (
    <button
      type="button"
      // aria-pressed, NEVER aria-checked. See the block above.
      aria-pressed={pressed}
      // For an icon-only toggle the name must describe the ACTION, not the state —
      // "Bold", not "Bolded".
      aria-label={iconOnly ? label : undefined}
      disabled={disabled}
      onClick={() => onPressedChange(!pressed)}
      className={cn(
        // radius/md here, where every other control in this system binds radius/lg.
        // Transcribed faithfully; flagged in the props table as worth checking.
        // gap is `space/2` (8px) and the label binds Label/LG (14/20 medium).
        'inline-flex items-center gap-2 rounded-md border px-3 py-2 text-label-lg',
        MOTION.colors,
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        pressed
          ? // Pressed keeps the same fill on hover.
            'border-transparent bg-accent text-accent-foreground'
          : 'border-border bg-card text-foreground',
        // Pressed + disabled loses the pressed state entirely — it renders exactly
        // like unpressed + disabled. aria-pressed still reports it correctly, so
        // assistive technology, but the visual state is not differentiated.
        disabled && 'cursor-not-allowed border-transparent bg-muted text-muted-foreground',
      )}
    >
      {icon ? (
        <span aria-hidden="true" className="shrink-0">
          {icon}
        </span>
      ) : null}
      {iconOnly ? null : label}
    </button>
  );
}

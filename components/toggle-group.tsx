import type { ReactNode } from 'react';
import { Toggle } from './toggle.js';
import { cn } from '../lib/cn.js';

/**
 * ToggleGroup — grouped toggle buttons.
 *
 * Figma: `Toggle Group`, 4 variants.
 * Contract: docs/components/toggle-group.md
 *
 * THE RECORD IS ALMOST EMPTY: one state row and two tokens (accent-foreground,
 * size/14) for four variants. And accent-foreground looks like a stray binding —
 * it is the FOREGROUND for the accent fill, but the group binds no fill of its own,
 * so it is a foreground token with nothing to sit on. The items (Toggle) already
 * carry accent/accent-foreground for their pressed state.
 *
 * So this is implemented as a LAYOUT-ONLY container and each Toggle owns its
 * appearance, which is what the tokens actually support. Figma owes either a real
 * container treatment or the removal of that binding.
 *
 * role="group", NOT radiogroup — even in single mode. The members are toggle
 * buttons with aria-pressed, not radios with aria-checked, so Tab moves between
 * them and arrow keys are not used.
 */
export interface ToggleGroupItem {
  id: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface ToggleGroupProps {
  items: ToggleGroupItem[];
  pressedIds: string[];
  onPressedChange: (ids: string[]) => void;
  selection?: 'single' | 'multiple';
  orientation?: 'horizontal' | 'vertical';
  label: string;
}

export function ToggleGroup({
  items,
  pressedIds,
  onPressedChange,
  selection = 'single',
  orientation = 'horizontal',
  label,
}: ToggleGroupProps) {
  const toggle = (id: string) => {
    const on = pressedIds.includes(id);
    if (selection === 'single') {
      // Unlike a radio group there is no "must have one" guard: all members may be
      // off, which is legitimate when the members are actions rather than data.
      onPressedChange(on ? [] : [id]);
      return;
    }
    onPressedChange(on ? pressedIds.filter((x) => x !== id) : [...pressedIds, id]);
  };

  return (
    <div
      role="group"
      aria-label={label}
      className={cn('inline-flex gap-1', orientation === 'vertical' ? 'flex-col' : 'flex-row')}
    >
      {items.map((item) => (
        <Toggle
          key={item.id}
          label={item.label}
          icon={item.icon}
          disabled={item.disabled}
          pressed={pressedIds.includes(item.id)}
          onPressedChange={() => toggle(item.id)}
        />
      ))}
    </div>
  );
}

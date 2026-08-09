import { useId } from 'react';
import { cn } from '../lib/cn.js';
import { MOTION } from '../lib/motion.js';

/**
 * Slider — range input.
 *
 * Figma: `Slider`, 3 variants.
 * Contract: docs/components/slider.md
 *
 * Its description could only ever say "no root-level bindings" — every token lives on
 * child nodes (Track, Range, Thumb) that the description generator does not read. Read
 * from live bindings instead; see .figma-blocked-variants.json.
 *
 *   Track   muted, every state
 *   Range   primary / primary / muted-foreground (default / focused / disabled)
 *   Thumb   card fill, with a primary / ring / muted-foreground STROKE
 */
export interface SliderProps {
  value: number;
  onValueChange: (value: number) => void;
  label: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

export function Slider({
  value,
  onValueChange,
  label,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
}: SliderProps) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-body-md text-foreground">
          {label}
        </label>
        {/* The archetype: "Show the current value as text next to the track." */}
        <span className="text-body-sm tabular-nums text-muted-foreground">{value}</span>
      </div>

      <div className="relative h-5">
        {/* Track and range are decorative — the real control is the native input
            beneath them, which keeps all the platform keyboard behaviour. */}
        {/* Track is 6px tall in the file (space/1-5) and binds radius/lg; it was 4px. */}
        <div aria-hidden="true" className="absolute inset-x-0 top-1.5 h-1.5 rounded-lg bg-muted">
          <div
            className={cn('h-full rounded-lg', MOTION.colors, disabled ? 'bg-muted-foreground' : 'bg-primary')}
            style={{ width: `${pct}%` }}
          />
        </div>
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onValueChange(Number(e.target.value))}
          className={cn(
            'peer absolute inset-0 w-full cursor-pointer appearance-none bg-transparent',
            'focus-visible:outline-none',
            disabled && 'cursor-not-allowed',
          )}
        />
        <span
          aria-hidden="true"
          className={cn(
            // Thumb is 20x20 in the file with a stroke/2 border; it was 12x12.
            // Focus swaps the stroke to `ring` at stroke/3.
            'pointer-events-none absolute top-0 size-5 -translate-x-1/2 rounded-full border-2 bg-card',
            MOTION.colors,
            disabled ? 'border-muted-foreground' : 'border-primary',
            'peer-focus-visible:border-[length:var(--stroke-3)] peer-focus-visible:border-ring',
          )}
          style={{ left: `${pct}%` }}
        />
      </div>
    </div>
  );
}

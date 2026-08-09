import { useId, useState } from 'react';
import { Calendar } from './calendar.js';
import { cn } from '../lib/cn.js';

/**
 * DatePicker — text field plus a calendar popover.
 *
 * Figma: `Date Picker`, 14 variants.
 * Contract: docs/components/date-picker.md
 *
 * Read from LIVE BINDINGS — its description showed 3 of 14 rows. The read gave the
 * field states AND, more valuably, THE AUTHORITATIVE DAY STATES that Calendar's own
 * record names in prose and binds nowhere:
 *
 *   default       card fill, foreground text
 *   today         card fill + PRIMARY STROKE, foreground text
 *   selected      primary fill, primary-foreground text
 *   range middle  accent fill, accent-foreground text
 *   outside/dis.   card fill, muted-foreground text
 *
 * Four of the five assertions made in calendar.md were CORRECT. The exception is
 * `today`, which is a primary STROKE, not the ring outline that was asserted —
 * calendar.tsx has been corrected to match.
 *
 * Field states, also from the read:
 *   default card + input | focused card + ring | error card + destructive
 *   | disabled muted + input, value muted-foreground
 */
export interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date) => void;
  label: string;
  mode?: 'single' | 'range';
  invalid?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  format?: (d: Date) => string;
}

export function DatePicker({
  value,
  onChange,
  label,
  mode = 'single',
  invalid = false,
  errorMessage,
  disabled = false,
  format = (d) => d.toLocaleDateString(),
}: DatePickerProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(value ?? new Date());
  const showError = invalid && Boolean(errorMessage);

  return (
    <div className="relative flex flex-col gap-1">
      <label htmlFor={id} className="text-body-md text-foreground">
        {label}
      </label>

      <button
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-invalid={invalid || undefined}
        aria-describedby={showError ? errorId : undefined}
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center justify-between gap-2 rounded-lg border px-3 py-[calc(var(--spacing)*2.25)]',
          'text-left text-body-md',
          'focus-visible:outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset',
          disabled
            ? 'cursor-not-allowed border-input bg-muted text-muted-foreground'
            : invalid
              ? 'border-destructive bg-card text-foreground'
              : 'border-input bg-card text-foreground',
        )}
      >
        <span>{value ? format(value) : 'Select a date'}</span>
        {/* The read shows the icon binds `foreground` even in the disabled variant. */}
        <span aria-hidden="true" className="text-foreground">
          ▤
        </span>
      </button>

      {showError ? (
        <p id={errorId} aria-live="polite" className="text-caption-sm text-destructive">
          {errorMessage}
        </p>
      ) : null}

      {open && !disabled ? (
        <div className="absolute top-full z-50 mt-2">
          <Calendar
            month={month}
            monthLabel={month.toLocaleString('en', { month: 'long', year: 'numeric' })}
            onMonthChange={setMonth}
            mode={mode}
            selected={value}
            onSelect={(d) => {
              onChange(d);
              if (mode === 'single') setOpen(false);
            }}
          />
        </div>
      ) : null}
    </div>
  );
}

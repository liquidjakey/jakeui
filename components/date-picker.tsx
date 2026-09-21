import { useId, useState } from 'react';
import { CalendarBlank } from '@phosphor-icons/react';
import { Calendar } from './calendar.js';
import { Popover } from './popover.js';
import { cn } from '../lib/cn.js';

interface DatePickerCommonProps {
  label: string;
  invalid?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  format?: (d: Date) => string;
}
export type DateRange = [Date, Date?];
export type DatePickerProps = DatePickerCommonProps &
  (
    | { mode?: 'single'; value: Date | undefined; onChange: (date: Date) => void }
    | { mode: 'range'; value: DateRange | undefined; onChange: (range: DateRange) => void }
  );
const inputValue = (d?: Date) =>
  d
    ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    : '';
const parseDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(y!, m! - 1, d!);
  return inputValue(date) === value ? date : undefined;
};

export function DatePicker(props: DatePickerProps) {
  const {
    label,
    invalid = false,
    errorMessage,
    disabled = false,
    format = (d: Date) => d.toLocaleDateString(),
  } = props;
  const id = useId(),
    errorId = `${id}-error`;
  const start = Array.isArray(props.value) ? props.value[0] : props.value;
  const end = Array.isArray(props.value) ? props.value[1] : undefined;
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(start ?? new Date());
  const changeOpen = (next: boolean) => {
    if (next && disabled) return;
    if (next) setMonth(start ?? new Date());
    setOpen(next);
  };
  const select = (date: Date) => {
    if (props.mode === 'range') {
      if (!start || end) props.onChange([date]);
      else {
        props.onChange(date < start ? [date, start] : [start, date]);
        setOpen(false);
      }
    } else {
      props.onChange(date);
      setOpen(false);
    }
  };
  const showError = invalid && Boolean(errorMessage);
  const text = start
    ? props.mode === 'range'
      ? `${format(start)} – ${end ? format(end) : 'Select end date'}`
      : format(start)
    : props.mode === 'range'
      ? 'Select date range'
      : 'Select a date';
  const dateInputClass =
    'min-w-0 w-full rounded-lg border border-input bg-card p-2 text-body-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-body-md text-foreground">
        {label}
      </label>
      <Popover
        open={open && !disabled}
        onOpenChange={changeOpen}
        title={label}
        modal
        size="large"
        trigger={
          <button
            id={id}
            type="button"
            disabled={disabled}
            aria-invalid={invalid || undefined}
            aria-describedby={showError ? errorId : undefined}
            className={cn(
              'flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-[calc(var(--spacing)*2.25)] text-left text-body-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
              disabled
                ? 'cursor-not-allowed border-input bg-muted text-muted-foreground'
                : invalid
                  ? 'border-destructive bg-card text-foreground'
                  : 'border-input bg-card text-foreground',
            )}
          >
            <span>{text}</span>
            <CalendarBlank size={16} aria-hidden="true" />
          </button>
        }
      >
        <div className="flex flex-col gap-3">
          <div className={cn('grid gap-2', props.mode === 'range' && 'grid-cols-2')}>
            <label className="text-body-sm">
              {props.mode === 'range' ? 'Start date' : 'Date'}
              <input
                type="date"
                value={inputValue(start)}
                className={dateInputClass}
                onChange={(e) => {
                  const date = parseDate(e.target.value);
                  if (!date) return;
                  setMonth(date);
                  if (props.mode === 'range')
                    props.onChange([date, end && end >= date ? end : undefined]);
                  else props.onChange(date);
                }}
              />
            </label>
            {props.mode === 'range' ? (
              <label className="text-body-sm">
                End date
                <input
                  type="date"
                  min={inputValue(start)}
                  value={inputValue(end)}
                  className={dateInputClass}
                  onChange={(e) => {
                    const date = parseDate(e.target.value);
                    if (!date || (start && date < start)) return;
                    props.onChange([start ?? date, date]);
                    setMonth(date);
                  }}
                />
              </label>
            ) : null}
          </div>
          <Calendar
            month={month}
            monthLabel={month.toLocaleString('en', { month: 'long', year: 'numeric' })}
            onMonthChange={setMonth}
            mode={props.mode}
            selected={props.value}
            onSelect={select}
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="self-end rounded-lg px-3 py-2 text-label-md text-primary-readable focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Done
          </button>
        </div>
      </Popover>
      {showError ? (
        <p id={errorId} aria-live="polite" className="text-caption-sm text-destructive-readable">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}

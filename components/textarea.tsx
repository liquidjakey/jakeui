import { useId, forwardRef } from 'react';
import type { ChangeEvent, FocusEvent } from 'react';
import { cn } from '../lib/cn.js';
import { MOTION } from '../lib/motion.js';

/**
 * Controlled multiline input with a fixed editing viewport and optional counter.
 * Invalid and disabled are independent; focus is browser-owned.
 * Consumer contract: docs/agent/components/textarea.md.
 */
export interface TextareaProps {
  /** Current field value. Renders in `--foreground`. */
  value: string;
  /** Shown when `value` is empty. Renders in `--muted-foreground` (code-only state — no Figma variant). */
  placeholder?: string;
  /** Helper text below the field. Figma property `Helper#82:14`. */
  helper?: string;
  /** Initial visible height in lines. Code-only — see the sizing policy below. */
  rows?: number;
  /** Character limit. When set, a counter is rendered and linked via `aria-describedby`. */
  maxLength?: number;
  /** Applies the error border. Independent of `disabled`. */
  invalid?: boolean;
  /** Standalone invalid controls need an error message. Inside Field, pass it to Field only. */
  errorMessage?: string;
  /** Blocks input. Independent of `invalid`. */
  disabled?: boolean;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus?: (e: FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: FocusEvent<HTMLTextAreaElement>) => void;
  name?: string;
  /** Ties the field to its `<label>`. Auto-generated when omitted. */
  id?: string;
  required?: boolean;
  /** Required only when no visible `<label>` exists. */
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean | 'true' | 'false' | 'grammar' | 'spelling';
}

/**
 * Fixed editing viewport: long content scrolls, and rows sets the initial height.
 * User resizing or automatic growth requires a scoped behavior change.
 */
const BASE = [
  'block w-full resize-none',
  'rounded-lg border border-input bg-card',
  // Textarea uses space/3 padding on both axes.
  'px-3 py-3',
  'text-body-md text-foreground',
  'placeholder:text-muted-foreground',
  MOTION.colors,
].join(' ');

/**
 * Focus is 1px `border-ring` + a 1px inset `ring-ring` — 2px of `ring` in total,
 * matching the Figma Focused variant's 2px stroke, with zero layout shift. A
 * literal `border-2` would shrink the content box and nudge the text 1px on focus.
 *
 * Unlike Input this is keyed directly on `focus-visible:` rather than
 * `has-[:focus-visible]`, because Textarea has no slots and therefore no wrapper
 * — the focusable element and the bordered element are the same node.
 *
 * Do not remove: this is the only focus affordance.
 */
const FOCUS = [
  'focus-visible:border-ring',
  'focus-visible:ring-1',
  'focus-visible:ring-ring',
  'focus-visible:ring-inset',
  'focus-visible:outline-none',
].join(' ');

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    value,
    placeholder,
    helper,
    rows = 4,
    maxLength,
    invalid = false,
    errorMessage,
    disabled = false,
    onChange,
    onFocus,
    onBlur,
    name,
    id,
    required = false,
    'aria-label': ariaLabel,
    'aria-describedby': externalDescription,
    'aria-invalid': externalInvalid,
  },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const errorId = `${fieldId}-error`;
  const helperId = `${fieldId}-helper`;
  const countId = `${fieldId}-count`;

  const showError = invalid && Boolean(errorMessage);
  const isInvalid =
    invalid ||
    (externalInvalid !== undefined && externalInvalid !== false && externalInvalid !== 'false');
  const showCount = typeof maxLength === 'number';

  // Helper text is NOT replaced by the error — a user usually needs both, per
  // the `textarea` archetype's donts.
  const describedBy =
    [
      externalDescription,
      helper ? helperId : null,
      showCount ? countId : null,
      showError ? errorId : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

  return (
    <>
      <textarea
        ref={ref}
        id={fieldId}
        name={name}
        rows={rows}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        maxLength={maxLength}
        aria-label={ariaLabel}
        aria-invalid={externalInvalid ?? (invalid || undefined)}
        aria-describedby={describedBy}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className={cn(
          BASE,
          !disabled && FOCUS,
          // Invalid styling remains visible when the control is disabled.
          isInvalid && 'border-destructive',
          disabled && 'bg-muted text-muted-foreground cursor-not-allowed',
        )}
      />

      {helper || showCount ? (
        <div className="mt-1 flex items-start justify-between gap-3">
          {helper ? (
            <p id={helperId} className="text-caption-sm text-muted-foreground">
              {helper}
            </p>
          ) : (
            <span />
          )}
          {showCount ? (
            // Deliberately NOT a live region. A polite live region on a counter
            // fires on every keystroke, which is noise rather than help. Linking
            // it through aria-describedby means it is read when the field takes
            // focus, which is when the limit is actually useful to know.
            <p id={countId} className="shrink-0 text-caption-sm text-muted-foreground tabular-nums">
              {value.length} / {maxLength}
            </p>
          ) : null}
        </div>
      ) : null}

      {showError ? (
        <p
          id={errorId}
          // Polite feedback avoids interrupting typing on every validation pass.
          aria-live="polite"
          className="mt-1 text-caption-sm text-destructive"
        >
          {errorMessage}
        </p>
      ) : null}
    </>
  );
});

import { useId, forwardRef } from 'react';
import type { ChangeEvent, FocusEvent } from 'react';
import { cn } from '../lib/cn.js';

/**
 * Textarea — multiline text input for longer freeform content.
 *
 * Figma: `Textarea`, node 82:522, 4 variants.
 * Contract: docs/components/textarea.md · docs/state-decomposition.md
 *
 * The Figma `State` axis (Default · Focused · Error · Disabled) is NOT a prop.
 * `figma.map.json` marks it `kind: decompose` and it resolves to:
 *   - `Focused`  → `:focus-visible`, browser-owned, no prop
 *   - `Error`    → `invalid`  (independent boolean)
 *   - `Disabled` → `disabled` (independent boolean)
 *
 * Textarea shares Input's visual contract token-for-token, so the three build
 * blockers resolved for Input on 9 Aug 2026 apply here unchanged rather than
 * being re-decided. See docs/components/input.md §3.
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
  /** Announced to assistive tech. Required when `invalid` is true. */
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
}

/**
 * Container tokens, per docs/components/textarea.md Table 3 — identical to
 * Input's, transcribed from the same four Figma state rows.
 *
 * `py` is `space/2-25` (9px), a half-step ramp member, written as an explicit
 * calc against `--spacing` so it resolves identically in any Tailwind v4 setup
 * and never degrades to a raw pixel value.
 *
 * `resize-none` is deliberate. The record's description sets a product-level
 * sizing policy: *"Textarea intentionally uses a fixed editing viewport height.
 * Long input scrolls or expands according to the runtime textarea contract; do
 * not convert the Figma value region to automatic component height without a
 * product-level behavior change."* A user-draggable handle defeats that and can
 * break surrounding layout. Changing it is a product decision, not a style one.
 */
const BASE = [
  'block w-full resize-none',
  'rounded-lg border border-input bg-card',
  'px-3 py-[calc(var(--spacing)*2.25)]',
  'text-body-md text-foreground',
  'placeholder:text-muted-foreground',
  'transition-colors',
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
  },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const errorId = `${fieldId}-error`;
  const helperId = `${fieldId}-helper`;
  const countId = `${fieldId}-count`;

  const showError = invalid && Boolean(errorMessage);
  const showCount = typeof maxLength === 'number';

  // Helper text is NOT replaced by the error — a user usually needs both, per
  // the `textarea` archetype's donts.
  const describedBy =
    [helper ? helperId : null, showCount ? countId : null, showError ? errorId : null]
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
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className={cn(
          BASE,
          !disabled && FOCUS,
          // Error and Disabled are independent and may co-occur. The combined
          // visual (muted fill + destructive border) has no Figma variant —
          // inherited from Input decision 3, recorded in docs/components/textarea.md.
          invalid && 'border-destructive',
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
        <p id={errorId} role="alert" className="mt-1 text-caption-sm text-destructive">
          {errorMessage}
        </p>
      ) : null}
    </>
  );
});

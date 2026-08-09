import { useId, forwardRef } from 'react';
import type { ChangeEvent, FocusEvent, ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { MOTION } from '../lib/motion.js';

/**
 * Input — single-line text input primitive.
 *
 * Figma: `Input`, node 70:51, 4 variants.
 * Contract: docs/components/input.md · docs/state-decomposition.md
 *
 * The Figma `State` axis (Default · Focused · Error · Disabled) is NOT a prop.
 * It decomposes into:
 *   - `Focused`  → `:focus-visible`, browser-owned, no prop
 *   - `Error`    → `invalid`  (independent boolean)
 *   - `Disabled` → `disabled` (independent boolean)
 *
 * `invalid` and `disabled` co-occur at runtime; the Figma enum cannot express
 * that, which is why it must never be emitted as an enum.
 */
export interface InputProps {
  /** Current field value. Renders in `--foreground`. */
  value: string;
  /** Shown when `value` is empty. Renders in `--muted-foreground` (code-only state — no Figma variant). */
  placeholder?: string;
  /** Slot before the value. Pass a `@phosphor-icons/react` component. */
  leadingIcon?: ReactNode;
  /** Slot after the value. */
  trailingIcon?: ReactNode;
  /** Applies the error border. Independent of `disabled`. */
  invalid?: boolean;
  /** Announced to assistive tech. Required when `invalid` is true. */
  errorMessage?: string;
  /** Blocks input. Independent of `invalid`. */
  disabled?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  name?: string;
  /** Ties the field to its `<label>`. Auto-generated when omitted. */
  id?: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url';
  required?: boolean;
  /** Required only when no visible `<label>` exists. */
  'aria-label'?: string;
}

/**
 * Container tokens, per docs/components/input.md Table 3.
 *
 * `py` is `space/2-25` (9px) — a half-step ramp member, written as an explicit
 * calc against `--spacing` so it resolves identically in any Tailwind v4 setup
 * and never degrades to a raw pixel value.
 */
const BASE = [
  'flex w-full items-center gap-2',
  'rounded-lg border border-input bg-card',
  'px-3 py-[calc(var(--spacing)*2.25)]',
  'text-body-md text-foreground',
  MOTION.colors,
].join(' ');

/**
 * Focus is 1px `border-ring` + a 1px inset `ring-ring` — 2px of `ring` in total,
 * matching the Figma Focused variant's 2px stroke, but with zero layout shift.
 * A literal `border-2` would shrink the content box and nudge the text 1px on
 * focus. Same token, same visual weight, no jank.
 *
 * Keyed on `has-[:focus-visible]` because the ring belongs on the container while
 * focus lands on the inner `<input>`.
 *
 * Note for anyone extending this: for a **text input** `:focus-visible` matches on
 * mouse click too — browsers always match it where keyboard input is expected — so
 * `focus-within` would look identical here. `:focus-visible` is still the right
 * primitive, and the difference becomes real the moment this container holds a
 * button or another non-text control. Verified rendered in Storybook.
 *
 * Do not remove: this is the only focus affordance.
 */
const FOCUS = [
  'has-[:focus-visible]:border-ring',
  'has-[:focus-visible]:ring-1',
  'has-[:focus-visible]:ring-ring',
  'has-[:focus-visible]:ring-inset',
].join(' ');

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    value,
    placeholder,
    leadingIcon,
    trailingIcon,
    invalid = false,
    errorMessage,
    disabled = false,
    onChange,
    onFocus,
    onBlur,
    name,
    id,
    type = 'text',
    required = false,
    'aria-label': ariaLabel,
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;

  const showError = invalid && Boolean(errorMessage);

  return (
    <>
      <div
        data-invalid={invalid || undefined}
        data-disabled={disabled || undefined}
        className={cn(
          BASE,
          !disabled && FOCUS,
          // Error and Disabled are independent and may co-occur. The combined
          // visual (muted fill + destructive border) has no Figma variant —
          // decided here and recorded in docs/components/input.md Table 3.
          invalid && 'border-destructive',
          disabled && 'bg-muted text-muted-foreground cursor-not-allowed',
        )}
      >
        {leadingIcon ? (
          <span aria-hidden="true" className="shrink-0 text-muted-foreground">
            {leadingIcon}
          </span>
        ) : null}

        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-label={ariaLabel}
          aria-invalid={invalid || undefined}
          aria-describedby={showError ? errorId : undefined}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          className={cn(
            // The ring lives on the container, so the inner control must not
            // draw its own outline — that would double the focus affordance.
            'w-full min-w-0 bg-transparent outline-none',
            'placeholder:text-muted-foreground',
            'disabled:cursor-not-allowed',
          )}
        />

        {trailingIcon ? (
          <span className="shrink-0 text-muted-foreground">{trailingIcon}</span>
        ) : null}
      </div>

      {showError ? (
        <p
          id={errorId}
          // aria-live="polite", NOT role="alert". Aligned across every control on
          // 9 Aug 2026 to Field's recorded contract: the error "is announced
          // politely; it is not a role='alert' per keystroke." An assertive region
          // interrupts the user mid-keystroke on every validation pass.
          aria-live="polite"
          className="mt-1 text-caption-sm text-destructive"
        >
          {errorMessage}
        </p>
      ) : null}
    </>
  );
});

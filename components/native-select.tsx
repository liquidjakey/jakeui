import { useId, forwardRef } from 'react';
import type { ChangeEvent, FocusEvent } from 'react';
import { cn } from '../lib/cn.js';

/**
 * NativeSelect — native select control styled with Jake UI semantics.
 *
 * Figma: `Native Select`, node 70:355, 5 variants.
 * Contract: docs/components/native-select.md · docs/state-decomposition.md
 *
 * THIS IS THE NATIVE CONTROL ON PURPOSE. The platform's own option menu is used,
 * not a re-implemented listbox. That buys correct mobile behaviour, type-ahead
 * and screen-reader support for free — and it is why several things here are
 * deliberately neither stylable nor props.
 *
 * The Figma `State` axis (Default · Open · Error · Disabled · Focused) is NOT a
 * prop. `figma.map.json` marks it `kind: decompose` with three different fates in
 * one axis:
 *   - `Focused`  → `:focus-visible`, browser-owned, no prop
 *   - `Error`    → `invalid`  (independent boolean)
 *   - `Disabled` → `disabled` (independent boolean)
 *   - `Open`     → NOTHING. See below.
 *
 * `Open` is listed as `controlled` in the map, but it must not become a prop. A
 * native select's option menu is owned by the platform: it cannot be opened
 * programmatically, and its open state is neither observable nor stylable. The
 * Figma `Open` variant is a visual proxy for runtime state, and it binds tokens
 * *identical* to Focus (border 2px ring) — because a native select is always
 * focused while its menu is open, so the two are visually indistinguishable.
 *
 * The record's own governance rule licenses dropping it: visual State axes stay
 * QA/story states unless engineering explicitly approves a controlled runtime
 * prop. No such approval exists. If a controlled `open` is ever genuinely
 * required, this component is the wrong primitive and a custom listbox is needed.
 */
export interface NativeSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface NativeSelectProps {
  /** Currently selected option value. Renders in `--foreground`. */
  value: string;
  /** The option list. Code-only — Figma models the closed control only. */
  options: NativeSelectOption[];
  /** Rendered as a disabled, unselectable first option while `value` is empty. */
  placeholder?: string;
  /** Applies the error border. Independent of `disabled`. */
  invalid?: boolean;
  /** Announced to assistive tech. Required when `invalid` is true. */
  errorMessage?: string;
  /** Blocks selection. Independent of `invalid`. */
  disabled?: boolean;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onFocus?: (e: FocusEvent<HTMLSelectElement>) => void;
  onBlur?: (e: FocusEvent<HTMLSelectElement>) => void;
  name?: string;
  /** Ties the field to its `<label>`. Auto-generated when omitted. */
  id?: string;
  required?: boolean;
  /** Required only when no visible `<label>` exists. */
  'aria-label'?: string;
}

/**
 * Container tokens, per docs/components/native-select.md Table 3 — the same four
 * shared rows as Input, plus Open, which needs no code path.
 *
 * `py` is `space/2-25` (9px), a half-step ramp member, written as an explicit
 * calc against `--spacing` so it never degrades to a raw pixel value.
 *
 * NOTE: `appearance-none` is deliberately NOT set, so the platform draws its own
 * dropdown indicator. The props table records why: `tokensUsed` carries no icon
 * or chevron colour, so suppressing the native indicator would require inventing
 * a token that does not exist in the file. Keeping the platform chevron is also
 * what "native" means here. Border, background, colour, padding and font all
 * still apply to a select, so the token contract is unaffected.
 *
 * `pr-8` reserves room for that platform indicator.
 */
const BASE = [
  'block w-full',
  'rounded-lg border border-input bg-card',
  'pl-3 pr-8 py-[calc(var(--spacing)*2.25)]',
  'text-body-md text-foreground',
  'transition-colors',
].join(' ');

/**
 * Focus is 1px `border-ring` + a 1px inset `ring-ring` — 2px of `ring` in total,
 * matching both the Figma Focused AND Open variants, which bind the same tokens.
 * Zero layout shift; a literal `border-2` would shrink the content box.
 *
 * Keyed directly on `focus-visible:` rather than `has-[:focus-visible]` because
 * there is no wrapper — the focusable element and the bordered element are one.
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

export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(function NativeSelect(
  {
    value,
    options,
    placeholder,
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

  const showError = invalid && Boolean(errorMessage);
  const isPlaceholder = value === '' && Boolean(placeholder);

  return (
    <>
      <select
        ref={ref}
        id={fieldId}
        name={name}
        value={value}
        disabled={disabled}
        required={required}
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        aria-describedby={showError ? errorId : undefined}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className={cn(
          BASE,
          !disabled && FOCUS,
          // The placeholder row is the same code-only state Input has: Figma
          // binds every variant's value text to `foreground`, so this colour
          // cannot be reviewed in the design file.
          isPlaceholder && 'text-muted-foreground',
          // Error and Disabled are independent and may co-occur. The combined
          // visual has no Figma variant — inherited from Input decision 3.
          invalid && 'border-destructive',
          disabled && 'bg-muted text-muted-foreground cursor-not-allowed',
        )}
      >
        {placeholder ? (
          // Disabled so it cannot be re-selected once a real choice is made, and
          // never used as a substitute for a label.
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled}>
            {o.label}
          </option>
        ))}
      </select>

      {showError ? (
        <p id={errorId} role="alert" className="mt-1 text-caption-sm text-destructive">
          {errorMessage}
        </p>
      ) : null}
    </>
  );
});

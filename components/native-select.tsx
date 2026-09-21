import { useId, useRef, forwardRef } from "react";
import type { ChangeEvent, FocusEvent } from "react";
import { cn } from "../lib/cn.js";
import { MOTION } from "../lib/motion.js";
import { useMergeRefs } from "@floating-ui/react";
import { useControlledSelectReset } from "../lib/controlled-select.js";
import { CaretDown } from "@phosphor-icons/react";

/**
 * Controlled native select. The browser owns the popup; Jake UI owns the indicator.
 * Jake UI exposes value, invalid and disabled, but no controlled open prop.
 * Use DropdownMenu for commands, not as a replacement for a form choice.
 * Consumer contract: docs/agent/components/native-select.md.
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
  /** Standalone invalid controls need an error message. Inside Field, pass it to Field only. */
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
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling";
}

/**
 * Retain native selection behavior with a consistently inset decorative indicator.
 * Logical padding reserves the icon area in both LTR and RTL.
 */
const BASE = [
  "block min-w-0 w-full appearance-none truncate",
  "rounded-lg border border-input bg-card",
  "ps-3 pe-10 py-[calc(var(--spacing)*2.25)]",
  "text-body-md text-foreground",
  MOTION.colors,
].join(" ");

/**
 * Focus is 1px `border-ring` + a 1px inset `ring-ring` — 2px of `ring` in total,
 * matching both the Figma Focused AND Open variants, which bind the same tokens.
 * Zero layout shift; a literal `border-2` would shrink the content box.
 *
 * Focus styling stays on the native select, not its decorative wrapper.
 *
 * Do not remove: this is the only focus affordance.
 */
const FOCUS = [
  "focus-visible:border-ring",
  "focus-visible:ring-1",
  "focus-visible:ring-ring",
  "focus-visible:ring-inset",
  "focus-visible:outline-none",
].join(" ");

export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  function NativeSelect(
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
      "aria-label": ariaLabel,
      "aria-describedby": externalDescription,
      "aria-invalid": externalInvalid,
    },
    ref,
  ) {
    const selectRef = useRef<HTMLSelectElement>(null);
    const mergedRef = useMergeRefs([ref, selectRef]);
    useControlledSelectReset(selectRef, value);
    const autoId = useId();
    const fieldId = id ?? autoId;
    const errorId = `${fieldId}-error`;

    const isInvalid =
      invalid ||
      (externalInvalid !== undefined &&
        externalInvalid !== false &&
        externalInvalid !== "false");
    const isDisabled = disabled || options.length === 0;
    const showError = isInvalid && Boolean(errorMessage);
    const isPlaceholder = value === "" && Boolean(placeholder);

    return (
      <>
        <div className="relative min-w-0 w-full">
          <select
            ref={mergedRef}
            id={fieldId}
            name={name}
            value={value}
            disabled={isDisabled}
            required={required}
            aria-label={ariaLabel}
            aria-invalid={
              isInvalid
                ? externalInvalid === "grammar" ||
                  externalInvalid === "spelling"
                  ? externalInvalid
                  : true
                : undefined
            }
            aria-describedby={
              [externalDescription, showError ? errorId : null]
                .filter(Boolean)
                .join(" ") || undefined
            }
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            className={cn(
              BASE,
              !isDisabled && FOCUS,
              // The placeholder row is the same code-only state Input has: Figma
              // binds every variant's value text to `foreground`, so this colour
              // cannot be reviewed in the design file.
              isPlaceholder && "text-muted-foreground",
              // Error and disabled states are independent and may co-occur.
              isInvalid && "border-destructive",
              isDisabled && "bg-muted text-muted-foreground cursor-not-allowed",
            )}
          >
            {options.length === 0 ? (
              <option value="">No options available</option>
            ) : null}
            {placeholder && options.length > 0 ? (
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
          <CaretDown
            aria-hidden="true"
            data-select-indicator=""
            size={16}
            className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground forced-colors:text-[ButtonText]"
          />
        </div>

        {showError ? (
          <p
            id={errorId}
            // Polite feedback avoids interrupting typing on every validation pass.
            aria-live="polite"
            className="mt-1 text-caption-sm text-destructive-readable"
          >
            {errorMessage}
          </p>
        ) : null}
      </>
    );
  },
);

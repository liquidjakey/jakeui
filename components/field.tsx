import { useId } from "react";
import type { ReactNode } from "react";
import { Label } from "./label.js";

/**
 * Owns label/control IDs, descriptions, invalid and required wiring.
 * Spread the render-prop control object onto Input, Textarea, NativeSelect or Select.
 * Pass errorMessage to Field only; the child retains invalid styling and receives
 * the parent's description link. This avoids duplicate messages/live regions.
 * Consumer contract: docs/agent/components/field.md.
 */
export interface FieldControlProps {
  id: string;
  "aria-describedby": string | undefined;
  "aria-invalid": true | undefined;
  disabled: boolean;
  required: boolean;
  invalid: boolean;
}

export interface FieldProps {
  label: string;
  children: (control: FieldControlProps) => ReactNode;
  helperText?: string;
  errorMessage?: string;
  requirement?: "required" | "optional";
  /** Independent of `disabled`. */
  invalid?: boolean;
  /** Independent of `invalid`. */
  disabled?: boolean;
  id?: string;
}

export function Field({
  label,
  children,
  helperText,
  errorMessage,
  requirement,
  invalid = false,
  disabled = false,
  id,
}: FieldProps) {
  const autoId = useId();
  const controlId = id ?? autoId;
  const helperId = `${controlId}-helper`;
  const errorId = `${controlId}-error`;

  const showError = invalid && Boolean(errorMessage);

  // Keep helper and error descriptions linked together; users may need both.
  const describedBy =
    [helperText ? helperId : null, showError ? errorId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={controlId} requirement={requirement} disabled={disabled}>
        {label}
      </Label>

      {children({
        id: controlId,
        "aria-describedby": describedBy,
        "aria-invalid": invalid || undefined,
        disabled,
        required: requirement === "required",
        invalid,
      })}

      {helperText ? (
        <p id={helperId} className="text-caption-sm text-muted-foreground">
          {helperText}
        </p>
      ) : null}

      {/* Polite validation feedback; reserve one line to avoid layout shifts. */}
      <p
        id={errorId}
        aria-live="polite"
        // 1lh follows this element's type token. Keep the empty error slot reserved.
        className="min-h-[1lh] text-caption-sm text-destructive-readable"
      >
        {showError ? errorMessage : ""}
      </p>
    </div>
  );
}

import { useId } from 'react';
import type { ReactNode } from 'react';
import { Label } from './label.js';

/**
 * Field — composed form field with label, control, and helper or error message.
 *
 * Figma: `Field`, node 67:347, 4 variants.
 * Contract: docs/components/field.md
 *
 * This component OWNS THE WIRING. The record: "Generates the id and binds
 * label-for, aria-describedby, and aria-invalid onto the control it wraps."
 * That is its reason to exist — it is not a layout box with a label on top.
 *
 * THE CONFLICT, read before using this:
 * Input, Textarea and NativeSelect each render their own `errorMessage`. Field
 * renders one too. Used naively you get two messages and two live regions.
 * When a control is wrapped in Field, pass `errorMessage` to FIELD, not to the
 * control. The control still gets aria-invalid and aria-describedby through the
 * render prop, so its border still turns destructive — Field just owns the text.
 *
 * A render prop is used rather than cloneElement so the injected props are
 * visible and type-checked at the call site instead of being magic.
 */
export interface FieldControlProps {
  id: string;
  'aria-describedby': string | undefined;
  'aria-invalid': true | undefined;
  disabled: boolean;
}

export interface FieldProps {
  label: string;
  children: (control: FieldControlProps) => ReactNode;
  helperText?: string;
  errorMessage?: string;
  requirement?: 'required' | 'optional';
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

  // Helper first, then error. Both are linked, never one instead of the other —
  // the record's dont: "Do not replace helper text with the error, a user often
  // needs both."
  const describedBy =
    [helperText ? helperId : null, showError ? errorId : null].filter(Boolean).join(' ') ||
    undefined;

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={controlId} requirement={requirement} disabled={disabled}>
        {label}
      </Label>

      {children({
        id: controlId,
        'aria-describedby': describedBy,
        'aria-invalid': invalid || undefined,
        disabled,
      })}

      {helperText ? (
        <p id={helperId} className="text-caption-sm text-muted-foreground">
          {helperText}
        </p>
      ) : null}

      {/*
        Space for the error is reserved so validation does not shift the page.

        aria-live="polite", NOT role="alert". The record is explicit: the message
        "is announced politely; it is not a role='alert' per keystroke."

        Note this diverges from Input's inline error, which uses role="alert" (an
        assertive region). Both cannot be right. Field's record is the only one
        that states a contract, so Field follows it; moving the three shipped
        controls to polite is recorded in docs/components/field.md rather than
        done here, because it needs its own review.
      */}
      <p
        id={errorId}
        aria-live="polite"
        // min-h-[1lh] holds exactly one line of space at all times, including
        // when there is no error. That is the point: "Reserve space for the
        // error message so validation does not shift the layout." Do not add an
        // `empty:` rule to collapse it — that reintroduces the shift.
        //
        // `1lh` resolves against this element's own line-height, which comes
        // from the `text-caption-sm` token. A rem or px value would be a magic
        // number that drifts if the type scale changes.
        className="min-h-[1lh] text-caption-sm text-destructive"
      >
        {showError ? errorMessage : ''}
      </p>
    </div>
  );
}

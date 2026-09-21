import {
  forwardRef,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { FocusEvent, KeyboardEvent } from "react";
import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
  useMergeRefs,
} from "@floating-ui/react";
import { CaretDown, Check } from "@phosphor-icons/react";
import { useControlledSelectReset } from "../lib/controlled-select.js";
import { ThemedPortal } from "../lib/floating.js";
import { cn } from "../lib/cn.js";
import { MOTION } from "../lib/motion.js";

export interface SelectOption {
  /** Unique, nonempty form value. */
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  /** Controlled value; an empty string displays the placeholder. */
  value: string;
  /** Single-choice plain-text options. Search and multiple selection are not supported. */
  options: SelectOption[];
  /** Commits a value, not a DOM change event. Arrow navigation alone does not commit. */
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  /** Inside Field, pass errorMessage to Field only. */
  errorMessage?: string;
  /** Participates in native form submission through a hidden native select. */
  name?: string;
  /** Participates in native required validation; invalid submission focuses the trigger. */
  required?: boolean;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling";
  onFocus?: (event: FocusEvent<HTMLButtonElement>) => void;
  onBlur?: (event: FocusEvent<HTMLButtonElement>) => void;
}

/**
 * Select-only combobox. Focus stays on the trigger; the active option is exposed
 * through aria-activedescendant. The popup sits below the field with an 8px gap
 * and flips at viewport edges. Use NativeSelect for platform-owned pickers.
 */
export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  function Select(
    {
      value,
      options,
      onValueChange,
      placeholder = "Choose an option",
      disabled = false,
      invalid = false,
      errorMessage,
      name,
      required = false,
      id,
      "aria-label": ariaLabel,
      "aria-labelledby": labelledBy,
      "aria-describedby": describedBy,
      "aria-invalid": ariaInvalid,
      onFocus,
      onBlur,
    },
    forwardedRef,
  ) {
    const autoId = useId();
    const controlId = id ?? autoId;
    const listId = `${controlId}-listbox`;
    const errorId = `${controlId}-error`;
    const triggerRef = useRef<HTMLButtonElement>(null);
    const formSelectRef = useRef<HTMLSelectElement>(null);
    const search = useRef({ text: "", time: 0 });
    const [requestedOpen, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [requiredError, setRequiredError] = useState(false);
    useControlledSelectReset(formSelectRef, value, () => {
      setRequiredError(false);
      setOpen(false);
    });
    const selectedIndex = options.findIndex((option) => option.value === value);
    const enabled = options
      .map((option, index) => (option.disabled ? -1 : index))
      .filter((index) => index >= 0);
    const unavailable = disabled || enabled.length === 0;
    const open = requestedOpen && !unavailable;
    const active = enabled.includes(activeIndex)
      ? activeIndex
      : (enabled[0] ?? -1);
    const nativeInvalid = requiredError && required && !value;
    const isInvalid =
      invalid ||
      nativeInvalid ||
      (ariaInvalid !== undefined &&
        ariaInvalid !== false &&
        ariaInvalid !== "false");
    const message = isInvalid
      ? errorMessage || (nativeInvalid ? "Choose an option." : undefined)
      : undefined;

    const floating = useFloating({
      open,
      placement: "bottom-start",
      strategy: "fixed",
      whileElementsMounted: autoUpdate,
      middleware: [
        offset(8),
        flip({ padding: 8 }),
        shift({ padding: 8 }),
        size({
          padding: 8,
          apply({ rects, availableWidth, availableHeight, elements }) {
            Object.assign(elements.floating.style, {
              width: `${Math.min(rects.reference.width, availableWidth)}px`,
              maxHeight: `min(${Math.max(0, availableHeight)}px, calc(var(--spacing) * 64))`,
            });
          },
        }),
      ],
    });
    const ref = useMergeRefs([
      triggerRef,
      forwardedRef,
      floating.refs.setReference,
    ]);

    useEffect(() => {
      if (unavailable) setOpen(false);
    }, [unavailable]);
    useEffect(() => {
      if (value) setRequiredError(false);
    }, [value]);
    useLayoutEffect(() => {
      if (open)
        document
          .getElementById(`${listId}-${active}`)
          ?.scrollIntoView({ block: "nearest" });
    }, [open, active, listId]);
    useEffect(() => {
      if (!open) return;
      const closeOutside = (event: PointerEvent) => {
        const path = event.composedPath();
        if (
          !path.includes(triggerRef.current!) &&
          !path.includes(floating.refs.floating.current!)
        )
          setOpen(false);
      };
      document.addEventListener("pointerdown", closeOutside, true);
      return () =>
        document.removeEventListener("pointerdown", closeOutside, true);
    }, [open, floating.refs.floating]);

    function show(index = selectedIndex) {
      if (unavailable) return;
      search.current = { text: "", time: 0 };
      setActiveIndex(enabled.includes(index) ? index : (enabled[0] ?? -1));
      setOpen(true);
    }
    function commit(index = active) {
      const option = options[index];
      if (option && !option.disabled && option.value !== value)
        onValueChange(option.value);
      setOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
      if (event.ctrlKey || event.metaKey || unavailable) return;
      const { key } = event;
      if (key === "Tab") {
        if (open) commit();
        return;
      }
      if (key === "Escape") {
        if (open) {
          event.preventDefault();
          event.stopPropagation();
          setOpen(false);
        }
        return;
      }
      if (
        key === "Enter" ||
        (key === " " &&
          (!search.current.text || Date.now() - search.current.time > 700))
      ) {
        event.preventDefault();
        if (open) commit();
        else show();
        return;
      }
      if (
        ["ArrowDown", "ArrowUp", "Home", "End", "PageDown", "PageUp"].includes(
          key,
        )
      ) {
        event.preventDefault();
        if (open && event.altKey && key === "ArrowUp") {
          commit();
          return;
        }
        const step =
          key === "PageDown"
            ? 10
            : key === "PageUp"
              ? -10
              : key === "ArrowUp"
                ? -1
                : 1;
        const position = enabled.indexOf(active);
        const next =
          key === "Home"
            ? enabled[0]
            : key === "End"
              ? enabled.at(-1)
              : open
                ? enabled[
                    Math.max(0, Math.min(enabled.length - 1, position + step))
                  ]
                : enabled.includes(selectedIndex)
                  ? selectedIndex
                  : enabled[0];
        if (!open) show(next);
        else setActiveIndex(next ?? -1);
        return;
      }
      if (key.length === 1 && !event.altKey) {
        event.preventDefault();
        const now = Date.now();
        const text =
          (now - search.current.time < 700 ? search.current.text : "") +
          key.toLocaleLowerCase();
        const repeated = [...text].every((letter) => letter === text[0]);
        const query = repeated ? (text[0] ?? key) : text;
        const start = open ? active : selectedIndex;
        const candidates = repeated
          ? [
              ...enabled.filter((index) => index > start),
              ...enabled.filter((index) => index <= start),
            ]
          : enabled;
        const match = candidates.find((index) =>
          options[index]?.label.toLocaleLowerCase().startsWith(query),
        );
        if (!open) show(match);
        else if (match !== undefined) setActiveIndex(match);
        search.current = { text, time: now };
      }
    }

    return (
      <div className="min-w-0">
        <select
          ref={formSelectRef}
          aria-hidden="true"
          tabIndex={-1}
          className="sr-only pointer-events-none"
          name={name}
          value={value}
          required={required}
          disabled={unavailable}
          onChange={(event) => onValueChange(event.target.value)}
          onInvalid={(event) => {
            event.preventDefault();
            setRequiredError(true);
            triggerRef.current?.focus();
          }}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <button
          ref={ref}
          id={controlId}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-activedescendant={
            open && active >= 0 ? `${listId}-${active}` : undefined
          }
          aria-label={ariaLabel}
          aria-labelledby={labelledBy}
          aria-describedby={
            [describedBy, message ? errorId : undefined]
              .filter(Boolean)
              .join(" ") || undefined
          }
          aria-invalid={isInvalid || undefined}
          aria-required={required || undefined}
          disabled={unavailable}
          onFocus={onFocus}
          onBlur={(event) => {
            if (open) commit();
            onBlur?.(event);
          }}
          onClick={() => {
            if (open) setOpen(false);
            else show();
          }}
          onKeyDown={handleKeyDown}
          className={cn(
            "flex min-h-10 w-full min-w-0 items-center gap-3 rounded-lg border border-input bg-card px-3 py-2 text-start text-body-md text-foreground",
            "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring",
            MOTION.colors,
            open && "border-ring ring-1 ring-inset ring-ring",
            isInvalid && "border-destructive",
            unavailable
              ? "cursor-not-allowed bg-muted text-muted-foreground"
              : "hover:bg-accent/30",
          )}
        >
          <span
            className={cn(
              "min-w-0 flex-1 truncate",
              selectedIndex < 0 && "text-muted-foreground",
            )}
          >
            {options.length === 0
              ? "No options available"
              : (options[selectedIndex]?.label ?? placeholder)}
          </span>
          <CaretDown
            size={16}
            aria-hidden="true"
            className={cn(
              "shrink-0 text-muted-foreground",
              MOTION.transform,
              open && "rotate-180",
            )}
          />
        </button>
        {message ? (
          <p
            id={errorId}
            aria-live="polite"
            className="mt-1 text-caption-sm text-destructive-readable"
          >
            {message}
          </p>
        ) : null}
        {open ? (
          <ThemedPortal reference={floating.elements.domReference}>
            <div
              ref={floating.refs.setFloating}
              style={floating.floatingStyles}
              data-select-popup=""
              data-placement={floating.placement}
              className="z-50 overflow-y-auto overscroll-contain rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md"
              id={listId}
              role="listbox"
              aria-label={ariaLabel}
              aria-labelledby={
                labelledBy || (!ariaLabel ? controlId : undefined)
              }
              onMouseDown={(event) => event.preventDefault()}
            >
              {options.map((option, index) => (
                <div
                  id={`${listId}-${index}`}
                  key={option.value}
                  role="option"
                  aria-selected={index === active}
                  aria-disabled={option.disabled || undefined}
                  onPointerMove={() => {
                    if (!option.disabled) setActiveIndex(index);
                  }}
                  onClick={() => {
                    if (!option.disabled) commit(index);
                  }}
                  className={cn(
                    "flex min-h-10 cursor-default items-center gap-3 rounded-md px-3 py-2 text-body-md",
                    option.disabled
                      ? "text-muted-foreground opacity-50"
                      : index === active &&
                          "bg-accent text-accent-foreground forced-colors:outline forced-colors:outline-2 forced-colors:-outline-offset-2",
                  )}
                >
                  <span className="min-w-0 flex-1 break-words">
                    {option.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className="flex size-4 shrink-0 items-center justify-center"
                  >
                    {option.value === value ? <Check size={16} /> : null}
                  </span>
                </div>
              ))}
            </div>
          </ThemedPortal>
        ) : null}
      </div>
    );
  },
);

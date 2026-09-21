import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn.js";
import { MOTION } from "../lib/motion.js";

/**
 * Action button forwarding native attributes and ref. style selects a variant;
 * size uses small/medium. Defaults to type=button to avoid accidental form submits.
 * Consumer contract: docs/agent/components/button.md.
 */
export interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "style" | "onClick"
> {
  children: ReactNode;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  style?: "primary" | "secondary" | "outline" | "ghost";
  size?: "small" | "medium";
  /** Decorative icon slot. Direct SVGs render at 16px in small and 20px in medium buttons. */
  leadingIcon?: ReactNode;
  disabled?: boolean;
  /** Defaults to "button": an untyped <button> inside a form submits it. */
  type?: "button" | "submit" | "reset";
}

// Each size owns its spacing and semantic label style, including font weight.
const SIZE = {
  small: "gap-2 px-3 py-[calc(var(--spacing)*1.25)] text-label-md",
  medium: "gap-2 px-4 py-2 text-label-lg",
} as const;

const STYLE = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
  secondary: "bg-secondary text-secondary-foreground hover:bg-accent-hover",
  // Border space is reserved in every state to prevent layout shifts.
  outline: "border border-border text-foreground hover:bg-accent-hover",
  ghost: "text-foreground hover:bg-accent-hover",
} as const;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      children,
      onClick,
      style = "primary",
      size = "medium",
      leadingIcon,
      disabled = false,
      type = "button",
      className,
      ...props
    },
    ref,
  ) {
    return (
      <button
        {...props}
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          "inline-flex items-center justify-center rounded-lg border border-transparent",
          MOTION.colors,
          SIZE[size],
          // Focus keeps the resting fill and adds a stroke/2 ring, consistently across
          // all four styles. Implemented as a ring rather than a border so there is no
          // layout shift — same reasoning as Input's focus treatment.
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          disabled
            ? "cursor-not-allowed border-transparent bg-muted text-muted-foreground"
            : STYLE[style],
          className,
        )}
      >
        {leadingIcon ? (
          <span
            aria-hidden="true"
            className={cn(
              "flex shrink-0 items-center justify-center [&>svg]:size-full",
              size === "small" ? "size-4" : "size-5",
            )}
          >
            {leadingIcon}
          </span>
        ) : null}
        {children}
      </button>
    );
  },
);

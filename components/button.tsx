import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { MOTION } from '../lib/motion.js';

/**
 * Button — action button.
 *
 * Figma: `Button`, node 76:147, 32 variants.
 * Contract: docs/components/button.md
 *
 * THE LONGEST-BLOCKED COMPONENT. 32 variants against 8 description rows, with the
 * missing 24 covering outline and ghost entirely — nothing could be inferred. It was
 * resolved by reading the LIVE BINDINGS through the Desktop Bridge; the data is in
 * .figma-blocked-variants.json.
 *
 * THAT READ ALSO SHOWED THE DESCRIPTION FORMAT LOSES INFORMATION. Live bindings carry
 * spacing and stroke-weight tokens no ANATOMY block emits — space/1-5, space/2,
 * space/3, space/4, space/2-25, stroke/1, stroke/2. Every "no spacing token is
 * recorded" flag written earlier in this build was wrong about the CAUSE: the tokens
 * exist and are bound; the description just does not carry them.
 *
 * primary-hover and accent-hover also appear here and in NO doc record anywhere.
 */
export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  style?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium';
  leadingIcon?: ReactNode;
  disabled?: boolean;
  /** Defaults to "button": an untyped <button> inside a form submits it. */
  type?: 'button' | 'submit' | 'reset';
}

// Padding and gap are REAL TOKENS, read from the live bindings. space/1-5 and
// space/2-25 are half-step ramp members, written as explicit calcs so they can never
// degrade to a raw pixel value — the same treatment Input gives space/2-25.
/**
 * ✅ THE LABEL IS NOW BOUND IN FIGMA (10 Aug 2026). It was unbound on both sizes
 * at 13/20 Medium and 14/22 Medium, neither line-height in the ramp, so the size
 * and weight matched but the leading ran 2px looser in the file than here. The
 * ramp question was decided Option B — keep the ramp, bind the nodes to it — and
 * both labels now carry `Label/MD` 13/18 and `Label/LG` 14/20, which is exactly
 * what this code already used. The divergence is gone and nothing here changed.
 *
 * The semantic label styles are used rather than Body/* + font-medium, which is
 * what this was: the weight was right by override, not by binding.
 */
const SIZE = {
  small: 'gap-2 px-3 py-[calc(var(--spacing)*1.5)] text-label-md',
  medium: 'gap-2 px-4 py-[calc(var(--spacing)*2.25)] text-label-lg',
} as const;

const STYLE = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary-hover',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-accent-hover',
  // stroke/1 border at rest; note DISABLED DROPS IT (see the disabled branch below),
  // so a disabled outline button is indistinguishable from a disabled ghost one.
  // Transcribed as bound.
  outline: 'border border-border text-foreground hover:bg-accent-hover',
  ghost: 'text-foreground hover:bg-accent-hover',
} as const;

export function Button({
  children,
  onClick,
  style = 'primary',
  size = 'medium',
  leadingIcon,
  disabled = false,
  type = 'button',
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        // font-medium removed: the Label/* styles carry weight 500 themselves.
        'inline-flex items-center justify-center rounded-lg',
        MOTION.colors,
        SIZE[size],
        // Focus keeps the resting fill and adds a stroke/2 ring, consistently across
        // all four styles. Implemented as a ring rather than a border so there is no
        // layout shift — same reasoning as Input's focus treatment.
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        disabled
          ? 'cursor-not-allowed border-transparent bg-muted text-muted-foreground'
          : STYLE[style],
      )}
    >
      {leadingIcon ? (
        <span aria-hidden="true" className="shrink-0">
          {leadingIcon}
        </span>
      ) : null}
      {children}
    </button>
  );
}

import { forwardRef, useId } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import {
  FloatingArrow,
  FloatingFocusManager,
  FloatingOverlay,
  useClick,
  useDismiss,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import { FloatingTrigger, ThemedPortal, useAnchoredSurface } from '../lib/floating.js';
import { cn } from '../lib/cn.js';
import { MOTION } from '../lib/motion.js';
import { PopoverArrow } from './popover-arrow.js';

export type PopoverSide = 'top' | 'right' | 'bottom' | 'left';

export interface PopoverBackdropProps {
  open: boolean;
  mode?: 'modal' | 'trapFocus';
  onClick?: () => void;
}
/** Visual scrim only. Popover owns actual modality and focus containment. */
export function PopoverBackdrop({ open, mode = 'modal', onClick }: PopoverBackdropProps) {
  return open ? (
    <div
      aria-hidden="true"
      onClick={mode === 'modal' ? onClick : undefined}
      className="fixed inset-0 z-40 bg-scrim"
    />
  ) : null;
}

export interface PopoverCloseProps {
  onClose: () => void;
  label?: string;
  disabled?: boolean;
  icon?: ReactNode;
}
export function PopoverClose({
  onClose,
  label = 'Close',
  disabled = false,
  icon,
}: PopoverCloseProps) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClose}
      className={cn(
        'inline-flex size-7 items-center justify-center rounded-[calc(var(--radius-7))] bg-popover text-body-md hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        MOTION.colors,
        disabled && 'cursor-not-allowed text-muted-foreground',
      )}
    >
      <span aria-hidden="true">{icon ?? '×'}</span>
    </button>
  );
}

export interface PopoverViewportProps {
  children: ReactNode;
  previous?: ReactNode;
  direction?: PopoverSide;
}
export function PopoverViewport({
  children,
  previous,
  direction = 'bottom',
}: PopoverViewportProps) {
  return (
    <div
      data-activation-direction={direction}
      className="relative overflow-hidden rounded-lg border border-border bg-popover text-body-xs text-popover-foreground"
    >
      {previous ? (
        <div
          aria-hidden="true"
          ref={(node) => {
            if (node) node.inert = true;
          }}
          data-previous
          className="pointer-events-none invisible absolute inset-0"
        >
          {previous}
        </div>
      ) : null}
      <div>{children}</div>
    </div>
  );
}

export interface PopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: ReactNode;
  title?: string;
  description?: string;
  children?: ReactNode;
  size?: 'small' | 'large';
  arrow?: boolean;
  side?: PopoverSide;
  modal?: boolean;
}
export function Popover({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  size = 'small',
  arrow = false,
  side = 'bottom',
  modal = false,
}: PopoverProps) {
  const id = useId();
  const floating = useAnchoredSurface(open, onOpenChange, side);
  const click = useClick(floating.context);
  const dismiss = useDismiss(floating.context, { bubbles: false });
  const role = useRole(floating.context, { role: 'dialog' });
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);
  return (
    <>
      <FloatingTrigger floating={floating} getReferenceProps={getReferenceProps}>
        {trigger}
      </FloatingTrigger>
      {open ? (
        <ThemedPortal reference={floating.elements.domReference}>
          {modal ? <FloatingOverlay lockScroll className="z-40 bg-scrim" /> : null}
          <FloatingFocusManager
            context={floating.context}
            modal={modal}
            initialFocus={modal ? 0 : -1}
            returnFocus
            restoreFocus
            outsideElementsInert={modal}
          >
            <div
              ref={floating.refs.setFloating}
              style={floating.floatingStyles}
              {...getFloatingProps({
                'aria-labelledby': title ? id : undefined,
                'aria-label': title ? undefined : 'Popover',
                'aria-describedby': description ? `${id}-description` : undefined,
                'aria-modal': modal || undefined,
              })}
              className={cn(
                'z-50 rounded-lg border border-border bg-popover text-body-md text-popover-foreground shadow-md',
                size === 'large'
                  ? 'w-[min(28rem,calc(100vw-1rem))]'
                  : 'w-[min(18rem,calc(100vw-1rem))]',
              )}
            >
              {arrow ? (
                <FloatingArrow
                  ref={floating.arrowRef}
                  context={floating.context}
                  width={12}
                  height={6}
                  fill="var(--popover)"
                  stroke="var(--border)"
                  strokeWidth={1}
                />
              ) : null}
              <div className="overflow-y-auto p-4" style={{ maxHeight: 'inherit' }}>
                {title ? (
                  <h3 id={id} className="text-heading-xs text-popover-foreground">
                    {title}
                  </h3>
                ) : null}
                {description ? (
                  <p id={`${id}-description`} className="mt-1 text-body-xs text-muted-foreground">
                    {description}
                  </p>
                ) : null}
                {children ? <div className="mt-2">{children}</div> : null}
              </div>
            </div>
          </FloatingFocusManager>
        </ThemedPortal>
      ) : null}
    </>
  );
}

export interface PopoverTriggerProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onChange'
> {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean;
  controls?: string;
}
export const PopoverTrigger = forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  function PopoverTrigger(
    { children, open, onOpenChange, disabled = false, controls, className, onClick, ...props },
    ref,
  ) {
    return (
      <button
        {...props}
        ref={ref}
        type="button"
        aria-expanded={open}
        aria-controls={props['aria-controls'] ?? (open ? controls : undefined)}
        disabled={disabled}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented && !('data-jakeui-trigger' in props)) onOpenChange(!open);
        }}
        className={cn(
          'rounded-lg px-3 py-2 text-body-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-accent',
          open ? 'bg-accent text-accent-foreground' : 'text-foreground',
          disabled && 'cursor-not-allowed text-muted-foreground',
          className,
        )}
      >
        {children}
      </button>
    );
  },
);

export interface PopoverContentProps {
  title?: string;
  description?: string;
  children?: ReactNode;
  action?: ReactNode;
  onClose?: () => void;
  size?: 'small' | 'large';
  side?: PopoverSide;
  align?: 'start' | 'center' | 'end';
  arrow?: boolean;
}
/** Unanchored presentation surface. Use Popover for placement, dismissal and focus. */
export function PopoverContent({
  title,
  description,
  children,
  action,
  onClose,
  size = 'small',
  side = 'bottom',
  align = 'start',
  arrow = false,
}: PopoverContentProps) {
  return (
    <div
      data-side={side}
      data-align={align}
      className={cn(
        'relative max-w-full rounded-lg border border-border bg-popover p-4 text-body-md text-popover-foreground shadow-md',
        size === 'large' ? 'w-[min(28rem,90vw)]' : 'w-[min(18rem,90vw)]',
      )}
    >
      {arrow ? <PopoverArrow side={side} /> : null}
      {onClose ? (
        <span className="absolute right-2 top-2">
          <PopoverClose onClose={onClose} />
        </span>
      ) : null}
      {title ? <h3 className={cn('text-heading-xs', onClose && 'pr-8')}>{title}</h3> : null}
      {description ? (
        <p className="mt-1 text-body-sm text-muted-foreground">{description}</p>
      ) : null}
      {children ? <div className="mt-2 text-muted-foreground">{children}</div> : null}
      {action ? <div className="mt-3 text-primary-readable">{action}</div> : null}
    </div>
  );
}

import { useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import {
  FloatingFocusManager,
  safePolygon,
  useDismiss,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import { FloatingTrigger, ThemedPortal, useAnchoredSurface } from '../lib/floating.js';

export interface HoverCardProps {
  title: string;
  description?: string;
  children: ReactElement;
  meta?: ReactNode;
  density?: 'compact' | 'detailed';
  openDelay?: number;
  closeDelay?: number;
}

export function HoverCard({
  title,
  description,
  children,
  meta,
  density = 'compact',
  openDelay = 500,
  closeDelay = 200,
}: HoverCardProps) {
  const [open, setOpen] = useState(false);
  const floating = useAnchoredSurface(open, setOpen);
  const hover = useHover(floating.context, {
    delay: { open: openDelay, close: closeDelay },
    handleClose: safePolygon(),
  });
  const focus = useFocus(floating.context);
  const dismiss = useDismiss(floating.context);
  const role = useRole(floating.context, { role: 'dialog' });
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role]);
  return (
    <>
      <FloatingTrigger floating={floating} getReferenceProps={getReferenceProps}>
        {children}
      </FloatingTrigger>
      {open ? (
        <ThemedPortal reference={floating.elements.domReference}>
          <FloatingFocusManager context={floating.context} modal={false} initialFocus={-1}>
            <div
              ref={floating.refs.setFloating}
              style={floating.floatingStyles}
              {...getFloatingProps({ 'aria-label': title })}
              className="z-50 w-64 overflow-y-auto rounded-lg border border-border bg-popover p-4 text-body-sm text-popover-foreground shadow-md"
            >
              <p className="font-semibold">{title}</p>
              {description ? (
                <p className="mt-1 text-body-sm text-muted-foreground">{description}</p>
              ) : null}
              {meta && density === 'detailed' ? (
                <div className="mt-2 text-label-sm text-popover-foreground">{meta}</div>
              ) : null}
            </div>
          </FloatingFocusManager>
        </ThemedPortal>
      ) : null}
    </>
  );
}

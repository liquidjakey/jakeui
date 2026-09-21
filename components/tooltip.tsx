import { useState } from 'react';
import type { ReactElement } from 'react';
import {
  safePolygon,
  useDismiss,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import { FloatingTrigger, ThemedPortal, useAnchoredSurface } from '../lib/floating.js';
import { cn } from '../lib/cn.js';

export interface TooltipProps {
  label: string;
  children: ReactElement;
  side?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export function Tooltip({ label, children, side = 'top', delay = 400 }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const floating = useAnchoredSurface(open, setOpen, side);
  const hover = useHover(floating.context, {
    delay: { open: delay, close: 150 },
    handleClose: safePolygon(),
  });
  const focus = useFocus(floating.context);
  const dismiss = useDismiss(floating.context);
  const role = useRole(floating.context, { role: 'tooltip' });
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role]);
  return (
    <>
      <FloatingTrigger floating={floating} getReferenceProps={getReferenceProps}>
        {children}
      </FloatingTrigger>
      {open ? (
        <ThemedPortal reference={floating.elements.domReference}>
          <div
            ref={floating.refs.setFloating}
            style={floating.floatingStyles}
            {...getFloatingProps()}
            className={cn(
              'z-50 w-max max-w-[min(24rem,calc(100vw-1rem))] overflow-y-auto break-words rounded-lg bg-foreground px-3 py-2.5 text-label-sm text-card',
            )}
          >
            {label}
          </div>
        </ThemedPortal>
      ) : null}
    </>
  );
}

import { useId } from 'react';
import type { ReactNode } from 'react';
import { ModalSurface } from './modal-surface.js';

/**
 * Modal edge-aligned surface for a secondary task. Shares ModalSurface with
 * Sheet; placement selects a viewport edge. Use a layout region for a persistent,
 * nonblocking panel.
 * Consumer contract: docs/agent/components/drawer.md.
 */
export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  /** Figma axis `Placement`. Opening edge. */
  placement?: 'left' | 'right';
  /** Existing overlay width preset; geometry is scoped in agent/exceptions.json. */
  width?: 'compact' | 'wide';
}

/** Existing width presets are scoped by agent/exceptions.json. */
const WIDTH = { compact: 'w-[min(20rem,90vw)]', wide: 'w-[min(32rem,90vw)]' } as const;

export function Drawer({
  open,
  onClose,
  title,
  description,
  children,
  placement = 'right',
  width = 'compact',
}: DrawerProps) {
  const id = useId();
  const titleId = `${id}-title`;
  const descId = `${id}-desc`;

  return (
    <ModalSurface
      open={open}
      onClose={onClose}
      labelledBy={titleId}
      describedBy={description ? descId : undefined}
      layout={placement}
      className={WIDTH[width]}
    >
      <div className="flex flex-col gap-1">
        {/* Heading/LG (18/26) in the file, not Heading/MD (16/24). The style is
            already semibold, so font-semibold is redundant. */}
        <h2 id={titleId} className="text-heading-lg text-foreground">
          {title}
        </h2>
        {description ? (
          <p id={descId} className="text-body-md text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {children ? (
        <div className="flex-1 overflow-y-auto text-body-md text-foreground">{children}</div>
      ) : null}
    </ModalSurface>
  );
}

import { useId } from 'react';
import type { ReactNode } from 'react';
import { ModalSurface } from './modal-surface.js';

/**
 * Modal edge-attached surface sharing ModalSurface with Drawer. side selects
 * a viewport edge. Use an application layout region for persistent nonblocking content.
 * Consumer contract: docs/agent/components/sheet.md.
 */
export interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  /** Viewport edge to attach to; this surface is not anchored to a trigger. */
  side?: 'left' | 'right';
  /** Existing overlay width preset; geometry is scoped in agent/exceptions.json. */
  width?: 'compact' | 'wide';
}

const WIDTH = { compact: 'w-[min(20rem,90vw)]', wide: 'w-[min(32rem,90vw)]' } as const;

export function Sheet({
  open,
  onClose,
  title,
  description,
  children,
  side = 'right',
  width = 'compact',
}: SheetProps) {
  const id = useId();
  const titleId = `${id}-title`;
  const descId = `${id}-desc`;

  return (
    <ModalSurface
      open={open}
      onClose={onClose}
      labelledBy={titleId}
      describedBy={description ? descId : undefined}
      layout={side}
      className={WIDTH[width]}
    >
      <div className="flex flex-col gap-1">
        {/* Heading/LG (18/26) in the file, not Heading/MD (16/24). */}
        <h2 id={titleId} className="text-heading-lg text-foreground">
          {title}
        </h2>
        {description ? (
          <p id={descId} className="text-body-sm text-muted-foreground">
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

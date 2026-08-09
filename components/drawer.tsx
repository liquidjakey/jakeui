import { useId } from 'react';
import type { ReactNode } from 'react';
import { ModalSurface } from './modal-surface.js';

/**
 * Drawer — edge-aligned overlay panel for filters and supplemental controls.
 *
 * Figma: `Drawer`, node 106:*, 4 variants.
 * Contract: docs/components/drawer.md
 *
 * ⚠️ DRAWER AND SHEET ARE INDISTINGUISHABLE IN THE DESIGN FILE. Identical tokens,
 * identical state rows, identical variants, identical props, identical a11y. The
 * only difference is that this component's placement axis is called `Placement`
 * and Sheet's is called `Side` — same two values. The distinction exists only as
 * prose ("Sheet for persistent side tasks; Drawer for transient filtering").
 *
 * Both were built as specified rather than merged, because collapsing them is a
 * design decision, not an implementation one. They share ModalSurface so they
 * cannot drift further apart. Full comparison in docs/components/drawer.md.
 */
export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  /** Figma axis `Placement`. Opening edge. */
  placement?: 'left' | 'right';
  /** Figma axis `Width`. NO token backing — see the props table. */
  width?: 'compact' | 'wide';
}

/** No width or container tokens exist in the file. Raw, and flagged as such. */
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
        <h2 id={titleId} className="text-heading-md font-semibold text-foreground">
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

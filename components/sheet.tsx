import { useId } from 'react';
import type { ReactNode } from 'react';
import { ModalSurface } from './modal-surface.js';

/**
 * Sheet — edge-attached overlay for secondary workflows.
 *
 * Figma: `Sheet`, node 111:*, 4 variants.
 * Contract: docs/components/sheet.md
 *
 * ⚠️ See the duplication warning in drawer.tsx: Sheet and Drawer are identical in
 * every recorded respect except the name of the placement axis (`Side` here,
 * `Placement` there). They share ModalSurface deliberately.
 *
 * Note also: the description calls this the "persistent" side surface, but it is
 * still a modal <dialog> and still traps focus. If a genuinely persistent,
 * non-blocking panel is wanted, this is the wrong component — that is a layout
 * region, not an overlay.
 */
export interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  /**
   * Figma axis `Side`. Attaching edge.
   *
   * The shared `side` vocabulary in archetypes.json reads "opens to the left/right
   * OF THE TRIGGER", written for anchored surfaces like Popover. A Sheet has no
   * trigger anchor — it attaches to the VIEWPORT edge. The generic vocabulary is
   * wrong here; this component's own description is the accurate source.
   */
  side?: 'left' | 'right';
  /** Figma axis `Width`. NO token backing — see the props table. */
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

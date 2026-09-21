import { useId } from 'react';
import type { ReactNode } from 'react';
import { ModalSurface } from './modal-surface.js';

/**
 * Modal surface for focused tasks, with platform focus containment, Escape and
 * focus return supplied by ModalSurface. Compose content and actions through slots.
 * Consumer contract: docs/agent/components/dialog.md.
 */
export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  /** Content classification exposed as data-type; both types use Heading/LG. */
  type?: 'standard' | 'form';
  /** Selects the content width; see the scoped overlay geometry exception. */
  size?: 'small' | 'large';
}

/** Widths are scoped by agent/exceptions.json (overlay geometry). */
const WIDTH = { small: 'w-[min(28rem,92vw)]', large: 'w-[min(44rem,92vw)]' } as const;

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  type = 'standard',
  size = 'small',
}: DialogProps) {
  const id = useId();
  const titleId = `${id}-title`;
  const descId = `${id}-desc`;

  return (
    <ModalSurface
      open={open}
      onClose={onClose}
      labelledBy={titleId}
      describedBy={description ? descId : undefined}
      className={WIDTH[size]}
    >
      {/* Classification is observable without changing title typography. */}
      <div data-type={type} className="flex flex-col gap-1">
        <h2
          id={titleId}
          className="text-heading-lg text-foreground"
        >
          {title}
        </h2>
        {/* Description uses Body/MD independently of the content classification. */}
        {description ? (
          <p id={descId} className="text-body-md text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>

      {children ? <div className="text-body-md text-foreground">{children}</div> : null}
      {footer ? <div className="flex justify-end gap-2">{footer}</div> : null}
    </ModalSurface>
  );
}

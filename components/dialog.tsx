import { useId } from 'react';
import type { ReactNode } from 'react';
import { ModalSurface } from './modal-surface.js';
import { cn } from '../lib/cn.js';

/**
 * Dialog — general-purpose modal surface for focused tasks and forms.
 *
 * Figma: `Dialog`, node 105:*, 4 variants.
 * Contract: docs/components/dialog.md
 *
 * Built on the native <dialog> via ModalSurface, which supplies the focus trap,
 * Escape and focus return. See docs/components/dialog.md Table 4.
 *
 * `children` and `footer` are SLOTS, not typed content props. The record is
 * explicit: "only the component properties defined on this set are configurable
 * public inputs. Other embedded copy is illustrative composition content and must
 * not be generated as a public code prop until engineering API review." A slot
 * passes composition through without inventing an API for it.
 */
export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  /** Figma axis `Type`. Changes the title type size. */
  type?: 'standard' | 'form';
  /** Figma axis `Size`. Content width — NO token backing, see the props table. */
  size?: 'small' | 'large';
}

/**
 * `Size` controls "available content width" per the record, but there are NO
 * width or container tokens anywhere in the file — every size/* variable is a
 * type size. These two values are therefore raw, and flagged as such in
 * docs/components/dialog.md Table 3. Figma owes width tokens.
 */
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
      <div className="flex flex-col gap-1">
        <h2
          id={titleId}
          className={cn(
            'text-foreground font-semibold',
            // Transcribed: Standard binds size/18, Form binds size/13.
            type === 'form' ? 'text-body-sm' : 'text-heading-md',
          )}
        >
          {title}
        </h2>
        {description ? (
          <p id={descId} className="text-body-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>

      {children ? <div className="text-body-md text-foreground">{children}</div> : null}
      {footer ? <div className="flex justify-end gap-2">{footer}</div> : null}
    </ModalSurface>
  );
}

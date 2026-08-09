import { useId } from 'react';
import type { ReactNode } from 'react';
import { ModalSurface } from './modal-surface.js';

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
      {/*
        `type` no longer drives a title size (see the h2 below), but it stays in
        the API because it is a real Figma axis and callers compose different
        content under it. Surfaced as a data attribute so it remains observable
        in tests and in the DOM rather than becoming a silently ignored prop.
      */}
      <div data-type={type} className="flex flex-col gap-1">
        <h2
          id={titleId}
          // Read from the live bindings: BOTH Standard and Form bind Heading/LG
          // (18/26). The record said "Standard binds size/18, Form binds
          // size/13", which was wrong on both branches — Standard was rendering
          // 16/24 and Form 13/18. `type` therefore carries NO title-size delta;
          // it is kept because it is a real Figma axis and drives content shape.
          className="text-heading-lg text-foreground"
        >
          {title}
        </h2>
        {/* Description binds Body/MD (14/20) in the file, not Body/SM (13/18). */}
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

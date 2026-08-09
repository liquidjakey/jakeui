import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { MOTION } from '../lib/motion.js';

/**
 * Card — content container for related information and actions.
 *
 * Figma: `Card`, node 126:*, 4 variants.
 * Contract: docs/components/card.md
 *
 * ✅ THE `info-foreground` CONFLICT IS RESOLVED. Card.doc.json bound the card's
 * text to `info-foreground`, which on a `card` fill is roughly 1:1 contrast and
 * would have been invisible in both modes. This file therefore overrode it with
 * `card-foreground` and recorded that Figma owed a rebind.
 *
 * Re-read from the live bindings on 9 Aug 2026: the Title node binds `foreground`.
 * The record was stale, and the override was reaching the right answer for the
 * right reason — `foreground` and `card-foreground` resolve identically in both
 * modes (neutral/950 light, neutral/50 dark). It now binds what the file binds.
 *
 * ⚠️ CARD'S TEXT IS UNBOUND IN FIGMA. None of its four text nodes carries a text
 * style, and their metrics are off-ramp:
 *
 *   Title        16 / 22 Semi Bold   nearest ramp Heading/MD 16/24
 *   Description  14 / 21 Regular     nearest ramp Body/MD    14/20
 *   Label        13 / 20 Medium      nearest ramp Label/MD   13/18
 *   Initials     14 / 18 Semi Bold   nearest ramp Heading/XS 14/20
 *
 * The ramp steps are used here so the card stays on the type system. The Figma
 * nodes need the styles applied — until then this is the one place the code
 * cannot be literally identical to the file without inventing line-heights.
 *
 * The previous title size was `text-body-xs` (12px) with a note transcribing
 * "size/11" from the record. The file says 16px. That was the record being wrong
 * by a full four steps of the scale, and it is the largest single visual error
 * found in this audit.
 */
export interface CardProps {
  title: string;
  description?: string;
  children?: ReactNode;
  /** Leading media. Its PRESENCE is what makes this a media card — Figma's `Type` axis. */
  media?: ReactNode;
  /** When set the whole card is a link. Its presence is Figma's `State=Interactive`. */
  href?: string;
}

export function Card({ title, description, children, media, href }: CardProps) {
  const interactive = Boolean(href);

  const content = (
    <>
      {media ? <div className="overflow-hidden rounded-lg">{media}</div> : null}
      {/* Header copy gap is `space/0-5` (2px) in the file. */}
      <div className="flex flex-col gap-0.5">
        <h3 className="text-heading-md text-foreground">{title}</h3>
        {description ? <p className="text-body-md text-muted-foreground">{description}</p> : null}
      </div>
      {children ? <div className="text-body-md text-foreground">{children}</div> : null}
    </>
  );

  const className = cn(
    // padding `space/5` (20px) and gap `space/4` (16px), read from the file.
    // Previously p-4 / gap-3, which was 16 / 12.
    'flex flex-col gap-4 rounded-lg bg-card p-5',
    // Transcribed: Interactive binds `2px primary`. Flagged in the props table —
    // this is the same treatment Input uses for FOCUS, so an interactive card
    // looks focused at rest and nothing is left free for real focus.
    interactive ? 'border-2 border-primary' : 'border border-border',
    // Asserted, not transcribed: no focus token is recorded on this set. Uses the
    // `ring` treatment shared with every other interactive component here.
    interactive && 'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
    MOTION.colors,
  );

  if (href) {
    return (
      <a href={href} className={className}>
        {content}
      </a>
    );
  }
  return <div className={className}>{content}</div>;
}

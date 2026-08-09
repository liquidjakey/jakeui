import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';

/**
 * Card — content container for related information and actions.
 *
 * Figma: `Card`, node 126:*, 4 variants.
 * Contract: docs/components/card.md
 *
 * 🛑 THIS COMPONENT DELIBERATELY DOES NOT MATCH ITS RECORD.
 *
 * Card.doc.json binds the card's text to `info-foreground`. That is a defect in
 * the Figma file. Verified in .figma-tokens-dump.json:
 *
 *   card             Light white/100    Dark neutral/900
 *   info-foreground  Light neutral/50   Dark neutral/950   <- INVERTED
 *   card-foreground  Light neutral/950  Dark neutral/50
 *
 * `info-foreground` is the light-on-dark pairing, correct for text on the SOLID
 * `info` fill — which is how Badge uses it, legitimately. On a `card` fill it is
 * near-white text on a white card in Light and near-black on near-black in Dark.
 * Contrast is roughly 1:1. The text would be invisible in both modes.
 *
 * So this binds `card-foreground`. Transcribing faithfully would ship a visible
 * bug rather than a documentation inaccuracy. Figma owes a rebind; until then
 * docs:adopt will keep re-importing the wrong token.
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
      <div className="flex flex-col gap-1">
        {/*
          card-foreground, NOT the record's info-foreground. See the block above.
          size/11 IS transcribed faithfully — it is the smallest size in the scale
          and questionable for a card title, but it is legible, not broken.
        */}
        <h3 className="text-body-xs font-semibold text-card-foreground">{title}</h3>
        {description ? <p className="text-body-xs text-muted-foreground">{description}</p> : null}
      </div>
      {children ? <div className="text-body-xs text-card-foreground">{children}</div> : null}
    </>
  );

  const className = cn(
    'flex flex-col gap-3 rounded-lg bg-card p-4',
    // Transcribed: Interactive binds `2px primary`. Flagged in the props table —
    // this is the same treatment Input uses for FOCUS, so an interactive card
    // looks focused at rest and nothing is left free for real focus.
    interactive ? 'border-2 border-primary' : 'border border-border',
    // Asserted, not transcribed: no focus token is recorded on this set. Uses the
    // `ring` treatment shared with every other interactive component here.
    interactive && 'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
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

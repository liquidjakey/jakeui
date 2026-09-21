import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { MOTION } from '../lib/motion.js';

/**
 * Content container. href makes the entire card a link; keep nested interactive
 * content outside that link, or use a static card with explicit actions.
 * Consumer contract: docs/agent/components/card.md.
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
    'flex flex-col gap-4 rounded-lg bg-card p-5',
    // A primary border identifies the link at rest; keyboard focus adds a ring.
    interactive ? 'border-2 border-primary' : 'border border-border',
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

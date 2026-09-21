import { useState } from 'react';
import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  CalendarBlank,
  Envelope,
  File,
  Info,
  Link as LinkIcon,
  List,
  PlusCircle,
  Question,
  UploadSimple,
  X,
} from '@phosphor-icons/react';

import { Alert } from './alert.js';
import { Avatar } from './avatar.js';
import { Badge } from './badge.js';
import { Button } from './button.js';
import { Field } from './field.js';
import { Separator } from './separator.js';
import { Textarea } from './textarea.js';
import { cn } from '../lib/cn.js';
import { MOTION } from '../lib/motion.js';

/**
 * Experimental message-editor screen study, not a canonical consumer recipe.
 * ToolbarTile is an application-specific prototype, not a Jake UI export.
 * Toolbar/save actions are illustrative and require product behavior.
 */

const MESSAGE =
  'Save 25% on a double pocket chambray shirt. Regular price $44.95, reduced to $33.71. Click to shop: {{short_link}}';

/**
 * Prototype icon-over-label tile. This custom interactive primitive is not
 * approved for reuse as a design-system component.
 */
function ToolbarTile({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        // gap `space/1-5` (6px), py `space/2-5` (10px), px `space/1` (4px)
        'flex flex-col items-center justify-center gap-1.5 rounded-lg px-1 py-2.5',
        'text-label-xs text-foreground hover:bg-accent-hover',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        MOTION.colors,
      )}
    >
      <span aria-hidden="true">{icon}</span>
      {label}
    </button>
  );
}

/** Attachment / merge-token row. The remove control is a real button with a name. */
function AttachmentRow({
  icon,
  name,
  meta,
  onRemove,
}: {
  icon: ReactNode;
  name: string;
  meta: string;
  onRemove: () => void;
}) {
  return (
    <li className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2">
      <span aria-hidden="true" className="shrink-0 text-muted-foreground">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-body-sm text-foreground">{name}</span>
        <span className="block text-caption-sm text-muted-foreground">{meta}</span>
      </span>
      <Button style="ghost" size="small" leadingIcon={<X size={14} />} onClick={onRemove}>
        Remove
      </Button>
    </li>
  );
}

function TextMessageEditor() {
  const [value, setValue] = useState(MESSAGE);
  const [link, setLink] = useState<string | null>('ae.com');
  const [image, setImage] = useState<string | null>('promo-take-20.jpg');

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Header — title and status only. Actions live in the footer. */}
      <header className="flex items-center justify-between gap-4 border-b border-border bg-card px-6 py-4">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-heading-lg text-foreground">Text message editor</h1>
          <p className="text-caption-sm text-muted-foreground">
            American Eagle Outfitters · Draft
          </p>
        </div>
        <Badge tone="info" size="medium">
          MMS
        </Badge>
      </header>

      {/* Body */}
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-8 lg:flex-row lg:gap-10">
        {/* Composer */}
        <section aria-labelledby="composer-heading" className="flex min-w-0 flex-1 flex-col gap-4">
          <h2 id="composer-heading" className="text-heading-md text-foreground">
            Message
          </h2>

          <Field
            label="Message body"
            helperText="Merge tokens in {{braces}} are replaced for each recipient when the message sends."
            id="sms-body"
          >
            {(control) => (
              <Textarea
                {...control}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                rows={7}
                maxLength={1000}
                placeholder="Write the message your subscribers will receive…"
              />
            )}
          </Field>

          {/* Prototype toolbar: Coupon uses PlusCircle; no coupon icon is mapped. */}
          <div
            role="group"
            aria-label="Add to message"
            className="grid grid-cols-7 gap-0.5 rounded-lg border border-border bg-card p-1"
          >
            <ToolbarTile icon={<UploadSimple size={20} />} label="Media" />
            <ToolbarTile icon={<LinkIcon size={20} />} label="Link" />
            <ToolbarTile icon={<List size={20} />} label="Personalise" />
            <ToolbarTile icon={<CalendarBlank size={20} />} label="Schedule" />
            <ToolbarTile icon={<PlusCircle size={20} />} label="Coupon" />
            <ToolbarTile icon={<Envelope size={20} />} label="Rich card" />
            <ToolbarTile icon={<Question size={20} />} label="Survey" />
          </div>

          {/* Attachments */}
          {link || image ? (
            <div className="flex flex-col gap-2">
              <h3 className="text-label-xs text-muted-foreground uppercase">In this message</h3>
              <ul className="flex flex-col gap-2">
                {link ? (
                  <AttachmentRow
                    icon={<LinkIcon size={16} />}
                    name={link}
                    meta="Shortened at send · counts as 23 characters"
                    onRemove={() => setLink(null)}
                  />
                ) : null}
                {image ? (
                  <AttachmentRow
                    icon={<File size={16} />}
                    name={image}
                    meta="JPG · 412 KB · sends as MMS"
                    onRemove={() => setImage(null)}
                  />
                ) : null}
              </ul>
            </div>
          ) : null}
        </section>

        {/* Preview */}
        <section
          aria-labelledby="preview-heading"
          className="flex w-full shrink-0 flex-col gap-4 lg:w-80"
        >
          <h2 id="preview-heading" className="text-heading-md text-foreground">
            Preview
          </h2>

          {/* Device frame — muted bezel, card screen, both from tokens. */}
          <div className="rounded-32 border border-border bg-muted p-3 shadow-sm">
            <div className="flex flex-col gap-3 rounded-24 bg-card p-3">
              <div className="flex flex-col items-center gap-2 pt-1">
                <Avatar initials="AE" name="American Eagle Outfitters" size="small" decorative />
                <p className="text-label-md text-foreground">American Eagle Outfitters</p>
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <div className="max-w-[85%] rounded-2xl bg-secondary px-3 py-2">
                  <p className="text-body-sm text-secondary-foreground">
                    American Eagle Outfitters: Save 25% on a double pocket chambray shirt. Regular
                    price $44.95, reduced to $33.71. Click to shop:{' '}
                    <span className="text-primary-readable underline">shorturl.at/cJMST</span>
                  </p>
                </div>

                {image ? (
                  <div className="flex h-40 max-w-[85%] flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-muted">
                    <File size={20} className="text-muted-foreground" aria-hidden="true" />
                    <p className="text-caption-sm text-muted-foreground">{image}</p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Was a floating toast over the phone. It is standing billing information. */}
          <Alert
            tone="info"
            icon={<Info size={14} weight="fill" />}
            title="Sending as MMS"
            description="An attached image sends as MMS: 5 message credits per recipient."
          />
        </section>
      </main>

      {/* Footer — every terminal action, in one group, weighted. */}
      <footer className="sticky bottom-0 border-t border-border bg-card px-6 py-4">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-end gap-2">
          <Button style="ghost">Cancel</Button>
          <Button style="secondary">Save as template</Button>
          <Button style="primary">Save</Button>
        </div>
      </footer>
    </div>
  );
}

const meta = {
  title: 'Screens/Text Message Editor',
  component: TextMessageEditor,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A full screen assembled only from Jake UI components and tokens. Useful as a check on ' +
          'the system: it is where Button, Textarea, Field, Alert, Badge, Avatar and Separator ' +
          'have to sit next to each other and agree on density.',
      },
    },
  },
} satisfies Meta<typeof TextMessageEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The screen. Switch Theme in the toolbar to check dark — every token has a dark mode. */
export const Default: Story = {};

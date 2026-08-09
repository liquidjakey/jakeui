import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './card.js';

/**
 * Stories for `Card`.
 * Contract: docs/components/card.md
 *
 * 🛑 **Card is the one component whose code deliberately does not match its
 * record.** `Card.doc.json` binds text to `info-foreground`, which is inverted
 * relative to `card-foreground` — near-white on a white card in Light, near-black
 * on near-black in Dark, roughly 1:1 contrast either way. The code binds
 * `card-foreground` instead. Switch the toolbar Theme to "Side by side": the text
 * is readable in both, which it would not be if the record had been followed.
 */

const meta = {
  title: 'Content/Card',
  component: Card,
  parameters: {
    docs: {
      description: {
        component:
          'Content container. `Type=Media` became a `media` slot and `State=Interactive` became ' +
          '`href`, because neither is a mode a caller selects — a card is a media card once it has ' +
          'media, and interactive once it has a destination.',
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Content card, non-interactive. */
export const Default: Story = {
  args: { title: 'Card' },
  render: () => (
    <div className="max-w-sm">
      <Card title="Appointment summary" description="Tuesday 14 August, 10:30.">
        <p>Body content is a slot.</p>
      </Card>
    </div>
  ),
};

/**
 * Interactive — driven by `href`, not by a `state` prop.
 *
 * ⚠️ Note the border: `2px primary`, which is the same treatment `Input` uses for
 * **focus**. An interactive card therefore looks focused at rest, and nothing is
 * left free for real focus. Transcribed as recorded, but flagged in the props table.
 */
export const Interactive: Story = {
  args: { title: 'Card' },
  render: () => (
    <div className="flex max-w-sm flex-col gap-3">
      <Card title="Not interactive" description="1px border token." />
      <Card title="Interactive" description="2px primary — same as Input's focus ring." href="#" />
    </div>
  ),
};

/** With a media slot. Passing `media` is what makes it a media card. */
export const WithMedia: Story = {
  args: { title: 'Card' },
  render: () => (
    <div className="max-w-sm">
      <Card
        title="Scan result"
        description="Uploaded 9 August."
        media={<div aria-hidden="true" className="h-24 w-full bg-muted" />}
      />
    </div>
  ),
};

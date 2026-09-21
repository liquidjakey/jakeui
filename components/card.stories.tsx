import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './card.js';

/**
 * Static, media and whole-card-link previews. Keep nested actions outside links.
 * Consumer contract: docs/agent/components/card.md.
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

/** Interactive cards use href, not a visual state prop. Check the resting primary border and keyboard focus in both themes. */
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

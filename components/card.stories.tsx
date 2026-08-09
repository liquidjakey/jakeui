import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './card.js';
import { Accordion } from './accordion.js';
import { Collapsible } from './collapsible.js';
import { Breadcrumb } from './breadcrumb.js';

/**
 * Stories for `Card`, `Accordion`, `Collapsible` and `Breadcrumb`.
 * Contracts: docs/components/card.md · accordion.md · collapsible.md · breadcrumb.md
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

/**
 * Accordion — several sections may be open at once, which is why `openIds` is an
 * array rather than a single id. The Figma `State` enum cannot express that.
 */
export const AccordionDemo: Story = {
  name: 'Accordion',
  args: { title: 'n/a' },
  render: () => <AccordionExample />,
};

function AccordionExample() {
  const [openIds, setOpenIds] = useState<string[]>(['a']);
  return (
    <div className="max-w-md">
      <Accordion
        openIds={openIds}
        onToggle={(id) =>
          setOpenIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
        }
        items={[
          { id: 'a', title: 'What is included?', content: <p>Everything in the plan.</p> },
          { id: 'b', title: 'How do I cancel?', content: <p>From the settings page.</p> },
          { id: 'c', title: 'Unavailable section', content: <p>Never shown.</p>, disabled: true },
        ]}
      />
    </div>
  );
}

/**
 * Collapsible — token-identical to Accordion, but one boolean instead of an array.
 *
 * That is the whole difference, and it is invisible to the design file: Figma
 * models a single disclosure item, which is what a Collapsible is, while an
 * Accordion is a group of the same item.
 */
export const CollapsibleDemo: Story = {
  name: 'Collapsible',
  args: { title: 'n/a' },
  render: () => <CollapsibleExample />,
};

function CollapsibleExample() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex max-w-md flex-col gap-3">
      <Collapsible triggerLabel="Advanced options" open={open} onOpenChange={setOpen}>
        <p>Secondary settings live here.</p>
      </Collapsible>
      <Collapsible triggerLabel="Unavailable" open={false} onOpenChange={() => {}} disabled>
        <p>Never shown.</p>
      </Collapsible>
    </div>
  );
}

/**
 * Breadcrumb. Figma models a fixed three-level trail; code takes an array, because
 * real trails are 2, 4 or 6 deep.
 *
 * ⚠️ The current page renders in `foreground` — **asserted, not transcribed.** The
 * record binds everything to `muted-foreground`, which would make the current page
 * indistinguishable from its ancestors.
 */
export const BreadcrumbDemo: Story = {
  name: 'Breadcrumb',
  args: { title: 'n/a' },
  render: () => (
    <div className="flex flex-col gap-4">
      <Breadcrumb
        items={[
          { label: 'Home', href: '#' },
          { label: 'Patients', href: '#' },
          { label: 'Ada Lovelace' },
        ]}
      />
      <Breadcrumb
        collapsed
        items={[
          { label: 'Home', href: '#' },
          { label: 'Clinics', href: '#' },
          { label: 'Seoul', href: '#' },
          { label: 'Patients', href: '#' },
          { label: 'Ada Lovelace' },
        ]}
      />
    </div>
  ),
};

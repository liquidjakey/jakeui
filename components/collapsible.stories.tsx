import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Collapsible } from './collapsible.js';

/**
 * Single controlled disclosure. Closed content unmounts; trigger colours transition.
 * Consumer contract: docs/agent/components/collapsible.md.
 */

const meta = {
  title: 'Content/Collapsible',
  component: Collapsible,
  parameters: {
    docs: {
      description: {
        component:
          'Token-identical to Accordion, but one boolean instead of an array. That is the ' +
          'whole difference, and it is invisible to the design file: Figma models a single ' +
          'disclosure item, which is what a Collapsible is, while an Accordion is a group of them.',
      },
    },
  },
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Collapsible — token-identical to Accordion, but one boolean instead of an array.
 *
 * That is the whole difference, and it is invisible to the design file: Figma
 * models a single disclosure item, which is what a Collapsible is, while an
 * Accordion is a group of the same item.
 */
export const CollapsibleDemo: Story = {
  name: 'Collapsible',
  args: { triggerLabel: 'Advanced options', children: null, open: false, onOpenChange: () => {} },
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

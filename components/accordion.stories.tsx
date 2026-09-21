import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion } from './accordion.js';

/**
 * Multiple controlled disclosure sections. Closed panels unmount with no height
 * animation. Current panel typography follows the implementation.
 * Consumer contract: docs/agent/components/accordion.md.
 */

const meta = {
  title: 'Content/Accordion',
  component: Accordion,
  parameters: {
    docs: {
      description: {
        component:
          'Several sections may be open at once, which is why `openIds` is an array rather ' +
          'than a single id. The Figma `State` enum cannot express that, which is the one ' +
          'place this component and the file genuinely model different things.',
      },
    },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Accordion — several sections may be open at once, which is why `openIds` is an
 * array rather than a single id. The Figma `State` enum cannot express that.
 */
export const AccordionDemo: Story = {
  name: 'Accordion',
  args: { items: [], openIds: [], onToggle: () => {} },
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

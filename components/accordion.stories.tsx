import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion } from './accordion.js';

/**
 * Stories for `Accordion`.
 * Contract: docs/components/accordion.md
 *
 * ⚠️ Its Content node is **unbound in Figma** at 13/20 Regular; `Body/SM` 13/18 is
 * used instead. Part of the ramp question in the Figma-side decision memo.
 *
 * The open/close transition is deliberately absent — the panel unmounts when closed
 * to satisfy a recorded accessibility contract, and a transition cannot animate an
 * element that does not exist. `MOTION.disclosure` ships unused for this reason; see
 * the write-up in `accordion.tsx` and `lib/motion.ts` for the `calc-size()` route out.
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

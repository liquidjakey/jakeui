import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Slider } from './slider.js';

/**
 * Stories for `Slider` — a component whose token contract existed **only on child
 * nodes**, and which was built from live bindings.
 *
 * `Slider`, `Skeleton` and `Popover / Arrow` each had a description that could only
 * ever read **"no root-level bindings"**, because the generator reads the root and
 * every token here lives on a child (Track, Range, Thumb).
 *
 * ✅ `Slider` turned out to have the **most complete contract of anything read** —
 * every state distinguishable, which several root-level records are not.
 */

const meta = {
  title: 'Controls/Slider',
  component: Slider,
  parameters: {
    docs: {
      description: {
        component:
          'Built on a native <input type="range"> under the visuals, so arrows, PageUp/Down and ' +
          'Home/End all work without being re-implemented — the same "prefer the platform" ' +
          'reasoning as NativeSelect and the dialog family.',
      },
    },
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Track `muted`, range `primary`, thumb `card` with a `primary` stroke. */
export const Default: Story = {
  args: { value: 40, onValueChange: () => {}, label: 'Slider' },
  render: () => <SliderDemo />,
};

function SliderDemo() {
  const [a, setA] = useState(40);
  const [b, setB] = useState(70);
  return (
    <div className="flex max-w-sm flex-col gap-6">
      <Slider label="Zoom" value={a} onValueChange={setA} />
      <Slider label="Volume" value={b} onValueChange={setB} step={5} />
      <Slider label="Locked" value={25} onValueChange={() => {}} disabled />
      <p className="text-caption-sm text-muted-foreground">
        Tab to a slider and use the arrow keys. Disabled swaps the range and thumb stroke to
        `muted-foreground` — a real, recorded distinction, unlike Switch and Radio.
      </p>
    </div>
  );
}

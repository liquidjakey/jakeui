import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Slider } from './slider.js';
import { Skeleton } from './skeleton.js';
import { DatePicker } from './date-picker.js';

/**
 * Stories for `Slider`, `Skeleton` and `DatePicker` — three components whose token
 * contracts existed **only on child nodes or beyond the description cap**, and which
 * were built from live bindings.
 *
 * `Slider`, `Skeleton` and `Popover / Arrow` each had a description that could only
 * ever read **"no root-level bindings"**, because the generator reads the root and
 * every token here lives on a child (Track, Range, Thumb; the placeholder shapes).
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

/**
 * `Skeleton` — every shape in every variant binds `muted`. The four types differ only
 * in which shapes exist.
 *
 * The shapes are `aria-hidden`; the loading state is announced **once** by the
 * wrapper. Announcing each placeholder would be noise.
 */
export const Skeletons: Story = {
  name: 'Skeleton — four types',
  args: { value: 0, onValueChange: () => {}, label: 'n/a' },
  render: () => (
    <div className="grid max-w-2xl grid-cols-2 gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-label-xs text-muted-foreground">text</span>
        <Skeleton type="text" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-label-xs text-muted-foreground">avatar</span>
        <Skeleton type="avatar" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-label-xs text-muted-foreground">card</span>
        <Skeleton type="card" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-label-xs text-muted-foreground">tableRow</span>
        <Skeleton type="tableRow" />
      </div>
    </div>
  ),
};

/**
 * `DatePicker`. Its live read is what settled **Calendar's day states** — the ones
 * Calendar's own record names in prose and binds nowhere.
 *
 * Four of five asserted states were correct. The exception: **`today` is a `primary`
 * stroke, not the ring outline that had been asserted** — `calendar.tsx` was
 * corrected on the strength of this read. Open the picker and look at today's date.
 *
 * ⚠️ The archetype asks that a date be *typeable* as well as pickable. This asset
 * records only a button trigger, so typing is not implemented — a real gap against
 * the archetype, recorded rather than invented.
 */
export const DatePickers: Story = {
  name: 'DatePicker — field states',
  args: { value: 0, onValueChange: () => {}, label: 'n/a' },
  render: () => <DateDemo />,
};

function DateDemo() {
  const [d, setD] = useState<Date | undefined>(new Date(2026, 7, 14));
  return (
    <div className="flex max-w-sm flex-col gap-6">
      <DatePicker label="Appointment date" value={d} onChange={setD} />
      <DatePicker
        label="Required date"
        value={undefined}
        onChange={() => {}}
        invalid
        errorMessage="Choose a date."
      />
      <DatePicker label="Locked" value={d} onChange={() => {}} disabled />
      <p className="text-caption-sm text-muted-foreground">
        ⚠️ The trailing icon binds `foreground` even when disabled, so it stays full-strength
        while the value beside it goes muted. Transcribed as bound.
      </p>
    </div>
  );
}

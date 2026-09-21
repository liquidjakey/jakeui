import { useState } from 'react';
import { Button } from './button.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Popover, PopoverClose } from './popover.js';
import { Input } from './input.js';
import { Field } from './field.js';

/**
 * Stories for `Popover`.
 * Contracts: docs/agent/components/popover.md · popover-backdrop.md · popover-close.md
 *
 * **These stories are `Popover / Root Composition`** — that asset's `Pattern` axis
 * is `kind: story-only` ("Storybook story, never a prop"), so its four patterns
 * (Basic, Align, Form, RTL) ship here rather than as a component.
 *
 * Placement flips and shifts at viewport edges while preserving the scoped theme.
 */

const TriggerButton = Button;

const meta = {
  title: 'Overlays/Popover',
  component: Popover,
  parameters: {
    docs: {
      description: {
        component:
          'The popover family uses the correct surface pairing (`popover` fill with ' +
          '`popover-foreground` text) — worth noting against Dialog, which binds plain `foreground` ' +
          'on a `card` fill, and Card, whose text token is outright wrong.',
      },
    },
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Nonmodal popover: focus is not trapped. */
export const Basic: Story = {
  args: { open: false, onOpenChange: () => {}, trigger: null },
  render: () => <BasicDemo />,
};

function BasicDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-16">
      <Popover
        open={open}
        onOpenChange={setOpen}
        trigger={<TriggerButton>Open popover</TriggerButton>}
        title="Appointment"
        description="Tuesday 14 August, 10:30."
        arrow
      >
        <PopoverClose onClose={() => setOpen(false)} />
      </Popover>
    </div>
  );
}

/** Pattern = Align. All four sides. */
export const Sides: Story = {
  name: 'Pattern = Align (four sides)',
  args: { open: false, onOpenChange: () => {}, trigger: null },
  render: () => <SidesDemo />,
};

function SidesDemo() {
  const [side, setSide] = useState<'top' | 'right' | 'bottom' | 'left' | null>(null);
  return (
    <div className="flex flex-wrap gap-4 p-4 sm:p-24">
      {(['top', 'right', 'bottom', 'left'] as const).map((s) => (
        <Popover
          key={s}
          open={side === s}
          onOpenChange={(o) => setSide(o ? s : null)}
          side={s}
          arrow
          trigger={<TriggerButton>{s}</TriggerButton>}
          title={`Side = ${s}`}
        />
      ))}
    </div>
  );
}

/** Modal form popover: focus is contained and the scrim stays dark in both themes. Modality is behavior, not decoration. */
export const FormPopover: Story = {
  name: 'Pattern = Form (modal, traps focus)',
  args: { open: false, onOpenChange: () => {}, trigger: null },
  render: () => <FormDemo />,
};

function FormDemo() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  return (
    <div className="p-16">
      <Popover
        open={open}
        onOpenChange={setOpen}
        modal
        size="large"
        trigger={<TriggerButton>Edit name…</TriggerButton>}
        title="Edit patient name"
      >
        <Field label="Full name" helperText="As it appears on the record.">
          {(c) => <Input {...c} value={value} onChange={(e) => setValue(e.target.value)} />}
        </Field>
      </Popover>
    </div>
  );
}

/** Pattern = RTL. */
export const Rtl: Story = {
  name: 'Pattern = RTL',
  args: { open: false, onOpenChange: () => {}, trigger: null },
  render: () => <RtlDemo />,
};

function RtlDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div dir="rtl" className="p-16">
      <Popover
        open={open}
        onOpenChange={setOpen}
        trigger={<TriggerButton>افتح</TriggerButton>}
        title="الموعد"
        description="الثلاثاء ١٤ أغسطس"
        arrow
      />
    </div>
  );
}

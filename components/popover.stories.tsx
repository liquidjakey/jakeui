import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Popover, PopoverClose } from './popover.js';
import { Input } from './input.js';
import { Field } from './field.js';

/**
 * Stories for `Popover`.
 * Contracts: docs/components/popover.md · popover-backdrop.md · popover-close.md
 *
 * **These stories are `Popover / Root Composition`** — that asset's `Pattern` axis
 * is `kind: story-only` ("Storybook story, never a prop"), so its four patterns
 * (Basic, Align, Form, RTL) ship here rather than as a component.
 *
 * ⚠️ **Placement is not collision-aware.** These place on the requested side and
 * stay there. Flipping near a viewport edge needs a positioning library, which is
 * out of scope for a token-level component — recorded rather than half-built.
 */

function TriggerButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="rounded-lg border border-input bg-card px-3 py-2 text-body-sm text-foreground"
    >
      {children}
    </button>
  );
}

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

/** Pattern = Basic. Non-modal: focus is NOT trapped, per the record. */
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
    <div className="flex gap-4 p-24">
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

/**
 * Pattern = Form. **This one is modal**, so focus IS trapped and a backdrop appears.
 *
 * The record draws the line precisely: *"A popover holding a form should trap focus;
 * a non-modal one should not."* That is what the `modal` prop is — a behaviour
 * choice, not decoration.
 *
 * ⚠️ Look at the backdrop in **dark mode**. It binds `foreground`, which inverts —
 * near-black in Light, near-**white** in Dark. It is the only scrim token in the
 * system and it is the wrong kind of token.
 */
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

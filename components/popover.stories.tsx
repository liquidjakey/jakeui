import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Popover, PopoverClose, PopoverViewport } from './popover.js';
import { Tooltip } from './tooltip.js';
import { HoverCard } from './hover-card.js';
import { Input } from './input.js';
import { Field } from './field.js';

/**
 * Stories for the anchored-overlay family.
 * Contracts: docs/components/popover.md · popover-backdrop.md · popover-close.md ·
 * popover-viewport.md · tooltip.md · hover-card.md
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

/**
 * `PopoverViewport` — the component whose vocabulary was the **last unresolved doc
 * block in the system**.
 *
 * `direction` is an *activation* direction (`data-activation-direction`), not
 * anchored placement — that distinction is exactly why it was left owed rather than
 * guessed: the `side` axis already owns top/right/bottom/left for placement. Reading
 * this asset's own description settled it.
 *
 * Note `State` did **not** become an enum: current and previous both render at once
 * during a transition, and an enum could only ever show one.
 */
export const Viewport: Story = {
  name: 'PopoverViewport — current + previous',
  args: { open: false, onOpenChange: () => {}, trigger: null },
  render: () => (
    <div className="w-64 p-8">
      <PopoverViewport direction="right" previous={<p className="p-3">Outgoing content</p>}>
        <p className="p-3">Current content</p>
      </PopoverViewport>
    </div>
  ),
};

/**
 * `Tooltip` — describes, never names.
 *
 * Its `label` is deliberately a **string**, not a node. A node slot would invite
 * buttons and links into a surface that is unreachable by keyboard and invisible on
 * touch. Tab to the button: the tooltip shows on focus immediately, and on hover
 * after a delay.
 */
export const Tooltips: Story = {
  name: 'Tooltip — four sides',
  args: { open: false, onOpenChange: () => {}, trigger: null },
  render: () => (
    <div className="flex gap-6 p-16">
      {(['top', 'bottom', 'left', 'right'] as const).map((s) => (
        <Tooltip key={s} side={s} label={`Placed on the ${s}`}>
          <TriggerButton>{s}</TriggerButton>
        </Tooltip>
      ))}
    </div>
  ),
};

/**
 * `HoverCard`. Opens on hover **and on focus** — hover alone would exclude keyboard
 * and touch users, which the record calls out explicitly.
 *
 * `closeDelay` lets the pointer travel from trigger into the card without it
 * vanishing. Density is not just spacing: `detailed` is what makes room for `meta`.
 */
export const HoverCards: Story = {
  name: 'HoverCard — compact vs detailed',
  args: { open: false, onOpenChange: () => {}, trigger: null },
  render: () => (
    <div className="flex gap-8 p-16">
      <HoverCard title="Ada Lovelace" description="Patient since 2019.">
        <TriggerButton>Compact</TriggerButton>
      </HoverCard>
      <HoverCard
        title="Ada Lovelace"
        description="Patient since 2019."
        density="detailed"
        meta={<p>Last visit: 14 June · Next: 14 August</p>}
      >
        <TriggerButton>Detailed</TriggerButton>
      </HoverCard>
    </div>
  ),
};

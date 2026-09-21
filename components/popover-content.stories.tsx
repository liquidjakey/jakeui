import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PopoverContent, PopoverTrigger, PopoverBackdrop } from './popover.js';
import { PopoverArrow } from './popover-arrow.js';

/**
 * Unanchored anatomy previews with trigger, arrow and visual backdrop parts.
 * Use Popover for positioning, dismissal and focus management.
 * Consumer contract: docs/agent/components/popover-content.md.
 */

const meta = {
  title: 'Anatomy/PopoverContent',
  component: PopoverContent,
  parameters: {
    docs: {
      description: {
        component:
          "Popover / Content's 48 variants collapse to three binding sets — size, side and " +
          'align are all pure geometry.',
      },
    },
  },
} satisfies Meta<typeof PopoverContent>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `PopoverContent`, `PopoverTrigger` and `PopoverArrow`.
 *
 * 🔎 The action link binds `primary-readable`, which appears in no description
 * anywhere.
 *
 * `Popover / Content`'s 48 variants also collapse to three binding sets — size, side
 * and align are all pure geometry.
 */
export const PopoverParts: Story = {
  name: 'PopoverContent — primary-readable',
  args: {},
  render: () => <PopoverPartsDemo />,
};

function PopoverPartsDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-6">
      <PopoverTrigger open={open} onOpenChange={setOpen}>
        Trigger — open and hover bind identical tokens
      </PopoverTrigger>

      <div className="flex flex-wrap gap-6">
        <PopoverContent
          title="Appointment"
          description="Tuesday 14 August, 10:30."
          action={<a href="#">Reschedule — this link is primary-readable</a>}
          onClose={() => {}}
        />
        <PopoverContent
          size="large"
          title="With an arrow"
          description="Size, side and align carry no colour delta."
          arrow
        />
      </div>

      <div className="relative flex h-16 w-40 items-center justify-center rounded-lg border border-border bg-popover">
        <span className="text-body-sm text-popover-foreground">arrow, four sides</span>
        {(['top', 'right', 'bottom', 'left'] as const).map((s) => (
          <PopoverArrow key={s} side={s} />
        ))}
      </div>

      <div className="relative h-20 overflow-hidden rounded-lg border border-border">
        <PopoverBackdrop open onClick={() => {}} />
        <p className="relative z-50 p-3 text-body-sm text-card">
          PopoverBackdrop uses the scrim token to darken both themes. This anatomy preview
          provides no focus trap; use Popover for modal behavior.
        </p>
      </div>
    </div>
  );
}

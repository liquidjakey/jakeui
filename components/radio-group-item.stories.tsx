import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioGroupItem, RadioGroupIndicator } from './radio-group.js';

/**
 * Decorative circle previews. Disabled uses opacity/50, readOnly opacity/80;
 * use RadioGroup for operable choices.
 * Consumer contract: docs/agent/components/radio-group-item.md.
 */

const meta = {
  title: 'Anatomy/RadioGroupItem',
  component: RadioGroupItem,
  parameters: {
    docs: {
      description: {
        component:
          "Decorative radio-circle anatomy. Checked uses primary; disabled and read-only remain visually distinct. Use RadioGroup for interactive selection.",
      },
    },
  },
} satisfies Meta<typeof RadioGroupItem>;

export default meta;
type Story = StoryObj<typeof meta>;

const STATES = ['default', 'hover', 'focused', 'disabled', 'readOnly', 'invalid'] as const;

/** `RadioGroupItem`, every state, shown with the indicator it contains. */
export const RadioCircle: Story = {
  name: 'RadioGroupItem — every state',
  args: { checked: false },
  render: () => (
    <div className="flex flex-col gap-4">
      {([false, true] as const).map((checked) => (
        <div key={String(checked)} className="flex flex-wrap items-center gap-4">
          <span className="w-20 text-label-xs text-muted-foreground">
            {checked ? 'checked' : 'unchecked'}
          </span>
          {STATES.map((s) => (
            <div key={s} className="flex flex-col items-center gap-1">
              <RadioGroupItem checked={checked} state={s} />
              <span className="text-caption-xs text-muted-foreground">{s}</span>
            </div>
          ))}
        </div>
      ))}
      <div className="flex items-center gap-3">
        <span className="text-label-xs text-muted-foreground">indicator alone</span>
        <RadioGroupIndicator checked />
        <RadioGroupIndicator checked={false} forceMount />
      </div>
    </div>
  ),
};

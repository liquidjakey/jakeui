import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioGroupItem, RadioGroupIndicator } from './radio-group.js';

/**
 * `RadioGroupItem` — the circle that `RadioGroup` composes, read directly from live
 * bindings after the description cap blocked it.
 *
 * 🛑 **Disabled is indistinguishable from Default**, exactly as on `SwitchRoot`.
 * `Disabled` and `ReadOnly` bind the same tokens as `Default`; only the opacity
 * applied in *code* separates them. Confirmed across two components, so it is a
 * pattern rather than a one-off.
 */

const meta = {
  title: 'Anatomy/RadioGroupItem',
  component: RadioGroupItem,
  parameters: {
    docs: {
      description: {
        component:
          'Shown here with RadioGroupIndicator, the dot it contains — the indicator is the ' +
          'only recorded checked-state colour in the system, and three other components ' +
          'assert `primary` on its precedent.',
      },
    },
  },
} satisfies Meta<typeof RadioGroupItem>;

export default meta;
type Story = StoryObj<typeof meta>;

const STATES = ['default', 'hover', 'focused', 'disabled', 'readOnly', 'invalid'] as const;

/** 🛑 `RadioGroupItem` — the same defect as `SwitchRoot`, confirming it as a pattern. */
export const RadioCircle: Story = {
  name: 'RadioGroupItem — same defect',
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

import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioGroupItem, RadioGroupIndicator } from './radio-group.js';

/**
 * `RadioGroupItem` — the circle that `RadioGroup` composes, read directly from live
 * bindings after the description cap blocked it.
 *
 * ✅ **CORRECTED 10 Aug 2026.** This file used to claim that `Disabled` was
 * indistinguishable from `Default`, on the grounds that both bind the same COLOUR
 * tokens. The disabled treatment is an **opacity** binding, which the original
 * pass never looked at: `Disabled` binds `opacity/50` and `ReadOnly` binds
 * `opacity/80` on both values, and `Radio Group / Indicator` binds `opacity/50`
 * for its disabled dot. `SwitchRoot` was wrong in the same way and for the same
 * reason. See the findings doc, item 5.
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

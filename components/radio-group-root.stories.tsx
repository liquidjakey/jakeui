import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioGroupItem, RadioGroupRoot } from './radio-group.js';

/**
 * `RadioGroupRoot` — the labelled wrapper, read directly from live bindings after
 * the 8-row description cap blocked its 24 variants.
 *
 * The read collapsed those 24 variants to **9 binding sets**: orientation carries no
 * colour delta at all, and `default` and `readOnly` are identical. None of that
 * could have been inferred from the record.
 */

const meta = {
  title: 'Anatomy/RadioGroupRoot',
  component: RadioGroupRoot,
  parameters: {
    docs: {
      description: {
        component:
          'One of three sets whose variant count collapsed to pure geometry once read ' +
          'live — alongside Dropdown Menu / Content (24 -> 3) and Popover / Content (48 -> 3).',
      },
    },
  },
} satisfies Meta<typeof RadioGroupRoot>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `RadioGroupRoot`. Its 24 variants collapse to 9 — **orientation carries no colour
 * delta at all**, and `default` and `readOnly` are identical.
 *
 * ⚠️ Note what `invalid` does: it marks **every** item destructive, including
 * unchecked ones. That reads as "this group is wrong", not "this option is wrong".
 * And `disabled` changes only the labels, leaving the circles at full strength.
 */
export const RadioRoot: Story = {
  name: 'RadioGroupRoot — 24 variants, 9 sets',
  args: { label: 'Radio group', children: null },
  render: () => (
    <div className="flex flex-wrap gap-10">
      {(['default', 'disabled', 'invalid'] as const).map((state) => (
        <RadioGroupRoot key={state} label={`State = ${state}`} state={state}>
          {[0, 1, 2].map((i) => (
            <span key={i} className="flex items-center gap-2">
              <RadioGroupItem
                checked={i === 0}
                state={state === 'invalid' ? 'invalid' : state === 'disabled' ? 'disabled' : 'default'}
              />
              <span
                className={
                  state === 'disabled' ? 'text-body-md text-muted-foreground' : 'text-body-md text-foreground'
                }
              >
                Option {i + 1}
              </span>
            </span>
          ))}
        </RadioGroupRoot>
      ))}
    </div>
  ),
};

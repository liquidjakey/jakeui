import type { Meta, StoryObj } from '@storybook/react-vite';
import { SwitchRoot, SwitchThumb } from './switch.js';

/**
 * `SwitchRoot` — the track that `Switch` composes, read directly from live bindings
 * after the description cap blocked it.
 *
 * 🛑 **Disabled is indistinguishable from Default.** The live bindings show
 * `Disabled` and `ReadOnly` binding **exactly the same tokens as `Default`**. In the
 * rows below, the "disabled" and "default" swatches are identical except for the
 * opacity that `Switch` applies in *code* — nothing in the design file communicates
 * that the control cannot be used. `RadioGroupItem` has the same defect, which is
 * what makes it a pattern rather than an oversight.
 */

const meta = {
  title: 'Anatomy/SwitchRoot',
  component: SwitchRoot,
  parameters: {
    docs: {
      description: {
        component:
          'Reading this directly also collapsed its axes to pure geometry — a result that ' +
          'could not have been inferred from the record.',
      },
    },
  },
} satisfies Meta<typeof SwitchRoot>;

export default meta;
type Story = StoryObj<typeof meta>;

const STATES = ['default', 'hover', 'focused', 'disabled', 'readOnly', 'invalid'] as const;

/**
 * 🛑 `SwitchRoot`, every state. **Compare `default`, `disabled` and `readOnly`** —
 * they are token-for-token identical.
 */
export const SwitchTrack: Story = {
  name: 'SwitchRoot — disabled is invisible',
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
              <SwitchRoot checked={checked} state={s}>
                <SwitchThumb checked={checked} />
              </SwitchRoot>
              <span className="text-caption-xs text-muted-foreground">{s}</span>
            </div>
          ))}
        </div>
      ))}
      <p className="max-w-lg text-caption-sm text-muted-foreground">
        `default`, `disabled` and `readOnly` bind the same tokens. Only the opacity applied here
        separates them, and that is code, not a token.
      </p>
    </div>
  ),
};

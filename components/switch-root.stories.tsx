import type { Meta, StoryObj } from '@storybook/react-vite';
import { SwitchRoot, SwitchThumb } from './switch.js';

/**
 * Visual track previews, not interactive controls. Disabled uses opacity/50;
 * readOnly uses opacity/80. SwitchThumb adds its own disabled opacity.
 * Consumer contract: docs/agent/components/switch-root.md.
 */

const meta = {
  title: 'Anatomy/SwitchRoot',
  component: SwitchRoot,
  parameters: {
    docs: {
      description: {
        component:
          "Decorative switch track with independent visual disabled and read-only treatments. This anatomy does not implement focus or interaction; use Switch for application controls.",
      },
    },
  },
} satisfies Meta<typeof SwitchRoot>;

export default meta;
type Story = StoryObj<typeof meta>;

const STATES = ['default', 'hover', 'focused', 'disabled', 'readOnly', 'invalid'] as const;

/**
 * `SwitchRoot`, every state. **Compare `default`, `disabled` and `readOnly`** —
 * they are token-for-token identical in COLOUR, and separated by opacity:
 * `opacity/50` disabled, `opacity/80` read-only, both bound in the file.
 */
export const SwitchTrack: Story = {
  name: 'SwitchRoot — every state',
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
                <SwitchThumb checked={checked} disabled={s === 'disabled'} />
              </SwitchRoot>
              <span className="text-caption-xs text-muted-foreground">{s}</span>
            </div>
          ))}
        </div>
      ))}
      <p className="max-w-lg text-caption-sm text-muted-foreground">
        `default`, `disabled` and `readOnly` bind the same colour tokens. Opacity is what
        separates them, and it IS a token: `opacity/50` disabled, `opacity/80` read-only.
        The disabled thumb dims a further `opacity/75` on top of its track.
      </p>
    </div>
  ),
};

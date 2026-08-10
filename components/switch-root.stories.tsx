import type { Meta, StoryObj } from '@storybook/react-vite';
import { SwitchRoot, SwitchThumb } from './switch.js';

/**
 * `SwitchRoot` — the track that `Switch` composes, read directly from live bindings
 * after the description cap blocked it.
 *
 * ✅ **CORRECTED 10 Aug 2026.** This file used to claim that `Disabled` was
 * indistinguishable from `Default` because the two bind the same COLOUR tokens.
 * That conclusion was wrong: re-reading the set showed the disabled treatment is
 * an **opacity** binding, which the original pass never looked at. Every disabled
 * variant binds `opacity/50` and every read-only variant binds `opacity/80`, on
 * all eight size×value combinations. That is the same convention this component
 * applies in code, so the file and the system already agreed.
 *
 * ✅ Two real defects came out of checking it, and BOTH ARE NOW FIXED.
 *
 * `switch.tsx` applied `opacity-50` to `disabled || readOnly` in one expression,
 * so a read-only switch rendered at 50% where the file binds 80%. The branch is
 * split and both values reference the tokens — see `lib/opacity.ts`.
 *
 * `Switch / Thumb`'s disabled variants carried a raw 0.75 with no variable to
 * bind. `opacity/75` was added to the Interaction collection and bound on both
 * variants, and the thumb now applies it in code. The dimmings COMPOUND, exactly
 * as the file composes them: a disabled switch below renders its track at
 * opacity/50 and its thumb at a further 75% of that, an effective 0.375.
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

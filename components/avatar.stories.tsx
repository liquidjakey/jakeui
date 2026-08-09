import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './avatar.js';

/**
 * Stories for `Avatar`, recovered from the 8-row state cap by proof on 9 Aug 2026.
 *
 * Contract: docs/components/avatar.md
 *
 * ⚠️ The Initials text is **unbound in Figma on all three sizes** — 11/14, 14/18 and
 * 18/22, all Semi Bold, none of those line-heights in the ramp. The nearest semibold
 * step is used for each, so sizes match and line-heights run 2–4px looser. Listed in
 * the Figma fix list and carried as a documented divergence in
 * `scripts/computed-type-exceptions.json`.
 */

const meta = {
  title: 'Content/Avatar',
  component: Avatar,
  parameters: {
    docs: {
      description: {
        component:
          'Correct fill/text pairing, and one of the few components whose dimensions are ' +
          'genuinely tokenised: 32 / 48 / 64 with radius/16, radius/24 and radius/32 — exactly ' +
          'half of each, so every size is a true circle.',
      },
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** `Avatar` — correct fill/text pairing, and one of the few tokenised dimensions. */
export const Avatars: Story = {
  args: { initials: 'AL', name: 'Ada Lovelace' },
  render: () => (
    <div className="flex items-end gap-4">
      <Avatar initials="AL" name="Ada Lovelace" size="small" />
      <Avatar initials="AL" name="Ada Lovelace" size="medium" status="online" />
      <Avatar initials="AL" name="Ada Lovelace" size="large" status="busy" />
    </div>
  ),
};

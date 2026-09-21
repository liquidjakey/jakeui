import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './avatar.js';

/**
 * Identity and presence previews. Small initials use the scoped typography
 * exception in agent/exceptions.json.
 * Consumer contract: docs/agent/components/avatar.md.
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

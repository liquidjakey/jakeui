import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './badge.js';

/**
 * Five solid tones at two sizes. Success uses success-foreground;
 * destructive uses card text.
 * Consumer contract: docs/agent/components/badge.md.
 */

const meta = {
  title: 'Content/Badge',
  component: Badge,
  parameters: {
    docs: {
      description: {
        component:
          "Noninteractive labels in five tones and two sizes. Success uses success-foreground; destructive uses card text.",
      },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/** All five tones at both supported sizes. */
export const Tones: Story = {
  args: { children: 'Badge' },
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {(['neutral', 'info', 'success', 'warning', 'destructive'] as const).map((t) => (
          <Badge key={t} tone={t}>
            {t}
          </Badge>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {(['neutral', 'info', 'success', 'warning', 'destructive'] as const).map((t) => (
          <Badge key={t} tone={t} size="medium">
            {t}
          </Badge>
        ))}
      </div>
      <p className="text-caption-sm text-muted-foreground">
        Success uses success-foreground; destructive uses card text on its solid fill.
      </p>
    </div>
  ),
};

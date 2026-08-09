import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './badge.js';

/**
 * Stories for `Badge`, one of the components recovered on 9 Aug 2026 — unblocked by
 * a correction rather than by a re-read.
 *
 * Contract: docs/components/badge.md
 *
 * ⚠️ **`Badge`'s Success tone binds `text info-foreground`, not
 * `success-foreground`** — it reaches across to Info's foreground. Both resolve to
 * the same value today, so nothing looks wrong; transcribed as recorded and flagged.
 */

const meta = {
  title: 'Content/Badge',
  component: Badge,
  parameters: {
    docs: {
      description: {
        component:
          'Badge was unblocked twice: a regex error had wrongly flagged it as carrying stale ' +
          'tokens, and its cap gap turned out to be two missing Destructive rows, pattern-completed ' +
          'from four tones that share one consistent shape.',
      },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/** All five tones. **Destructive is the pattern-completed pair.** */
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
        Destructive was absent from the record — completed from the four-tone pattern.
      </p>
    </div>
  ),
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Separator } from './separator.js';

/**
 * Stories for `Separator`.
 * Contract: docs/agent/components/separator.md
 */

const meta = {
  title: 'Primitives/Separator',
  component: Separator,
  parameters: {
    docs: {
      description: {
        component:
          'Both orientations bind the same single token, `border` — only the axis changes. ' +
          '`decorative` has no visual effect at all and no Figma variant; it decides whether ' +
          'the rule is aria-hidden or a real role="separator".',
      },
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `Separator` in both orientations.
 *
 * Both bind the same single token, `border` — only the axis changes. The
 * `decorative` prop has no visual effect at all and no Figma variant; it decides
 * whether the rule is `aria-hidden` or a real `role="separator"`.
 */
export const Separators: Story = {
  name: 'Separator — orientations',
  args: {},
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-3">
        <span className="text-label-xs text-muted-foreground">Horizontal (decorative)</span>
        <span className="text-body-md text-foreground">Above</span>
        <Separator />
        <span className="text-body-md text-foreground">Below</span>
      </div>

      <div className="flex h-10 items-center gap-3">
        <span className="text-body-md text-foreground">Left</span>
        <Separator orientation="vertical" />
        <span className="text-body-md text-foreground">Right</span>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-label-xs text-muted-foreground">
          Semantic (role=&quot;separator&quot;, announced)
        </span>
        <Separator decorative={false} />
      </div>
    </div>
  ),
};

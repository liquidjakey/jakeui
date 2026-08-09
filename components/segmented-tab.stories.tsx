import type { Meta, StoryObj } from '@storybook/react-vite';
import { SegmentedTab } from './segmented-tab.js';

/**
 * Stories for `SegmentedTab`.
 * Contract: docs/components/segmented-tab.md
 *
 * The item half of the segmented control, exported for callers who compose the tab
 * list themselves rather than letting `Tabs` render it.
 */

const meta = {
  title: 'Controls/SegmentedTab',
  component: SegmentedTab,
  parameters: {
    docs: {
      description: {
        component:
          'Note the INVERSION: the selected tab takes the lighter `card` fill and lifts out ' +
          'of the muted track, rather than being highlighted. That only reads correctly inside ' +
          'a `muted` container, which is why this record and Tabs’ must be read together — ' +
          'Tabs binds the container and no selected state; this binds the selected state and ' +
          'no container.',
      },
    },
  },
} satisfies Meta<typeof SegmentedTab>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `SegmentedTab` standalone — the item half, exported for callers who compose the
 * tab list themselves rather than letting `Tabs` render it.
 *
 * **Note the inversion**: the *selected* tab takes the lighter `card` fill and lifts
 * out of the muted track, rather than being highlighted. That only reads correctly
 * inside a `muted` container, which is why the two records must be read together —
 * `Tabs` binds the container and no selected state; this binds the selected state
 * and no container.
 */
export const SegmentedTabs: Story = {
  name: 'SegmentedTab — standalone',
  args: { label: 'Tab', onSelect: () => {} },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="inline-flex gap-1 rounded-lg bg-muted p-1">
        <SegmentedTab label="Selected" selected onSelect={() => {}} />
        <SegmentedTab label="Unselected" onSelect={() => {}} />
        <SegmentedTab label="Disabled" disabled onSelect={() => {}} />
      </div>
      <p className="text-caption-sm text-muted-foreground">
        Outside the muted track the selected state has nothing to lift out of — that is the
        pairing, not a bug:
      </p>
      <div className="inline-flex gap-1">
        <SegmentedTab label="Selected" selected onSelect={() => {}} />
        <SegmentedTab label="Unselected" onSelect={() => {}} />
      </div>
    </div>
  ),
};

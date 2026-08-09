import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumb } from './breadcrumb.js';

/**
 * Stories for `Breadcrumb`.
 * Contract: docs/components/breadcrumb.md
 *
 * ⚠️ Both its text nodes are **unbound in Figma** — all items 13/20 Regular, the
 * current item 13/20 Medium. `Body/SM` and `Label/MD`, both 13/18, are used instead.
 * Part of the ramp question in the Figma-side decision memo.
 */

const meta = {
  title: 'Navigation/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    docs: {
      description: {
        component:
          'Figma models a fixed three-level trail; code takes an array, because real trails ' +
          'are 2, 4 or 6 deep.',
      },
    },
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Breadcrumb. Figma models a fixed three-level trail; code takes an array, because
 * real trails are 2, 4 or 6 deep.
 *
 * ⚠️ The current page renders in `foreground` — **asserted, not transcribed.** The
 * record binds everything to `muted-foreground`, which would make the current page
 * indistinguishable from its ancestors.
 */
export const BreadcrumbDemo: Story = {
  name: 'Breadcrumb',
  args: { items: [] },
  render: () => (
    <div className="flex flex-col gap-4">
      <Breadcrumb
        items={[
          { label: 'Home', href: '#' },
          { label: 'Patients', href: '#' },
          { label: 'Ada Lovelace' },
        ]}
      />
      <Breadcrumb
        collapsed
        items={[
          { label: 'Home', href: '#' },
          { label: 'Clinics', href: '#' },
          { label: 'Seoul', href: '#' },
          { label: 'Patients', href: '#' },
          { label: 'Ada Lovelace' },
        ]}
      />
    </div>
  ),
};

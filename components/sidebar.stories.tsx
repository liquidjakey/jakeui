import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sidebar, SidebarNavigationItem } from './sidebar.js';

/**
 * Stories for `Sidebar` and `SidebarNavigationItem`.
 * Contracts: docs/components/sidebar.md · sidebar-navigation-item.md
 *
 * ⚠️ The collapse control carries no text binding of any kind, so its chevron glyph
 * inherits the browser default rather than a ramp step. `computed-type:check`
 * reports it as an inherited off-ramp warning on every run; fixing it means picking
 * a ramp step, which is a Figma-side binding decision rather than a code one.
 */

const meta = {
  title: 'Navigation/Sidebar',
  component: Sidebar,
  parameters: {
    docs: {
      description: {
        component:
          'SidebarNavigationItem has the best-behaved colour record in the system — the dedicated ' +
          'sidebar-* family throughout, with fill and matching foreground correctly paired. Compare ' +
          'Card (info-foreground on a card fill) and Dialog (plain foreground on card).',
      },
    },
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Expanded and collapsed. Collapsed keeps labels in the DOM, visually hidden. */
export const Sidebars: Story = {
  args: { children: null },
  render: () => <SidebarDemo />,
};

function SidebarDemo() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="flex gap-4">
      <Sidebar collapsed={collapsed} onCollapsedChange={setCollapsed} label="Clinic">
        <SidebarNavigationItem href="#" active collapsed={collapsed} icon={<span>◧</span>}>
          Patients
        </SidebarNavigationItem>
        <SidebarNavigationItem href="#" collapsed={collapsed} icon={<span>◫</span>}>
          Appointments
        </SidebarNavigationItem>
        <SidebarNavigationItem href="#" collapsed={collapsed} icon={<span>◨</span>}>
          Billing
        </SidebarNavigationItem>
      </Sidebar>
      <p className="text-body-sm text-muted-foreground">
        Toggle the chevron. Collapsed labels stay in the DOM as screen-reader text.
      </p>
    </div>
  );
}

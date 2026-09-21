import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Users, CalendarBlank, File } from "@phosphor-icons/react";
import { PreviewNavigation } from "../.storybook/preview-navigation.js";
import { Sidebar, SidebarNavigationItem } from "./sidebar.js";

/**
 * Expanded and collapsed navigation previews. Existing glyph typography exceptions
 * are scoped in scripts/computed-type-exceptions.json, not consumer allowances.
 * Consumer contract: docs/agent/components/sidebar.md.
 */

const meta = {
  title: "Navigation/Sidebar",
  component: Sidebar,
  parameters: {
    docs: {
      description: {
        component:
          "SidebarNavigationItem uses the sidebar token family. The parent propagates collapsed state; the application owns responsive shell placement and routing.",
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
    <PreviewNavigation initial="/patients">
      {(destination) => (
        <div className="flex flex-col gap-4 sm:flex-row">
          <Sidebar
            collapsed={collapsed}
            onCollapsedChange={setCollapsed}
            label="Clinic"
          >
            <SidebarNavigationItem
              href="/patients"
              active={destination === "/patients"}
              icon={<Users />}
            >
              Patients
            </SidebarNavigationItem>
            <SidebarNavigationItem
              href="/appointments"
              active={destination === "/appointments"}
              icon={<CalendarBlank />}
            >
              Appointments
            </SidebarNavigationItem>
            <SidebarNavigationItem
              href="/billing"
              active={destination === "/billing"}
              icon={<File />}
            >
              Billing
            </SidebarNavigationItem>
          </Sidebar>
          <p className="text-body-sm text-muted-foreground">
            Toggle the chevron. Collapsed labels stay in the DOM as
            screen-reader text.
          </p>
        </div>
      )}
    </PreviewNavigation>
  );
}

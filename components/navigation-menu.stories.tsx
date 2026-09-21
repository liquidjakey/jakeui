import { useState } from "react";
import { PreviewNavigation } from "../.storybook/preview-navigation.js";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { NavigationMenu } from "./navigation-menu.js";

/**
 * Navigation and compact-menu previews. Foreground on card preserves readable
 * resting links; current links use the accent pair.
 * Consumer contract: docs/agent/components/navigation-menu.md.
 */

const meta = {
  title: "Navigation/NavigationMenu",
  component: NavigationMenu,
  parameters: {
    docs: {
      description: {
        component:
          "Flat navigation links with a controlled compact toggle. Action-colored text uses primary-readable; preserve readable foreground pairing in both themes.",
      },
    },
  },
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Check navigation text and active destinations in both themes. */
export const Navigation: Story = {
  args: { items: [] },
  render: () => <NavigationDemo />,
};

function NavigationDemo() {
  const [open, setOpen] = useState(false);
  return (
    <PreviewNavigation initial="/overview">
      {(destination) => (
        <NavigationMenu
          label="Product"
          open={open}
          onOpenChange={setOpen}
          items={[
            { href: "/overview", label: "Overview" },
            { href: "/patients", label: "Patients" },
            { href: "/billing", label: "Billing" },
          ].map((item) => ({ ...item, current: item.href === destination }))}
        />
      )}
    </PreviewNavigation>
  );
}

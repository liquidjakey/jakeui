import type { Meta, StoryObj } from "@storybook/react-vite";
import { PreviewNavigation } from "../.storybook/preview-navigation.js";
import { Breadcrumb } from "./breadcrumb.js";

/**
 * Hierarchical navigation with muted ancestor links and a stronger current page.
 * Consumer contract: docs/agent/components/breadcrumb.md.
 */

const meta = {
  title: "Navigation/Breadcrumb",
  component: Breadcrumb,
  parameters: {
    docs: {
      description: {
        component:
          "Figma models a fixed three-level trail; code takes an array, because real trails " +
          "are 2, 4 or 6 deep.",
      },
    },
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Breadcrumb accepts a variable-length trail. The current page uses foreground and ancestors use muted-foreground. */
export const BreadcrumbDemo: Story = {
  name: "Breadcrumb",
  args: { items: [] },
  render: () => (
    <PreviewNavigation initial="/patients/ada">
      {() => (
        <div className="flex flex-col gap-4">
          <Breadcrumb
            items={[
              { label: "Home", href: "/home" },
              { label: "Patients", href: "/patients" },
              { label: "Ada Lovelace" },
            ]}
          />
          <Breadcrumb
            collapsed
            items={[
              { label: "Home", href: "/home" },
              { label: "Clinics", href: "/clinics" },
              { label: "Seoul", href: "/clinics/seoul" },
              { label: "Patients", href: "/patients" },
              { label: "Ada Lovelace" },
            ]}
          />
        </div>
      )}
    </PreviewNavigation>
  ),
};

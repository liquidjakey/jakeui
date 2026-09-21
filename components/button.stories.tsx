import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus, DownloadSimple, MagnifyingGlass } from "@phosphor-icons/react";
import { Button } from "./button.js";

/**
 * Action-button variant and size previews. Check keyboard focus and disabled states.
 * Consumer contract: docs/agent/components/button.md.
 */

const meta = {
  title: "Primitives/Button",
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          "Four styles and two sizes. Hover uses primary-hover or accent-hover; focus adds the shared ring. Check enabled and disabled variants.",
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const STYLES = ["primary", "secondary", "outline", "ghost"] as const;

/** Every style, at both sizes. Hover them to see `primary-hover` / `accent-hover`. */
export const Styles: Story = {
  args: { children: "Button" },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        {STYLES.map((s) => (
          <Button key={s} style={s} size="medium">
            {s}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {STYLES.map((s) => (
          <Button key={s} style={s} size="small">
            {s}
          </Button>
        ))}
      </div>
      <p className="text-caption-sm text-muted-foreground">
        Medium above, small below. Padding is `space/4` / `space/2-25` and
        `space/3` / `space/1-5` — system spacing.
      </p>
    </div>
  ),
};

/**
 * ⚠️ **The disabled finding.** All four render as `muted` with `muted-foreground`, and
 * the outline style's border is **dropped**, so outline and ghost become
 * indistinguishable. Compare against the enabled row above.
 */
export const Disabled: Story = {
  name: "Disabled — outline and ghost collapse",
  args: { children: "Button" },
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        {STYLES.map((s) => (
          <Button key={s} style={s} disabled>
            {s}
          </Button>
        ))}
      </div>
      <p className="text-caption-sm text-muted-foreground">
        Disabled outline and ghost share the same appearance; the outline border
        is removed.
      </p>
    </div>
  ),
};

/**
 * Focus. **Tab through these** — every style keeps its resting fill and adds a
 * `stroke/2` `ring`. Implemented as a ring rather than a border so there is no layout
 * shift, the same treatment `Input` uses and for the same reason.
 */
export const Focus: Story = {
  args: { children: "Button" },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {STYLES.map((s) => (
        <Button key={s} style={s}>
          Tab to {s}
        </Button>
      ))}
    </div>
  ),
};

/** With a leading icon. The Figma `Show leading icon` boolean collapsed into the slot. */
export const WithIcon: Story = {
  args: { children: "Button" },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button leadingIcon={<Plus />}>New appointment</Button>
      <Button style="outline" leadingIcon={<DownloadSimple />}>
        Export
      </Button>
      <Button style="ghost" size="small" leadingIcon={<MagnifyingGlass />}>
        Search
      </Button>
    </div>
  ),
};

/** The full 32-variant matrix, which no description could ever show. */
export const Matrix: Story = {
  name: "All 32 variants",
  args: { children: "Button" },
  render: () => (
    <table className="border-separate border-spacing-3 text-body-sm">
      <thead>
        <tr className="text-left text-label-md text-muted-foreground [&>th]:font-medium">
          <th>Variant</th>
          <th>default</th>
          <th>disabled</th>
        </tr>
      </thead>
      <tbody>
        {STYLES.flatMap((s) =>
          (["medium", "small"] as const).map((size) => (
            <tr key={`${s}-${size}`}>
              <th className="pr-2 text-left font-normal text-muted-foreground">
                {s} / {size}
              </th>
              <td>
                <Button style={s} size={size}>
                  Label
                </Button>
              </td>
              <td>
                <Button style={s} size={size} disabled>
                  Label
                </Button>
              </td>
            </tr>
          )),
        )}
      </tbody>
    </table>
  ),
};

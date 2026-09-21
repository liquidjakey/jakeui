import type { Meta, StoryObj } from '@storybook/react-vite';
import { ButtonGroup } from './button-group.js';

/**
 * Related Button controls with horizontal, vertical and attached layouts.
 * Each button remains a separate action and focus stop.
 * Consumer contract: docs/agent/components/button-group.md.
 */

const meta = {
  title: 'Primitives/ButtonGroup',
  component: ButtonGroup,
  parameters: {
    docs: {
      description: {
        component:
          'Layout-only — it owns the grouping, spacing and the attached/detached seam, ' +
          'and nothing else. Its members are the caller’s, which is why the demo below ' +
          'passes plain buttons rather than the Button component.',
      },
    },
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** `ButtonGroup`, attached and detached. Layout-only — its members are the caller's. */
export const ButtonGroups: Story = {
  args: { children: null },
  render: () => {
    const b = 'border border-border bg-card px-3 py-2 text-body-sm text-foreground';
    return (
      <div className="flex flex-col gap-4">
        <ButtonGroup label="Actions">
          <button type="button" className={`${b} rounded-lg`}>
            Save
          </button>
          <button type="button" className={`${b} rounded-lg`}>
            Discard
          </button>
        </ButtonGroup>

        <ButtonGroup label="Segmented actions" attached>
          <button type="button" className={b}>
            Day
          </button>
          <button type="button" className={b}>
            Week
          </button>
          <button type="button" className={b}>
            Month
          </button>
        </ButtonGroup>
      </div>
    );
  },
};

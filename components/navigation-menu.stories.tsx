import type { Meta, StoryObj } from '@storybook/react-vite';
import { NavigationMenu } from './navigation-menu.js';

/**
 * Stories for `NavigationMenu`, recovered from the 8-row state cap by proof on
 * 9 Aug 2026.
 *
 * Contract: docs/components/navigation-menu.md
 *
 * 🛑 **This is the second component whose code deliberately diverges from its
 * record.** It binds `fill card` + `text primary-foreground`, and
 * `primary-foreground` is near-white in *both* modes — so on a white card in Light
 * the text is invisible. The code binds `foreground`. Switch the toolbar Theme to
 * "Side by side": readable in both, which it would not be if the record had been
 * followed. Same cause as `Card`.
 */

const meta = {
  title: 'Navigation/NavigationMenu',
  component: NavigationMenu,
  parameters: {
    docs: {
      description: {
        component:
          'One of two components carrying a deliberate, recorded divergence from its ' +
          'doc record — do not "restore" it to match the record without reading the rationale.',
      },
    },
  },
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `NavigationMenu`. 🛑 The record's text token would be invisible in light mode —
 * see the note at the top. Check this one in both themes.
 */
export const Navigation: Story = {
  args: { items: [] },
  render: () => (
    <NavigationMenu
      label="Product"
      items={[
        { href: '#', label: 'Overview', current: true },
        { href: '#', label: 'Patients' },
        { href: '#', label: 'Billing' },
      ]}
    />
  ),
};

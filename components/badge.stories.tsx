import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './badge.js';
import { Avatar } from './avatar.js';
import { ButtonGroup } from './button-group.js';
import { NavigationMenu } from './navigation-menu.js';
import { Checkbox } from './checkbox.js';
import { DropdownMenu, DropdownMenuItem, DropdownMenuCheckboxItem } from './dropdown-menu.js';

/**
 * Stories for the components recovered on 9 Aug 2026 — three unblocked by a
 * correction, five recovered from the 8-row state cap by proof.
 *
 * Contracts: badge.md · avatar.md · button-group.md · navigation-menu.md ·
 * checkbox.md · dropdown-menu-item.md · dropdown-menu-checkbox-item.md ·
 * popover-trigger.md
 *
 * 🛑 **`NavigationMenu` is the second component whose code deliberately diverges
 * from its record.** It binds `fill card` + `text primary-foreground`, and
 * `primary-foreground` is near-white in *both* modes — so on a white card in Light
 * the text is invisible. The code binds `foreground`. Switch the toolbar Theme to
 * "Side by side": readable in both, which it would not be if the record had been
 * followed. Same cause as `Card`.
 *
 * ⚠️ **`Badge`'s Success tone binds `text info-foreground`, not
 * `success-foreground`** — it reaches across to Info's foreground. Both resolve to
 * the same value today, so nothing looks wrong; transcribed as recorded and flagged.
 */

const meta = {
  title: 'Recovered/Badge',
  component: Badge,
  parameters: {
    docs: {
      description: {
        component:
          'Badge was unblocked twice: a regex error had wrongly flagged it as carrying stale ' +
          'tokens, and its cap gap turned out to be two missing Destructive rows, pattern-completed ' +
          'from four tones that share one consistent shape.',
      },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/** All five tones. **Destructive is the pattern-completed pair.** */
export const Tones: Story = {
  args: { children: 'Badge' },
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {(['neutral', 'info', 'success', 'warning', 'destructive'] as const).map((t) => (
          <Badge key={t} tone={t}>
            {t}
          </Badge>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {(['neutral', 'info', 'success', 'warning', 'destructive'] as const).map((t) => (
          <Badge key={t} tone={t} size="medium">
            {t}
          </Badge>
        ))}
      </div>
      <p className="text-caption-sm text-muted-foreground">
        Destructive was absent from the record — completed from the four-tone pattern.
      </p>
    </div>
  ),
};

/** `Avatar` — correct fill/text pairing, and one of the few tokenised dimensions. */
export const Avatars: Story = {
  args: { children: 'Badge' },
  render: () => (
    <div className="flex items-end gap-4">
      <Avatar initials="AL" name="Ada Lovelace" size="small" />
      <Avatar initials="AL" name="Ada Lovelace" size="medium" status="online" />
      <Avatar initials="AL" name="Ada Lovelace" size="large" status="busy" />
    </div>
  ),
};

/**
 * `Checkbox`, all three values. **Indeterminate has no HTML attribute** — it is a
 * DOM property only, applied through a ref, and `aria-checked="mixed"` follows.
 */
export const Checkboxes: Story = {
  args: { children: 'Badge' },
  render: () => <CheckboxDemo />,
};

function CheckboxDemo() {
  const [a, setA] = useState<boolean | 'indeterminate'>('indeterminate');
  return (
    <div className="flex max-w-sm flex-col gap-3">
      <Checkbox label="Unchecked" checked={false} onCheckedChange={() => {}} />
      <Checkbox label="Checked" checked onCheckedChange={() => {}} />
      <Checkbox
        label="Indeterminate — click to resolve"
        description="Mixed is derived from children, never chosen. It never cycles back."
        checked={a}
        onCheckedChange={setA}
      />
      <Checkbox label="Disabled" checked={false} onCheckedChange={() => {}} disabled />
    </div>
  );
}

/**
 * `NavigationMenu`. 🛑 The record's text token would be invisible in light mode —
 * see the note at the top. Check this one in both themes.
 */
export const Navigation: Story = {
  args: { children: 'Badge' },
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

/** `ButtonGroup`, attached and detached. Layout-only — its members are the caller's. */
export const ButtonGroups: Story = {
  args: { children: 'Badge' },
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

/**
 * `DropdownMenuItem` and `DropdownMenuCheckboxItem`, both recovered from the cap.
 *
 * ⚠️ The checkbox item's checked indicator is **asserted** — `Value` being provably
 * inert is precisely the defect: the record gives no way to distinguish checked from
 * unchecked.
 */
export const MenuItems: Story = {
  args: { children: 'Badge' },
  render: () => <MenuItemsDemo />,
};

function MenuItemsDemo() {
  const [a, setA] = useState(true);
  const [b, setB] = useState<boolean | 'indeterminate'>('indeterminate');
  return (
    <div className="max-w-xs">
      <DropdownMenu label="Row actions">
        <DropdownMenuItem onSelect={() => {}} shortcut="⌘E">
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => {}} inset>
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuCheckboxItem checked={a} onCheckedChange={setA}>
          Show archived
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={b} onCheckedChange={setB}>
          Include drafts
        </DropdownMenuCheckboxItem>
        <DropdownMenuItem onSelect={() => {}} tone="destructive" shortcut="⌫">
          Delete
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => {}} disabled>
          Unavailable
        </DropdownMenuItem>
      </DropdownMenu>
    </div>
  );
}

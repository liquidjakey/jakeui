import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuRadioItem,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from './dropdown-menu.js';

/**
 * Linked command-menu and submenu examples. Match trigger controls to menu ids.
 * Radio indicators show caller-owned exclusive selection; checkbox items stay open.
 * Consumer contract: docs/agent/components/dropdown-menu.md.
 */

const meta = {
  title: 'Overlays/DropdownMenu',
  component: DropdownMenu,
  parameters: {
    docs: {
      description: {
        component:
          "Share open state between the trigger and conditional menu mounting. Match controls/id to enable anchored placement and focus handling. NativeSelect instead uses a browser-owned popup.",
      },
    },
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Button trigger with a labelled radio group. */
export const Default: Story = {
  args: { children: null },
  render: () => <MenuDemo />,
};

function MenuDemo() {
  const [open, setOpen] = useState(true);
  const [value, setValue] = useState('cleaning');
  return (
    <div className="p-8">
      <DropdownMenuTrigger open={open} onOpenChange={setOpen} controls="menu-1">
        Appointment type
      </DropdownMenuTrigger>
      {open ? (
        <div className="mt-2">
          <DropdownMenu id="menu-1" label="Appointment type">
            <DropdownMenuLabel>Choose one</DropdownMenuLabel>
            {[
              { id: 'general', label: 'General check-up' },
              { id: 'cleaning', label: 'Cleaning' },
              { id: 'ortho', label: 'Orthodontic consult' },
              { id: 'emergency', label: 'Emergency', disabled: true },
            ].map((o) => (
              <DropdownMenuRadioItem
                key={o.id}
                checked={value === o.id}
                disabled={o.disabled}
                onSelect={() => setValue(o.id)}
              >
                {o.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenu>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Avatar trigger.
 *
 * ⚠️ Its closed state binds `accent-foreground` with **no fill**. That token is the
 * text colour *for* the accent fill, so with nothing behind it it sits on whatever
 * is beneath — the same class of mismatch as `Card`'s `info-foreground`, though far
 * less severe. Transcribed and flagged.
 *
 * Note there is **no disabled variant** for the avatar type in the file.
 */
export const AvatarTrigger: Story = {
  name: 'Trigger = avatar',
  args: { children: null },
  render: () => <AvatarDemo />,
};

function AvatarDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-8">
      <DropdownMenuTrigger
        open={open}
        onOpenChange={setOpen}
        type="avatar"
        label="Account menu"
        controls="menu-2"
      >
        <span
          aria-hidden="true"
          className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent"
        >
          AL
        </span>
      </DropdownMenuTrigger>
      {open ? (
        <div className="mt-2">
          <DropdownMenu id="menu-2" label="Account">
            <DropdownMenuLabel>Ada Lovelace</DropdownMenuLabel>
            <DropdownMenuRadioItem onSelect={() => {}}>Profile</DropdownMenuRadioItem>
            <DropdownMenuRadioItem onSelect={() => {}}>Settings</DropdownMenuRadioItem>
          </DropdownMenu>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Submenu. Right Arrow opens and moves in; Left Arrow closes and returns.
 *
 * ⚠️ Watch the trigger as you hover versus open it — the tokens are identical, so
 * there is no feedback that the submenu actually opened.
 */
export const Submenu: Story = {
  args: { children: null },
  render: () => <SubmenuDemo />,
};

function SubmenuDemo() {
  const [openSub, setOpenSub] = useState(false);
  return (
    <div className="flex items-start gap-2 p-8">
      <DropdownMenu label="Actions">
        <DropdownMenuLabel inset>Row actions</DropdownMenuLabel>
        <DropdownMenuRadioItem onSelect={() => {}}>Edit</DropdownMenuRadioItem>
        <DropdownMenuSubTrigger open={openSub} onOpenChange={setOpenSub} controls="submenu-1" inset>
          Move to…
        </DropdownMenuSubTrigger>
        <DropdownMenuRadioItem onSelect={() => {}}>Delete</DropdownMenuRadioItem>
      </DropdownMenu>

      {openSub ? (
        <DropdownMenuSubContent id="submenu-1" label="Move to">
          <DropdownMenuRadioItem onSelect={() => {}}>Archive</DropdownMenuRadioItem>
          <DropdownMenuRadioItem onSelect={() => {}}>Another clinic</DropdownMenuRadioItem>
        </DropdownMenuSubContent>
      ) : null}
    </div>
  );
}

/** Comfortable density changes spacing, not color. */
export const Comfortable: Story = {
  name: 'Density = comfortable',
  args: { children: null },
  render: () => (
    <div className="p-8">
      <DropdownMenu density="comfortable" label="Comfortable menu">
        <DropdownMenuLabel>Section</DropdownMenuLabel>
        <DropdownMenuRadioItem checked onSelect={() => {}}>
          Checked item
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem onSelect={() => {}}>Unchecked item</DropdownMenuRadioItem>
        <DropdownMenuRadioItem disabled onSelect={() => {}}>
          Disabled item
        </DropdownMenuRadioItem>
      </DropdownMenu>
    </div>
  ),
};

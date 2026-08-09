import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SwitchRoot, SwitchThumb } from './switch.js';
import { RadioGroupItem, RadioGroupRoot, RadioGroupIndicator } from './radio-group.js';
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from './dropdown-menu.js';
import { PopoverContent, PopoverTrigger, PopoverBackdrop } from './popover.js';
import { PopoverArrow } from './popover-arrow.js';

/**
 * Stories for the **anatomy parts** — the sub-components that render inside their
 * parents and had no story of their own.
 *
 * These are the components read directly from live bindings after the description cap
 * blocked them. Two findings are only visible here, and both are accessibility
 * problems rather than cosmetic ones.
 *
 * 🛑 **Disabled is indistinguishable from Default** on both `SwitchRoot` and
 * `RadioGroupItem`. The live bindings show `Disabled` and `ReadOnly` binding
 * **exactly the same tokens as `Default`**. In the rows below, the "disabled" and
 * "default" swatches are identical except for the opacity that `Switch` and
 * `RadioGroup` apply in *code* — nothing in the design file communicates that the
 * control cannot be used. Confirmed across two components, so it is a pattern.
 */

const meta = {
  title: 'Anatomy/Parts',
  component: SwitchRoot,
  parameters: {
    docs: {
      description: {
        component:
          'Reading these directly also collapsed three axes to pure geometry: Dropdown Menu / ' +
          "Content's 24 variants produce 3 binding sets, Popover / Content's 48 produce 3, and " +
          "Radio Group / Root's 24 produce 9. None of that could have been inferred.",
      },
    },
  },
} satisfies Meta<typeof SwitchRoot>;

export default meta;
type Story = StoryObj<typeof meta>;

const STATES = ['default', 'hover', 'focused', 'disabled', 'readOnly', 'invalid'] as const;

/**
 * 🛑 `SwitchRoot`, every state. **Compare `default`, `disabled` and `readOnly`** —
 * they are token-for-token identical.
 */
export const SwitchTrack: Story = {
  name: 'SwitchRoot — disabled is invisible',
  args: { checked: false },
  render: () => (
    <div className="flex flex-col gap-4">
      {([false, true] as const).map((checked) => (
        <div key={String(checked)} className="flex flex-wrap items-center gap-4">
          <span className="w-20 text-label-xs text-muted-foreground">
            {checked ? 'checked' : 'unchecked'}
          </span>
          {STATES.map((s) => (
            <div key={s} className="flex flex-col items-center gap-1">
              <SwitchRoot checked={checked} state={s}>
                <SwitchThumb checked={checked} />
              </SwitchRoot>
              <span className="text-caption-xs text-muted-foreground">{s}</span>
            </div>
          ))}
        </div>
      ))}
      <p className="max-w-lg text-caption-sm text-muted-foreground">
        `default`, `disabled` and `readOnly` bind the same tokens. Only the opacity applied here
        separates them, and that is code, not a token.
      </p>
    </div>
  ),
};

/** 🛑 `RadioGroupItem` — the same defect, confirming it as a pattern. */
export const RadioCircle: Story = {
  name: 'RadioGroupItem — same defect',
  args: { checked: false },
  render: () => (
    <div className="flex flex-col gap-4">
      {([false, true] as const).map((checked) => (
        <div key={String(checked)} className="flex flex-wrap items-center gap-4">
          <span className="w-20 text-label-xs text-muted-foreground">
            {checked ? 'checked' : 'unchecked'}
          </span>
          {STATES.map((s) => (
            <div key={s} className="flex flex-col items-center gap-1">
              <RadioGroupItem checked={checked} state={s} />
              <span className="text-caption-xs text-muted-foreground">{s}</span>
            </div>
          ))}
        </div>
      ))}
      <div className="flex items-center gap-3">
        <span className="text-label-xs text-muted-foreground">indicator alone</span>
        <RadioGroupIndicator checked />
        <RadioGroupIndicator checked={false} forceMount />
      </div>
    </div>
  ),
};

/**
 * `RadioGroupRoot`. Its 24 variants collapse to 9 — **orientation carries no colour
 * delta at all**, and `default` and `readOnly` are identical.
 *
 * ⚠️ Note what `invalid` does: it marks **every** item destructive, including
 * unchecked ones. That reads as "this group is wrong", not "this option is wrong".
 * And `disabled` changes only the labels, leaving the circles at full strength.
 */
export const RadioRoot: Story = {
  name: 'RadioGroupRoot — 24 variants, 9 sets',
  args: { checked: false },
  render: () => (
    <div className="flex flex-wrap gap-10">
      {(['default', 'disabled', 'invalid'] as const).map((state) => (
        <RadioGroupRoot key={state} label={`State = ${state}`} state={state}>
          {[0, 1, 2].map((i) => (
            <span key={i} className="flex items-center gap-2">
              <RadioGroupItem
                checked={i === 0}
                state={state === 'invalid' ? 'invalid' : state === 'disabled' ? 'disabled' : 'default'}
              />
              <span
                className={
                  state === 'disabled' ? 'text-body-md text-muted-foreground' : 'text-body-md text-foreground'
                }
              >
                Option {i + 1}
              </span>
            </span>
          ))}
        </RadioGroupRoot>
      ))}
    </div>
  ),
};

/**
 * `DropdownMenuContent`. Its description showed **1 of 24 rows** — nothing could be
 * inferred, and the read settled it in one line: **Side and Align carry no colour
 * delta**. All 24 variants are three binding sets differing only by the arrow.
 *
 * ✅ It also confirmed the `muted-foreground` shortcut colour that
 * `dropdown-menu-item.md` had to assert.
 */
export const MenuContent: Story = {
  name: 'DropdownMenuContent — geometry only',
  args: { checked: false },
  render: () => (
    <div className="flex gap-6">
      {([false, true] as const).map((arrow) => (
        <DropdownMenuContent key={String(arrow)} arrow={arrow} label={`arrow=${arrow}`}>
          <DropdownMenuLabel>Row actions</DropdownMenuLabel>
          <DropdownMenuItem onSelect={() => {}} shortcut="⌘E">
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => {}} shortcut="⌘D">
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => {}} tone="destructive" shortcut="⌫">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      ))}
    </div>
  ),
};

/**
 * `PopoverContent`, `PopoverTrigger` and `PopoverArrow`.
 *
 * 🔎 **`PopoverContent`'s action link binds `primary-readable`** — one of the three
 * tokens the 9 Aug rebind introduced, appearing in **no description anywhere**. That
 * is the single clearest proof that the bindings are current while the descriptions
 * are stale; it was inferred from the dump's silence and is now observed directly.
 *
 * `Popover / Content`'s 48 variants also collapse to three binding sets — size, side
 * and align are all pure geometry.
 */
export const PopoverParts: Story = {
  name: 'PopoverContent — primary-readable',
  args: { checked: false },
  render: () => <PopoverPartsDemo />,
};

function PopoverPartsDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-6">
      <PopoverTrigger open={open} onOpenChange={setOpen}>
        Trigger — open and hover bind identical tokens
      </PopoverTrigger>

      <div className="flex flex-wrap gap-6">
        <PopoverContent
          title="Appointment"
          description="Tuesday 14 August, 10:30."
          action={<a href="#">Reschedule — this link is primary-readable</a>}
          onClose={() => {}}
        />
        <PopoverContent
          size="large"
          title="With an arrow"
          description="Size, side and align carry no colour delta."
          arrow
        />
      </div>

      <div className="relative flex h-16 w-40 items-center justify-center rounded-lg border border-border bg-popover">
        <span className="text-body-sm text-popover-foreground">arrow, four sides</span>
        {(['top', 'right', 'bottom', 'left'] as const).map((s) => (
          <PopoverArrow key={s} side={s} />
        ))}
      </div>

      <div className="relative h-20 overflow-hidden rounded-lg border border-border">
        <PopoverBackdrop open onClick={() => {}} />
        <p className="relative z-50 p-3 text-body-sm text-card">
          🛑 PopoverBackdrop binds `foreground`, which inverts — near-black in light, near-white
          in dark. Switch themes: it should darken in both, and it does not.
        </p>
      </div>
    </div>
  );
}

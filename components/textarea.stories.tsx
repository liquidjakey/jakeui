import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from './textarea.js';
import type { TextareaProps } from './textarea.js';

/**
 * Stories for `Textarea`. Contract: docs/agent/components/textarea.md
 *
 * Textarea is controlled — `value` and `onChange` are required — so every story
 * drives it through local state. That makes the placeholder/filled distinction
 * real: type into it and the text colour changes from `--muted-foreground` to
 * `--foreground`, a state the Figma file cannot show.
 */

/** Controlled wrapper so the field is actually typeable in the canvas. */
function Field({ initial = '', ...props }: Partial<TextareaProps> & { initial?: string }) {
  const [value, setValue] = useState(initial);
  return (
    <Textarea {...(props as TextareaProps)} value={value} onChange={(e) => setValue(e.target.value)} />
  );
}

const meta = {
  title: 'Primitives/Textarea',
  component: Textarea,
  args: { value: '', onChange: () => {} },
  parameters: {
    docs: {
      description: {
        component:
          'Multiline text input. Shares Input’s visual contract token-for-token. The Figma `State` ' +
          'enum (Default · Focused · Error · Disabled) is decomposed: `invalid` and `disabled` are ' +
          'independent booleans and focus is browser-owned. See docs/agent/figma-sync.md.',
      },
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Empty. Placeholder renders in `--muted-foreground`. */
export const Default: Story = {
  render: () => (
    <div className="max-w-sm">
      <Field placeholder="Describe the symptoms" />
    </div>
  ),
};

/** Has a value. Text renders in `--foreground`. */
export const Filled: Story = {
  render: () => (
    <div className="max-w-sm">
      <Field initial={'Patient reports intermittent pain in the upper left molar,\nworse at night.'} />
    </div>
  ),
};

/** Helper text sits below the field and is linked via `aria-describedby`. */
export const WithHelper: Story = {
  render: () => (
    <div className="max-w-sm">
      <Field placeholder="Describe the symptoms" helper="Include onset, duration and severity." />
    </div>
  ),
};

/**
 * With a character limit.
 *
 * The counter is deliberately **not** a live region — a polite region on a
 * counter fires on every keystroke, which is noise. It is linked through
 * `aria-describedby` instead, so it is read when the field takes focus.
 */
export const WithCounter: Story = {
  render: () => (
    <div className="max-w-sm">
      <Field initial="Short note" maxLength={140} helper="Keep it brief." />
    </div>
  ),
};

/** `invalid` only. Border is `--destructive`; the message is in a live region. */
export const Invalid: Story = {
  render: () => (
    <div className="max-w-sm">
      <Field initial="" invalid errorMessage="A description is required." />
    </div>
  ),
};

/** `disabled` only. Fill `--muted`, text `--muted-foreground`, no focus ring. */
export const Disabled: Story = {
  render: () => (
    <div className="max-w-sm">
      <Field initial="This record is locked." disabled />
    </div>
  ),
};

/**
 * **`invalid` AND `disabled` — the state Figma cannot express.**
 *
 * Four variants on one `State` enum leave no way to show both at once. Decided in
 * code, inherited from Input: `--muted` fill from disabled, `--destructive` border
 * retained from invalid so the error stays legible while the control is inert.
 * This story is the only place it can be reviewed.
 */
export const InvalidAndDisabled: Story = {
  name: 'Invalid + Disabled (no Figma variant)',
  render: () => (
    <div className="max-w-sm">
      <Field initial="" invalid disabled errorMessage="A description is required." />
    </div>
  ),
};

/**
 * Every state at once — the review surface.
 *
 * Switch the toolbar Theme to "Side by side" to check Light and Dark together.
 * Tab into the fields to verify the focus ring: 1px `border-ring` plus a 1px
 * inset `ring-ring`, keyed on `focus-visible`.
 *
 * Also worth checking here: **Enter inserts a newline and must not submit.** That
 * is the one place Textarea's keyboard contract diverges from Input's.
 */
export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      {[
        ['Default (placeholder)', { placeholder: 'Describe the symptoms' }],
        ['Filled', { initial: 'Intermittent pain, worse at night.' }],
        ['With helper', { placeholder: 'Describe…', helper: 'Include onset and severity.' }],
        ['With counter', { initial: 'Short note', maxLength: 140 }],
        ['Invalid', { initial: '', invalid: true, errorMessage: 'A description is required.' }],
        ['Disabled', { initial: 'This record is locked.', disabled: true }],
        [
          'Invalid + Disabled',
          { initial: '', invalid: true, disabled: true, errorMessage: 'A description is required.' },
        ],
      ].map(([label, props]) => (
        <div key={label as string} className="flex flex-col gap-1">
          <span className="text-label-xs text-muted-foreground">{label as string}</span>
          <Field {...(props as Partial<TextareaProps>)} />
        </div>
      ))}
    </div>
  ),
};

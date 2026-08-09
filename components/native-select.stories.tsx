import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { NativeSelect } from './native-select.js';
import type { NativeSelectProps, NativeSelectOption } from './native-select.js';

/**
 * Stories for `NativeSelect`. Contract: docs/components/native-select.md
 *
 * This is the **native** control on purpose. The option menu is drawn by the OS
 * and cannot be themed — only the closed control is ours to style. Open the menu
 * in the canvas and you are looking at the platform, not at Jake UI.
 *
 * Note what is NOT here: an `Open` story driven by a prop. The Figma master has an
 * `Open` variant and `figma.map.json` lists `controlled: ["open"]`, but a native
 * select's menu cannot be opened programmatically, and `Open` binds tokens
 * identical to Focus — because the control is always focused while its menu is up.
 * Tabbing to any field below shows exactly what the Figma `Open` variant depicts.
 */

const OPTIONS: NativeSelectOption[] = [
  { value: 'general', label: 'General check-up' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'ortho', label: 'Orthodontic consult' },
  { value: 'emergency', label: 'Emergency' },
];

/** Controlled wrapper so the select is actually operable in the canvas. */
function Field({
  initial = '',
  options = OPTIONS,
  ...props
}: Partial<NativeSelectProps> & { initial?: string }) {
  const [value, setValue] = useState(initial);
  return (
    <NativeSelect
      {...(props as NativeSelectProps)}
      options={options}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

const meta = {
  title: 'Primitives/NativeSelect',
  component: NativeSelect,
  args: { value: '', options: OPTIONS, onChange: () => {} },
  parameters: {
    docs: {
      description: {
        component:
          'Native select styled with Jake UI semantics. The Figma `State` enum decomposes three ways: ' +
          '`Focused` is browser-owned, `Error`/`Disabled` are independent booleans, and `Open` becomes ' +
          'nothing at all — the platform owns the menu. See docs/components/native-select.md Table 2.',
      },
    },
  },
} satisfies Meta<typeof NativeSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

/** No selection. The placeholder option renders in `--muted-foreground`. */
export const Default: Story = {
  render: () => (
    <div className="max-w-sm">
      <Field placeholder="Select an appointment type" />
    </div>
  ),
};

/** A value is chosen. Text renders in `--foreground`. */
export const Selected: Story = {
  render: () => (
    <div className="max-w-sm">
      <Field initial="cleaning" placeholder="Select an appointment type" />
    </div>
  ),
};

/** `invalid` only. Border is `--destructive`; the message is in a live region. */
export const Invalid: Story = {
  render: () => (
    <div className="max-w-sm">
      <Field placeholder="Select an appointment type" invalid errorMessage="Choose an appointment type." />
    </div>
  ),
};

/** `disabled` only. Fill `--muted`, text `--muted-foreground`, no focus ring. */
export const Disabled: Story = {
  render: () => (
    <div className="max-w-sm">
      <Field initial="ortho" disabled />
    </div>
  ),
};

/**
 * **`invalid` AND `disabled` — the state Figma cannot express.**
 *
 * Five variants on one `State` enum, none of which combine. Decided in code and
 * inherited from Input: `--muted` fill from disabled, `--destructive` border kept
 * from invalid. This story is the only place it can be reviewed.
 */
export const InvalidAndDisabled: Story = {
  name: 'Invalid + Disabled (no Figma variant)',
  render: () => (
    <div className="max-w-sm">
      <Field placeholder="Select an appointment type" invalid disabled errorMessage="Choose an appointment type." />
    </div>
  ),
};

/** Individual options can be disabled independently of the control. */
export const WithDisabledOption: Story = {
  name: 'With a disabled option',
  render: () => (
    <div className="max-w-sm">
      <NativeSelectDisabledOptionDemo />
    </div>
  ),
};

function NativeSelectDisabledOptionDemo() {
  const [value, setValue] = useState('');
  return (
    <NativeSelect
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Select an appointment type"
      options={[
        { value: 'general', label: 'General check-up' },
        { value: 'cleaning', label: 'Cleaning' },
        { value: 'ortho', label: 'Orthodontic consult — fully booked', disabled: true },
        { value: 'emergency', label: 'Emergency' },
      ]}
    />
  );
}

/**
 * Every state at once — the review surface.
 *
 * Switch the toolbar Theme to "Side by side" to check Light and Dark together.
 * Tab through to verify the focus ring, which is also what Figma's `Open` variant
 * depicts. Type a letter while focused to confirm platform type-ahead still works
 * — that behaviour is the reason this is a native control and must not be
 * re-implemented.
 */
export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      {[
        ['Default (placeholder)', { placeholder: 'Select an appointment type' }],
        ['Selected', { initial: 'cleaning' }],
        [
          'Invalid',
          { placeholder: 'Select an appointment type', invalid: true, errorMessage: 'Choose an appointment type.' },
        ],
        ['Disabled', { initial: 'ortho', disabled: true }],
        [
          'Invalid + Disabled',
          {
            placeholder: 'Select an appointment type',
            invalid: true,
            disabled: true,
            errorMessage: 'Choose an appointment type.',
          },
        ],
      ].map(([label, props]) => (
        <div key={label as string} className="flex flex-col gap-1">
          <span className="text-label-xs text-muted-foreground">{label as string}</span>
          <Field {...(props as Partial<NativeSelectProps>)} />
        </div>
      ))}
    </div>
  ),
};

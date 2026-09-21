import { useId, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MagnifyingGlass, X } from '@phosphor-icons/react';
import { Input } from './input.js';
import type { InputProps } from './input.js';

/**
 * Stories for `Input`. Contract: docs/agent/components/input.md
 *
 * Input is controlled — `value` and `onChange` are required — so every story
 * drives it through local state rather than passing a static value. That also
 * makes the placeholder/filled distinction real: type into it and the text
 * colour changes from `--muted-foreground` to `--foreground`.
 */

/** Controlled wrapper so the field is actually typeable in the canvas. */
function Field({ initial = '', ...props }: Partial<InputProps> & { initial?: string }) {
  const [value, setValue] = useState(initial);
  const id = useId();
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-label-md">
        {props.invalid
          ? 'Email address'
          : props.placeholder?.includes('Search')
            ? 'Search patients'
            : 'Patient name'}
      </label>
      <Input {...props} id={id} value={value} onChange={(e) => setValue(e.target.value)} />
    </div>
  );
}

const meta = {
  title: 'Primitives/Input',
  component: Input,
  // `value` and `onChange` are required, and every story supplies its own via
  // <Field>. These satisfy the type at the meta level so stories can be pure
  // `render` without restating them.
  args: { value: '', onChange: () => {} },
  parameters: {
    docs: {
      description: {
        component:
          'Single-line text input. The Figma `State` enum (Default · Focused · Error · Disabled) ' +
          'is decomposed: `invalid` and `disabled` are independent booleans and focus is browser-owned. ' +
          'See docs/agent/figma-sync.md.',
      },
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Empty. Placeholder renders in `--muted-foreground`. */
export const Default: Story = {
  render: () => (
    <div className="max-w-sm">
      <Field placeholder="Search patients" />
    </div>
  ),
};

/** Has a value. Text renders in `--foreground`. */
export const Filled: Story = {
  render: () => (
    <div className="max-w-sm">
      <Field initial="Ada Lovelace" />
    </div>
  ),
};

/** `invalid` only. Border is `--destructive`; the message is in a live region. */
export const Invalid: Story = {
  render: () => (
    <div className="max-w-sm">
      <Field initial="ada@" invalid errorMessage="Enter a valid email address." />
    </div>
  ),
};

/** `disabled` only. Fill `--muted`, text `--muted-foreground`, no focus ring. */
export const Disabled: Story = {
  render: () => (
    <div className="max-w-sm">
      <Field initial="Cannot edit this" disabled />
    </div>
  ),
};

/**
 * **`invalid` AND `disabled` — the state Figma cannot express.**
 *
 * The Figma master has four variants on one `State` enum, so it has no way to
 * show both at once. This combination is decided in code: `--muted` fill from
 * disabled, `--destructive` border retained from invalid so the error stays
 * legible while the control is inert. This story is the only place it can be
 * reviewed.
 */
export const InvalidAndDisabled: Story = {
  name: 'Invalid + Disabled (no Figma variant)',
  render: () => (
    <div className="max-w-sm">
      <Field initial="ada@" invalid disabled errorMessage="Enter a valid email address." />
    </div>
  ),
};

/** Icon slots. Both are code-only — the Figma master has no INSTANCE_SWAP for them. */
export const WithIcons: Story = {
  name: 'With icons (code-only slots)',
  render: () => (
    <div className="flex max-w-sm flex-col gap-3">
      <Field placeholder="Search" leadingIcon={<MagnifyingGlass size={16} />} />
      <Field initial="Filter applied" trailingIcon={<X size={16} />} />
      <Field
        placeholder="Both"
        leadingIcon={<MagnifyingGlass size={16} />}
        trailingIcon={<X size={16} />}
      />
    </div>
  ),
};

/**
 * Every state at once — the review surface.
 *
 * Switch the toolbar Theme to "Side by side" to check Light and Dark together.
 * Tab into the fields to verify the focus ring: it is 1px `border-ring` plus a
 * 1px inset `ring-ring`, keyed on `has-[:focus-visible]` so it appears on
 * browser-determined focus-visible, including pointer focus on text inputs.
 */
export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      {[
        ['Default (placeholder)', { placeholder: 'Search patients' }],
        ['Filled', { initial: 'Ada Lovelace' }],
        [
          'Invalid',
          { initial: 'ada@', invalid: true, errorMessage: 'Enter a valid email address.' },
        ],
        ['Disabled', { initial: 'Cannot edit this', disabled: true }],
        [
          'Invalid + Disabled',
          {
            initial: 'ada@',
            invalid: true,
            disabled: true,
            errorMessage: 'Enter a valid email address.',
          },
        ],
      ].map(([label, props]) => (
        <div key={label as string} className="flex flex-col gap-1">
          <span className="text-label-xs text-muted-foreground">{label as string}</span>
          <Field {...(props as Partial<InputProps>)} />
        </div>
      ))}
    </div>
  ),
};

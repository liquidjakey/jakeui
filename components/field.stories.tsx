import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field } from './field.js';
import { Input } from './input.js';
import { Textarea } from './textarea.js';
import { NativeSelect } from './native-select.js';

/**
 * Stories for `Field`.
 * Contract: docs/components/field.md
 *
 * Field owns the accessibility wiring. Inspect any field below in the DOM and the
 * `<label for>`, `aria-describedby`, `aria-invalid` and `id` all line up without
 * the control doing anything — that is the whole point of the component.
 *
 * **Note what is NOT passed to the controls: `errorMessage`.** Input, Textarea and
 * NativeSelect all render their own error if given one, which would produce two
 * messages and two live regions inside a Field. Field owns the message; the
 * control only receives `aria-invalid` and `aria-describedby`.
 */

const meta = {
  title: 'Primitives/Field',
  component: Field,
  parameters: {
    docs: {
      description: {
        component:
          'Composed form field. Generates the control id and binds label-for, aria-describedby ' +
          'and aria-invalid onto the control it wraps. The Figma `Value` property has no code ' +
          'equivalent — the control is a child here, so Field must not own its value.',
      },
    },
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The basic case: label, control, helper text. */
export const Default: Story = {
  args: { label: 'Full name', children: () => null },
  render: () => {
    return <NameField />;
  },
};

function NameField() {
  const [value, setValue] = useState('');
  return (
    <div className="max-w-sm">
      <Field label="Full name" helperText="As it appears on the patient record.">
        {(control) => (
          <Input {...control} value={value} onChange={(e) => setValue(e.target.value)} />
        )}
      </Field>
    </div>
  );
}

/**
 * Invalid. Helper text and error are shown **together** — the record's dont:
 * "Do not replace helper text with the error, a user often needs both."
 */
export const Invalid: Story = {
  args: { label: 'Email', children: () => null },
  render: () => <EmailField />,
};

function EmailField() {
  const [value, setValue] = useState('ada@');
  return (
    <div className="max-w-sm">
      <Field
        label="Email"
        requirement="required"
        helperText="We use this for appointment reminders."
        invalid
        errorMessage="Enter a valid email address."
      >
        {(control) => (
          <Input {...control} value={value} onChange={(e) => setValue(e.target.value)} />
        )}
      </Field>
    </div>
  );
}

/**
 * Field wraps any control. The wiring is identical for all three — none of them
 * knows it is inside a Field.
 */
export const AcrossControls: Story = {
  name: 'Across every control',
  args: { label: 'Demo', children: () => null },
  render: () => <AcrossControlsDemo />,
};

function AcrossControlsDemo() {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [kind, setKind] = useState('');
  return (
    <div className="flex max-w-sm flex-col gap-4">
      <Field label="Full name" requirement="required" helperText="First and last.">
        {(c) => <Input {...c} value={name} onChange={(e) => setName(e.target.value)} />}
      </Field>

      <Field label="Appointment type" requirement="optional">
        {(c) => (
          <NativeSelect
            {...c}
            value={kind}
            onChange={(e) => setKind(e.target.value)}
            placeholder="Select one"
            options={[
              { value: 'general', label: 'General check-up' },
              { value: 'cleaning', label: 'Cleaning' },
            ]}
          />
        )}
      </Field>

      <Field label="Notes" helperText="Include onset and severity.">
        {(c) => <Textarea {...c} value={notes} onChange={(e) => setNotes(e.target.value)} />}
      </Field>
    </div>
  );
}

/** Disabled propagates from Field to both the Label and the control. */
export const Disabled: Story = {
  args: { label: 'Locked', children: () => null },
  render: () => (
    <div className="max-w-sm">
      <Field label="Record ID" helperText="Assigned automatically." disabled>
        {(control) => <Input {...control} value="PT-004821" onChange={() => {}} />}
      </Field>
    </div>
  ),
};

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field } from './field.js';
import { Input } from './input.js';
import { Textarea } from './textarea.js';
import { NativeSelect } from './native-select.js';
import { Separator } from './separator.js';
import { Label } from './label.js';

/**
 * Stories for `Field`, `Label` and `Separator`. Contracts:
 * docs/components/field.md · label.md · separator.md
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

/**
 * `Label` on its own, showing all three marker states.
 *
 * The third — no marker at all — has no Figma variant, and it is the default,
 * because the record's dont says to mark only whichever of required/optional is
 * rarer. The marker is `aria-hidden`: required state reaches assistive technology
 * through the control's own `required`, not through the glyph.
 */
export const LabelVariants: Story = {
  name: 'Label — marker states',
  args: { label: 'n/a', children: () => null },
  render: () => (
    <div className="flex flex-col gap-3">
      <Label htmlFor="demo-a">No marker (default, no Figma variant)</Label>
      <Label htmlFor="demo-b" requirement="required">
        Required
      </Label>
      <Label htmlFor="demo-c" requirement="optional">
        Optional
      </Label>
      <Label htmlFor="demo-d" disabled>
        Disabled
      </Label>
    </div>
  ),
};

/**
 * `Separator` in both orientations.
 *
 * Both bind the same single token, `border` — only the axis changes. The
 * `decorative` prop has no visual effect at all and no Figma variant; it decides
 * whether the rule is `aria-hidden` or a real `role="separator"`.
 */
export const Separators: Story = {
  name: 'Separator — orientations',
  args: { label: 'n/a', children: () => null },
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-3">
        <span className="text-label-xs text-muted-foreground">Horizontal (decorative)</span>
        <span className="text-body-md text-foreground">Above</span>
        <Separator />
        <span className="text-body-md text-foreground">Below</span>
      </div>

      <div className="flex h-10 items-center gap-3">
        <span className="text-body-md text-foreground">Left</span>
        <Separator orientation="vertical" />
        <span className="text-body-md text-foreground">Right</span>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-label-xs text-muted-foreground">
          Semantic (role=&quot;separator&quot;, announced)
        </span>
        <Separator decorative={false} />
      </div>
    </div>
  ),
};

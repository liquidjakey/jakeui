import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select } from "./select.js";
import type { SelectOption, SelectProps } from "./select.js";
import { Field } from "./field.js";
import { Button } from "./button.js";

const OPTIONS: SelectOption[] = [
  { value: "general", label: "General check-up" },
  { value: "cleaning", label: "Cleaning" },
  {
    value: "ortho",
    label: "Orthodontic consult (fully booked)",
    disabled: true,
  },
  { value: "emergency", label: "Emergency" },
];
const meta = {
  title: "Primitives/Select",
  component: Select,
  args: { value: "", options: OPTIONS, onValueChange: () => {} },
  parameters: {
    docs: {
      description: {
        component:
          "Styled single-choice combobox. Opens below the field with a gap and flips at viewport edges. Use NativeSelect when platform-native picker behavior is preferred.",
      },
    },
  },
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

function Example({
  label = "Appointment type",
  initial = "",
  ...props
}: Partial<SelectProps> & { label?: string; initial?: string }) {
  const [value, setValue] = useState(initial);
  return (
    <Field
      label={label}
      helperText="Choose one available option."
      invalid={props.invalid}
      disabled={props.disabled}
      errorMessage={props.errorMessage}
    >
      {(control) => (
        <Select
          {...props}
          {...control}
          options={props.options ?? OPTIONS}
          value={value}
          onValueChange={setValue}
          errorMessage={undefined}
        />
      )}
    </Field>
  );
}

export const Default: Story = {
  render: () => (
    <div className="max-w-sm">
      <Example />
    </div>
  ),
};
export const AllStates: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      <Example label="No selection" />
      <Example label="Selected" initial="cleaning" />
      <Example
        label="Invalid"
        invalid
        errorMessage="Choose an appointment type."
      />
      <Example label="Disabled" initial="general" disabled />
      <Example
        label="Invalid and disabled"
        invalid
        disabled
        errorMessage="Choices are unavailable."
      />
      <Example label="Empty options" options={[]} />
    </div>
  ),
};
export const LongList: Story = {
  render: () => (
    <div className="max-w-sm">
      <Example
        options={Array.from({ length: 30 }, (_, i) => ({
          value: String(i + 1),
          label: `Clinic ${String(i + 1).padStart(2, "0")}: extended consultation and follow-up appointment`,
        }))}
      />
    </div>
  ),
};
export const RTL: Story = {
  render: () => (
    <div dir="rtl" className="max-w-sm">
      <Example
        label="نوع الموعد"
        options={[
          { value: "general", label: "فحص عام" },
          { value: "followup", label: "موعد متابعة" },
        ]}
      />
    </div>
  ),
};
export const NearViewportEdge: Story = {
  render: () => (
    <div className="flex min-h-[calc(100dvh-4rem)] max-w-sm items-end">
      <div className="w-full">
        <Example />
      </div>
    </div>
  ),
};
export const Form: Story = {
  render: () => <FormExample />,
};
function FormExample() {
  const [value, setValue] = useState("");
  const [saved, setSaved] = useState("");
  return (
    <form
      className="flex max-w-sm flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(String(new FormData(event.currentTarget).get("appointment")));
      }}
      onReset={() => {
        setValue("");
        setSaved("");
      }}
    >
      <label
        htmlFor="styled-appointment"
        className="text-label-md text-foreground"
      >
        Appointment type
      </label>
      <Select
        id="styled-appointment"
        name="appointment"
        value={value}
        onValueChange={setValue}
        options={OPTIONS}
        required
      />
      <div className="flex gap-2">
        <Button type="submit">Save appointment</Button>
        <Button type="reset" style="outline">
          Reset
        </Button>
      </div>
      <p role="status" className="text-body-sm text-muted-foreground">
        {saved ? `Saved: ${saved}` : "Choose an option, then save."}
      </p>
    </form>
  );
}

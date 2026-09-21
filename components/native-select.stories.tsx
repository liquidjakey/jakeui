import { useId, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button.js";
import { NativeSelect } from "./native-select.js";
import type { NativeSelectProps, NativeSelectOption } from "./native-select.js";

/**
 * Browser-owned popup with a consistently inset indicator. Test the actual platform popup manually;
 * Jake UI has no controlled open prop.
 * Consumer contract: docs/agent/components/native-select.md.
 */

const OPTIONS: NativeSelectOption[] = [
  { value: "general", label: "General check-up" },
  { value: "cleaning", label: "Cleaning" },
  { value: "ortho", label: "Orthodontic consult" },
  { value: "emergency", label: "Emergency" },
];

/** Controlled wrapper so the select is actually operable in the canvas. */
function Field({
  label = "Appointment type",
  initial = "",
  options = OPTIONS,
  ...props
}: Partial<NativeSelectProps> & { initial?: string; label?: string }) {
  const [value, setValue] = useState(initial);
  const id = useId();
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="text-label-md text-foreground">
        {label}
      </label>
      <NativeSelect
        {...(props as NativeSelectProps)}
        id={id}
        options={options}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}

const meta = {
  title: "Primitives/NativeSelect",
  component: NativeSelect,
  args: { value: "", options: OPTIONS, onChange: () => {} },
  parameters: {
    docs: {
      description: {
        component:
          "Native select styled with Jake UI semantics. The Figma `State` enum decomposes three ways: " +
          "`Focused` is browser-owned, `Error`/`Disabled` are independent booleans, and `Open` becomes " +
          "nothing at all — the platform owns the menu. See docs/agent/components/native-select.md.",
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
      <Field
        placeholder="Select an appointment type"
        invalid
        errorMessage="Choose an appointment type."
      />
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
  name: "Invalid + Disabled (no Figma variant)",
  render: () => (
    <div className="max-w-sm">
      <Field
        placeholder="Select an appointment type"
        invalid
        disabled
        errorMessage="Choose an appointment type."
      />
    </div>
  ),
};

/** Individual options can be disabled independently of the control. */
export const WithDisabledOption: Story = {
  name: "With a disabled option",
  render: () => (
    <div className="max-w-sm">
      <NativeSelectDisabledOptionDemo />
    </div>
  ),
};

function NativeSelectDisabledOptionDemo() {
  const [value, setValue] = useState("");
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor="disabled-option-select"
        className="text-label-md text-foreground"
      >
        Appointment type
      </label>
      <NativeSelect
        id="disabled-option-select"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Select an appointment type"
        options={[
          { value: "general", label: "General check-up" },
          { value: "cleaning", label: "Cleaning" },
          {
            value: "ortho",
            label: "Orthodontic consult — fully booked",
            disabled: true,
          },
          { value: "emergency", label: "Emergency" },
        ]}
      />
    </div>
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
  name: "All states",
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      {[
        [
          "Default (placeholder)",
          { placeholder: "Select an appointment type" },
        ],
        ["Selected", { initial: "cleaning" }],
        [
          "Invalid",
          {
            placeholder: "Select an appointment type",
            invalid: true,
            errorMessage: "Choose an appointment type.",
          },
        ],
        ["Disabled", { initial: "ortho", disabled: true }],
        [
          "Invalid + Disabled",
          {
            placeholder: "Select an appointment type",
            invalid: true,
            disabled: true,
            errorMessage: "Choose an appointment type.",
          },
        ],
      ].map(([label, props]) => (
        <div key={label as string} className="flex flex-col gap-1">
          <Field
            label={label as string}
            {...(props as Partial<NativeSelectProps>)}
          />
        </div>
      ))}
    </div>
  ),
};

export const EdgeCases: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      <Field
        label="Long selected value"
        initial="long"
        options={[
          {
            value: "long",
            label:
              "A very long appointment type that should not collide with the indicator or overflow the field",
          },
        ]}
      />
      <div dir="rtl">
        <Field
          label="نوع الموعد"
          placeholder="اختر نوع الموعد"
          options={[
            { value: "general", label: "فحص عام" },
            { value: "followup", label: "موعد متابعة" },
          ]}
        />
      </div>
      <Field label="Empty options" options={[]} />
    </div>
  ),
};
export const Form: Story = {
  render: () => <NativeForm />,
};
function NativeForm() {
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
        htmlFor="native-appointment"
        className="text-label-md text-foreground"
      >
        Appointment type
      </label>
      <NativeSelect
        id="native-appointment"
        name="appointment"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        required
        placeholder="Select an appointment type"
        options={OPTIONS}
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

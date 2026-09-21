import {
  Button,
  Checkbox,
  DatePicker,
  Field,
  Input,
  NativeSelect,
  Select,
} from "jakeui";
import type { DateRange } from "jakeui";

// Compilation is the assertion: each forbidden shape must remain a type error.
// @ts-expect-error Figma Label is children, not Button.label.
<Button label="Save" />;
// @ts-expect-error Jake UI uses style and full size names, not shadcn props.
<Button variant="default" size="sm">
  Save
</Button>;
// @ts-expect-error Checkbox is controlled through checked/onCheckedChange.
<Checkbox label="Updates" value="Checked" />;
// @ts-expect-error Calendar popup visibility is owned internally.
<DatePicker label="Date" value={undefined} onChange={() => {}} open />;
// @ts-expect-error Range mode cannot receive a single Date.
<DatePicker label="Date" mode="range" value={new Date()} onChange={() => {}} />;
// @ts-expect-error Field receives a control render function, not a value prop.
<Field label="Name" value="Ada">
  {(control) => <Input {...control} value="Ada" onChange={() => {}} />}
</Field>;
// @ts-expect-error Native select popup state is browser-owned.
<NativeSelect value="a" options={[]} onChange={() => {}} open />;
// @ts-expect-error Styled Select commits values; it does not emit native change events.
<Select value="" options={[]} onChange={() => {}} />;
// @ts-expect-error Select owns its popup state; foreign trigger/content APIs do not apply.
<Select value="" options={[]} onValueChange={() => {}} open />;

<Field label="Service" requirement="required">
  {(control) => (
    <Select {...control} value="" options={[]} onValueChange={() => {}} />
  )}
</Field>;

<Button style="outline" size="small" name="save" aria-label="Save">
  Save
</Button>;
<Checkbox label="Updates" checked="indeterminate" onCheckedChange={() => {}} />;
<DatePicker
  label="Date"
  mode="range"
  value={[new Date()]}
  onChange={() => {}}
/>;
// @ts-expect-error Jake UI DateRange is a tuple, not another library's object shape.
const foreignRange: DateRange = { from: new Date() };
<DatePicker
  label="Date"
  mode="range"
  value={foreignRange}
  onChange={() => {}}
/>;

import { useState } from "react";
import type { FormEvent } from "react";
import {
  Button,
  Field,
  Input,
  NativeSelect,
  Select,
  Checkbox,
  DataTable,
  Table,
  TableCaption,
  TableRow,
  TableHead,
  TableCell,
  Pagination,
  Popover,
} from "jakeui";
import { cn } from "jakeui/utils";

/** Use Select when the popup must be anchored; NativeSelect keeps the platform picker. */
export function AppointmentChoice() {
  const [value, setValue] = useState("");
  return (
    <Field label="Appointment type" helperText="Choose the service you need.">
      {(control) => (
        <Select
          {...control}
          name="appointmentType"
          value={value}
          onValueChange={setValue}
          options={[
            { value: "general", label: "General consultation" },
            { value: "cleaning", label: "Cleaning" },
            { value: "orthodontics", label: "Orthodontics", disabled: true },
          ]}
        />
      )}
    </Field>
  );
}

export interface Preferences {
  name: string;
  frequency: string;
  updates: boolean;
}

export function PreferencesForm({
  onSave,
}: {
  onSave: (value: Preferences) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState("weekly");
  const [updates, setUpdates] = useState(false);
  const [nameError, setNameError] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const saving = state === "saving";
  function changed() {
    setState("idle");
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    if (!name.trim()) {
      setNameError("Enter a name.");
      return;
    }
    setNameError("");
    setState("saving");
    try {
      await onSave({ name: name.trim(), frequency, updates });
      setState("saved");
    } catch {
      setState("error");
    }
  }
  return (
    <form
      aria-label="Preferences"
      className="flex flex-col gap-5"
      onSubmit={submit}
    >
      <h2 className="text-heading-lg">Preferences</h2>
      <Field
        label="Display name"
        requirement="required"
        invalid={Boolean(nameError)}
        errorMessage={nameError}
        helperText="Shown to people in your workspace."
        disabled={saving}
      >
        {(control) => (
          <Input
            {...control}
            name="displayName"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setNameError("");
              changed();
            }}
          />
        )}
      </Field>
      <Field label="Summary frequency" disabled={saving}>
        {(control) => (
          <NativeSelect
            {...control}
            name="frequency"
            value={frequency}
            options={[
              { value: "weekly", label: "Weekly" },
              { value: "monthly", label: "Monthly" },
            ]}
            onChange={(event) => {
              setFrequency(event.target.value);
              changed();
            }}
          />
        )}
      </Field>
      <Checkbox
        label="Send product updates"
        checked={updates}
        disabled={saving}
        onCheckedChange={(checked) => {
          setUpdates(checked);
          changed();
        }}
      />
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save preferences"}
        </Button>
        <p
          role="status"
          className={cn(
            "text-body-sm",
            state === "error"
              ? "text-destructive-readable"
              : "text-muted-foreground",
          )}
        >
          {state === "saved"
            ? "Preferences saved."
            : saving
              ? "Saving preferences…"
              : state === "error"
                ? "Could not save. Try again."
                : ""}
        </p>
      </div>
    </form>
  );
}

export interface RecordRow {
  id: string;
  name: string;
  role: string;
}

export function RecordsTable({
  rows,
  loading = false,
  error,
}: {
  rows: RecordRow[];
  loading?: boolean;
  error?: string;
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const filtered = rows.filter((row) =>
    `${row.name} ${row.role}`.toLowerCase().includes(query.toLowerCase()),
  );
  const pageSize = 2;
  const pageCount = Math.ceil(filtered.length / pageSize);
  const currentPage = Math.max(1, Math.min(page, pageCount));
  const visible = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  return (
    <DataTable
      title="Workspace members"
      empty={filtered.length === 0}
      loading={loading}
      error={error}
      emptyMessage="No members match your search."
      toolbar={
        <div className="flex flex-col gap-2">
          <Field label="Search members">
            {(control) => (
              <Input
                {...control}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
              />
            )}
          </Field>
          <p role="status" className="text-body-sm text-muted-foreground">
            {!loading && !error
              ? `${filtered.length} ${filtered.length === 1 ? "member" : "members"} found.`
              : ""}
          </p>
        </div>
      }
      pagination={
        !loading && !error && pageCount > 1 ? (
          <Pagination
            page={currentPage}
            pageCount={pageCount}
            onPageChange={setPage}
            label="Members pages"
          />
        ) : undefined
      }
    >
      <Table label="Workspace members" density="comfortable">
        <TableCaption>Names and workspace roles</TableCaption>
        <thead>
          <TableRow type="header">
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </thead>
        <tbody>
          {visible.map((row) => (
            <TableRow key={row.id}>
              <TableCell emphasis="strong">{row.name}</TableCell>
              <TableCell>{row.role}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </DataTable>
  );
}

export function DetailsPopover() {
  const [open, setOpen] = useState(false);
  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      title="Workspace visibility"
      trigger={<Button style="outline">Visibility details</Button>}
    >
      <div className="flex flex-col gap-4">
        <p className="text-body-sm text-muted-foreground">
          Only invited members can see this workspace.
        </p>
        <Button style="secondary" onClick={() => setOpen(false)}>
          Got it
        </Button>
      </div>
    </Popover>
  );
}

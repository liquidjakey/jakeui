# Tested compositions

Copy the relevant exported function from [examples/recipes.tsx](../../examples/recipes.tsx), not the library implementation. These examples import the public package and are typechecked, production-built and exercised in the packed consumer fixture.

| Task | Recipe | Application owns |
|---|---|---|
| Edit a setting | `PreferencesForm` | Controlled values, validation, submission, pending/error/success feedback |
| Browse records | `RecordsTable` | Search, rows, page state and slicing; explicit loading/error/empty state |
| Supplementary action | `DetailsPopover` | Controlled visibility and action outcome; Popover owns anchoring and focus/dismissal |
| Anchored single-choice field | `AppointmentChoice` | Selected value and options; Select owns keyboard navigation and popup placement |

`PreferencesForm` accepts an async `onSave` callback. The example fixture uses a resolved promise; connect a real persistence operation in production. Do not present the sample as a backend integration.

`RecordsTable` uses native `thead`/`tbody`, TableCaption first, and the Table family's actual exports. The supplied row data is a fixture, not a domain schema. Pass the real fetch state instead of inferring it from absent rows.

`AppointmentChoice` uses `Select.onValueChange(value)`, not `NativeSelect.onChange(event)`. Use `NativeSelect` when you want a platform picker. For either controlled component, a form's `onReset` must restore application state; the component keeps its native form value synchronized with that state.

For other patterns use the selected component reference's source-story links in the checkout. Stories are illustrative states, not all production-ready flows; some intentionally show visual anatomy and controlled fixtures. They are not shipped as runtime code in the installed package.

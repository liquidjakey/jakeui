# Agent workflow

## Consume: build a frontend from existing components

1. Translate the brief into tasks, data, actions, navigation and feedback states. Identify missing product decisions (for example, whether a destructive action is reversible). Ask about decisions that change the flow; ordinary component selection is your job.
2. Read [design rules](design.md). Search the [component index](components.md) by purpose. Inspect the exact component references and [recipe](recipes.md) for each selected pattern.
3. Record a short implementation inventory: existing exports, application-owned layout/data, empty/loading/error states, and any missing capability. Completion: every planned interactive element has a known component or an explicit extension decision.
4. Implement using public imports. Keep application state controlled as required. Propagate Field wiring, connect menu controls/id, supply accessible names, and preserve focus/dismissal behavior. Use local application wrappers to share composition, not to fork the library's internals.
5. Verify the actual screen: app typecheck/build/tests; `agent:lint` on application source; keyboard-only use; light and dark; narrow and wide layouts; long/missing data; disabled/loading/error states. Check screenshots and computed styles, not only source class strings.
6. Hand off what changed, what was tested, remaining limitations, and any explicitly approved exception. A passing static check is not proof of universal usability.

## Choose the smallest appropriate interaction

- Page navigation: NavigationMenu/SidebarNavigationItem or a normal link. Peer content panels: Tabs (SegmentedTab is its item, not a complete group). Compact option selection without panels: ToggleGroup or RadioGroup according to the task. Boolean setting: Switch. Form choice applied later: Checkbox or RadioGroup.
- Plain choice list: NativeSelect for a platform picker, Select for a consistently styled anchored listbox. Commands/actions: DropdownMenu. Tooltip: optional text only. Click-accessible supplementary interaction: Popover. Blocking focused task: Dialog. Consequential confirmation: AlertDialog.
- Data list: Table. Filtering, pagination and loading shell: DataTable plus application state. There is no built-in sorting/filtering engine.
- Known far-away date such as birthdate: assess a direct date-entry flow. DatePicker provides calendar context but does not currently expose date restrictions or full calendar localization.
- Read the selected reference for exceptions. A design-only name or visual anatomy is not a complete interactive export.

## Extend: when the system does not fit

First explain the unmet user task, the closest existing component, and why composition cannot solve it. Distinguish a product layout (application-owned) from a new reusable primitive (library-owned). Ask for approval when the proposed change expands the requested behavior/design.

For an approved library extension: define the public interface and states; update source and curated usage; add a representative story, interaction coverage and a public-import recipe when needed; document token/behavior exceptions in the scoped registry; run `agent:sync` and all checks. New public exports must be discoverable and story-covered. Do not add props solely because Figma has an axis with that name.

### Keep agent guidance current

Put the current decision first. Prop semantics belong in source JSDoc (generated into the manifest and component references); cross-component composition and selection rules belong in `agent/usage.json`. Keep local comments for non-obvious implementation rationale. Document current constraints and the rationale needed to preserve them; do not add resolved audit chronology to the shared system.

When changing a component, read its implementation and affected stories, update explanatory story copy as well as usage, then regenerate the references. Consumer work only needs the selected references and recipes; inspect source when extending, debugging or reconciling a conflict. Regeneration checks consistency, not the truth of prose: compare descriptions against the behavior and test the affected states.

## Sync: reconcile Figma evidence

Only a task explicitly including Figma changes authorizes changing the design file. Local exports are generated from committed dumps, never manually edited. Preserve approved runtime exceptions until their retirement criteria are met. Reconcile transforms in `agent/figma-transforms.json`; a component's TypeScript type remains the public interface.

For input files and classification rules read [Figma synchronization](figma-sync.md). Use repository-root npm scripts. `map:sync` preserves code bindings and refuses disappearing implemented assets. Follow with `agent:sync` and `check`. Never fabricate a fresh Figma verification timestamp or a live binding observation.

## Source precedence

Public interface → TypeScript. Consumer design rules → [design.md](design.md). Named deviations → [exceptions](../../agent/exceptions.json). Figma facts → committed dumps. Generated files must match their inputs; unexpected disagreement stops the task for reconciliation.

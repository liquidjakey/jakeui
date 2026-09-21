# Verification

Run `npm run check` after library changes. Report results from the current run, not a previous completion report.

## Enforced contracts

- `tokens:check`: exported values and annotations match their committed generation inputs.
- `map:check`: direct Figma bindings match compiler-derived props; reviewed transformations remain distinct from props.
- `docs:check`: current references are regenerated exactly, every export is documented, and documentation links resolve.
- `agent:check`: generated contract freshness, export coverage, scoped exceptions, source-JSDoc propagation, representative selection rules, and consumer-lint regression tests.
- `typecheck`: implementation, stories, recipes and positive/negative public-interface fixtures.
- `consumer:check`: packs the actual package, validates shipped context and local documentation links, builds a separate Vite app, and exercises fonts, light/dark layouts, forms, filtering, pagination, loading/error/empty feedback and overlay focus/dismissal. Dependencies are reused from the lockfile installation; this is not an independent registry-install or dependency-security audit.
- `interaction:check`: builds Storybook, verifies computed typography including portalled content, and runs interaction regressions. Reuse a running preview with `npm run interaction:check -- --url http://localhost:6006`.

CI runs the same `npm run check` entry point. Browser checks require Chromium. For consumer work also run `agent:lint` against the application source and the application's own build/tests, then review rendered screens, keyboard behavior and both themes.

## Limits

No repository instruction can guarantee zero drift from every AI agent. An agent must receive the entry-point pointer, use current references, and run the checks. This repository cannot enforce a consuming repository's CI policy unless that application wires these checks into its workflow.

Static consumer lint is a deliberately bounded heuristic: it reads literal source/CSS and common JSX patterns. It is not a full Tailwind evaluator, cannot follow every dynamically computed class/style or detect every custom control, and does not certify visual quality, semantics or accessibility. Application typechecks, screenshots, keyboard testing and accessibility review remain necessary. The lint has no blanket ignore switch; an unmet capability follows the extension workflow.

The browser gates exercise Chromium and representative fixtures, not every combination of props, browsers, assistive technology, locale, content or production data. React 18 compatibility is declared but this checkout's runtime fixture uses the locked React version. Other React versions and server-rendering frameworks require their own validation.

Some exports are visual anatomy, and some recorded assets are design-only. Command is not a complete command palette; Chart is not a charting engine; DataTable does not fetch/filter/sort data; Calendar/DatePicker have localization/date-restriction limits. Select uses an application-rendered listbox; NativeSelect retains the platform picker. Read the selected component constraints before committing to a feature.

Runtime accessibility aliases must remain until their scoped Figma-adoption and contrast criteria are met. A local test run does not verify live Figma bindings.

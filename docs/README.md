# Jake UI documentation

For building a frontend, start at [the agent workflow](agent/workflow.md), then [setup](agent/setup.md), [design rules](agent/design.md), and the selected [component references](agent/components.md). Use [recipes](agent/recipes.md) for common compositions.

## Current sources

- `components/` contains the working React implementations; its public barrel defines available exports. Source JSDoc owns prop semantics.
- `agent/usage.json` owns selection and composition guidance. `agent/design-only.json` lists unavailable design assets.
- `agent/manifest.json` and `docs/agent/components/` are generated current references, not manually maintained copies of interfaces.
- [Color](tokens/color.md) and [typography](tokens/typography.md) explain token roles. [Design rules](agent/design.md) and [scoped exceptions](../agent/exceptions.json) govern consumption.
- [Figma synchronization](agent/figma-sync.md) identifies maintained generation inputs and mapping rules.

## Maintaining the library

For an approved extension follow [the workflow](agent/workflow.md). Update source and current usage, then run `npm run agent:sync` and `npm run check`. Do not edit generated references by hand.

`docs:check` verifies current generated documentation and local links. The [verification guide](agent/verification.md) explains the complete gates and their limits.

# Building with Jake UI

Jake UI is an existing React design system, not a request to invent a visual style.

1. Classify the task: **consume** existing components, **extend** the library, or **sync** Figma evidence. Default frontend work is consume.
2. Read [the workflow](docs/agent/workflow.md) and [design rules](docs/agent/design.md). For first integration also read [setup](docs/agent/setup.md).
3. Find candidates in [the component index](docs/agent/components.md), or use `npm run agent -- search <purpose>` in the design-system checkout. Read only the selected component references; use their actual exports/props. Installed packages provide the index, not the maintainer CLI.
4. Start from [a tested recipe](docs/agent/recipes.md) when the flow matches. Compose existing components before requesting an extension.
5. Follow the verification required by the workflow. Report changed components, tested states/viewports, and remaining limitations.

## Authority

- Public props/types: `components/index.ts` and TypeScript implementations. `agent/manifest.json` and the component references are generated from them.
- Current visual and composition policy: `docs/agent/design.md`; named runtime exceptions: `agent/exceptions.json`.
- Figma intent and exported tokens: the committed `.figma-tokens-dump.json` / `.figma-dump.json` inputs and generated `tokens/globals.css`. `figma.map.json` records correspondence; a `transform` is not a prop.
- Selection and composition: `agent/usage.json`. Current unavailable assets: `agent/design-only.json`. These feed the generated index and references.

If current sources conflict, identify the conflict and ask for the missing decision. Do not repair a contract mismatch by deleting an accessibility fix or widening an exception.

## Guardrails

Use `jakeui` exports, `jakeui/tokens.css`, Phosphor icons, and the shared utilities from `jakeui/utils`. Jake UI's props are not the similarly named shadcn/Radix props.

Keep feature layout and data logic in the consuming application. New design primitives, token roles, interaction contracts, and new exceptions require a scoped extension decision.

After approved interface/usage changes run `npm run agent:sync`, review generated changes, then `npm run check`. For consumer files run `npm run agent:lint -- --path <source-directory>` plus the app's build/tests and rendered verification. Static lint is not visual or accessibility certification.

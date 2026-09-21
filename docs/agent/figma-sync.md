# Figma synchronization

Use this only when maintaining the library's design correspondence or tokens. Frontend consumers use the current component references and public exports.

## Generation inputs

- `.figma-tokens-dump.json`: token values and text styles. Refresh through `scripts/figma-token-query.js` with an authorized Figma connection. `tokens/annotations.json` owns explanatory notes, the font stack and semantic duration aliases.
- `npm run tokens:sync` generates `tokens/globals.css`. Runtime aliases live separately in `tokens/runtime.css`; preserve their [scoped exceptions](../../agent/exceptions.json).
- `.figma-dump.json`: component-set names, node IDs, variant counts and property definitions. Preserve this shape when refreshing from Figma. Do not fabricate live observations.
- `figma.map.json`: Figma-to-code correspondence, including maintained code paths and exports. `agent/figma-transforms.json` owns reviewed composition/state transformations.
- `npm run map:sync` classifies the committed component-set input and preserves existing code bindings. It refuses to drop implemented assets without review. Follow with `npm run agent:sync` and `npm run check`.

The input dumps are maintained generation sources, not frontend instructions. Do not change the live design file unless the task explicitly authorizes it.

## Map design properties to runtime behavior

Figma variant axes do not define a React API. The TypeScript implementation owns the public props.

- Hover, focus and highlighting are browser- or interaction-owned. Do not expose forced-state props.
- Disabled, invalid and read-only conditions can coexist. Use only the independent props actually exposed by that component.
- Checked, selected, open and expanded are runtime state; use the public value/callback pair where exposed. NativeSelect opening remains browser-owned.
- Slots become content nodes or nullable content where the interface supports them, not invented visibility booleans.
- Pattern and Viewport axes describe composition or responsive fixtures; do not invent corresponding props.
- A `transform` entry names public targets, not a direct prop. An empty target list means internal state. Consult the target prop contracts for the required data shape.
- A `decompose` entry is a classification of coexisting states; only its `targets` are public. The appearance-preview enums in SwitchRoot and radio anatomy do not implement interactive controls.

Use the semantic token roles and the complete typography ramp. Keep size/13 and line-height/18 as first-class ramp members. New token roles or changes to behavior require the [extension workflow](workflow.md).

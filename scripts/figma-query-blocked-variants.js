/**
 * Jake UI — read-only query: full state rows for every component the 8-row cap
 * blocked, plus child-node bindings for the three assets that record none.
 *
 * WHY THIS EXISTS
 * `figma-descriptions.md` rule 3 caps a description's ANATOMY block at 8 state rows.
 * For components with more variants than that, the doc record carries an incomplete
 * token contract, so a props table cannot be written without inventing. Eleven
 * components are held back by that, or by tokens living on child nodes the
 * description generator does not read.
 *
 * Five were already recovered without a Figma query, by proving the missing rows sat
 * on an axis the surviving rows showed to be inert (Table / Row, Popover / Trigger,
 * Checkbox, Dropdown Menu / Item, Dropdown Menu / Checkbox Item). The rest cannot be:
 * Popover / Content shows 1 of 48 rows, and nothing follows from that.
 *
 * THIS SCRIPT WRITES NOTHING. It only reads and reports. It is deliberately separate
 * from any fix so it can be run without risk — compare
 * `figma-fix-card-text-binding.js`, which does write and therefore defaults to a
 * dry run.
 *
 * HOW TO RUN
 *   1. Open Figma Desktop with file ovnLtL9xbX8SG5xDw673Un and run the
 *      Figma Console MCP "Desktop Bridge" plugin.
 *   2. Execute the body of this file through the bridge (figma_execute).
 *   3. Save the returned JSON to design-system/.figma-blocked-variants.json
 *      and say so — the props tables for the remaining components can then be
 *      written from it directly.
 *
 * WHAT IT RETURNS, per target component:
 *   - every variant, by its full property combination
 *   - every bound variable on that variant AND on its descendants, with the field
 *     it is bound to (fills, strokes, cornerRadius, …)
 *   - a `childOnly` flag for assets whose tokens are entirely on descendants —
 *     Slider, Skeleton and Popover / Arrow, which each record only
 *     "no root-level bindings"
 *
 * SANDBOX CONSTRAINTS honoured (handoff §3): async getters only; no TextEncoder or
 * crypto.subtle; nothing is mutated, so no baseline or re-scan is needed.
 */

const TARGETS = [
  // blocked by the 8-row cap, not recoverable by inference
  'Button',
  'Switch / Root',
  'Radio Group / Item',
  'Radio Group / Root',
  'Dropdown Menu / Content',
  'Popover / Content',
  'Date Picker',
  // tokens live on child nodes — the generator reads only the root
  'Slider',
  'Skeleton',
  'Popover / Arrow',
  // stale rather than capped: re-read so the post-rebind text tokens are captured
  'Alert',
];

await figma.loadAllPagesAsync();

// name -> variable name, for resolving bound ids back to something readable
const allVars = await figma.variables.getLocalVariablesAsync();
const varName = {};
for (const v of allVars) varName[v.id] = v.name;

/** Every bound variable on a node, as { field: variableName }. */
function bindingsOf(node) {
  const out = {};
  const bv = node.boundVariables || {};
  for (const [field, val] of Object.entries(bv)) {
    if (Array.isArray(val)) {
      val.forEach((alias, i) => {
        if (alias && alias.id) out[`${field}[${i}]`] = varName[alias.id] || alias.id;
      });
    } else if (val && val.id) {
      out[field] = varName[val.id] || val.id;
    } else if (val && typeof val === 'object') {
      // paints carry their alias one level down, under `color`
      for (const [sub, alias] of Object.entries(val)) {
        if (alias && alias.id) out[`${field}.${sub}`] = varName[alias.id] || alias.id;
      }
    }
  }
  return out;
}

function walk(node, out = []) {
  out.push(node);
  if ('children' in node) for (const c of node.children) walk(c, out);
  return out;
}

const report = { file: figma.root.name, generatedAt: new Date().toISOString(), components: [] };

// Component sets live anywhere in the document; find them by name once.
const sets = figma.root.findAllWithCriteria
  ? figma.root.findAllWithCriteria({ types: ['COMPONENT_SET'] })
  : [];

for (const name of TARGETS) {
  const set = sets.find((s) => s.name === name);
  if (!set) {
    report.components.push({ name, error: 'component set not found' });
    continue;
  }

  const variants = [];
  for (const variant of set.children) {
    const nodes = walk(variant);
    const rootBindings = bindingsOf(variant);

    const descendants = [];
    for (const n of nodes.slice(1)) {
      const b = bindingsOf(n);
      if (Object.keys(b).length) {
        descendants.push({ node: n.name, type: n.type, bindings: b });
      }
    }

    variants.push({
      // e.g. "Style=Primary, Size=Small, State=Default"
      combination: variant.name,
      rootBindings,
      rootBindingCount: Object.keys(rootBindings).length,
      descendants,
    });
  }

  report.components.push({
    name,
    nodeId: set.id,
    variantCount: set.children.length,
    // true when every variant records nothing at the root — the Slider / Skeleton /
    // Popover / Arrow case, where the description could only ever say
    // "no root-level bindings"
    childOnly: variants.every((v) => v.rootBindingCount === 0),
    variants,
  });
}

report;

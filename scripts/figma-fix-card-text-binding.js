/**
 * Jake UI — one-off repair: Card's text is bound to the wrong variable.
 *
 * WHY THIS EXISTS
 * `Card.doc.json` binds the card's text to `info-foreground`. That is a defect in
 * the Figma file, not in the documentation pipeline. Verified against
 * .figma-tokens-dump.json:
 *
 *   card             Light white/100    Dark neutral/900
 *   info-foreground  Light neutral/50   Dark neutral/950   <- INVERTED
 *   card-foreground  Light neutral/950  Dark neutral/50
 *
 * `info-foreground` is the light-on-dark pairing, correct for text sitting on the
 * SOLID `info` fill — which is how Badge uses it, legitimately. On a `card` fill it
 * is near-white text on a white card in Light and near-black on near-black in Dark.
 * Contrast is roughly 1:1: the text is invisible in both modes.
 *
 * components/card.tsx already binds card-foreground, so nothing renders broken
 * today. This fixes the SOURCE OF TRUTH, so `docs:adopt` stops re-importing the
 * wrong token.
 *
 * SCOPE: the Card component set ONLY (node 126:675). Badge also binds
 * info-foreground and is left alone deliberately — there it is correct.
 *
 * HOW TO RUN
 *   1. Open Figma Desktop with file ovnLtL9xbX8SG5xDw673Un and run the
 *      Figma Console MCP "Desktop Bridge" plugin.
 *   2. Execute the body of this file through the bridge (figma_execute).
 *      It runs in DRY RUN by default and only reports what it would change.
 *   3. Read the report. If the counts look right, set DRY_RUN = false and run again.
 *   4. Re-run with DRY_RUN = true to confirm 0 remaining.
 *
 * THEN — and this is the part that is easy to forget — the Card DESCRIPTION still
 * says "text info-foreground", because the block below the ——— rule is GENERATED
 * and does not update itself when a binding changes. Until the description is
 * regenerated and `npm run docs:adopt` re-run, the doc record keeps the old token.
 * That is the same description-regeneration job already owed for the 6 stale
 * records and the 8-row state cap, so do all three in one session.
 *
 * SANDBOX CONSTRAINTS honoured here (see the handoff, §3):
 *   - async getters only (getNodeByIdAsync, getLocalVariablesAsync)
 *   - a baseline is taken in the SAME execution as the write
 *   - the result is verified by RE-SCANNING, never by a return value
 */

const DRY_RUN = true;

const CARD_NODE_ID = '126:675';
const WRONG = 'info-foreground';
const RIGHT = 'card-foreground';

await figma.loadAllPagesAsync();

// ── resolve the two variables by name ────────────────────────────────────────
const allVars = await figma.variables.getLocalVariablesAsync();
const wrongVar = allVars.find((v) => v.name === WRONG);
const rightVar = allVars.find((v) => v.name === RIGHT);

if (!wrongVar) throw new Error(`Variable "${WRONG}" not found — aborting without changes.`);
if (!rightVar) throw new Error(`Variable "${RIGHT}" not found — aborting without changes.`);

// ── find the Card subtree ────────────────────────────────────────────────────
const root = await figma.getNodeByIdAsync(CARD_NODE_ID);
if (!root) throw new Error(`Node ${CARD_NODE_ID} (Card) not found — aborting.`);

/** Every node in the subtree, root included. */
function walk(node, out = []) {
  out.push(node);
  if ('children' in node) for (const child of node.children) walk(child, out);
  return out;
}

const nodes = walk(root);

/** Paints on this node bound to `variableId`, as indices. */
function boundPaintIndices(node, variableId) {
  if (!('fills' in node)) return [];
  const fills = node.fills;
  if (!Array.isArray(fills)) return []; // figma.mixed
  const hits = [];
  fills.forEach((paint, i) => {
    const bound = paint.boundVariables && paint.boundVariables.color;
    if (bound && bound.id === variableId) hits.push(i);
  });
  return hits;
}

/** Count matching bindings across the subtree. The tripwire, taken in-execution. */
function scan(variableId) {
  let n = 0;
  const where = [];
  for (const node of nodes) {
    const hits = boundPaintIndices(node, variableId);
    if (hits.length) {
      n += hits.length;
      where.push(`${node.type} "${node.name}" (${node.id}) x${hits.length}`);
    }
  }
  return { n, where };
}

// ── BASELINE, taken in the same execution as the write ───────────────────────
const beforeWrong = scan(wrongVar.id);
const beforeRight = scan(rightVar.id);

const report = {
  dryRun: DRY_RUN,
  cardNode: `${root.type} "${root.name}" (${root.id})`,
  subtreeNodes: nodes.length,
  before: { [WRONG]: beforeWrong.n, [RIGHT]: beforeRight.n },
  targets: beforeWrong.where,
};

if (DRY_RUN) {
  report.note =
    beforeWrong.n === 0
      ? 'Nothing to do — no paint in the Card subtree is bound to info-foreground.'
      : `Would rebind ${beforeWrong.n} paint(s) from ${WRONG} to ${RIGHT}. Set DRY_RUN = false to apply.`;
  report;
} else {
  // ── apply ──────────────────────────────────────────────────────────────────
  let rebound = 0;
  for (const node of nodes) {
    const hits = boundPaintIndices(node, wrongVar.id);
    if (!hits.length) continue;

    // fills is readonly on the node; clone, mutate the clone, assign back.
    const next = node.fills.map((p) => Object.assign({}, p));
    for (const i of hits) {
      next[i] = figma.variables.setBoundVariableForPaint(next[i], 'color', rightVar);
      rebound++;
    }
    node.fills = next;
  }

  // ── VERIFY BY RE-SCANNING, not by trusting the loop ────────────────────────
  const afterWrong = scan(wrongVar.id);
  const afterRight = scan(rightVar.id);

  report.rebound = rebound;
  report.after = { [WRONG]: afterWrong.n, [RIGHT]: afterRight.n };
  report.ok =
    afterWrong.n === 0 &&
    afterRight.n === beforeRight.n + beforeWrong.n &&
    rebound === beforeWrong.n;
  report.note = report.ok
    ? `Rebound ${rebound}. Verified by re-scan: 0 remaining on ${WRONG}, and ${RIGHT} rose by exactly that many. NEXT: regenerate the Card description, then npm run docs:adopt — the description block is generated and still says "text ${WRONG}".`
    : 'MISMATCH — re-scan does not agree with the write. Do NOT save. Restore the named version "pre-throughline-retrofit" and investigate.';
  report;
}

/**
 * Jake UI — documentation adoption, step 1 of 2: dump the live Figma doc surface.
 *
 * WHY THIS EXISTS
 * Same reason as figma-token-query.js: the REST API path is Enterprise-only on
 * this plan, so the query runs INSIDE Figma (plugin context) where the data is
 * available on any plan, and returns JSON that adopt-docs.mjs transforms offline.
 *
 * HOW TO REGENERATE
 *   1. Open Figma Desktop with file ovnLtL9xbX8SG5xDw673Un and run the
 *      Figma Console MCP "Desktop Bridge" plugin.
 *   2. Execute the body of this file through the bridge (figma_execute).
 *      It is chunkable — pass OFFSET/LIMIT to page through large files rather
 *      than returning ~90KB of description text in one response.
 *   3. Save/merge the returned `components` arrays into
 *      design-system/.figma-docs-dump.json
 *   4. node design-system/scripts/adopt-docs.mjs
 *
 * WHAT IT RETURNS
 * Component sets and standalone components with a non-empty `description`.
 * Descriptions are the payload here — unlike figma-token-query.js, which
 * deliberately omits them.
 */

const OFFSET = typeof globalThis.OFFSET === 'number' ? globalThis.OFFSET : 0;
const LIMIT = typeof globalThis.LIMIT === 'number' ? globalThis.LIMIT : 1000;

await figma.loadAllPagesAsync();

const sets = figma.root.findAllWithCriteria({ types: ['COMPONENT_SET'] });
const standalone = figma.root
  .findAllWithCriteria({ types: ['COMPONENT'] })
  .filter((c) => !(c.parent && c.parent.type === 'COMPONENT_SET'));

const all = [...sets, ...standalone]
  .filter((n) => (n.description || '').trim())
  .sort((a, b) => a.name.localeCompare(b.name));

const page = all.slice(OFFSET, OFFSET + LIMIT).map((n) => ({
  name: n.name,
  kind: n.type === 'COMPONENT_SET' ? 'set' : 'component',
  figmaNodeId: n.id,
  variants: n.type === 'COMPONENT_SET' ? n.children.length : 1,
  description: n.description,
}));

return {
  fileKey: figma.fileKey,
  generatedAt: new Date().toISOString(),
  total: all.length,
  offset: OFFSET,
  returned: page.length,
  components: page,
};

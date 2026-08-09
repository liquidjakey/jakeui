/**
 * Jake UI — token export, step 1 of 2: dump the live Figma token surface.
 *
 * WHY THIS EXISTS
 * The Figma Variables REST API is Enterprise-only. This account is not on
 * Enterprise, so `export-tokens.mjs` cannot call Figma directly. This file is
 * the query half: it runs INSIDE Figma (plugin context), where the variables
 * API is available on any plan, and returns a plain JSON dump that the
 * generator then reads offline.
 *
 * Same shape as the `figma.map.json` pipeline: query in Figma -> commit a dump
 * -> transform with Node -> CI-check the result.
 *
 * HOW TO REGENERATE
 *   1. Open Figma Desktop with file ovnLtL9xbX8SG5xDw673Un and run the
 *      Figma Console MCP "Desktop Bridge" plugin.
 *   2. Execute the body of this file through the bridge
 *      (figma_execute, or any equivalent plugin console).
 *   3. Save the returned JSON to design-system/.figma-tokens-dump.json
 *   4. node design-system/scripts/export-tokens.mjs
 *
 * WHAT IT DELIBERATELY OMITS
 * Variable `description` fields. They run 486-2,058 characters each and are
 * documentation, not token values — including them would multiply the dump
 * size for no effect on the generated CSS. Descriptions stay in Figma, which
 * is their single source of truth.
 *
 * FLOAT NOTE
 * Values come back as float32 (opacity/5 reads 0.05000000074505806). Do NOT
 * try to normalise them in Figma — Figma re-quantises on store, so it is a
 * no-op. Rounding happens at the export boundary, in export-tokens.mjs.
 */

await figma.loadAllPagesAsync();

const cols = await figma.variables.getLocalVariableCollectionsAsync();
const vars = await figma.variables.getLocalVariablesAsync();

const colById = {};
for (const c of cols) colById[c.id] = c;

const nameById = {};
for (const v of vars) nameById[v.id] = v.name;

const collections = cols.map((c) => ({
  id: c.id,
  name: c.name,
  modes: c.modes.map((m) => ({ id: m.modeId, name: m.name })),
  defaultModeId: c.defaultModeId,
}));

const toHex = (channel) => Math.round(channel * 255).toString(16).padStart(2, '0');

const variables = vars.map((v) => ({
  n: v.name,
  c: colById[v.variableCollectionId].name,
  t: v.resolvedType,
  cs: (v.codeSyntax && v.codeSyntax.WEB) || null,
  m: Object.fromEntries(
    Object.entries(v.valuesByMode).map(([mode, val]) => {
      // An alias is recorded by NAME, not id: names survive a re-dump, ids do not.
      if (val && val.type === 'VARIABLE_ALIAS') {
        return [mode, { alias: nameById[val.id] || val.id }];
      }
      if (val && typeof val === 'object' && 'r' in val) {
        return [
          mode,
          {
            hex: '#' + toHex(val.r) + toHex(val.g) + toHex(val.b),
            a: val.a === undefined ? 1 : Math.round(val.a * 1000) / 1000,
          },
        ];
      }
      return [mode, val];
    })
  ),
}));

const textStyles = (await figma.getLocalTextStylesAsync()).map((s) => ({
  name: s.name,
  fontSize: s.fontSize,
  lineHeight: s.lineHeight,
  font: s.fontName,
  // Which Typography Primitive each axis is bound to. This is what lets the
  // generated type ramp reference variables instead of freezing literals.
  bound: Object.fromEntries(
    Object.entries(s.boundVariables || {}).map(([k, e]) => [k, nameById[e.id] || e.id])
  ),
}));

const effectStyles = (await figma.getLocalEffectStylesAsync()).map((s) => ({
  name: s.name,
  effects: s.effects.map((e) => ({
    type: e.type,
    radius: e.radius,
    spread: e.spread,
    offset: e.offset,
    visible: e.visible,
    color: e.color
      ? {
          hex: '#' + toHex(e.color.r) + toHex(e.color.g) + toHex(e.color.b),
          a: Math.round((e.color.a ?? 1) * 1000) / 1000,
        }
      : null,
  })),
}));

return {
  fileKey: figma.fileKey,
  generatedAt: new Date().toISOString(),
  collections,
  variables,
  textStyles,
  effectStyles,
};

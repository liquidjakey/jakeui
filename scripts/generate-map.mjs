#!/usr/bin/env node
/**
 * Jake UI — Code Connect replacement, step 1 of 2: generate the manifest.
 *
 * WHY THIS EXISTS
 * Figma Code Connect requires a Dev or Full seat on an Org/Enterprise plan.
 * This account has neither, so the Figma↔code binding cannot be automated by
 * Figma. `figma.map.json` is the hand-owned substitute: a committed, diffable,
 * CI-checkable manifest of the same information.
 *
 * HOW TO REGENERATE
 * This script does not call the Figma REST API (that needs a token). It reads
 * a raw dump produced by the Figma MCP `use_figma` tool, so the source of truth
 * stays the live file:
 *
 *   1. Run the script in ./figma-dump-query.js through `use_figma`
 *      against file ovnLtL9xbX8SG5xDw673Un.
 *   2. Save its JSON output to design-system/.figma-dump.json
 *   3. node design-system/scripts/generate-map.mjs
 *   4. node design-system/scripts/validate-map.mjs
 *
 * Classification rules mirror the Governance page:
 *   "State is visual QA unless the implementation exposes controlled state;
 *    Viewport is a responsive fixture unless code exposes a breakpoint prop;
 *    Pattern is story/composition-only. Never infer a public code prop from a
 *    Figma axis without API review."
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DUMP = resolve(ROOT, '.figma-dump.json');
const OUT = resolve(ROOT, 'figma.map.json');

/** Browser- and library-owned. Never a prop. */
const CSS_OWNED = new Set(['Hover', 'Focused', 'Focus', 'Highlighted']);
/** Genuinely co-occur at runtime. Must be independent booleans. */
const BOOLEANS = new Set(['Disabled', 'Error', 'Invalid', 'ReadOnly']);
/** Owned by the consumer or the primitive, not a visual variant. */
const CONTROLLED = new Set([
  'Open', 'Closed', 'Selected', 'Checked', 'Unchecked', 'Indeterminate',
  'Active', 'Expanded', 'Collapsed', 'Pressed',
]);

const camel = (s) =>
  s.replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()).replace(/^./, (c) => c.toLowerCase());

/** `Error` is the Figma spelling; `invalid` is the ARIA-aligned code spelling. */
const boolName = (v) => camel(v === 'Error' ? 'invalid' : v);

function classifyVariant(base, opts) {
  if (base === 'Pattern') {
    return { kind: 'story-only', figma: base, figmaValues: opts,
      note: 'Storybook story, never a prop.' };
  }
  if (base === 'Viewport') {
    return { kind: 'responsive-fixture', figma: base, figmaValues: opts,
      note: 'Breakpoint fixture. Not a prop unless code deliberately exposes one.' };
  }
  const cssOwned = opts.filter((o) => CSS_OWNED.has(o));
  const booleans = opts.filter((o) => BOOLEANS.has(o));
  const controlled = opts.filter((o) => CONTROLLED.has(o));

  // Conflated only if the axis mixes >1 runtime concern AND at least one of
  // those concerns is a CSS state or an independent boolean.
  const concerns = cssOwned.length + booleans.length + controlled.length;
  if (concerns > 1 && (cssOwned.length || booleans.length)) {
    return {
      kind: 'decompose',
      figma: base,
      figmaValues: opts,
      cssOwned,
      booleans: booleans.map(boolName),
      controlled: controlled.map(camel),
      note: 'Figma enum packs states that co-occur at runtime. Never emit as an enum prop.',
    };
  }
  return { kind: 'prop', figma: base, code: camel(base),
    type: opts.map((o) => `'${camel(o)}'`).join(' | ') };
}

function classify(key, def) {
  const base = key.split('#')[0];
  switch (def.type) {
    case 'VARIANT':
      return classifyVariant(base, def.variantOptions || []);
    case 'TEXT':
      return { kind: 'prop', figma: base, code: camel(base), type: 'string' };
    case 'INSTANCE_SWAP':
      return { kind: 'slot', figma: base, code: camel(base), type: 'React.ReactNode' };
    case 'BOOLEAN': {
      if (/^show /i.test(base)) {
        return { kind: 'slot-toggle', figma: base, code: camel(base.replace(/^show /i, '')),
          type: 'React.ReactNode',
          note: 'Boolean toggles a placeholder in Figma; in code the slot is nullable and the boolean disappears.' };
      }
      return { kind: 'prop', figma: base, code: camel(base), type: 'boolean' };
    }
    default:
      return { kind: 'unclassified', figma: base, note: 'Unknown property type — review required.' };
  }
}

function main() {
  let dump;
  try {
    dump = JSON.parse(readFileSync(DUMP, 'utf8'));
  } catch {
    console.error(`Missing ${DUMP}\nSee the header of this file for how to produce it.`);
    process.exit(1);
  }

  // `codePath` / `codeExport` are hand-owned — the dump knows nothing about code.
  // Carry them over from the previous manifest, or regenerating silently unbinds
  // every implemented component (and the validator would only warn, not fail).
  let previous = {};
  if (existsSync(OUT)) {
    try {
      previous = JSON.parse(readFileSync(OUT, 'utf8')).components ?? {};
    } catch {
      console.warn(`Could not parse existing ${OUT}; hand-owned codePaths cannot be preserved.`);
    }
  }

  const components = {};
  let carried = 0;
  const dropped = [];
  for (const set of dump.sets) {
    const props = {};
    for (const [key, def] of Object.entries(set.componentPropertyDefinitions || {})) {
      props[key] = classify(key, def);
    }
    const prior = previous[set.name];
    if (prior?.codePath) carried++;
    components[set.name] = {
      figmaNodeId: set.id,
      variants: set.variantCount,
      // Filled in by hand as components get implemented; preserved across regeneration.
      codePath: prior?.codePath ?? null,
      codeExport: prior?.codeExport ?? null,
      props,
    };
  }

  // A component that had a codePath but is gone from the dump was renamed or
  // deleted in Figma. Say so loudly — this is a real drift signal, not noise.
  for (const [name, c] of Object.entries(previous)) {
    if (c.codePath && !components[name]) dropped.push(`${name} → ${c.codePath}`);
  }

  const manifest = {
    $schema: './figma.map.schema.json',
    fileKey: dump.fileKey ?? 'ovnLtL9xbX8SG5xDw673Un',
    generatedAt: new Date().toISOString(),
    note: 'Code Connect substitute — this plan has no Dev/Full seat. Hand-owned; CI-checked by validate-map.mjs.',
    components,
  };

  writeFileSync(OUT, JSON.stringify(manifest, null, 2) + '\n');

  const tally = { prop: 0, slot: 0, 'slot-toggle': 0, decompose: 0, 'story-only': 0,
    'responsive-fixture': 0, unclassified: 0 };
  for (const c of Object.values(components)) {
    for (const p of Object.values(c.props)) tally[p.kind] = (tally[p.kind] ?? 0) + 1;
  }
  console.log(`Wrote ${OUT}`);
  console.log(`  components: ${Object.keys(components).length}`);
  console.log(`  codePaths preserved: ${carried}`);
  for (const [k, v] of Object.entries(tally)) console.log(`  ${k.padEnd(20)} ${v}`);
  if (dropped.length) {
    console.warn(`\n⚠ ${dropped.length} implemented component(s) no longer in the Figma dump —`);
    console.warn('  renamed or deleted in Figma. Their code bindings were NOT carried over:');
    for (const d of dropped) console.warn(`    · ${d}`);
  }
}

main();

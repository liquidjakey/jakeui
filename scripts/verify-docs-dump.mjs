#!/usr/bin/env node
/**
 * Jake UI — dump fidelity check.
 *
 * WHY THIS EXISTS
 * `.figma-docs-dump.json` is produced by running figma-docs-query.js through the
 * Desktop Bridge and saving the result. That transfer is the one step in the docs
 * pipeline with no machine guarantee: a truncated copy or a mangled character
 * would produce records that silently disagree with Figma, and docs:check cannot
 * see it — it compares the record against the manifest, never against the source.
 *
 * This closes that gap. It prints a per-component hash of the dump's descriptions;
 * running the matching snippet in Figma prints the same hashes from the live file.
 * Any mismatch is a bad transfer, named exactly.
 *
 *   node design-system/scripts/verify-docs-dump.mjs            # hashes + summary
 *   node design-system/scripts/verify-docs-dump.mjs --figma-snippet
 *   node design-system/scripts/verify-docs-dump.mjs --compare <file-of-figma-hashes.json>
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DUMP = resolve(ROOT, '.figma-docs-dump.json');

/**
 * FNV-1a over UTF-16 code units, plus the length.
 *
 * Deliberately not sha256: this hash has to be computed identically inside the
 * Figma plugin sandbox, which has no TextEncoder and no crypto.subtle. Iterating
 * charCodeAt is the one formulation that is bit-identical in both environments.
 * Length is prefixed because truncation is the most likely transfer failure and
 * it makes that case obvious at a glance.
 */
export const h = (s) => {
  const str = String(s);
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return `${str.length}:${hash.toString(16).padStart(8, '0')}`;
};

const SNIPPET = `await figma.loadAllPagesAsync();
// Mirror of verify-docs-dump.mjs. Run in Figma; compare to the local hashes.
// FNV-1a over UTF-16 code units — no TextEncoder/crypto.subtle in the sandbox.
const h = (s) => { const str = String(s); let x = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) { x ^= str.charCodeAt(i); x = Math.imul(x, 0x01000193) >>> 0; }
  return str.length + ':' + x.toString(16).padStart(8, '0'); };
const sets = figma.root.findAllWithCriteria({ types: ['COMPONENT_SET'] });
const solo = figma.root.findAllWithCriteria({ types: ['COMPONENT'] })
  .filter(c => !(c.parent && c.parent.type === 'COMPONENT_SET'));
const all = [...sets, ...solo].filter(n => (n.description || '').trim())
  .sort((a, b) => a.name.localeCompare(b.name));
const out = {};
for (const n of all) out[n.name] = h(n.description);
return { total: all.length, hashes: out };`;

function main() {
  if (process.argv.includes('--figma-snippet')) {
    console.log(SNIPPET);
    return;
  }
  if (!existsSync(DUMP)) {
    console.error(`Missing ${DUMP}`);
    process.exit(1);
  }
  const dump = JSON.parse(readFileSync(DUMP, 'utf8'));
  const local = {};
  for (const c of dump.components) local[c.name] = h(c.description);

  const compareIdx = process.argv.indexOf('--compare');
  if (compareIdx !== -1) {
    const other = JSON.parse(readFileSync(process.argv[compareIdx + 1], 'utf8'));
    const figma = other.hashes || other;
    const problems = [];
    for (const [name, hash] of Object.entries(local)) {
      if (!(name in figma)) problems.push(`${name}: in dump but not in Figma`);
      else if (figma[name] !== hash) problems.push(`${name}: MISMATCH — dump ${hash}, Figma ${figma[name]}`);
    }
    const missing = Object.keys(figma).filter((n) => !(n in local));
    for (const n of missing) problems.push(`${n}: in Figma but not adopted into the dump`);

    console.log(`dump: ${Object.keys(local).length} · Figma: ${Object.keys(figma).length}`);
    if (problems.length) {
      console.error(`\n${problems.length} fidelity problem(s):`);
      for (const p of problems) console.error(`  ✗ ${p}`);
      process.exit(1);
    }
    console.log('\n✓ every adopted description matches the live Figma file byte for byte.');
    return;
  }

  console.log(JSON.stringify({ total: Object.keys(local).length, hashes: local }, null, 2));
}

main();

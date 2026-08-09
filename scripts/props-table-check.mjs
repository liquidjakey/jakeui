#!/usr/bin/env node
/**
 * Jake UI — props-table drift gate.
 *
 * WHY THIS EXISTS
 * Each props table's Table 1 lists a component's props in prose. That duplicates the
 * exported TypeScript interface, and duplication of something the compiler already
 * guarantees goes wrong silently.
 *
 * It already had. On 9 Aug 2026 a check found **10 of 77** reproduced interfaces
 * disagreeing with their source — in a single day, written by one author. The
 * "Compiled output" sections were deleted outright for that reason: they carried no
 * information the `.tsx` did not.
 *
 * Table 1 was KEPT, because it carries three things the interface does not: default
 * values, grouping by role, and the annotations explaining why a prop looks the way
 * it does. This gate is the price of keeping it — the remaining duplication is now
 * verified rather than hoped for.
 *
 * WHAT IT CHECKS
 * For every component with a `codePath`, every prop in the exported interface appears
 * in its props table's Table 1, and vice versa.
 *
 * WHAT IT DELIBERATELY DOES NOT CHECK
 * Types and defaults. Table 1 writes types for humans (`(e) => void`) where the source
 * writes them for the compiler, and that difference is intentional per
 * props-table-format.md. Names are the part that must not drift.
 *
 *   node design-system/scripts/props-table-check.mjs
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MAP = resolve(ROOT, 'figma.map.json');
const DOCS = resolve(ROOT, 'docs/components');

function slug(name) {
  return name
    .toLowerCase()
    .replace(/\s*\/\s*/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Prop names declared in an interface body. */
function interfaceProps(body) {
  const out = new Set();
  for (const m of body.matchAll(/^\s*(?:\/\*\*[\s\S]*?\*\/\s*)?['"]?([A-Za-z][\w-]*)['"]?\??\s*:/gm)) {
    out.add(m[1]);
  }
  return out;
}

/**
 * Prop names in a props table's Table 1 — the leading `code` cell of each row.
 *
 * Only the FIRST markdown table under the heading counts. Several pages follow Table
 * 1 with a second table documenting a related interface (Field's `FieldControlProps`,
 * for one), and those props belong to a different type.
 */
function tableProps(md) {
  const section = md.match(/^## 1\. Code API[\s\S]*?(?=^## |\Z)/m);
  if (!section) return null;
  const out = new Set();
  let started = false;
  for (const line of section[0].split('\n')) {
    if (line.startsWith('|')) {
      started = true;
      const first = line.split('|')[1]?.trim() ?? '';
      for (const m of first.matchAll(/`([A-Za-z][\w-]*)`/g)) out.add(m[1]);
    } else if (started && line.trim() === '') {
      break; // end of the first table
    }
  }
  return out;
}

// Collect every exported interface across the component sources.
const sources = {};
for (const file of readdirSync(resolve(ROOT, 'components'))) {
  if (!file.endsWith('.tsx') || file.endsWith('.stories.tsx')) continue;
  const src = readFileSync(resolve(ROOT, 'components', file), 'utf8');
  for (const m of src.matchAll(/export interface (\w+)\s*\{([\s\S]*?)^\}/gm)) {
    sources[m[1]] = interfaceProps(m[2]);
  }
}

const map = JSON.parse(readFileSync(MAP, 'utf8')).components;
const errors = [];
let checked = 0;

for (const [name, entry] of Object.entries(map)) {
  if (!entry.codePath || !entry.codeExport) continue;
  const doc = resolve(DOCS, `${slug(name)}.md`);
  if (!existsSync(doc)) continue; // validate-map.mjs already gates this

  const iface = `${entry.codeExport}Props`;
  const declared = sources[iface];
  if (!declared) continue; // not every export has a *Props interface

  const listed = tableProps(readFileSync(doc, 'utf8'));
  if (!listed) {
    errors.push(`${name}: ${slug(name)}.md has no "## 1. Code API" section`);
    continue;
  }

  checked++;
  const missing = [...declared].filter((p) => !listed.has(p));
  const extra = [...listed].filter((p) => !declared.has(p));

  if (missing.length) {
    errors.push(`${name}: in ${iface} but NOT in Table 1 — ${missing.join(', ')}`);
  }
  if (extra.length) {
    errors.push(`${name}: in Table 1 but NOT in ${iface} — ${extra.join(', ')}`);
  }
}

console.log(`Jake UI props tables — ${checked} interface(s) compared against Table 1.`);

if (errors.length) {
  console.error(`\n${errors.length} drift(s):`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  console.error('\nTable 1 and the exported interface must list the same props.');
  process.exit(1);
}

console.log('OK — no drift.');

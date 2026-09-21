#!/usr/bin/env node
/**
 * Validate Figma correspondence against compiler-derived props and reviewed
 * transforms. Every implemented asset must have a current component reference.
 * Design state classifications never create public props.
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readPublicApi } from './lib/public-api.mjs';
import { reconcileMap, validateMapShape } from './lib/figma-contract.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MAP = resolve(ROOT, 'figma.map.json');
const DOCS_DIR = resolve(ROOT, 'docs/agent/components');

const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

function slug(name) {
  return name.toLowerCase().replace(/\s*\/\s*/g, '-').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function main() {
  if (!existsSync(MAP)) {
    console.error(`Missing ${MAP}. Run generate-map.mjs first.`);
    process.exit(1);
  }
  const manifest = JSON.parse(readFileSync(MAP, 'utf8'));
  validateMapShape(manifest);
  const api = readPublicApi();
  const expected = reconcileMap(manifest, api.components);
  if (JSON.stringify(expected) !== JSON.stringify(manifest)) err('Manifest differs from compiler-derived public types or reviewed transforms. Run npm run agent:sync, then review the diff.');

  let implemented = 0;
  let decomposeCount = 0;

  for (const [name, c] of Object.entries(manifest.components)) {
    const where = `[${name}]`;

    // 1. nothing unclassified
    for (const [key, p] of Object.entries(c.props)) {
      if (p.kind === 'unclassified') {
        err(`${where} property "${key}" is unclassified. Classify it before mapping to code.`);
      }
    }

    // 2. decompose axes must not have become enum props
    for (const [key, p] of Object.entries(c.props)) {
      if (p.kind !== 'decompose') continue;
      decomposeCount++;
      if (p.type) {
        err(`${where} "${key}" is marked decompose but carries a \`type\` — it was emitted as an enum. Remove it.`);
      }
      if (!p.booleans?.length && !p.controlled?.length) {
        err(`${where} "${key}" decomposes to nothing. Every conflated axis must yield booleans or controlled state.`);
      }
    }

    // 3. code target resolves
    if (c.codePath) {
      implemented++;
      const abs = resolve(ROOT, c.codePath);
      if (!existsSync(abs)) {
        err(`${where} codePath "${c.codePath}" does not exist.`);
      } else if (c.codeExport) {
        const src = readFileSync(abs, 'utf8');
        const exported =
          new RegExp(`export\\s+(?:const|function|class)\\s+${c.codeExport}\\b`).test(src) ||
          new RegExp(`export\\s*\\{[^}]*\\b${c.codeExport}\\b`).test(src);
        if (!exported) err(`${where} "${c.codeExport}" is not exported from ${c.codePath}.`);
      }

      // 4. implemented components need a current public reference
      const doc = resolve(DOCS_DIR, `${slug(name)}.md`);
      if (!existsSync(doc)) {
        err(`${where} is implemented but has no current reference at docs/agent/components/${slug(name)}.md`);
      }
    } else {
      warn(`${where} not yet mapped to code (codePath is null).`);
    }

    // 6. icon slots must be nodes
    for (const [key, p] of Object.entries(c.props)) {
      if (p.kind === 'slot' && !p.type?.includes('ReactNode')) {
        err(`${where} slot "${key}" must be typed React.ReactNode, got "${p.type}".`);
      }
      if (p.kind === 'prop' && /icon/i.test(p.figma ?? '') && p.type === 'string') {
        err(`${where} "${key}" is a text-glyph icon. Governance blocks glyphs from code mapping — convert to INSTANCE_SWAP.`);
      }
    }
  }

  const total = Object.keys(manifest.components).length;
  console.log(`Jake UI map — ${total} components, ${implemented} implemented, ${decomposeCount} conflated axes.`);
  if (warnings.length) {
    console.log(`\n${warnings.length} warning(s):`);
    for (const w of warnings.slice(0, 10)) console.log(`  · ${w}`);
    if (warnings.length > 10) console.log(`  … and ${warnings.length - 10} more`);
  }
  if (errors.length) {
    console.error(`\n${errors.length} error(s):`);
    for (const e of errors) console.error(`  ✗ ${e}`);
    process.exit(1);
  }
  console.log('\nOK — no errors.');
}

main();

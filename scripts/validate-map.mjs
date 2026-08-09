#!/usr/bin/env node
/**
 * Jake UI — Code Connect replacement, step 2 of 2: validate the manifest.
 *
 * Code Connect would fail a build when a Figma component and its code
 * counterpart drift apart. This does the same job in CI, for the parts that
 * can be checked without a Dev seat:
 *
 *   1. Every property is classified — nothing left `unclassified`.
 *   2. No `decompose` axis was quietly turned into an enum prop.
 *   3. Every mapped `codePath` exists on disk and exports `codeExport`.
 *   4. Every implemented component has a props-table doc.
 *   5. Every `decompose` entry appears in docs/02-design/state-decomposition.md.
 *   6. Icon slots reference the Phosphor map, not text glyphs.
 *
 * Exit code 1 on any error. Warnings do not fail the build.
 *
 *   node design-system/scripts/validate-map.mjs
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MAP = resolve(ROOT, 'figma.map.json');
// Docs moved under design-system/ on 9 Aug 2026 so the repo is self-contained.
const DECOMP = resolve(ROOT, 'docs/02-design/state-decomposition.md');
const DOCS_DIR = resolve(ROOT, 'docs/02-design/components');

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
  const decompDoc = existsSync(DECOMP) ? readFileSync(DECOMP, 'utf8') : '';
  if (!decompDoc) err(`Missing ${DECOMP} — the decomposition contract is required.`);

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
      // 5. must be documented
      if (decompDoc && !decompDoc.includes(`\`${name}\``)) {
        err(`${where} has a conflated axis but is absent from state-decomposition.md.`);
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

      // 4. implemented components need a props-table doc
      const doc = resolve(DOCS_DIR, `${slug(name)}.md`);
      if (!existsSync(doc)) {
        err(`${where} is implemented but has no props table at docs/02-design/components/${slug(name)}.md`);
      }
    } else {
      warn(`${where} not yet mapped to code (codePath is null).`);
    }

    // 6. icon slots must be nodes
    for (const [key, p] of Object.entries(c.props)) {
      if (p.kind === 'slot' && p.type !== 'React.ReactNode') {
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

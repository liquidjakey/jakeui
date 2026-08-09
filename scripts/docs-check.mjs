#!/usr/bin/env node
/**
 * Jake UI — documentation drift gate.
 *
 * Every documentation surface (Figma description, doc card, Storybook MDX) is a
 * projection of `docs/components/<Name>.doc.json`. This checks the projections
 * have not drifted from their source, and that the records themselves are valid.
 *
 *   node design-system/scripts/docs-check.mjs
 *
 * Classifications, per the component-doc schema:
 *   canonical-changed  the record's fingerprint differs from the manifest pointer
 *   stale              a surface was rendered from an older fingerprint
 *   edited             a re-readable surface's content no longer matches its hash
 *   missing-surface    a surface declares a `file` that no longer exists
 *   edit-unverified    a surface this CLI cannot read (Figma) — checked live by
 *                      the Figma-connected skill, reported not failed
 *
 * Exit 1 on any failing classification. `edit-unverified` never fails.
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { canonicalFingerprint, renderHash, validateRecord } from './lib/doc-record.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS_DIR = resolve(ROOT, 'docs/components');
const MANIFEST = resolve(ROOT, 'design-system.json');

const errors = [];
const warnings = [];
const notes = [];

function main() {
  if (!existsSync(DOCS_DIR)) {
    console.error(`Missing ${DOCS_DIR}`);
    process.exit(1);
  }
  const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : {};
  const meta = (manifest.components && manifest.components.meta) || {};

  const files = readdirSync(DOCS_DIR).filter((f) => f.endsWith('.doc.json'));
  let surfaceCount = 0;
  let unverified = 0;
  let partial = 0;

  for (const file of files) {
    const abs = resolve(DOCS_DIR, file);
    let record;
    try {
      record = JSON.parse(readFileSync(abs, 'utf8'));
    } catch (e) {
      errors.push(`${file}: not valid JSON — ${e.message}`);
      continue;
    }

    for (const p of validateRecord(record, file)) errors.push(p);

    const fp = canonicalFingerprint(record);
    const pointer = meta[record.name] && meta[record.name].doc;

    if (!pointer) {
      warnings.push(`${record.name}: no manifest pointer yet (components.meta["${record.name}"].doc)`);
      continue;
    }

    // canonical-changed
    if (pointer.fingerprint !== fp) {
      errors.push(
        `${record.name}: canonical-changed — record is ${fp}, manifest pointer says ${pointer.fingerprint}. ` +
          `Re-project its surfaces, then update the pointer.`,
      );
    }

    for (const [name, surface] of Object.entries(pointer.surfaces || {})) {
      surfaceCount++;
      // stale — but an adopted surface is the SOURCE, not a rendering, so a
      // fingerprint difference there means "the record has grown beyond what the
      // surface carries", which is the intended brownfield end state, not drift.
      if (surface.src && surface.src !== fp) {
        if (surface.adopted) {
          partial++;
          notes.push(
            `${record.name} / ${name}: partial-projection — record ${fp} has enriched blocks the ` +
              `adopted surface does not carry. Expected; verify the source with npm run docs:verify.`,
          );
        } else {
          errors.push(`${record.name} / ${name}: stale — rendered from ${surface.src}, record is now ${fp}.`);
        }
      }
      // code surfaces are re-readable; Figma surfaces are not
      if (surface.file) {
        const surfaceAbs = resolve(ROOT, surface.file);
        if (!existsSync(surfaceAbs)) {
          errors.push(`${record.name} / ${name}: missing-surface — declared file "${surface.file}" does not exist.`);
          continue;
        }
        if (surface.render) {
          const actual = renderHash(readFileSync(surfaceAbs, 'utf8'));
          if (actual !== surface.render) {
            errors.push(
              `${record.name} / ${name}: edited — "${surface.file}" content hash ${actual} ` +
                `differs from the recorded ${surface.render}. Choose re-render or pull-back.`,
            );
          }
        }
      } else {
        unverified++;
        notes.push(`${record.name} / ${name}: edit-unverified (Figma surface — verified live, not by this CLI)`);
      }
    }
  }

  console.log(
    `Jake UI docs — ${files.length} record(s), ${surfaceCount} surface(s), ` +
    `${unverified} edit-unverified, ${partial} partial-projection.`,
  );

  if (warnings.length) {
    console.log(`\n${warnings.length} warning(s):`);
    for (const w of warnings.slice(0, 10)) console.log(`  · ${w}`);
    if (warnings.length > 10) console.log(`  … and ${warnings.length - 10} more`);
  }
  if (notes.length) {
    console.log(`\n${notes.length} edit-unverified surface(s) — not failures:`);
    for (const n of notes.slice(0, 5)) console.log(`  ~ ${n}`);
    if (notes.length > 5) console.log(`  … and ${notes.length - 5} more`);
  }
  if (errors.length) {
    console.error(`\n${errors.length} error(s):`);
    for (const e of errors) console.error(`  ✗ ${e}`);
    process.exit(1);
  }
  console.log('\nOK — no errors.');
}

main();

#!/usr/bin/env node
/**
 * Jake UI — documentation enrichment (component-builder Step 4.5, layers 2-3).
 *
 * Adoption (adopt-docs.mjs) claims what the Figma descriptions already say. It
 * leaves real gaps, because a Figma description does not carry usage guidance:
 * variant meanings come across as bare value names, and whenToUse / whenNotToUse
 * are absent entirely.
 *
 * This fills those gaps from docs/archetypes.json:
 *   layer 2  archetype best-practice seeds  -> provenance best-practice / w3c-apg
 *   layer 3  framework variant vocabulary   -> provenance framework
 *
 * THE RULE THIS ENFORCES
 * Enrichment only ever fills a block adoption left ABSENT or EMPTY. It never
 * overwrites imported content. Where a block exists and archetype guidance is
 * genuinely additive (dos, donts, accessibility notes) it APPENDS and records a
 * combined provenance such as "imported+best-practice", so the record always says
 * who wrote which part.
 *
 * Layer 4 (interview — brand and product-specific intent) is NOT done here. It
 * cannot be inferred, and inventing a brand voice would be worse than leaving the
 * gap visible. `npm run docs:check` reports what is still owed.
 *
 *   node design-system/scripts/enrich-docs.mjs [--check]
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { canonicalFingerprint, validateRecord } from './lib/doc-record.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS_DIR = resolve(ROOT, 'docs/components');
const ARCHETYPES = resolve(ROOT, 'docs/archetypes.json');
const MANIFEST = resolve(ROOT, 'design-system.json');
const CHECK = process.argv.includes('--check');

/** Merge provenance, e.g. "imported" + "best-practice" -> "imported+best-practice". */
function mergeProvenance(current, added) {
  const parts = new Set([...(current ? String(current).split('+') : []), added].map((s) => s.trim()).filter(Boolean));
  return [...parts].join('+');
}

function main() {
  const kb = JSON.parse(readFileSync(ARCHETYPES, 'utf8'));
  const vocab = kb.frameworkVocabulary;
  const files = readdirSync(DOCS_DIR).filter((f) => f.endsWith('.doc.json'));

  const changed = [];
  const owed = [];
  let variantMeaningsFilled = 0;

  for (const file of files) {
    const abs = resolve(DOCS_DIR, file);
    const record = JSON.parse(readFileSync(abs, 'utf8'));
    const before = JSON.stringify(record);
    record.provenance = record.provenance || {};

    const archetypeKey = kb.mapping[record.name] || null;
    const arch = archetypeKey ? kb.archetypes[archetypeKey] : null;

    // ── layer 3: variant meanings (fill empty strings only) ──
    for (const [axis, values] of Object.entries(record.variants || {})) {
      const axisVocab = vocab[axis];
      if (!axisVocab) continue;
      let filledHere = false;
      for (const value of Object.keys(values)) {
        if (values[value]) continue; // already has a meaning — leave it
        if (axisVocab[value]) { values[value] = axisVocab[value]; filledHere = true; variantMeaningsFilled++; }
      }
      if (filledHere) record.provenance.variants = mergeProvenance(record.provenance.variants, 'framework');
    }

    // ── layer 2: archetype seeds ──
    if (arch) {
      // absent blocks: pure fill
      for (const key of ['whenToUse', 'whenNotToUse']) {
        if (!record[key] && arch[key]) {
          record[key] = [...arch[key]];
          record.provenance[key] = 'best-practice';
        }
      }
      // present blocks: append, never replace
      for (const key of ['dos', 'donts']) {
        if (!arch[key]) continue;
        if (!record[key]) {
          record[key] = [...arch[key]];
          record.provenance[key] = 'best-practice';
        } else {
          // Appending is safe even for an imported block: nothing is replaced, and
          // the merged provenance records that the tail came from the archetype.
          const existing = new Set(record[key]);
          const additions = arch[key].filter((d) => !existing.has(d));
          if (additions.length) {
            record[key] = [...record[key], ...additions];
            record.provenance[key] = mergeProvenance(record.provenance[key], 'best-practice');
          }
        }
      }
      // accessibility: fill role/keyboard, append notes
      if (arch.accessibility) {
        const a = (record.accessibility = record.accessibility || {});
        let touched = false;
        if (!a.role && arch.accessibility.role) { a.role = arch.accessibility.role; touched = true; }
        if (!a.keyboard && arch.accessibility.keyboard) { a.keyboard = [...arch.accessibility.keyboard]; touched = true; }
        if (arch.accessibility.notes) {
          const existing = new Set(a.notes || []);
          const additions = arch.accessibility.notes.filter((n) => !existing.has(n));
          if (additions.length) { a.notes = [...(a.notes || []), ...additions]; touched = true; }
        }
        if (touched) record.provenance.accessibility = mergeProvenance(record.provenance.accessibility, 'w3c-apg');
      }
    } else {
      // Documented fallback: invent nothing. Record what is still owed.
      const missing = ['whenToUse', 'whenNotToUse'].filter((k) => !record[k]);
      if (missing.length) owed.push({ name: record.name, missing, reason: 'no archetype match — needs review' });
    }

    // Any variant meaning still empty is owed to layer 4 / a human.
    const stillEmpty = Object.entries(record.variants || {}).flatMap(([axis, vals]) =>
      Object.entries(vals).filter(([, v]) => !v).map(([v]) => `${axis}.${v}`),
    );
    if (stillEmpty.length) owed.push({ name: record.name, missing: stillEmpty, reason: 'no vocabulary entry — needs review' });

    const problems = validateRecord(record, file);
    if (problems.length) { console.error(problems.map((p) => `  ✗ ${p}`).join('\n')); process.exit(1); }

    if (JSON.stringify(record) !== before) {
      if (!CHECK) writeFileSync(abs, JSON.stringify(record, null, 2) + '\n');
      changed.push({ name: record.name, archetype: archetypeKey || 'fallback', fingerprint: canonicalFingerprint(record) });
    }
  }

  // Re-stamp manifest pointers: enrichment changes the canonical fingerprint, and
  // the Figma surface was NOT re-rendered, so it is legitimately stale until the
  // marker pass. Record the new fingerprint; the stamp pass reconciles the surface.
  if (!CHECK && changed.length) {
    const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
    const meta = (manifest.components.meta = manifest.components.meta || {});
    for (const c of changed) {
      if (meta[c.name] && meta[c.name].doc) meta[c.name].doc.fingerprint = c.fingerprint;
    }
    writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
  }

  console.log(`${CHECK ? 'would enrich' : 'enriched'} ${changed.length} of ${files.length} record(s)`);
  console.log(`  variant meanings filled: ${variantMeaningsFilled}`);
  const byArch = {};
  for (const c of changed) byArch[c.archetype] = (byArch[c.archetype] || 0) + 1;
  for (const [a, n] of Object.entries(byArch).sort((x, y) => y[1] - x[1])) console.log(`  ${a.padEnd(12)} ${n}`);

  if (owed.length) {
    console.log(`\n${owed.length} block(s) still owed to human review (layer 4 — not inferable):`);
    for (const o of owed.slice(0, 8)) console.log(`  ~ ${o.name}: ${o.missing.join(', ')} — ${o.reason}`);
    if (owed.length > 8) console.log(`  … and ${owed.length - 8} more`);
  }
  if (CHECK && changed.length) { console.error('\n✗ records are not enriched. Run: npm run docs:enrich'); process.exit(1); }
}

main();

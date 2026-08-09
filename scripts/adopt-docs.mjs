#!/usr/bin/env node
/**
 * Jake UI — documentation adoption, step 2 of 2: Figma descriptions -> records.
 *
 * WHY THIS EXISTS
 * 86 components already carry hand-written Figma descriptions; only one has a
 * code-side doc. This claims the existing content into canonical
 * `docs/components/<Name>.doc.json` records marked `provenance: imported`,
 * rather than authoring 86 docs from scratch. Adoption, not generation — the
 * brownfield first-run rule: never overwrite existing human-written docs.
 *
 * HOW TO REGENERATE
 *   1. Execute scripts/figma-docs-query.js through the Figma Desktop Bridge.
 *   2. Save its JSON to design-system/.figma-docs-dump.json
 *   3. node design-system/scripts/adopt-docs.mjs [--check]
 *
 *   --check   write nothing; exit 1 if any record on disk differs from what
 *             would be generated, or if an imported block would be overwritten.
 *
 * WHAT IT PARSES
 * The descriptions follow the house format (docs/figma-descriptions.md):
 *
 *   {authored lead}
 *   ———
 *   ANATOMY / STATE TOKENS
 *   State=Default — fill card · border 1px input · radius radius/lg · ...
 *   CODE API — full contract: docs/state-decomposition.md
 *   Props — Value: string · Tone: info | success | warning
 *   ! Decompose — State [...] → ...
 *   DO / DO NOT
 *   + do this
 *   - do not do this
 *
 * Anything it cannot confidently parse is left absent rather than guessed. An
 * absent block is honest; an invented one is worse than nothing.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { canonicalFingerprint, renderHash, validateRecord, recordFileName, isProtected } from './lib/doc-record.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DUMP = resolve(ROOT, '.figma-docs-dump.json');
const OUT_DIR = resolve(ROOT, 'docs/components');
const MANIFEST = resolve(ROOT, 'design-system.json');
const CHECK = process.argv.includes('--check');

const RULE = '———';

/** Token references inside an anatomy line, e.g. "fill card", "radius radius/lg". */
const TOKEN_WORD = /(?:fill|border|text|type|radius|shadow|gap|padding)\s+(?:\d+px\s+)?([a-z][a-z0-9/-]*)/g;

function splitDescription(desc) {
  const i = desc.indexOf(RULE);
  if (i === -1) return { lead: desc.trim(), generated: '' };
  return { lead: desc.slice(0, i).trim(), generated: desc.slice(i + RULE.length).trim() };
}

function section(generated, heading) {
  // Headings are ALL-CAPS lines; a section runs to the next heading or the end.
  const lines = generated.split('\n');
  const start = lines.findIndex((l) => l.trim().startsWith(heading));
  if (start === -1) return [];
  const out = [];
  for (let i = start + 1; i < lines.length; i++) {
    const l = lines[i];
    if (/^[A-Z][A-Z /]{3,}$/.test(l.trim()) && !l.includes('—')) break;
    if (/^(CODE API|DO \/ DO NOT|ANATOMY)/.test(l.trim())) break;
    if (l.trim()) out.push(l.trim());
  }
  return out;
}

function parseStates(generated) {
  const states = {};
  for (const line of section(generated, 'ANATOMY / STATE TOKENS')) {
    const m = line.match(/^(.+?)\s+—\s+(.+)$/);
    if (!m) continue;
    const key = m[1].trim();
    if (/^\(\+\d+/.test(key)) continue; // "(+2 further variants share these tokens)"
    states[key] = m[2].trim();
  }
  return Object.keys(states).length ? states : undefined;
}

function parseTokensUsed(generated) {
  const found = new Set();
  for (const line of section(generated, 'ANATOMY / STATE TOKENS')) {
    for (const m of line.matchAll(TOKEN_WORD)) {
      const t = m[1];
      if (t && !/^\d/.test(t) && t !== 'px') found.add(t);
    }
  }
  return found.size ? [...found].sort() : undefined;
}

/** `Props — Tone: info | success | warning` becomes a variants entry. */
function parseVariants(generated) {
  const variants = {};
  const propsLine = generated.split('\n').find((l) => l.trim().startsWith('Props —'));
  if (!propsLine) return undefined;
  const body = propsLine.replace(/^\s*Props\s*—\s*/, '');
  for (const part of body.split('·')) {
    const m = part.trim().match(/^(.+?):\s*(.+)$/);
    if (!m) continue;
    const [, name, type] = m;
    if (!type.includes('|')) continue; // only enumerated props are variants
    const values = {};
    for (const v of type.split('|')) values[v.trim()] = '';
    variants[name.trim().toLowerCase()] = values;
  }
  return Object.keys(variants).length ? variants : undefined;
}

function parseDosDonts(generated) {
  const dos = [];
  const donts = [];
  for (const line of section(generated, 'DO / DO NOT')) {
    if (line.startsWith('+')) dos.push(line.slice(1).trim());
    else if (line.startsWith('-')) donts.push(line.slice(1).trim());
  }
  return { dos: dos.length ? dos : undefined, donts: donts.length ? donts : undefined };
}

/** Pull an explicit accessibility paragraph out of the authored lead. */
function parseAccessibility(lead, generated) {
  const para = lead
    .split(/\n\s*\n/)
    .find((p) => /^accessibility\b/i.test(p.trim()) || /^a11y\b/i.test(p.trim()));
  const decompose = generated.split('\n').find((l) => l.trim().startsWith('! Decompose'));
  if (!para && !decompose) return undefined;
  const notes = [];
  if (para) notes.push(para.replace(/^accessibility contract:\s*/i, '').replace(/\s+/g, ' ').trim());
  if (decompose) {
    notes.push(
      'State decomposition applies — see docs/state-decomposition.md. ' +
        decompose.replace(/^\s*!\s*Decompose\s*—\s*/, '').trim(),
    );
  }
  return notes.length ? { notes } : undefined;
}

/** First sentence of the lead, for `summary`. */
function firstSentence(lead) {
  const first = lead.split(/\n\s*\n/)[0].replace(/\s+/g, ' ').trim();
  const m = first.match(/^(.+?[.!?])(\s|$)/);
  return (m ? m[1] : first).trim();
}

function buildRecord(entry, today) {
  const { lead, generated } = splitDescription(entry.description || '');
  if (!lead) return null;

  const { dos, donts } = parseDosDonts(generated);
  const record = {
    name: entry.name,
    summary: firstSentence(lead),
    description: lead.replace(/\s*\n\s*\n\s*/g, '\n\n').trim(),
    variants: parseVariants(generated),
    states: parseStates(generated),
    dos,
    donts,
    accessibility: parseAccessibility(lead, generated),
    tokensUsed: parseTokensUsed(generated),
    status: entry.status || 'draft',
    updatedAt: today,
  };

  // Drop undefined blocks — an absent block is honest, an empty one is noise.
  for (const k of Object.keys(record)) if (record[k] === undefined) delete record[k];

  // Every block here came out of the Figma description, so all of it is imported.
  record.provenance = Object.fromEntries(
    ['description', 'variants', 'states', 'dos', 'donts', 'accessibility', 'tokensUsed']
      .filter((k) => k in record)
      .map((k) => [k, 'imported']),
  );
  return record;
}

function main() {
  if (!existsSync(DUMP)) {
    console.error(`Missing ${DUMP}\nSee the header of this file for how to produce it.`);
    process.exit(1);
  }
  const dump = JSON.parse(readFileSync(DUMP, 'utf8'));
  const today = (dump.generatedAt || new Date().toISOString()).slice(0, 10);
  mkdirSync(OUT_DIR, { recursive: true });

  const written = [];
  const skipped = [];
  const drift = [];
  const problems = [];
  const pointers = {};

  for (const entry of dump.components) {
    const record = buildRecord(entry, today);
    if (!record) { skipped.push({ name: entry.name, why: 'no description to adopt' }); continue; }

    const errs = validateRecord(record, entry.name);
    if (errs.length) { problems.push(...errs); continue; }

    const file = resolve(OUT_DIR, recordFileName(entry.name));
    const next = JSON.stringify(record, null, 2) + '\n';

    if (existsSync(file)) {
      const current = readFileSync(file, 'utf8');
      if (current === next) { skipped.push({ name: entry.name, why: 'unchanged' }); continue; }
      let existing;
      try { existing = JSON.parse(current); } catch { existing = null; }

      // A record that enrichment has touched will legitimately differ from a fresh
      // adoption — it carries best-practice / framework / w3c-apg blocks the Figma
      // description never had. That is not drift. What matters is that the
      // IMPORTED blocks still match the source.
      if (existing) {
        // Only a block whose provenance is PURELY "imported" must still match the
        // source exactly. A mixed block like "imported+framework" (variant keys
        // imported, meanings added by enrichment) is expected to differ — testing
        // it for equality would flag enrichment as drift.
        const importedKeys = Object.entries(existing.provenance || {})
          .filter(([, v]) => String(v).trim() === 'imported')
          .map(([k]) => k);
        const importedDiffer = importedKeys.filter(
          (k) => JSON.stringify(existing[k]) !== JSON.stringify(record[k]),
        );
        if (!importedDiffer.length) {
          skipped.push({ name: entry.name, why: 'enriched — imported blocks still match source' });
          continue;
        }
        // Imported content genuinely diverges: refuse rather than clobber.
        drift.push({ name: entry.name, protectedBlocks: importedDiffer });
        continue;
      }
      drift.push({ name: entry.name, protectedBlocks: [] });
    }

    if (!CHECK) writeFileSync(file, next);
    const fp = canonicalFingerprint(record);
    written.push({ name: entry.name, fingerprint: fp, blocks: Object.keys(record.provenance || {}).length });

    // The Figma description IS the surface this record was adopted from, so it is
    // in sync by construction. Record the pointer so docs:check has something to
    // compare against; the code surfaces come later from Storybook.
    pointers[entry.name] = {
      path: `docs/components/${recordFileName(entry.name)}`,
      fingerprint: fp,
      surfaces: {
        figmaDescription: {
          src: fp,
          render: renderHash(entry.description || ''),
          // The Figma description is the SOURCE this record was adopted from, not a
          // rendering of it. Once enrichment adds archetype/framework blocks the
          // description no longer carries the whole record — that is a partial
          // projection by design, and the brownfield rule forbids re-rendering it.
          // docs:check reports that as informational rather than as drift.
          adopted: true,
        },
      },
    };
  }

  if (problems.length) {
    console.error(`\n${problems.length} invalid record(s):`);
    for (const p of problems) console.error(`  ✗ ${p}`);
    process.exit(1);
  }

  const verb = CHECK ? 'would adopt' : 'adopted';
  console.log(`${verb} ${written.length} record(s) into docs/components/`);
  if (skipped.length) {
    const unchanged = skipped.filter((s) => s.why === 'unchanged').length;
    const nodesc = skipped.filter((s) => s.why !== 'unchanged');
    if (unchanged) console.log(`  ${unchanged} unchanged`);
    for (const s of nodesc) console.log(`  · skipped ${s.name} — ${s.why}`);
  }
  const clobber = drift.filter((d) => d.protectedBlocks.length);
  if (clobber.length) {
    console.error(`\n${clobber.length} record(s) would overwrite imported/user blocks — refusing:`);
    for (const d of clobber) console.error(`  ✗ ${d.name}: ${d.protectedBlocks.join(', ')}`);
    process.exit(1);
  }
  if (CHECK && written.length) {
    console.error(`\n✗ ${written.length} record(s) differ from the dump. Run: node design-system/scripts/adopt-docs.mjs`);
    process.exit(1);
  }
  // Write the manifest pointers so docs:check has a baseline. Only
  // components.meta[*].doc is touched; every other manifest field is left alone.
  if (!CHECK && Object.keys(pointers).length) {
    const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
    manifest.components = manifest.components || { built: [], meta: {}, instanceSwapUpgradePending: [] };
    manifest.components.meta = manifest.components.meta || {};
    for (const [name, doc] of Object.entries(pointers)) {
      const entry = manifest.components.meta[name] || {};
      entry.doc = doc;
      if (!entry.status) entry.status = 'draft';
      if (!entry.updatedAt) entry.updatedAt = new Date().toISOString();
      manifest.components.meta[name] = entry;
    }
    writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
    console.log(`  manifest pointers written for ${Object.keys(pointers).length} component(s)`);
  }

  const onDisk = readdirSync(OUT_DIR).filter((f) => f.endsWith('.doc.json')).length;
  console.log(`\n${onDisk} record(s) on disk.`);
}

main();

#!/usr/bin/env node
/**
 * Jake UI — doc-record ingest, step 2 of 2: LIVE BINDINGS -> records.
 *
 * WHY THIS WAS REWRITTEN (10 Aug 2026)
 * This script used to read `.figma-docs-dump.json`: the hand-written Figma
 * DESCRIPTION on each component, parsed out of a house prose format. That source
 * was wrong seven separate times in two days, every time in a way that shipped a
 * real visual bug:
 *
 *   Badge / Success       said info-foreground            binds success-foreground
 *   Badge / Destructive   said destructive-foreground     binds card
 *   Card / Title          said info-foreground, size/11   binds foreground, 16px
 *   Label                 said Body/MD                    binds Label/LG
 *   Dialog / Title        said "size/18 and size/13"      binds Heading/LG on both
 *   Tabs / Density        said "no spacing recorded"      binds space/1 · space/0-75
 *   Alert / Destructive   said "no surface fill"          carried a solid #fdeae9
 *
 * and it reported 16 unbound text nodes where a direct read found 469. Each of
 * those was corrected in the COMPONENT source, which left the records as a
 * standing hazard: the next `docs:adopt` would have re-imported the wrong values
 * over corrections that had cost an audit to find. The handoff called it a time
 * bomb, and it was.
 *
 * The descriptions are prose maintained by hand. They drift the moment anyone
 * rebinds a token without retyping the paragraph, and NOTHING can detect it —
 * that is the defining property of the defect. Bindings cannot drift from
 * themselves.
 *
 * WHAT IS GENERATED AND WHAT IS PRESERVED
 * The split is the whole design. A binding has a single source of truth in the
 * file; prose does not exist there at all.
 *
 *   GENERATED from bindings, overwritten every run:
 *     states       per-variant token sets, read from the live file
 *     tokensUsed   derived from states, so it can never disagree with them
 *
 *   PRESERVED from the existing record, never regenerated and never dropped:
 *     summary · description · variants · dos · donts
 *     whenToUse · whenNotToUse · accessibility · status
 *
 * There is no third category. A field is either in the file or it is not.
 *
 * IDEMPOTENCE
 * Generated fields are a pure function of the dump; preserved fields are copied
 * from the record being rewritten. So the second run produces the first run's
 * output exactly, and `docs:adopt` twice is a no-op. That is asserted, not
 * assumed — see the `--check` flag and the exit criteria in the handoff.
 *
 * HOW TO REGENERATE
 *   1. Open Figma Desktop on ovnLtL9xbX8SG5xDw673Un with the Desktop Bridge plugin.
 *   2. Execute the body of scripts/figma-bindings-query.js through the bridge.
 *   3. Save its JSON to design-system/.figma-bindings-dump.json
 *   4. node design-system/scripts/adopt-docs.mjs [--check]
 *
 *   --check   write nothing; exit 1 if any record on disk differs from what
 *             would be generated.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { canonicalFingerprint, renderHash, validateRecord, recordFileName, isProtected } from './lib/doc-record.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DUMP = resolve(ROOT, '.figma-bindings-dump.json');
const OUT_DIR = resolve(ROOT, 'docs/components');
const MANIFEST = resolve(ROOT, 'design-system.json');
const CHECK = process.argv.includes('--check');

/** Fields this script owns. Everything else belongs to the record. */
const GENERATED = ['states', 'tokensUsed'];

/** Fields carried across untouched. Prose has no binding equivalent. */
const PRESERVED = [
  'summary', 'description', 'variants', 'dos', 'donts',
  'whenToUse', 'whenNotToUse', 'accessibility', 'status',
];

/** Leading keywords in a token phrase, and the positional markers to discard. */
const PHRASE_HEAD = /^(fill|border|radius|padding|gap|opacity|text|type|shadow)\b\s*/;
const POSITIONAL = new Set(['y', 'x', 't', 'r', 'b', 'l', '—']);

/**
 * Pull real token names out of one phrase.
 *
 * `type` and `shadow` name a STYLE, which may contain spaces ("Effect/Code
 * Inset"), so their remainder is taken whole. Everything else is a list of
 * variable names with positional markers interleaved.
 *
 * UNTOKENISED and UNBOUND mark values that have no token at all. They are kept
 * in `states` — that is exactly the kind of thing this record must surface — but
 * they contribute nothing to `tokensUsed`, because no token was used.
 */
function tokensInPhrase(phrase) {
  const head = phrase.match(PHRASE_HEAD);
  if (!head) return [];
  const kind = head[1];
  const rest = phrase.slice(head[0].length).trim();
  if (!rest || /^(UNTOKENISED|UNBOUND)\b/.test(rest)) return [];
  if (kind === 'type' || kind === 'shadow') return [rest];
  return rest
    .split(/\s+/)
    .filter((w) => w && !POSITIONAL.has(w) && !/^#/.test(w) && !/^\d/.test(w));
}

function tokensUsedFrom(states) {
  const found = new Set();
  for (const tokens of Object.values(states)) {
    for (const phrase of String(tokens).split(' · ')) {
      for (const t of tokensInPhrase(phrase)) found.add(t);
    }
  }
  return found.size ? [...found].sort() : undefined;
}

/** Read the record already on disk, so its prose can be carried forward. */
function existingRecord(name) {
  const file = resolve(OUT_DIR, recordFileName(name));
  if (!existsSync(file)) return null;
  try { return JSON.parse(readFileSync(file, 'utf8')); } catch { return null; }
}

function buildRecord(entry, today) {
  const prior = existingRecord(entry.name);

  // Prose cannot be invented. A component with no record and no authored summary
  // is skipped rather than given a machine-written one.
  if (!prior) return { skip: 'no existing record — bindings alone cannot supply prose' };

  const record = { name: entry.name };
  for (const f of PRESERVED) if (prior[f] !== undefined) record[f] = prior[f];

  const priorProv = prior.provenance || {};
  for (const f of GENERATED) {
    // A block a human took ownership of stays theirs, even here.
    if (isProtected(priorProv[f]) && String(priorProv[f]).includes('user')) {
      if (prior[f] !== undefined) record[f] = prior[f];
      continue;
    }
    if (f === 'states') record.states = entry.states;
    if (f === 'tokensUsed') {
      const t = tokensUsedFrom(entry.states);
      if (t) record.tokensUsed = t;
    }
  }

  record.status = record.status || 'draft';
  record.updatedAt = today;

  for (const k of Object.keys(record)) if (record[k] === undefined) delete record[k];

  // Provenance: preserved blocks keep whatever they had; generated blocks are
  // now sourced from the file itself, which is a stronger claim than "imported".
  const prov = {};
  for (const f of PRESERVED) if (f in record && priorProv[f]) prov[f] = priorProv[f];
  for (const f of GENERATED) {
    if (!(f in record)) continue;
    prov[f] = isProtected(priorProv[f]) && String(priorProv[f]).includes('user')
      ? priorProv[f]
      : 'live-bindings';
  }
  // Blocks enrichment added that are not in either list keep their provenance.
  for (const [k, v] of Object.entries(priorProv)) if (!(k in prov) && k in record) prov[k] = v;
  record.provenance = prov;

  return { record };
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
  const unchanged = [];
  const skipped = [];
  const problems = [];
  const pointers = {};

  for (const entry of dump.components) {
    const { record, skip } = buildRecord(entry, today);
    if (skip) { skipped.push({ name: entry.name, why: skip }); continue; }

    const errs = validateRecord(record, entry.name);
    if (errs.length) { problems.push(...errs); continue; }

    const file = resolve(OUT_DIR, recordFileName(entry.name));
    const next = JSON.stringify(record, null, 2) + '\n';
    const fp = canonicalFingerprint(record);

    // The bindings ARE the surface this record is projected from, so the pointer
    // is in sync by construction. `adopted` marks it as a SOURCE rather than a
    // rendering, which is what stops docs:check reading enrichment as staleness.
    pointers[entry.name] = {
      path: `docs/components/${recordFileName(entry.name)}`,
      fingerprint: fp,
      surfaces: {
        figmaBindings: {
          src: fp,
          render: renderHash(JSON.stringify(entry.states)),
          adopted: true,
        },
      },
    };

    if (existsSync(file) && readFileSync(file, 'utf8') === next) {
      unchanged.push(entry.name);
      continue;
    }
    if (!CHECK) writeFileSync(file, next);
    written.push({ name: entry.name, fingerprint: fp });
  }

  if (problems.length) {
    console.error(`\n${problems.length} invalid record(s):`);
    for (const p of problems) console.error(`  ✗ ${p}`);
    process.exit(1);
  }

  const verb = CHECK ? 'would rewrite' : 'rewrote';
  console.log(`Jake UI docs — ${verb} ${written.length} record(s) from live bindings; ${unchanged.length} unchanged.`);
  for (const s of skipped) console.log(`  · skipped ${s.name} — ${s.why}`);

  if (CHECK && written.length) {
    console.error(`\n✗ ${written.length} record(s) differ from the bindings dump. Run: node design-system/scripts/adopt-docs.mjs`);
    for (const w of written.slice(0, 10)) console.error(`    ${w.name}`);
    process.exit(1);
  }

  if (!CHECK && Object.keys(pointers).length) {
    const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
    manifest.components = manifest.components || { built: [], meta: {}, instanceSwapUpgradePending: [] };
    manifest.components.meta = manifest.components.meta || {};
    for (const [name, doc] of Object.entries(pointers)) {
      const entry = manifest.components.meta[name] || {};
      entry.doc = doc;
      if (!entry.status) entry.status = 'draft';
      if (!entry.updatedAt) entry.updatedAt = `${today}T00:00:00.000Z`;
      manifest.components.meta[name] = entry;
    }
    writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
    console.log(`  manifest pointers written for ${Object.keys(pointers).length} component(s)`);
  }

  const onDisk = readdirSync(OUT_DIR).filter((f) => f.endsWith('.doc.json')).length;
  console.log(`${onDisk} record(s) on disk.`);
}

main();

#!/usr/bin/env node
/**
 * Jake UI — AI documentation digest.
 *
 * Projects every `docs/components/<Name>.doc.json` record into ONE file an agent
 * can read in a single pass: docs/DIGEST.md.
 *
 * Why it exists: the per-component records are the canonical source, but an agent
 * asked to build a screen should not have to open 86 files to learn the system's
 * usage rules. This is the digest surface from the projection contract — the only
 * one that carries `tokensUsed`, because code needs it and Figma does not.
 *
 * GENERATED — never hand-edit. Change the records (or docs/archetypes.json) and
 * re-run `npm run docs:digest`.
 *
 *   node design-system/scripts/docs-digest.mjs [--check]
 *
 *   --check   write nothing; exit 1 if DIGEST.md is stale or hand-edited.
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { canonicalFingerprint } from './lib/doc-record.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS_DIR = resolve(ROOT, 'docs/components');
const OUT = resolve(ROOT, 'docs/DIGEST.md');
const CHECK = process.argv.includes('--check');

const list = (arr) => (arr || []).map((x) => `- ${x}`).join('\n');

function renderRecord(r) {
  const out = [];
  out.push(`## ${r.name}`);
  out.push('');
  out.push(`**${r.summary}**`);
  out.push('');
  if (r.description && r.description !== r.summary) {
    out.push(r.description);
    out.push('');
  }
  if (r.whenToUse) { out.push('**When to use**'); out.push(list(r.whenToUse)); out.push(''); }
  if (r.whenNotToUse) { out.push('**When not to use**'); out.push(list(r.whenNotToUse)); out.push(''); }

  if (r.variants && Object.keys(r.variants).length) {
    out.push('**Variants**');
    out.push('');
    out.push('| Axis | Value | Meaning |');
    out.push('|---|---|---|');
    for (const [axis, values] of Object.entries(r.variants)) {
      for (const [value, meaning] of Object.entries(values)) {
        out.push(`| \`${axis}\` | \`${value}\` | ${meaning || '_needs review_'} |`);
      }
    }
    out.push('');
  }

  if (r.states && Object.keys(r.states).length) {
    out.push('**State → tokens**');
    out.push('');
    out.push('| State | Tokens |');
    out.push('|---|---|');
    for (const [state, tokens] of Object.entries(r.states)) {
      out.push(`| ${state} | ${tokens} |`);
    }
    out.push('');
  }

  if (r.dos) { out.push('**Do**'); out.push(list(r.dos)); out.push(''); }
  if (r.donts) { out.push('**Do not**'); out.push(list(r.donts)); out.push(''); }

  if (r.accessibility) {
    out.push('**Accessibility**');
    if (r.accessibility.role) out.push(`- Role: \`${r.accessibility.role}\``);
    for (const k of r.accessibility.keyboard || []) out.push(`- Keyboard: ${k}`);
    for (const n of r.accessibility.notes || []) out.push(`- ${n}`);
    out.push('');
  }

  if (r.tokensUsed) {
    out.push(`**Tokens used** — ${r.tokensUsed.map((t) => `\`${t}\``).join(' · ')}`);
    out.push('');
  }

  const prov = Object.entries(r.provenance || {}).map(([k, v]) => `${k}:${v}`).join(' · ');
  out.push(`<sub>status \`${r.status}\` · updated ${r.updatedAt} · fingerprint \`${canonicalFingerprint(r)}\`${prov ? ` · provenance ${prov}` : ''}</sub>`);
  out.push('');
  return out.join('\n');
}

function build() {
  const files = readdirSync(DOCS_DIR).filter((f) => f.endsWith('.doc.json')).sort();
  const records = files.map((f) => JSON.parse(readFileSync(resolve(DOCS_DIR, f), 'utf8')));
  records.sort((a, b) => a.name.localeCompare(b.name));

  const needsReview = records.filter((r) =>
    !r.whenToUse ||
    Object.values(r.variants || {}).some((vals) => Object.values(vals).some((v) => !v)),
  );

  const head = [];
  head.push('# Jake UI — component usage digest');
  head.push('');
  head.push('**GENERATED — do not hand-edit.** Source of truth is one');
  head.push('`docs/components/<Name>.doc.json` record per component. Change those (or');
  head.push('`docs/archetypes.json`) and re-run `npm run docs:digest`.');
  head.push('');
  head.push('This is the single-file surface for an agent building against Jake UI: every');
  head.push("component's purpose, variant meanings, state→token bindings, do/do-not rules,");
  head.push('accessibility contract, and the tokens it consumes.');
  head.push('');
  head.push(`**${records.length} component(s) documented.**`);
  if (needsReview.length) {
    head.push('');
    head.push(`⚠️ **${needsReview.length} record(s) carry blocks still owed to human review** — a missing`);
    head.push('`When to use`, or a variant meaning marked _needs review_. Those gaps are');
    head.push('deliberate: they cannot be inferred from Figma or from an archetype, and');
    head.push('inventing them would be worse than leaving them visible.');
  }
  head.push('');
  head.push('---');
  head.push('');
  head.push('## Contents');
  head.push('');
  for (const r of records) head.push(`- [${r.name}](#${r.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')})`);
  head.push('');
  head.push('---');
  head.push('');

  return head.join('\n') + records.map(renderRecord).join('\n---\n\n');
}

function main() {
  const next = build();
  if (CHECK) {
    if (!existsSync(OUT)) { console.error(`✗ ${OUT} is missing. Run: npm run docs:digest`); process.exit(1); }
    if (readFileSync(OUT, 'utf8') !== next) {
      console.error('✗ docs/DIGEST.md is out of date or hand-edited.\n  Run: node design-system/scripts/docs-digest.mjs');
      process.exit(1);
    }
    console.log('✓ docs/DIGEST.md matches the records.');
    return;
  }
  writeFileSync(OUT, next);
  const n = readdirSync(DOCS_DIR).filter((f) => f.endsWith('.doc.json')).length;
  console.log(`✓ wrote docs/DIGEST.md\n  ${n} component(s) · ${next.split('\n').length} lines`);
}

main();

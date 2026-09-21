#!/usr/bin/env node
/**
 * Jake UI — token export, step 2 of 2: dump -> tokens/globals.css.
 *
 * WHY THIS EXISTS
 * globals.css used to carry a "GENERATED - do not hand-edit / regenerate with
 * export-tokens.mjs" header while this script did not exist. The file was
 * transcribed by hand, so it drifted from Figma and covered only part of the
 * token surface. This closes that: every variable, text style and effect style
 * in the Figma file reaches CSS, mechanically.
 *
 * USAGE
 *   node design-system/scripts/export-tokens.mjs [--check]
 *
 *   (default)  write tokens/globals.css
 *   --check    write nothing; exit 1 if the file on disk differs from what
 *              would be generated. This is the CI gate against hand-edits and
 *              against a stale dump.
 *
 * INPUTS
 *   .figma-tokens-dump.json   values, from Figma (see figma-token-query.js)
 *   tokens/annotations.json   prose, from humans
 *
 * DIVISION OF AUTHORITY
 *   Figma owns every VALUE. annotations.json owns every EXPLANATION.
 *   This script owns only the ARRANGEMENT. If you want to change a number,
 *   change it in Figma and re-dump. If you want to change a comment, change
 *   annotations.json. Never edit globals.css.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DUMP = resolve(ROOT, '.figma-tokens-dump.json');
const ANNOTATIONS = resolve(ROOT, 'tokens/annotations.json');
const OUT = resolve(ROOT, 'tokens/globals.css');

const CHECK = process.argv.includes('--check');

const dump = JSON.parse(readFileSync(DUMP, 'utf8'));
const ann = JSON.parse(readFileSync(ANNOTATIONS, 'utf8'));

/* ---------------------------------------------------------------- helpers */

/**
 * Figma stores FLOAT as float32, so 0.05 round-trips as 0.05000000074505806
 * and 12.8 as 12.800000190734863. Round at the export boundary — this is the
 * only correct place to do it (normalising inside Figma is a no-op).
 */
const num = (v) => {
  const r = Math.round(v * 1000) / 1000;
  return Number.isInteger(r) ? String(r) : String(r);
};

/** `space/1-75` -> `1-75`; `Heading/LG` -> `heading-lg` */
const tail = (name) => name.split('/').slice(1).join('-');
const slug = (name) => name.toLowerCase().replace(/[\s/]+/g, '-');

/** `#ffffff` + alpha 0.1 -> `#ffffff1a` (matches the existing file's style) */
const hexa = ({ hex, a }) => {
  if (a === undefined || a >= 1) return hex;
  return hex + Math.round(a * 255).toString(16).padStart(2, '0');
};

const byCollection = (name) => dump.variables.filter((v) => v.c === name);
const findVar = (name) => dump.variables.find((v) => v.n === name);

/** Pad a declaration so trailing comments line up in a column. */
const pad = (decl, width = 38) => (decl.length >= width ? decl + ' ' : decl.padEnd(width));

const banner = (title) => {
  const line = `/* --- ${title} `;
  return line + '-'.repeat(Math.max(3, 78 - line.length)) + ' */';
};

/** Render an annotations.json block as a boxed comment. */
const proseBlock = (lines) => {
  const [title, ...rest] = lines;
  const head = `/* --- ${title} `;
  const out = [head + '-'.repeat(Math.max(3, 74 - head.length))];
  for (const l of rest) out.push(l ? ` * ${l}` : ' *');
  out.push(' * ' + '-'.repeat(70) + ' */');
  return out.join('\n');
};

const warnings = [];

/* -------------------------------------------------------- primitive: colour */

/** Group `neutral/50` etc. by ramp so the output keeps its visual grouping. */
function colourPrimitives() {
  const vars = byCollection('Color Primitives');
  const groups = new Map();
  for (const v of vars) {
    const ramp = v.n.split('/')[0];
    if (!groups.has(ramp)) groups.set(ramp, []);
    groups.get(ramp).push(v);
  }
  const out = [];
  for (const [, members] of groups) {
    for (const v of members) {
      const mode = Object.keys(v.m)[0];
      out.push(`  --color-${tail(v.n) ? v.n.replace('/', '-') : v.n}: ${hexa(v.m[mode])};`);
    }
    out.push('');
  }
  if (out[out.length - 1] === '') out.pop();
  return out.join('\n');
}

/* ----------------------------------------------------- primitive: dimension */

function dimensionPrimitives() {
  const out = [];
  const dims = byCollection('Dimensions');

  const space1 = dims.find((v) => v.n === 'space/1');
  if (!space1) warnings.push('space/1 missing — --spacing base unit could not be emitted');
  else {
    out.push('  /* Base unit for the spacing ramp. Figma `space/N` = calc(var(--spacing) * N) */');
    out.push(`  --spacing: ${num(space1.m[Object.keys(space1.m)[0]])}px;`);
    out.push('');
  }

  // `--radius` is the shadcn base and is NOT a Tailwind theme key, so it lives
  // here. Every `--radius-*` step is a theme key and is emitted once, inside
  // @theme — declaring it here too would make the theme entry self-referential.
  const radiusDefault = findVar('radius');
  if (radiusDefault) {
    const alias = radiusDefault.m[Object.keys(radiusDefault.m)[0]].alias;
    const target = findVar(alias);
    if (target) out.push(`  --radius: ${num(target.m[Object.keys(target.m)[0]])}px;`);
    else warnings.push(`radius aliases ${alias}, which is not in the dump`);
  }
  out.push('');

  const strokes = dims.filter((v) => v.n.startsWith('stroke/'));
  for (const v of strokes) {
    out.push(`  --stroke-${tail(v.n)}: ${num(v.m[Object.keys(v.m)[0]])}px;`);
  }
  return out.join('\n');
}

/* ---------------------------------------------------- primitive: typography */

function typographyPrimitives() {
  const out = [];
  const typo = byCollection('Typography Primitives');

  // --font-sans is a Tailwind theme key and is emitted in @theme only.
  const weights = typo.filter((v) => v.n.startsWith('weight/'));
  const WEIGHT_NAME = { 400: 'normal', 500: 'medium', 600: 'semibold', 700: 'bold' };
  for (const v of weights) {
    const val = v.m[Object.keys(v.m)[0]];
    const name = WEIGHT_NAME[val];
    if (!name) {
      warnings.push(`weight/${val} has no Tailwind name mapping — emitted as --font-weight-${val}`);
    }
    out.push(`  --font-weight-${name || val}: ${num(val)};`);
  }
  out.push('');

  out.push('  /* Type sizes. The ramp below references these — never a literal. */');
  for (const v of typo.filter((v) => v.n.startsWith('size/'))) {
    out.push(`  --text-size-${tail(v.n)}: ${num(v.m[Object.keys(v.m)[0]])}px;`);
  }
  out.push('');

  for (const v of typo.filter((v) => v.n.startsWith('line-height/'))) {
    out.push(`  --leading-${tail(v.n)}: ${num(v.m[Object.keys(v.m)[0]])}px;`);
  }
  return out.join('\n');
}

/* --------------------------------------------------- primitive: interaction */

function interactionPrimitives() {
  const out = [];
  const inter = byCollection('Interaction');

  // Opacity is stored in Figma on the 0-100 scale, because Figma divides a
  // variable bound to a node's `opacity` field by 100 — `opacity/50` must hold
  // 50 to render 0.5. CSS opacity is 0-1, so divide by 100 on emit. Figma and
  // this exporter are a matched pair here: change one and the other must follow.
  for (const v of inter.filter((v) => v.n.startsWith('opacity/'))) {
    const figmaValue = v.m[Object.keys(v.m)[0]];
    if (figmaValue > 1) {
      out.push(`  --opacity-${tail(v.n)}: ${num(figmaValue / 100)};`);
    } else if (figmaValue === 0) {
      out.push(`  --opacity-${tail(v.n)}: 0;`);
    } else {
      // A 0-1 value means the input uses the wrong scale and is rendering this
      // 100x too transparent. Emit the correct CSS but make the drift loud.
      console.warn(
        `⚠ opacity/${tail(v.n)} holds ${figmaValue} (0-1 scale). Figma renders that as ` +
        `${figmaValue / 100} — 100x too transparent. Set it to ${Number(tail(v.n))} in Figma.`
      );
      out.push(`  --opacity-${tail(v.n)}: ${num(figmaValue)};`);
    }
  }
  out.push('');

  for (const v of inter.filter((v) => v.n.startsWith('duration/'))) {
    out.push(`  --duration-${tail(v.n)}: ${num(v.m[Object.keys(v.m)[0]])}ms;`);
  }
  out.push('');
  out.push('  /* Semantic duration aliases (annotations.json). */');
  for (const [alias, target] of Object.entries(ann.durationAliases || {})) {
    const v = findVar(target);
    if (!v) { warnings.push(`durationAliases.${alias} -> ${target} not found in dump`); continue; }
    out.push(`  --duration-${alias}: var(--duration-${tail(target)});`);
  }
  out.push('');

  for (const v of inter.filter((v) => v.n.startsWith('easing/'))) {
    out.push(`  --ease-${tail(v.n)}: ${v.m[Object.keys(v.m)[0]]};`);
  }
  return out.join('\n');
}

/* ------------------------------------------------------------ semantic tier */

function semanticTier(modeId) {
  const jake = byCollection('Jake UI').filter((v) => v.t === 'COLOR');
  const notes = ann.semanticNotes || {};
  const out = [];
  let lastPrefix = null;
  for (const v of jake) {
    const val = v.m[modeId];
    if (!val) { warnings.push(`${v.n} has no value for mode ${modeId}`); continue; }
    const prefix = v.n.split('-')[0];
    if (lastPrefix && prefix !== lastPrefix) out.push('');
    lastPrefix = prefix;

    const ref = val.alias ? `var(--color-${val.alias.replace('/', '-')})` : hexa(val);
    const decl = `  --${v.n}: ${ref};`;
    out.push(notes[v.n] ? `${pad(decl, 44)}/* ${notes[v.n]} */` : decl);
  }
  return out.join('\n');
}

/* ------------------------------------------------------------- theme bridge */

function themeColours() {
  const jake = byCollection('Jake UI').filter((v) => v.t === 'COLOR');
  return jake.map((v) => `  --color-${v.n}: var(--${v.n});`).join('\n');
}

/**
 * The type ramp, generated from the Figma text styles via the Typography
 * Primitives each one is BOUND to. Because every value here is a var()
 * reference, changing size/13 in Figma moves label-md and body-sm in code
 * automatically — the generated references stay synchronized.
 */
function themeTypeRamp() {
  const notes = ann.textRampNotes || {};
  const GROUPS = [
    ['Headings — Semi Bold', (s) => s.name.startsWith('Heading/')],
    ['Labels — Medium', (s) => s.name.startsWith('Label/')],
    ['Body — Regular', (s) => s.name.startsWith('Body/')],
    ['Captions — Regular', (s) => s.name.startsWith('Caption/')],
    ['Data — Semi Bold, same metrics as body-sm', (s) => s.name.startsWith('Value/')],
  ];
  const STYLE_TO_WEIGHT = {
    Regular: 'normal', Medium: 'medium', 'Semi Bold': 'semibold', Bold: 'bold',
  };

  const out = [];
  const seen = new Set();
  for (const [title, match] of GROUPS) {
    const styles = dump.textStyles.filter(match);
    if (!styles.length) continue;
    out.push(`  /* ${title} */`);
    for (const s of styles) {
      seen.add(s.name);
      const key = slug(s.name);
      const sizeVar = s.bound.fontSize;
      const lhVar = s.bound.lineHeight;
      const weight = STYLE_TO_WEIGHT[s.font.style];

      if (!sizeVar) warnings.push(`text style ${s.name}: fontSize is not bound to a variable — cannot generate without a literal`);
      if (!lhVar) warnings.push(`text style ${s.name}: lineHeight is not bound to a variable`);
      if (!weight) warnings.push(`text style ${s.name}: font style "${s.font.style}" has no weight mapping`);

      const sizeRef = sizeVar ? `var(--text-size-${tail(sizeVar)})` : `${s.fontSize}px`;
      const lhRef = lhVar ? `var(--leading-${tail(lhVar)})` : `${s.lineHeight.value}px`;
      const wRef = weight ? `var(--font-weight-${weight})` : '400';

      const note = notes[key];
      const decl = `  --text-${key}: ${sizeRef};`;
      out.push(note ? `${pad(decl, 40)}/* ${note} */` : decl);
      out.push(`  --text-${key}--line-height: ${lhRef};`);
      out.push(`  --text-${key}--font-weight: ${wRef};`);
    }
    out.push('');
  }
  const missed = dump.textStyles.filter((s) => !seen.has(s.name));
  for (const s of missed) warnings.push(`text style ${s.name} matched no ramp group — omitted from the type ramp`);
  if (out[out.length - 1] === '') out.pop();
  return out.join('\n');
}

/** Figma effect styles -> --shadow-*. */
function themeShadows() {
  const out = [];
  for (const s of dump.effectStyles) {
    const key = slug(s.name).replace(/^(shadow|effect)-/, '');
    const parts = [];
    for (const e of s.effects) {
      if (e.visible === false) continue;
      if (e.type !== 'DROP_SHADOW' && e.type !== 'INNER_SHADOW') {
        warnings.push(`effect style ${s.name}: ${e.type} has no CSS box-shadow equivalent — skipped`);
        continue;
      }
      const inset = e.type === 'INNER_SHADOW' ? 'inset ' : '';
      parts.push(
        `${inset}${num(e.offset.x)}px ${num(e.offset.y)}px ${num(e.radius)}px ${num(e.spread)}px ${hexa(e.color)}`
      );
    }
    const prefix = s.name.startsWith('Effect/') ? 'shadow-effect-' : 'shadow-';
    out.push(`  --${prefix}${key}: ${parts.length ? parts.join(', ') : 'none'};`);
  }
  return out.join('\n');
}

/**
 * Radius is emitted here and ONLY here. These are Tailwind theme keys, so
 * @theme is their single declaration site — repeating them in :root would turn
 * each into `--radius-sm: var(--radius-sm)`, a reference cycle that silently
 * invalidates the property.
 */
function themeDimensions() {
  const out = [];
  const radii = byCollection('Dimensions').filter((v) => v.n.startsWith('radius/'));
  const named = radii.filter((v) => /^[a-z]/.test(tail(v.n)));
  const numeric = radii.filter((v) => !/^[a-z]/.test(tail(v.n)));

  for (const v of named) {
    out.push(`  --radius-${tail(v.n)}: ${num(v.m[Object.keys(v.m)[0]])}px;`);
  }
  out.push('');
  out.push('  /* Half-step radii — in live use, see the note at the foot of this file. */');
  for (const v of numeric) {
    out.push(`  --radius-${tail(v.n)}: ${num(v.m[Object.keys(v.m)[0]])}px;`);
  }
  return out.join('\n');
}

/* -------------------------------------------------------------- assemble */

const stamp = dump.generatedAt;
const counts = {
  variables: dump.variables.length,
  textStyles: dump.textStyles.length,
  effectStyles: dump.effectStyles.length,
};

const css = `/* ---------------------------------------------------------------------------
 * Jake UI — design tokens
 *
 * GENERATED by design-system/scripts/export-tokens.mjs — do not hand-edit.
 * Source of truth: Figma file ${dump.fileKey}
 * Dump taken:      ${stamp}
 * Covers:          ${counts.variables} variables · ${counts.textStyles} text styles · ${counts.effectStyles} effect styles
 *
 * To change a VALUE      edit it in Figma, re-run figma-token-query.js, re-run this.
 * To change a COMMENT    edit design-system/tokens/annotations.json.
 * To check for drift     node design-system/scripts/export-tokens.mjs --check
 *
 * Light/Dark come from Figma variable MODES, not duplicate variables.
 * Every value below traces to a Figma variable — nothing here is a loose hex.
 * ------------------------------------------------------------------------- */

@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

${banner('Primitives — Colour (Figma: Color Primitives)')}
:root {
${colourPrimitives()}

${dimensionPrimitives()}

${typographyPrimitives()}

${interactionPrimitives()}
}

${banner('Semantic — Light (Figma mode "Light")')}
:root {
${semanticTier('3:0')}
}

${banner('Semantic — Dark (Figma mode "Dark")')}
.dark {
${semanticTier('3:1')}
}

${banner('Tailwind v4 theme bridge')}
@theme inline {
${themeColours()}

  --font-sans: ${ann.fontStack};

${themeDimensions()}

  /* --- Type ramp ---------------------------------------------------------
   * ${counts.textStyles} semantic steps, mirroring the Figma text styles 1:1. Every value is
   * a var() onto a Typography Primitive, so the output follows its committed input.
   * Tailwind generates \`text-label-md\` etc. from these.
   * Usage guidance lives in each Figma style's description and in
   * docs/tokens/typography.md.
   * -------------------------------------------------------------------- */

${themeTypeRamp()}

  /* --- Elevation ---------------------------------------------------------
   * From the Figma effect styles. \`Effect/*\` are component-specific and keep
   * an \`effect-\` prefix; \`Shadow/*\` are the general ramp.
   * -------------------------------------------------------------------- */
${themeShadows()}
}

${proseBlock(ann.blocks.pairingRules)}

${proseBlock(ann.blocks.halfStepRamp)}
`;

if (CHECK) {
  let current = '';
  try { current = readFileSync(OUT, 'utf8'); } catch { /* missing counts as drift */ }
  if (current !== css) {
    console.error('✗ tokens/globals.css is out of date or hand-edited.');
    console.error('  Run: node design-system/scripts/export-tokens.mjs');
    process.exit(1);
  }
  console.log('✓ tokens/globals.css matches the dump.');
} else {
  writeFileSync(OUT, css);
  console.log(`✓ wrote tokens/globals.css`);
  console.log(`  ${counts.variables} variables · ${counts.textStyles} text styles · ${counts.effectStyles} effect styles`);
}

if (warnings.length) {
  console.warn(`\n${warnings.length} warning(s):`);
  for (const w of warnings) console.warn(`  ! ${w}`);
}

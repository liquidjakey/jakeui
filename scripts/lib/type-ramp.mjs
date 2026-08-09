/**
 * The 14-step type ramp, read from the GENERATED tokens/globals.css.
 *
 * WHY IT IS PARSED RATHER THAN HARDCODED
 * tokens/globals.css is generated from the Figma text styles. If the ramp is
 * hardcoded here, this file becomes a fourth thing that can drift from Figma —
 * which is the exact class of defect the computed-output gate exists to catch.
 * Parsing means a step added in Figma is covered by the gate the moment it is
 * exported, with no edit here.
 *
 * The ramp is declared as a three-line group per step, one level of `var()`
 * indirection away from the raw value:
 *
 *   --text-label-lg:               var(--text-size-14);
 *   --text-label-lg--line-height:  var(--leading-20);
 *   --text-label-lg--font-weight:  var(--font-weight-medium);
 *
 * so the primitives (`--text-size-*`, `--leading-*`, `--font-weight-*`) are
 * resolved first and the ramp is then flattened against them.
 */

import { readFileSync } from 'node:fs';

/** Strip /* … *\/ comments so a commented-out declaration is never parsed. */
function decomment(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

/**
 * Collect every `--name: value;` in the file.
 *
 * Later declarations overwrite earlier ones, which matches the cascade for the
 * `:root` block this reads. The `.dark` block redeclares COLOURS only — it
 * never touches a size, a leading or a weight — so a flat map is correct for
 * the ramp and would not be for colour.
 */
function readCustomProperties(css) {
  const props = new Map();
  const re = /(--[A-Za-z0-9_-]+)\s*:\s*([^;}]+)[;}]/g;
  let m;
  while ((m = re.exec(css)) !== null) props.set(m[1], m[2].trim());
  return props;
}

/** Resolve `var(--a)` chains down to a literal. Cycles resolve to null. */
function resolve(props, value, seen = new Set()) {
  let v = value;
  for (let hop = 0; hop < 10; hop += 1) {
    const m = /^var\(\s*(--[A-Za-z0-9_-]+)\s*\)$/.exec(v.trim());
    if (!m) return v.trim();
    if (seen.has(m[1])) return null;
    seen.add(m[1]);
    const next = props.get(m[1]);
    if (next === undefined) return null;
    v = next;
  }
  return null;
}

const px = (v) => (v && /^-?[\d.]+px$/.test(v) ? Number.parseFloat(v) : null);
const num = (v) => (v && /^-?[\d.]+$/.test(v) ? Number.parseFloat(v) : null);

/**
 * @returns {{steps: Array<{name:string,fontSize:number,lineHeight:number,fontWeight:number}>, fontFamily: string|null}}
 */
export function readTypeRamp(globalsCssPath) {
  const css = decomment(readFileSync(globalsCssPath, 'utf8'));
  const props = readCustomProperties(css);

  const steps = [];
  for (const [name, raw] of props) {
    // The step head is `--text-<name>` with no `--` modifier suffix, and it must
    // resolve to a length. `--text-size-14` is a PRIMITIVE, not a ramp step, so
    // the `size-` prefix is excluded.
    if (!name.startsWith('--text-')) continue;
    if (name.includes('--line-height') || name.includes('--font-weight')) continue;
    const step = name.slice('--text-'.length);
    if (step.startsWith('size-')) continue;

    const fontSize = px(resolve(props, raw));
    const lineHeight = px(resolve(props, props.get(`${name}--line-height`) ?? ''));
    const fontWeight = num(resolve(props, props.get(`${name}--font-weight`) ?? ''));
    if (fontSize === null || lineHeight === null || fontWeight === null) continue;

    steps.push({ name: step, fontSize, lineHeight, fontWeight });
  }

  steps.sort((a, b) => a.name.localeCompare(b.name));

  const fontFamily = resolve(props, props.get('--font-sans') ?? '');
  return { steps, fontFamily };
}

/** The family name a correctly loaded stack resolves to first, e.g. `Inter`. */
export function primaryFamily(fontFamily) {
  if (!fontFamily) return null;
  return fontFamily.split(',')[0].trim().replace(/^["']|["']$/g, '');
}

/** `label-lg` -> `14/20/500`, for compact reporting. */
export function fmtStep(s) {
  return `${s.fontSize}/${s.lineHeight}/${s.fontWeight}`;
}

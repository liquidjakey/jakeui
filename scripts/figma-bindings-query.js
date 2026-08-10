/**
 * Jake UI — doc-record ingest, step 1 of 2: dump the LIVE BINDINGS.
 *
 * WHY THIS REPLACED THE DESCRIPTION DUMP
 * `adopt-docs.mjs` used to read `.figma-docs-dump.json` — the hand-written Figma
 * DESCRIPTION on each component. That source was proven wrong seven separate
 * times in two days, every time in a way that produced a real visual bug:
 *
 *   Badge / Success       said info-foreground     binds success-foreground
 *   Badge / Destructive   said destructive-fg      binds card
 *   Card / Title          said info-foreground, size/11   binds foreground, 16px
 *   Label                 said Body/MD             binds Label/LG
 *   Dialog / Title        said "size/18 and size/13"      binds Heading/LG on both
 *   Tabs / Density        said "no spacing recorded"      binds space/1 · space/0-75
 *   Alert / Destructive   said "no surface fill"          carried a solid #fdeae9
 *
 * and it reported 16 unbound text nodes where a direct read found 469. The
 * descriptions are prose maintained by hand; they drift the moment a designer
 * rebinds something without retyping the paragraph, and nothing can detect it.
 *
 * The bindings cannot drift from themselves. This reads them.
 *
 * WHAT IT READS, AND WHY THE LIST IS LONGER THAN YOU EXPECT
 * fills, strokes and gap are the obvious axes and they are not sufficient. The
 * 9 Aug audit read only those, and consequently missed the OPACITY axis
 * entirely — which is where Switch / Root and Radio Group / Item keep their
 * whole disabled and read-only treatment. A finding was filed claiming disabled
 * was indistinguishable from default; it was withdrawn on 10 Aug when the
 * opacity binding was finally read. So this reads:
 *
 *   fill · stroke (+ weight) · corner radii (all four, collapsed when uniform)
 *   padding (all four sides, collapsed when uniform) · gap · opacity
 *   text fill · text style · effect style
 *
 * HOW TO REGENERATE
 *   1. Open Figma Desktop on ovnLtL9xbX8SG5xDw673Un with the Desktop Bridge plugin.
 *   2. Execute the body of this file through the bridge.
 *   3. Save the returned JSON to design-system/.figma-bindings-dump.json
 *   4. node design-system/scripts/adopt-docs.mjs
 */

await figma.loadAllPagesAsync();

const varName = new Map();
for (const v of await figma.variables.getLocalVariablesAsync()) varName.set(v.id, v.name);

const styleName = new Map();
for (const s of await figma.getLocalTextStylesAsync()) styleName.set(s.id, s.name);
for (const s of await figma.getLocalEffectStylesAsync()) styleName.set(s.id, s.name);

/** Resolve a bound variable alias to its Figma name, e.g. `success-foreground`. */
const boundName = (holder, key) => {
  const b = holder && holder.boundVariables && holder.boundVariables[key];
  const entry = Array.isArray(b) ? b[0] : b;
  return entry && varName.get(entry.id) ? varName.get(entry.id) : null;
};

/** A paint's colour variable, which lives on the PAINT and not on the node. */
const paintVar = (paints) => {
  if (!Array.isArray(paints) || !paints.length) return null;
  const p = paints[0];
  if (p.visible === false) return null;
  const b = p.boundVariables && p.boundVariables.color;
  return b && varName.get(b.id) ? varName.get(b.id) : null;
};

/** Raw hex, so an UNTOKENISED value is reported rather than silently dropped. */
const paintHex = (paints) => {
  if (!Array.isArray(paints) || !paints.length) return null;
  const p = paints[0];
  if (p.visible === false || p.type !== 'SOLID' || !p.color) return null;
  const h = (c) => Math.round(c * 255).toString(16).padStart(2, '0');
  return '#' + h(p.color.r) + h(p.color.g) + h(p.color.b);
};

/**
 * Collapse four corners / four sides to the shortest honest form.
 *
 *   all four equal        -> `space/4`
 *   symmetric (t=b, l=r)  -> `y space/2 x space/4`
 *   otherwise             -> `t a r b b c l d`
 *
 * Order is [top, right, bottom, left] — CSS order, so it reads the way a
 * developer expects rather than the way the Figma API happens to return it.
 */
function collapse(parts, labels) {
  const [t, r, b, l] = parts;
  if (parts.every((p) => p === null)) return null;
  if (parts.every((p) => p === t)) return t;
  if (labels[0] === 't' && t === b && r === l && t !== null && r !== null) return `y ${t} x ${r}`;
  return parts.map((p, i) => `${labels[i]} ${p ?? '—'}`).join(' ');
}

function readNode(n) {
  const bits = [];
  const isText = n.type === 'TEXT';

  // A TEXT node's fill IS its text colour; emitting both `fill x` and `text x`
  // would double every text token in the inventory.
  if (!isText) {
    const fill = paintVar(n.fills);
    if (fill) bits.push(`fill ${fill}`);
    else {
      const hex = paintHex(n.fills);
      // An untokenised fill is the single most important thing this dump can
      // surface — it is what Alert / Destructive's #fdeae9 was, invisible for months.
      if (hex) bits.push(`fill UNTOKENISED ${hex}`);
    }
  }

  const stroke = paintVar(n.strokes);
  if (stroke) {
    const w = boundName(n, 'strokeTopWeight') || boundName(n, 'strokeWeight');
    bits.push(w ? `border ${w} ${stroke}` : `border ${stroke}`);
  }

  const radius = collapse(
    [boundName(n, 'topLeftRadius'), boundName(n, 'topRightRadius'),
     boundName(n, 'bottomRightRadius'), boundName(n, 'bottomLeftRadius')],
    ['tl', 'tr', 'br', 'bl'],
  );
  if (radius) bits.push(`radius ${radius}`);

  const padding = collapse(
    [boundName(n, 'paddingTop'), boundName(n, 'paddingRight'),
     boundName(n, 'paddingBottom'), boundName(n, 'paddingLeft')],
    ['t', 'r', 'b', 'l'],
  );
  if (padding) bits.push(`padding ${padding}`);

  const gap = boundName(n, 'itemSpacing');
  if (gap) bits.push(`gap ${gap}`);

  const op = boundName(n, 'opacity');
  if (op) bits.push(`opacity ${op}`);
  else if (typeof n.opacity === 'number' && n.opacity !== 1) bits.push(`opacity UNTOKENISED ${Math.round(n.opacity * 100) / 100}`);

  if (n.effectStyleId && styleName.get(n.effectStyleId)) bits.push(`shadow ${styleName.get(n.effectStyleId)}`);

  if (isText) {
    const tf = paintVar(n.fills);
    if (tf) bits.push(`text ${tf}`);
    else { const hex = paintHex(n.fills); if (hex) bits.push(`text UNTOKENISED ${hex}`); }
    if (n.textStyleId && styleName.get(n.textStyleId)) bits.push(`type ${styleName.get(n.textStyleId)}`);
    else {
      // Unbound text is a defect worth carrying into the record verbatim.
      const lh = n.lineHeight && n.lineHeight.unit === 'PIXELS' ? n.lineHeight.value : 'auto';
      const st = n.fontName && n.fontName.style ? ' ' + n.fontName.style : '';
      bits.push(`type UNBOUND ${n.fontSize}/${lh}${st}`);
    }
  }

  return bits;
}

/** Walk a variant, deduplicating repeated token phrases in document order. */
function readVariant(root) {
  const seen = new Set();
  const bits = [];
  const push = (arr) => { for (const b of arr) if (!seen.has(b)) { seen.add(b); bits.push(b); } };
  push(readNode(root));
  const walk = (n) => {
    for (const c of n.children || []) {
      // An INSTANCE's tokens belong to the component it instantiates, which has
      // its own record. Do not read it AND do not descend into it, or every
      // parent inherits its child's whole inventory — Card would report Badge's
      // tokens as its own.
      if (c.type === 'INSTANCE') continue;
      push(readNode(c));
      walk(c);
    }
  };
  walk(root);
  return bits.join(' · ');
}

const components = [];
const roots = figma.root.findAll(
  (n) => n.type === 'COMPONENT_SET' || (n.type === 'COMPONENT' && n.parent && n.parent.type !== 'COMPONENT_SET'),
);

for (const node of roots) {
  // Variants that resolve to the SAME token set are collapsed to one entry.
  // This is not compression for its own sake — it is the finding. Popover /
  // Content's 48 variants produce 3 binding sets, Dropdown Menu / Content's 24
  // produce 3, and Radio Group / Root's 24 produce 9, because side, align and
  // orientation carry no colour delta at all. Listing 48 identical rows would
  // bury that; collapsing them states it.
  const states = {};
  if (node.type === 'COMPONENT_SET') {
    const byTokens = new Map();
    for (const v of node.children) {
      const tokens = readVariant(v);
      if (!byTokens.has(tokens)) byTokens.set(tokens, []);
      byTokens.get(tokens).push(v.name);
    }
    for (const [tokens, names] of byTokens) {
      const key = names[0];
      states[key] = names.length > 1
        ? `${tokens} · (+${names.length - 1} variant${names.length > 2 ? 's' : ''} share these)`
        : tokens;
    }
  } else {
    states['Default'] = readVariant(node);
  }

  // Variant axes, straight off the set — the names are structural, not prose.
  const axes = {};
  if (node.type === 'COMPONENT_SET') {
    for (const v of node.children) {
      for (const pair of v.name.split(',')) {
        const [k, val] = pair.split('=').map((s) => s && s.trim());
        if (!k || !val) continue;
        (axes[k] = axes[k] || new Set()).add(val);
      }
    }
  }

  components.push({
    name: node.name,
    id: node.id,
    type: node.type,
    axes: Object.fromEntries(Object.entries(axes).map(([k, v]) => [k, [...v]])),
    states,
  });
}

components.sort((a, b) => a.name.localeCompare(b.name));

return { fileKey: figma.fileKey, generatedAt: new Date().toISOString(), components };

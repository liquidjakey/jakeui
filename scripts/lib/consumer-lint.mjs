import ts from 'typescript';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ROOT } from './public-api.mjs';
import { readTypeRamp } from './type-ramp.mjs';

const css = ['tokens/globals.css', 'tokens/runtime.css']
  .map((p) => readFileSync(resolve(ROOT, p), 'utf8'))
  .join('\n');
const theme = [...css.matchAll(/@theme[^{}]*\{([^}]*)\}/g)].map((m) => m[1]).join('\n');
const colors = new Set([...theme.matchAll(/--color-([\w-]+)\s*:/g)].map((m) => m[1]));
const ramp = new Set(readTypeRamp(resolve(ROOT, 'tokens/globals.css')).steps.map((s) => s.name));
const colorsBuiltIn = new Set(['inherit', 'current', 'transparent']);
const spacing = new Set([
  '0',
  '0.5',
  '1',
  '1.5',
  '2',
  '2.5',
  '3',
  '4',
  '5',
  '6',
  '8',
  '12',
  '16',
  'auto',
  'px',
]);

export function classViolation(token) {
  // Split variants only outside brackets: has-[:focus-visible]:... is one variant.
  let depth = 0,
    start = 0;
  for (let i = 0; i < token.length; i++) {
    if (token[i] === '[' || token[i] === '(') depth++;
    if (token[i] === ']' || token[i] === ')') depth--;
    if (token[i] === ':' && depth === 0) start = i + 1;
  }
  const base = token.slice(start).replace(/^!|!$/g, '');
  if (/^(?:\[|[\w-]+-(?:\[|\())/.test(base))
    return 'arbitrary-style: use a supported token/layout utility or request a scoped extension';
  if (/^(font-(?!sans$)|leading-|tracking-)/.test(base))
    return 'typography: use one whole semantic ramp step';
  const text = /^text-(.+)$/.exec(base)?.[1];
  if (
    text &&
    !ramp.has(text) &&
    !colors.has(text.split('/')[0]) &&
    !colorsBuiltIn.has(text) &&
    ![
      'left',
      'right',
      'center',
      'justify',
      'start',
      'end',
      'wrap',
      'nowrap',
      'balance',
      'pretty',
      'ellipsis',
      'clip',
    ].includes(text)
  )
    return 'typography/color: unrecognized text role';
  const color = /^(?:bg|border|ring|outline|fill|stroke|decoration|divide|from|via|to)-(.+)$/
    .exec(base)?.[1]
    ?.split('/')[0];
  if (
    color &&
    /(?:^|-)(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white)-\d+$|^(?:black|white)$/.test(
      color,
    )
  )
    return 'primitive-color: use semantic surface/foreground roles';
  if (
    base.startsWith('bg-') &&
    color &&
    !colors.has(color) &&
    !colorsBuiltIn.has(color) &&
    !/^(?:none|auto|cover|contain|fixed|local|scroll|center|top|bottom|left|right|(?:clip|origin)-(?:border|padding|content|text)|(?:no-)?repeat(?:-[xy]|-round|-space)?)$/.test(
      color,
    )
  )
    return 'surface-color: use a recognized semantic background role';
  const space = /^-?(?:[pm][xytrblse]?|gap(?:-[xy])?|space-[xy])-(.+)$/.exec(base)?.[1];
  if (space && !spacing.has(space)) return 'spacing: use the approved composition spacing scale';
  return null;
}

/** Static consumer guard, not a full CSS evaluator or security boundary. */
export function lintSource(text, file = 'consumer.tsx') {
  const issues = [];
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const add = (node, rule) =>
    issues.push({
      file,
      line: source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1,
      rule,
    });
  function visit(node) {
    if (ts.isStringLiteralLike(node)) {
      for (const token of node.text.split(/\s+/)) {
        const rule = classViolation(token);
        if (rule) add(node, `${rule} (${token})`);
      }
    }
    if (ts.isImportDeclaration(node)) {
      const spec = node.moduleSpecifier.text;
      if (
        /^jakeui\//.test(spec) &&
        ![
          'jakeui/tokens.css',
          'jakeui/fonts.css',
          'jakeui/utils',
          'jakeui/icons',
          'jakeui/manifest',
          'jakeui/map',
        ].includes(spec)
      )
        add(node, 'public-import: use documented Jake UI entry points');
      if (
        /tailwind-merge|lucide|@radix-ui|@shadcn/.test(spec) ||
        /(?:^|\/)components\/ui\//.test(spec)
      )
        add(node, 'foreign-primitive: use Jake UI components, cn and Phosphor icons');
    }
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName.getText(source);
      if (['button', 'input', 'select', 'textarea', 'dialog'].includes(tag))
        add(node, `native-control: compose the Jake UI equivalent of ${tag}`);
      for (const attribute of node.attributes.properties) {
        if (!ts.isJsxAttribute(attribute)) continue;
        const name = attribute.name.getText(source);
        if (
          name === 'style' &&
          attribute.initializer &&
          ts.isJsxExpression(attribute.initializer) &&
          (tag === tag.toLowerCase() ||
            (attribute.initializer.expression &&
              ts.isObjectLiteralExpression(attribute.initializer.expression)))
        )
          add(
            attribute,
            'inline-style: keep visual choices in supported classes/props; request a scoped extension if necessary',
          );
        if (
          name === 'className' &&
          attribute.initializer &&
          ts.isJsxExpression(attribute.initializer) &&
          attribute.initializer.expression &&
          ts.isTemplateExpression(attribute.initializer.expression)
        )
          add(attribute, 'dynamic-class: use complete literal class names');
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  return issues;
}

export function lintCss(text, file) {
  const clean = text.replace(/\/\*[\s\S]*?\*\//g, (value) => value.replace(/[^\n]/g, ' '));
  const issues = [];
  clean.split('\n').forEach((line, index) => {
    if (/(?:#[\da-f]{3,8}\b|\b(?:rgb|hsl|oklch|lab)a?\s*\()/i.test(line))
      issues.push({ file, line: index + 1, rule: 'literal-color: use semantic custom properties' });
    if (
      [
        ...line.matchAll(/(?:font-size|font-weight|line-height|letter-spacing)\s*:\s*([^;}]+)/g),
      ].some((match) => !match[1].trim().startsWith('var('))
    )
      issues.push({ file, line: index + 1, rule: 'typography: use the semantic ramp' });
    if (
      [
        ...line.matchAll(
          /(?:^|[;{\s])(?:color|background(?:-color)?|border-color|fill|stroke)\s*:\s*([^;}]+)/g,
        ),
      ].some(
        (match) =>
          !/^(?:var\(|currentColor\b|transparent\b|inherit\b|none\b)/.test(match[1].trim()),
      )
    )
      issues.push({ file, line: index + 1, rule: 'color-role: use semantic custom properties' });
    if (/@theme\b|--(?:color|text|font|leading)-[\w-]+\s*:/.test(line))
      issues.push({
        file,
        line: index + 1,
        rule: 'token-override: new roles require a library extension',
      });
  });
  return issues;
}

import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import ts from 'typescript';
import { readPublicApi, ROOT } from './lib/public-api.mjs';

const read = (path) => JSON.parse(readFileSync(resolve(ROOT, path), 'utf8'));
const manifest = read('agent/manifest.json');
assert.deepEqual(
  readdirSync(resolve(ROOT, 'docs/agent/components'))
    .filter((file) => file.endsWith('.md'))
    .sort(),
  manifest.components.map((c) => c.reference.split('/').at(-1)).sort(),
  'Orphan generated references must be explicitly retired after removing an interface',
);
const api = readPublicApi();
const barrel = api.program.getSourceFile(resolve(ROOT, 'components/index.ts'));
const values = api.checker
  .getExportsOfModule(api.checker.getSymbolAtLocation(barrel))
  .filter((symbol) => api.checker.getAliasedSymbol(symbol).flags & ts.SymbolFlags.Value)
  .map((symbol) => symbol.name)
  .sort();
assert.deepEqual(
  manifest.components.map((c) => c.export).sort(),
  values,
  'Every public runtime export must be catalogued exactly once',
);
for (const component of manifest.components) {
  for (const path of [
    component.source,
    component.reference,
    ...component.stories,
  ])
    assert.ok(existsSync(resolve(ROOT, path)), `Missing ${path}`);
  assert.ok(component.whenToUse.length, `${component.export}: missing selection guidance`);
  assert.ok(
    component.stories.length,
    `${component.export}: missing directly rendered story example`,
  );
  assert.ok(
    !JSON.stringify(component).includes(ROOT.replace(/\/$/, '')),
    'Machine-specific paths must not leak into the catalog',
  );
}
const exceptions = read('agent/exceptions.json').entries;
for (const [name, transforms] of Object.entries(read('agent/figma-transforms.json'))) {
  assert.ok(api.components.has(name), `Unknown transform component ${name}`);
  for (const key of Object.keys(transforms))
    assert.ok(
      Object.values(api.map.components[name].props).some((p) => p.designCode === key),
      `Stale reviewed transform ${name}.${key}`,
    );
}
assert.equal(
  new Set(exceptions.map((e) => e.id)).size,
  exceptions.length,
  'Duplicate exception IDs',
);
for (const exception of exceptions) {
  for (const field of ['id', 'decision', 'status', 'retirement'])
    assert.ok(exception[field], `Missing exception ${field}`);
  assert.ok(exception.scope.length, `Unscoped exception ${exception.id}`);
  for (const path of exception.scope)
    assert.ok(existsSync(resolve(ROOT, path)), `Missing exception scope ${path}`);
}
const documents = ['AGENTS.md', 'CLAUDE.md', 'README.md', 'docs/README.md'];
function collect(dir) {
  for (const entry of readdirSync(resolve(ROOT, dir), { withFileTypes: true })) {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory()) collect(path);
    else if (path.endsWith('.md')) documents.push(path);
  }
}
collect('docs');
for (const path of documents) {
  const text = readFileSync(resolve(ROOT, path), 'utf8');
  for (const [, target] of text.matchAll(/\]\(([^)]+)\)/g)) {
    if (/^(?:https?:|#)/.test(target)) continue;
    assert.ok(
      existsSync(resolve(ROOT, dirname(path), target.split('#')[0])),
      `${path}: broken link ${target}`,
    );
  }
}
console.log(
  `Agent routing: ${values.length} exports, ${documents.length} documents, ${exceptions.length} scoped exceptions verified.`,
);

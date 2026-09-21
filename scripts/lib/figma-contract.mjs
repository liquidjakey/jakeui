import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ROOT, slug } from './public-api.mjs';

/** Reviewed design transformations stay separate from compiler-derived types. */
export function reconcileMap(map, api, root = ROOT) {
  const transforms = JSON.parse(readFileSync(resolve(root, 'agent/figma-transforms.json'), 'utf8'));
  const next = structuredClone(map);
  next.schemaVersion = 2;
  next.$schema = './figma.map.schema.json';
  next.note =
    'Figma correspondence only. Public interfaces are compiler-derived in agent/manifest.json. Transform entries are not props.';
  for (const [name, component] of Object.entries(next.components)) {
    const runtime = api.get(name);
    for (const [key, binding] of Object.entries(component.props)) {
      if (!runtime) continue;
      const originalCode = binding.designCode ?? binding.code;
      if (binding.kind === 'transform' || (originalCode && transforms[name]?.[originalCode])) {
        const targets = transforms[name]?.[originalCode];
        if (!targets) throw new Error(`${name}.${key}: missing reviewed transform`);
        for (const target of targets)
          if (!runtime.props.some((p) => p.name === target))
            throw new Error(`${name}.${key}: invalid transform target ${target}`);
        component.props[key] = {
          kind: 'transform',
          figma: binding.figma,
          designCode: originalCode,
          targets,
          reason: targets.length
            ? 'Figma presentation is represented by composition or runtime state; consult the current component reference and target props.'
            : 'State is internal to the component; there is no public setter.',
          reference: `docs/agent/components/${slug(name)}.md`,
        };
      } else if (binding.kind === 'decompose') {
        const anatomy = ['Switch / Root', 'Radio Group / Item', 'Radio Group / Root'].includes(
          name,
        );
        binding.targets = anatomy
          ? ['state']
          : [
              ...new Set(
                [...(binding.booleans ?? []), ...(binding.controlled ?? [])].filter((target) =>
                  runtime.props.some((p) => p.name === target),
                ),
              ),
            ];
        binding.note = anatomy
          ? 'Visual anatomy only: state previews appearance, not a standalone interactive control. Use Switch or RadioGroup in application code.'
          : 'Design-state classification. Only targets are public props; other states are internal/browser-owned or opposite values of a controlled prop.';
      } else if (['prop', 'slot', 'slot-toggle'].includes(binding.kind)) {
        const prop = runtime.props.find((p) => p.name === binding.code);
        if (!prop)
          throw new Error(
            `${name}.${key}: ${binding.code} is not a public prop; add a reviewed transform`,
          );
        binding.type = prop.type;
        binding.required = prop.required;
      }
    }
  }
  return next;
}

/** Validate the discriminated binding shape before comparing generated content. */
export function validateMapShape(map) {
  if (map.schemaVersion !== 2 || !map.components)
    throw new Error('Expected correspondence schema version 2');
  const kinds = new Set([
    'prop',
    'slot',
    'slot-toggle',
    'transform',
    'decompose',
    'responsive-fixture',
    'story-only',
  ]);
  for (const [name, component] of Object.entries(map.components)) {
    if (typeof component.figmaNodeId !== 'string' || !component.props)
      throw new Error(`${name}: incomplete correspondence`);
    if (
      ![null, 'string'].includes(component.codePath === null ? null : typeof component.codePath) ||
      Boolean(component.codePath) !== Boolean(component.codeExport)
    )
      throw new Error(`${name}: code binding must be complete or explicitly null`);
    for (const [key, binding] of Object.entries(component.props)) {
      if (!kinds.has(binding.kind))
        throw new Error(`${name}.${key}: unknown/unclassified binding kind`);
      if (
        ['prop', 'slot', 'slot-toggle'].includes(binding.kind) &&
        (typeof binding.code !== 'string' || typeof binding.type !== 'string')
      )
        throw new Error(`${name}.${key}: incomplete direct prop binding`);
      if (
        binding.kind === 'transform' &&
        (!Array.isArray(binding.targets) ||
          !binding.targets.every((t) => typeof t === 'string') ||
          !binding.reason ||
          !binding.reference ||
          !binding.designCode ||
          'code' in binding ||
          'type' in binding)
      )
        throw new Error(
          `${name}.${key}: transform must name targets and reason, not pretend to be a prop`,
        );
      if (binding.kind === 'decompose' && 'type' in binding)
        throw new Error(`${name}.${key}: design state is not a public enum`);
    }
  }
}

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ROOT } from './lib/public-api.mjs';

const [command = 'help', ...words] = process.argv.slice(2);
if (command === 'help') {
  console.log(
    'Jake UI agent interface\n  npm run agent -- search <purpose/name>\n  npm run agent -- inspect <exact component name or export>\n  npm run agent -- list\n  npm run agent:check\n  npm run agent:sync (after approved source/usage changes)',
  );
} else {
  const manifest = JSON.parse(readFileSync(resolve(ROOT, 'agent/manifest.json'), 'utf8'));
  const query = words.join(' ').toLowerCase();
  if (command === 'inspect') {
    const match = manifest.components.find((c) =>
      [c.name, c.export].some((n) => n.toLowerCase() === query),
    );
    if (!match) {
      console.error(
        'No public export matches. Use search; do not infer an import from a design-only asset.',
      );
      process.exitCode = 1;
    } else console.log(JSON.stringify(match, null, 2));
  } else if (command === 'search' || command === 'list') {
    const rows = manifest.components.filter(
      (c) =>
        command === 'list' ||
        [c.name, c.export, c.summary, ...c.whenToUse].join(' ').toLowerCase().includes(query),
    );
    console.log(
      rows.map((c) => `${c.export}\t${c.kind}\t${c.reference}\n  ${c.summary}`).join('\n'),
    );
    if (!rows.length) {
      console.error(
        'No match. Check docs/agent/components.md for design-only assets and docs/agent/workflow.md for extension policy.',
      );
      process.exitCode = 1;
    }
  } else {
    console.error(`Unknown command: ${command}`);
    process.exitCode = 1;
  }
}

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { lintSource, lintCss } from './lib/consumer-lint.mjs';

const index = process.argv.indexOf('--path');
if (index < 0 || !process.argv[index + 1]) {
  console.error('Usage: npm run agent:lint -- --path <consumer-source-directory-or-file>');
  process.exit(1);
}
const files = [];
function walk(path) {
  if (statSync(path).isDirectory()) {
    for (const entry of readdirSync(path, { withFileTypes: true })) {
      if (
        entry.isSymbolicLink() ||
        ['node_modules', '.git', 'dist', 'storybook-static'].includes(entry.name)
      )
        continue;
      walk(resolve(path, entry.name));
    }
  } else if (/\.(tsx?|jsx?|css)$/.test(path)) files.push(path);
}
walk(resolve(process.argv[index + 1]));
if (!files.length) throw new Error('No consumer source files found. Refusing a vacuous pass.');
const issues = files.flatMap((path) =>
  (extname(path) === '.css' ? lintCss : lintSource)(readFileSync(path, 'utf8'), path),
);
for (const issue of issues) console.error(`${issue.file}:${issue.line} ${issue.rule}`);
console.log(
  `Consumer static guard: ${files.length} files, ${issues.length} violations. Build/typecheck and rendered verification remain required.`,
);
if (issues.length) process.exitCode = 1;

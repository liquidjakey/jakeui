/**
 * Storybook hardcodes "<name> - Storybook" into the built manager page, and
 * exposes no config for it. Scrapers read og:title, but the browser tab and
 * search engines read <title>, so patch the built file to agree with them.
 */
import { readFile, writeFile } from 'node:fs/promises';

const FILE = 'storybook-static/index.html';
const TITLE = 'Jake UI — React design system';

const html = await readFile(FILE, 'utf8');
const patched = html.replace(/<title>[^<]*<\/title>/, `<title>${TITLE}</title>`);

if (patched === html) {
  console.error(`og-title: no <title> found in ${FILE}; Storybook's template changed.`);
  process.exit(1);
}

await writeFile(FILE, patched);
console.log(`og-title: ${FILE} title set to "${TITLE}"`);

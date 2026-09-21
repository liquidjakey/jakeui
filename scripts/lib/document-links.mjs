import { posix } from 'node:path';

/** Check local inline Markdown links against the actual available file set. */
export function missingDocumentLinks(path, content, available) {
  const missing = [];
  for (const [, target] of content.matchAll(/\]\(([^)]+)\)/g)) {
    if (/^(?:[a-z][a-z0-9+.-]*:|#)/i.test(target)) continue;
    const local = decodeURIComponent(target.split('#')[0]);
    const resolved = posix.normalize(posix.join(posix.dirname(path), local));
    if (!available.has(resolved) && ![...available].some((p) => p.startsWith(resolved + '/')))
      missing.push({ from: path, target, resolved });
  }
  return missing;
}

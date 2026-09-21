/**
 * Verify rendered typography, not just source class names.
 *
 * Every directly owned text node must compute to a generated semantic ramp
 * step, even if class merging removed its expected typography class. A surviving
 * ramp class must also agree with its computed metrics. Load Inter at all
 * declared weights; document.fonts.ready alone cannot detect an absent face.
 *
 * Native option/optgroup and sr-only text are structurally excluded. Classless
 * inherited text is reported separately. Exact-class/exact-metric exceptions
 * require their expected match counts; stale permissions fail the gate.
 *
 * node scripts/computed-type-check.mjs                 # build, then verify
 * node scripts/computed-type-check.mjs --explore       # inspect, not a gate
 * node scripts/computed-type-check.mjs --static <dir>  # reuse a build
 */

import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, mkdtempSync } from 'node:fs';
import { join, extname, resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { chromium } from 'playwright-core';
import { readTypeRamp, primaryFamily, fmtStep } from './lib/type-ramp.mjs';

const ROOT = resolvePath(fileURLToPath(new URL('..', import.meta.url)));
const argv = process.argv.slice(2);
const EXPLORE = argv.includes('--explore');
const STATIC_ARG = (() => {
  const i = argv.indexOf('--static');
  return i === -1 ? null : argv[i + 1];
})();

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.map': 'application/json',
};

export function serve(dir) {
  const server = createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let file = join(dir, urlPath === '/' ? 'index.html' : urlPath);
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
    if (!file.startsWith(dir) || !existsSync(file)) {
      res.writeHead(404);
      res.end('not found');
      return;
    }
    res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
    res.end(readFileSync(file));
  });
  return new Promise((ok) => {
    server.listen(0, '127.0.0.1', () => ok({ server, port: server.address().port }));
  });
}

export function buildStorybook() {
  const out = mkdtempSync(join(tmpdir(), 'jakeui-sb-'));
  process.stderr.write('Building Storybook for the computed-output gate…\n');
  execFileSync('npx', ['storybook', 'build', '-o', out], {
    cwd: ROOT,
    stdio: ['ignore', 'ignore', 'pipe'],
  });
  return out;
}

/**
 * Runs INSIDE the page. One record per element that directly owns text, tagged
 * with the structural exclusions so the reporting side can distinguish "skipped
 * because the platform draws it" from "skipped because it has no intent".
 */
const COLLECT = `(() => {
  const root = document.querySelector('#storybook-root') || document.body;
  const out = [];
  const walk = (el, inSrOnly) => {
    const cls = el.getAttribute('class') || '';
    const srOnly = inSrOnly || /(^|\\s)sr-only(\\s|$)/.test(cls);
    let ownText = '';
    for (const n of el.childNodes) if (n.nodeType === Node.TEXT_NODE) ownText += n.nodeValue;
    if (ownText.trim().length > 0) {
      const cs = getComputedStyle(el);
      const tag = el.tagName.toLowerCase();
      // Nearest ancestor-or-self that carries classes — so a classless glyph can be
      // reported against the element actually responsible for its metrics.
      let owner = el, hops = 0;
      while (owner && !(owner.getAttribute('class') || '').trim() && hops < 6) { owner = owner.parentElement; hops += 1; }
      out.push({
        tag, cls, srOnly,
        platformDrawn: tag === 'option' || tag === 'optgroup',
        text: ownText.trim().slice(0, 40),
        fontSize: parseFloat(cs.fontSize),
        lineHeight: cs.lineHeight,
        fontWeight: parseInt(cs.fontWeight, 10),
        fontFamily: cs.fontFamily,
        ownerTag: owner ? owner.tagName.toLowerCase() : null,
        ownerCls: owner ? (owner.getAttribute('class') || '') : '',
      });
    }
    for (const c of el.children) walk(c, srOnly);
  };
  walk(root, false);
  for (const portal of document.querySelectorAll('[data-floating-ui-portal]')) {
    if (!root.contains(portal) && !portal.parentElement?.closest('[data-floating-ui-portal]')) walk(portal, false);
  }
  return out;
})()`;

const near = (a, b) => Math.abs(a - b) < 0.6;
const tripleOf = (n) => {
  const lh = n.lineHeight === 'normal' ? 'normal' : parseFloat(n.lineHeight);
  return `${n.fontSize}/${lh}/${n.fontWeight}`;
};
const classSet = (cls) => new Set(cls.split(/\s+/).filter(Boolean));

function loadExceptions() {
  const p = join(ROOT, 'scripts/computed-type-exceptions.json');
  if (!existsSync(p)) return [];
  return JSON.parse(readFileSync(p, 'utf8')).documented ?? [];
}

/** An exception applies only if EVERY required class is still on the element. */
function exceptionFor(exceptions, node, triple) {
  const have = classSet(node.cls);
  return exceptions.find((e) => e.triple === triple && e.requireClasses.every((c) => have.has(c)));
}

/** Unused exceptions or changed match counts fail; do not widen stale rules. */
function deadRules(exceptions, hits) {
  return exceptions
    .map((e) => ({ e, n: hits.get(e) ?? 0 }))
    .filter(
      ({ e, n }) => n === 0 || (typeof e.expectedElements === 'number' && n !== e.expectedElements),
    );
}

async function main() {
  const { steps, fontFamily } = readTypeRamp(join(ROOT, 'tokens/globals.css'));
  const wantFamily = primaryFamily(fontFamily);
  if (steps.length === 0) {
    console.error('FAIL — no type ramp could be parsed from tokens/globals.css.');
    process.exit(1);
  }
  const exceptions = loadExceptions();

  const staticDir = STATIC_ARG ? resolvePath(STATIC_ARG) : buildStorybook();
  const index = JSON.parse(readFileSync(join(staticDir, 'index.json'), 'utf8'));
  const stories = Object.values(index.entries).filter((e) => e.type === 'story');

  const { server, port } = await serve(staticDir);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  const rampByTriple = new Map(steps.map((s) => [fmtStep(s), s]));
  const stepByName = new Map(steps.map((s) => [s.name, s]));

  const failures = [];
  const warnings = [];
  const exceptionHits = new Map();
  const seenTriples = new Map();
  const examples = new Map();
  let measured = 0;
  let skipped = 0;
  let excepted = 0;
  let fontChecked = false;

  for (const story of stories) {
    const url = `http://127.0.0.1:${port}/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story&globals=theme:light`;
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForFunction(
      "document.querySelector('#storybook-root') && document.querySelector('#storybook-root').children.length > 0",
      null,
      { timeout: 20000 },
    );
    await page.evaluate('document.fonts.ready');

    // 1. Does the face the token stack names actually LOAD? Checked once — it is a
    //    property of the preview bundle, not of any one story.
    //
    //    `document.fonts.ready` is NOT sufficient on its own: it settles only loads
    //    already pending, and a weight no story happens to use is never requested,
    //    so it would read as missing. Each weight is therefore explicitly loaded
    //    first. `document.fonts.load()` resolves to the FontFace objects that
    //    matched — an empty array means no @font-face rule declares that weight,
    //    which is exactly the defect this guards.
    if (!fontChecked && wantFamily && !EXPLORE) {
      fontChecked = true;
      const loaded = await page.evaluate(`(async () => {
        const weights = [400, 500, 600, 700];
        const faces = await Promise.all(
          weights.map((w) => document.fonts.load(w + ' 14px "${wantFamily}"')),
        );
        return faces.every((f, i) => f.length > 0
          && document.fonts.check(weights[i] + ' 14px "${wantFamily}"'));
      })()`);
      if (!loaded) {
        failures.push({
          story,
          node: { tag: '—', cls: '', text: '' },
          kind: 'font-face',
          detail: `tokens/globals.css names "${wantFamily}" in --font-sans, but the browser reports it is NOT loaded at all four weights. No @font-face is reaching the preview.`,
        });
      }
    }

    for (const n of await page.evaluate(COLLECT)) {
      const triple = tripleOf(n);

      if (n.platformDrawn || n.srOnly) {
        skipped += 1;
        continue;
      }

      measured += 1;
      seenTriples.set(triple, (seenTriples.get(triple) ?? 0) + 1);

      if (EXPLORE) {
        if (!examples.has(triple)) examples.set(triple, []);
        const bucket = examples.get(triple);
        const sig = `${n.tag}|${n.cls}`;
        if (bucket.length < 6 && !bucket.some((b) => b.sig === sig))
          bucket.push({ sig, story, node: n });
        continue;
      }

      const onRamp = steps.find(
        (s) =>
          near(s.fontSize, n.fontSize) &&
          n.lineHeight !== 'normal' &&
          near(s.lineHeight, parseFloat(n.lineHeight)) &&
          s.fontWeight === n.fontWeight,
      );

      // Classless elements express no typographic intent — they inherit. Report an
      // off-ramp inherit as a warning against whichever ancestor does carry classes.
      if (!n.cls.trim()) {
        if (!onRamp) warnings.push({ story, node: n, triple });
        continue;
      }

      const firstFamily = n.fontFamily
        .split(',')[0]
        .trim()
        .replace(/^["']|["']$/g, '');
      if (wantFamily && firstFamily !== wantFamily) {
        failures.push({
          story,
          node: n,
          kind: 'font-family',
          detail: `resolves "${firstFamily}"; tokens/globals.css asks for "${wantFamily}"`,
        });
        continue;
      }

      if (!onRamp) {
        const exc = exceptionFor(exceptions, n, triple);
        if (exc) {
          excepted += 1;
          exceptionHits.set(exc, (exceptionHits.get(exc) ?? 0) + 1);
          continue;
        }
        failures.push({
          story,
          node: n,
          kind: 'off-ramp',
          detail: `computes ${triple}, which is no step in the ramp`,
        });
        continue;
      }

      const declared = [...classSet(n.cls)]
        .filter((c) => c.startsWith('text-'))
        .map((c) => c.slice('text-'.length))
        .find((c) => stepByName.has(c));
      if (declared && declared !== onRamp.name) {
        failures.push({
          story,
          node: n,
          kind: 'class-disagreement',
          detail: `carries text-${declared} (${fmtStep(stepByName.get(declared))}) but computes ${fmtStep(onRamp)}`,
        });
      }
    }
  }

  await browser.close();
  server.close();

  if (EXPLORE) {
    console.log(
      `\nExplored ${stories.length} stories — ${measured} measured, ${skipped} structurally skipped.\n`,
    );
    console.log('Computed triples, by frequency (✓ = a step in the ramp):');
    const sorted = [...seenTriples.entries()].sort((a, b) => b[1] - a[1]);
    for (const [k, count] of sorted) {
      const s = rampByTriple.get(k);
      console.log(
        `  ${s ? '✓' : '✗'} ${k.padEnd(16)} ${String(count).padStart(4)}  ${s ? s.name : ''}`,
      );
    }
    console.log('\nOff-ramp triples, with examples:');
    for (const [k, count] of sorted) {
      if (rampByTriple.has(k)) continue;
      console.log(`\n  ✗ ${k} — ${count} element(s)`);
      for (const e of examples.get(k) ?? []) {
        console.log(`    [${e.story.title} :: ${e.story.name}] <${e.node.tag}> "${e.node.text}"`);
        console.log(`       class: ${e.node.cls.slice(0, 140) || '(none — inherits)'}`);
      }
    }
    return;
  }

  report({
    failures,
    warnings,
    stories,
    measured,
    skipped,
    excepted,
    steps,
    dead: deadRules(exceptions, exceptionHits),
  });
}

function report({ failures, warnings, stories, measured, skipped, excepted, steps, dead }) {
  const header =
    `Jake UI computed type — ${stories.length} stories, ${measured} measured element(s), ` +
    `${skipped} platform-drawn/hidden, ${excepted} documented divergence(s), ${steps.length}-step ramp.`;
  console.log(header);

  if (warnings.length > 0) {
    const uniq = new Map();
    for (const w of warnings) {
      const key = `${w.story.title}|${w.node.ownerCls}|${w.triple}`;
      if (!uniq.has(key)) uniq.set(key, w);
    }
    console.log(`\n${uniq.size} inherited off-ramp warning(s) — classless text, not a failure:`);
    for (const w of uniq.values()) {
      console.log(`  ~ ${w.story.title} — <${w.node.tag}> "${w.node.text}" computes ${w.triple}`);
      console.log(
        `      inherits from <${w.node.ownerTag}> ${w.node.ownerCls.slice(0, 90) || '(root)'}`,
      );
      console.log(
        '      that element sets no ramp step, so the glyph falls to the inherited size.',
      );
    }
  }

  if (dead && dead.length > 0) {
    console.error(
      `\nFAIL — ${dead.length} stale entr(y/ies) in scripts/computed-type-exceptions.json.\n`,
    );
    for (const { e, n } of dead) {
      const want = typeof e.expectedElements === 'number' ? e.expectedElements : 'at least 1';
      console.error(`  ${e.component} — excused ${n} element(s), expected ${want}`);
      console.error(`    triple ${e.triple}, requires [${e.requireClasses.join(', ')}]`);
      console.error(
        n === 0
          ? '    Nothing matches it any more. Delete the entry — an exception that excuses'
          : '    The count moved. Confirm the change was intended, then update expectedElements.',
      );
      if (n === 0)
        console.error(
          '    nothing will silently excuse the next element that computes this triple.',
        );
    }
    process.exit(1);
  }

  if (failures.length === 0) {
    console.log('\nOK — every measured element computes to a step in the ramp.');
    return;
  }

  const byComponent = new Map();
  for (const f of failures) {
    if (!byComponent.has(f.story.title)) byComponent.set(f.story.title, []);
    byComponent.get(f.story.title).push(f);
  }

  console.error(
    `\nFAIL — ${failures.length} element(s) across ${byComponent.size} component(s) do not compute to a ramp step.\n`,
  );
  for (const [comp, list] of [...byComponent.entries()].sort((a, b) => b[1].length - a[1].length)) {
    console.error(`  ${comp} — ${list.length} element(s)`);
    for (const f of list.slice(0, 3)) {
      console.error(`    · [${f.story.name}] <${f.node.tag}> "${f.node.text}"`);
      console.error(`        ${f.kind}: ${f.detail}`);
      if (f.node.cls) console.error(`        class: ${f.node.cls.slice(0, 110)}`);
    }
    if (list.length > 3) console.error(`    … and ${list.length - 3} more`);
    console.error('');
  }

  console.error('The ramp, for reference:');
  for (const s of steps) console.error(`  ${s.name.padEnd(14)} ${fmtStep(s)}`);
  console.error('\nIf a ramp class is present in the component source but missing from the');
  console.error('`class:` lines above, tailwind-merge deleted it — check the `font-size`');
  console.error('classGroup in lib/cn.ts against the ramp in tokens/globals.css.');
  process.exit(1);
}

if (process.argv[1] && resolvePath(process.argv[1]) === fileURLToPath(import.meta.url))
  main().catch((err) => {
    console.error('computed-type-check crashed:', err);
    process.exit(1);
  });

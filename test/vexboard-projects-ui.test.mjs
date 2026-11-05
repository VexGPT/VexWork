import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import * as Reader from '../vexboard-reader.js';

const projects = fs.readFileSync(new URL('../vexboard/projects.html', import.meta.url), 'utf8');
const canvas = fs.readFileSync(new URL('../vexboard/index.html', import.meta.url), 'utf8');
const adapterSource = fs.readFileSync(new URL('../src/core/vexboard-screen-lens-android-adapter.mjs', import.meta.url), 'utf8');
const repositoryRoot = new URL('../', import.meta.url);

function staticImports(source) {
  return [...source.matchAll(/^\s*import\s+(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"];\s*$/gm)].map((match) => match[1]);
}

test('Projects is the VexBoard front door, and every canvas deep link still opens the canvas', () => {
  assert.match(canvas, /if\(!q\.has\('board'\)&&!q\.has\('create'\)&&!q\.has\('canvas'\)\)location\.replace\('\.\/projects\.html'\+location\.hash\)/);
  assert.ok(canvas.indexOf("location.replace('./projects.html'") < canvas.indexOf('<style>'), 'the redirect runs before the canvas paints');
  assert.match(canvas, /if\(new URLSearchParams\(location\.search\)\.get\('create'\)==='draft'\)\{await openBoard\(await Board\.createBlankDraft/);
  assert.match(canvas, /<a href="\.\/projects\.html">Projects<\/a>/);
  assert.match(canvas, /entry\.dataset\.vexboardEntry='projects'/);
  assert.match(canvas, /'Projects is now the way in'/);
});

test('the projects page reads the catalog, notes and Stable lenses, and writes nothing', () => {
  assert.match(projects, /<title>VexBoard Projects<\/title>/);
  assert.match(projects, /Catalog\.normalizeLensCatalog\(await fetchJson\(`\$\{LENS_DIR\}catalog\.json`\)\)/);
  assert.match(projects, /fetchJson\(`\$\{LENS_DIR\}considerations\.json`\)\.then\(Catalog\.normalizeConsiderations\)/);
  assert.match(projects, /Lens\.normalizeScreenLens\(await fetchJson\(LENS_DIR \+ Catalog\.buildFor\(subject, 'stable'\)\.lens\)\)/);
  assert.doesNotMatch(projects, /localStorage\.setItem/);
  assert.equal((projects.match(/sessionStorage\.setItem\(/g) || []).length, 1, 'only the ten-minute cache of branch heads');
  assert.doesNotMatch(projects, /method:\s*'(POST|PUT|PATCH|DELETE)'/);
  assert.doesNotMatch(projects, /innerHTML\s*=\s*[^'"]/, 'dynamic text goes through text nodes');
});

test('local drafts are read with the key the draft owner defines', () => {
  const key = /const DRAFTS_KEY = '([^']+)'/.exec(projects)?.[1];
  assert.equal(key, Reader.VEXBOARD_DRAFT_STORAGE_KEY);
  assert.match(projects, /href: '\.\/\?create=draft'/);
  assert.match(projects, /href: '\.\/\?canvas=home'/);
});

test('each project shows its pointers, its currency against GitHub, and how to open any commit', () => {
  assert.match(projects, /class: 'track', role: 'img'/);
  assert.match(projects, /Source\.compareCommits\(\{ repositoryUrl: subject\.repository\.url, base: main\.commit, head: branch/);
  assert.match(projects, /Run npm run lens:main to move Main\./);
  assert.match(projects, /Catalog\.lensHref\(subject, \{ commit: Catalog\.validateSourceRef\(input\.value\) \}\)/);
  assert.match(projects, /h\('h2', \{\}, 'Notes to consider'\)/);
  assert.match(projects, /h\('h2', \{\}, 'Earlier canvas trials'\)/);
  assert.match(projects, /'No Screen Lens yet'/);
});

test('the projects page and the any-commit adapter load in a browser without Node-only imports', () => {
  const inline = projects.match(/<script type="module">\s*([\s\S]*?)<\/script>/)?.[1];
  assert.ok(inline);
  const pending = staticImports(inline).map((specifier) => ({ specifier, parent: new URL('../vexboard/projects.html', import.meta.url) }));
  const seen = new Set();
  while (pending.length) {
    const { specifier, parent } = pending.pop();
    assert.ok(specifier.startsWith('.'), `${specifier} must be repository-relative`);
    const url = new URL(specifier, parent);
    assert.ok(url.href.startsWith(repositoryRoot.href));
    if (seen.has(url.href)) continue;
    seen.add(url.href);
    for (const child of staticImports(fs.readFileSync(url, 'utf8'))) pending.push({ specifier: child, parent: url });
  }
  assert.ok([...seen].every((href) => !href.includes('/src/core/')), 'projects.html stays on shared modules');
  assert.deepEqual(staticImports(adapterSource), [], 'the adapter is pure, so lens.html can load it for any commit');
});

// [VXG RealForever][VEXWORK][VEXBOARD][PROJECTS][UI-TEST]

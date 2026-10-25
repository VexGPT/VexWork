import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { VEXBOARD_BUILTIN_BOARD_URLS } from '../vexboard-reader.js';
import {
  BOARD_SOURCE_CATALOG_SCHEMA,
  BOARD_SOURCE_RESOLUTION_SCHEMA,
  catalogFromBoardUrlMap,
  normalizeBoardSourceCatalog,
  resolveBoardSource,
} from '../src/shared/vexboard-source-resolver.mjs';

const builtinCatalog = () => catalogFromBoardUrlMap({
  catalogRef: 'catalog.vexboard.builtin',
  urls: VEXBOARD_BUILTIN_BOARD_URLS,
  sourceRefs: ['vexboard-reader.js'],
});

const vexworkCatalog = () => normalizeBoardSourceCatalog({
  schemaVersion: BOARD_SOURCE_CATALOG_SCHEMA,
  catalogRef: 'catalog.vexwork.process-boards',
  entries: [{
    boardRef: 'board.vexwork.form-project',
    location: './form-project-process.json',
    sourceRefs: ['github.pull.vexwork.103', 'process.vexwork.form-project'],
  }],
  sourceRefs: ['blueprint/process-registry.json'],
});

test('existing built-in Board URLs project into one source-owned catalog without changing board identity', () => {
  const catalog = builtinCatalog();
  assert.equal(catalog.schemaVersion, BOARD_SOURCE_CATALOG_SCHEMA);
  assert.equal(catalog.catalogRef, 'catalog.vexboard.builtin');
  const boardRefs = catalog.entries.map((entry) => entry.boardRef);
  assert.equal(boardRefs.includes('board.vexboard.prototype-demo'), true);
  assert.equal(boardRefs.includes('board.vexboard.publish'), true);
  assert.equal(boardRefs.includes('board.vexboard.self-map'), true);

  const resolved = resolveBoardSource('board.vexboard.self-map', [catalog]);
  assert.equal(resolved.schemaVersion, BOARD_SOURCE_RESOLUTION_SCHEMA);
  assert.equal(resolved.boardRef, 'board.vexboard.self-map');
  assert.equal(resolved.catalogRef, catalog.catalogRef);
  assert.equal(resolved.location, './self-map.json');
  assert.deepEqual(resolved.sourceRefs, ['vexboard-reader.js']);
});

test('one boardRef resolves across multiple source-owned catalogs without making VexBoard a mega-registry', () => {
  const resolved = resolveBoardSource('board.vexwork.form-project', [
    builtinCatalog(),
    vexworkCatalog(),
  ]);

  assert.equal(resolved.catalogRef, 'catalog.vexwork.process-boards');
  assert.equal(resolved.location, './form-project-process.json');
  assert.deepEqual(resolved.sourceRefs, [
    'blueprint/process-registry.json',
    'github.pull.vexwork.103',
    'process.vexwork.form-project',
  ]);
  assert.equal(resolveBoardSource('board.unknown', [builtinCatalog(), vexworkCatalog()]), null);
});

test('VexStream living Blueprint patient zero resolves through the source-owned example catalog', () => {
  const catalog = normalizeBoardSourceCatalog(JSON.parse(
    fs.readFileSync(new URL('../projects/vexboard/examples/board-source-catalog.json', import.meta.url), 'utf8'),
  ));
  const resolved = resolveBoardSource('board.vexstream.phone-desktop-connection.living-blueprint', [catalog]);
  assert.equal(resolved.location, './vexstream-phone-desktop-connection.board.json');
  assert.equal(resolved.sourceRefs.includes('projects/vexboard/SEMANTIC-BLUEPRINT-IDE-FOUNDATION.md'), true);
  assert.equal(resolved.sourceRefs.some((ref) => ref.startsWith('git.commit.vexlife-android.')), true);
  assert.equal(resolved.sourceRefs.some((ref) => ref.startsWith('git.commit.vexstream-music.')), true);
});

test('duplicate board ownership across catalogs fails closed even when locations happen to match', () => {
  const duplicate = normalizeBoardSourceCatalog({
    schemaVersion: BOARD_SOURCE_CATALOG_SCHEMA,
    catalogRef: 'catalog.other',
    entries: [{
      boardRef: 'board.vexboard.self-map',
      location: './self-map.json',
      sourceRefs: ['source.other'],
    }],
    sourceRefs: ['source.other.catalog'],
  });

  assert.throws(
    () => resolveBoardSource('board.vexboard.self-map', [builtinCatalog(), duplicate]),
    /ambiguous board source/,
  );
});

test('catalog validation rejects duplicate refs, unsafe locations and schema drift', () => {
  const duplicateEntry = {
    schemaVersion: BOARD_SOURCE_CATALOG_SCHEMA,
    catalogRef: 'catalog.duplicate',
    entries: [
      { boardRef: 'board.example', location: './example.json', sourceRefs: [] },
      { boardRef: 'board.example', location: './other.json', sourceRefs: [] },
    ],
    sourceRefs: [],
  };
  assert.throws(() => normalizeBoardSourceCatalog(duplicateEntry), /boardRef must be unique/);

  const unsafe = structuredClone(duplicateEntry);
  unsafe.catalogRef = 'catalog.unsafe';
  unsafe.entries = [{ boardRef: 'board.example', location: './../escape.json', sourceRefs: [] }];
  assert.throws(() => normalizeBoardSourceCatalog(unsafe), /stay inside its source root/);

  const encodedTraversal = structuredClone(duplicateEntry);
  encodedTraversal.catalogRef = 'catalog.encoded-traversal';
  encodedTraversal.entries = [{ boardRef: 'board.example', location: './%2e%2e/escape.json', sourceRefs: [] }];
  assert.throws(() => normalizeBoardSourceCatalog(encodedTraversal), /plain relative JSON location/);

  const drift = {
    schemaVersion: BOARD_SOURCE_CATALOG_SCHEMA,
    catalogRef: 'catalog.drift',
    entries: [],
    sourceRefs: [],
    executionAuthority: 'NONE',
  };
  assert.throws(() => normalizeBoardSourceCatalog(drift), /schema drift/);
});

// [VXG RealForever][VEXWORK][VEXBOARD][SOURCE-RESOLVER]

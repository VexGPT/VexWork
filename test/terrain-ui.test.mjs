import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
const page=fs.readFileSync(new URL('../terrain.html',import.meta.url),'utf8');
const module=fs.readFileSync(new URL('../terrain-reader.js',import.meta.url),'utf8');
test('Terrain is an explicit read-only VexWork v2 projection',()=>{assert.match(page,/VexWork/);assert.match(page,/Terrain Map/);assert.match(page,/experimental v2/i);assert.match(page,/\.\/public\/workspace\.json/);assert.match(page,/executionAuthority!=='NONE'/);assert.doesNotMatch(page,/method:\s*['"](?:POST|PUT|PATCH|DELETE)['"]/i)});
test('Terrain separates semantic traversal from pixel scale and nested scroll',()=>{assert.match(page,/pixelScale/);assert.match(page,/scrollPathCanMove/);assert.match(page,/Outer boundary reached/);assert.match(page,/semantic-zoom-in/)});
test('Terrain module carries continuity semantics outside rendering',()=>{assert.match(module,/DUPLICATE_EXACT_NOOP/);assert.match(module,/DIVERGENT_COMMAND_IDENTITY/);assert.match(module,/inspectHistory/);assert.match(module,/REVISIT/);assert.match(module,/predecessor/)});
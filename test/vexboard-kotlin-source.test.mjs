import assert from 'node:assert/strict';
import test from 'node:test';

import * as Adapter from '../src/core/vexboard-screen-lens-android-adapter.mjs';
import { compact, kdocBefore, matchClose, splitArgs, stripComments, topLevelCalls } from '../src/core/vexboard-kotlin-source.mjs';

test('brackets match across strings, raw strings and comments', () => {
  const text = 'f("(", """)""", /* ) */ // )\n g(1))';
  assert.equal(matchClose(text, 1), text.length - 1);
  assert.throws(() => matchClose('f(', 1), /unbalanced/);
  assert.throws(() => matchClose('abc', 0), /needs an opening bracket/);
});

test('arguments split at top level, keep names, and drop comments', () => {
  assert.deepEqual(splitArgs('a = f(1, 2), "x,y", /* note */ b == c, lambda = { x -> x }'), [
    { name: 'a', value: 'f(1, 2)' },
    { name: null, value: '"x,y"' },
    { name: null, value: 'b == c' },
    { name: 'lambda', value: '{ x -> x }' },
  ]);
  assert.equal(stripComments('a // b\n/* c */d'), 'a \nd');
  assert.equal(compact('f(\n  a,\n)'), 'f(a)');
});

test('top-level calls and the first KDoc paragraph', () => {
  assert.deepEqual(topLevelCalls('column("x") { text("y") }\nif (z) { hidden() }\nbutton(B)').map((call) => call.name), ['column', 'button']);
  const source = '/**\n * First [Ref] paragraph.\n *\n * Second.\n */\n@Composable\ninternal fun Thing() {}';
  assert.equal(kdocBefore(source, source.indexOf('internal')), 'First Ref paragraph.');
});

test('the adapter keeps exporting the same Kotlin readers for existing callers', () => {
  for (const name of ['matchClose', 'splitArgs', 'stripComments', 'compact', 'kdocBefore', 'topLevelCalls']) assert.equal(typeof Adapter[name], 'function', name);
});

// [VXG RealForever][VEXWORK][VEXBOARD][KOTLIN-SOURCE-TEST]
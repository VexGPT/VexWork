import assert from 'node:assert/strict';
import test from 'node:test';

import { createUiBlueprint, defaultSeams } from '../src/shared/vexboard-ui-blueprint.mjs';
import { constructionBrief, reviewBlueprint, sourceCurrentness } from '../src/shared/vexboard-ui-review.mjs';
import { android, inventories, inventoriesBySubject, prod, stream } from './fixtures/ui-builder-fixtures.mjs';

const make = (nodes, extra = {}) => createUiBlueprint({ blueprintRef: 'ui.review', label: 'Review', nodes, ...extra });

test('currentness compares saved source evidence with the loaded inventories without rewriting it', () => {
  const current = android.text();
  const moved = { ...android.localButton(), commit: '0'.repeat(40) };
  const changed = { ...android.card(), commit: '1'.repeat(40), label: 'Old card title' };
  const missing = { ...android.text(), occurrenceRef: 'occurrence.component.vexlife-android.gone', commit: '2'.repeat(40) };
  const blueprint = make([
    { nodeRef: 'current', kind: 'TEXT', source: current },
    { nodeRef: 'moved', kind: 'BUTTON', order: 1, source: moved },
    { nodeRef: 'changed', kind: 'CARD', order: 2, source: changed },
    { nodeRef: 'missing', kind: 'TEXT', order: 3, source: missing },
    { nodeRef: 'unknown', kind: 'BUTTON', order: 4, source: { ...stream.button(), subjectRef: 'subject.not-loaded' } },
  ]);
  const states = Object.fromEntries(sourceCurrentness(blueprint, inventoriesBySubject()).map((row) => [row.nodeRef, row.state]));
  assert.deepEqual(states, { current: 'CURRENT', moved: 'MOVED', changed: 'CHANGED', missing: 'MISSING', unknown: 'UNKNOWN' });
  const review = reviewBlueprint(blueprint, { inventoriesBySubject: inventoriesBySubject() });
  const currentness = review.findings.filter((row) => row.category === 'CURRENTNESS');
  assert.ok(currentness.some((row) => row.severity === 'ATTENTION' && row.path === 'missing'));
  assert.ok(currentness.some((row) => row.severity === 'ATTENTION' && row.path === 'changed'));
  assert.ok(currentness.some((row) => row.severity === 'NOTE' && row.path === 'moved'));
  assert.ok(currentness.some((row) => row.path === null && /not loaded/u.test(row.message)));
  assert.equal(sourceCurrentness(blueprint, null).every((row) => row.state === 'UNKNOWN'), true);
});

test('currentness also covers component definition templates', () => {
  const blueprint = make([], {
    definitions: [{ definitionRef: 'component.x', label: 'X', version: 1, rootNodeRef: 'r', nodes: [{ nodeRef: 'r', kind: 'TEXT', source: { ...android.text(), commit: '3'.repeat(40) } }] }],
  });
  const review = reviewBlueprint(blueprint, { inventoriesBySubject: inventoriesBySubject() });
  assert.ok(review.findings.some((row) => row.path === 'component.x:r' && row.category === 'CURRENTNESS'));
});

test('accessibility review: names, image descriptions, touch targets and reading order', () => {
  const blueprint = make([
    { nodeRef: 'img', kind: 'IMAGE', source: android.image() },
    { nodeRef: 'deco', kind: 'IMAGE', order: 1, source: android.image(), accessibility: { decorative: true } },
    { nodeRef: 'tiny', kind: 'BUTTON', order: 2, source: android.localButton(), layout: { width: { mode: 'FIXED', valueOrNull: 32 }, height: { mode: 'FIXED', valueOrNull: 32 } } },
    { nodeRef: 'area', kind: 'GROUP', order: 3, layout: { container: { mode: 'FREEFORM' }, height: { mode: 'FIXED', valueOrNull: 300 } } },
    { nodeRef: 'low', kind: 'TEXT', parentRef: 'area', order: 0, source: android.text(), layout: { placement: { type: 'FRACTION', x: { start: 0, end: null }, y: { start: 10, end: null } }, depth: 0 } },
    { nodeRef: 'high', kind: 'TEXT', parentRef: 'area', order: 1, source: android.text(), layout: { placement: { type: 'FRACTION', x: { start: 0, end: null }, y: { start: 1, end: null } }, depth: 1 } },
    { nodeRef: 'stack', kind: 'GROUP', order: 4, layout: { container: { mode: 'OVERLAY' } } },
    { nodeRef: 'bottom', kind: 'TEXT', parentRef: 'stack', order: 0, source: android.text(), layout: { placement: { type: 'ANCHOR', anchor: 'BOTTOM_END' }, depth: 0 } },
    { nodeRef: 'top', kind: 'TEXT', parentRef: 'stack', order: 1, source: android.text(), layout: { placement: { type: 'ANCHOR', anchor: 'TOP_START' }, depth: 1 } },
    { nodeRef: 'mid', kind: 'TEXT', parentRef: 'stack', order: 2, source: android.text(), layout: { placement: { type: 'ANCHOR', anchor: 'CENTER' }, depth: 2 } },
    { nodeRef: 'empty', kind: 'GROUP', order: 5 },
  ]);
  const review = reviewBlueprint(blueprint);
  const at = (path) => review.findings.filter((row) => row.path === path).map((row) => row.message).join(' | ');
  assert.match(at('img'), /needs a description/u);
  assert.equal(at('deco'), '');
  assert.match(at('tiny'), /at least 48dp/u);
  assert.match(at('area'), /reading order|Screen-reader order/u);
  assert.match(at('stack'), /Screen-reader order/u);
  assert.match(at('empty'), /is empty/u);
  assert.ok(review.counts.attention >= 3);
});

test('interactive elements without any accessible name are flagged; an a11y label clears it', () => {
  const unnamed = make([{ nodeRef: 'h', kind: 'HANDLE', source: prod.handle() }]);
  assert.ok(reviewBlueprint(unnamed).findings.some((row) => row.path === 'h' && /no accessible name/u.test(row.message)));
  const named = make([{ nodeRef: 'h', kind: 'HANDLE', source: prod.handle(), accessibility: { labelOrNull: 'Resize panels' } }]);
  assert.equal(reviewBlueprint(named).findings.some((row) => /no accessible name/u.test(row.message)), false);
});

test('localization, portability, held selection and unopened overlays are surfaced as notes', () => {
  const blueprint = make([
    { nodeRef: 'new', kind: 'BUTTON', source: android.localButton(), content: { text: { origin: 'AUTHORED', value: 'Brand new' } } },
    { nodeRef: 'swap', kind: android.swapButton().kind, order: 1, source: android.swapButton() },
    { nodeRef: 'reveal', kind: 'BUTTON', order: 2, source: prod.localReveal() },
    { nodeRef: 'stream', kind: 'BUTTON', order: 3, source: stream.button() },
    { nodeRef: 'odd', kind: 'CAROUSEL', order: 4, source: { ...android.text(), kind: 'CAROUSEL' } },
    { nodeRef: 'dlg', kind: 'DIALOG', source: android.dialog() },
  ]);
  const review = reviewBlueprint(blueprint);
  const messages = review.findings.map((row) => row.category + ':' + (row.path ?? '-') + ':' + row.message);
  assert.ok(messages.some((row) => row.startsWith('LOCALIZATION:new:') && /Brand new/u.test(row)));
  assert.ok(messages.some((row) => row.startsWith('INTEGRATION:swap:') && /Local Selection is HELD/u.test(row)));
  assert.ok(messages.some((row) => row.startsWith('INTEGRATION:reveal:')));
  assert.ok(messages.some((row) => row.startsWith('LOCALIZATION:-:') && /no projected localization/u.test(row)));
  assert.ok(messages.some((row) => row.startsWith('PORTABILITY:odd:') && /does not recognize/u.test(row)));
  assert.ok(messages.some((row) => row.startsWith('PORTABILITY:-:')));
  assert.ok(messages.some((row) => row.startsWith('INTEGRATION:dlg:') && /not opened by anything/u.test(row)));
  assert.ok(review.counts.toBind >= 2);
  assert.equal(review.findings[0].severity, 'ATTENTION', 'attention sorts first');
});

test('held portable relationships are named when present', () => {
  const held = { ...android.localButton(), portable: { disposition: 'PORTABILITY_HELD', acceptedCandidateRefs: [], heldCandidateRefs: ['candidate.local-selection'], targetRealizationRefs: [] } };
  const review = reviewBlueprint(make([{ nodeRef: 'h', kind: 'BUTTON', source: held }]));
  assert.ok(review.findings.some((row) => /candidate\.local-selection/u.test(row.message)));
});

test('construction brief is a deterministic projection an engineer or AI can follow without screenshots', () => {
  const button = android.localButton();
  const blueprint = make([
    { nodeRef: 'card', kind: 'CARD', source: android.card() },
    { nodeRef: 'toggle', kind: 'TOGGLE', parentRef: 'card', source: android.darkMode() },
    { nodeRef: 'go', kind: 'BUTTON', parentRef: 'card', order: 1, source: button, behavior: { seams: [...defaultSeams('go', 'BUTTON', button), { seamRef: 'a1', kind: 'PRESENTATION', key: 'open.confirm', verbOrNull: 'OPEN', targetNodeRefOrNull: 'dlg' }] } },
    { nodeRef: 'nav', kind: 'BUTTON', parentRef: 'card', order: 2, source: android.navButton() },
    { nodeRef: 'cond', kind: android.conditional().kind, order: 1, source: android.conditional() },
    { nodeRef: 'img', kind: 'IMAGE', order: 2, source: android.image(), accessibility: { labelOrNull: 'Portrait', decorative: false } },
    { nodeRef: 'deco', kind: 'IMAGE', order: 3, source: android.image(), accessibility: { decorative: true } },
    { nodeRef: 'area', kind: 'GROUP', order: 4, layout: { container: { mode: 'FREEFORM' }, height: { mode: 'FIXED', valueOrNull: 200 } } },
    { nodeRef: 'free', kind: 'TEXT', parentRef: 'area', source: android.text(), layout: { placement: { type: 'FRACTION', x: { start: 1, end: 10 }, y: { start: 2, end: null } } }, content: { text: { origin: 'AUTHORED', value: 'Hello' } } },
    { nodeRef: 'layer', kind: 'GROUP', order: 5, layout: { container: { mode: 'OVERLAY' } } },
    { nodeRef: 'pin', kind: 'TEXT', parentRef: 'layer', source: android.text(), layout: { placement: { type: 'ANCHOR', anchor: 'TOP_END', inset: 'S' }, depth: 0 } },
    { nodeRef: 'row', kind: 'ROW', order: 6, source: android.row(), layout: { width: { mode: 'FIXED', valueOrNull: 300 } } },
    { nodeRef: 'swap', kind: android.swapButton().kind, order: 7, source: android.swapButton() },
    { nodeRef: 'tile', kind: 'INSTANCE', order: 8, instance: { definitionRef: 'component.tile', definitionVersion: 1 } },
    { nodeRef: 'dlg', kind: 'DIALOG', source: android.dialog() },
  ], {
    definitions: [{ definitionRef: 'component.tile', label: 'Tile', version: 1, rootNodeRef: 'r', slots: [{ slotRef: 'body', templateNodeRef: 'r' }], nodes: [
      { nodeRef: 'r', kind: 'CARD', source: android.card() },
      { nodeRef: 'b', kind: 'BUTTON', parentRef: 'r', source: android.localButton() },
    ] }],
  });
  const review = reviewBlueprint(blueprint, { inventoriesBySubject: new Map([[inventories.android.subjectRef, inventories.android]]) });
  const brief = constructionBrief(blueprint, review);
  assert.equal(constructionBrief(blueprint, review), brief);
  for (const pattern of [
    /^# Review — UI construction brief/u,
    /runs nothing and owns no application State, Effect, Store or Family/u,
    /action `action\.theme\.dark-mode\.toggle` \(source action key `action\.theme\.dark-mode\.toggle`\)/u,
    /navigation `navigate\./u,
    /condition `/u,
    /`go` activate → open `dlg`/u,
    /free-form \(children placed in 1\/24 fractions\)/u,
    /x 1–10\/24, y 2\+hug\/24/u,
    /anchored top-end inset S/u,
    /authored text, needs localization/u,
    /a11y label "Portrait"/u,
    /decorative/u,
    /width 300dp/u,
    /instance of `component\.tile`/u,
    /`component\.tile` "Tile" v1 · ports: `b\/s1`=/u,
    /slots: `body`/u,
    /## Overlays \(shown when opened\)/u,
    /## Review notes/u,
    /presentation `swap\./u,
    /Vertical stack \(scrolls\)/u,
  ]) {
    assert.match(brief, pattern);
  }
  const empty = constructionBrief(make([]));
  assert.match(empty, /_No open action, navigation or condition seams\._/u);
  assert.match(empty, /## Structure\n\n_none_/u);
  assert.doesNotMatch(empty, /## Review notes/u);
  const clean = constructionBrief(make([]), { findings: [] });
  assert.match(clean, /_No findings\._/u);
  const horizontal = constructionBrief(make([], { surface: { container: { mode: 'STACK', axis: 'HORIZONTAL' } } }));
  assert.match(horizontal, /Horizontal stack/u);
  assert.match(constructionBrief(make([], { surface: { container: { mode: 'OVERLAY' } } })), /Layered surface/u);
  assert.match(constructionBrief(make([], { surface: { container: { mode: 'FREEFORM' } } })), /Free-form surface/u);
});

// [VXG RealForever][VEXWORK][COMPONENT-LIBRARY][A5-UI-REVIEW-TEST]

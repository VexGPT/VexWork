import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import * as Reader from '../vexboard-reader.js';
import { normalizeBoardGraph, normalizeBoardProjection } from '../src/shared/vexboard-model.mjs';

const page = fs.readFileSync(new URL('../vexboard/index.html', import.meta.url), 'utf8');
const selfMap = JSON.parse(fs.readFileSync(new URL('../vexboard/self-map.json', import.meta.url), 'utf8'));
const publishMap = JSON.parse(fs.readFileSync(new URL('../vexboard/publish-map.json', import.meta.url), 'utf8'));
const prototypeDemo = JSON.parse(fs.readFileSync(new URL('../vexboard/prototype-demo.json', import.meta.url), 'utf8'));
const prototypeDefinition = JSON.parse(fs.readFileSync(new URL('../vexboard/prototype-demo.prototype.json', import.meta.url), 'utf8'));

test('VexBoard Pages entry exposes create/open/read-only/fork/save-draft workflow', () => {
  assert.match(page, /Create new/);
  assert.match(page, /Open VexBoard self-map/);
  assert.match(page, /Open prototype demo/);
  assert.match(page, /Request edit → draft copy/);
  assert.match(page, /Save draft/);
  assert.match(page, /Browser-local proving copies · not source truth/);
  assert.match(page, /Local draft · source detached/);
  assert.match(page, /href="\.\.\/">← VexWork/);
});

test('read-only fork preserves the actual draft identity as the active board coordinate', () => {
  const forkLine = page.split('\n').find((line) => line.includes('fork.onclick=async'));
  assert.ok(forkLine);
  assert.equal((forkLine.match(/ref\('draft\.vexboard'\)/g) ?? []).length, 1);
  assert.doesNotMatch(forkLine, /boardRef:ref\('draft\.vexboard'\)/);
});

test('browser UI uses the shared BoardControl adapter for mutation rather than source/provider writes', () => {
  assert.match(page, /Board\.controlFor\(current/);
  assert.match(page, /Board\.applyBoardControl/);
  assert.match(page, /'CREATE_NODE'/);
  assert.match(page, /'MOVE_ITEM'/);
  assert.match(page, /'RESIZE_ITEM'/);
  assert.match(page, /'CONNECT_NODES'/);
  assert.match(page, /Board\.boardPointFromClient/);
  assert.doesNotMatch(page, /method:\s*['"](?:POST|PUT|PATCH|DELETE)['"]/i);
  assert.doesNotMatch(page, /api\.github\.com|raw\.githubusercontent\.com/);
});

test('canvas projection exposes pan zoom fit focus minimap and read-only recursive navigation', () => {
  for (const label of ['Pan', 'Zoom out', 'Zoom in', 'Fit', 'Reset view', 'Focus selected', 'Collapse children', 'Enter portal']) {
    assert.match(page, new RegExp(label));
  }
  assert.match(page, /el\(['"]div['"],['"]minimap['"]\)/);
  assert.match(page, /Board\.zoomCameraAt/);
  assert.match(page, /Board\.cameraForBounds/);
  assert.match(page, /Board\.boardViewport/);
  assert.match(page, /Board\.visibleProjectionItems/);
  assert.match(page, /Board\.builtinBoardUrl/);
  assert.match(page, /↩ Return/);
});

test('Context Inspector remains identity-first and includes bounded neighborhood query', () => {
  assert.match(page, /Context Inspector/);
  assert.match(page, /stable identity, projection geometry, source refs/);
  assert.match(page, /nodeRef/);
  assert.match(page, /Relationships/);
  assert.match(page, /Source refs/);
  assert.match(page, /Neighborhood · bounded query/);
  assert.match(page, /Board\.queryBoardNeighborhood/);
});

test('self-map and publish-map are valid read-only built-in boards with reciprocal portal routing', () => {
  for (const source of [selfMap, publishMap]) {
    assert.equal(source.schemaVersion, Reader.VEXBOARD_DRAFT_SCHEMA);
    assert.equal(source.mode, 'READ_ONLY_SOURCE');
    const graph = normalizeBoardGraph(source.graph);
    const projection = normalizeBoardProjection(source.projection, graph);
    assert.ok(graph.nodes.length > 0);
    assert.ok(projection.items.length > 0);
  }
  const selfGraph = normalizeBoardGraph(selfMap.graph);
  assert.ok(selfGraph.nodes.some((node) => node.nodeRef === 'node.vexboard.create-new'));
  assert.ok(selfGraph.nodes.some((node) => node.nodeRef === 'node.vexboard.request-edit'));
  assert.ok(selfGraph.nodes.some((node) => node.nodeRef === 'node.vexboard.save-draft'));
  assert.ok(selfGraph.nodes.some((node) => node.detailBoardRefOrNull === 'board.vexboard.publish'));
  assert.equal(Reader.builtinBoardUrl('board.vexboard.self-map'), './self-map.json');
  assert.equal(Reader.builtinBoardUrl('board.vexboard.publish'), './publish-map.json');
  assert.equal(Reader.builtinBoardUrl('board.vexboard.prototype-demo'), './prototype-demo.json');
  assert.equal(Reader.builtinPrototypeUrl('board.vexboard.prototype-demo'), './prototype-demo.prototype.json');
  assert.equal(Reader.builtinPrototypeUrl('board.vexboard.self-map'), null);
  const publishGraph = normalizeBoardGraph(publishMap.graph);
  assert.ok(publishGraph.nodes.some((node) => node.detailBoardRefOrNull === 'board.vexboard.self-map'));
});

test('draft reader keeps read-only source separate from editable local fork', async () => {
  const state = await Reader.hydrateBoardState(selfMap.graph, selfMap.projection);
  const source = { ...selfMap, graph: state.graph, projection: state.projection };
  const fork = await Reader.forkReadOnlyBoard(source, { draftRef: 'draft.ui-proof' });
  assert.equal(source.mode, 'READ_ONLY_SOURCE');
  assert.equal(fork.mode, 'LOCAL_DRAFT');
  assert.equal(fork.derivedFromRefOrNull, selfMap.draftRef);
  assert.equal(fork.graph.semanticFingerprint, source.graph.semanticFingerprint);
});

// [VXG RealForever][VEXWORK][VEXBOARD][UI-PROOF]

test('BoardJourney UI keeps semantic walk state distinct from camera navigation', () => {
  assert.match(page, /BoardJourney · semantic walk/);
  assert.match(page, /Start journey here/);
  assert.match(page, /Board\.createBoardJourney/);
  assert.match(page, /Board\.advanceBoardJourney/);
  assert.match(page, /Board\.backBoardJourney/);
  assert.match(page, /Board\.revisitBoardJourney/);
  assert.match(page, /Board\.journeyChoices/);
  assert.match(page, /navigationKind/);
  assert.doesNotMatch(page, /method:\s*['"](?:POST|PUT|PATCH|DELETE)['"]/i);
});


test('prototype demo drives clickable local simulation through scenario overlays and BoardJourney', () => {
  const graph = normalizeBoardGraph(prototypeDemo.graph);
  const projection = normalizeBoardProjection(prototypeDemo.projection, graph);
  const prototype = Reader.normalizeBoardPrototype(prototypeDefinition, graph);
  assert.equal(prototypeDemo.mode, 'READ_ONLY_SOURCE');
  assert.equal(projection.graphRef, graph.graphRef);

  let scenario = Reader.createBoardScenario(prototype, graph, { scenarioRef: 'scenario.ui-proof' });
  let journey = Reader.createBoardJourney(graph, {
    journeyRef: 'journey.ui-proof',
    boardRef: prototypeDemo.draftRef,
    startRef: 'node.prototype.enable',
  });

  const initialSubmit = Reader.boardInteractionChoices(graph, prototype, scenario, {
    controlRef: 'node.prototype.submit',
    trigger: 'CLICK',
  });
  assert.equal(initialSubmit[0].conditionState, 'UNKNOWN');

  const enabled = Reader.applyBoardInteraction({
    graph,
    journey,
    prototype,
    scenario,
    interactionRef: 'interaction.prototype.enable',
  });
  scenario = enabled.scenario;
  journey = enabled.journey;
  assert.equal(scenario.values.find((entry) => entry.valueRef === 'value.prototype.can-submit').value, true);
  assert.deepEqual(scenario.openOverlayRefs, ['overlay.prototype.ready']);
  assert.deepEqual(enabled.effects, { externalEffectsPerformed: false });

  journey = Reader.advanceBoardJourney(graph, journey, 'rel.prototype.enable-submit');
  const submitChoice = Reader.boardInteractionChoices(graph, prototype, scenario, {
    controlRef: 'node.prototype.submit',
    trigger: 'CLICK',
  });
  assert.equal(submitChoice[0].conditionState, 'TRUE');

  const submitted = Reader.applyBoardInteraction({
    graph,
    journey,
    prototype,
    scenario,
    interactionRef: 'interaction.prototype.submit',
  });
  assert.equal(submitted.journey.currentRef, 'node.prototype.done');
  assert.equal(submitted.journey.steps.at(-1).viaRelationshipRefOrNull, 'rel.prototype.submit-done');
  assert.equal(submitted.scenario.values.find((entry) => entry.valueRef === 'value.prototype.submitted').value, true);
  assert.deepEqual(submitted.scenario.openOverlayRefs, ['overlay.prototype.success']);
  assert.deepEqual(submitted.effects, { externalEffectsPerformed: false });
});

test('prototype UI exposes simulation state and consumes the shared contract without provider writes', () => {
  assert.match(page, /Prototype simulation/);
  assert.match(page, /Start simulation here/);
  assert.match(page, /External effects: none/);
  assert.match(page, /prototype-overlays/);
  assert.match(page, /Board\.boardInteractionChoices/);
  assert.match(page, /Board\.applyBoardInteraction/);
  assert.match(page, /Board\.createBoardScenario/);
  assert.match(page, /Board\.builtinPrototypeUrl/);
  assert.doesNotMatch(page, /method:\s*['"](?:POST|PUT|PATCH|DELETE)['"]/i);
  assert.doesNotMatch(page, /api\.github\.com|raw\.githubusercontent\.com/);
});


test('prototype UI preserves the explicit interaction path beside BoardJourney after traversal', () => {
  assert.match(page, /let prototype=null,scenario=null,interactionTrail=\[\]/);
  assert.match(page, /interactionTrail:\s*interactionTrail\.map\(entry=>\(\{\.\.\.entry\}\)\)/);
  assert.match(page, /interactionTrail=\[\.\.\.interactionTrail,\{/);
  assert.match(page, /interactionRef:result\.interactionRef/);
  assert.match(page, /controlRef:interaction\.controlRef/);
  assert.match(page, /conditionRefOrNull:interaction\.conditionOrNull\?\.conditionRef\?\?null/);
  assert.match(page, /conditionState:result\.conditionState/);
  assert.match(page, /fromRef,/);
  assert.match(page, /toRef:result\.journey\.currentRef/);
  assert.match(page, /function interactionTrailText\(\)/);
  assert.match(page, /Interaction path\\n\$\{interactionTrailText\(\)\}/);
  assert.match(page, /function startJourneyAt\(semanticRef\)\{interactionTrail=\[\];/);
  assert.match(page, /\{current,selected,tool,camera,journey,prototype,scenario,interactionTrail,activeBoardRef\}=prior/);
});

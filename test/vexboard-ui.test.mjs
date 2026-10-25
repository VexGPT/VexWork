import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import * as Reader from '../vexboard-reader.js';
import { normalizeBoardGraph, normalizeBoardProjection } from '../src/shared/vexboard-model.mjs';
import {
  normalizeBoardSourceCatalog,
  resolveBoardSource,
} from '../src/shared/vexboard-source-resolver.mjs';

const page = fs.readFileSync(new URL('../vexboard/index.html', import.meta.url), 'utf8');
const selfMap = JSON.parse(fs.readFileSync(new URL('../vexboard/self-map.json', import.meta.url), 'utf8'));
const publishMap = JSON.parse(fs.readFileSync(new URL('../vexboard/publish-map.json', import.meta.url), 'utf8'));
const prototypeDemo = JSON.parse(fs.readFileSync(new URL('../vexboard/prototype-demo.json', import.meta.url), 'utf8'));
const prototypeDefinition = JSON.parse(fs.readFileSync(new URL('../vexboard/prototype-demo.prototype.json', import.meta.url), 'utf8'));
const systemAnatomy = JSON.parse(fs.readFileSync(new URL('../projects/vexboard/examples/vexbusinessfactory-system-anatomy.board.json', import.meta.url), 'utf8'));
const intentTopology = JSON.parse(fs.readFileSync(new URL('../projects/vexboard/examples/vexbusinessfactory-intent-topology.board.json', import.meta.url), 'utf8'));
const patientZeroCatalog = JSON.parse(fs.readFileSync(new URL('../projects/vexboard/examples/board-source-catalog.json', import.meta.url), 'utf8'));

test('VexBoard Pages entry exposes create/open/read-only/fork/save-draft workflow', () => {
  assert.match(page, /Create new/);
  assert.match(page, /Open VexBoard self-map/);
  assert.match(page, /Open prototype demo/);
  assert.match(page, /Source examples/);
  assert.match(page, /Open system anatomy example/);
  assert.match(page, /Open intent topology example/);
  assert.match(page, /Request edit → draft copy/);
  assert.match(page, /Save draft/);
  assert.match(page, /Browser-local proving copies · not source truth/);
  assert.match(page, /Local draft · browser only/);
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

test('built-in and patient-zero source boards preserve separate catalog ownership and canonical identity', () => {
  for (const source of [selfMap, publishMap, systemAnatomy, intentTopology]) {
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
  assert.equal(Reader.builtinBoardUrl('board.vexbusinessfactory.system-anatomy.patient-zero'), null);
  assert.equal(Reader.builtinBoardUrl('board.vexbusinessfactory.intent-topology.patient-zero'), null);

  const catalog = normalizeBoardSourceCatalog(patientZeroCatalog);
  assert.equal(catalog.catalogRef, 'catalog.vexboard.patient-zero-examples');
  assert.deepEqual(
    catalog.entries.map((entry) => entry.boardRef),
    [
      'board.vexbusinessfactory.intent-topology.patient-zero',
      'board.vexbusinessfactory.system-anatomy.patient-zero',
      'board.vexlife-android.home-vexstream.poc',
      'board.vexlife-android.vexstream-depth.poc',
      'board.vexstream.phone-desktop-connection.construction-evidence',
      'board.vexstream.phone-desktop-connection.living-blueprint',
    ],
  );

  const anatomyResolution = resolveBoardSource(systemAnatomy.draftRef, [catalog]);
  assert.equal(anatomyResolution.catalogRef, catalog.catalogRef);
  assert.equal(anatomyResolution.location, './vexbusinessfactory-system-anatomy.board.json');
  assert.equal(anatomyResolution.boardRef, systemAnatomy.draftRef);

  const intentResolution = resolveBoardSource(intentTopology.draftRef, [catalog]);
  assert.equal(intentResolution.catalogRef, catalog.catalogRef);
  assert.equal(intentResolution.location, './vexbusinessfactory-intent-topology.board.json');
  assert.equal(intentResolution.boardRef, intentTopology.draftRef);

  assert.match(page, /vexboard-source-resolver\.mjs/);
  assert.match(page, /function loadSourceCatalogs\(\)/);
  assert.match(page, /SourceResolver\.resolveBoardSource/);
  assert.match(page, /draft\.draftRef!==boardRef/);
  assert.match(page, /openCatalogBoard\('board\.vexbusinessfactory\.system-anatomy\.patient-zero'\)/);
  assert.match(page, /openCatalogBoard\('board\.vexbusinessfactory\.intent-topology\.patient-zero'\)/);

  assert.equal(Reader.builtinPrototypeUrl('board.vexboard.prototype-demo'), './prototype-demo.prototype.json');
  assert.equal(Reader.builtinPrototypeUrl('board.vexboard.self-map'), null);
  const publishGraph = normalizeBoardGraph(publishMap.graph);
  assert.ok(publishGraph.nodes.some((node) => node.detailBoardRefOrNull === 'board.vexboard.self-map'));
});

test('VexLife Android POC is projected at source-load time and styled without changing universal Board schemas', () => {
  assert.match(page, /vexboard-android-source-projector\.mjs/);
  assert.match(page, /android-reference-presentation\.mjs/);
  assert.match(page, /VEXLIFE_ANDROID_POC_SNAPSHOT_SCHEMA/);
  assert.match(page, /AndroidProjector\.androidPocDesignLocation\(payload\)/);
  assert.match(page, /new URL\(designLocation,boardUrl\)/);
  assert.match(page, /ScreenDesign\.normalizeScreenDesign\(await designResponse\.json\(\)\)/);
  assert.match(page, /projectVexLifeAndroidPocSnapshot\(payload,boardRef,design\)/);
  assert.match(page, /AndroidPresentation\.androidReferenceClassNames\(current\.presentation,i\.projectionItemRef\)/);
  assert.match(page, /AndroidPresentation\.androidReferenceRelationshipRoute\(current\.presentation,r\.relationshipRef\)/);
  assert.match(page, /occurrenceRoute\?item\(occurrenceRoute\.fromProjectionItemRef\):itemFor\(r\.fromRef\)/);
  assert.match(page, /AndroidPresentation\.androidReferenceProfileSummary\(current\.presentation\)/);
  assert.match(page, /Android ref ·/);
  assert.match(page, /vexboard-screen-design\.mjs/);
  assert.match(page, /ScreenDesign\.normalizeScreenDesign\(d\.design\)/);
  assert.match(page, /Reverse-adopted design/);
  assert.match(page, /VexBoard design authority/);
  assert.match(page, /Screen Design/);
  assert.match(page, /function designMetricText\(/);
  assert.match(page, /function designAxisText\(/);
  assert.match(page, /current\.design\.constraints\.filter\(value=>value\.semanticRef===n\.nodeRef\)/);
  assert.match(page, /current\.design\.layoutRules\|\|\[\]/);
  assert.match(page, /preferred\.toFixed\(2\)/);
  assert.match(page, /let scrollOffsetsByProjectionRef=new Map\(\)/);
  assert.match(page, /function scrollViewportMaximum\(/);
  assert.match(page, /function scrollViewportBy\(/);
  assert.match(page, /AndroidPresentation\.androidReferenceScrolledOccurrence/);
  assert.match(page, /AndroidPresentation\.androidReferenceScrollAxis/);
  assert.match(page, /scrollOffsets:\[\.\.\.scrollOffsetsByProjectionRef\.entries\(\)\]/);
  assert.match(page, /scrollOffsetsByProjectionRef=new Map\(prior\.scrollOffsets\|\|\[\]\)/);
  assert.doesNotMatch(page, /localStorage\.(?:setItem|getItem)\([^)]*scroll/i);
  assert.match(page, /Open VexLife Android Screen POC/);
  assert.match(page, /VEXBOARD_ANDROID_POC_BOARD_REFS\.EXPERIENCE/);
  assert.doesNotMatch(page, /api\.github\.com|raw\.githubusercontent\.com/);
  assert.doesNotMatch(page, /method:\s*['"](?:POST|PUT|PATCH|DELETE)['"]/i);
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


test('canvas usability refinement arbitrates chrome, canvas pan, object drag and click before mutation', () => {
  assert.match(page, /ui\/interaction\.mjs/);
  assert.match(page, /ui\/presentation\.mjs/);
  assert.match(page, /Interaction\.interactionPlaneForTarget/);
  assert.match(page, /Interaction\.shouldStartCanvasPan/);
  assert.match(page, /Interaction\.shouldStartObjectMove/);
  assert.match(page, /Interaction\.pointerGestureFromMovement/);
  assert.match(page, /Interaction\.objectPositionFromPointerDrag/);
  assert.match(page, /dataset\.vexboardPlane=Interaction\.INTERACTION_PLANES\.OBJECT/);
  assert.match(page, /dataset\.vexboardPlane=Interaction\.INTERACTION_PLANES\.CHROME/);
  assert.match(page, /dataset\.vexboardPlane=Interaction\.INTERACTION_PLANES\.OVERLAY/);
  assert.match(page, /let suppressShapeClick=false/);
  assert.match(page, /if\(suppressShapeClick\)\{suppressShapeClick=false;return\}/);
  assert.match(page, /cameraAnimator\.cancel\(\);e\.stopPropagation\(\);/);
  assert.doesNotMatch(page, /cameraAnimator\.cancel\(\);e\.preventDefault\(\);e\.stopPropagation\(\);/);
  assert.match(page, /m\.preventDefault\(\);/);
  assert.match(page, /if\(!dragged&&Interaction\.pointerGestureFromMovement\(start,end\)!=='DRAG'\)\{cleanup\(\);return\}/);
  assert.match(page, /await act\('MOVE_ITEM'/);
  assert.match(page, /Saved locally/);
  assert.match(page, /Local save failed/);
  assert.match(page, /Browser-local draft/);
  assert.match(page, /paletteFab/);
  assert.match(page, /palette-color-safe/);
  assert.match(page, /palette-high-contrast/);
});

test('decision labels, process frames and containment use presentation affordances without inventing new semantics', () => {
  assert.match(page, /shape-label/);
  assert.match(page, /\.shape\.DIAMOND::before/);
  assert.match(page, /--diamond-stroke/);
  assert.match(page, /inset:1px/);
  assert.match(page, /\.shape\.DIAMOND \.shape-label/);
  assert.match(page, /FRAME \.shape-label/);
  assert.match(page, /containment-select/);
  assert.match(page, /'SET_CONTAINMENT'/);
  assert.match(page, /parentProjectionItemRefOrNull/);
  assert.match(page, /contained-marker/);
  assert.match(page, /canvas-boundary-label/);
});

test('complex graph presentation renders relationship direction, labels, role markers and branch cues', () => {
  assert.match(page, /marker-end/);
  assert.match(page, /vexboard-arrow/);
  assert.match(page, /edge-label/);
  assert.match(page, /Presentation\.semanticRole/);
  assert.match(page, /Presentation\.deriveBranchPresentation/);
  assert.match(page, /role-marker/);
  assert.match(page, /branch-marker/);
  assert.match(page, /kind-marker/);
  assert.doesNotMatch(page, /method:\s*['"](?:POST|PUT|PATCH|DELETE)['"]/i);
});

// [VXG RealForever][VEXWORK][VEXBOARD][UI-PROOF]

test('BoardJourney UI keeps semantic walk state distinct from camera navigation and exposes bounded history controls', () => {
  assert.match(page, /BoardJourney · semantic walk/);
  assert.match(page, /Start journey here/);
  assert.match(page, /Clear journey/);
  assert.match(page, /function clearJourney\(\)\{journey=null;journeyPathwayAnalysis=null;interactionTrail=\[\]/);
  assert.match(page, /Board\.createBoardJourney/);
  assert.match(page, /Board\.advanceBoardJourney/);
  assert.match(page, /Board\.backBoardJourney/);
  assert.match(page, /Board\.revisitBoardJourney/);
  assert.match(page, /Board\.journeyChoices/);
  assert.match(page, /navigationKind/);
  assert.doesNotMatch(page, /method:\s*['"](?:POST|PUT|PATCH|DELETE)['"]/i);
});


test('Calculate pathways derives a reduction snapshot without rewriting raw BoardJourney truth', () => {
  assert.equal(typeof Reader.calculateBoardJourneyPathways, 'function');
  assert.match(page, /Calculate pathways/);
  assert.match(page, /Pathway reduction/);
  assert.match(page, /Reduced walk snapshot/);
  assert.match(page, /repeated reduction candidate\(s\)/);

  const calculateOwner = page.split('\n').find((line) => line.includes('function calculateJourneyPathways('));
  assert.ok(calculateOwner);
  assert.match(calculateOwner, /journeyPathwayAnalysis=Board\.calculateBoardJourneyPathways\(current\.graph,journey/);
  assert.doesNotMatch(calculateOwner, /journey=/);

  const applyJourneyOwner = page.split('\n').find((line) => line.includes('function applyJourney('));
  assert.ok(applyJourneyOwner);
  assert.match(applyJourneyOwner, /journeyPathwayAnalysis=null/);

  const pathwayStart = page.indexOf('if(journeyPathwayAnalysis){');
  const pathwayEnd = page.indexOf("if(!choices.length)jg.append", pathwayStart);
  assert.ok(pathwayStart >= 0 && pathwayEnd > pathwayStart);
  const pathwayOwner = page.slice(pathwayStart, pathwayEnd);
  assert.match(pathwayOwner, /setInspectorReveal\(\{semanticRefs:motif\.semanticRefs,relationshipRefs:motif\.relationshipRefs\}\)/);
  assert.match(pathwayOwner, /motif\.occurrenceCount>1\?' · reduction candidate'/);
  assert.doesNotMatch(pathwayOwner, /Board\.applyBoardControl|CONNECT_NODES|\bact\(/);

  const snapshotOwner = page.split('\n').find((line) => line.includes('function snapshotCurrent()'));
  assert.ok(snapshotOwner);
  assert.match(snapshotOwner, /journeyPathwayAnalysis/);
  assert.doesNotMatch(page, /localStorage\.(?:setItem|getItem)\([^)]*pathway/i);
});
test('Context Inspector refs reveal matching canvas objects and relationships without semantic mutation', () => {
  assert.match(page, /function inspectorRefToken\(/);
  assert.match(page, /function setInspectorReveal\(/);
  assert.match(page, /function clearInspectorReveal\(/);
  assert.match(page, /Hover or focus to reveal on canvas/);
  assert.match(page, /dataset\.semanticRef=n\.nodeRef/);
  assert.match(page, /dataset\.projectionItemRef=i\.projectionItemRef/);
  assert.match(page, /l\.dataset\.relationshipRef=r\.relationshipRef/);
  assert.match(page, /label\.dataset\.relationshipRef=r\.relationshipRef/);
  assert.match(page, /\.shape\.inspector-reveal/);
  assert.match(page, /\.edge\.inspector-reveal/);
  assert.match(page, /inspectorRefToken\(r\.relationshipRef,\{semanticRefs:\[r\.fromRef,r\.toRef\],relationshipRefs:\[r\.relationshipRef\]\}\)/);
  assert.match(page, /inspectorRefToken\(value\.nodeRef,\{semanticRefs:\[value\.nodeRef\]\}\)/);
  assert.match(page, /token\.onmouseenter=reveal;token\.onfocus=reveal;token\.onmouseleave=clearInspectorReveal;token\.onblur=clearInspectorReveal/);
  assert.doesNotMatch(page, /'SET_CONTAINMENT'.*inspector-reveal/s);
});

test('right-click pin focus is browser-local diagnostic state over bounded relational queries', () => {
  assert.match(page, /let pinnedSemanticRefs=new Set\(\),relationalFocusMode='CONNECT',pinMenuEl=null/);
  assert.match(page, /function currentRelationalFocus\(\)/);
  assert.match(page, /Board\.queryBoardRelationalFocus\(current/);
  assert.match(page, /s\.oncontextmenu=\(e\)=>\{e\.preventDefault\(\);e\.stopPropagation\(\)/);
  assert.match(page, /Pin identity/);
  assert.match(page, /Unpin identity/);
  assert.match(page, /Trace upstream/);
  assert.match(page, /Trace downstream/);
  assert.match(page, /Occurrences only/);
  assert.match(page, /Pinned relational focus/);
  assert.match(page, /pin-seed/);
  assert.match(page, /pin-focus/);
  assert.match(page, /pin-muted/);
  assert.match(page, /pinnedSemanticRefs:\[\.\.\.pinnedSemanticRefs\]/);
  assert.doesNotMatch(page, /localStorage\.(?:setItem|getItem)\([^)]*pin/i);
  const togglePinOwner = page.split('\n').find((line) => line.includes('function togglePinnedSemanticRef('));
  assert.ok(togglePinOwner);
  assert.match(togglePinOwner, /pinnedSemanticRefs/);
  assert.match(togglePinOwner, /renderWorkspace\(\)/);
  assert.doesNotMatch(togglePinOwner, /CONNECT_NODES|Board\.applyBoardControl|\bact\(/);

  const openPinStart = page.indexOf('function openPinMenu(');
  const openPinEnd = page.indexOf("document.addEventListener('pointerdown'", openPinStart);
  assert.ok(openPinStart >= 0 && openPinEnd > openPinStart);
  const openPinOwner = page.slice(openPinStart, openPinEnd);
  assert.match(openPinOwner, /togglePinnedSemanticRef\(semanticRef\)/);
  assert.doesNotMatch(openPinOwner, /CONNECT_NODES|Board\.applyBoardControl|\bact\(/);

  const contextMenuOwner = page.split('\n').find((line) => line.includes('s.oncontextmenu='));
  assert.ok(contextMenuOwner);
  assert.match(contextMenuOwner, /selected=i\.projectionItemRef/);
  const pinCall = contextMenuOwner.match(/openPinMenu\(([^)]*)\)/);
  assert.ok(pinCall);
  assert.equal(pinCall[1], 'e.clientX,e.clientY,n.nodeRef');
  assert.doesNotMatch(pinCall[1], /n\.label|projectionItemRef/);
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
  const returnBoardLine = page.split('\n').find((line) => line.includes('function returnBoard()'));
  assert.ok(returnBoardLine);
  for (const field of ['interactionTrail', 'activeBoardRef', 'draftDirty', 'saveMessage']) {
    assert.match(returnBoardLine, new RegExp(field));
  }
});
test('VexStream living Blueprint is source-discoverable and Inspector consumes BoardEvidence without inventing observed proof', () => {
  assert.match(page, /Open VexStream living Blueprint/);
  assert.match(page, /board\.vexstream\.phone-desktop-connection\.living-blueprint/);
  assert.match(page, /vexboard-evidence\.mjs/);
  assert.match(page, /Evidence\.normalizeBoardEvidence/);
  assert.match(page, /Evidence\.evidenceForSemanticRef/);
  assert.match(page, /Evidence · expected \/ observed/);
  assert.match(page, /Expected slot only · no artifact admitted yet\./);
});



test('swimlane journey view prioritizes the product path while preserving full relationships in Inspector', () => {
  assert.match(page, /relationshipViewMode/);
  assert.match(page, /Presentation\.defaultRelationshipViewMode/);
  assert.match(page, /Presentation\.relationshipVisibleInMode/);
  assert.match(page, /Presentation\.relationshipRoute/);
  assert.match(page, /Journey edges/);
  assert.match(page, /All relationships/);
  assert.match(page, /createElementNS\('http:\/\/www\.w3\.org\/2000\/svg','polyline'\)/);
  assert.match(page, /nested-control/);
  assert.match(page, /has-contained-children/);
  assert.match(page, /openCatalogBoard\(detailBoardRef,\{pushCurrent:true\}\)/);
});

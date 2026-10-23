import { verifySemanticFingerprint, withSemanticFingerprint } from './semantic.mjs';
import {
  BOARD_CONTROL_SCHEMA,
  BOARD_GRAPH_SCHEMA,
  BOARD_PROJECTION_SCHEMA,
  applyBoardAct,
  normalizeBoardControl,
  normalizeBoardGraph,
  normalizeBoardProjection,
} from '../shared/vexboard-model.mjs';

export const BOARD_OPERATION_RESULT_SCHEMA = 'vexboard.board-operation-result/v1';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function stripFingerprint(value) {
  const copy = structuredClone(value);
  delete copy.semanticFingerprint;
  return copy;
}

export function createBoardGraph(input) {
  if (input?.semanticFingerprint !== undefined) {
    assert(verifySemanticFingerprint(input), 'BoardGraph semanticFingerprint mismatch');
  }
  return withSemanticFingerprint(normalizeBoardGraph(stripFingerprint(input)));
}

export function createBoardProjection(input, graphInput) {
  const graph = createBoardGraph(graphInput);
  if (input?.semanticFingerprint !== undefined) {
    assert(verifySemanticFingerprint(input), 'BoardProjection semanticFingerprint mismatch');
  }
  return withSemanticFingerprint(normalizeBoardProjection(stripFingerprint(input), stripFingerprint(graph)));
}

export function applyBoardControl({ graph: graphInput, projection: projectionInput, control: controlInput }) {
  const graph = createBoardGraph(graphInput);
  const projection = createBoardProjection(projectionInput, graph);
  const control = normalizeBoardControl(controlInput);
  assert(control.schemaVersion === BOARD_CONTROL_SCHEMA, 'BoardControl schema mismatch');
  assert(graph.schemaVersion === BOARD_GRAPH_SCHEMA, 'BoardGraph schema mismatch');
  assert(projection.schemaVersion === BOARD_PROJECTION_SCHEMA, 'BoardProjection schema mismatch');
  assert(control.expectedGraphFingerprint === graph.semanticFingerprint, 'stale BoardGraph observation');
  assert(control.expectedProjectionFingerprint === projection.semanticFingerprint, 'stale BoardProjection observation');

  const result = applyBoardAct({
    graph: stripFingerprint(graph),
    projection: stripFingerprint(projection),
    act: control.act,
    arguments: control.arguments,
  });
  const nextGraph = createBoardGraph(result.graph);
  const nextProjection = createBoardProjection(result.projection, nextGraph);
  return Object.freeze({
    schemaVersion: BOARD_OPERATION_RESULT_SCHEMA,
    controlRef: control.controlRef,
    actorRef: control.actorRef,
    act: control.act,
    priorGraphFingerprint: graph.semanticFingerprint,
    nextGraphFingerprint: nextGraph.semanticFingerprint,
    priorProjectionFingerprint: projection.semanticFingerprint,
    nextProjectionFingerprint: nextProjection.semanticFingerprint,
    graph: nextGraph,
    projection: nextProjection,
    effects: result.effects,
  });
}

// [VXG RealForever][VEXWORK][VEXBOARD][CORE]

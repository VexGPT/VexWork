import { verifySemanticFingerprint, withSemanticFingerprint } from './semantic.mjs';
import { TRANSITION_SCHEMA, createWorkItem, createWorkgraph } from './workgraph.mjs';

export const WORKGRAPH_COMPOSITION_SCHEMA = 'vexwork.workgraph-composition/v1';
export const WORKGRAPH_SEGMENT_SCHEMA = 'vexwork.workgraph-segment/v1';
export const WORKGRAPH_COMPOSITION_RESULT_SCHEMA = 'vexwork.workgraph-composition-result/v1';

const REF = /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/u;
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/u;

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function stableRef(value, label) {
  assert(typeof value === 'string' && REF.test(value), `${label} must be one stable ref`);
  return value;
}

function refs(values, label) {
  assert(Array.isArray(values), `${label} must be an array`);
  const result = values.map((value, index) => stableRef(value, `${label}[${index}]`));
  assert(new Set(result).size === result.length, `${label} must be unique`);
  return result;
}

function timestamp(value, label) {
  assert(typeof value === 'string' && ISO.test(value) && new Date(value).toISOString() === value, `${label} must be canonical UTC ISO`);
  return value;
}

function validateStoredFingerprintIfPresent(value, label) {
  if (value?.semanticFingerprint !== undefined) {
    assert(verifySemanticFingerprint(value), `${label} semanticFingerprint mismatch`);
  }
}

export function createWorkgraphComposition(input) {
  validateStoredFingerprintIfPresent(input, 'Workgraph Composition');
  assert(input?.schemaVersion === WORKGRAPH_COMPOSITION_SCHEMA, 'Workgraph Composition schema mismatch');
  stableRef(input.compositionRef, 'compositionRef');
  stableRef(input.graphRef, 'graphRef');
  refs(input.sourceRefs, 'sourceRefs');
  timestamp(input.formedAt, 'formedAt');
  return withSemanticFingerprint(input);
}

export function createWorkgraphSegment(input, registry) {
  validateStoredFingerprintIfPresent(input, 'Workgraph Segment');
  assert(input?.schemaVersion === WORKGRAPH_SEGMENT_SCHEMA, 'Workgraph Segment schema mismatch');
  stableRef(input.segmentRef, 'segmentRef');
  stableRef(input.graphRef, 'graphRef');
  refs(input.sourceRefs, 'sourceRefs');
  timestamp(input.formedAt, 'formedAt');
  assert(Array.isArray(input.items) && input.items.length > 0, 'Workgraph Segment items required');
  assert(Array.isArray(input.transitions), 'Workgraph Segment transitions must be an array');

  const items = input.items.map((item) => createWorkItem(item, registry));
  const localWorkRefs = new Set(items.map((item) => item.workRef));
  assert(localWorkRefs.size === items.length, `duplicate workRef inside segment ${input.segmentRef}`);

  for (const item of items) {
    if (item.parentWorkRefOrNull !== null) {
      assert(
        localWorkRefs.has(item.parentWorkRefOrNull),
        `segment containment must remain local: ${item.workRef} -> ${item.parentWorkRefOrNull}`,
      );
    }
  }

  const transitionRefs = new Set();
  const transitions = input.transitions.map((transition) => {
    validateStoredFingerprintIfPresent(transition, 'Workgraph Segment transition');
    assert(transition?.schemaVersion === TRANSITION_SCHEMA, 'Workgraph Segment transition schema mismatch');
    stableRef(transition.transitionRef, 'transitionRef');
    stableRef(transition.workRef, 'transition.workRef');
    assert(localWorkRefs.has(transition.workRef), `segment transition work must be locally owned: ${transition.workRef}`);
    assert(!transitionRefs.has(transition.transitionRef), `duplicate transitionRef inside segment ${transition.transitionRef}`);
    transitionRefs.add(transition.transitionRef);
    return transition;
  });

  const core = { ...input, items, transitions };
  delete core.semanticFingerprint;
  return withSemanticFingerprint(core);
}

export function composeWorkgraph({ composition, segments, registry }) {
  composition = createWorkgraphComposition(composition);
  assert(Array.isArray(segments) && segments.length > 0, 'Workgraph composition segments required');

  const acceptedSegments = segments.map((segment) => createWorkgraphSegment(segment, registry));
  const segmentRefs = acceptedSegments.map((segment) => segment.segmentRef);
  assert(new Set(segmentRefs).size === segmentRefs.length, 'Workgraph segmentRef must be unique');

  for (const segment of acceptedSegments) {
    assert(segment.graphRef === composition.graphRef, `segment graphRef mismatch: ${segment.segmentRef}`);
  }

  const workOwners = new Map();
  const transitionRefs = new Set();
  const transitionsByWork = new Map();

  for (const segment of acceptedSegments) {
    for (const item of segment.items) {
      assert(!workOwners.has(item.workRef), `workRef belongs to more than one segment: ${item.workRef}`);
      workOwners.set(item.workRef, segment.segmentRef);
    }
    for (const transition of segment.transitions) {
      assert(!transitionRefs.has(transition.transitionRef), `transitionRef belongs to more than one segment: ${transition.transitionRef}`);
      transitionRefs.add(transition.transitionRef);
      if (!transitionsByWork.has(transition.workRef)) transitionsByWork.set(transition.workRef, []);
      transitionsByWork.get(transition.workRef).push(transition);
    }
  }

  const items = acceptedSegments
    .flatMap((segment) => segment.items)
    .sort((left, right) => left.workRef.localeCompare(right.workRef));

  const transitions = [...transitionsByWork.keys()]
    .sort()
    .flatMap((workRef) => transitionsByWork.get(workRef));

  const rootWorkRefs = items
    .filter((item) => item.parentWorkRefOrNull === null)
    .map((item) => item.workRef)
    .sort();

  const sourceRefs = [...new Set([
    ...composition.sourceRefs,
    ...acceptedSegments.flatMap((segment) => segment.sourceRefs),
  ])].sort();

  const graph = createWorkgraph({
    schemaVersion: 'vexwork.workgraph/v1',
    graphRef: composition.graphRef,
    rootWorkRefs,
    items,
    transitions,
    sourceRefs,
    formedAt: composition.formedAt,
  }, registry);

  return Object.freeze({
    schemaVersion: WORKGRAPH_COMPOSITION_RESULT_SCHEMA,
    compositionRef: composition.compositionRef,
    segmentRefs: Object.freeze([...segmentRefs].sort()),
    graph,
    effects: false,
    executionAuthority: 'NONE',
  });
}

// [VXG RealForever][VEXWORK][WORKGRAPH-COMPOSITION]

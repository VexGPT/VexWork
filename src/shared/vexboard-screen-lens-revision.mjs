import { normalizeScreenLens } from './vexboard-screen-lens.mjs';

export const SCREEN_LENS_REVISION_COMPARISON_SCHEMA = 'vexboard.screen-lens-revision-comparison/v1';

function freeze(value) {
  if (Array.isArray(value)) {
    for (const child of value) freeze(child);
    return Object.freeze(value);
  }
  if (value && typeof value === 'object') {
    for (const child of Object.values(value)) freeze(child);
    return Object.freeze(value);
  }
  return value;
}

function compareText(left, right) {
  return String(left).localeCompare(String(right));
}

function stable(value) {
  return JSON.stringify(value);
}

function entityDiff(leftItems, rightItems, refFor) {
  const left = new Map(leftItems.map((item) => [refFor(item), item]));
  const right = new Map(rightItems.map((item) => [refFor(item), item]));
  const refs = [...new Set([...left.keys(), ...right.keys()])].sort(compareText);
  const added = [];
  const removed = [];
  const changed = [];
  const unchanged = [];

  for (const ref of refs) {
    if (!left.has(ref)) added.push(ref);
    else if (!right.has(ref)) removed.push(ref);
    else if (stable(left.get(ref)) !== stable(right.get(ref))) changed.push(ref);
    else unchanged.push(ref);
  }

  return freeze({ added, removed, changed, unchanged });
}

function stringSetDiff(leftValues, rightValues) {
  const left = new Set(leftValues);
  const right = new Set(rightValues);
  return freeze({
    added: [...right].filter((value) => !left.has(value)).sort(compareText),
    removed: [...left].filter((value) => !right.has(value)).sort(compareText),
    unchanged: [...left].filter((value) => right.has(value)).sort(compareText),
  });
}

function screenMetadata(lens) {
  return lens.screens.map(({ elements, ...screen }) => screen);
}

function chromeMetadata(lens) {
  return lens.chrome.map(({ elements, ...chrome }) => chrome);
}

function elements(lens) {
  return [
    ...lens.chrome.flatMap((owner) => owner.elements.map((element) => ({ ...element, ownerRef: owner.chromeRef }))),
    ...lens.screens.flatMap((owner) => owner.elements.map((element) => ({ ...element, ownerRef: owner.screenRef }))),
  ];
}

function sourceBinding(snapshot) {
  return {
    repositoryRef: snapshot.repositoryRef,
    repositoryUrl: snapshot.repositoryUrl,
    roots: snapshot.roots,
  };
}

function changedCount(diff) {
  return diff.added.length + diff.removed.length + diff.changed.length;
}

export function compareScreenLensRevisions(baseInput, nextInput) {
  const base = normalizeScreenLens(baseInput);
  const next = normalizeScreenLens(nextInput);
  if (base.lensRef !== next.lensRef) {
    throw new TypeError(`Screen Lens revision comparison requires one lensRef: ${base.lensRef} != ${next.lensRef}`);
  }

  const chrome = entityDiff(chromeMetadata(base), chromeMetadata(next), (entry) => entry.chromeRef);
  const screens = entityDiff(screenMetadata(base), screenMetadata(next), (entry) => entry.screenRef);
  const elementDiff = entityDiff(elements(base), elements(next), (entry) => entry.ref);
  const pathways = entityDiff(base.pathways, next.pathways, (entry) => entry.pathwayRef);
  const annotations = entityDiff(base.annotations, next.annotations, (entry) => entry.ref);
  const relatedBoards = stringSetDiff(base.relatedBoardRefs, next.relatedBoardRefs);

  const entityChangeCount = [chrome, screens, elementDiff, pathways, annotations]
    .reduce((sum, diff) => sum + changedCount(diff), 0);
  const relatedBoardChangeCount = relatedBoards.added.length + relatedBoards.removed.length;

  return freeze({
    schemaVersion: SCREEN_LENS_REVISION_COMPARISON_SCHEMA,
    lensRef: base.lensRef,
    base: {
      sourceCommit: base.sourceSnapshot.commit,
      observedAt: base.sourceSnapshot.observedAt,
    },
    next: {
      sourceCommit: next.sourceSnapshot.commit,
      observedAt: next.sourceSnapshot.observedAt,
    },
    sourceRevisionChanged: base.sourceSnapshot.commit !== next.sourceSnapshot.commit,
    sourceBindingChanged: stable(sourceBinding(base.sourceSnapshot)) !== stable(sourceBinding(next.sourceSnapshot)),
    projectionChanged: entityChangeCount > 0 || relatedBoardChangeCount > 0,
    relatedBoards,
    chrome,
    screens,
    elements: elementDiff,
    pathways,
    annotations,
    summary: {
      entityChangeCount,
      relatedBoardChangeCount,
      changedScreenCount: changedCount(screens),
      changedElementCount: changedCount(elementDiff),
      changedPathwayCount: changedCount(pathways),
    },
  });
}

function fieldChanges(left, right, ignore = []) {
  const keys = [...new Set([...Object.keys(left ?? {}), ...Object.keys(right ?? {})])].filter((key) => !ignore.includes(key)).sort(compareText);
  return keys.filter((key) => stable(left?.[key] ?? null) !== stable(right?.[key] ?? null));
}

// Detail for one pathway that compareScreenLensRevisions reported as changed: which steps and
// relationships moved, and which fields of each changed step differ. Either side may be missing
// (the pathway was added or removed); both missing is a caller error.
export function comparePathwayRevision(basePathway, nextPathway) {
  if (!basePathway && !nextPathway) throw new TypeError('comparePathwayRevision needs at least one pathway');
  const pathwayRef = (basePathway ?? nextPathway).pathwayRef;
  if (basePathway && nextPathway && basePathway.pathwayRef !== nextPathway.pathwayRef) {
    throw new TypeError(`comparePathwayRevision requires one pathwayRef: ${basePathway.pathwayRef} != ${nextPathway.pathwayRef}`);
  }
  const baseNodes = basePathway?.nodes ?? [];
  const nextNodes = nextPathway?.nodes ?? [];
  const nodes = entityDiff(baseNodes, nextNodes, (node) => node.ref);
  const edgeRef = (edge) => `${edge.from}->${edge.to}|${edge.kind ?? 'FLOW'}`;
  const edges = entityDiff(basePathway?.edges ?? [], nextPathway?.edges ?? [], edgeRef);
  const baseByRef = new Map(baseNodes.map((node) => [node.ref, node]));
  const nextByRef = new Map(nextNodes.map((node) => [node.ref, node]));
  return freeze({
    pathwayRef,
    status: !basePathway ? 'ADDED' : !nextPathway ? 'REMOVED' : 'CHANGED',
    fields: basePathway && nextPathway ? fieldChanges(basePathway, nextPathway, ['nodes', 'edges']) : [],
    nodes,
    nodeChanges: nodes.changed.map((ref) => ({ ref, fields: fieldChanges(baseByRef.get(ref), nextByRef.get(ref)) })),
    edges,
  });
}

// [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-LENS][REVISION-COMPARISON]

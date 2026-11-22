import {
  componentForOccurrence,
  normalizeComponentInventory,
} from './vexboard-component-inventory.mjs';
import {
  candidatesForSourceFamily,
  normalizeComponentArchitectureCatalog,
  targetRealizations,
} from './vexboard-component-architecture.mjs';

export const COMPONENT_STUDIO_BLUEPRINT_SCHEMA = 'vexboard.component-studio-blueprint/v1';
export const STUDIO_CONSTRUCTION_DISPOSITIONS = Object.freeze([
  'PORTABLE_RELATIONSHIP_AVAILABLE',
  'PORTABILITY_HELD',
  'SOURCE_BOUND',
]);

function fail(message) {
  throw new TypeError('component studio: ' + message);
}
function text(value, label) {
  if (typeof value !== 'string' || !value.trim()) fail(label + ' is required');
  return value.trim();
}
function optionalText(value, label) {
  if (value === undefined || value === null || value === '') return null;
  return text(value, label);
}
function integer(value, label) {
  if (!Number.isInteger(value) || value < 0) fail(label + ' must be a non-negative integer');
  return value;
}
function unique(values) {
  return [...new Set(values.filter((value) => value !== null && value !== undefined && value !== ''))].sort();
}
function freezeDeep(value) {
  if (Array.isArray(value)) value.forEach(freezeDeep);
  else if (value && typeof value === 'object') Object.values(value).forEach(freezeDeep);
  return Object.freeze(value);
}
function constructionDisposition(accepted, held) {
  if (accepted.length) return 'PORTABLE_RELATIONSHIP_AVAILABLE';
  if (held.length) return 'PORTABILITY_HELD';
  return 'SOURCE_BOUND';
}
function nodeSummary(nodes) {
  return {
    nodeCount: nodes.length,
    portableRelationshipAvailableCount: nodes.filter((node) => node.portable.disposition === 'PORTABLE_RELATIONSHIP_AVAILABLE').length,
    portabilityHeldCount: nodes.filter((node) => node.portable.disposition === 'PORTABILITY_HELD').length,
    sourceBoundCount: nodes.filter((node) => node.portable.disposition === 'SOURCE_BOUND').length,
  };
}
function normalizeStudioNode(input) {
  const nodeRef = text(input?.nodeRef, 'nodeRef');
  const parentNodeRefOrNull = optionalText(input.parentNodeRefOrNull, nodeRef + ' parentNodeRefOrNull');
  const siblingOrder = integer(input.siblingOrder, nodeRef + ' siblingOrder');
  const source = input.source ?? {};
  const presentation = input.presentation ?? {};
  const relationships = input.relationships ?? {};
  const portable = input.portable ?? {};
  const disposition = text(portable.disposition, nodeRef + ' portable.disposition');
  if (!STUDIO_CONSTRUCTION_DISPOSITIONS.includes(disposition)) {
    fail(nodeRef + ' portable disposition is invalid');
  }
  return {
    nodeRef,
    parentNodeRefOrNull,
    siblingOrder,
    source: {
      subjectRef: text(source.subjectRef, nodeRef + ' source.subjectRef'),
      buildRef: text(source.buildRef, nodeRef + ' source.buildRef'),
      repositoryRef: text(source.repositoryRef, nodeRef + ' source.repositoryRef'),
      commit: text(source.commit, nodeRef + ' source.commit'),
      componentRef: text(source.componentRef, nodeRef + ' source.componentRef'),
      occurrenceRef: text(source.occurrenceRef, nodeRef + ' source.occurrenceRef'),
      screenRefOrNull: optionalText(source.screenRefOrNull, nodeRef + ' source.screenRefOrNull'),
      surfaceRef: text(source.surfaceRef, nodeRef + ' source.surfaceRef'),
      elementRef: text(source.elementRef, nodeRef + ' source.elementRef'),
      kind: text(source.kind, nodeRef + ' source.kind'),
      label: text(source.label, nodeRef + ' source.label'),
      sourcePathOrNull: optionalText(source.sourcePathOrNull, nodeRef + ' source.sourcePathOrNull'),
    },
    presentation: {
      styleOrNull: optionalText(presentation.styleOrNull, nodeRef + ' presentation.styleOrNull'),
      slotOrNull: optionalText(presentation.slotOrNull, nodeRef + ' presentation.slotOrNull'),
      layerOrNull: optionalText(presentation.layerOrNull, nodeRef + ' presentation.layerOrNull'),
      textRoleOrNull: optionalText(presentation.textRoleOrNull, nodeRef + ' presentation.textRoleOrNull'),
      iconOrNull: optionalText(presentation.iconOrNull, nodeRef + ' presentation.iconOrNull'),
      interactions: unique(Array.isArray(presentation.interactions) ? presentation.interactions.map(String) : []),
      localizationSourceStringRefs: unique(Array.isArray(presentation.localizationSourceStringRefs) ? presentation.localizationSourceStringRefs.map(String) : []),
      accessibilityState: text(presentation.accessibilityState, nodeRef + ' presentation.accessibilityState'),
    },
    relationships: {
      semanticRole: text(relationships.semanticRole, nodeRef + ' relationships.semanticRole'),
      parentElementRefOrNull: optionalText(relationships.parentElementRefOrNull, nodeRef + ' relationships.parentElementRefOrNull'),
      childElementRefs: unique(Array.isArray(relationships.childElementRefs) ? relationships.childElementRefs.map(String) : []),
      intentOrNull: optionalText(relationships.intentOrNull, nodeRef + ' relationships.intentOrNull'),
      actionKeyOrNull: optionalText(relationships.actionKeyOrNull, nodeRef + ' relationships.actionKeyOrNull'),
      callOrNull: optionalText(relationships.callOrNull, nodeRef + ' relationships.callOrNull'),
      pathwayRefOrNull: optionalText(relationships.pathwayRefOrNull, nodeRef + ' relationships.pathwayRefOrNull'),
      navigatesToOrNull: optionalText(relationships.navigatesToOrNull, nodeRef + ' relationships.navigatesToOrNull'),
      visibleWhenOrNull: optionalText(relationships.visibleWhenOrNull, nodeRef + ' relationships.visibleWhenOrNull'),
      alwaysVisible: relationships.alwaysVisible === true,
      presenceRefs: unique(Array.isArray(relationships.presenceRefs) ? relationships.presenceRefs.map(String) : []),
      conditionRefs: unique(Array.isArray(relationships.conditionRefs) ? relationships.conditionRefs.map(String) : []),
    },
    portable: {
      disposition,
      acceptedCandidateRefs: unique(Array.isArray(portable.acceptedCandidateRefs) ? portable.acceptedCandidateRefs.map(String) : []),
      heldCandidateRefs: unique(Array.isArray(portable.heldCandidateRefs) ? portable.heldCandidateRefs.map(String) : []),
      targetRealizationRefs: unique(Array.isArray(portable.targetRealizationRefs) ? portable.targetRealizationRefs.map(String) : []),
    },
  };
}

export function studioNodeFromOccurrence({
  nodeRef,
  inventory,
  occurrenceRef,
  architectureCatalog,
  parentNodeRefOrNull = null,
  siblingOrder = 0,
}) {
  inventory = normalizeComponentInventory(inventory);
  const architecture = normalizeComponentArchitectureCatalog(architectureCatalog);
  const occurrence = inventory.occurrences.find((row) => row.occurrenceRef === occurrenceRef);
  if (!occurrence) fail('unknown occurrence ' + occurrenceRef);
  const component = componentForOccurrence(inventory, occurrenceRef);
  const candidates = candidatesForSourceFamily(architecture, component.componentRef);
  const accepted = candidates.filter((row) => row.state === 'ACCEPTED_PORTABLE' && row.formation?.state === 'ACCEPTED');
  const held = candidates.filter((row) => row.state === 'HELD' || row.formation?.state === 'HELD');
  const acceptedRefs = accepted.map((row) => row.candidateRef);
  const heldRefs = held.map((row) => row.candidateRef);
  const realizationRefs = targetRealizations(architecture)
    .filter((row) => acceptedRefs.includes(row.candidateRef))
    .map((row) => row.realizationRef);
  return freezeDeep(normalizeStudioNode({
    nodeRef,
    parentNodeRefOrNull,
    siblingOrder,
    source: {
      subjectRef: inventory.subjectRef,
      buildRef: inventory.buildRef,
      repositoryRef: inventory.sourceSnapshot.repositoryRef,
      commit: inventory.sourceSnapshot.commit,
      componentRef: component.componentRef,
      occurrenceRef: occurrence.occurrenceRef,
      screenRefOrNull: occurrence.screenRef,
      surfaceRef: occurrence.surfaceRef,
      elementRef: occurrence.elementRef,
      kind: occurrence.kind,
      label: occurrence.label,
      sourcePathOrNull: occurrence.sourcePath,
    },
    presentation: {
      styleOrNull: occurrence.style,
      slotOrNull: occurrence.slot,
      layerOrNull: occurrence.layer,
      textRoleOrNull: occurrence.textRole,
      iconOrNull: occurrence.icon,
      interactions: occurrence.interactions,
      localizationSourceStringRefs: occurrence.localization.sourceStringRefs,
      accessibilityState: occurrence.accessibility.state,
    },
    relationships: {
      semanticRole: occurrence.semanticRole,
      parentElementRefOrNull: occurrence.parentElementRef,
      childElementRefs: occurrence.childElementRefs,
      intentOrNull: occurrence.intent,
      actionKeyOrNull: occurrence.actionKey,
      callOrNull: occurrence.call,
      pathwayRefOrNull: occurrence.pathwayRef,
      navigatesToOrNull: occurrence.navigatesTo,
      visibleWhenOrNull: occurrence.visibleWhen,
      alwaysVisible: occurrence.alwaysVisible,
      presenceRefs: occurrence.realization.presenceRefs,
      conditionRefs: occurrence.realization.conditionRefs,
    },
    portable: {
      disposition: constructionDisposition(accepted, held),
      acceptedCandidateRefs: acceptedRefs,
      heldCandidateRefs: heldRefs,
      targetRealizationRefs: realizationRefs,
    },
  }));
}

export function createStudioBlueprint({ blueprintRef, label, nodes }) {
  blueprintRef = text(blueprintRef, 'blueprintRef');
  label = text(label, 'label');
  if (!Array.isArray(nodes)) fail('nodes must be an array');
  const normalized = nodes.map(normalizeStudioNode);
  const byRef = new Map();
  for (const node of normalized) {
    if (byRef.has(node.nodeRef)) fail('duplicate node ' + node.nodeRef);
    byRef.set(node.nodeRef, node);
  }
  for (const node of normalized) {
    if (node.parentNodeRefOrNull && !byRef.has(node.parentNodeRefOrNull)) {
      fail(node.nodeRef + ' references missing parent ' + node.parentNodeRefOrNull);
    }
    if (node.parentNodeRefOrNull === node.nodeRef) fail(node.nodeRef + ' cannot parent itself');
    const seen = new Set([node.nodeRef]);
    let cursor = node.parentNodeRefOrNull ? byRef.get(node.parentNodeRefOrNull) : null;
    while (cursor) {
      if (seen.has(cursor.nodeRef)) fail('composition cycle at ' + node.nodeRef);
      seen.add(cursor.nodeRef);
      cursor = cursor.parentNodeRefOrNull ? byRef.get(cursor.parentNodeRefOrNull) : null;
    }
  }
  const siblingKeys = new Set();
  for (const node of normalized) {
    const key = (node.parentNodeRefOrNull ?? 'ROOT') + '|' + node.siblingOrder;
    if (siblingKeys.has(key)) fail('duplicate sibling order ' + key);
    siblingKeys.add(key);
  }
  const ordered = [...normalized].sort((left, right) => {
    const lp = left.parentNodeRefOrNull ?? '';
    const rp = right.parentNodeRefOrNull ?? '';
    return lp.localeCompare(rp) || left.siblingOrder - right.siblingOrder || left.nodeRef.localeCompare(right.nodeRef);
  });
  const roots = ordered
    .filter((node) => node.parentNodeRefOrNull === null)
    .sort((a, b) => a.siblingOrder - b.siblingOrder || a.nodeRef.localeCompare(b.nodeRef))
    .map((node) => node.nodeRef);
  const sourceSnapshots = [...new Map(ordered.map((node) => [
    node.source.repositoryRef + '@' + node.source.commit,
    { repositoryRef: node.source.repositoryRef, commit: node.source.commit },
  ])).values()].sort((a, b) => a.repositoryRef.localeCompare(b.repositoryRef) || a.commit.localeCompare(b.commit));
  return freezeDeep({
    schemaVersion: COMPONENT_STUDIO_BLUEPRINT_SCHEMA,
    blueprintRef,
    label,
    aiRequired: false,
    effects: false,
    executionAuthority: 'NONE',
    rootNodeRefs: roots,
    sourceSnapshots,
    nodes: ordered,
    summary: nodeSummary(ordered),
  });
}

export function normalizeStudioBlueprint(input) {
  if (!input || input.schemaVersion !== COMPONENT_STUDIO_BLUEPRINT_SCHEMA) {
    fail('schemaVersion must be ' + COMPONENT_STUDIO_BLUEPRINT_SCHEMA);
  }
  if (input.aiRequired !== false) fail('aiRequired must be false');
  if (input.effects !== false || input.executionAuthority !== 'NONE') fail('Studio Blueprint is non-executing');
  const canonical = createStudioBlueprint({
    blueprintRef: input.blueprintRef,
    label: input.label,
    nodes: input.nodes,
  });
  if (JSON.stringify(canonical.rootNodeRefs) !== JSON.stringify(input.rootNodeRefs)) fail('rootNodeRefs disagree with nodes');
  if (JSON.stringify(canonical.sourceSnapshots) !== JSON.stringify(input.sourceSnapshots)) fail('sourceSnapshots disagree with nodes');
  if (JSON.stringify(canonical.summary) !== JSON.stringify(input.summary)) fail('summary disagrees with nodes');
  return canonical;
}

export function studioBlueprintBytes(input) {
  return JSON.stringify(normalizeStudioBlueprint(input), null, 2) + '\n';
}

// [VXG RealForever][VEXWORK][COMPONENT-LIBRARY][A5-STUDIO-BLUEPRINT]

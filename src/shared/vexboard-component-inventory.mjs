import { normalizeLocalizationInventory } from './vexboard-localization-inventory.mjs';
import { normalizeScreenLens } from './vexboard-screen-lens.mjs';

export const COMPONENT_INVENTORY_SCHEMA = 'vexboard.component-inventory/v1';
export const COMPONENT_MEANING_STATE = 'OBSERVED_SOURCE_FAMILY';
export const COMPONENT_PORTABILITY_STATE = 'UNCLASSIFIED';

function fail(message) {
  throw new TypeError('component inventory: ' + message);
}

function text(value, label) {
  if (typeof value !== 'string' || !value.trim()) fail(label + ' is required');
  return value;
}

function optionalText(value, label) {
  if (value === undefined || value === null) return null;
  return text(value, label);
}

function unique(values) {
  return [...new Set(values.filter((value) => value !== null && value !== undefined && value !== ''))].sort();
}

function freezeDeep(value) {
  if (Array.isArray(value)) value.forEach(freezeDeep);
  else if (value && typeof value === 'object') Object.values(value).forEach(freezeDeep);
  return Object.freeze(value);
}

function subjectSlug(subjectRef) {
  return text(subjectRef, 'subjectRef').replace(/^subject\./u, '').replace(/[^A-Za-z0-9._-]+/gu, '-').toLowerCase();
}

function familyRef(subjectRef, kind) {
  return 'component.source-family.' + subjectSlug(subjectRef) + '.' + String(kind).toLowerCase().replace(/_/gu, '-');
}

function occurrenceRef(subjectRef, elementRef) {
  return 'occurrence.component.' + subjectSlug(subjectRef) + '.' + String(elementRef).replace(/^element\./u, '').replace(/[^A-Za-z0-9._-]+/gu, '-');
}

function localizationByElement(localizationInventory) {
  const byElement = new Map();
  if (!localizationInventory) return byElement;
  for (const row of localizationInventory.occurrences) {
    if (!byElement.has(row.elementRef)) byElement.set(row.elementRef, []);
    byElement.get(row.elementRef).push(row.sourceStringRef);
  }
  for (const [ref, values] of byElement) byElement.set(ref, unique(values));
  return byElement;
}

function realizationByElement(screen) {
  return new Map((screen.realization?.elements ?? []).map((row) => [row.ref, row]));
}

function summarize(components, occurrences) {
  return {
    componentFamilyCount: components.length,
    occurrenceCount: occurrences.length,
    screenCount: unique(occurrences.map((row) => row.screenRef)).length,
    chromeOccurrenceCount: occurrences.filter((row) => row.surfaceKind === 'CHROME').length,
    localizedOccurrenceCount: occurrences.filter((row) => row.localization.sourceStringRefs.length > 0).length,
    realizedOccurrenceCount: occurrences.filter((row) => row.realization.realizedBy.length > 0 || row.realization.realizedIn.length > 0).length,
    accessibilityProjectedOccurrenceCount: occurrences.filter((row) => row.accessibility.state === 'OBSERVED').length,
  };
}

function familyFrom(kind, subjectRef, rows) {
  return {
    componentRef: familyRef(subjectRef, kind),
    kind,
    meaningState: COMPONENT_MEANING_STATE,
    portability: COMPONENT_PORTABILITY_STATE,
    occurrenceRefs: rows.map((row) => row.occurrenceRef).sort(),
    surfaceRefs: unique(rows.map((row) => row.surfaceRef)),
    screenRefs: unique(rows.map((row) => row.screenRef)),
    elementRefs: unique(rows.map((row) => row.elementRef)),
    styles: unique(rows.map((row) => row.style)),
    textRoles: unique(rows.map((row) => row.textRole)),
    slots: unique(rows.map((row) => row.slot)),
    sourcePaths: unique(rows.map((row) => row.sourcePath)),
    realizerSymbols: unique(rows.flatMap((row) => row.realization.realizedBy)),
    localizationSourceStringRefs: unique(rows.flatMap((row) => row.localization.sourceStringRefs)),
    accessibilityState: rows.some((row) => row.accessibility.state === 'OBSERVED') ? 'PARTIAL' : 'NOT_PROJECTED',
  };
}

export function createComponentInventory({
  inventoryRef,
  subjectRef,
  buildRef = 'main',
  lens,
  localizationInventory = null,
  producer,
}) {
  const normalizedLens = normalizeScreenLens(lens);
  const normalizedLocalization = localizationInventory ? normalizeLocalizationInventory(localizationInventory) : null;
  inventoryRef = text(inventoryRef, 'inventoryRef');
  subjectRef = text(subjectRef, 'subjectRef');
  buildRef = text(buildRef, 'buildRef');

  if (normalizedLocalization) {
    if (normalizedLocalization.subjectRef !== subjectRef) fail('Localization subject must match component subject');
    if (normalizedLocalization.buildRef !== buildRef) fail('Localization build must match component build');
    if (normalizedLocalization.sourceSnapshot.commit !== normalizedLens.sourceSnapshot.commit) fail('Localization and Screen Lens revisions must match');
  }

  const localized = localizationByElement(normalizedLocalization);
  const owners = [
    ...normalizedLens.chrome.map((entry) => ({
      surfaceKind: 'CHROME',
      surfaceRef: entry.chromeRef,
      screenRef: null,
      label: entry.label,
      source: entry.source,
      elements: entry.elements,
      realization: null,
    })),
    ...normalizedLens.screens.map((entry) => ({
      surfaceKind: 'SCREEN',
      surfaceRef: entry.screenRef,
      screenRef: entry.screenRef,
      label: entry.label,
      source: entry.source,
      elements: entry.elements,
      realization: entry,
    })),
  ];

  const occurrences = [];
  for (const owner of owners) {
    const children = new Map();
    for (const element of owner.elements) {
      const parent = element.parentRef ?? null;
      if (!children.has(parent)) children.set(parent, []);
      children.get(parent).push(element.ref);
    }
    const realized = owner.realization ? realizationByElement(owner.realization) : new Map();
    for (const element of owner.elements) {
      const realization = realized.get(element.ref) ?? null;
      const sourceStringRefs = localized.get(element.ref) ?? [];
      occurrences.push({
        occurrenceRef: occurrenceRef(subjectRef, element.ref),
        componentRef: familyRef(subjectRef, element.kind),
        surfaceKind: owner.surfaceKind,
        surfaceRef: owner.surfaceRef,
        surfaceLabel: owner.label,
        screenRef: owner.screenRef,
        elementRef: element.ref,
        parentElementRef: element.parentRef,
        childElementRefs: unique(children.get(element.ref) ?? []),
        kind: element.kind,
        semanticRole: element.role,
        label: element.label,
        symbol: element.symbol,
        declared: element.declared,
        sourcePath: owner.source,
        style: element.style,
        slot: element.slot,
        layer: element.layer,
        textRole: element.textRole,
        icon: element.icon,
        intent: element.intent,
        actionKey: element.actionKey,
        call: element.call,
        pathwayRef: element.pathwayRef,
        navigatesTo: element.navigatesTo,
        visibleWhen: element.visibleWhen,
        alwaysVisible: element.alwaysVisible,
        interactions: [...element.interactions],
        localization: {
          state: sourceStringRefs.length ? 'OBSERVED' : (element.labelRes ? 'RESOURCE_REF_ONLY' : 'NOT_OBSERVED'),
          resourceRef: element.labelRes,
          sourceStringRefs,
        },
        accessibility: {
          state: 'NOT_PROJECTED',
          refs: [],
        },
        realization: {
          realizedBy: unique(realization?.realizedBy ?? []),
          realizedIn: unique(realization?.realizedIn ?? []),
          presenceRefs: unique(realization?.presenceRefs ?? []),
          conditionRefs: unique(realization?.conditionRefs ?? []),
        },
      });
    }
  }
  occurrences.sort((left, right) => left.elementRef.localeCompare(right.elementRef));

  const byKind = new Map();
  for (const row of occurrences) {
    if (!byKind.has(row.kind)) byKind.set(row.kind, []);
    byKind.get(row.kind).push(row);
  }
  const components = [...byKind.entries()]
    .map(([kind, rows]) => familyFrom(kind, subjectRef, rows))
    .sort((left, right) => left.kind.localeCompare(right.kind));

  return freezeDeep({
    schemaVersion: COMPONENT_INVENTORY_SCHEMA,
    inventoryRef,
    subjectRef,
    buildRef,
    sourceSnapshot: {
      repositoryRef: normalizedLens.sourceSnapshot.repositoryRef,
      repositoryUrl: normalizedLens.sourceSnapshot.repositoryUrl,
      commit: normalizedLens.sourceSnapshot.commit,
      observedAt: normalizedLens.sourceSnapshot.observedAt,
      lensRef: normalizedLens.lensRef,
      localizationInventoryRef: normalizedLocalization?.inventoryRef ?? null,
    },
    producer: {
      ref: text(producer?.ref, 'producer.ref'),
      version: text(producer?.version, 'producer.version'),
    },
    components,
    occurrences,
    summary: summarize(components, occurrences),
  });
}

export function normalizeComponentInventory(input) {
  if (!input || input.schemaVersion !== COMPONENT_INVENTORY_SCHEMA) fail('schemaVersion must be ' + COMPONENT_INVENTORY_SCHEMA);
  text(input.inventoryRef, 'inventoryRef');
  text(input.subjectRef, 'subjectRef');
  text(input.buildRef, 'buildRef');
  text(input.sourceSnapshot?.repositoryRef, 'sourceSnapshot.repositoryRef');
  text(input.sourceSnapshot?.commit, 'sourceSnapshot.commit');
  text(input.producer?.ref, 'producer.ref');
  text(input.producer?.version, 'producer.version');
  if (!Array.isArray(input.components) || !input.components.length) fail('components are required');
  if (!Array.isArray(input.occurrences) || !input.occurrences.length) fail('occurrences are required');

  const occurrenceRefs = new Set();
  const componentRefs = new Set(input.components.map((row) => text(row.componentRef, 'component.componentRef')));
  if (componentRefs.size !== input.components.length) fail('component refs must be unique');
  for (const component of input.components) {
    if (component.meaningState !== COMPONENT_MEANING_STATE) fail(component.componentRef + ' meaningState must remain observed source family');
    if (component.portability !== COMPONENT_PORTABILITY_STATE) fail(component.componentRef + ' portability must remain unclassified in A1');
  }
  for (const row of input.occurrences) {
    text(row.occurrenceRef, 'occurrence.occurrenceRef');
    if (occurrenceRefs.has(row.occurrenceRef)) fail('duplicate occurrence ' + row.occurrenceRef);
    occurrenceRefs.add(row.occurrenceRef);
    if (!componentRefs.has(row.componentRef)) fail(row.occurrenceRef + ' references unknown component ' + row.componentRef);
    text(row.elementRef, row.occurrenceRef + ' elementRef');
    if (!Array.isArray(row.childElementRefs)) fail(row.occurrenceRef + ' childElementRefs must be an array');
    if (!Array.isArray(row.localization?.sourceStringRefs)) fail(row.occurrenceRef + ' localization sourceStringRefs must be an array');
    if (row.accessibility?.state !== 'NOT_PROJECTED' && row.accessibility?.state !== 'OBSERVED') fail(row.occurrenceRef + ' accessibility state is invalid');
  }
  for (const component of input.components) {
    for (const ref of component.occurrenceRefs ?? []) if (!occurrenceRefs.has(ref)) fail(component.componentRef + ' references unknown occurrence ' + ref);
  }
  const expectedSummary = summarize(input.components, input.occurrences);
  if (JSON.stringify(input.summary) !== JSON.stringify(expectedSummary)) fail('materialized inventory summary disagrees with contents');
  return freezeDeep(structuredClone(input));
}

export function occurrencesForComponent(inventory, componentRef) {
  inventory = normalizeComponentInventory(inventory);
  if (!inventory.components.some((row) => row.componentRef === componentRef)) fail('unknown component ' + componentRef);
  return inventory.occurrences.filter((row) => row.componentRef === componentRef);
}

export function occurrencesForSurface(inventory, surfaceRef) {
  inventory = normalizeComponentInventory(inventory);
  return inventory.occurrences.filter((row) => row.surfaceRef === surfaceRef);
}

export function componentForOccurrence(inventory, occurrenceRefValue) {
  inventory = normalizeComponentInventory(inventory);
  const occurrence = inventory.occurrences.find((row) => row.occurrenceRef === occurrenceRefValue);
  if (!occurrence) fail('unknown occurrence ' + occurrenceRefValue);
  return inventory.components.find((row) => row.componentRef === occurrence.componentRef);
}

export function componentOccurrenceTarget(inventory, occurrenceRefValue) {
  inventory = normalizeComponentInventory(inventory);
  const occurrence = inventory.occurrences.find((row) => row.occurrenceRef === occurrenceRefValue);
  if (!occurrence) fail('unknown occurrence ' + occurrenceRefValue);
  return Object.freeze({
    screenRef: occurrence.screenRef,
    elementRef: occurrence.elementRef,
  });
}

export function searchComponentInventory(inventory, query, { limit = 100 } = {}) {
  inventory = normalizeComponentInventory(inventory);
  if (!Number.isInteger(limit) || limit < 1 || limit > 500) fail('search limit must be an integer from 1 to 500');
  const needle = String(query ?? '').trim().toLowerCase();
  if (!needle) return [];
  const matches = [];
  for (const component of inventory.components) {
    const occurrences = inventory.occurrences.filter((row) => row.componentRef === component.componentRef);
    const haystack = [
      component.componentRef,
      component.kind,
      component.meaningState,
      component.portability,
      ...component.styles,
      ...component.textRoles,
      ...component.realizerSymbols,
      ...occurrences.flatMap((row) => [
        row.label,
        row.elementRef,
        row.surfaceRef,
        row.screenRef,
        row.symbol,
        row.sourcePath,
        row.style,
        row.intent,
      ]),
    ].filter(Boolean).join('\n').toLowerCase();
    if (haystack.includes(needle)) matches.push(component);
  }
  return matches.slice(0, limit);
}

// [VXG RealForever][VEXWORK][COMPONENT-LIBRARY][A1-INVENTORY]

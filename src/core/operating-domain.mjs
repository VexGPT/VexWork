import { withSemanticFingerprint, verifySemanticFingerprint } from './semantic.mjs';
import { assertKnownRepositoryRefs } from './repository-graph.mjs';
import { assertKnownProcessRefs } from './process-map.mjs';

export const OPERATING_DOMAIN_SCHEMA = 'vexwork.operating-domain/v1';
export const OPERATING_DOMAIN_PROJECTION_SCHEMA = 'vexwork.operating-domain-projection/v1';

const REF = /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/u;

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function stableRef(value, label) {
  assert(typeof value === 'string' && REF.test(value), `${label} must be one stable ref`);
  return value;
}

function nonEmpty(value, label) {
  assert(typeof value === 'string' && value.trim(), `${label} is required`);
  return value;
}

function uniqueSorted(values, label) {
  assert(Array.isArray(values), `${label} must be an array`);
  const accepted = values.map((value, index) => stableRef(value, `${label}[${index}]`));
  assert(new Set(accepted).size === accepted.length, `${label} must be unique`);
  return [...accepted].sort();
}

function exactKeys(value, keys, label) {
  assert(value && typeof value === 'object' && !Array.isArray(value), `${label} must be one object`);
  assert(JSON.stringify(Object.keys(value).sort()) === JSON.stringify([...keys].sort()), `${label} has unexpected fields`);
}

function binding(value, { kind, refField, extraKeys = [], normalizeExtra = () => ({}) }) {
  const keys = [refField, 'label', 'ownerRepositoryRef', 'sourceRefs', ...extraKeys];
  exactKeys(value, keys, `${kind} binding`);
  const ref = stableRef(value[refField], `${kind}.${refField}`);
  const normalized = {
    [refField]: ref,
    label: nonEmpty(value.label, `${kind}.label`),
    ownerRepositoryRef: stableRef(value.ownerRepositoryRef, `${kind}.ownerRepositoryRef`),
    sourceRefs: uniqueSorted(value.sourceRefs, `${kind}.sourceRefs`),
    ...normalizeExtra(value),
  };
  assert(normalized.sourceRefs.length > 0, `${kind}.sourceRefs must be non-empty`);
  return normalized;
}

function normalizedBindings(values, config) {
  assert(Array.isArray(values), `${config.kind} bindings must be an array`);
  const rows = values.map((value) => binding(value, config));
  const refs = rows.map((row) => row[config.refField]);
  assert(new Set(refs).size === refs.length, `${config.kind} refs must be unique`);
  return rows.sort((a, b) => a[config.refField].localeCompare(b[config.refField]));
}

function processOwner(processRef, processRegistry) {
  return processRegistry.processes.find((entry) => entry.processRef === processRef)?.ownerRepositoryRef ?? null;
}

export function createOperatingDomain(input, { repositoryRegistry, processRegistry }) {
  const sourceKeys = [
    'schemaVersion', 'domainRef', 'label', 'purpose', 'repositoryRefs',
    'capabilities', 'populations', 'lenses', 'processes', 'attentionQueues', 'sourceRefs',
  ];
  const storedKeys = [...sourceKeys, 'effects', 'executionAuthority', 'semanticFingerprint'];
  exactKeys(input, input?.semanticFingerprint === undefined ? sourceKeys : storedKeys, 'operating domain');
  assert(input?.schemaVersion === OPERATING_DOMAIN_SCHEMA, 'operating domain schema mismatch');
  if (input.semanticFingerprint !== undefined) {
    assert(input.effects === false, 'stored operating domain effects must remain false');
    assert(input.executionAuthority === 'NONE', 'stored operating domain executionAuthority must remain NONE');
  }
  if (input.semanticFingerprint !== undefined) {
    assert(verifySemanticFingerprint(input), 'operating domain semanticFingerprint mismatch');
  }

  const repositoryRefs = uniqueSorted(input.repositoryRefs, 'repositoryRefs');
  assert(repositoryRefs.length > 0, 'repositoryRefs must be non-empty');
  assertKnownRepositoryRefs(repositoryRefs, repositoryRegistry);
  const repositorySet = new Set(repositoryRefs);

  const capabilities = normalizedBindings(input.capabilities, {
    kind: 'capability',
    refField: 'capabilityRef',
  });
  const populations = normalizedBindings(input.populations, {
    kind: 'population',
    refField: 'populationRef',
    extraKeys: ['entityKind'],
    normalizeExtra: (entry) => ({ entityKind: stableRef(entry.entityKind, 'population.entityKind') }),
  });
  const lenses = normalizedBindings(input.lenses, {
    kind: 'lens',
    refField: 'lensRef',
    extraKeys: ['populationRef'],
    normalizeExtra: (entry) => ({ populationRef: stableRef(entry.populationRef, 'lens.populationRef') }),
  });
  const processes = normalizedBindings(input.processes, {
    kind: 'process',
    refField: 'processRef',
  });
  const attentionQueues = normalizedBindings(input.attentionQueues, {
    kind: 'attention queue',
    refField: 'queueRef',
  });

  const allBindings = [...capabilities, ...populations, ...lenses, ...processes, ...attentionQueues];
  const bindingOwnerRefs = [...new Set(allBindings.map((row) => row.ownerRepositoryRef))].sort();
  assertKnownRepositoryRefs(bindingOwnerRefs, repositoryRegistry);
  for (const row of allBindings) {
    assert(repositorySet.has(row.ownerRepositoryRef), `binding owner ${row.ownerRepositoryRef} must be included in repositoryRefs`);
  }

  const populationRefs = new Set(populations.map((row) => row.populationRef));
  for (const lens of lenses) {
    assert(populationRefs.has(lens.populationRef), `lens ${lens.lensRef} references unbound population ${lens.populationRef}`);
  }

  const processRefs = processes.map((row) => row.processRef);
  assertKnownProcessRefs(processRefs, processRegistry);
  for (const row of processes) {
    assert(
      processOwner(row.processRef, processRegistry) === row.ownerRepositoryRef,
      `process owner mismatch for ${row.processRef}`,
    );
  }

  const sourceRefs = uniqueSorted(input.sourceRefs, 'sourceRefs');
  assert(sourceRefs.length > 0, 'sourceRefs must be non-empty');

  return withSemanticFingerprint({
    schemaVersion: OPERATING_DOMAIN_SCHEMA,
    domainRef: stableRef(input.domainRef, 'domainRef'),
    label: nonEmpty(input.label, 'label'),
    purpose: nonEmpty(input.purpose, 'purpose'),
    repositoryRefs,
    capabilities,
    populations,
    lenses,
    processes,
    attentionQueues,
    sourceRefs,
    effects: false,
    executionAuthority: 'NONE',
  });
}

export function projectOperatingDomain(domain) {
  assert(verifySemanticFingerprint(domain), 'operating domain semanticFingerprint mismatch');
  assert(domain.schemaVersion === OPERATING_DOMAIN_SCHEMA, 'operating domain schema mismatch');
  return withSemanticFingerprint({
    schemaVersion: OPERATING_DOMAIN_PROJECTION_SCHEMA,
    domainRef: domain.domainRef,
    label: domain.label,
    purpose: domain.purpose,
    repositoryRefs: [...domain.repositoryRefs],
    summary: {
      capabilityCount: domain.capabilities.length,
      populationCount: domain.populations.length,
      lensCount: domain.lenses.length,
      processCount: domain.processes.length,
      attentionQueueCount: domain.attentionQueues.length,
    },
    capabilities: domain.capabilities.map((entry) => ({ ...entry, sourceRefs: [...entry.sourceRefs] })),
    populations: domain.populations.map((entry) => ({ ...entry, sourceRefs: [...entry.sourceRefs] })),
    lenses: domain.lenses.map((entry) => ({ ...entry, sourceRefs: [...entry.sourceRefs] })),
    processes: domain.processes.map((entry) => ({ ...entry, sourceRefs: [...entry.sourceRefs] })),
    attentionQueues: domain.attentionQueues.map((entry) => ({ ...entry, sourceRefs: [...entry.sourceRefs] })),
    sourceRefs: [...domain.sourceRefs],
    effects: false,
    executionAuthority: 'NONE',
  });
}

// [VXG RealForever][VEXWORK][OPERATING-DOMAIN]

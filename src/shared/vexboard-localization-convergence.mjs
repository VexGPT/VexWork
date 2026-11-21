import {
  LOCALIZATION_INVENTORY_SCHEMA,
  normalizeLocalizationInventory,
} from './vexboard-localization-inventory.mjs';

export const LOCALIZATION_CONVERGENCE_ANALYSIS_SCHEMA = 'vexboard.localization-convergence-analysis/v1';
export const LOCALIZATION_CONVERGENCE_DISPOSITIONS = Object.freeze([
  'LIKELY_SHARED',
  'NEEDS_REVIEW',
  'KEEP_SEPARATE',
  'ALREADY_SHARED',
]);

function fail(message) {
  throw new TypeError(`localization convergence: ${message}`);
}

function uniqueSorted(values) {
  return [...new Set(values)].sort();
}

function normalizeCandidateValue(value) {
  if (typeof value !== 'string') fail('source value must be a string');
  return value.normalize('NFC');
}

function memberRoleRefs(inventory, row) {
  const occurrences = inventory.occurrences.filter((occurrence) => occurrence.sourceStringRef === row.sourceStringRef);
  return uniqueSorted(occurrences.map((occurrence) => occurrence.textRole ?? occurrence.bindingRole));
}

function member(input, row) {
  return Object.freeze({
    inventoryRef: input.inventoryRef,
    subjectRef: input.subjectRef,
    repositoryRef: input.sourceSnapshot.repositoryRef,
    revision: input.sourceSnapshot.commit,
    sourceStringRef: row.sourceStringRef,
    sourceKey: row.sourceKey,
    sourceValue: row.sourceValue,
    sourcePath: row.sourcePath,
    formatSignature: row.formatSignature,
    mapped: row.mapped,
    occurrenceRefs: Object.freeze([...row.occurrenceRefs]),
    screenRefs: Object.freeze([...row.screenRefs]),
    surfaceRefs: Object.freeze([...row.surfaceRefs]),
    bindingRoles: Object.freeze([...row.bindingRoles]),
    textRoleRefs: Object.freeze(memberRoleRefs(input, row)),
    localeVariants: Object.freeze({ ...(row.localeVariants ?? {}) }),
  });
}

function sameJson(values) {
  if (!values.length) return true;
  const first = JSON.stringify(values[0]);
  return values.every((value) => JSON.stringify(value) === first);
}

function roleSignature(value) {
  return [...value.textRoleRefs].sort();
}

function translationSignature(value) {
  return Object.fromEntries(Object.entries(value.localeVariants).sort(([left], [right]) => left.localeCompare(right)));
}

function evidenceFor(members) {
  const evidence = ['NORMALIZED_SOURCE_VALUE'];
  if (new Set(members.map((entry) => entry.sourceValue)).size === 1) evidence.push('EXACT_SOURCE_VALUE');

  const formats = members.map((entry) => entry.formatSignature);
  evidence.push(new Set(formats).size === 1 ? 'SAME_FORMAT_SIGNATURE' : 'DIFFERENT_FORMAT_SIGNATURE');

  const roles = members.map(roleSignature);
  if (roles.some((value) => value.length === 0)) {
    evidence.push('TEXT_ROLE_CONTEXT_INCOMPLETE');
  } else {
    evidence.push(sameJson(roles) ? 'SAME_TEXT_ROLE' : 'DIFFERENT_TEXT_ROLE');
  }

  evidence.push(
    new Set(members.map((entry) => entry.subjectRef)).size === 1
      ? 'SAME_DOMAIN'
      : 'DIFFERENT_DOMAIN',
  );

  const translations = members.map(translationSignature);
  if (translations.every((value) => Object.keys(value).length === 0)) {
    evidence.push('NO_VARIANT_EVIDENCE');
  } else {
    evidence.push(sameJson(translations) ? 'SAME_TRANSLATION_SET' : 'DIVERGENT_TRANSLATION_SET');
  }

  if (members.some((entry) => !entry.mapped)) evidence.push('UNMAPPED_CONTEXT');
  return Object.freeze(evidence);
}

function suggestedDisposition(evidence) {
  const set = new Set(evidence);
  if (set.has('DIFFERENT_FORMAT_SIGNATURE') || set.has('DIVERGENT_TRANSLATION_SET')) {
    return 'KEEP_SEPARATE';
  }
  if (
    set.has('DIFFERENT_TEXT_ROLE')
    || set.has('DIFFERENT_DOMAIN')
    || set.has('TEXT_ROLE_CONTEXT_INCOMPLETE')
    || set.has('UNMAPPED_CONTEXT')
  ) {
    return 'NEEDS_REVIEW';
  }
  return 'LIKELY_SHARED';
}

function candidateGroupRef(index) {
  return `localization-candidate-group.${String(index + 1).padStart(4, '0')}`;
}

function candidateGroups(inventories) {
  const byValue = new Map();
  for (const inventory of inventories) {
    for (const row of inventory.strings) {
      const normalizedSourceValue = normalizeCandidateValue(row.sourceValue);
      if (!byValue.has(normalizedSourceValue)) byValue.set(normalizedSourceValue, []);
      byValue.get(normalizedSourceValue).push(member(inventory, row));
    }
  }

  return [...byValue.entries()]
    .filter(([, members]) => members.length > 1)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([normalizedSourceValue, rawMembers], index) => {
      const members = [...rawMembers].sort(
        (left, right) => left.subjectRef.localeCompare(right.subjectRef)
          || left.sourceStringRef.localeCompare(right.sourceStringRef),
      );
      const evidence = evidenceFor(members);
      return Object.freeze({
        candidateGroupRef: candidateGroupRef(index),
        normalizedSourceValue,
        memberCount: members.length,
        subjectRefs: Object.freeze(uniqueSorted(members.map((entry) => entry.subjectRef))),
        sourceStringRefs: Object.freeze(members.map((entry) => entry.sourceStringRef)),
        evidence,
        suggestedDisposition: suggestedDisposition(evidence),
        members: Object.freeze(members),
      });
    });
}

function sharedSourceIdentities(inventories) {
  const rows = [];
  for (const inventory of inventories) {
    for (const row of inventory.strings) {
      if (row.occurrenceRefs.length <= 1) continue;
      rows.push(Object.freeze({
        sourceStringRef: row.sourceStringRef,
        subjectRef: inventory.subjectRef,
        inventoryRef: inventory.inventoryRef,
        revision: inventory.sourceSnapshot.commit,
        sourceValue: row.sourceValue,
        occurrenceRefs: Object.freeze([...row.occurrenceRefs]),
        screenRefs: Object.freeze([...row.screenRefs]),
        surfaceRefs: Object.freeze([...row.surfaceRefs]),
        disposition: 'ALREADY_SHARED',
      }));
    }
  }
  return Object.freeze(rows.sort(
    (left, right) => left.subjectRef.localeCompare(right.subjectRef)
      || left.sourceStringRef.localeCompare(right.sourceStringRef),
  ));
}

export function analyzeLocalizationConvergence(input) {
  const values = Array.isArray(input) ? input : [input];
  if (!values.length) fail('at least one Localization Inventory is required');
  const inventories = values.map(normalizeLocalizationInventory);
  if (inventories.some((inventory) => inventory.schemaVersion !== LOCALIZATION_INVENTORY_SCHEMA)) {
    fail('all inputs must be Localization Inventories');
  }

  const groups = candidateGroups(inventories);
  const shared = sharedSourceIdentities(inventories);
  const counts = Object.fromEntries(LOCALIZATION_CONVERGENCE_DISPOSITIONS.map((value) => [value, 0]));
  for (const group of groups) counts[group.suggestedDisposition] += 1;
  counts.ALREADY_SHARED = shared.length;

  return Object.freeze({
    schemaVersion: LOCALIZATION_CONVERGENCE_ANALYSIS_SCHEMA,
    inventoryRefs: Object.freeze(inventories.map((inventory) => inventory.inventoryRef).sort()),
    subjectRefs: Object.freeze(uniqueSorted(inventories.map((inventory) => inventory.subjectRef))),
    candidateGroups: Object.freeze(groups),
    sharedSourceIdentities: shared,
    summary: Object.freeze({
      inventoryCount: inventories.length,
      sourceStringCount: inventories.reduce((sum, inventory) => sum + inventory.strings.length, 0),
      candidateGroupCount: groups.length,
      candidateMemberCount: groups.reduce((sum, group) => sum + group.memberCount, 0),
      alreadySharedSourceCount: shared.length,
      dispositions: Object.freeze(counts),
    }),
  });
}

function csvCell(value) {
  const text = value === null || value === undefined ? '' : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function localizationConvergenceCsv(analysisInput) {
  if (!analysisInput || analysisInput.schemaVersion !== LOCALIZATION_CONVERGENCE_ANALYSIS_SCHEMA) {
    fail('CSV requires a Localization Convergence Analysis');
  }
  const rows = [[
    'candidateGroupRef',
    'normalizedSourceValue',
    'suggestedDisposition',
    'evidence',
    'subjectRef',
    'sourceStringRef',
    'sourceValue',
    'formatSignature',
    'textRoles',
    'screenRefs',
    'surfaceRefs',
    'mapped',
  ]];
  for (const group of analysisInput.candidateGroups) {
    for (const member of group.members) {
      rows.push([
        group.candidateGroupRef,
        group.normalizedSourceValue,
        group.suggestedDisposition,
        group.evidence.join(' | '),
        member.subjectRef,
        member.sourceStringRef,
        member.sourceValue,
        member.formatSignature,
        member.textRoleRefs.join(' | '),
        member.screenRefs.join(' | '),
        member.surfaceRefs.join(' | '),
        member.mapped,
      ]);
    }
  }
  return rows.map((row) => row.map(csvCell).join(',')).join('\n') + '\n';
}

// [VXG RealForever][VEXWORK][VEXBOARD][LOCALIZATION][CONVERGENCE]

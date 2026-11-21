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
export const LOCALIZATION_CONVERGENCE_REVIEW_SCHEMA = 'vexboard.localization-convergence-review/v1';
export const LOCALIZATION_CONVERGENCE_REVIEW_DECISIONS = Object.freeze([
  'ACCEPT_SHARED',
  'KEEP_SEPARATE',
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

function translationEvidence(members) {
  const localeRefs = uniqueSorted(members.flatMap((entry) => Object.keys(entry.localeVariants)));
  if (!localeRefs.length) return Object.freeze(['NO_VARIANT_EVIDENCE']);

  let incomplete = false;
  let divergent = false;
  for (const localeRef of localeRefs) {
    const observed = members
      .filter((entry) => Object.hasOwn(entry.localeVariants, localeRef))
      .map((entry) => entry.localeVariants[localeRef]);
    if (observed.length !== members.length) incomplete = true;
    if (new Set(observed).size > 1) divergent = true;
  }

  const evidence = [];
  if (divergent) evidence.push('DIVERGENT_TRANSLATION_SET');
  if (incomplete) evidence.push('VARIANT_EVIDENCE_INCOMPLETE');
  if (!divergent && !incomplete) evidence.push('SAME_TRANSLATION_SET');
  return Object.freeze(evidence);
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

  evidence.push(...translationEvidence(members));

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
    || set.has('VARIANT_EVIDENCE_INCOMPLETE')
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
  if (new Set(inventories.map((inventory) => inventory.inventoryRef)).size !== inventories.length) {
    fail('inventoryRef must be unique across one analysis');
  }
  if (new Set(inventories.map((inventory) => inventory.subjectRef)).size !== inventories.length) {
    fail('one current inventory per subject is required');
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

function stableReviewRef(value, label) {
  if (typeof value !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9._:/-]*$/u.test(value)) {
    fail(`${label} must be one stable ref`);
  }
  return value;
}

function reviewText(value, label) {
  if (typeof value !== 'string' || !value.trim()) fail(`${label} must be non-empty text`);
  return value;
}

function reviewTimestampOrNull(value) {
  if (value === null || value === undefined) return null;
  if (
    typeof value !== 'string'
    || Number.isNaN(Date.parse(value))
    || new Date(value).toISOString() !== value
  ) {
    fail('reviewedAtOrNull must be canonical UTC ISO or null');
  }
  return value;
}

function reviewStringArray(values, label) {
  if (!Array.isArray(values) || values.some((value) => typeof value !== 'string')) {
    fail(`${label} must be an array of strings`);
  }
  return Object.freeze(uniqueSorted(values));
}

function sortedLocaleVariants(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    fail('candidate.member.localeVariants must be an object');
  }
  const entries = Object.entries(value);
  if (entries.some(([localeRef, variant]) => typeof localeRef !== 'string' || typeof variant !== 'string')) {
    fail('candidate.member.localeVariants must map locale strings to value strings');
  }
  return Object.freeze(Object.fromEntries(
    entries.sort(([left], [right]) => left.localeCompare(right)),
  ));
}

export function localizationConvergenceCandidateBinding(candidate) {
  if (!candidate || typeof candidate !== 'object' || !Array.isArray(candidate.members) || candidate.members.length < 2) {
    fail('candidate binding requires one convergence candidate group');
  }
  const members = candidate.members.map((entry) => Object.freeze({
    subjectRef: stableReviewRef(entry.subjectRef, 'candidate.member.subjectRef'),
    sourceStringRef: stableReviewRef(entry.sourceStringRef, 'candidate.member.sourceStringRef'),
    formatSignature: typeof entry.formatSignature === 'string' ? entry.formatSignature : fail('candidate.member.formatSignature must be a string'),
    mapped: typeof entry.mapped === 'boolean' ? entry.mapped : fail('candidate.member.mapped must be boolean'),
    textRoleRefs: reviewStringArray(entry.textRoleRefs ?? [], 'candidate.member.textRoleRefs'),
    localeVariants: sortedLocaleVariants(entry.localeVariants ?? {}),
  })).sort(
    (left, right) => left.subjectRef.localeCompare(right.subjectRef)
      || left.sourceStringRef.localeCompare(right.sourceStringRef),
  );
  if (new Set(members.map((entry) => `${entry.subjectRef}|${entry.sourceStringRef}`)).size !== members.length) {
    fail('candidate binding members must be unique');
  }
  return Object.freeze({
    normalizedSourceValue: normalizeCandidateValue(candidate.normalizedSourceValue),
    evidence: reviewStringArray(candidate.evidence ?? [], 'candidate.evidence'),
    members: Object.freeze(members),
  });
}

function candidateBindingKey(binding) {
  return JSON.stringify(binding);
}

function normalizeReviewBinding(binding) {
  if (!binding || typeof binding !== 'object') fail('review candidateBinding required');
  return localizationConvergenceCandidateBinding({
    normalizedSourceValue: binding.normalizedSourceValue,
    evidence: Array.isArray(binding.evidence) ? binding.evidence : fail('review candidateBinding.evidence must be an array'),
    members: Array.isArray(binding.members) ? binding.members : fail('review candidateBinding.members must be an array'),
  });
}

export function createLocalizationConvergenceReview({
  reviewRef,
  candidate,
  decision,
  semanticGroupRefOrNull = null,
  rationale,
  reviewedAtOrNull = null,
}) {
  stableReviewRef(reviewRef, 'reviewRef');
  if (!LOCALIZATION_CONVERGENCE_REVIEW_DECISIONS.includes(decision)) {
    fail(`unsupported review decision ${decision}`);
  }
  if (!['LIKELY_SHARED', 'NEEDS_REVIEW', 'KEEP_SEPARATE'].includes(candidate?.suggestedDisposition)) {
    fail('candidate suggestedDisposition must be one current convergence suggestion');
  }
  const candidateBinding = localizationConvergenceCandidateBinding(candidate);
  if (decision === 'ACCEPT_SHARED') {
    if (candidate.suggestedDisposition === 'KEEP_SEPARATE') {
      fail('ACCEPT_SHARED cannot override current strong separation evidence; split/reform the candidate or resolve the evidence first');
    }
    stableReviewRef(semanticGroupRefOrNull, 'semanticGroupRefOrNull');
  } else if (semanticGroupRefOrNull !== null) {
    fail('KEEP_SEPARATE must not mint semanticGroupRefOrNull');
  }
  return Object.freeze({
    schemaVersion: LOCALIZATION_CONVERGENCE_REVIEW_SCHEMA,
    reviewRef,
    decision,
    candidateGroupRefAtReview: stableReviewRef(candidate.candidateGroupRef, 'candidateGroupRefAtReview'),
    candidateBinding,
    suggestedDispositionAtReview: candidate.suggestedDisposition,
    semanticGroupRefOrNull,
    rationale: reviewText(rationale, 'rationale'),
    reviewedAtOrNull: reviewTimestampOrNull(reviewedAtOrNull),
  });
}

export function normalizeLocalizationConvergenceReview(input) {
  if (!input || input.schemaVersion !== LOCALIZATION_CONVERGENCE_REVIEW_SCHEMA) {
    fail(`review schemaVersion must be ${LOCALIZATION_CONVERGENCE_REVIEW_SCHEMA}`);
  }
  stableReviewRef(input.reviewRef, 'reviewRef');
  if (!LOCALIZATION_CONVERGENCE_REVIEW_DECISIONS.includes(input.decision)) {
    fail(`unsupported review decision ${input.decision}`);
  }
  stableReviewRef(input.candidateGroupRefAtReview, 'candidateGroupRefAtReview');
  if (!['LIKELY_SHARED', 'NEEDS_REVIEW', 'KEEP_SEPARATE'].includes(input.suggestedDispositionAtReview)) {
    fail('suggestedDispositionAtReview must be one convergence suggestion');
  }
  const candidateBinding = normalizeReviewBinding(input.candidateBinding);
  if (input.decision === 'ACCEPT_SHARED') {
    stableReviewRef(input.semanticGroupRefOrNull, 'semanticGroupRefOrNull');
  } else if ((input.semanticGroupRefOrNull ?? null) !== null) {
    fail('KEEP_SEPARATE must not mint semanticGroupRefOrNull');
  }
  return Object.freeze({
    schemaVersion: LOCALIZATION_CONVERGENCE_REVIEW_SCHEMA,
    reviewRef: input.reviewRef,
    decision: input.decision,
    candidateGroupRefAtReview: input.candidateGroupRefAtReview,
    candidateBinding,
    suggestedDispositionAtReview: input.suggestedDispositionAtReview,
    semanticGroupRefOrNull: input.semanticGroupRefOrNull ?? null,
    rationale: reviewText(input.rationale, 'rationale'),
    reviewedAtOrNull: reviewTimestampOrNull(input.reviewedAtOrNull ?? null),
  });
}

export function applyLocalizationConvergenceReviews(analysisInput, reviewInputs = []) {
  if (!analysisInput || analysisInput.schemaVersion !== LOCALIZATION_CONVERGENCE_ANALYSIS_SCHEMA) {
    fail('review projection requires a Localization Convergence Analysis');
  }
  if (!Array.isArray(reviewInputs)) fail('reviews must be an array');

  const reviews = reviewInputs.map(normalizeLocalizationConvergenceReview);
  if (new Set(reviews.map((review) => review.reviewRef)).size !== reviews.length) {
    fail('reviewRef must be unique');
  }
  const bindingKeys = reviews.map((review) => candidateBindingKey(review.candidateBinding));
  if (new Set(bindingKeys).size !== bindingKeys.length) {
    fail('one review decision per exact candidate binding is allowed');
  }
  const semanticGroupRefs = reviews
    .filter((review) => review.decision === 'ACCEPT_SHARED')
    .map((review) => review.semanticGroupRefOrNull);
  if (new Set(semanticGroupRefs).size !== semanticGroupRefs.length) {
    fail('semanticGroupRefOrNull must be unique across accepted current review decisions');
  }

  const reviewByBinding = new Map(reviews.map((review) => [candidateBindingKey(review.candidateBinding), review]));
  const matchedReviewRefs = new Set();
  const candidateGroups = analysisInput.candidateGroups.map((candidate) => {
    const key = candidateBindingKey(localizationConvergenceCandidateBinding(candidate));
    const review = reviewByBinding.get(key) ?? null;
    if (review?.decision === 'ACCEPT_SHARED' && candidate.suggestedDisposition === 'KEEP_SEPARATE') {
      fail(`review ${review.reviewRef} cannot ACCEPT_SHARED current strong separation evidence`);
    }
    if (review) matchedReviewRefs.add(review.reviewRef);
    return Object.freeze({
      ...candidate,
      review: review ? Object.freeze({
        reviewRef: review.reviewRef,
        decision: review.decision,
        semanticGroupRefOrNull: review.semanticGroupRefOrNull,
        rationale: review.rationale,
        reviewedAtOrNull: review.reviewedAtOrNull,
      }) : null,
    });
  });

  const staleReviews = reviews
    .filter((review) => !matchedReviewRefs.has(review.reviewRef))
    .map((review) => Object.freeze({
      reviewRef: review.reviewRef,
      decision: review.decision,
      semanticGroupRefOrNull: review.semanticGroupRefOrNull,
      status: 'STALE_REVIEW',
      reason: 'CURRENT_CANDIDATE_BINDING_NOT_FOUND',
    }));
  const acceptedSemanticGroups = candidateGroups
    .filter((candidate) => candidate.review?.decision === 'ACCEPT_SHARED')
    .map((candidate) => Object.freeze({
      semanticGroupRef: candidate.review.semanticGroupRefOrNull,
      reviewRef: candidate.review.reviewRef,
      normalizedSourceValue: candidate.normalizedSourceValue,
      memberRefs: Object.freeze(candidate.members.map((entry) => Object.freeze({
        subjectRef: entry.subjectRef,
        sourceStringRef: entry.sourceStringRef,
      }))),
    }));

  return Object.freeze({
    schemaVersion: 'vexboard.localization-convergence-review-projection/v1',
    analysis: analysisInput,
    candidateGroups: Object.freeze(candidateGroups),
    acceptedSemanticGroups: Object.freeze(acceptedSemanticGroups),
    staleReviews: Object.freeze(staleReviews),
    summary: Object.freeze({
      candidateGroupCount: candidateGroups.length,
      reviewedCandidateCount: candidateGroups.filter((candidate) => candidate.review !== null).length,
      acceptedSemanticGroupCount: acceptedSemanticGroups.length,
      keptSeparateCount: candidateGroups.filter((candidate) => candidate.review?.decision === 'KEEP_SEPARATE').length,
      staleReviewCount: staleReviews.length,
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

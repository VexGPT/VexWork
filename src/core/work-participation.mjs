import { verifySemanticFingerprint, withSemanticFingerprint } from './semantic.mjs';

export const WORK_PARTICIPATION_LEDGER_SCHEMA = 'vexwork.work-participation-ledger/v1';
export const WORK_ENGAGEMENT_EVENT_SCHEMA = 'vexwork.work-engagement-event/v1';
export const WORK_ENGAGEMENT_EVENT_TYPES = Object.freeze(['ENGAGED', 'RELEASED']);

const REF = /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/u;
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/u;

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function stableRef(value, label) {
  assert(typeof value === 'string' && REF.test(value), `${label} must be one stable ref`);
  return value;
}

function optionalRef(value, label) {
  if (value === null) return null;
  return stableRef(value, label);
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

export function createWorkEngagementEvent(input) {
  validateStoredFingerprintIfPresent(input, 'Work Engagement Event');
  assert(input?.schemaVersion === WORK_ENGAGEMENT_EVENT_SCHEMA, 'Work Engagement Event schema mismatch');
  stableRef(input.eventRef, 'eventRef');
  stableRef(input.engagementRef, 'engagementRef');
  stableRef(input.workRef, 'workRef');
  stableRef(input.participantRef, 'participantRef');
  stableRef(input.continuityRef, 'continuityRef');
  stableRef(input.sessionRef, 'sessionRef');
  assert(WORK_ENGAGEMENT_EVENT_TYPES.includes(input.eventType), 'unsupported Work Engagement eventType');
  optionalRef(input.continuationOfEngagementRefOrNull, 'continuationOfEngagementRefOrNull');
  if (input.eventType === 'RELEASED') {
    assert(input.continuationOfEngagementRefOrNull === null, 'RELEASED event cannot declare continuationOfEngagementRefOrNull');
  }
  refs(input.sourceRefs, 'sourceRefs');
  timestamp(input.createdAt, 'createdAt');
  return withSemanticFingerprint(input);
}

export function createWorkParticipationLedger(input) {
  validateStoredFingerprintIfPresent(input, 'Work Participation Ledger');
  assert(input?.schemaVersion === WORK_PARTICIPATION_LEDGER_SCHEMA, 'Work Participation Ledger schema mismatch');
  stableRef(input.ledgerRef, 'ledgerRef');
  refs(input.sourceRefs, 'sourceRefs');
  timestamp(input.formedAt, 'formedAt');
  assert(Array.isArray(input.events), 'Work Participation Ledger events must be an array');

  const events = input.events.map(createWorkEngagementEvent);
  const eventRefs = new Set();
  const engagements = new Map();
  let priorCreatedAt = null;

  for (const event of events) {
    assert(!eventRefs.has(event.eventRef), `duplicate eventRef ${event.eventRef}`);
    eventRefs.add(event.eventRef);
    if (priorCreatedAt !== null) {
      assert(event.createdAt >= priorCreatedAt, 'Work Participation events must be chronological');
    }
    priorCreatedAt = event.createdAt;

    const existing = engagements.get(event.engagementRef) ?? null;
    if (event.eventType === 'ENGAGED') {
      assert(existing === null, `engagementRef already engaged ${event.engagementRef}`);
      if (event.continuationOfEngagementRefOrNull !== null) {
        const predecessor = engagements.get(event.continuationOfEngagementRefOrNull);
        assert(predecessor?.engaged, `continuation predecessor missing ${event.continuationOfEngagementRefOrNull}`);
        assert(predecessor.workRef === event.workRef, 'continuation predecessor workRef mismatch');
        assert(predecessor.continuityRef === event.continuityRef, 'continuation predecessor continuityRef mismatch');
        assert(predecessor.sessionRef !== event.sessionRef, 'continuation must enter a distinct sessionRef');
      }
      engagements.set(event.engagementRef, {
        engaged: event,
        released: null,
        workRef: event.workRef,
        participantRef: event.participantRef,
        continuityRef: event.continuityRef,
        sessionRef: event.sessionRef,
      });
      continue;
    }

    assert(existing?.engaged, `release without ENGAGED event for ${event.engagementRef}`);
    assert(existing.released === null, `engagement already released ${event.engagementRef}`);
    assert(existing.workRef === event.workRef, 'release workRef mismatch');
    assert(existing.participantRef === event.participantRef, 'release participantRef mismatch');
    assert(existing.continuityRef === event.continuityRef, 'release continuityRef mismatch');
    assert(existing.sessionRef === event.sessionRef, 'release sessionRef mismatch');
    existing.released = event;
  }

  const core = { ...input, events };
  delete core.semanticFingerprint;
  return withSemanticFingerprint(core);
}

function selectedEngagements(ledger, workRefs) {
  ledger = createWorkParticipationLedger(ledger);
  refs(workRefs, 'workRefs');
  const selected = new Set(workRefs);
  const byEngagement = new Map();
  for (const event of ledger.events) {
    if (!selected.has(event.workRef)) continue;
    if (!byEngagement.has(event.engagementRef)) {
      byEngagement.set(event.engagementRef, { engaged: null, released: null });
    }
    const slot = byEngagement.get(event.engagementRef);
    if (event.eventType === 'ENGAGED') slot.engaged = event;
    else slot.released = event;
  }
  return [...byEngagement.values()].filter((entry) => entry.engaged !== null);
}

export function summarizeWorkParticipation(ledger, workRefs) {
  const engagements = selectedEngagements(ledger, workRefs);
  const sessionRefs = [...new Set(engagements.map((entry) => entry.engaged.sessionRef))].sort();
  const participantRefs = [...new Set(engagements.map((entry) => entry.engaged.participantRef))].sort();
  const continuityRefs = [...new Set(engagements.map((entry) => entry.engaged.continuityRef))].sort();
  const active = engagements.filter((entry) => entry.released === null);
  const handoffCount = engagements.filter((entry) => entry.engaged.continuationOfEngagementRefOrNull !== null).length;
  const latest = engagements
    .map((entry) => entry.released ?? entry.engaged)
    .sort((left, right) => left.createdAt.localeCompare(right.createdAt))
    .at(-1) ?? null;

  return Object.freeze({
    schemaVersion: 'vexwork.work-participation-summary/v1',
    workRefs: Object.freeze([...workRefs]),
    engagementCount: engagements.length,
    sessionCount: sessionRefs.length,
    participantCount: participantRefs.length,
    continuityCount: continuityRefs.length,
    handoffCount,
    activeEngagementCount: active.length,
    participantRefs: Object.freeze(participantRefs),
    continuityRefs: Object.freeze(continuityRefs),
    activeEngagementRefs: Object.freeze(active.map((entry) => entry.engaged.engagementRef).sort()),
    latestEventRefOrNull: latest?.eventRef ?? null,
    coverage: 'EXPLICIT_ENGAGEMENT_EVENTS_ONLY',
    effects: false,
    executionAuthority: 'NONE',
  });
}

export function workParticipationTimeline(ledger, workRef) {
  stableRef(workRef, 'workRef');
  const engagements = selectedEngagements(ledger, [workRef])
    .sort((left, right) => left.engaged.createdAt.localeCompare(right.engaged.createdAt));

  return Object.freeze(engagements.map((entry, index) => Object.freeze({
    ordinal: index + 1,
    engagementRef: entry.engaged.engagementRef,
    sessionRef: entry.engaged.sessionRef,
    participantRef: entry.engaged.participantRef,
    continuityRef: entry.engaged.continuityRef,
    continuationOfEngagementRefOrNull: entry.engaged.continuationOfEngagementRefOrNull,
    startedAt: entry.engaged.createdAt,
    releasedAtOrNull: entry.released?.createdAt ?? null,
    active: entry.released === null,
  })));
}

// [VXG RealForever][VEXWORK][WORK-PARTICIPATION]

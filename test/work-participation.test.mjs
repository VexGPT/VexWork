import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createWorkParticipationLedger,
  summarizeWorkParticipation,
  workParticipationTimeline,
} from '../src/core/work-participation.mjs';

const event = ({
  eventRef,
  engagementRef,
  workRef = 'work.test.task',
  participantRef = 'agent.vex',
  continuityRef = 'continuity.vexwork.flows',
  sessionRef,
  eventType,
  continuationOfEngagementRefOrNull = null,
  createdAt,
}) => ({
  schemaVersion: 'vexwork.work-engagement-event/v1',
  eventRef,
  engagementRef,
  workRef,
  participantRef,
  continuityRef,
  sessionRef,
  eventType,
  continuationOfEngagementRefOrNull,
  sourceRefs: ['test.work-participation'],
  createdAt,
});

function ledger(events = []) {
  return {
    schemaVersion: 'vexwork.work-participation-ledger/v1',
    ledgerRef: 'participation.test',
    events,
    sourceRefs: ['test.work-participation'],
    formedAt: '2026-10-22T07:30:00.000Z',
  };
}

test('fresh sessions increment thread/session participation while one continuity remains stable', () => {
  const events = [
    event({ eventRef: 'event.1.start', engagementRef: 'engagement.1', sessionRef: 'session.1', eventType: 'ENGAGED', createdAt: '2026-10-22T07:30:01.000Z' }),
    event({ eventRef: 'event.1.end', engagementRef: 'engagement.1', sessionRef: 'session.1', eventType: 'RELEASED', createdAt: '2026-10-22T07:40:00.000Z' }),
    event({ eventRef: 'event.2.start', engagementRef: 'engagement.2', sessionRef: 'session.2', eventType: 'ENGAGED', continuationOfEngagementRefOrNull: 'engagement.1', createdAt: '2026-10-22T07:41:00.000Z' }),
    event({ eventRef: 'event.2.end', engagementRef: 'engagement.2', sessionRef: 'session.2', eventType: 'RELEASED', createdAt: '2026-10-22T07:50:00.000Z' }),
    event({ eventRef: 'event.3.start', engagementRef: 'engagement.3', participantRef: 'agent.other', sessionRef: 'session.3', eventType: 'ENGAGED', continuationOfEngagementRefOrNull: 'engagement.2', createdAt: '2026-10-22T07:51:00.000Z' }),
  ];
  const accepted = createWorkParticipationLedger(ledger(events));
  const summary = summarizeWorkParticipation(accepted, ['work.test.task']);
  assert.equal(summary.engagementCount, 3);
  assert.equal(summary.sessionCount, 3);
  assert.equal(summary.participantCount, 2);
  assert.equal(summary.continuityCount, 1);
  assert.equal(summary.handoffCount, 2);
  assert.equal(summary.activeEngagementCount, 1);
  assert.deepEqual(summary.participantRefs, ['agent.other', 'agent.vex']);
  assert.equal(summary.coverage, 'EXPLICIT_ENGAGEMENT_EVENTS_ONLY');

  const timeline = workParticipationTimeline(accepted, 'work.test.task');
  assert.deepEqual(timeline.map((entry) => entry.ordinal), [1, 2, 3]);
  assert.deepEqual(timeline.map((entry) => entry.sessionRef), ['session.1', 'session.2', 'session.3']);
  assert.equal(timeline[2].active, true);
  assert.equal(timeline[2].continuationOfEngagementRefOrNull, 'engagement.2');
});

test('same session can touch multiple work items without inflating scope session count', () => {
  const accepted = createWorkParticipationLedger(ledger([
    event({ eventRef: 'event.task.start', engagementRef: 'engagement.task', workRef: 'work.test.task', sessionRef: 'session.1', eventType: 'ENGAGED', createdAt: '2026-10-22T07:30:01.000Z' }),
    event({ eventRef: 'event.other.start', engagementRef: 'engagement.other', workRef: 'work.test.other', sessionRef: 'session.1', eventType: 'ENGAGED', createdAt: '2026-10-22T07:31:00.000Z' }),
  ]));
  const summary = summarizeWorkParticipation(accepted, ['work.test.task', 'work.test.other']);
  assert.equal(summary.engagementCount, 2);
  assert.equal(summary.sessionCount, 1);
  assert.equal(summary.participantCount, 1);
});

test('release must bind the exact engagement identity', () => {
  assert.throws(() => createWorkParticipationLedger(ledger([
    event({ eventRef: 'event.release', engagementRef: 'engagement.missing', sessionRef: 'session.1', eventType: 'RELEASED', createdAt: '2026-10-22T07:30:01.000Z' }),
  ])), /release without ENGAGED/);

  assert.throws(() => createWorkParticipationLedger(ledger([
    event({ eventRef: 'event.start', engagementRef: 'engagement.1', sessionRef: 'session.1', eventType: 'ENGAGED', createdAt: '2026-10-22T07:30:01.000Z' }),
    event({ eventRef: 'event.end', engagementRef: 'engagement.1', participantRef: 'agent.other', sessionRef: 'session.1', eventType: 'RELEASED', createdAt: '2026-10-22T07:31:00.000Z' }),
  ])), /release participantRef mismatch/);
});

test('continuation handoff must stay on the same work and continuity while entering a new session', () => {
  const first = event({ eventRef: 'event.1', engagementRef: 'engagement.1', sessionRef: 'session.1', eventType: 'ENGAGED', createdAt: '2026-10-22T07:30:01.000Z' });

  assert.throws(() => createWorkParticipationLedger(ledger([
    first,
    event({ eventRef: 'event.2', engagementRef: 'engagement.2', workRef: 'work.test.other', sessionRef: 'session.2', eventType: 'ENGAGED', continuationOfEngagementRefOrNull: 'engagement.1', createdAt: '2026-10-22T07:31:00.000Z' }),
  ])), /continuation predecessor workRef mismatch/);

  assert.throws(() => createWorkParticipationLedger(ledger([
    first,
    event({ eventRef: 'event.2', engagementRef: 'engagement.2', continuityRef: 'continuity.other', sessionRef: 'session.2', eventType: 'ENGAGED', continuationOfEngagementRefOrNull: 'engagement.1', createdAt: '2026-10-22T07:31:00.000Z' }),
  ])), /continuation predecessor continuityRef mismatch/);

  assert.throws(() => createWorkParticipationLedger(ledger([
    first,
    event({ eventRef: 'event.2', engagementRef: 'engagement.2', sessionRef: 'session.1', eventType: 'ENGAGED', continuationOfEngagementRefOrNull: 'engagement.1', createdAt: '2026-10-22T07:31:00.000Z' }),
  ])), /distinct sessionRef/);
});

test('participation history is chronological, fingerprinted and no-effects', () => {
  const accepted = createWorkParticipationLedger(ledger([
    event({ eventRef: 'event.1', engagementRef: 'engagement.1', sessionRef: 'session.1', eventType: 'ENGAGED', createdAt: '2026-10-22T07:30:02.000Z' }),
  ]));
  const summary = summarizeWorkParticipation(accepted, ['work.test.task']);
  assert.equal(summary.effects, false);
  assert.equal(summary.executionAuthority, 'NONE');

  assert.throws(() => createWorkParticipationLedger(ledger([
    event({ eventRef: 'event.2', engagementRef: 'engagement.2', sessionRef: 'session.2', eventType: 'ENGAGED', createdAt: '2026-10-22T07:31:00.000Z' }),
    event({ eventRef: 'event.1', engagementRef: 'engagement.1', sessionRef: 'session.1', eventType: 'ENGAGED', createdAt: '2026-10-22T07:30:00.000Z' }),
  ])), /must be chronological/);

  assert.throws(() => createWorkParticipationLedger({
    ...accepted,
    sourceRefs: ['tampered'],
  }), /semanticFingerprint mismatch/);
});

test('empty ledger reports zero participation rather than inventing an assignee', () => {
  const accepted = createWorkParticipationLedger(ledger([]));
  const summary = summarizeWorkParticipation(accepted, ['work.test.task']);
  assert.equal(summary.engagementCount, 0);
  assert.equal(summary.sessionCount, 0);
  assert.equal(summary.participantCount, 0);
  assert.equal(summary.activeEngagementCount, 0);
  assert.equal(summary.latestEventRefOrNull, null);
});

// [VXG RealForever][VEXWORK][WORK-PARTICIPATION]

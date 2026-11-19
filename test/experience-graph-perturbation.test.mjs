import assert from 'node:assert/strict';
import test from 'node:test';

import { ANSWER_STATES, PERTURBATION_CLASSES, PERTURBATION_EVIDENCE_SCHEMA, derivePerturbations } from '../src/core/experience-graph-perturbation.mjs';
import { fixtureGraph } from './fixtures/experience-graph/graph.mjs';

const byRef = (result) => Object.fromEntries(result.questions.map((row) => [row.perturbationRef, row]));

test('perturbations are generated from in-flight topology, and Family law answers what it decides', () => {
  const result = derivePerturbations(fixtureGraph());
  assert.deepEqual(Object.keys(result.counts), PERTURBATION_CLASSES);
  assert.deepEqual(Object.keys(result.answers), ANSWER_STATES);
  const rows = byRef(result);

  const reentry = rows['perturbation:REENTRY:VexLifeDictationFamily:Ready+Start'];
  assert.equal(reentry.inFlightState, 'VexLifeDictationFamily.Requesting');
  assert.equal(reentry.answerState, 'EXPECTED_FROM_LAW');
  assert.match(reentry.expected, /rejects Start in Requesting: no admitted State, no Effect/);
  assert.equal(reentry.proofClass, 'A');

  const interrupt = rows['perturbation:INTERRUPT:VexLifeDictationFamily:Ready+Start:Stop'];
  assert.equal(interrupt.answerState, 'UNKNOWN');
  assert.match(interrupt.expected, /ADMIT -> Stopping \+ EndDictation; what happens to the in-flight BeginDictation is owned by its realization/);

  const sibling = rows['perturbation:SIBLING_CONTROL:VexLifeDictationFamily:Requesting+Stop:Start'];
  assert.equal(sibling.inFlightState, 'VexLifeDictationFamily.Stopping');
  assert.equal(sibling.answerState, 'EXPECTED_FROM_LAW');

  const doubleEngage = rows['perturbation:REENTRY:VexLifeSightFamily:Ready+Engage'];
  assert.equal(doubleEngage.answerState, 'UNKNOWN', 'STAY + same Effect again is a realization question');
  assert.ok(!rows['perturbation:SIBLING_CONTROL:VexLifeSightFamily:Ready+Engage:Stop'], 'a refused Control in an unchanged State is just the negative case');
  assert.ok(rows['perturbation:INTERRUPT:VexLifeQuietFamily:Kept:concurrent:Begin+Clear'], 'two lawful Controls in one State form one concurrency question');
  assert.ok(!rows['perturbation:INTERRUPT:VexLifeQuietFamily:Kept+Clear:Begin']);
});

test('stale observations are generated only for outside truth the in-flight Effect realization returns', () => {
  const result = derivePerturbations(fixtureGraph());
  const stale = result.questions.filter((row) => row.consideration === 'STALE_OBSERVATION').map((row) => row.perturbationRef);
  assert.deepEqual(stale, [
    'perturbation:STALE_OBSERVATION:VexLifeDictationFamily:Requesting:Stop:observeFailure:Failed',
    'perturbation:STALE_OBSERVATION:VexLifeDictationFamily:Requesting:Stop:observeStarted:Listening',
  ]);
  const started = byRef(result)[stale[1]];
  assert.equal(started.newerState, 'VexLifeDictationFamily.Stopping');
  assert.equal(started.lateSuccessor, 'VexLifeDictationFamily.Listening');
  assert.deepEqual(started.realizationSites, ['VexLifeWebRuntimeArtifacts']);
  assert.match(started.expected, /Family law cannot fence it; the realization owner must/);
});

test('axis busy guards, Send capture law and idempotency identity generate their own considerations', () => {
  const rows = byRef(derivePerturbations(fixtureGraph()));
  const busy = rows['perturbation:SIBLING_CONTROL:VexLifeStockFamily:Download:while:downloading'];
  assert.equal(busy.answerState, 'EXPECTED_FROM_LAW');
  assert.match(busy.expected, /requires !downloading/);
  assert.ok(!Object.keys(rows).some((ref) => ref.startsWith('perturbation:REENTRY:VexLifeStockFamily')), 'axis Families use busy axes, not State identity windows');

  const profile = rows['perturbation:CAPTURE_RACE:DirectCompanionTurn.Intent.contextProfile:VexLifeProfileStore'];
  assert.equal(profile.answerState, 'EXPECTED_FROM_LAW');
  assert.match(profile.expected, /source capture law: ".*next Send\."/);
  const reply = rows['perturbation:CAPTURE_RACE:DirectCompanionTurn.Intent.personContext:VexLifePersonSettingsStore'];
  assert.equal(reply.answerState, 'UNKNOWN');
  assert.match(reply.expected, /structural capture/);
  assert.equal(rows['perturbation:RETRY_IDEMPOTENCY:DirectCompanionTurn.Intent.idempotencyKey'].answerState, 'UNKNOWN');
  const result = derivePerturbations(fixtureGraph());
  assert.deepEqual(Object.keys(result.notGenerated), ['TEARDOWN', 'ORDERING']);
  assert.equal(result.counts.TEARDOWN, 0);
  assert.equal(result.counts.ORDERING, 0);
});

test('source-review evidence answers a question only while its source blob is current', () => {
  const graph = fixtureGraph();
  const ref = 'perturbation:STALE_OBSERVATION:VexLifeDictationFamily:Requesting:Stop:observeStarted:Listening';
  const evidence = (blobSha1) => ({
    schemaVersion: PERTURBATION_EVIDENCE_SCHEMA,
    answers: [{
      perturbationRef: ref,
      method: 'SOURCE_REVIEW',
      answer: 'FENCED — session generation',
      sourceRefs: ['repo.vexlife-prod:src/commonMain/kotlin/vexlife/web/VexLifeWebRuntimeArtifacts.kt:L1'],
      sourceFiles: [{ path: 'src/commonMain/kotlin/vexlife/web/VexLifeWebRuntimeArtifacts.kt', blobSha1 }],
      note: 'fixture',
    }],
  });
  const current = byRef(derivePerturbations(graph, { evidence: evidence('a'.repeat(40)) }))[ref];
  assert.equal(current.answerState, 'ANSWERED_BY_EVIDENCE');
  assert.equal(current.expected, 'FENCED — session generation');
  assert.equal(current.evidence.current, true);
  const stale = byRef(derivePerturbations(graph, { evidence: evidence('b'.repeat(40)) }))[ref];
  assert.equal(stale.answerState, 'STALE_EVIDENCE');
  assert.match(stale.expected, /Family law cannot fence it/, 'stale evidence does not replace the question');
  assert.equal(stale.evidence.current, false);
});

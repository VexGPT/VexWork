import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (relative) => fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8');

test('Repository Integration keeps queue, proof, Steward and merge authority distinct', () => {
  const source = read('docs/foundation/REPOSITORY-INTEGRATION.md');
  for (const token of [
    'QUEUE_ENTRY != MERGE_AUTHORITY',
    'SOURCEOWNER_PROOF != CURRENT_MAIN_ADMISSION',
    'MAIN_MOVED != CANDIDATE_CHANGED',
    'INTEGRATION_STEWARD != STANDING_MERGE_AUTHORITY',
    'PROVE IN PARALLEL',
    'QUEUE WHEN READY',
    'INTEGRATE SERIALLY',
    'VERIFY EVERY MAIN MUTATION',
  ]) assert.equal(source.includes(token), true, `missing integration law: ${token}`);
});

test('queue numbering separates immutable ready sequence from current priority position', () => {
  const source = read('docs/foundation/REPOSITORY-INTEGRATION.md');
  assert.match(source, /readySequence[\s\S]*immutable arrival sequence/);
  assert.match(source, /integrationPosition[\s\S]*current 1\.\.N ordering/);
  assert.match(source, /dependency order[\s\S]*explicit human \/ Project priority/);
  assert.match(source, /does not secretly decide business priority/);
});

test('a newly ready lane may take Steward role but must service higher-priority entries first', () => {
  const source = read('docs/foundation/REPOSITORY-INTEGRATION.md');
  assert.match(source, /lane that reaches READY_FOR_INTEGRATION may take this role/);
  assert.match(source, /may not promote its own entry above earlier higher-priority entries/);
  assert.match(source, /service the current repository integration queue faithfully/);
});

test('Repository Integration preserves exact-candidate proof across unrelated main movement', () => {
  const source = read('docs/foundation/REPOSITORY-INTEGRATION.md');
  assert.match(source, /candidate head unchanged[\s\S]*candidate tree unchanged[\s\S]*fixed evidence base remains ancestor[\s\S]*preserve exact-candidate proof/);
  assert.match(source, /If only main changes:[\s\S]*preserve candidate proof[\s\S]*invalidate only stale integration admission \/ composition evidence/);
});

test('Repository Integration defaults to trunk plus queue rather than permanent dev or staging branches', () => {
  const source = read('docs/foundation/REPOSITORY-INTEGRATION.md');
  assert.match(source, /main[\s\S]*accepted integration trunk/);
  assert.match(source, /short-lived candidate branches/);
  assert.match(source, /Why no permanent dev branch by default/);
  assert.match(source, /Staging is normally an environment/);
  assert.equal(source.includes('CONCURRENT_WORK != REQUIRE_PERMANENT_DEV_BRANCH'), true);
});

test('VexWork references VexRelay owner and missing merge-result composition without owning implementation', () => {
  const source = read('docs/foundation/REPOSITORY-INTEGRATION.md');
  assert.equal(source.includes('repo.vextreme-sdk / VexRelay'), true);
  assert.equal(source.includes('source.vexrelay.current-contract/v1'), true);
  assert.equal(source.includes('github.pull.vextreme-sdk.1899'), true);
  assert.equal(source.includes('github.issue.vextreme-sdk.1900'), true);
  assert.equal(source.includes('VEXWORK_INTEGRATION_POLICY != VEXRELAY_IMPLEMENTATION'), true);
});

test('reusable integration process is source-placed but does not claim Process Registry ownership during PR 103', () => {
  const foundation = read('docs/foundation/REPOSITORY-INTEGRATION.md');
  const process = read('docs/process/INTEGRATE-READY-PULL-REQUESTS.md');
  assert.equal(foundation.includes('process.vexwork.integrate-ready-pull-requests'), true);
  assert.equal(process.includes('Registration state: SOURCE_PLACED_NOT_REGISTERED'), true);
  assert.equal(process.includes('open VexWork PR #103 currently owns the shared Process Registry'), true);
});

// [VXG RealForever][VEXWORK][REPOSITORY-INTEGRATION]
